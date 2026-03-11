package com.aulim.dto;

import com.aulim.domain.Part;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class MyPageSummaryDto {
    private String name;
    private Part mainPart;
    private List<PostSummary> myPosts;
    private List<AppliedPostSummary> appliedPosts;
    private List<ReservationSummary> teamReservations;

    @Getter
    @Builder
    public static class PostSummary {
        private Long id;
        private String title;
        private String singer;
        private String songName;
        private String authorEmail;
        private com.aulim.domain.PostStatus status;
    }

    @Getter
    @Builder
    public static class AppliedPostSummary {
        private Long id; // Application Id
        private Long postId;
        private String title;
        private String singer;
        private String songName;
        private Part appliedPart;
        private com.aulim.domain.ApplicationStatus status;
    }

    @Getter
    @Builder
    public static class ReservationSummary {
        private Long id;
        private String roomName;
        private LocalDateTime startAt;
        private LocalDateTime endAt;
    }
}
