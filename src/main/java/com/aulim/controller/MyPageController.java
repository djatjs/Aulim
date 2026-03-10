package com.aulim.controller;

import com.aulim.domain.RecruitmentApplication;
import com.aulim.domain.Reservation;
import com.aulim.repository.RecruitmentApplicationRepository;
import com.aulim.repository.ReservationRepository;
import com.aulim.dto.MyPageSummaryDto;
import com.aulim.service.MyPageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mypage")
@RequiredArgsConstructor
public class MyPageController {

    private final RecruitmentApplicationRepository applicationRepository;
    private final ReservationRepository reservationRepository;
    private final MyPageService myPageService;

    @GetMapping("/summary")
    public ResponseEntity<MyPageSummaryDto> getSummary(Authentication authentication) {
        return ResponseEntity.ok(myPageService.getSummary(authentication.getName()));
    }

    /**
     * 내 구인 현황 조회
     * (내가 지원한 내역을 반환)
     */
    @GetMapping("/recruitments")
    public ResponseEntity<List<RecruitmentApplication>> getMyRecruitments(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(applicationRepository.findByApplicantEmail(email));
    }

    /**
     * 내 예약 현황 조회
     * (내가 속한 팀의 당일 이후 예약 내역을 반환)
     */
    @GetMapping("/reservations")
    public ResponseEntity<List<Reservation>> getMyReservations(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(reservationRepository.findByMemberEmail(email));
    }
}
