# Google OAuth 리디렉트 URI 수정 안내

## 문제 상황
- 오류: "400 오류: redirect_uri_mismatch"
- 원인: 구글 클라우드 콘솔에 등록된 리디렉트 URI와 실제 Replit 도메인이 다름

## 해결 방법

### 1. 구글 클라우드 콘솔 설정 변경
1. [Google Cloud Console](https://console.cloud.google.com/) 접속
2. 프로젝트 선택 → API 및 서비스 → 사용자 인증 정보
3. OAuth 2.0 클라이언트 ID 편집
4. 승인된 리디렉션 URI에서 기존 URI 삭제하고 새 URI 추가:

**기존 (잘못된) URI:**
```
https://workspace--ds1iwo.replit.app/api/auth/google/callback
```

**새로운 (올바른) URI:**
```
https://258c0df6-4caa-4bc6-ad62-93cc7a44effb-00-2dmqihs3x26jc.spock.replit.dev/api/auth/google/callback
```

### 2. Replit 환경변수 업데이트
1. Replit Secrets에서 `GOOGLE_REDIRECT_URI` 값을 새 URI로 변경
2. 서버 재시작

### 3. 변경 후 테스트
- 관리자 페이지에서 "계정 추가" 클릭
- 구글 인증 진행
- 성공적으로 리디렉트되는지 확인

## 참고 사항
- Replit의 실제 도메인은 `spock.replit.dev` 서브도메인을 사용
- `workspace--ds1iwo.replit.app`은 외부 접근이 제한됨
- 설정 변경 후 2-3분 대기 필요 (구글 서버 전파 시간)