# 구글 클라우드 콘솔 설정 문제점 발견

## 발견된 문제들

### 1. 승인된 도메인 문제 ❌
현재 설정: `workspace--ds1iwo.replit.app`
필요한 설정: `marucs2.replit.app`

### 2. 앱 도메인 URL 문제 ❌
- 개인정보처리방침 링크: `https://workspace--ds1iwo.replit.app/privacy` (잘못된 도메인)
- 서비스 약관 링크: `https://workspace--ds1iwo.replit.app/terms` (잘못된 도메인)

## 즉시 수정해야 할 사항

### A. 승인된 도메인 변경
1. "승인된 도메인" 섹션에서 기존 도메인 삭제
2. 새 도메인 추가: `marucs2.replit.app`

### B. 앱 도메인 URL 수정
개인정보처리방침 링크:
```
https://marucs2.replit.app/privacy
```

서비스 약관 링크:
```
https://marucs2.replit.app/terms
```

## 추가 확인 사항
- 리디렉션 URI는 올바르게 설정되어 있음 ✅
- OAuth 클라이언트 ID는 정상 ✅
- 승인된 JavaScript 출처도 확인 필요

## 결론
승인된 도메인과 앱 도메인 URL이 잘못된 것이 redirect_uri_mismatch 오류의 원인입니다.