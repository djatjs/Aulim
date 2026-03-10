package com.aulim.service;

import com.aulim.domain.*;
import com.aulim.dto.RecruitPostDto;
import com.aulim.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RecruitService {

    private final RecruitmentRepository recruitmentRepository;
    private final RecruitmentSessionRepository sessionRepository;
    private final RecruitmentApplicationRepository applicationRepository;
    private final MemberRepository memberRepository;
    private final TeamRepository teamRepository;

    @Transactional
    public Long createPost(String email, RecruitPostDto.CreateRequest request) {
        Member author = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("작성자를 찾을 수 없습니다."));

        RecruitmentPost post = new RecruitmentPost();
        post.setAuthor(author);
        post.setTitle(request.getTitle());
        post.setSinger(request.getSinger());
        post.setSongName(request.getSongName());
        post.setTargetPerformance(request.getTargetPerformance());
        post.setReferenceLink(request.getReferenceLink());
        post.setContent(request.getContent());

        RecruitmentPost savedPost = recruitmentRepository.save(post);

        for (RecruitPostDto.SessionRequest sessionReq : request.getSessions()) {
            RecruitmentSession session = new RecruitmentSession();
            session.setPost(savedPost);
            session.setPart(sessionReq.getPart());
            session.setCount(sessionReq.getCount());
            sessionRepository.save(session);
        }

        return savedPost.getId();
    }

    @Transactional
    public void updatePost(Long postId, String email, RecruitPostDto.CreateRequest request) {
        RecruitmentPost post = recruitmentRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (!post.getAuthor().getEmail().equals(email)) {
            throw new SecurityException("작성자만 수정할 수 있습니다.");
        }

        post.setTitle(request.getTitle());
        post.setSinger(request.getSinger());
        post.setSongName(request.getSongName());
        post.setTargetPerformance(request.getTargetPerformance());
        post.setReferenceLink(request.getReferenceLink());
        post.setContent(request.getContent());
        // 세션 정보는 단순 정보 수정에서는 일단 제외하거나, 로직이 복잡해지므로 Post 정보만 우선 처리
    }

    @Transactional
    public void deletePost(Long postId, String email) {
        RecruitmentPost post = recruitmentRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (!post.getAuthor().getEmail().equals(email)) {
            throw new SecurityException("작성자만 삭제할 수 있습니다.");
        }

        recruitmentRepository.delete(post);
    }

    public List<RecruitPostDto.Response> getAllPosts() {
        return recruitmentRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public void apply(Long postId, String email, RecruitPostDto.ApplicationRequest request) {
        RecruitmentPost post = recruitmentRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
        Member applicant = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("지원자를 찾을 수 없습니다."));

        if (post.getAuthor().equals(applicant)) {
            throw new IllegalArgumentException("자신의 게시글에는 신청할 수 없습니다.");
        }

        boolean alreadyApplied = applicationRepository.findByPost(post).stream()
                .anyMatch(a -> a.getApplicant().equals(applicant));
        if (alreadyApplied) {
            throw new IllegalStateException("이미 신청한 게시글입니다.");
        }

        RecruitmentApplication application = new RecruitmentApplication();
        application.setPost(post);
        application.setApplicant(applicant);
        application.setPart(request.getPart());
        application.setMessage(request.getMessage());

        applicationRepository.save(application);
    }

    @Transactional
    public void acceptApplication(Long applicationId, String hostEmail) {
        RecruitmentApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("신청을 찾을 수 없습니다."));

        if (!application.getPost().getAuthor().getEmail().equals(hostEmail)) {
            throw new SecurityException("작성자만 수락 처리를 할 수 있습니다.");
        }

        if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalStateException("이미 처리된 신청입니다.");
        }

        RecruitmentPost post = application.getPost();

        // 해당 세션 찾기
        RecruitmentSession targetSession = post.getSessions().stream()
                .filter(s -> s.getPart().equals(application.getPart()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("해당 세션 모집 정보가 없습니다."));

        if (targetSession.getCurrentCount() >= targetSession.getCount()) {
            throw new IllegalStateException("해당 세션은 이미 모집이 완료되었습니다.");
        }

        // 수락 처리
        application.setStatus(ApplicationStatus.ACCEPTED);
        targetSession.setCurrentCount(targetSession.getCurrentCount() + 1);

        // 모든 세션이 완료되었는지 확인
        boolean allFinished = post.getSessions().stream()
                .allMatch(s -> s.getCurrentCount() >= s.getCount());

        if (allFinished) {
            post.setStatus(PostStatus.COMPLETED);
            createTeamFromPost(post);
        }
    }

    private void createTeamFromPost(RecruitmentPost post) {
        Team team = new Team(post.getSongName() + " 팀");
        team.setDescription(post.getTargetPerformance() + " 공연을 위한 프로젝트 팀입니다.");
        Team savedTeam = teamRepository.save(team);

        // 작성자 및 수락된 지원자들을 팀에 배정
        post.getAuthor().setTeam(savedTeam);

        List<RecruitmentApplication> acceptedApps = applicationRepository.findByPost(post).stream()
                .filter(a -> a.getStatus() == ApplicationStatus.ACCEPTED)
                .collect(Collectors.toList());

        for (RecruitmentApplication app : acceptedApps) {
            app.getApplicant().setTeam(savedTeam);
        }
    }

    public RecruitmentPost getPostById(Long id) {
        return recruitmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));
    }

    public RecruitPostDto.Response convertToDto(RecruitmentPost post) {
        RecruitPostDto.Response dto = new RecruitPostDto.Response();
        dto.setId(post.getId());
        dto.setTitle(post.getTitle());
        dto.setSinger(post.getSinger());
        dto.setSongName(post.getSongName());
        dto.setTargetPerformance(post.getTargetPerformance());
        dto.setReferenceLink(post.getReferenceLink());
        dto.setContent(post.getContent());
        dto.setAuthorName(post.getAuthor().getName());
        dto.setAuthorEmail(post.getAuthor().getEmail());
        dto.setStatus(post.getStatus());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setSessions(post.getSessions().stream()
                .map(s -> {
                    RecruitPostDto.SessionResponse sDto = new RecruitPostDto.SessionResponse();
                    sDto.setId(s.getId());
                    sDto.setPart(s.getPart());
                    sDto.setCount(s.getCount());
                    sDto.setCurrentCount(s.getCurrentCount());
                    return sDto;
                }).collect(Collectors.toList()));

        dto.setApplications(applicationRepository.findByPost(post).stream()
                .map(a -> {
                    RecruitPostDto.ApplicationResponse aDto = new RecruitPostDto.ApplicationResponse();
                    aDto.setId(a.getId());
                    aDto.setApplicantName(a.getApplicant().getName());
                    aDto.setApplicantEmail(a.getApplicant().getEmail());
                    aDto.setPart(a.getPart());
                    aDto.setMessage(a.getMessage());
                    aDto.setStatus(a.getStatus());
                    return aDto;
                }).collect(Collectors.toList()));

        return dto;
    }
}
