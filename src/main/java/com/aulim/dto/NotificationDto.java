package com.aulim.dto;

import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class NotificationDto {
    private Long id;
    private String message;
    private String relatedUrl;
    private boolean isRead;
    private LocalDateTime createdAt;
}
