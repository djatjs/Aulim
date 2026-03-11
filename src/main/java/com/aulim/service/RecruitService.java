package com.aulim.service;

import com.aulim.domain.Team;
import com.aulim.domain.ApplicationStatus;
import com.aulim.domain.Member;
import com.aulim.domain.Notification;
import com.aulim.domain.PostStatus;
import com.aulim.domain.RecruitmentApplication;
import com.aulim.domain.RecruitmentPost;
import com.aulim.domain.RecruitmentSession;
import com.aulim.dto.RecruitPostDto;
import com.aulim.repository.MemberRepository;
import com.aulim.repository.NotificationRepository;
import com.aulim.repository.RecruitmentApplicationRepository;
import com.aulim.repository.RecruitmentRepository;
import com.aulim.repository.RecruitmentSessionRepository;
import com.aulim.repository.TeamRepository;
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
    private final NotificationRepository notificationRepository;

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

        if (request.getSessions() != null) {
            List<RecruitmentSession> existingSessions = post.getSessions();
            List<RecruitPostDto.SessionRequest> requestedSessions = request.getSessions();

            // 1. Update existing or Add new
            for (RecruitPostDto.SessionRequest reqSession : requestedSessions) {
                RecruitmentSession existing = existingSessions.stream()
                        .filter(s -> s.getPart() == reqSession.getPart())
                        .findFirst()
                        .orElse(null);

                if (existing != null) {
                    if (reqSession.getCount() < existing.getCurrentCount()) {
                        throw new IllegalArgumentException(reqSession.getPart() + " 세션의 모집 인원은 이미 수락된 인원(" + existing.getCurrentCount() + "명)보다 적을 수 없습니다.");
                    }
                    existing.setCount(reqSession.getCount());
                } else {
                    RecruitmentSession newSession = new RecruitmentSession();
                    newSession.setPost(post);
                    newSession.setPart(reqSession.getPart());
                    newSession.setCount(reqSession.getCount());
                    sessionRepository.save(newSession);
                    existingSessions.add(newSession);
                }
            }

            // 2. Remove deleted
            List<RecruitmentSession> toRemove = existingSessions.stream()
                    .filter(existing -> requestedSessions.stream().noneMatch(req -> req.getPart() == existing.getPart()))
                    .collect(Collectors.toList());

            for (RecruitmentSession sessionToRemove : toRemove) {
                boolean hasApplicants = applicationRepository.findByPost(post).stream()
                        .anyMatch(app -> app.getPart() == sessionToRemove.getPart());
                if (hasApplicants) {
                    throw new IllegalStateException(sessionToRemove.getPart() + " 세션에 이미 지원자가 존재하여 삭제할 수 없습니다.");
                }
                sessionRepository.delete(sessionToRemove);
                existingSessions.remove(sessionToRemove);
            }
        }
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

    @Transactional
    public void closePost(Long postId, String email) {
        RecruitmentPost post = recruitmentRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시글을 찾을 수 없습니다."));

        if (!post.getAuthor().getEmail().equals(email)) {
            throw new SecurityException("작성자만 마감할 수 있습니다.");
        }

        if (post.getStatus() == PostStatus.COMPLETED) {
            throw new IllegalStateException("이미 인원이 가득 차서 완료된 구인글입니다.");
        }

        post.setStatus(PostStatus.CLOSED);
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

        // 작성자에게 새로운 지원자 알림 발송
        createNotification(
            post.getAuthor(), 
            "게시글 '" + post.getTitle() + "'에 새로운 지원자(" + applicant.getName() + " - " + request.getPart() + ")가 신청했습니다.", 
            "/recruits/" + post.getId()
        );
    }

    @Transactional
    public void cancelApplication(Long applicationId, String email) {
        RecruitmentApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("지원 내역을 찾을 수 없습니다."));

        if (!application.getApplicant().getEmail().equals(email)) {
            throw new SecurityException("본인의 지원 내역만 취소할 수 있습니다.");
        }

        if (application.getStatus() == ApplicationStatus.ACCEPTED) {
            revertAcceptance(application);
        }

        applicationRepository.delete(application);
    }

    @Transactional
    public void rejectApplication(Long applicationId, String hostEmail) {
        RecruitmentApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new IllegalArgumentException("신청을 찾을 수 없습니다."));

        if (!application.getPost().getAuthor().getEmail().equals(hostEmail)) {
            throw new SecurityException("작성자만 거절 처리를 할 수 있습니다.");
        }

        if (application.getStatus() == ApplicationStatus.ACCEPTED) {
            revertAcceptance(application);
        } else if (application.getStatus() != ApplicationStatus.PENDING) {
            throw new IllegalStateException("이미 처리된 신청입니다.");
        }

        application.setStatus(ApplicationStatus.REJECTED);
        createNotification(application.getApplicant(), "지원하신 '" + application.getPost().getTitle() + "' 합주에 아쉽게도 합류하지 못했습니다 (혹은 하차 처리되었습니다).", "/recruits/" + application.getPost().getId());
    }

    private void revertAcceptance(RecruitmentApplication application) {
        RecruitmentPost post = application.getPost();

        // 1. Decrease session count
        RecruitmentSession targetSession = post.getSessions().stream()
                .filter(s -> s.getPart().equals(application.getPart()))
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("해당 세션을 찾을 수 없습니다."));
                
        targetSession.setCurrentCount(Math.max(0, targetSession.getCurrentCount() - 1));

        // 2. Revert post status to OPEN if it was COMPLETED
        if (post.getStatus() == PostStatus.COMPLETED) {
            post.setStatus(PostStatus.OPEN);
        }

        // 3. (Optional) Remove member from team if exists
        Team team = application.getApplicant().getTeam();
        if (team != null && team.getName().equals(post.getSongName() + " 팀")) {
            application.getApplicant().setTeam(null);
            // If team becomes empty (only author remains), could potentially delete team, but leaving it for now.
        }
    }

    private void createNotification(Member member, String message, String relatedUrl) {
        Notification notification = new Notification();
        notification.setMember(member);
        notification.setMessage(message);
        notification.setRelatedUrl(relatedUrl);
        notificationRepository.save(notification);
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
        
        createNotification(application.getApplicant(), "축하합니다! '" + post.getTitle() + "' 합주 팀 합류가 확정되었습니다.", "/recruits/" + post.getId());

        // 모든 세션이 완료되었는지 확인
        boolean allFinished = post.getSessions().stream()
                .allMatch(s -> s.getCurrentCount() >= s.getCount());

        if (allFinished && post.getStatus() != PostStatus.CLOSED) {
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
