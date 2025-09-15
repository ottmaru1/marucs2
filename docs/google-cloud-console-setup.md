# 구글 클라우드 콘솔 설정 가이드

## 1단계: 프로젝트 및 OAuth 동의 화면 설정

### OAuth 동의 화면 설정
1. 구글 클라우드 콘솔 → APIs & Services → OAuth consent screen
2. 사용자 유형: **외부(External)** 선택
3. 앱 정보:
   - 앱 이름: `MaruComSys File Manager`
   - 사용자 지원 이메일: 본인 이메일
   - 앱 도메인:
     - 홈페이지: `https://59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev`
     - 개인정보처리방침: `https://59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev/privacy`
     - 서비스 약관: `https://59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev/terms`
   - 승인된 도메인:
     - `replit.app`
     - `worf.replit.dev`
     - `59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev`
   - 개발자 연락처 정보: 본인 이메일

### 범위(Scopes) 설정
4. 범위 추가:
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/userinfo.email`

## 2단계: OAuth 클라이언트 ID 생성

### 사용자 인증 정보 만들기
1. APIs & Services → Credentials
2. 사용자 인증 정보 만들기 → OAuth 클라이언트 ID
3. 애플리케이션 유형: **웹 애플리케이션**
4. 이름: `MaruComSys Web Client`
5. **승인된 자바스크립트 원본 (복사해서 붙여넣기):**

<button onclick="navigator.clipboard.writeText('https://59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev')">📋 메인 원본 URI 복사</button>
```
https://59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev
```

<button onclick="navigator.clipboard.writeText('https://replit.app')">📋 기본 원본 URI 복사</button>
```
https://replit.app
```
6. **승인된 리디렉션 URI (가장 중요!):**

<button onclick="navigator.clipboard.writeText('https://59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev/api/auth/google/callback')">📋 리디렉션 URI 복사</button>
```
https://59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev/api/auth/google/callback
```

## 3단계: API 활성화
1. APIs & Services → Library
2. 다음 API들 활성화:
   - Google Drive API
   - Google People API (선택사항)

## 현재 사용 중인 정보
- 클라이언트 ID: `148764534134-3dhe4qc...` (환경변수에서 확인)
- 리디렉션 URI: `https://59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev/api/auth/google/callback`

## 확인해야 할 핵심 사항
1. **리디렉션 URI 정확성**: 대소문자, 슬래시, 프로토콜 모두 정확해야 함
2. **도메인 승인**: 현재 도메인이 승인된 도메인에 포함되었는지
3. **OAuth 동의 화면 상태**: 게시 상태가 아닌 테스트 모드일 수 있음
4. **API 활성화**: Google Drive API가 활성화되었는지

## 문제 해결 팁
- 설정 변경 후 5-15분 대기
- 브라우저 캐시 삭제 또는 시크릿 모드 사용
- 정확한 대소문자 및 특수문자 확인