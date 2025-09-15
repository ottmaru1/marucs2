# 구글 클라우드 콘솔 OAuth 설정 단계별 가이드

## 유료 결제 설정 필요 여부
❌ **OAuth 인증에는 유료 결제 설정이 필요하지 않습니다!**
✅ Google의 무료 할당량으로 충분히 사용 가능
✅ Drive API, OAuth 2.0 모두 무료 티어에서 지원

## 1단계: 구글 클라우드 콘솔 접속 및 프로젝트 생성

### 1.1 콘솔 접속
- URL: https://console.cloud.google.com/
- Google 계정으로 로그인

### 1.2 새 프로젝트 생성
1. 상단 프로젝트 선택 드롭다운 클릭
2. "새 프로젝트" 선택
3. 프로젝트 이름: `MaruComSys-OAuth` (또는 원하는 이름)
4. "만들기" 클릭
5. 생성된 프로젝트 선택

## 2단계: OAuth 동의 화면 설정

### 2.1 OAuth consent screen 접속
- 좌측 메뉴: APIs & Services → OAuth consent screen

### 2.2 사용자 유형 선택
- **External (외부)** 선택 (개인 계정의 경우)
- "만들기" 클릭

### 2.3 앱 정보 입력
**필수 정보:**
- 앱 이름: `MaruComSys File Manager`
- 사용자 지원 이메일: 본인 Gmail 주소
- 개발자 연락처 정보: 본인 Gmail 주소

**앱 도메인 (중요!):**
- 홈페이지: `https://59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev`
- 개인정보처리방침: `https://59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev/privacy`
- 서비스 약관: `https://59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev/terms`

**승인된 도메인 추가:**
```
replit.app
worf.replit.dev
59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev
```

### 2.4 범위(Scopes) 설정
1. "범위 추가 또는 삭제" 클릭
2. 다음 범위들 검색하여 추가:
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/userinfo.email`
3. "업데이트" 클릭

### 2.5 테스트 사용자 (필요시)
- 앱이 테스트 모드인 경우 사용할 Google 계정들 추가
- ottmaru1@gmail.com 등 테스트할 계정 추가

## 3단계: OAuth 클라이언트 ID 생성

### 3.1 Credentials 페이지 접속
- 좌측 메뉴: APIs & Services → Credentials

### 3.2 OAuth 클라이언트 ID 생성
1. "사용자 인증 정보 만들기" 클릭
2. "OAuth 클라이언트 ID" 선택
3. 애플리케이션 유형: **웹 애플리케이션**
4. 이름: `MaruComSys Web Client`

### 3.3 JavaScript 원본 설정
승인된 JavaScript 원본에 추가:
```
https://59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev
https://replit.app
```

### 3.4 리디렉션 URI 설정 (핵심!)
승인된 리디렉션 URI에 **정확히** 다음과 같이 입력:
```
https://59d69701-efe5-41fe-9448-ddba244f8062-00-2e0hqi1dcvrjc.worf.replit.dev/api/auth/google/callback
```

⚠️ **주의사항:**
- 대소문자 정확히 입력
- 마지막 슬래시(/) 없이 입력
- https:// 프로토콜 확인
- 오타 없이 정확한 도메인 입력

### 3.5 클라이언트 ID 및 Secret 저장
1. "만들기" 클릭
2. 생성된 클라이언트 ID와 클라이언트 Secret 복사
3. Replit Secrets에 저장

## 4단계: Google Drive API 활성화

### 4.1 API Library 접속
- 좌측 메뉴: APIs & Services → Library

### 4.2 Google Drive API 검색 및 활성화
1. "Google Drive API" 검색
2. Google Drive API 선택
3. "사용" 또는 "Enable" 클릭

## 5단계: 설정 확인 및 테스트

### 5.1 설정 전파 대기
- 설정 변경 후 5-15분 대기
- Google 서버에서 설정이 전파되는 시간 필요

### 5.2 테스트 실행
- 관리자 페이지에서 "계정 추가" 버튼 클릭
- OAuth 인증 플로우 정상 작동 확인

## 문제 해결

### 일반적인 오류들
1. **redirect_uri_mismatch**: 리디렉션 URI 불일치
   - 구글 클라우드 콘솔에서 정확한 URI 재확인
   
2. **invalid_client**: 클라이언트 ID 오류
   - 환경변수 GOOGLE_CLIENT_ID 확인
   
3. **access_denied**: 권한 거부
   - OAuth 동의 화면 설정 확인
   - 테스트 사용자 추가 필요할 수 있음

### 확인 체크리스트
- [ ] 프로젝트 선택 확인
- [ ] OAuth 동의 화면 완료
- [ ] 승인된 도메인 3개 추가
- [ ] 개인정보처리방침/서비스약관 URL 설정
- [ ] OAuth 클라이언트 ID 생성
- [ ] 리디렉션 URI 정확히 입력
- [ ] Google Drive API 활성화
- [ ] 환경변수 설정 확인