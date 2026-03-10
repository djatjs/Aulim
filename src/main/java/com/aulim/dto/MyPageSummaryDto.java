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
    private int experienceYears;
    private List<PostSummary> myPosts;
    private List<ReservationSummary> teamReservations;

    @Getter
    @Builder
    public static class PostSummary {
        private Long id;
        private String title;
        private String singer;
        private String songName;
        private String authorEmail;
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
