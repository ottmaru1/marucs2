# VS Code에서 마루컴시스 로컬 실행 가이드

## 1단계: VS Code에서 프로젝트 열기
1. VS Code 실행
2. File → Open Folder
3. `C:\marucs` 폴더 선택

## 2단계: 환경 설정
VS Code에서 `.env` 파일 생성 (루트 디렉토리):
```
DATABASE_URL=file:./local.db
PORT=5000
ADMIN_PASSWORD=admin123
NODE_ENV=development
```

## 3단계: VS Code 터미널에서 실행
```bash
# 의존성 설치 (한 번만)
npm install

# 개발 서버 실행
npm run dev
```

## 4단계: 브라우저 접속
http://localhost:5000

## 주의사항
- PowerShell 대신 VS Code 통합 터미널 사용
- 포트 5000 사용 (3000이 아님)
- 전체 백엔드 기능 포함 (API, 데이터베이스)

## 문제 해결
만약 포트 충돌이 발생하면:
```bash
# 다른 포트로 실행
PORT=3001 npm run dev
```