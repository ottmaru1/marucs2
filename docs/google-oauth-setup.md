# 구글 드라이브 OAuth 설정 가이드

## 1. 구글 클라우드 콘솔 설정

### 단계 1: 프로젝트 생성
1. https://console.cloud.google.com 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 이름: "MaruComSys Drive Integration"

### 단계 2: API 활성화
1. **API 및 서비스 > 라이브러리** 메뉴 이동
2. 다음 API들을 검색하여 활성화:
   - **Google Drive API** (파일 업로드/관리용)
   - **Google OAuth2 API** (사용자 인증용)

### 단계 3: OAuth 2.0 클라이언트 ID 생성
1. **API 및 서비스 > 사용자 인증 정보** 메뉴 이동
2. **+ 사용자 인증 정보 만들기** 클릭
3. **OAuth 2.0 클라이언트 ID** 선택
4. 동의 화면 구성 (처음인 경우):
   - 사용자 유형: **외부** 선택
   - 앱 이름: "MaruComSys 관리자"
   - 사용자 지원 이메일: 본인 이메일
   - 개발자 연락처 정보: 본인 이메일

### 단계 4: OAuth 동의 화면 게시 (중요!)
**Not Found 오류 해결을 위해 반드시 필요:**

**방법 1: 테스트 사용자 추가 (가장 빠름)**
1. **OAuth 동의 화면** → **"테스트 사용자"** 섹션
2. **"+ 사용자 추가"** 클릭
3. `ottmaru1@gmail.com` 입력하여 추가

**방법 2: 앱 게시**
1. **OAuth 동의 화면** → **"앱 게시"** 버튼 클릭
2. **"프로덕션으로 게시"** 선택

**추가 필수 설정:**
- **승인된 도메인**: `replit.app` 추가
- **앱 도메인 홈페이지**: `https://workspace--ds1iwo.replit.app`

### 단계 5: 웹 애플리케이션 설정
1. **애플리케이션 유형**: **웹 애플리케이션** 선택
2. **이름**: "MaruComSys Web Client"  
3. **승인된 JavaScript 원본**에 추가:
   ```
   https://workspace--ds1iwo.replit.app
   http://localhost:5000
   ```
4. **승인된 리디렉션 URI**에 추가:
   ```
   https://workspace--ds1iwo.replit.app/api/auth/google/callback
   http://localhost:5000/api/auth/google/callback
   ```

### 단계 6: 스코프 확인
OAuth 동의 화면에서 다음 스코프가 추가되었는지 확인:
- `../auth/userinfo.email`
- `../auth/userinfo.profile`  
- `../auth/drive.file`

### 단계 5: 클라이언트 정보 복사
생성 완료 후 나타나는 정보를 복사:
- **클라이언트 ID**: 예) 123456789-abcdefg.apps.googleusercontent.com
- **클라이언트 보안 비밀번호**: 예) GOCSPX-abcdefghijklmnop

## 2. Replit 환경변수 설정

Replit Secrets에 다음 정보 추가:
- `GOOGLE_CLIENT_ID`: 위에서 복사한 클라이언트 ID
- `GOOGLE_CLIENT_SECRET`: 위에서 복사한 클라이언트 보안 비밀번호  
- `GOOGLE_REDIRECT_URI`: https://당신의레플릿도메인.replit.app/api/auth/google/callback

## 3. 테스트 방법

1. 환경변수 설정 후 서버 재시작
2. 관리자 페이지 > 구글 드라이브 탭
3. "계정 추가" 버튼 클릭
4. 구글 로그인 창에서 허용
5. 계정이 목록에 나타나면 성공!

## 문제 해결

### "액세스 차단됨" 오류
- 리디렉션 URI가 정확히 설정되었는지 확인
- JavaScript 원본이 추가되었는지 확인

### "invalid_client" 오류  
- 클라이언트 ID와 시크릿이 정확한지 확인
- 프로젝트가 올바른지 확인

### 권한 관련 오류
- Google Drive API가 활성화되었는지 확인
- OAuth 동의 화면이 구성되었는지 확인