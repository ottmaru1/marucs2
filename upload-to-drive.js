#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Google Drive 업로드 함수
async function uploadToGoogleDrive(filePath, sessionCookie) {
  const fileName = path.basename(filePath);
  const fileSize = fs.statSync(filePath).size;
  const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
  
  console.log(`📁 업로드 시작: ${fileName} (${fileSizeMB}MB)`);
  
  try {
    // Google Drive API 호출
    const response = await fetch('http://localhost:5000/api/google-drive/upload-backup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie
      },
      body: JSON.stringify({
        fileName: fileName,
        filePath: filePath,
        folderName: 'Replit-Backup-2025-09-05'
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`✅ 업로드 성공: ${fileName}`);
      console.log(`🔗 Google Drive 링크: ${result.webViewLink}`);
      return true;
    } else {
      console.error(`❌ 업로드 실패: ${fileName} - ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ 업로드 오류: ${fileName} - ${error.message}`);
    return false;
  }
}

// 관리자 로그인 함수
async function loginAdmin() {
  try {
    const response = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password: 'ks22262297!'
      })
    });
    
    if (response.ok) {
      const setCookieHeader = response.headers.get('set-cookie');
      if (setCookieHeader) {
        // 세션 쿠키 추출
        const sessionMatch = setCookieHeader.match(/connect\.sid=([^;]+)/);
        if (sessionMatch) {
          return `connect.sid=${sessionMatch[1]}`;
        }
      }
    }
    throw new Error('로그인 실패');
  } catch (error) {
    console.error('❌ 관리자 로그인 실패:', error.message);
    return null;
  }
}

// 메인 함수
async function main() {
  console.log('🔐 관리자 로그인 중...');
  const sessionCookie = await loginAdmin();
  
  if (!sessionCookie) {
    console.error('❌ 로그인 실패로 업로드를 중단합니다.');
    return;
  }
  
  console.log('✅ 관리자 로그인 성공!\n');
  // 100MB 미만 파일만 선택해서 업로드 테스트
  const backupFiles = [
    './marucomsys-split-backup-aa',  // 100MB
    './marucomsys-split-backup-ab',  // 100MB
    './marucomsys-split-backup-ac'   // 100MB
  ];
  
  console.log('🚀 Google Drive 백업 업로드 시작');
  console.log(`📂 대상 폴더: Replit-Backup-2025-09-05`);
  console.log(`📋 업로드할 파일 수: ${backupFiles.length}개\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (const filePath of backupFiles) {
    if (fs.existsSync(filePath)) {
      const success = await uploadToGoogleDrive(filePath, sessionCookie);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
      
      // 파일 간 간격 (서버 부하 방지)
      console.log('⏳ 다음 파일까지 3초 대기...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } else {
      console.log(`⚠️  파일 없음: ${filePath}`);
      failCount++;
    }
  }
  
  console.log('\n📊 업로드 완료 보고:');
  console.log(`✅ 성공: ${successCount}개`);
  console.log(`❌ 실패: ${failCount}개`);
  console.log(`📱 총 파일: ${backupFiles.length}개`);
}

// 스크립트 실행
main().catch(console.error);