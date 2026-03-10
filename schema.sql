-- Aulim 서비스 통합 DB 초기화 스크립트
DROP DATABASE IF EXISTS     aulim;
CREATE DATABASE     aulim;
USE     aulim;

-- 1. 팀(Team) 테이블
-- 구인 완료 후 확정된 팀 정보를 저장합니다.
CREATE TABLE team (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- 2. 회원(Member) 테이블
-- 사용자의 기본 정보와 주요 세션(보컬, 악기 등) 정보를 저장합니다.
CREATE TABLE member (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    main_part ENUM('VOCAL', 'GUITAR', 'BASS', 'DRUM', 'PIANO') NOT NULL,
    experience_years INT DEFAULT 0,
    phone VARCHAR(20),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    team_id BIGINT,
    FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE SET NULL
);

-- 3. 구인 게시판(Recruitment Post) 테이블
CREATE TABLE recruitment_post (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    status ENUM('OPEN', 'COMPLETED') DEFAULT 'OPEN',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE CASCADE
);

-- 4. 구인 세션(Recruitment Session) 테이블
-- 공고별로 모집하는 파트와 인원을 관리합니다.
CREATE TABLE recruitment_session (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    part ENUM('VOCAL', 'GUITAR', 'BASS', 'DRUM', 'PIANO') NOT NULL,
    count INT NOT NULL,
    current_count INT DEFAULT 0,
    FOREIGN KEY (post_id) REFERENCES recruitment_post(id) ON DELETE CASCADE
);

-- 5. 구인 지원(Recruitment Application) 테이블
-- 사용자들이 공고에 지원한 현황을 관리합니다.
CREATE TABLE recruitment_application (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    applicant_id BIGINT NOT NULL,
    part ENUM('VOCAL', 'GUITAR', 'BASS', 'DRUM', 'PIANO') NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED') DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES recruitment_post(id) ON DELETE CASCADE,
    FOREIGN KEY (applicant_id) REFERENCES member(id) ON DELETE CASCADE
);

-- 6. 연습실(Room) 테이블
CREATE TABLE room (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    capacity INT
);

-- 7. 예약(Reservation) 테이블
-- 팀별 하루 2시간 제한 로직의 대상입니다.
CREATE TABLE reservation (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL, 
    room_id BIGINT NOT NULL,
    start_at DATETIME NOT NULL,
    end_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES team(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES member(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE
);

-- 데이터 초기화
INSERT INTO room (name, location, capacity) VALUES ('A룸', '1층', 5);
INSERT INTO room (name, location, capacity) VALUES ('B룸', '1층', 3);
INSERT INTO room (name, location, capacity) VALUES ('C룸', '2층', 8);
