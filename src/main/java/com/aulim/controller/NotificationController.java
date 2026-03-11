package com.aulim.controller;

import com.aulim.dto.NotificationDto;
import com.aulim.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<List<NotificationDto>> getNotifications(Authentication authentication) {
        return ResponseEntity.ok(notificationService.getNotifications(authentication.getName()));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(Authentication authentication) {
        long count = notificationService.getUnreadCount(authentication.getName());
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(Authentication authentication, @PathVariable Long id) {
        notificationService.markAsRead(id, authentication.getName());
        return ResponseEntity.ok(Map.of("status", "SUCCESS"));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<?> markAllAsRead(Authentication authentication) {
        notificationService.markAllAsRead(authentication.getName());
        return ResponseEntity.ok(Map.of("status", "SUCCESS"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(Authentication authentication, @PathVariable Long id) {
        notificationService.deleteNotification(id, authentication.getName());
        return ResponseEntity.ok(Map.of("status", "SUCCESS"));
    }
}
