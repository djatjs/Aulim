package com.aulim.dto;

import com.aulim.domain.Part;
import com.aulim.domain.PostStatus;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

public class RecruitPostDto {

    @Data
    public static class CreateRequest {
        private String title;
        private String singer;
        private String songName;
        private String targetPerformance;
        private String referenceLink;
        private String content;
        private List<SessionRequest> sessions;
    }

    @Data
    public static class SessionRequest {
        private Part part;
        private int count;
    }

    @Data
    public static class Response {
        private Long id;
        private String title;
        private String singer;
        private String songName;
        private String targetPerformance;
        private String referenceLink;
        private String content;
        private String authorName;
        private String authorEmail;
        private PostStatus status;
        private LocalDateTime createdAt;
        private List<SessionResponse> sessions;
        private List<ApplicationResponse> applications;
    }

    @Data
    public static class ApplicationResponse {
        private Long id;
        private String applicantName;
        private String applicantEmail;
        private Part part;
        private String message;
        private com.aulim.domain.ApplicationStatus status;
    }

    @Data
    public static class SessionResponse {
        private Long id;
        private Part part;
        private int count;
        private int currentCount;
    }

    @Data
    public static class ApplicationRequest {
        private Part part;
        private String message;
    }
}
