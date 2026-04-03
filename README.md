# 🎸 Aulim (어울림)

**밴드 멤버 구인 및 연습실 예약 통합 플랫폼**

Aulim은 밴드 활동을 하는 분들이 멤버를 더 쉽게 구하고, 확정된 팀이 연습실을 효율적으로 예약할 수 있도록 돕는 서비스입니다. 

---

## 🚀 주요 기능

### 1. 밴드 멤버 구인 & 지원
- **구인 공고**: 보컬, 기타, 베이스 등 세션별로 필요한 인원을 설정하여 공고를 게시할 수 있습니다.
- **실시간 지원**: 사용자는 자신의 파트에 맞는 공고에 지원할 수 있으며, 팀장은 지원 현황을 한눈에 관리합니다.

### 2. 연습실 예약 시스템
- **팀 기반 예약**: 구인이 완료되어 '팀'이 생성되면 연습실 예약 권한이 부여됩니다.
- **예약 제한 로직**: 공정한 시설 이용을 위해 **팀당 하루 최대 2시간**으로 예약이 제한됩니다.
- **중복 예약 방지**: 동일한 시간대에 연습실이 중복 예약되지 않도록 철저한 검증 로직이 적용되어 있습니다.

### 3. 실시간 알림
- 지원 결과, 예약 확정 등 주요 이벤트 발생 시 사용자에게 실시간으로 알림을 전달합니다.

---

## 🛠 기술 스택

### Backend
- **Language**: Java 17
- **Framework**: Spring Boot 3.4.3
- **Security**: Spring Security, JWT (JSON Web Token)
- **Data Access**: Spring Data JPA
- **Database**: MySQL 8.0

### Frontend
- **Language**: TypeScript
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Radix UI, Lucide React

---

## ⚙️ 시작 가이드

### 환경 변수 설정
`src/main/resources/application.yml` (또는 properties) 파일에 DB 연결 정보를 설정해야 합니다.

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/aulim
    username: YOUR_USERNAME
    password: YOUR_PASSWORD
```

### 백엔드 실행
```bash
./gradlew bootRun
```

### 프론트엔드 실행
```bash
cd frontend
npm install
npm run dev
```

---

## 📂 프로젝트 구조

```text
aulim/
├── src/main/java/com/aulim/  # Backend Service
│   ├── controller/           # API Endpoints
│   ├── domain/               # JPA Entities
│   ├── dto/                  # Data Transfer Objects
│   ├── repository/           # Data Access Layer
│   └── service/              # Business Logic
└── frontend/                 # Frontend (Next.js)
    ├── src/app/              # App Router Pages
    └── src/components/       # Reusable UI Components
```
