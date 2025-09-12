import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import crypto from 'crypto';
import { Readable } from 'stream';

// 암호화 키 (환경변수로 관리 권장)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default-key-change-in-production-32bytes';
const ALGORITHM = 'aes-256-cbc';

// 32바이트 키 생성
function getKey(): Buffer {
  return crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
}

/**
 * 토큰 암호화 함수 (안전한 방식)
 */
export function encryptToken(text: string): string {
  if (!text) return '';
  
  try {
    const key = getKey();
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // IV를 앞에 붙여서 반환
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Token encryption failed:', error);
    return '';
  }
}

/**
 * 토큰 복호화 함수 (안전한 방식)
 */
export function decryptToken(encryptedText: string | object): string {
  if (!encryptedText) return '';
  
  // encryptedText가 객체인 경우 문자열로 변환 시도
  const textToDecrypt = typeof encryptedText === 'object' ? 
    JSON.stringify(encryptedText) : encryptedText;
  
  try {
    // 새로운 형식 (IV:암호화된텍스트)인지 확인
    if (textToDecrypt.includes(':')) {
      const [ivHex, encryptedHex] = textToDecrypt.split(':');
      const key = getKey();
      const iv = Buffer.from(ivHex, 'hex');
      
      const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } else {
      // 기존 형식 지원을 위한 레거시 복호화 시도
      console.log('레거시 토큰 형식 감지, 평문으로 반환');
      return typeof encryptedText === 'string' ? encryptedText : '';
    }
  } catch (error) {
    console.error('Token decryption failed:', error);
    // 복호화 실패 시 원본 텍스트 반환 (평문 토큰일 가능성)
    return typeof encryptedText === 'string' ? encryptedText : '';
  }
}

/**
 * 구글 드라이브 OAuth 관리 클래스
 */
export class GoogleDriveOAuthManager {
  private clientId: string;
  private clientSecret: string;
  private redirectUri: string;
  private scopes: string[];

  constructor() {
    this.clientId = process.env.GOOGLE_CLIENT_ID || '';
    this.clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
    // 동적 리다이렉트 URI 생성 (Vercel/Replit 모두 지원)
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.REPL_SLUG 
      ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
      : 'http://localhost:5000';
    
    const dynamicRedirectUri = `${baseUrl}/api/auth/google/callback`;
    this.redirectUri = process.env.GOOGLE_REDIRECT_URI || dynamicRedirectUri;
    this.scopes = [
      'https://www.googleapis.com/auth/drive.file', // 앱이 생성한 파일만 접근
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ];
  }

  /**
   * OAuth 인증 URL 생성
   */
  generateAuthUrl(accountName: string): string {
    console.log("=== OAuth URL 생성 ===");
    console.log("Client ID:", this.clientId?.substring(0, 20) + "...");
    console.log("Redirect URI:", this.redirectUri);
    console.log("Account Name:", accountName);
    
    const oauth2Client = new OAuth2Client(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline', // 리프레시 토큰 받기 위해
      scope: this.scopes,
      state: accountName, // 계정 이름을 state로 전달
      prompt: 'consent' // 매번 consent 화면 표시 (리프레시 토큰 보장)
    });
    
    console.log("Generated Auth URL:", authUrl);
    console.log("======================");
    return authUrl;
  }

  /**
   * 인증 코드로 토큰 교환
   */
  async exchangeCodeForTokens(code: string, accountName: string) {
    const oauth2Client = new OAuth2Client(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );

    try {
      // 인증 코드로 토큰 교환
      const { tokens } = await oauth2Client.getToken(code);
      
      // 사용자 정보 가져오기
      oauth2Client.setCredentials(tokens);
      const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
      const { data: userInfo } = await oauth2.userinfo.get();

      return {
        accountName,
        email: userInfo.email || '',
        accessToken: tokens.access_token || '',
        refreshToken: tokens.refresh_token || null,
        expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : null,
        profilePicture: userInfo.picture || null
      };
    } catch (error) {
      console.error('Token exchange error:', error);
      throw new Error('구글 인증 토큰 교환에 실패했습니다');
    }
  }

  /**
   * 리프레시 토큰을 이용한 액세스 토큰 갱신
   */
  async refreshAccessToken(refreshToken: string) {
    const oauth2Client = new OAuth2Client(
      this.clientId,
      this.clientSecret,
      this.redirectUri
    );

    try {
      oauth2Client.setCredentials({
        refresh_token: decryptToken(refreshToken)
      });

      const { credentials } = await oauth2Client.refreshAccessToken();
      
      return {
        accessToken: credentials.access_token || '',
        expiryDate: credentials.expiry_date ? new Date(credentials.expiry_date) : null
      };
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('토큰 갱신에 실패했습니다');
    }
  }

  /**
   * 토큰 유효성 검사 및 자동 갱신
   */
  async validateAndRefreshToken(account: any) {
    const now = new Date();
    const expiryTime = account.tokenExpiresAt ? new Date(account.tokenExpiresAt) : null;
    
    // 토큰 만료 시간 로깅
    if (expiryTime) {
      const timeRemaining = expiryTime.getTime() - now.getTime();
      const minutesRemaining = Math.floor(timeRemaining / (1000 * 60));
      console.log(`⏰ ${account.email} 토큰 만료까지: ${minutesRemaining}분`);
    } else {
      console.log(`⚠️ ${account.email} 토큰 만료 시간 정보 없음`);
    }
    
    // 토큰이 만료되었거나 곧 만료될 예정인지 확인 (15분 여유로 확장)
    const shouldRefresh = !expiryTime || (expiryTime.getTime() - now.getTime()) < 15 * 60 * 1000;

    if (shouldRefresh && account.refreshToken) {
      console.log(`🔄 토큰 자동 갱신 시작: ${account.email}`);
      try {
        const newTokens = await this.refreshAccessToken(account.refreshToken);
        
        console.log(`✅ ${account.email} 토큰 갱신 완료. 새 만료 시간:`, newTokens.expiryDate);
        
        // 데이터베이스 업데이트는 호출하는 곳에서 처리
        return {
          ...account,
          accessToken: newTokens.accessToken,
          expiryDate: newTokens.expiryDate,
          tokenExpiresAt: newTokens.expiryDate,
          isTokenExpired: false
        };
      } catch (error) {
        console.error(`❌ 토큰 자동 갱신 실패: ${account.email}`, error);
        return {
          ...account,
          isTokenExpired: true
        };
      }
    }

    return account;
  }


  /**
   * 토큰 유효성 검사
   */
  async validateToken(encryptedAccessToken: string): Promise<boolean> {
    try {
      const accessToken = decryptToken(encryptedAccessToken);
      if (!accessToken) return false;

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      // 토큰 정보 확인
      const tokenInfo = await oauth2Client.getAccessToken();
      return !!tokenInfo.token;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  /**
   * 토큰 해지
   */
  async revokeToken(encryptedAccessToken: string): Promise<void> {
    try {
      const accessToken = decryptToken(encryptedAccessToken);
      if (!accessToken) return;

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });
      
      await oauth2Client.revokeCredentials();
    } catch (error) {
      console.error('Token revocation error:', error);
      // 해지 실패는 무시 (이미 만료된 토큰일 수 있음)
    }
  }
}

/**
 * 구글 드라이브 파일 관리 클래스
 */
export class GoogleDriveFileManager {
  /**
   * 파일 업로드 (버퍼)
   */
  async uploadFile(
    encryptedAccessToken: string, 
    fileBuffer: Buffer, 
    fileName: string, 
    mimeType: string,
    parentId?: string
  ) {
    try {
      const accessToken = decryptToken(encryptedAccessToken);
      if (!accessToken) {
        throw new Error('유효하지 않은 액세스 토큰입니다');
      }

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const requestBody: any = {
        name: fileName,
      };

      // 부모 폴더 ID가 있으면 설정
      if (parentId) {
        requestBody.parents = [parentId];
        console.log(`📂 업로드 대상 폴더 ID: ${parentId}`);
      } else {
        console.log(`📂 업로드 대상: 루트 폴더`);
      }

      console.log(`📤 업로드 시작: ${fileName} (${(fileBuffer.length / 1024 / 1024).toFixed(2)}MB)`);

      const response = await drive.files.create({
        requestBody,
        media: {
          mimeType: mimeType,
          body: Readable.from(fileBuffer),
        },
        fields: 'id,name,webViewLink,webContentLink,size,mimeType,parents'
      });

      console.log(`✅ 파일 업로드 성공:`, {
        id: response.data.id,
        name: response.data.name,
        size: response.data.size,
        parents: response.data.parents,
        webViewLink: response.data.webViewLink
      });

      return response.data;
    } catch (error) {
      console.error('File upload error:', error);
      throw new Error('파일 업로드에 실패했습니다');
    }
  }

  /**
   * 파일 업로드 (스트림) - 대용량 파일용
   */
  async uploadFileStream(
    accessToken: string, 
    fileStream: any, 
    fileName: string, 
    mimeType: string,
    fileSize: number,
    parentId?: string
  ) {
    try {
      if (!accessToken) {
        throw new Error('유효하지 않은 액세스 토큰입니다');
      }

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const requestBody: any = {
        name: fileName,
      };

      // 부모 폴더 ID가 있으면 설정
      if (parentId) {
        requestBody.parents = [parentId];
        console.log(`📂 스트림 업로드 대상 폴더 ID: ${parentId}`);
      } else {
        console.log(`📂 스트림 업로드 대상: 루트 폴더`);
      }

      console.log(`📤 스트림 업로드 시작: ${fileName} (${(fileSize / 1024 / 1024).toFixed(2)}MB)`);

      const response = await drive.files.create({
        requestBody,
        media: {
          mimeType: mimeType,
          body: fileStream,
        },
        fields: 'id,name,webViewLink,webContentLink,size,mimeType,parents'
      });

      console.log(`✅ 스트림 업로드 성공:`, {
        id: response.data.id,
        name: response.data.name,
        size: response.data.size,
        parents: response.data.parents,
        webViewLink: response.data.webViewLink
      });

      return response.data;
    } catch (error) {
      console.error('Stream upload error:', error);
      throw new Error('스트림 업로드에 실패했습니다');
    }
  }

  /**
   * 파일을 공개로 설정
   */
  async makeFilePublic(encryptedAccessToken: string, fileId: string) {
    try {
      const accessToken = decryptToken(encryptedAccessToken);
      if (!accessToken) return;

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      await drive.permissions.create({
        fileId: fileId,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });
    } catch (error) {
      console.error('Make file public error:', error);
      // 공개 설정 실패는 로그만 출력 (업로드는 성공)
    }
  }

  /**
   * 파일 삭제
   */
  async deleteFile(encryptedAccessToken: string, fileId: string) {
    try {
      const accessToken = decryptToken(encryptedAccessToken);
      if (!accessToken) return;

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      await drive.files.delete({
        fileId: fileId,
      });
    } catch (error) {
      console.error('File deletion error:', error);
      throw new Error('파일 삭제에 실패했습니다');
    }
  }

  /**
   * 파일 다운로드 (스트림) - 토큰 자동 갱신 포함
   */
  async downloadFile(encryptedAccessToken: string, fileId: string, account?: any) {
    try {
      let accessToken = decryptToken(encryptedAccessToken);
      if (!accessToken) {
        throw new Error('Access token이 없습니다');
      }

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      try {
        // 바이러스 스캔 경고 페이지 우회를 위한 대용량 파일 처리
        const response = await drive.files.get({
          fileId: fileId,
          alt: 'media',
          acknowledgeAbuse: true // Google Drive API v3에서 악성 파일 경고 우회
        }, {
          responseType: 'stream'
        });

        console.log(`✅ 바이러스 스캔 우회로 다운로드 성공: ${fileId}`);
        return response.data;
      } catch (error: any) {
        // 토큰 만료 오류인 경우 자동 갱신 시도
        if (error.code === 401 && account && account.refreshToken) {
          console.log(`🔄 다운로드 중 토큰 만료 감지, 자동 갱신 시도: ${account.email}`);
          
          const oauthManager = new GoogleDriveOAuthManager();
          const refreshedAccount = await oauthManager.validateAndRefreshToken(account);
          
          if (!refreshedAccount.isTokenExpired) {
            // 새 토큰으로 재시도
            const newAccessToken = decryptToken(refreshedAccount.accessToken);
            oauth2Client.setCredentials({ access_token: newAccessToken });
            
            const retryResponse = await drive.files.get({
              fileId: fileId,
              alt: 'media',
              acknowledgeAbuse: true // 토큰 갱신 후에도 바이러스 스캔 우회
            }, {
              responseType: 'stream'
            });

            console.log('✅ 토큰 갱신 후 다운로드 성공');
            return retryResponse.data;
          }
        }
        
        throw error;
      }
    } catch (error) {
      console.error('File download error:', error);
      throw new Error('파일 다운로드에 실패했습니다');
    }
  }

  /**
   * 폴더 내용 조회
   */
  async listFolderContents(encryptedAccessToken: string, folderId: string) {
    try {
      const accessToken = decryptToken(encryptedAccessToken);
      if (!accessToken) {
        throw new Error('유효하지 않은 액세스 토큰입니다');
      }

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id,name,size,mimeType,parents,webViewLink,createdTime)',
        orderBy: 'createdTime desc'
      });

      return response.data.files || [];
    } catch (error) {
      console.error('List folder contents error:', error);
      throw new Error('폴더 내용 조회에 실패했습니다');
    }
  }

  /**
   * 파일 권한 정보 조회
   */
  async getFilePermissions(encryptedAccessToken: string, fileId: string) {
    try {
      const accessToken = decryptToken(encryptedAccessToken);
      if (!accessToken) {
        throw new Error('유효하지 않은 액세스 토큰입니다');
      }

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });
      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const response = await drive.permissions.list({
        fileId: fileId,
        fields: 'permissions(id,type,role,emailAddress,domain)'
      });

      return response.data.permissions || [];
    } catch (error) {
      console.error('Get file permissions error:', error);
      throw new Error('파일 권한 조회에 실패했습니다');
    }
  }

  /**
   * 폴더 생성
   */
  async createFolder(encryptedAccessToken: string, folderName: string, parentFolderId?: string) {
    try {
      const accessToken = decryptToken(encryptedAccessToken);
      if (!accessToken) {
        throw new Error('Access token이 없습니다');
      }

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const folderMetadata = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parentFolderId ? [parentFolderId] : undefined
      };

      const response = await drive.files.create({
        requestBody: folderMetadata,
        fields: 'id,name,webViewLink'
      });

      return response.data;
    } catch (error) {
      console.error('Folder creation error:', error);
      throw new Error('폴더 생성에 실패했습니다');
    }
  }

  /**
   * 파일을 폴더로 이동
   */
  async moveFileToFolder(encryptedAccessToken: string, fileId: string, folderId: string) {
    try {
      const accessToken = decryptToken(encryptedAccessToken);
      if (!accessToken) {
        throw new Error('Access token이 없습니다');
      }

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      // 현재 파일의 부모 폴더 가져오기
      const file = await drive.files.get({
        fileId: fileId,
        fields: 'parents'
      });

      const previousParents = file.data.parents?.join(',') || '';

      // 파일을 새 폴더로 이동
      const response = await drive.files.update({
        fileId: fileId,
        addParents: folderId,
        removeParents: previousParents,
        fields: 'id, parents'
      });

      return response.data;
    } catch (error) {
      console.error('File move error:', error);
      throw new Error('파일 이동에 실패했습니다');
    }
  }

  /**
   * 파일 목록 조회
   */
  async listFiles(encryptedAccessToken: string, pageSize: number = 100) {
    try {
      const accessToken = decryptToken(encryptedAccessToken);
      if (!accessToken) return [];

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const response = await drive.files.list({
        pageSize: pageSize,
        fields: 'files(id,name,webViewLink,webContentLink,size,mimeType,createdTime,parents,md5Checksum,modifiedTime)',
        orderBy: 'createdTime desc'
      });

      return response.data.files || [];
    } catch (error) {
      console.error('File list error:', error);
      return [];
    }
  }

  /**
   * 특정 파일 정보 조회
   */
  async getFileInfo(encryptedAccessToken: string, fileId: string) {
    try {
      const accessToken = decryptToken(encryptedAccessToken);
      if (!accessToken) return null;

      const oauth2Client = new OAuth2Client();
      oauth2Client.setCredentials({ access_token: accessToken });

      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const response = await drive.files.get({
        fileId: fileId,
        fields: 'id,name,webViewLink,webContentLink,size,mimeType,createdTime,parents,md5Checksum,modifiedTime'
      });

      return response.data;
    } catch (error) {
      console.error('Get file info error:', error);
      return null;
    }
  }

  /**
   * 현재 토큰의 실제 사용자 정보 확인
   */
  async getUserInfo(accessToken: string): Promise<{ email: string; name: string; id: string }> {
    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({ access_token: accessToken });

      const drive = google.drive({ version: 'v3', auth: oauth2Client });

      const response = await drive.about.get({
        fields: 'user'
      });

      return {
        email: response.data.user?.emailAddress || '',
        name: response.data.user?.displayName || '',
        id: response.data.user?.permissionId || ''
      };
    } catch (error) {
      console.error('사용자 정보 확인 오류:', error);
      throw error;
    }
  }

  /**
   * 파일 무결성 검증 - 사이즈와 MD5 해시 비교
   */
  compareFileIntegrity(sourceFile: any, targetFile: any): {
    sizeMatch: boolean;
    hashMatch: boolean;
    isIdentical: boolean;
    details: string;
  } {
    const sourceSize = sourceFile.size ? parseInt(sourceFile.size) : 0;
    const targetSize = targetFile.size ? parseInt(targetFile.size) : 0;
    const sizeMatch = sourceSize === targetSize;
    
    const sourceHash = sourceFile.md5Checksum || '';
    const targetHash = targetFile.md5Checksum || '';
    const hashMatch = sourceHash && targetHash && sourceHash === targetHash;
    
    const isIdentical = sizeMatch && hashMatch;
    
    let details = '';
    if (!sizeMatch) {
      details += `사이즈 불일치 (원본: ${sourceSize}B, 대상: ${targetSize}B)`;
    }
    if (!hashMatch) {
      if (details) details += ', ';
      details += `해시 불일치 (원본: ${sourceHash || 'N/A'}, 대상: ${targetHash || 'N/A'})`;
    }
    if (isIdentical) {
      details = `파일 동일 확인 (${sourceSize}B, MD5: ${sourceHash})`;
    }
    
    return { sizeMatch, hashMatch, isIdentical, details };
  }

  /**
   * 파일 목록에서 이름으로 파일 찾기 (무결성 검증 포함)
   */
  findFileWithIntegrityCheck(files: any[], fileName: string, sourceFile?: any): {
    file: any | null;
    integrity: any | null;
  } {
    const targetFile = files.find(f => f.name === fileName);
    if (!targetFile) {
      return { file: null, integrity: null };
    }

    if (sourceFile) {
      const integrity = this.compareFileIntegrity(sourceFile, targetFile);
      return { file: targetFile, integrity };
    }

    return { file: targetFile, integrity: null };
  }
}

// 싱글톤 인스턴스 생성
export const googleDriveOAuth = new GoogleDriveOAuthManager();
export const googleDriveFileManager = new GoogleDriveFileManager();