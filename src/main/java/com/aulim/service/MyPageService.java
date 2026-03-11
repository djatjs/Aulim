package com.aulim.service;

import com.aulim.domain.Member;
import com.aulim.dto.MyPageSummaryDto;
import com.aulim.repository.MemberRepository;
import com.aulim.repository.RecruitmentApplicationRepository;
import com.aulim.repository.RecruitmentRepository;
import com.aulim.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MyPageService {

        private final MemberRepository memberRepository;
        private final RecruitmentRepository recruitmentRepository;
        private final ReservationRepository reservationRepository;
        private final RecruitmentApplicationRepository applicationRepository;

        public MyPageSummaryDto getSummary(String email) {
                Member member = memberRepository.findByEmail(email)
                                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

                // 내가 작성한 구인 게시글
                List<MyPageSummaryDto.PostSummary> myPosts = recruitmentRepository.findByAuthor(member).stream()
                                .map(post -> MyPageSummaryDto.PostSummary.builder()
                                                .id(post.getId())
                                                .title(post.getTitle())
                                                .singer(post.getSinger())
                                                .songName(post.getSongName())
                                                .authorEmail(post.getAuthor().getEmail())
                                                .status(post.getStatus())
                                                .build())
                                .collect(Collectors.toList());

                // 내가 지원한 구인 게시글
                List<MyPageSummaryDto.AppliedPostSummary> appliedPosts = applicationRepository.findByApplicantEmail(email).stream()
                                .map(app -> MyPageSummaryDto.AppliedPostSummary.builder()
                                                .id(app.getId())
                                                .postId(app.getPost().getId())
                                                .title(app.getPost().getTitle())
                                                .singer(app.getPost().getSinger())
                                                .songName(app.getPost().getSongName())
                                                .appliedPart(app.getPart())
                                                .status(app.getStatus())
                                                .build())
                                .collect(Collectors.toList());

                // 소속 팀 예약 현황 (현재 시간 이후)
                List<MyPageSummaryDto.ReservationSummary> teamReservations = Collections.emptyList();
                if (member.getTeam() != null) {
                        teamReservations = reservationRepository.findAll().stream()
                                        .filter(res -> member.getTeam().equals(res.getTeam()))
                                        .filter(res -> res.getStartAt().isAfter(LocalDateTime.now()))
                                        .map(res -> MyPageSummaryDto.ReservationSummary.builder()
                                                        .id(res.getId())
                                                        .roomName(res.getRoom().getName())
                                                        .startAt(res.getStartAt())
                                                        .endAt(res.getEndAt())
                                                        .build())
                                        .collect(Collectors.toList());
                }

                return MyPageSummaryDto.builder()
                                .name(member.getName())
                                .mainPart(member.getMainPart())
                                .myPosts(myPosts)
                                .appliedPosts(appliedPosts)
                                .teamReservations(teamReservations)
                                .build();
        }
}
