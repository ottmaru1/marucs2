import { Router } from 'express';
import multer from 'multer';
import { GoogleDriveFileManager } from '../google-drive-service';
import { z } from 'zod';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });
const fileManager = new GoogleDriveFileManager();

// Google Drive 파일 업로드 스키마
const uploadSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요"),
  description: z.string().optional(),
  category: z.string().min(1, "카테고리를 선택해주세요"),
  version: z.string().optional(),
  accountId: z.string().min(1, "Google Drive 계정을 선택해주세요"),
});

/**
 * Google Drive 파일 업로드 엔드포인트
 */
router.post('/google-drive', upload.single('file'), async (req, res) => {
  try {
    console.log('🔍 Google Drive 파일 업로드 요청');
    console.log('Body:', req.body);
    console.log('File:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'No file');

    // 파일 검증
    if (!req.file) {
      return res.status(400).json({ error: "파일을 선택해주세요" });
    }

    // 요청 데이터 검증
    const validation = uploadSchema.safeParse(req.body);
    if (!validation.success) {
      const errorMessages = validation.error.errors.map(err => err.message).join(', ');
      return res.status(400).json({ error: errorMessages });
    }

    const { title, description, category, version, accountId } = validation.data;

    // Google Drive 계정 정보 조회
    const { storage } = req.app.locals;
    const account = await storage.getGoogleDriveAccountById(accountId);
    
    if (!account || !account.isActive) {
      return res.status(400).json({ error: "유효하지 않은 Google Drive 계정입니다" });
    }

    console.log(`📤 Google Drive 업로드 시작: ${account.email}`);

    // Google Drive에 파일 업로드
    const driveFile = await fileManager.uploadFile(
      account.accessToken,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    console.log('✅ Google Drive 업로드 성공:', driveFile.id);

    // 다른 모든 활성 계정에 백업 업로드 (비동기)
    const allAccounts = await storage.getGoogleDriveAccounts();
    const otherAccounts = allAccounts.filter((acc: any) => acc.id !== accountId && acc.isActive);
    
    if (otherAccounts.length > 0) {
      console.log(`🔄 백업 업로드 시작: ${otherAccounts.length}개 계정`);
      
      // 백업 업로드를 비동기로 실행 (메인 응답을 지연시키지 않음)
      Promise.all(
        otherAccounts.map(async (account: any) => {
          try {
            console.log(`📂 백업 업로드: ${account.email}`);
            const backupFile = await googleDriveFileManager.uploadFile(
              account.accessToken,
              req.file!.buffer,
              req.file!.originalname, // [BACKUP] 접두사 제거
              req.file!.mimetype
            );
            console.log(`✅ 백업 완료: ${account.email} (${backupFile.id})`);
          } catch (backupError) {
            console.error(`❌ 백업 실패 (${account.email}):`, backupError);
          }
        })
      ).catch(error => {
        console.error('백업 업로드 오류:', error);
      });
    }

    // 데이터베이스에 다운로드 정보 저장
    const downloadData = {
      title,
      description: description || "",
      category,
      version: version || "",
      fileName: req.file.originalname,
      fileSize: req.file.size,
      filePath: driveFile.webViewLink || "", // Google Drive 링크
      downloadUrl: driveFile.webContentLink || driveFile.webViewLink || "", // 다운로드 링크
      googleDriveFileId: driveFile.id,
      googleDriveAccountId: accountId,
      sortOrder: 0
    };

    const download = await storage.createDownload(downloadData);

    console.log('💾 데이터베이스 저장 완료:', download.id);

    res.json({
      success: true,
      download,
      googleDriveInfo: {
        fileId: driveFile.id,
        fileName: driveFile.name,
        size: driveFile.size,
        mimeType: driveFile.mimeType,
        webViewLink: driveFile.webViewLink,
        webContentLink: driveFile.webContentLink
      }
    });

  } catch (error) {
    console.error('❌ Google Drive 업로드 오류:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : "Google Drive 업로드에 실패했습니다" 
    });
  }
});

export default router;