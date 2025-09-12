import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertInquirySchema, insertDownloadSchema, insertGoogleDriveAccountSchema, insertGoogleDriveFileSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import express from "express";
import session from "express-session";
import { googleDriveOAuth, googleDriveFileManager, encryptToken, decryptToken, GoogleDriveOAuthManager } from "./google-drive-service.js";
import fs from 'fs';
import path from 'path';

// Extend session data type
declare module 'express-session' {
  interface SessionData {
    isAdmin?: boolean;
  }
}

// Multer setup for file uploads with proper filename handling
const upload = multer({ 
  storage: multer.memoryStorage(), // Google Drive 업로드를 위해 메모리 저장소 사용
  fileFilter: (req, file, cb) => {
    // Ensure proper UTF-8 encoding for Korean filenames
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, true);
  }
});

// 기존 로컬 파일 업로드용 multer 설정 (호환성 유지)
const localUpload = multer({ 
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, true);
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // 콜백 엔드포인트를 맨 먼저 등록 - 중요!
  console.log("🟢 Registering Google OAuth callback endpoint");
  app.get("/api/auth/google/callback", async (req, res) => {
    console.log("=== Google OAuth Callback (EARLY) ===");
    console.log("Query params:", req.query);
    console.log("=========================================");
    
    try {
      const { code, state: accountName, error } = req.query;

      if (error) {
        return res.redirect(`/admin?error=${encodeURIComponent("구글 인증이 취소되었습니다")}`);
      }

      if (!code || !accountName) {
        return res.redirect(`/admin?error=${encodeURIComponent("인증 정보가 부족합니다")}`);
      }

      // 인증 코드를 토큰으로 교환
      const tokenData = await googleDriveOAuth.exchangeCodeForTokens(code as string, accountName as string);
      
      // 기존 계정이 있는지 확인
      const existingAccount = await storage.getGoogleDriveAccountByEmail(tokenData.email);
      
      if (existingAccount) {
        // 기존 계정의 토큰 업데이트
        const tokenUpdateData: any = {
          accessToken: encryptToken(tokenData.accessToken)
        };
        
        if (tokenData.refreshToken) {
          tokenUpdateData.refreshToken = encryptToken(tokenData.refreshToken);
        }
        if (tokenData.expiryDate) {
          tokenUpdateData.tokenExpiresAt = tokenData.expiryDate;
        }
        
        await storage.updateGoogleDriveAccount(existingAccount.id, tokenUpdateData);
        return res.redirect(`/admin?success=${encodeURIComponent("계정이 성공적으로 업데이트되었습니다")}`);
      } else {
        // 새 계정 저장
        const accountData = {
          accountName: tokenData.accountName,
          email: tokenData.email,
          scopes: ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
          accessToken: encryptToken(tokenData.accessToken),
          refreshToken: tokenData.refreshToken ? encryptToken(tokenData.refreshToken) : null,
          tokenExpiresAt: tokenData.expiryDate,
          isActive: true,
          isDefault: false,
          profilePicture: tokenData.profilePicture
        };

        await storage.createGoogleDriveAccount(accountData);
        return res.redirect(`/admin?success=${encodeURIComponent("구글 드라이브 계정이 성공적으로 추가되었습니다")}`);
      }
    } catch (error) {
      console.error("OAuth callback error:", error);
      return res.redirect(`/admin?error=${encodeURIComponent("인증 처리 중 오류가 발생했습니다")}`);
    }
  });

  // Express 앱 설정 확인
  console.log("🟢 Registering middleware and routes");
  
  // 모든 API 요청 로깅 - 외부 접근 디버깅
  app.use('/api', (req, res, next) => {
    console.log(`🔍 API Request: ${req.method} ${req.originalUrl}`);
    console.log("Headers:", req.headers);
    console.log("Query:", req.query);
    next();
  });

  // Session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'marucomsys-admin-session',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Admin authentication routes (must be before middleware)
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { password } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      

      
      if (password === adminPassword) {
        // Set session
        req.session.isAdmin = true;
        res.json({ success: true, message: "로그인 성공" });
      } else {
        res.status(401).send("비밀번호가 올바르지 않습니다");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).send("로그인 중 오류가 발생했습니다");
    }
  });

  app.post("/api/admin/logout", async (req, res) => {
    try {
      req.session.isAdmin = false;
      res.json({ success: true, message: "로그아웃 성공" });
    } catch (error) {
      console.error("Admin logout error:", error);
      res.status(500).send("로그아웃 중 오류가 발생했습니다");
    }
  });

  app.get("/api/admin/auth-status", async (req, res) => {
    try {
      res.json({ authenticated: !!req.session.isAdmin });
    } catch (error) {
      console.error("Auth status check error:", error);
      res.status(500).send("인증 상태 확인 중 오류가 발생했습니다");
    }
  });

  app.post("/api/admin/change-password", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.session.isAdmin) {
        return res.status(401).send("관리자 권한이 필요합니다");
      }

      const { currentPassword, newPassword } = req.body;
      const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
      
      // Verify current password
      if (currentPassword !== adminPassword) {
        return res.status(400).send("현재 비밀번호가 올바르지 않습니다");
      }

      // Validate new password
      if (!newPassword || newPassword.length < 4) {
        return res.status(400).send("새 비밀번호는 최소 4자 이상이어야 합니다");
      }

      // In production, you would save this to a secure storage or update environment variable
      // For now, we'll suggest using environment variables
      res.json({ 
        success: true, 
        message: "비밀번호 변경을 위해 ADMIN_PASSWORD 환경변수를 업데이트해주세요",
        newPassword: newPassword 
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).send("비밀번호 변경 중 오류가 발생했습니다");
    }
  });

  // Admin middleware for protecting admin routes
  const requireAdmin = (req: any, res: any, next: any) => {
    if (req.session.isAdmin) {
      next();
    } else {
      res.status(401).send("관리자 권한이 필요합니다");
    }
  };

  // Contact form submission (public)
  app.post("/api/inquiries", async (req, res) => {
    try {
      const inquiryData = insertInquirySchema.parse(req.body);
      const inquiry = await storage.createInquiry(inquiryData);
      res.json({ success: true, inquiry });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "유효하지 않은 데이터입니다.",
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          message: "문의 접수 중 오류가 발생했습니다." 
        });
      }
    }
  });

  // Get all inquiries (for admin purposes)
  app.get("/api/inquiries", requireAdmin, async (req, res) => {
    try {
      const inquiries = await storage.getInquiries();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: "문의 목록을 불러오는 중 오류가 발생했습니다." 
      });
    }
  });

  // 🔍 디버깅: MaruCS-Sync 폴더 조사 API
  app.get('/api/debug/marucs-folder', async (req, res) => {
    try {      
      // 기본 계정 정보 조회
      const accounts = await storage.getGoogleDriveAccounts();
      const primaryAccount = accounts.find((acc: any) => acc.isPrimary && acc.isActive);
      
      if (!primaryAccount) {
        return res.status(404).json({ error: "기본 계정을 찾을 수 없습니다" });
      }
      
      console.log(`🔍 기본 계정 조사 시작: ${primaryAccount.email}`);
      
      // 모든 파일 조회
      const allFiles = await googleDriveFileManager.listFiles(primaryAccount.accessToken!, 200);
      console.log(`📂 전체 파일 수: ${allFiles.length}`);
      
      // MaruCS-Sync 폴더 찾기
      const marucsSyncFolder = allFiles.find((file: any) => 
        file.name === 'MaruCS-Sync' && file.mimeType === 'application/vnd.google-apps.folder'
      );
      
      if (!marucsSyncFolder) {
        return res.json({
          primaryAccount: primaryAccount.email,
          totalFiles: allFiles.length,
          marucsSyncFolder: null,
          message: "MaruCS-Sync 폴더를 찾을 수 없습니다"
        });
      }
      
      console.log(`📁 MaruCS-Sync 폴더 발견: ${marucsSyncFolder.id}`);
      
      // MaruCS-Sync 폴더 내용 조회
      const folderContents = await googleDriveFileManager.listFolderContents(
        primaryAccount.accessToken!,
        marucsSyncFolder.id!
      );
      
      // 하위 폴더들과 파일들 분류
      const subFolders = folderContents.filter((item: any) => 
        item.mimeType === 'application/vnd.google-apps.folder'
      );
      const files = folderContents.filter((item: any) => 
        item.mimeType !== 'application/vnd.google-apps.folder'
      );
      
      console.log(`📂 하위 폴더 수: ${subFolders.length}`);
      console.log(`📄 파일 수: ${files.length}`);
      
      // 각 하위 폴더의 내용도 조회
      const subFolderDetails = [];
      for (const folder of subFolders) {
        try {
          const subFolderContents = await googleDriveFileManager.listFolderContents(
            primaryAccount.accessToken!,
            folder.id!
          );
          subFolderDetails.push({
            name: folder.name,
            id: folder.id,
            fileCount: subFolderContents.length,
            files: subFolderContents.map(f => ({
              name: f.name,
              id: f.id,
              size: f.size,
              createdTime: f.createdTime
            }))
          });
          console.log(`📁 ${folder.name} 폴더: ${subFolderContents.length}개 파일`);
        } catch (error) {
          console.log(`⚠️ ${folder.name} 폴더 조회 실패: ${error.message}`);
          subFolderDetails.push({
            name: folder.name,
            id: folder.id,
            error: error.message
          });
        }
      }
      
      const result = {
        primaryAccount: primaryAccount.email,
        totalFiles: allFiles.length,
        marucsSyncFolder: {
          name: marucsSyncFolder.name,
          id: marucsSyncFolder.id,
          totalItems: folderContents.length,
          subFolders: subFolders.map(f => ({ name: f.name, id: f.id })),
          directFiles: files.map(f => ({ name: f.name, id: f.id, size: f.size })),
          subFolderDetails: subFolderDetails
        }
      };
      
      res.json(result);
      
    } catch (error) {
      console.error('❌ MaruCS-Sync 폴더 조사 오류:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "폴더 조사에 실패했습니다" 
      });
    }
  });

  // Downloads routes
  app.get("/api/downloads", async (req, res) => {
    try {
      const downloads = await storage.getDownloads();
      res.json(downloads);
    } catch (error) {
      console.error("Error fetching downloads:", error);
      res.status(500).json({ error: "Failed to fetch downloads" });
    }
  });

  // Update download sort order (protected)
  app.put("/api/downloads/:id/sort", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { direction } = req.body;
      
      if (!direction || !['up', 'down'].includes(direction)) {
        return res.status(400).json({ error: "direction이 필요합니다 (up 또는 down)" });
      }

      // Get all downloads sorted by sortOrder
      const allDownloads = await storage.getDownloads();
      const currentIndex = allDownloads.findIndex(d => d.id === id);
      
      if (currentIndex === -1) {
        return res.status(404).json({ error: "다운로드를 찾을 수 없습니다" });
      }

      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= allDownloads.length) {
        return res.status(400).json({ error: "더 이상 이동할 수 없습니다" });
      }

      const currentItem = allDownloads[currentIndex];
      const targetItem = allDownloads[targetIndex];

      // Swap sort orders
      await storage.updateDownload(currentItem.id, { sortOrder: targetItem.sortOrder || 0 });
      await storage.updateDownload(targetItem.id, { sortOrder: currentItem.sortOrder || 0 });

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating sort order:", error);
      res.status(500).json({ error: "정렬 순서 업데이트에 실패했습니다" });
    }
  });

  // Update download


  // Increment download count

  // 서버의 백업 파일 목록 조회 API
  app.get("/api/server-backup-files", requireAdmin, async (req, res) => {
    try {
      const backupFiles = [];
      const backupExtensions = ['.tar.gz', '.zip', '.7z', '.rar'];
      const backupPatterns = [
        /.*\.tar\.gz$/,
        /.*\.zip$/,
        /.*\.7z$/,
        /.*\.rar$/,
        /.*-merged$/,                    // merged 파일
        /.*\.split.*$/,                  // split 파일
        /.*\.part\d+$/,                  // part 파일 (part1, part2 등)
        /.*-split-.*/,                   // split 패턴 파일들
        /.*backup.*-a[a-z]$/,           // split -d 로 생성된 파일 (aa, ab, ac 등)
        /.*\.\d{3}$/,                   // 숫자 확장자 (001, 002 등)
        /.*backup.*$/                    // 모든 backup 관련 파일
      ];
      
      // 현재 디렉토리에서 백업 파일들 찾기
      const files = fs.readdirSync('.').filter(file => {
        return backupPatterns.some(pattern => pattern.test(file));
      });
      
      for (const fileName of files) {
        const filePath = `./${fileName}`;
        if (fs.existsSync(filePath)) {
          const stats = fs.statSync(filePath);
          
          // 2GB 이하 파일만 포함 (Google Drive 업로드 안정성 고려)
          if (stats.size <= 2 * 1024 * 1024 * 1024) {
            backupFiles.push({
              name: fileName,
              path: filePath,
              size: `${(stats.size / 1024 / 1024).toFixed(2)}MB`,
              sizeBytes: stats.size,
              modified: stats.mtime.toLocaleDateString('ko-KR'),
              modifiedTime: stats.mtime
            });
          }
        }
      }
      
      // 최신 파일 순으로 정렬
      backupFiles.sort((a, b) => new Date(b.modifiedTime).getTime() - new Date(a.modifiedTime).getTime());
      
      res.json({ 
        success: true, 
        files: backupFiles,
        count: backupFiles.length 
      });
    } catch (error) {
      console.error("백업 파일 목록 조회 오류:", error);
      res.status(500).json({ 
        error: "백업 파일 목록 조회에 실패했습니다", 
        details: error instanceof Error ? error.message : "알 수 없는 오류"
      });
    }
  });

  // 웹에서 백업 파일 업로드 엔드포인트 (멀티파트 폼 데이터)
  app.post("/api/google-drive/upload-backup-file", requireAdmin, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "파일이 업로드되지 않았습니다" });
      }

      const file = req.file;
      const fileName = file.originalname;
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      
      console.log(`📁 웹 백업 파일 업로드 시작: ${fileName} (${fileSizeMB}MB)`);
      
      // 1GB 이상 파일은 업로드하지 않음
      if (file.size > 1024 * 1024 * 1024) {
        console.log(`⚠️  파일 크기 제한: ${fileName} (${fileSizeMB}MB > 1024MB)`);
        return res.status(400).json({ 
          error: "파일이 너무 큽니다",
          details: `파일 크기: ${fileSizeMB}MB (최대: 1024MB)`
        });
      }
      
      // 활성 Google Drive 계정 조회
      const accounts = await storage.getGoogleDriveAccounts();
      const defaultAccount = accounts.find(acc => acc.isDefault && acc.isActive);
      
      if (!defaultAccount) {
        return res.status(400).json({ error: "활성 Google Drive 계정이 없습니다" });
      }
      
      // 토큰 유효성 검사 및 갱신
      if (!defaultAccount.accessToken || !defaultAccount.tokenExpiresAt || 
          new Date(defaultAccount.tokenExpiresAt || 0) <= new Date(Date.now() + 5 * 60 * 1000)) {
        console.log(`🔄 토큰 갱신: ${defaultAccount.email}`);
        if (!defaultAccount.refreshToken) {
          return res.status(401).json({ error: "리프레시 토큰이 없습니다. 계정을 다시 연결해주세요." });
        }
        
        try {
          const oauthManager = new GoogleDriveOAuthManager();
          const refreshedAccount = await oauthManager.validateAndRefreshToken(defaultAccount);
          
          if (refreshedAccount.isTokenExpired) {
            return res.status(401).json({ error: "토큰 갱신에 실패했습니다" });
          }
          
          defaultAccount.accessToken = refreshedAccount.accessToken;
        } catch (error) {
          console.error('토큰 갱신 오류:', error);
          return res.status(401).json({ error: "토큰 갱신 중 오류가 발생했습니다" });
        }
        
        const refreshedAccounts = await storage.getGoogleDriveAccounts();
        const refreshedAccount = refreshedAccounts.find(acc => acc.id === defaultAccount.id);
        if (!refreshedAccount?.accessToken) {
          return res.status(401).json({ error: "토큰 갱신에 실패했습니다" });
        }
        defaultAccount.accessToken = refreshedAccount.accessToken;
      }
      
      // 백업 폴더 생성/확인 (현재 날짜로 생성)
      const today = new Date();
      const backupFolderName = `Replit-Backup-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      const files = await googleDriveFileManager.listFiles(defaultAccount.accessToken!, 200);
      
      let backupFolder = files.find(f => f.name === backupFolderName && f.mimeType === 'application/vnd.google-apps.folder');
      if (!backupFolder) {
        console.log(`📁 백업 폴더 생성: ${backupFolderName}`);
        backupFolder = await googleDriveFileManager.createFolder(defaultAccount.accessToken!, backupFolderName);
      }

      console.log(`⬆️  Google Drive 업로드 시작: ${fileName}`);
      
      // 파일 업로드
      const uploadResult = await googleDriveFileManager.uploadFile(
        defaultAccount.accessToken!,
        file.buffer,
        fileName,
        file.mimetype,
        backupFolder.id!
      );

      // Google Drive API는 성공 시 파일 객체를 반환하고, 실패 시 예외를 던집니다
      console.log(`✅ 업로드 성공: ${fileName} -> ${uploadResult.webViewLink}`);
      
      res.json({
        success: true,
        fileName: fileName,
        fileSize: fileSizeMB + 'MB',
        driveLink: uploadResult.webViewLink,
        message: `${fileName}이(가) 성공적으로 업로드되었습니다`
      });

    } catch (error) {
      console.error("웹 백업 파일 업로드 오류:", error);
      res.status(500).json({ 
        error: "업로드 실패", 
        details: error instanceof Error ? error.message : "알 수 없는 오류"
      });
    }
  });

  // 백업 파일 Google Drive 업로드 엔드포인트 (기존 - 로컬 파일용)
  app.post("/api/google-drive/upload-backup", requireAdmin, async (req, res) => {
    try {
      const { fileName, filePath, folderName } = req.body;
      
      if (!fileName || !filePath) {
        return res.status(400).json({ error: "파일명과 경로가 필요합니다" });
      }
      
      // 파일이 존재하는지 확인
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "파일을 찾을 수 없습니다" });
      }
      
      // 파일 정보 가져오기
      const fileStats = fs.statSync(filePath);
      const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);
      
      console.log(`📁 백업 파일 업로드 시작: ${fileName} (${fileSizeMB}MB)`);
      
      // 2GB 이상 파일은 업로드하지 않음 (백업용으로 제한 완화)
      if (fileStats.size > 2 * 1024 * 1024 * 1024) {
        console.log(`⚠️  파일 크기 제한: ${fileName} (${fileSizeMB}MB > 2048MB)`);
        return res.status(400).json({ 
          error: "파일이 너무 큽니다",
          details: `파일 크기: ${fileSizeMB}MB (최대: 2048MB)`
        });
      }
      
      // 활성 Google Drive 계정 조회 (백업 전용 - 활성 계정 우선 선택)
      const accounts = await storage.getGoogleDriveAccounts();
      
      // 1순위: 기본 계정 + 활성
      let defaultAccount = accounts.find(acc => acc.isDefault && acc.isActive);
      
      // 2순위: 가장 최신 활성 계정 (wooseonp@gmail.com)
      if (!defaultAccount) {
        defaultAccount = accounts
          .filter(acc => acc.isActive)
          .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
        
        console.log(`⚠️ 기본 계정이 없어서 최신 활성 계정 사용: ${defaultAccount?.email}`);
      }
      
      if (!defaultAccount) {
        return res.status(400).json({ error: "활성 Google Drive 계정이 없습니다" });
      }
      
      console.log(`🎯 백업에 사용할 계정: ${defaultAccount.email} (기본계정: ${defaultAccount.isDefault})`);
      console.log(`📊 전체 계정 상태:`, accounts.map(acc => `${acc.email}(활성:${acc.isActive},기본:${acc.isDefault})`));
      
      // 🔥 핵심 수정: 암호화된 토큰들을 복호화
      if (defaultAccount.accessToken) {
        defaultAccount.accessToken = decryptToken(defaultAccount.accessToken);
        console.log(`🔓 토큰 복호화 완료: ${defaultAccount.email} (길이: ${defaultAccount.accessToken.length})`);
      }
      if (defaultAccount.refreshToken) {
        defaultAccount.refreshToken = decryptToken(defaultAccount.refreshToken);
        console.log(`🔓 리프레시 토큰 복호화 완료: ${defaultAccount.email}`);
      }
      
      // 토큰 유효성 검사 및 갱신 (백업 전용 - 강화된 버전)
      console.log(`🔍 토큰 상태 확인: ${defaultAccount.email}`);
      console.log(`현재 토큰 만료 시간:`, defaultAccount.tokenExpiresAt);
      
      if (!defaultAccount.refreshToken) {
        return res.status(401).json({ 
          error: "리프레시 토큰이 없습니다. 계정을 다시 연결해주세요.",
          details: "Google Drive 계정 재인증이 필요합니다"
        });
      }
      
      // 백업 업로드 전에는 항상 토큰을 강제 갱신
      console.log(`🔄 백업 업로드를 위한 토큰 강제 갱신: ${defaultAccount.email}`);
      
      try {
        const oauthManager = new GoogleDriveOAuthManager();
        const refreshedAccount = await oauthManager.validateAndRefreshToken(defaultAccount);
        
        if (refreshedAccount.isTokenExpired) {
          return res.status(401).json({ 
            error: "토큰 갱신에 실패했습니다",
            details: "Google 계정 재인증이 필요할 수 있습니다"
          });
        }
        
        // 갱신된 토큰을 데이터베이스에 저장
        const tokenUpdateData = {
          accessToken: encryptToken(refreshedAccount.accessToken),
          tokenExpiresAt: refreshedAccount.tokenExpiresAt,
          updatedAt: new Date()
        };
        
        await storage.updateGoogleDriveAccountTokens(defaultAccount.id, tokenUpdateData);
        console.log(`✅ 토큰 갱신 완료 및 DB 저장: ${defaultAccount.email}`);
        
        // 메모리의 계정 정보도 업데이트 (복호화된 토큰으로 설정)
        defaultAccount.accessToken = refreshedAccount.accessToken;
        defaultAccount.tokenExpiresAt = refreshedAccount.tokenExpiresAt;
        
        console.log(`🔑 업로드에 사용할 토큰 길이: ${defaultAccount.accessToken?.length || 0}`);
        console.log(`⏰ 토큰 만료 시간: ${defaultAccount.tokenExpiresAt}`);
        
      } catch (error) {
        console.error('❌ 토큰 갱신 오류:', error);
        return res.status(401).json({ 
          error: "토큰 갱신 중 오류가 발생했습니다",
          details: error instanceof Error ? error.message : "알 수 없는 오류"
        });
      }
      
      // 백업 폴더 생성/확인 (현재 날짜로 생성)
      let backupFolderName;
      if (folderName) {
        backupFolderName = folderName;
      } else {
        const today = new Date();
        backupFolderName = `Replit-Backup-${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      }
      const files = await googleDriveFileManager.listFiles(defaultAccount.accessToken!, 200);
      
      let backupFolder = files.find(f => f.name === backupFolderName && f.mimeType === 'application/vnd.google-apps.folder');
      if (!backupFolder) {
        console.log(`📁 백업 폴더 생성: ${backupFolderName}`);
        backupFolder = await googleDriveFileManager.createFolder(defaultAccount.accessToken!, backupFolderName);
      }
      
      // 스트림으로 파일 업로드 (메모리에 전체 로드 안 함)
      const fileStream = fs.createReadStream(filePath);
      
      const uploadResult = await googleDriveFileManager.uploadFileStream(
        defaultAccount.accessToken!,
        fileStream,
        fileName,
        'application/octet-stream',
        fileStats.size,
        backupFolder?.id
      );
      
      console.log(`✅ 백업 파일 업로드 성공: ${fileName} → Google Drive`);
      
      res.json({
        success: true,
        fileName: fileName,
        fileSize: fileStats.size,
        webViewLink: uploadResult.webViewLink,
        downloadLink: uploadResult.webContentLink || uploadResult.webViewLink
      });
      
    } catch (error) {
      console.error("백업 파일 업로드 오류:", error);
      res.status(500).json({ 
        error: "백업 파일 업로드 중 오류가 발생했습니다",
        details: error.message 
      });
    }
  });

  // 계정 토큰 확인 엔드포인트 (디버깅용)
  app.post("/api/google-drive/check-token", requireAdmin, async (req, res) => {
    try {
      const { accountId } = req.body;
      
      if (!accountId) {
        return res.status(400).json({ error: "accountId가 필요합니다" });
      }

      const accounts = await storage.getGoogleDriveAccounts();
      const account = accounts.find(acc => acc.id === accountId);
      
      if (!account || !account.isActive) {
        return res.status(400).json({ error: "유효하지 않은 계정입니다" });
      }

      console.log(`🔍 ${account.email} (${accountId}) 토큰으로 실제 계정 정보 확인 중...`);
      
      // 실제 Google Drive API로 사용자 정보 확인
      const userInfo = await googleDriveFileManager.getUserInfo(account.accessToken!);
      
      console.log(`📋 실제 Google 계정 정보:`, {
        dbEmail: account.email,
        actualEmail: userInfo.email,
        actualName: userInfo.name,
        match: account.email === userInfo.email
      });
      
      res.json({
        success: true,
        dbAccount: account.email,
        actualAccount: userInfo.email,
        actualName: userInfo.name,
        tokensMatch: account.email === userInfo.email,
        accountId: accountId
      });
      
    } catch (error) {
      console.error('토큰 확인 오류:', error);
      res.status(500).json({ error: "토큰 확인에 실패했습니다" });
    }
  });

  // 특정 파일 확인 엔드포인트 (디버깅용)
  app.post("/api/google-drive/check-file", requireAdmin, async (req, res) => {
    try {
      const { accountId, fileId } = req.body;
      
      if (!accountId || !fileId) {
        return res.status(400).json({ error: "accountId와 fileId가 필요합니다" });
      }

      const accounts = await storage.getGoogleDriveAccounts();
      const account = accounts.find(acc => acc.id === accountId);
      
      if (!account || !account.isActive) {
        return res.status(400).json({ error: "유효하지 않은 계정입니다" });
      }

      console.log(`🔍 ${account.email}에서 파일 ${fileId} 확인 중...`);
      
      const fileInfo = await googleDriveFileManager.getFileInfo(account.accessToken!, fileId);
      
      if (!fileInfo) {
        return res.json({
          success: true,
          account: account.email,
          fileExists: false,
          message: "파일이 존재하지 않습니다"
        });
      }
      
      console.log(`📋 파일 정보:`, {
        id: fileInfo.id,
        name: fileInfo.name,
        size: fileInfo.size,
        parents: fileInfo.parents,
        webViewLink: fileInfo.webViewLink
      });
      
      res.json({
        success: true,
        account: account.email,
        fileExists: true,
        file: {
          id: fileInfo.id,
          name: fileInfo.name,
          size: fileInfo.size,
          parents: fileInfo.parents,
          webViewLink: fileInfo.webViewLink
        }
      });
      
    } catch (error) {
      console.error('파일 확인 오류:', error);
      res.status(500).json({ error: "파일 확인에 실패했습니다" });
    }
  });

  // 계정별 파일 목록 확인 엔드포인트 (디버깅용)
  app.post("/api/google-drive/check-files", requireAdmin, async (req, res) => {
    try {
      const { accountId } = req.body;
      
      if (!accountId) {
        return res.status(400).json({ error: "accountId가 필요합니다" });
      }

      const accounts = await storage.getGoogleDriveAccounts();
      const account = accounts.find(acc => acc.id === accountId);
      
      if (!account || !account.isActive) {
        return res.status(400).json({ error: "유효하지 않은 계정입니다" });
      }

      console.log(`🔍 ${account.email} 파일 목록 확인 중...`);
      
      const files = await googleDriveFileManager.listFiles(account.accessToken!, 200);
      
      // MaruCS-Sync 폴더 찾기
      const marucsFolder = files.find(f => f.name === "MaruCS-Sync" && f.mimeType === 'application/vnd.google-apps.folder');
      
      if (!marucsFolder) {
        return res.json({
          success: true,
          account: account.email,
          marucsFolderExists: false,
          files: []
        });
      }
      
      // MaruCS-Sync 하위 파일들 찾기
      const marucsFiles = files.filter(f => 
        f.parents && f.parents.includes(marucsFolder.id) &&
        f.mimeType !== 'application/vnd.google-apps.folder'
      );
      
      // 서브폴더들과 그 하위 파일들 찾기
      const subfolders = files.filter(f => 
        f.mimeType === 'application/vnd.google-apps.folder' &&
        f.parents && f.parents.includes(marucsFolder.id)
      );
      
      const subfolderFiles = {};
      for (const folder of subfolders) {
        const folderFiles = files.filter(f => 
          f.parents && f.parents.includes(folder.id!) &&
          f.mimeType !== 'application/vnd.google-apps.folder'
        );
        subfolderFiles[folder.name!] = folderFiles.map(f => ({
          name: f.name,
          size: f.size,
          id: f.id
        }));
      }
      
      console.log(`📁 ${account.email}: MaruCS-Sync 루트 ${marucsFiles.length}개, 서브폴더 ${subfolders.length}개`);
      
      res.json({
        success: true,
        account: account.email,
        marucsFolderExists: true,
        marucsFolderId: marucsFolder.id,
        rootFiles: marucsFiles.map(f => ({ name: f.name, size: f.size, id: f.id })),
        subfolders: subfolders.map(f => f.name),
        subfolderFiles
      });
      
    } catch (error) {
      console.error('파일 목록 확인 오류:', error);
      res.status(500).json({ error: "파일 목록 확인에 실패했습니다" });
    }
  });

  // Google Drive 파일 업로드 엔드포인트
  app.post("/api/downloads/google-drive", requireAdmin, upload.single('file'), async (req, res) => {
    try {
      console.log('🔍 Google Drive 파일 업로드 요청');
      console.log('Body:', req.body);
      console.log('File:', req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'No file');

      // 파일 검증
      if (!req.file) {
        return res.status(400).json({ error: "파일을 선택해주세요" });
      }

      // 요청 데이터 검증
      const { title, description, category, version, accountId } = req.body;
      
      if (!title || !category || !accountId) {
        return res.status(400).json({ error: "필수 정보가 누락되었습니다" });
      }

      // Google Drive 계정 정보 조회
      const accounts = await storage.getGoogleDriveAccounts();
      const account = accounts.find(acc => acc.id === accountId);
      
      if (!account || !account.isActive) {
        return res.status(400).json({ error: "유효하지 않은 Google Drive 계정입니다" });
      }

      console.log(`📤 Google Drive 업로드 시작: ${account.email}`);
      
      // 실제 토큰이 어떤 계정인지 검증
      try {
        const actualUserInfo = await googleDriveFileManager.getUserInfo(account.accessToken!);
        console.log(`🔍 계정 검증 결과:`, {
          dbAccount: account.email,
          actualAccount: actualUserInfo.email,
          tokensMatch: account.email === actualUserInfo.email
        });
        
        if (account.email !== actualUserInfo.email) {
          console.error(`❌ 토큰 불일치 감지: DB(${account.email}) vs 실제(${actualUserInfo.email})`);
        }
      } catch (error) {
        console.log(`⚠️ 계정 검증 실패: ${error.message}`);
      }

      // 🔧 MaruCS-Sync 폴더 구조 확인 및 업로드

      // 토큰 유효성 검사 및 갱신
      const isTokenValid = await googleDriveOAuth.validateToken(account.accessToken!);
      if (!isTokenValid) {
        console.log(`🔄 토큰 만료 감지, 갱신 시도: ${account.email}`);
        if (account.refreshToken) {
          try {
            const refreshed = await googleDriveOAuth.refreshAccessToken(account.refreshToken);
            const refreshUpdateData: any = {
              accessToken: encryptToken(refreshed.accessToken)
            };
            if (refreshed.expiryDate) {
              refreshUpdateData.tokenExpiresAt = refreshed.expiryDate;
            }
            
            await storage.updateGoogleDriveAccountTokens(account.id, refreshUpdateData);
            // 갱신된 토큰으로 업데이트
            account.accessToken = encryptToken(refreshed.accessToken);
            console.log(`✅ 토큰 갱신 완료: ${account.email}`);
          } catch (refreshError) {
            console.error(`❌ 토큰 갱신 실패: ${account.email}`, refreshError);
            return res.status(401).json({ error: "Google Drive 토큰이 만료되었습니다. 계정을 다시 연결해주세요." });
          }
        } else {
          return res.status(401).json({ error: "Google Drive 토큰이 만료되었습니다. 계정을 다시 연결해주세요." });
        }
      }

      // 1단계: 폴더 구조 확인 및 생성
      console.log(`📂 폴더 구조 확인 시작: ${account.email}`);
      const files = await googleDriveFileManager.listFiles(account.accessToken!, 200);
      console.log(`📂 기존 파일 ${files.length}개 발견`);
      
      // 메인 폴더 확인/생성
      let mainFolder = files.find(f => f.name === "MaruCS-Sync" && f.mimeType === 'application/vnd.google-apps.folder');
      if (!mainFolder) {
        console.log("📁 MaruCS-Sync 폴더 생성 중...");
        mainFolder = await googleDriveFileManager.createFolder(account.accessToken!, "MaruCS-Sync");
        console.log(`✅ 메인 폴더 생성: ${mainFolder?.id}`);
      } else {
        console.log(`📁 기존 메인 폴더 사용: ${mainFolder.id}`);
      }

      // 카테고리별 서브 폴더 확인/생성
      let targetFolderId = mainFolder?.id;
      const categoryFolderMap: { [key: string]: string } = {
        'streamplayer': 'StreamPlayer',
        'ott-plus': 'OTT PLUS', 
        'nohard': 'NoHard System',
        'manual': 'Manual',
        'other': 'Other'
      };
      
      const targetFolderName = categoryFolderMap[category] || 'other';
      console.log(`📁 카테고리 폴더 검색: ${targetFolderName}`);
      
      let categoryFolder = files.find(f => f.name === targetFolderName && f.mimeType === 'application/vnd.google-apps.folder');
      
      if (!categoryFolder && mainFolder?.id) {
        console.log(`📁 ${targetFolderName} 폴더 생성 중... (부모: ${mainFolder.id})`);
        categoryFolder = await googleDriveFileManager.createFolder(account.accessToken!, targetFolderName, mainFolder.id);
        console.log(`✅ 카테고리 폴더 생성: ${categoryFolder?.id}`);
      } else if (categoryFolder) {
        console.log(`📁 기존 카테고리 폴더 사용: ${categoryFolder.id}`);
      }
      
      if (categoryFolder?.id) {
        targetFolderId = categoryFolder.id;
      }
      
      console.log(`🎯 최종 업로드 대상 폴더 ID: ${targetFolderId}`);

      // 2단계: 메인 계정에 파일 업로드
      if (!req.file) {
        return res.status(400).json({ error: "파일이 필요합니다" });
      }
      
      const driveFile = await googleDriveFileManager.uploadFile(
        account.accessToken || '',
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        targetFolderId || undefined
      );

      console.log('✅ Google Drive 업로드 성공:', driveFile.id);
      
      // 업로드된 파일 정보 확인
      const uploadedFile = await googleDriveFileManager.getFileInfo(account.accessToken!, driveFile.id!);
      if (uploadedFile) {
        console.log('📋 업로드된 파일 확인:', {
          id: uploadedFile.id,
          name: uploadedFile.name,
          size: uploadedFile.size,
          parents: uploadedFile.parents,
          webViewLink: uploadedFile.webViewLink
        });
        
        // 📂 업로드 후 해당 폴더 내용 확인
        console.log(`📂 업로드 폴더 내용 확인 시작...`);
        try {
          const parentFolderId = uploadedFile.parents?.[0] || 'root';
          const folderFiles = await googleDriveFileManager.listFolderContents(
            account.accessToken!,
            parentFolderId
          );
          console.log(`📁 폴더 내 파일 목록 (${folderFiles.length}개):`, 
            folderFiles.map(f => ({ 
              name: f.name, 
              id: f.id, 
              size: f.size,
              isOurFile: f.id === driveFile.id
            }))
          );
          
          // 방금 업로드한 파일이 있는지 확인
          const uploadedFileInFolder = folderFiles.find(f => f.id === driveFile.id);
          if (uploadedFileInFolder) {
            console.log(`✅ 업로드 파일 폴더 내 확인됨: ${uploadedFileInFolder.name}`);
          } else {
            console.log(`❌ 업로드 파일이 예상 폴더에서 발견되지 않음`);
          }
          
          // 🔍 추가 진단: 파일의 실제 위치와 권한 정보 확인
          console.log(`🔍 업로드 파일 상세 정보 진단:`);
          console.log(`   - 파일 ID: ${driveFile.id}`);
          console.log(`   - 부모 폴더 ID: ${parentFolderId}`);
          console.log(`   - 예상 폴더 ID: ${targetFolderId}`);
          console.log(`   - 폴더 일치 여부: ${parentFolderId === targetFolderId}`);
          
          // 파일 권한 정보 확인
          try {
            const filePerms = await googleDriveFileManager.getFilePermissions(account.accessToken!, driveFile.id);
            console.log(`🔐 파일 권한 상태:`, filePerms);
          } catch (permError) {
            console.log(`⚠️ 권한 확인 실패:`, permError.message);
          }
          
        } catch (error) {
          console.log(`⚠️ 폴더 내용 확인 실패:`, error.message);
        }
      }

      // 3단계: 다른 활성 계정들에 백업 업로드
      const allAccounts = await storage.getGoogleDriveAccounts();
      const otherAccounts = allAccounts.filter(acc => acc.id !== accountId && acc.isActive);
      
      if (otherAccounts.length > 0) {
        console.log(`🔄 백업 업로드 시작: ${otherAccounts.length}개 계정`);
        
        // 백업 업로드를 비동기로 실행 (참고 코드 방식)
        Promise.all(
          otherAccounts.map(async (backupAccount) => {
          try {
            console.log(`📂 백업 업로드 시작: ${backupAccount.email}`);
            
            // 백업 계정 토큰 검증
            try {
              const actualUserInfo = await googleDriveFileManager.getUserInfo(backupAccount.accessToken!);
              console.log(`🔍 백업 계정 검증:`, {
                dbAccount: backupAccount.email,
                actualAccount: actualUserInfo.email,
                tokensMatch: backupAccount.email === actualUserInfo.email
              });
              
              if (backupAccount.email !== actualUserInfo.email) {
                console.error(`❌ 백업 계정 토큰 불일치: DB(${backupAccount.email}) vs 실제(${actualUserInfo.email})`);
              }
            } catch (error) {
              console.log(`⚠️ 백업 계정 검증 실패: ${error.message}`);
            }
            
            // 토큰 유효성 재확인
            const isBackupTokenValid = await googleDriveOAuth.validateToken(backupAccount.accessToken!);
            if (!isBackupTokenValid) {
              console.log(`❌ ${backupAccount.email} 토큰 만료됨, 건너뛰기`);
              return;
            }
            
            // 백업 계정의 폴더 구조 확인/생성
            const backupFiles = await googleDriveFileManager.listFiles(backupAccount.accessToken!, 200);
            console.log(`📂 ${backupAccount.email}: ${backupFiles.length}개 파일 확인`);
            
            let backupMainFolder = backupFiles.find(f => f.name === "MaruCS-Sync" && f.mimeType === 'application/vnd.google-apps.folder');
            if (!backupMainFolder) {
              console.log(`📁 ${backupAccount.email}: MaruCS-Sync 폴더 생성 중...`);
              backupMainFolder = await googleDriveFileManager.createFolder(backupAccount.accessToken!, "MaruCS-Sync");
              console.log(`✅ MaruCS-Sync 폴더 생성: ${backupMainFolder?.id}`);
            }
            
            // 카테고리 폴더 확인/생성
            let backupCategoryFolder = backupFiles.find(f => 
              f.name === targetFolderName && 
              f.mimeType === 'application/vnd.google-apps.folder' &&
              f.parents && f.parents.includes(backupMainFolder?.id!)
            );
            
            if (!backupCategoryFolder && backupMainFolder?.id) {
              console.log(`📁 ${backupAccount.email}: ${targetFolderName} 폴더 생성 중...`);
              backupCategoryFolder = await googleDriveFileManager.createFolder(backupAccount.accessToken!, targetFolderName, backupMainFolder.id);
              console.log(`✅ ${targetFolderName} 폴더 생성: ${backupCategoryFolder?.id}`);
            }
            
            // 백업 파일 업로드 (참고 코드 방식 적용)
            if (!req.file) {
              console.log(`❌ ${backupAccount.email}: 업로드할 파일이 없음`);
              return;
            }
            
            // 원본 파일명 그대로 사용 ([BACKUP] 접두사 제거)
            const backupFileName = req.file.originalname;
            console.log(`📤 ${backupAccount.email}: ${backupFileName} 업로드 시작 (${(req.file.size / 1024 / 1024).toFixed(2)}MB)`);
            
            const backupFile = await googleDriveFileManager.uploadFile(
              backupAccount.accessToken!,
              req.file.buffer,
              backupFileName,
              req.file.mimetype,
              backupCategoryFolder?.id || backupMainFolder?.id
            );
            
            if (backupFile?.id) {
              console.log(`📋 ${backupAccount.email}: 파일 업로드 성공 - ID: ${backupFile.id}`);
              
              // 파일 공개 설정
              await googleDriveFileManager.makeFilePublic(backupAccount.accessToken!, backupFile.id);
              console.log(`🌐 ${backupAccount.email}: 파일 공개 설정 완료`);
            }
            
            console.log(`✅ 백업 완료: ${backupFileName} → ${backupAccount.email}`);
            
          } catch (error) {
            console.error(`❌ 백업 실패 (${backupAccount.email}):`, error.message || error);
          }
        })
        ).catch(error => {
          console.error('백업 업로드 중 오류:', error);
        });
      }

      // Get the next sort order
      const downloads = await storage.getDownloads();
      const maxSortOrder = downloads.length > 0 ? Math.max(...downloads.map(d => d.sortOrder)) : 0;

      // 데이터베이스에 다운로드 정보 저장
      const downloadData = {
        title,
        description: description || "",
        category,
        version: version || "",
        fileName: req.file.originalname,
        fileSize: req.file.size || 0,
        fileType: req.file.mimetype,
        downloadUrl: driveFile.webContentLink || driveFile.webViewLink || "", // Google Drive 다운로드 링크
        sortOrder: maxSortOrder + 1,
        googleDriveFileId: driveFile.id,
        googleDriveAccountId: accountId,
      };

      const validatedData = insertDownloadSchema.parse(downloadData);
      const download = await storage.createDownload(validatedData);

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

  // 기존 로컬 파일 업로드 엔드포인트 (호환성 유지)
  app.post("/api/downloads", requireAdmin, localUpload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "파일이 필요합니다" });
      }

      // Get the next sort order
      const downloads = await storage.getDownloads();
      const maxSortOrder = downloads.length > 0 ? Math.max(...downloads.map(d => d.sortOrder)) : 0;
      
      const downloadData = {
        title: req.body.title,
        description: req.body.description,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype,
        downloadUrl: `/uploads/${req.file.filename}`,
        category: req.body.category,
        version: req.body.version,
        sortOrder: maxSortOrder + 1,
      };

      const validatedData = insertDownloadSchema.parse(downloadData);
      const download = await storage.createDownload(validatedData);
      res.json(download);
    } catch (error) {
      console.error("Error creating download:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid download data", details: error.errors });
      } else {
        res.status(500).json({ error: "Failed to create download" });
      }
    }
  });

  app.put("/api/downloads/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updated = await storage.updateDownload(id, updateData);
      res.json(updated);
    } catch (error) {
      console.error("Error updating download:", error);
      res.status(500).json({ error: "Failed to update download" });
    }
  });

  app.delete("/api/downloads/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteDownload(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting download:", error);
      res.status(500).json({ error: "Failed to delete download" });
    }
  });

  app.post("/api/downloads/:id/increment", async (req, res) => {
    try {
      const { id } = req.params;
      await storage.incrementDownloadCount(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error incrementing download count:", error);
      res.status(500).json({ error: "Failed to increment download count" });
    }
  });

  // Service Package routes for price management
  app.get("/api/service-packages", async (req, res) => {
    try {
      const packages = await storage.getServicePackages();
      res.json(packages);
    } catch (error) {
      console.error("Error fetching service packages:", error);
      res.status(500).json({ error: "서비스 패키지를 불러오는데 실패했습니다" });
    }
  });

  app.post("/api/service-packages", requireAdmin, async (req, res) => {
    try {
      const package_ = await storage.createServicePackage(req.body);
      res.json(package_);
    } catch (error) {
      console.error("Error creating service package:", error);
      res.status(500).json({ error: "서비스 패키지 생성에 실패했습니다" });
    }
  });

  app.put("/api/service-packages/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateServicePackage(id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating service package:", error);
      res.status(500).json({ error: "서비스 패키지 수정에 실패했습니다" });
    }
  });

  app.delete("/api/service-packages/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteServicePackage(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting service package:", error);
      res.status(500).json({ error: "서비스 패키지 삭제에 실패했습니다" });
    }
  });

  // StreamPlayer Options routes
  app.get("/api/streamplayer-options", async (req, res) => {
    try {
      const options = await storage.getStreamplayerOptions();
      res.json(options);
    } catch (error) {
      console.error("Error fetching streamplayer options:", error);
      res.status(500).json({ error: "스트림플레이어 옵션을 불러오는데 실패했습니다" });
    }
  });

  app.post("/api/streamplayer-options", requireAdmin, async (req, res) => {
    try {
      const option = await storage.createStreamplayerOption(req.body);
      res.json(option);
    } catch (error) {
      console.error("Error creating streamplayer option:", error);
      res.status(500).json({ error: "스트림플레이어 옵션 생성에 실패했습니다" });
    }
  });

  app.put("/api/streamplayer-options/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await storage.updateStreamplayerOption(id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating streamplayer option:", error);
      res.status(500).json({ error: "스트림플레이어 옵션 수정에 실패했습니다" });
    }
  });

  app.delete("/api/streamplayer-options/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteStreamplayerOption(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting streamplayer option:", error);
      res.status(500).json({ error: "스트림플레이어 옵션 삭제에 실패했습니다" });
    }
  });

  // Google Drive OAuth routes
  app.get("/api/auth/google/accounts", requireAdmin, async (req, res) => {
    try {
      const accounts = await storage.getGoogleDriveAccounts();
      // 토큰 정보는 제외하고 안전한 정보만 전송
      const safeAccounts = accounts.map(account => ({
        id: account.id,
        accountName: account.accountName,
        email: account.email,
        isActive: account.isActive,
        isDefault: account.isDefault,
        profilePicture: account.profilePicture,
        createdAt: account.createdAt,
        tokenExpired: account.tokenExpiresAt ? account.tokenExpiresAt < new Date() : true
      }));
      res.json(safeAccounts);
    } catch (error) {
      console.error("Error fetching Google Drive accounts:", error);
      res.status(500).json({ error: "구글 드라이브 계정을 불러오는데 실패했습니다" });
    }
  });

  app.post("/api/auth/google/authorize", requireAdmin, async (req, res) => {
    try {
      const { accountName } = req.body;
      if (!accountName) {
        return res.status(400).json({ error: "계정 이름이 필요합니다" });
      }
      
      const authUrl = googleDriveOAuth.generateAuthUrl(accountName);
      res.json({ authUrl });
    } catch (error) {
      console.error("Error generating auth URL:", error);
      res.status(500).json({ error: "인증 URL 생성에 실패했습니다" });
    }
  });

  // 콜백 엔드포인트 - 먼저 등록
  // 중복된 콜백 엔드포인트 제거됨 - 위에서 이미 등록함

  // Reauth Google Drive account
  // Google Drive 계정 재인증
  app.post("/api/auth/google/accounts/:id/reauth", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // 계정 정보 조회
      const account = await storage.getGoogleDriveAccount(id);
      if (!account) {
        return res.status(404).json({ error: "계정을 찾을 수 없습니다" });
      }
      
      // 재인증 URL 생성 (계정 이름을 state로 사용)
      const authUrl = googleDriveOAuth.generateAuthUrl(account.accountName);
      res.json({ authUrl });
    } catch (error) {
      console.error("Error generating reauth URL:", error);
      res.status(500).json({ error: "재인증 URL 생성에 실패했습니다" });
    }
  });

  // Google Drive 토큰 자동 갱신
  app.post("/api/google-drive/refresh-tokens", requireAdmin, async (req, res) => {
    try {
      const accounts = await storage.getGoogleDriveAccounts();
      const results = [];
      
      for (const account of accounts) {
        if (!account.isActive) {
          results.push({
            email: account.email,
            status: 'skipped',
            message: '비활성화된 계정'
          });
          continue;
        }

        try {
          const refreshedAccount = await googleDriveOAuth.validateAndRefreshToken(account);
          
          if (refreshedAccount.isTokenExpired) {
            results.push({
              email: account.email,
              status: 'failed',
              message: '토큰 갱신 실패 - 재인증 필요'
            });
          } else if (refreshedAccount.accessToken !== account.accessToken) {
            // 토큰이 갱신되었으면 데이터베이스 업데이트
            await storage.updateGoogleDriveAccountTokens(account.id, {
              accessToken: refreshedAccount.accessToken,
              tokenExpiresAt: refreshedAccount.expiryDate || undefined
            });
            
            results.push({
              email: account.email,
              status: 'refreshed',
              message: '토큰 갱신 완료'
            });
          } else {
            results.push({
              email: account.email,
              status: 'valid',
              message: '토큰이 유효함'
            });
          }
        } catch (error) {
          results.push({
            email: account.email,
            status: 'error',
            message: error instanceof Error ? error.message : '알 수 없는 오류'
          });
        }
      }
      
      const refreshedCount = results.filter(r => r.status === 'refreshed').length;
      const failedCount = results.filter(r => r.status === 'failed' || r.status === 'error').length;
      
      res.json({
        success: true,
        message: `${refreshedCount}개 계정 토큰 갱신, ${failedCount}개 계정 실패`,
        results
      });
    } catch (error) {
      console.error('토큰 갱신 오류:', error);
      res.status(500).json({ error: "토큰 갱신 중 오류가 발생했습니다" });
    }
  });

  app.put("/api/auth/google/accounts/:id/set-default", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { force } = req.query; // 강제 변경 플래그
      
      // 계정 존재 확인
      const account = await storage.getGoogleDriveAccount(id);
      if (!account) {
        return res.status(404).json({ error: "계정을 찾을 수 없습니다" });
      }

      // 기존 기본 계정 확인
      const accounts = await storage.getGoogleDriveAccounts();
      const currentDefault = accounts.find(acc => acc.isDefault);
      
      if (currentDefault && currentDefault.id !== id && force !== 'true') {
        // 동기화 필요 경고
        const downloads = await storage.getDownloads();
        const defaultAccountFiles = downloads.filter(d => d.googleDriveAccountId === currentDefault.id).length;
        
        return res.status(409).json({ 
          error: "기본 계정 변경 전 동기화가 필요합니다",
          needsSync: true,
          currentDefault: currentDefault.email,
          newDefault: account.email,
          fileCount: defaultAccountFiles,
          message: `현재 기본 계정 ${currentDefault.email}에 ${defaultAccountFiles}개 파일이 있습니다. 동기화 후 변경하거나 강제 변경하시겠습니까?`
        });
      }

      // 기본 계정 설정
      await storage.setDefaultGoogleDriveAccount(id);
      
      res.json({ 
        success: true, 
        message: "기본 계정이 설정되었습니다",
        newDefault: account.email,
        forced: force === 'true'
      });
    } catch (error) {
      console.error('기본 계정 설정 오류:', error);
      res.status(500).json({ error: "기본 계정 설정에 실패했습니다" });
    }
  });

  // Activate Google Drive account
  app.put("/api/auth/google/accounts/:id/activate", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // 계정 존재 확인
      const account = await storage.getGoogleDriveAccount(id);
      if (!account) {
        return res.status(404).json({ error: "계정을 찾을 수 없습니다" });
      }
      
      await storage.updateGoogleDriveAccount(id, { isActive: true });
      res.json({ success: true, message: "계정이 활성화되었습니다", email: account.email });
    } catch (error) {
      console.error("Error activating Google Drive account:", error);
      res.status(500).json({ error: "계정 활성화에 실패했습니다" });
    }
  });

  // Deactivate Google Drive account
  app.put("/api/auth/google/accounts/:id/deactivate", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // 계정 존재 확인
      const account = await storage.getGoogleDriveAccount(id);
      if (!account) {
        return res.status(404).json({ error: "계정을 찾을 수 없습니다" });
      }
      
      // 기본 계정은 비활성화할 수 없음
      if (account.isDefault) {
        return res.status(400).json({ error: "기본 계정은 비활성화할 수 없습니다" });
      }
      
      await storage.updateGoogleDriveAccount(id, { isActive: false });
      res.json({ success: true, message: "계정이 비활성화되었습니다", email: account.email });
    } catch (error) {
      console.error("Error deactivating Google Drive account:", error);
      res.status(500).json({ error: "계정 비활성화에 실패했습니다" });
    }
  });

  // Toggle Google Drive account status (활성/비활성) - Legacy support
  app.put("/api/auth/google/accounts/:id/toggle-status", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { isActive } = req.body;
      
      console.log(`🔄 계정 상태 변경: ${id} -> ${isActive ? '활성' : '비활성'}`);
      
      // 계정 상태 업데이트
      await storage.updateGoogleDriveAccountStatus(id, isActive);
      
      res.json({ 
        success: true, 
        message: `계정이 ${isActive ? '활성화' : '비활성화'}되었습니다` 
      });
    } catch (error) {
      console.error("Error toggling account status:", error);
      res.status(500).json({ error: "계정 상태 변경에 실패했습니다" });
    }
  });

  app.delete("/api/auth/google/accounts/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // 계정 정보 조회
      const account = await storage.getGoogleDriveAccount(id);
      if (!account) {
        return res.status(404).json({ error: "계정을 찾을 수 없습니다" });
      }

      // 구글에서 토큰 해지 (선택사항)
      if (account.accessToken) {
        try {
          await googleDriveOAuth.revokeToken(account.accessToken);
        } catch (revokeError) {
          console.warn("Token revocation failed:", revokeError);
        }
      }

      // 데이터베이스에서 계정 삭제
      await storage.deleteGoogleDriveAccount(id);
      res.json({ success: true, message: "계정이 성공적으로 삭제되었습니다" });
    } catch (error) {
      console.error("Error deleting Google Drive account:", error);
      res.status(500).json({ error: "계정 삭제에 실패했습니다" });
    }
  });

  // Google Drive File Management routes
  app.post("/api/google-drive/upload", requireAdmin, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "파일이 없습니다" });
      }

      const { category, title, description } = req.body;
      
      // 기본 구글 드라이브 계정 가져오기
      const defaultAccount = await storage.getDefaultGoogleDriveAccount();
      if (!defaultAccount || !defaultAccount.accessToken) {
        return res.status(400).json({ error: "구글 드라이브 계정이 연결되지 않았습니다" });
      }

      // 토큰 유효성 검사
      const isValid = await googleDriveOAuth.validateToken(defaultAccount.accessToken);
      if (!isValid) {
        // 토큰 갱신 시도
        if (defaultAccount.refreshToken) {
          try {
            const refreshed = await googleDriveOAuth.refreshAccessToken(defaultAccount.refreshToken);
            const refreshUpdateData: any = {
              accessToken: encryptToken(refreshed.accessToken)
            };
            if (refreshed.expiryDate) {
              refreshUpdateData.tokenExpiresAt = refreshed.expiryDate;
            }
            
            await storage.updateGoogleDriveAccountTokens(defaultAccount.id, refreshUpdateData);
            // 갱신된 계정 정보 다시 가져오기
            const updatedAccount = await storage.getGoogleDriveAccount(defaultAccount.id);
            if (updatedAccount) {
              defaultAccount.accessToken = updatedAccount.accessToken;
            }
          } catch (refreshError) {
            return res.status(401).json({ error: "구글 드라이브 토큰이 만료되었습니다. 다시 인증해주세요" });
          }
        } else {
          return res.status(401).json({ error: "구글 드라이브 토큰이 만료되었습니다. 다시 인증해주세요" });
        }
      }

      console.log(`📤 파일 업로드 시작: ${req.file.originalname} -> ${defaultAccount.email}`);

      // 1단계: 기본 계정의 폴더 구조 확인 및 생성
      const files = await googleDriveFileManager.listFiles(defaultAccount.accessToken!, 200);
      
      // 메인 폴더 확인/생성
      let mainFolder = files.find(f => f.name === "MaruCS-Sync" && f.mimeType === 'application/vnd.google-apps.folder');
      if (!mainFolder) {
        console.log("📁 MaruCS-Sync 폴더 생성 중...");
        mainFolder = await googleDriveFileManager.createFolder(defaultAccount.accessToken!, "MaruCS-Sync");
      }

      // 카테고리별 서브 폴더 확인/생성
      let targetFolderId = mainFolder?.id;
      const categoryFolderMap: { [key: string]: string } = {
        'streamplayer': 'StreamPlayer',
        'ott-plus': 'OTT PLUS', 
        'nohard': 'NoHard System',
        'manual': 'Manual',
        'other': 'Other'
      };
      
      const targetFolderName = categoryFolderMap[category] || 'other';
      let categoryFolder = files.find(f => f.name === targetFolderName && f.mimeType === 'application/vnd.google-apps.folder');
      
      if (!categoryFolder && mainFolder?.id) {
        console.log(`📁 ${targetFolderName} 폴더 생성 중...`);
        categoryFolder = await googleDriveFileManager.createFolder(defaultAccount.accessToken!, targetFolderName, mainFolder.id);
      }
      
      if (categoryFolder?.id) {
        targetFolderId = categoryFolder.id;
      }

      // 2단계: 기본 계정에 파일 업로드
      const fs = require('fs');
      const fileBuffer = fs.readFileSync(req.file.path);
      
      if (!req.file) {
        return res.status(400).json({ error: "파일이 필요합니다" });
      }
      
      const driveFile = await googleDriveFileManager.uploadFile(
        defaultAccount.accessToken || '',
        fileBuffer,
        req.file.originalname || 'unknown',
        req.file.mimetype || 'application/octet-stream',
        targetFolderId || undefined
      );

      console.log(`✅ 기본 계정 업로드 완료: ${driveFile.id}`);

      // 공개 설정
      if (driveFile.id) {
        await googleDriveFileManager.makeFilePublic(defaultAccount.accessToken || '', driveFile.id);
      }

      // 3단계: 다른 활성 계정들에 백업 업로드
      const allAccounts = await storage.getGoogleDriveAccounts();
      const otherAccounts = allAccounts.filter(acc => acc.id !== defaultAccount.id && acc.isActive);
      
      if (otherAccounts.length > 0) {
        console.log(`🔄 백업 업로드 시작: ${otherAccounts.length}개 계정`);
        
        // 백업 업로드를 비동기로 실행
        Promise.all(
          otherAccounts.map(async (account) => {
            try {
              console.log(`📂 백업 업로드: ${account.email}`);
              
              // 백업 계정의 폴더 구조 확인/생성
              const backupFiles = await googleDriveFileManager.listFiles(account.accessToken!, 200);
              
              let backupMainFolder = backupFiles.find(f => f.name === "MaruCS-Sync" && f.mimeType === 'application/vnd.google-apps.folder');
              if (!backupMainFolder) {
                backupMainFolder = await googleDriveFileManager.createFolder(account.accessToken!, "MaruCS-Sync");
              }
              
              let backupCategoryFolder = backupFiles.find(f => f.name === targetFolderName && f.mimeType === 'application/vnd.google-apps.folder');
              if (!backupCategoryFolder && backupMainFolder?.id) {
                backupCategoryFolder = await googleDriveFileManager.createFolder(account.accessToken!, targetFolderName, backupMainFolder.id);
              }
              
              // 파일 업로드
              if (!req.file) return;
              
              const backupFile = await googleDriveFileManager.uploadFile(
                account.accessToken!,
                fileBuffer,
                req.file.originalname || 'unknown',
                req.file.mimetype || 'application/octet-stream',
                backupCategoryFolder?.id || undefined
              );
              
              if (backupFile.id) {
                await googleDriveFileManager.makeFilePublic(account.accessToken!, backupFile.id);
              }
              
              console.log(`✅ 백업 완료: ${req.file.originalname} → ${account.email}`);
            } catch (error) {
              console.error(`❌ 백업 실패 (${account.email}):`, error);
            }
          })
        ).catch(error => {
          console.error("백업 업로드 중 오류:", error);
        });
      }

      // 4단계: 데이터베이스에 파일 정보 저장
      const savedFile = await storage.createGoogleDriveFile({
        driveAccountId: defaultAccount.id,
        driveFileId: driveFile.id || '',
        fileName: title || req.file.originalname || 'unknown',
        originalName: req.file.originalname || 'unknown',
        fileSize: req.file.size,
        mimeType: req.file.mimetype || 'application/octet-stream',
        webViewLink: driveFile.webViewLink || '',
        webContentLink: driveFile.webContentLink || '',
        category: category || 'other',
        isPublic: true
      });

      // 임시 파일 삭제
      fs.unlinkSync(req.file.path);

      console.log(`🎉 업로드 완료: ${req.file.originalname}`);
      res.json({
        ...savedFile,
        backupStatus: `${otherAccounts.length}개 계정에 백업 진행 중`
      });
    } catch (error) {
      console.error("Error uploading to Google Drive:", error);
      res.status(500).json({ error: "구글 드라이브 업로드에 실패했습니다" });
    }
  });

  // 특정 계정의 Google Drive 파일 목록 조회 (임시 디버깅용)
  app.get("/api/google-drive/files/:email", async (req, res) => {
    try {
      const email = req.params.email;
      const accounts = await storage.getGoogleDriveAccounts();
      const account = accounts.find(acc => acc.email === email);
      
      if (!account || !account.accessToken) {
        return res.status(404).json({ error: `계정을 찾을 수 없습니다: ${email}` });
      }

      const files = await googleDriveFileManager.listFiles(account.accessToken, 200);
      
      // MaruCS-Sync 폴더 및 하위 구조 분석
      const marucsFolder = files.find(f => f.name === "MaruCS-Sync" && f.mimeType === 'application/vnd.google-apps.folder');
      const report = {
        email: email,
        totalFiles: files.length,
        marucsFolder: marucsFolder || null,
        marucsSubfolders: [],
        marucsFiles: [],
        rootFiles: files.filter(f => !f.parents || f.parents.length === 0).length
      };

      if (marucsFolder && marucsFolder.id) {
        // MaruCS-Sync의 직계 자식들
        const directChildren = files.filter(f => 
          f.parents && f.parents.includes(marucsFolder.id!)
        );
        
        report.marucsSubfolders = directChildren.filter(f => 
          f.mimeType === 'application/vnd.google-apps.folder'
        ).map(f => ({ name: f.name, id: f.id }));
        
        report.marucsFiles = directChildren.filter(f => 
          f.mimeType !== 'application/vnd.google-apps.folder'
        ).map(f => ({ name: f.name, size: f.size, id: f.id }));

        // 각 서브폴더의 파일들도 확인
        for (const subfolder of report.marucsSubfolders) {
          const subfolderFiles = files.filter(f => 
            f.parents && f.parents.includes(subfolder.id)
          );
          (subfolder as any).files = subfolderFiles.map(f => ({ 
            name: f.name, 
            size: f.size 
          }));
          (subfolder as any).fileCount = subfolderFiles.length;
        }
      }

      res.json(report);
    } catch (error) {
      console.error(`파일 목록 조회 오류 (${req.params.email}):`, error);
      res.status(500).json({ error: "파일 목록 조회에 실패했습니다" });
    }
  });

  app.get("/api/google-drive/files", async (req, res) => {
    try {
      const { category } = req.query;
      
      let files;
      if (category) {
        files = await storage.getGoogleDriveFilesByCategory(category as string);
      } else {
        files = await storage.getGoogleDriveFiles();
      }
      
      res.json(files);
    } catch (error) {
      console.error("Error fetching Google Drive files:", error);
      res.status(500).json({ error: "구글 드라이브 파일을 불러오는데 실패했습니다" });
    }
  });

  app.delete("/api/google-drive/files/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // 파일 정보 조회
      const file = await storage.getGoogleDriveFiles();
      const targetFile = file.find(f => f.id === id);
      
      if (!targetFile) {
        return res.status(404).json({ error: "파일을 찾을 수 없습니다" });
      }

      // 구글 드라이브 계정 정보 조회
      const account = await storage.getGoogleDriveAccount(targetFile.driveAccountId);
      if (account && account.accessToken) {
        // 구글 드라이브에서 파일 삭제
        try {
          await googleDriveFileManager.deleteFile(account.accessToken, targetFile.driveFileId);
        } catch (driveError) {
          console.warn("Drive file deletion failed:", driveError);
        }
      }

      // 데이터베이스에서 파일 정보 삭제
      await storage.deleteGoogleDriveFile(id);
      res.json({ success: true, message: "파일이 성공적으로 삭제되었습니다" });
    } catch (error) {
      console.error("Error deleting Google Drive file:", error);
      res.status(500).json({ error: "파일 삭제에 실패했습니다" });
    }
  });

  // 기존 파일을 Google Drive로 마이그레이션
  app.post('/api/downloads/:id/migrate-to-drive', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { accountId } = req.body;

      if (!accountId) {
        return res.status(400).json({ error: "Google Drive 계정 ID가 필요합니다" });
      }

      // 다운로드 정보 조회
      const downloads = await storage.getDownloads();
      const download = downloads.find(d => d.id === id);
      if (!download) {
        return res.status(404).json({ error: "다운로드를 찾을 수 없습니다" });
      }

      // 이미 Google Drive에 있는 파일인지 확인
      if (download.googleDriveFileId) {
        return res.status(400).json({ error: "이미 Google Drive에 업로드된 파일입니다" });
      }

      // Google Drive 계정 조회
      const account = await storage.getGoogleDriveAccount(accountId);
      if (!account || !account.isActive) {
        return res.status(400).json({ error: "유효하지 않은 Google Drive 계정입니다" });
      }

      // 토큰이 만료된 경우 새로 고침 시도
      let accessToken = account.accessToken;
      if (account.refreshToken) {
        try {
          const refreshedTokens = await googleDriveOAuth.refreshAccessToken(account.refreshToken);
          if (refreshedTokens.accessToken) {
            accessToken = encryptToken(refreshedTokens.accessToken);
            console.log(`🔄 토큰 새로 고침 완료: ${account.email}`);
          }
        } catch (refreshError) {
          console.error('토큰 새로 고침 실패:', refreshError);
          return res.status(401).json({ error: "Google Drive 토큰이 만료되었습니다. 계정을 다시 연결해주세요." });
        }
      }

      // 로컬 파일 읽기
      const filePath = path.join(process.cwd(), download.downloadUrl);
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "로컬 파일을 찾을 수 없습니다" });
      }

      const fileBuffer = fs.readFileSync(filePath);

      // Google Drive에 업로드 (새로 고침된 토큰 사용)
      const uploadedFile = await googleDriveFileManager.uploadFile(
        accessToken!,
        fileBuffer,
        download.fileName,
        download.fileType || 'application/octet-stream'
      );
      
      // 파일을 공개로 설정
      if (uploadedFile.id) {
        await googleDriveFileManager.makeFilePublic(accessToken!, uploadedFile.id);
      }

      // 데이터베이스 업데이트
      const updatedDownload = await storage.updateDownload(id, {
        googleDriveFileId: uploadedFile.id || '',
        googleDriveAccountId: accountId
      });

      console.log(`✅ 파일 마이그레이션 완료: ${download.fileName} -> Google Drive`);

      res.json({
        success: true,
        download: updatedDownload,
        googleDriveInfo: {
          fileId: uploadedFile.id || '',
          fileName: uploadedFile.name || download.fileName,
          webViewLink: uploadedFile.webViewLink || `https://drive.google.com/file/d/${uploadedFile.id}/view`
        }
      });

    } catch (error) {
      console.error('❌ 파일 마이그레이션 오류:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "파일 마이그레이션에 실패했습니다" 
      });
    }
  });

  // Google Drive download endpoint
  app.get("/api/downloads/:id/download", async (req, res) => {
    try {
      const { id } = req.params;
      
      // 다운로드 정보 조회
      const downloads = await storage.getDownloads();
      const download = downloads.find(d => d.id === id);
      if (!download) {
        return res.status(404).json({ error: "파일을 찾을 수 없습니다" });
      }
      
      // Google Drive 파일이 있는 경우
      if (download.googleDriveFileId && download.googleDriveAccountId) {
        // Google Drive 계정 정보 조회
        let account = await storage.getGoogleDriveAccount(download.googleDriveAccountId);
        if (!account || !account.accessToken) {
          return res.status(400).json({ error: "Google Drive 계정 정보를 찾을 수 없습니다" });
        }
        
        // 자동 토큰 갱신 (만료 5분 전부터)
        const refreshedAccount = await googleDriveOAuth.validateAndRefreshToken(account);
        if (refreshedAccount.isTokenExpired) {
          console.error('토큰 갱신 실패, 다른 계정으로 폴백 시도');
        } else if (refreshedAccount.accessToken !== account.accessToken) {
          // 토큰이 갱신되었으면 데이터베이스 업데이트
          await storage.updateGoogleDriveAccountTokens(account.id, {
            accessToken: refreshedAccount.accessToken,
            tokenExpiresAt: refreshedAccount.expiryDate || refreshedAccount.tokenExpiresAt || undefined
          });
          console.log(`✅ 다운로드 전 토큰 자동 갱신 완료: ${account.email}`);
          account = refreshedAccount; // 갱신된 계정 정보 사용
        }
        
        // Google Drive API를 통해 파일 스트림 다운로드 (바이러스 스캔 페이지 우회)
        console.log(`🔗 Google Drive 다운로드: ${download.fileName} (${download.googleDriveFileId})`);
        
        try {
          // Google Drive API를 사용해서 파일 데이터 가져오기 (계정 정보 포함하여 재시도 가능)
          if (!account?.accessToken) {
            throw new Error('Access token not available');
          }
          
          const fileStream = await googleDriveFileManager.downloadFile(
            account.accessToken, 
            download.googleDriveFileId,
            account
          );
          
          // 응답 헤더 설정
          res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(download.fileName)}"`);
          res.setHeader('Content-Type', download.fileType || 'application/octet-stream');
          
          // 파일 스트림을 클라이언트로 전송
          fileStream.pipe(res);
          return;
        } catch (streamError) {
          console.error('Google Drive 스트림 다운로드 실패:', streamError);
          
          // 다른 계정에서 같은 파일을 찾아서 폴백 시도
          try {
            console.log(`🔄 폴백 시도: 다른 Google Drive 계정에서 파일 검색 중...`);
            const allAccounts = await storage.getGoogleDriveAccounts();
            const otherAccounts = allAccounts.filter(acc => acc.id !== download.googleDriveAccountId && acc.isActive);
            
            for (const account of otherAccounts) {
              try {
                console.log(`🔍 계정 ${account.email}에서 파일 검색 중...`);
                const files = await googleDriveFileManager.listFiles(account.accessToken!, 100);
                const matchingFile = files.find(file => 
                  file.name === download.fileName || 
                  file.name?.includes(download.fileName.split('.')[0])
                );
                
                if (matchingFile && matchingFile.id) {
                  console.log(`✅ 백업 파일 발견: ${matchingFile.name} (${account.email})`);
                  const backupStream = await googleDriveFileManager.downloadFile(account.accessToken!, matchingFile.id!);
                  
                  // 응답 헤더 설정
                  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(download.fileName)}"`);
                  res.setHeader('Content-Type', download.fileType || 'application/octet-stream');
                  
                  // 백업 파일 스트림을 클라이언트로 전송
                  backupStream.pipe(res);
                  return;
                }
              } catch (fallbackError) {
                console.error(`계정 ${account.email}에서 폴백 실패:`, fallbackError);
                continue;
              }
            }
            
            console.log('❌ 모든 계정에서 폴백 파일을 찾을 수 없음');
          } catch (fallbackSearchError) {
            console.error('폴백 검색 실패:', fallbackSearchError);
          }
          
          // 모든 폴백 시도 실패 시 기존 방식으로 리다이렉트
          const downloadUrl = `https://drive.google.com/uc?export=download&id=${download.googleDriveFileId}&confirm=t`;
          return res.redirect(downloadUrl);
        }
      }
      
      // 로컬 파일이 있는 경우 (기존 방식)
      const filePath = path.join(process.cwd(), download.downloadUrl);
      if (fs.existsSync(filePath)) {
        console.log(`📁 로컬 파일 다운로드: ${download.fileName}`);
        return res.download(filePath, download.fileName);
      }
      
      // 파일을 찾을 수 없음
      return res.status(404).json({ error: "파일을 찾을 수 없습니다" });
      
    } catch (error) {
      console.error('다운로드 오류:', error);
      res.status(500).json({ error: "다운로드에 실패했습니다" });
    }
  });

  // 카테고리별 폴더명 매핑 함수
  function getFolderNameByCategory(category: string): string | null {
    const folderMap: { [key: string]: string } = {
      'streamplayer': 'StreamPlayer',
      'ott-plus': 'OTT PLUS', 
      'nohard': 'NoHard System',
      'manual': 'Manual',
      'other': 'Other'
    };
    return folderMap[category] || null;
  }

  // 기본 계정 기준 파일 동기화
  app.post("/api/google-drive/synchronize", async (req, res) => {
    try {
      const accounts = await storage.getGoogleDriveAccounts();
      const defaultAccount = accounts.find(acc => acc.isDefault);
      
      if (!defaultAccount) {
        return res.status(400).json({ error: "기본 계정이 설정되지 않았습니다. 먼저 기본 계정을 설정해주세요." });
      }

      const otherAccounts = accounts.filter(acc => acc.id !== defaultAccount.id && acc.isActive);
      if (otherAccounts.length === 0) {
        return res.status(400).json({ error: "동기화할 추가 계정이 없습니다." });
      }

      const downloads = await storage.getDownloads();
      let totalSyncedFiles = 0;
      const results = [];

      console.log(`🎯 기본 계정 ${defaultAccount.email}에서 ${otherAccounts.length}개 계정으로 동기화 시작`);

      // OAuth 매니저 인스턴스 생성
      const oauthManager = new GoogleDriveOAuthManager();

      // 1단계: 모든 계정에 폴더 구조 생성
      const allAccounts = [defaultAccount, ...otherAccounts];
      for (const account of allAccounts) {
        try {
          console.log(`📁 ${account.email}에서 폴더 구조 생성 중...`);
          const files = await googleDriveFileManager.listFiles(account.accessToken!, 200);
          
          // 메인 폴더 확인/생성
          let mainFolder = files.find(f => f.name === "MaruCS-Sync" && f.mimeType === 'application/vnd.google-apps.folder');
          if (!mainFolder) {
            mainFolder = await googleDriveFileManager.createFolder(account.accessToken!, "MaruCS-Sync");
          }

          // 서브 폴더들 생성 (개선된 방식)
          const subFolderNames = ["StreamPlayer", "OTT PLUS", "NoHard System", "Manual", "Other"];
          for (const folderName of subFolderNames) {
            // MaruCS-Sync의 직계 하위 폴더에서만 검색
            const existingFolder = files.find(f => 
              f.name === folderName && 
              f.mimeType === 'application/vnd.google-apps.folder' &&
              f.parents && 
              f.parents.includes(mainFolder?.id!)
            );
            if (!existingFolder && mainFolder?.id) {
              console.log(`📁 ${folderName} 폴더 생성: ${account.email}`);
              const newFolder = await googleDriveFileManager.createFolder(account.accessToken!, folderName, mainFolder.id);
              console.log(`✅ ${folderName} 폴더 생성 완료: ${newFolder?.id || 'N/A'}`);
              // 새로 생성된 폴더를 files 배열에 추가 (나중에 매핑에서 찾을 수 있도록)
              if (newFolder) {
                files.push(newFolder);
              }
            } else if (existingFolder) {
              console.log(`📁 ${folderName} 폴더 이미 존재: ${account.email}`);
            }
          }
          
          console.log(`✅ ${account.email} 폴더 구조 생성 완료`);
        } catch (error) {
          console.error(`❌ ${account.email} 폴더 생성 실패:`, error);
        }
      }

      // 2단계: 기본 계정의 파일들을 다른 계정들에 동기화 (데이터베이스 기반 효율적 방식)
      try {
        console.log(`📦 기본 계정 ${defaultAccount.email}에서 파일 동기화 중...`);
        
        // ⭐ 핵심 개선: 데이터베이스에서 기본 계정의 파일들만 필터링 (효율적!)
        const sourceDownloads = downloads.filter(d => 
          d.googleDriveAccountId === defaultAccount.id && d.googleDriveFileId
        );
        
        console.log(`🎯 DB에서 ${defaultAccount.email} 계정의 동기화 대상 파일 ${sourceDownloads.length}개 발견`);
        
        if (sourceDownloads.length === 0) {
          console.log(`⚠️ 기본 계정에 동기화할 파일이 없습니다.`);
          return res.status(400).json({ error: "기본 계정에 동기화할 파일이 없습니다." });
        }
        
        // 한 번만 기본 계정의 파일 목록 가져오기 (최적화)
        const sourceFiles = await googleDriveFileManager.listFiles(defaultAccount.accessToken!, 200);
        console.log(`📂 Google Drive에서 ${sourceFiles.length}개 파일/폴더 확인`);
        
        for (const targetAccount of otherAccounts) {
          try {
            console.log(`🔄 ${defaultAccount.email} → ${targetAccount.email} 동기화 중...`);
            
            // 타겟 계정의 폴더 구조 가져오기
            const targetFiles = await googleDriveFileManager.listFiles(targetAccount.accessToken!, 200);
            const targetMainFolder = targetFiles.find(f => f.name === "MaruCS-Sync" && f.mimeType === 'application/vnd.google-apps.folder');
            if (!targetMainFolder) {
              console.log(`⚠️ ${targetAccount.email}에 MaruCS-Sync 폴더가 없습니다. 건너뜁니다.`);
              continue;
            }
            
            // ⭐ 서브폴더 매핑 (MaruCS-Sync 하위 폴더만) - 핵심 수정!
            const folderMap: any = {};
            const subFolderNames = ["StreamPlayer", "OTT PLUS", "NoHard System", "Manual", "Other"];
            
            // MaruCS-Sync의 직계 자식 폴더들만 찾기
            const marucsSubfolders = targetFiles.filter(f => 
              f.mimeType === 'application/vnd.google-apps.folder' &&
              f.parents && 
              f.parents.includes(targetMainFolder.id!)
            );
            
            console.log(`📂 ${targetAccount.email}에서 MaruCS-Sync 하위 폴더 ${marucsSubfolders.length}개 발견:`);
            for (const folder of marucsSubfolders) {
              console.log(`   📁 ${folder.name} (${folder.id})`);
              if (subFolderNames.includes(folder.name)) {
                folderMap[folder.name] = folder.id;
              }
            }
            
            console.log(`🗺️ 폴더 매핑 완료:`, Object.keys(folderMap));

            // ⭐ 핵심 개선: 데이터베이스 파일들만 동기화 (훨씬 효율적!)
            for (const download of sourceDownloads) {
              const sourceFile = sourceFiles.find(f => f.id === download.googleDriveFileId);
              
              if (!sourceFile) {
                console.log(`⚠️ Google Drive에서 파일을 찾을 수 없음: ${download.fileName}`);
                continue;
              }
              
              try {
                console.log(`🚀 동기화 시작: ${sourceFile.name} (카테고리: ${download.category})`);
                // ⭐ 완전 수정된 중복 검사: MaruCS-Sync 및 하위 폴더 전체 검사
                const allMarucsFiles = [];
                
                // MaruCS-Sync 루트 파일들
                const rootFiles = targetFiles.filter(f => 
                  f.parents && f.parents.includes(targetMainFolder.id!) &&
                  f.mimeType !== 'application/vnd.google-apps.folder'
                );
                allMarucsFiles.push(...rootFiles);
                
                // MaruCS-Sync 하위 폴더들의 파일들
                for (const subfolder of marucsSubfolders) {
                  const subfolderFiles = targetFiles.filter(f => 
                    f.parents && f.parents.includes(subfolder.id!) &&
                    f.mimeType !== 'application/vnd.google-apps.folder'
                  );
                  allMarucsFiles.push(...subfolderFiles);
                }
                
                console.log(`🔍 ${targetAccount.email}에서 MaruCS-Sync 전체 파일 ${allMarucsFiles.length}개 검사 중...`);
                const existingFile = allMarucsFiles.find(f => f.name === sourceFile.name);
                if (existingFile) {
                  const parentFolderName = existingFile.parents ? 
                    targetFiles.find(pf => pf.id === existingFile.parents[0])?.name || 'unknown' : 'root';
                  
                  // ⭐ 파일이 루트에 있으면 적절한 서브폴더로 이동
                  if (parentFolderName === 'MaruCS-Sync') {
                    const categoryFolderName = getFolderNameByCategory(download.category);
                    if (categoryFolderName && folderMap[categoryFolderName]) {
                      console.log(`📂 기존 파일을 서브폴더로 이동: ${sourceFile.name} → ${categoryFolderName}`);
                      try {
                        await googleDriveFileManager.moveFileToFolder(
                          targetAccount.accessToken!,
                          existingFile.id!,
                          folderMap[categoryFolderName]
                        );
                        console.log(`✅ 파일 이동 완료: ${sourceFile.name} → ${targetAccount.email}/${categoryFolderName}`);
                        totalSyncedFiles++;
                      } catch (moveError) {
                        console.error(`❌ 파일 이동 실패: ${sourceFile.name}`, moveError);
                      }
                    }
                  } else {
                    console.log(`⏭️ 건너뛰기: ${sourceFile.name} (${targetAccount.email}의 ${parentFolderName}에 이미 정리됨)`);
                  }
                  continue;
                }
                
                console.log(`✅ 새 파일 확인: ${sourceFile.name} (중복 없음)`);                
                
                console.log(`📤 파일 복사 중: ${sourceFile.name} → ${targetAccount.email} (원본은 ${defaultAccount.email}에 그대로 유지)`);
                
                // 토큰 갱신 확인
                const refreshedAccount = await oauthManager.validateAndRefreshToken(targetAccount);
                if (refreshedAccount.isTokenExpired) {
                  console.log(`❌ ${targetAccount.email} 토큰 만료로 건너뛰기`);
                  continue;
                }
                
                if (refreshedAccount.accessToken !== targetAccount.accessToken) {
                  targetAccount.accessToken = refreshedAccount.accessToken;
                }

                // ⭐ 개선된 스트림 처리: 청크 단위로 안정적 전송
                console.log(`📥 다운로드 시작: ${sourceFile.name}`);
                const fileStream = await googleDriveFileManager.downloadFile(
                  defaultAccount.accessToken!,
                  sourceFile.id!,
                  defaultAccount
                );

                // 스트림을 청크로 변환 (안정성 향상)
                const chunks: any[] = [];
                for await (const chunk of fileStream) {
                  chunks.push(chunk);
                }
                const fileBuffer = Buffer.concat(chunks);
                console.log(`✅ 다운로드 완료: ${(fileBuffer.length / (1024 * 1024)).toFixed(2)}MB`);

                const decryptedToken = decryptToken(targetAccount.accessToken!);
                
                // ⭐ 카테고리별 폴더 결정 (디버깅 로그 추가)
                let targetFolderId = targetMainFolder.id; // 기본: MaruCS-Sync 루트
                let targetFolderName = "MaruCS-Sync 루트";
                
                console.log(`🔍 폴더 매핑 디버그:`);
                console.log(`   - 다운로드 카테고리: ${download.category}`);
                
                const categoryFolderName = getFolderNameByCategory(download.category);
                console.log(`   - 매핑된 폴더명: ${categoryFolderName}`);
                console.log(`   - 폴더맵 키들:`, Object.keys(folderMap));
                console.log(`   - 폴더맵[${categoryFolderName}]: ${folderMap[categoryFolderName]}`);
                
                if (categoryFolderName && folderMap[categoryFolderName]) {
                  targetFolderId = folderMap[categoryFolderName];
                  targetFolderName = `MaruCS-Sync/${categoryFolderName}`;
                  console.log(`✅ 카테고리 폴더로 설정: ${targetFolderName} (ID: ${targetFolderId})`);
                } else {
                  console.log(`⚠️ 카테고리 폴더를 찾을 수 없음, MaruCS-Sync 루트 사용`);
                }
                
                console.log(`📤 업로드 시작: ${sourceFile.name} → ${targetFolderName} (${(fileBuffer.length / (1024 * 1024)).toFixed(2)}MB)`);
                
                // 타겟 계정의 카테고리 폴더에 직접 업로드 
                const newFile = await googleDriveFileManager.uploadFile(
                    decryptedToken,
                    fileBuffer,
                    sourceFile.name || download.fileName,
                    sourceFile.mimeType || 'application/octet-stream',
                    targetFolderId // 카테고리 폴더 ID 직접 지정
                  );

                  if (newFile && newFile.id) {
                    console.log(`✅ 파일 업로드 성공: ${newFile.name || sourceFile.name} → ${targetFolderName}`);
                    console.log(`✅ 복사 및 배치 완료: ${sourceFile.name} → ${targetAccount.email} ${targetFolderName} (원본은 ${defaultAccount.email}에 보존됨)`);
                    totalSyncedFiles++;
                  } else {
                    console.log(`❌ 파일 업로드 실패: ${sourceFile.name}`);
                  }
                } catch (fileError) {
                  console.error(`❌ 파일 동기화 실패: ${sourceFile.name}`, fileError);
                }
              }

            results.push({
              targetAccount: targetAccount.email,
              success: true,
              syncedFiles: totalSyncedFiles
            });

          } catch (targetError) {
            console.error(`❌ ${targetAccount.email}로의 동기화 실패:`, targetError);
            results.push({
              targetAccount: targetAccount.email,
              success: false,
              error: targetError instanceof Error ? targetError.message : "알 수 없는 오류"
            });
          }
        }

      } catch (sourceError) {
        console.error(`❌ 기본 계정 ${defaultAccount.email} 동기화 실패:`, sourceError);
      }

      res.json({
        success: true,
        message: `기본 계정 ${defaultAccount.email}에서 ${totalSyncedFiles}개 파일이 ${otherAccounts.length}개 계정에 동기화되었습니다`,
        defaultAccount: defaultAccount.email,
        results,
        totalSyncedFiles,
        targetAccountCount: otherAccounts.length
      });

    } catch (error) {
      console.error('파일 동기화 오류:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "파일 동기화에 실패했습니다" 
      });
    }
  });

  // Google Drive 폴더 관리
  app.post("/api/google-drive/organize-folders", async (req, res) => {
    try {
      const accounts = await storage.getGoogleDriveAccounts();
      if (accounts.length === 0) {
        return res.status(400).json({ error: "연결된 Google Drive 계정이 없습니다" });
      }

      const results = [];

      for (const account of accounts) {
        try {
          console.log(`📁 ${account.email}에서 폴더 구조 생성 중...`);
          
          // 메인 폴더 생성
          const mainFolder = await googleDriveFileManager.createFolder(
            account.accessToken!, 
            "MaruCS-Sync"
          );
          
          // 서브 폴더들 생성
          const subFolders = [
            "StreamPlayer",
            "OTT PLUS", 
            "NoHard System",
            "Manual",
            "Other"
          ];
          
          const createdFolders: any = { mainFolder };
          
          for (const folderName of subFolders) {
            const subFolder = await googleDriveFileManager.createFolder(
              account.accessToken!,
              folderName,
              mainFolder.id!
            );
            createdFolders[folderName] = subFolder;
          }
          
          // 기존 파일들을 카테고리별로 이동
          console.log(`📦 ${account.email}에서 파일 이동 중...`);
          const files = await googleDriveFileManager.listFiles(account.accessToken!, 200);
          const downloads = await storage.getDownloads();
          
          let movedCount = 0;
          for (const download of downloads) {
            if (download.googleDriveAccountId === account.id && download.googleDriveFileId) {
              const file = files.find(f => f.id === download.googleDriveFileId);
              if (file) {
                let targetFolderId;
                
                // 카테고리에 따른 폴더 매핑
                switch (download.category) {
                  case 'streamplayer':
                    targetFolderId = createdFolders["StreamPlayer"]?.id;
                    break;
                  case 'ott-plus':
                    targetFolderId = createdFolders["OTT PLUS"]?.id;
                    break;
                  case 'nohard':
                    targetFolderId = createdFolders["NoHard System"]?.id;
                    break;
                  case 'manual':
                    targetFolderId = createdFolders["Manual"]?.id;
                    break;
                  default:
                    targetFolderId = createdFolders["Other"]?.id;
                }
                
                if (targetFolderId) {
                  try {
                    await googleDriveFileManager.moveFileToFolder(
                      account.accessToken!,
                      download.googleDriveFileId,
                      targetFolderId
                    );
                    movedCount++;
                    console.log(`✅ 이동 완료: ${file.name} → ${download.category}`);
                  } catch (moveError) {
                    console.error(`❌ 파일 이동 실패: ${file.name}`, moveError);
                  }
                }
              }
            }
          }
          
          results.push({
            account: account.email,
            success: true,
            mainFolder: mainFolder.webViewLink,
            movedFiles: movedCount,
            createdFolders: Object.keys(createdFolders).length
          });
          
          console.log(`✅ ${account.email} 완료: ${movedCount}개 파일 이동`);
          
        } catch (accountError) {
          console.error(`❌ ${account.email} 폴더 생성 실패:`, accountError);
          results.push({
            account: account.email,
            success: false,
            error: accountError instanceof Error ? accountError.message : "알 수 없는 오류"
          });
        }
      }
      
      res.json({
        success: true,
        message: "폴더 구조 생성 및 파일 이동이 완료되었습니다",
        results
      });
      
    } catch (error) {
      console.error('폴더 관리 오류:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "폴더 관리에 실패했습니다" 
      });
    }
  });

  // Serve uploaded files (기존 로컬 업로드 유지)
  app.use('/uploads', express.static('uploads'));

  // 정기적 토큰 갱신 스케줄러 (30분마다)
  const startTokenRefreshScheduler = () => {
    console.log('🕒 토큰 갱신 스케줄러 시작 (30분 간격)');
    
    const refreshAllTokens = async () => {
      try {
        const accounts = await storage.getGoogleDriveAccounts();
        console.log(`🔄 정기 토큰 갱신 실행 (${accounts.length}개 계정)`);
        
        for (const account of accounts) {
          if (!account.isActive) continue;
          
          try {
            const refreshedAccount = await googleDriveOAuth.validateAndRefreshToken(account);
            
            if (!refreshedAccount.isTokenExpired && refreshedAccount.accessToken !== account.accessToken) {
              await storage.updateGoogleDriveAccountTokens(account.id, {
                accessToken: refreshedAccount.accessToken,
                tokenExpiresAt: refreshedAccount.expiryDate || refreshedAccount.tokenExpiresAt || undefined
              });
              console.log(`✅ 정기 토큰 갱신: ${account.email}`);
            }
          } catch (error) {
            console.error(`❌ 정기 토큰 갱신 실패: ${account.email}`, error);
          }
        }
      } catch (error) {
        console.error('정기 토큰 갱신 스케줄러 오류:', error);
      }
    };
    
    // 즉시 한번 실행
    refreshAllTokens();
    
    // 30분마다 반복
    setInterval(refreshAllTokens, 30 * 60 * 1000);
  };
  
  // 스케줄러 시작
  startTokenRefreshScheduler();

  const httpServer = createServer(app);
  return httpServer;
}
