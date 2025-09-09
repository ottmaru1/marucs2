# Overview

마루컴시스(MaruComSys)는 숙박업소(호텔, 모텔, PC방)를 대상으로 통합 OTT(Over-The-Top) 스트리밍 솔루션을 제공하는 한국의 B2B 웹 애플리케이션입니다. The company provides three main services: OTT PLUS (set-top box solution), StreamPlayer (PC-based OTT integration), Netflix account management services, and NoHard System (diskless PC solutions for PC cafes). The website serves as a marketing and lead generation platform showcasing these services with features like cost calculators, success stories, inquiry forms, and a complete file management system for downloads.

## Recent Changes (Latest Update: January 18, 2025)
- 🚀 **DEPLOYMENT READY: Replit 배포 준비 완료** - 모든 설정 최적화, 내일 배포 예정
- ✅ **VERIFIED: 배포 설정 검토 완료** - Autoscale (1 vCPU/2GB RAM), 환경변수, 데이터베이스 설정 모두 완료
- ✅ **TESTED: 대안 플랫폼 검증** - CloudFlare Pages (정적만), Vercel (TypeScript 오류), Replit만이 완전 지원
- 🔄 **IN PROGRESS: 폴더 전체 동기화 시스템** - 서브폴더 파일 검색 로직 개선 중, 다음 세션에서 완료 예정
- ✅ **COMPLETE: 폴더명 변경** - "MaruComSys Files" → "MaruCS-Sync"로 모든 코드에서 통일 (15:00)
- ✅ **ENHANCED: 무결성 검증 시스템** - 파일 크기 + MD5 해시로 정확한 동기화 상태 비교
- ✅ **IMPROVED: 동기화 방식 변경** - DB 등록 파일만 → 폴더 전체 동기화로 로직 개선
- ✅ **FIXED: 구문 오류 해결** - try-catch 블록 중괄호 문제 수정으로 서버 안정성 확보
- ✅ **COMPLETE: 모바일 반응형 관리자 페이지** - 햄버거 메뉴, 모바일 헤더, 터치 친화적 인터페이스 구현 (06:27)
- ✅ **OPTIMIZED: 가로 스크롤 제거** - 테이블 열 너비 최적화, 텍스트 트림, 모바일 테이블 레이아웃 개선
- ✅ **MOBILE UI: 반응형 카드 및 버튼** - 모바일 환경에서 컴팩트한 UI 요소, 터치 친화적 버튼 크기
- ✅ **ENHANCED: 자동 토큰 갱신 시스템** - Google OAuth 리프레시 토큰으로 만료 5분 전 자동 갱신, 다운로드/업로드 시 실시간 토큰 검증 (06:00)
- ✅ **ADDED: 토큰 갱신 API** - `/api/google-drive/refresh-tokens` 엔드포인트로 모든 계정 일괄 토큰 갱신 기능
- ✅ **IMPROVED: 다운로드 안정성** - 토큰 만료 시 자동 갱신 후 재시도, 폴백 계정 검색으로 서비스 중단 방지
- ✅ **UI: 토큰 갱신 버튼** - 관리자 페이지에서 원클릭 토큰 갱신, 실시간 상태 표시 및 토스트 알림
- ✅ **COMPLETE: 폴더 구조 업로드 시스템** - MaruCS-Sync > 카테고리별 폴더에 자동 업로드 완료 (04:49)
- ✅ **WORKING: 백업 업로드 시스템** - 모든 활성 계정에 동일 폴더 구조로 자동 백업 (1분 내 완료)
- ✅ **STANDARDIZED: 폴더명 통일** - Archive → other, 카테고리명과 폴더명 완전 일치
- ✅ **COMPLETE: UI 개선** - 톱니바퀴 버튼을 명확한 드롭다운 메뉴로 교체, 각 기능별 아이콘과 설명 텍스트 추가 (03:15)
- ✅ **ENHANCED: 계정 관리 기능** - 활성화/비활성화 토글 메뉴, 토큰 재인증 메뉴, 기본 계정 보호 기능 구현
- ✅ **ADDED: 토큰 갱신 UI** - 만료된 토큰에 대해 드롭다운 메뉴에서 재인증 가능
- ✅ **COMPLETE: Google Drive 바이러스 스캔 우회** - 새창 열림 없이 직접 다운로드 시스템 구현 (02:04)
- ✅ **ENHANCED: 파일 관리 UI 개선** - Google Drive 저장소에서 사용된 계정 이메일 표시
- ✅ **IMPLEMENTED: 다운로드 폴백 시스템** - 메인 계정 실패 시 다른 Google Drive 계정에서 자동 검색 및 다운로드
- ✅ **ADDED: 자동 백업 업로드** - 파일 업로드 시 모든 활성 Google Drive 계정에 백업 자동 생성
- ✅ **OPTIMIZED: 스트림 다운로드** - Google Drive API 스트림으로 27초 내 대용량 파일(175MB) 처리
- ✅ **COMPLETE: Google Cloud Console 설정 가이드 완성** - 5단계 상세 설정 과정, URI 복사 버튼 포함 (13:00)
- ✅ **ENHANCED: URI 설정 가이드** - JavaScript 원본/리디렉션 URI 복사 버튼과 명확한 안내 추가
- ✅ **CLARIFIED: 환경변수 설정** - 다중 계정 지원 시 환경변수 한 번만 설정하면 됨을 명시
- ✅ **COMPLETE: ES6 모듈 오류 수정** - require() → import 구문으로 변경 완료 (12:35)
- ✅ **WORKING: 자동 토큰 갱신 기능** - Google Drive 토큰 만료 시 자동 새로 고침 로직 추가
- ✅ **FIXED: TypeScript 컴파일 오류** - API 응답 타입 안전성 개선 및 null 체크 강화
- 🎉 **OAUTH 인증 성공!** Google Drive 연동 완료 (07:13)
- ✅ **COMPLETE: Google Cloud Console 설정 완료** - 모든 OAuth 설정이 정상 작동
- ✅ **WORKING: 파일 업로드 시스템** - Google Drive 연동으로 클라우드 파일 관리 가능
- 🔄 **TOKEN REFRESH PENDING: 기본 계정 토큰 만료** - 재인증 예정 (introsara@gmail.com, ottmaru1@gmail.com)
- ✅ **GUIDE COMPLETE: Google+ API 안내** - 2019년 서비스 종료로 불필요함을 가이드에 명시
- RESOLVED: Google OAuth redirect URI mismatch - 구글 클라우드 콘솔 설정 완료로 해결
- CONFIRMED: spock.replit.dev 도메인으로 외부 API 접근 정상 작동

## Previous Changes (January 8, 2025)
- COMPLETED: Full bright theme conversion for all service pages (OTT PLUS, StreamPlayer, NoHard System, Netflix Account)
- COMPLETED: Admin page bright theme conversion with enhanced text visibility
- COMPLETED: Main pages bright theme conversion (home, about, success stories, downloads)
- COMPLETED: Price management system implementation with database integration
- COMPLETED: Admin pricing management page (/admin/pricing) for service packages and StreamPlayer options
- COMPLETED: Text visibility improvements in pricing calculator with darker text colors
- COMPLETED: Admin password change functionality with secure validation and environment variable instructions
- COMPLETED: Color consistency fix - download button colors now match category display colors for visual cohesion
- COMPLETED: GitHub repository integration with private security settings
- COMPLETED: Local development environment diagnosis and troubleshooting
- CRITICAL: All pages now prioritize text visibility with high contrast ratios and dark text on light backgrounds
- DESIGN STANDARD: Gray-50 backgrounds, white cards, blue gradients, shadow effects for consistency
- COLOR MAPPING: StreamPlayer=green, OTT PLUS=blue, NoHard=purple, Manual=orange, Other=gray (consistent across downloads page and admin interface)
- NAVIGATION FIX: Hero section "서비스 둘러보기" button now properly scrolls to services section
- NAVIGATION FIX: All service cards "자세히 보기" buttons now navigate to page top instead of middle
- NAVIGATION FIX: Success stories mini cards "자세히 보기" buttons now navigate to page top
- UX IMPROVEMENT: Implemented programmatic navigation with multiple scroll attempts for reliable page-top positioning
- INTEGRATION: Pricing management fully integrated into admin sidebar menu (no separate page navigation)
- SECURITY: Admin password change accessible from sidebar with current password verification and clear instructions for updating environment variables
- SECURITY: GitHub repository set to private for source code protection
- DATA INTEGRITY: File upload categories restored to original service-based structure (ott-plus, streamplayer, nohard, manual, other)
- LOCAL DEVELOPMENT: Successfully resolved Windows PowerShell issues using npm run build + npx serve approach
- LOCAL SUCCESS: MaruComSys website running locally with VS Code integration
- VS CODE INTEGRATION: Complete development environment setup with proper file structure and static serving
- BUILD OPTIMIZATION: Fixed HTML/JS/CSS file paths and asset loading for local development
- LOCAL STATUS: VS Code환경 설정 완료, React 앱 로딩 이슈 있음 (추후 해결 필요)
- WORKING SOLUTION: Replit 환경에서 모든 기능 완벽 작동, 로컬은 추가 디버깅 필요

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing with pages for home, about, services, success stories, downloads, contact, and admin
- **UI Framework**: Shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **State Management**: TanStack Query for server state management and form handling with React Hook Form
- **File Management**: Complete admin interface for file uploads with category management and download tracking
- **Styling**: Tailwind CSS with custom design tokens, glass morphism effects, and Korean font support (Noto Sans KR)

## Backend Architecture
- **Runtime**: Node.js with Express.js server
- **API Design**: RESTful API with endpoints for inquiry management (/api/inquiries), download management (/api/downloads), and Google Drive integration (/api/google-drive)
- **File Upload**: Multer middleware for handling file uploads with Google Drive cloud storage
- **OAuth Integration**: Google OAuth 2.0 with automatic token refresh system using refresh tokens (5-minute expiry buffer)
- **Data Storage**: PostgreSQL database with Drizzle ORM for downloads, inquiries, and Google Drive account management
- **Development**: Hot module replacement with Vite integration for seamless development experience

## Data Storage Solutions
- **Database**: PostgreSQL database with persistent DatabaseStorage (no longer using memory storage)
- **ORM**: Drizzle ORM for type-safe database operations with complete CRUD operations
- **File Storage**: Local file system storage in /uploads directory with multer integration
- **Schema**: Multiple tables including downloads, service_packages, streamplayer_options for comprehensive data management
- **Price Management**: ServicePackages table for dynamic pricing with different service types and pricing models
- **Critical Fix**: Migrated from MemStorage to DatabaseStorage to prevent data loss on server restart

## Authentication and Authorization
- **Admin Authentication**: Session-based authentication with ADMIN_PASSWORD environment variable (default: 'admin123')
- **Password Management**: Complete password change functionality with current password verification and secure validation
- **Session Management**: Express session configuration with connect-pg-simple for PostgreSQL session store
- **Security Features**: Admin access control for all management functions and secure API endpoints
- **Environment Integration**: Clear instructions for updating ADMIN_PASSWORD through Replit Secrets for production security

## External Dependencies
- **Database**: Neon serverless PostgreSQL configured through DATABASE_URL environment variable
- **Cloud Storage**: Google Drive API v3 with OAuth 2.0 authentication and automatic token refresh system
- **Environment Secrets**: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI for OAuth integration
- **UI Components**: Extensive Radix UI component library for accessible, unstyled primitives
- **Form Validation**: Zod for type-safe schema validation integrated with React Hook Form
- **Development Tools**: Replit-specific plugins for development environment integration
- **Build Tools**: ESBuild for server bundling, Vite for client bundling with TypeScript support