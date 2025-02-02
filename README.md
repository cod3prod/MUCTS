# 📎 PROJECT :: MUCTS

![thumbnail](https://res.cloudinary.com/dab5xf29a/image/upload/v1738451235/mucts_a1stfp.png)

## 👀 서비스 소개

- 서비스명: MUCTS
- 서비스 설명: 1인 가구를 위한 따뜻한 한 끼 플랫폼
  <br>

## 📅 프로젝트 기간

- **개발** : 2024.07.22 ~ 2024.08.02 (2주)
- **마이그레이션** : 2024.12.08 ~ 2024.12.25 (2주)
  <br>

## ⭐ 주요 기능

- **메인 페이지**

  - 현재 참여할 수 있는 채팅방 목록을 불러옴
  - 기존 채팅에 참여하거나 새 채팅방을 만들 수 있음

- **회원가입**

  - 이메일, 비밀번호, 닉네임 등의 유효성을 검사하여 가입 가능
  - 비밀번호는 암호화하여 저장
  - 중복된 이메일 방지

- **로그인 / 로그아웃**

  - 서비스 사용을 위해 로그인 필수
  - 해시된 비밀번호를 비교하여 인증 수행
  - `local` 인증 및 `JWT`를 활용하여 로그인 상태 유지
  - 토큰 만료 시 `refresh token`을 통해 자동 갱신

- **프로필**

  - `PATCH` 요청으로 선택한 정보만 수정 가능
  - 비밀번호 변경 기능 제공

- **채팅방 만들기**

  - 채팅방 제목을 입력하여 생성 가능
  - 채팅방을 만드는 사용자는 다른 채팅방에 참여 중이어선 안 됨

- **채팅방 수정**

  - 채팅방 제목 변경 가능
  - 생성한 사용자만 수정할 수 있음

- **채팅 내역 저장**

  - 데이터베이스와 연동하여 채팅 내역을 저장 및 불러옴
  - 메시지는 타임스탬프와 함께 저장

- **내 채팅**

  - 현재 참여 중인 채팅 목록을 확인 가능
  - 상단 메뉴에서 빠르게 접근 가능

- **중복 채팅 참여 방지**

  - 이미 참여 중인 채팅방에 중복 참여할 수 없도록 제한

- **참여하고 있는 채팅 인원수 파악**

  - 실시간으로 채팅에 참여 중인 인원을 표시
  - 인원이 변동될 때 즉시 업데이트

- **채팅 나가기**

  - 채팅방을 나가면 변경 사항이 데이터베이스에 즉시 반영됨
  - 방장이 나가면 채팅방이 자동으로 폐쇄됨

- **반응형 디자인 지원**
  - 모바일, 태블릿, PC에서 최적화된 UI 제공
  - 화면 크기에 따라 자동으로 레이아웃 조정
  - 채팅 입력창 및 메시지 리스트가 유동적으로 조정됨

## 🔨 기술 스택

<table>
    <tr>
        <th>구분</th>
        <th>내용</th>
    </tr>
    <tr>
        <td>사용 언어</td>
        <td>
            <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>클라이언트</td>
        <td>
            <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=Next.js&logoColor=white"/>
            <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=TailwindCSS&logoColor=white"/>
            <img src="https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=Zustand&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>서버</td>
        <td>
            <img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=NestJS&logoColor=white"/>
            <img src="https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=Socket.IO&logoColor=white"/>
            <img src="https://img.shields.io/badge/TypeORM-FF5733?style=for-the-badge&logo=TypeORM&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>데이터베이스</td>
        <td>
            <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white"/>
            <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=Supabase&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>빌드 도구</td>
        <td>
            <img src="https://img.shields.io/badge/Turbopack-000000?style=for-the-badge&logo=Vercel&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>호스팅</td>
        <td>
            <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=Vercel&logoColor=white"/>
            <img src="https://img.shields.io/badge/Render-00B3E3?style=for-the-badge&logo=Render&logoColor=white"/>
        </td>
    </tr>
    <tr>
        <td>버전 관리</td>
        <td>
            <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white"/>
            <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white"/>
        </td>
    </tr>
</table>
<br>

## 🖥 주요 화면 구성

### 인증 / 회원가입 / 로그인

![image](https://res.cloudinary.com/dab5xf29a/image/upload/v1738471883/1_qrqeet.png)
<br>

### 메인 페이지

![image](https://res.cloudinary.com/dab5xf29a/image/upload/v1738471894/2_bcxvyb.png)
<br>

### 채팅

![image](https://res.cloudinary.com/dab5xf29a/image/upload/v1738471905/3_mcidxe.png)
<br>

### 프로필

![image](https://res.cloudinary.com/dab5xf29a/image/upload/v1738471914/4_in7yva.png)
<br>

## 📂 프로젝트 구조

```
mucts/
├── client/                      # Next.js 클라이언트 애플리케이션
│   ├── public/                  # 정적 파일 (이미지, 아이콘 등)
│   └── src/                     # Next.js 소스 코드
│       ├── app/                 # Next.js App Router
│       │   ├── (auth)/          # 인증 관련 페이지
│       │   ├── (chat)/          # 채팅 관련 페이지
│       │   ├── (profile)/       # 프로필 관련 페이지
│       │   └── (root)/          # 메인 페이지
│       ├── assets/              # 정적 에셋
│       ├── components/          # 재사용 가능한 UI 컴포넌트
│       │   ├── layout/          # 레이아웃 관련 컴포넌트
│       │   └── ui/              # UI 컴포넌트 (버튼, 입력창 등)
│       ├── hooks/               # 커스텀 React 훅
│       ├── libs/                # 외부 라이브러리 (Socket.IO 등)
│       ├── styles/              # 스타일 (CSS 또는 SCSS)
│       ├── types/               # TypeScript 타입 정의
│       └── zustand/             # Zustand 상태 관리 로직
└── server/                      # NestJS 서버 애플리케이션
    └── src/                     # NestJS 소스 코드
        ├── auth/                # 인증 관련 모듈
        │   ├── config/          # 인증 설정 (JWT, OAuth 등)
        │   ├── decorators/      # 커스텀 데코레이터
        │   ├── dtos/            # 데이터 전송 객체 (DTO)
        │   ├── enums/           # 열거형 (Enum)
        │   ├── guards/          # 인증/권한 가드
        │   ├── interfaces/      # 인증 관련 인터페이스
        │   └── providers/       # 인증 관련 서비스
        ├── chats/               # 채팅 관련 모듈
        │   ├── dtos/            # 채팅 관련 DTO
        │   └── providers/       # 채팅 관련 서비스
        ├── common/              # 공통 모듈
        │   └── interfaces/      # 공통 인터페이스
        ├── config/              # 서버 설정 (환경 변수, 데이터베이스 등)
        └── messages/            # 메시지 관련 모듈
            ├── dtos/            # 메시지 관련 DTO
            └── providers/       # 메시지 관련 서비스
```

<br>

## ⚙️ **프로젝트 설정**

```bash
# NestJS(./server)
npm i && npm run start

# Next.js (./client) 로컬 개발 환경 (포트 4000 지정)
npm i && npm run dev -- -p 4000
```
