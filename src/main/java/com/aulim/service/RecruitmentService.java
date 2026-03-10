package com.aulim.service;

import com.aulim.domain.*;
import com.aulim.repository.MemberRepository;
import com.aulim.repository.RecruitmentApplicationRepository;
import com.aulim.repository.RecruitmentRepository;
import com.aulim.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RecruitmentService {

    private final RecruitmentRepository recruitmentRepository;
    private final RecruitmentApplicationRepository applicationRepository;
    private final MemberRepository memberRepository;
    private final TeamRepository teamRepository;

    @Transactional
    public Long createPost(RecruitmentPost post) {
        return recruitmentRepository.save(post).getId();
    }

    @Transactional
    public void apply(Long postId, String email, Part part) {
        RecruitmentPost post = findOne(postId);
        Member applicant = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        RecruitmentApplication application = new RecruitmentApplication();
        application.setPost(post);
        application.setApplicant(applicant);
        application.setPart(part);
        application.setStatus(ApplicationStatus.PENDING);

        applicationRepository.save(application);
    }

    @Transactional
    public void completeRecruitment(Long postId) {
        RecruitmentPost post = findOne(postId);
        post.setStatus(PostStatus.COMPLETED);

        // 1. 새로운 팀 생성 (게시글 제목 활용)
        Team team = new Team(post.getTitle() + " 팀");
        teamRepository.save(team);

        // 2. 확정된 지원자들(ACCEPTED)을 팀 멤버로 추가
        List<RecruitmentApplication> applications = applicationRepository.findByPost(post);
        List<Member> acceptedMembers = applications.stream()
                .filter(app -> app.getStatus() == ApplicationStatus.ACCEPTED)
                .map(RecruitmentApplication::getApplicant)
                .collect(Collectors.toList());

        // 3. 게시글 작성자(팀장 등)가 있다면 추가 로직 필요 (현재는 지원자만 예시)
        for (Member member : acceptedMembers) {
            member.setTeam(team);
        }

        recruitmentRepository.save(post);
    }

    public List<RecruitmentPost> findAll() {
        return recruitmentRepository.findAll();
    }

    public RecruitmentPost findOne(Long id) {
        return recruitmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
    }
}
