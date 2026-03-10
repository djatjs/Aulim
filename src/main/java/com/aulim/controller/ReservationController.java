package com.aulim.controller;

import com.aulim.domain.Reservation;
import com.aulim.service.ReservationService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @GetMapping
    public ResponseEntity<?> getList(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        List<Reservation> reservations = reservationService.getDailyReservations(date);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "data", reservations));
    }

    @PostMapping
    public ResponseEntity<?> reserve(Principal principal, @RequestBody ReservationRequest request) {
        try {
            Long reservationId = reservationService.reserve(
                    principal.getName(),
                    request.getTeamId(),
                    request.getRoomId(),
                    request.getStartAt(),
                    request.getEndAt());
            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "data", Map.of("reservationId", reservationId),
                    "message", "예약이 완료되었습니다."));
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "ERROR",
                    "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "ERROR",
                    "message", "예약 처리 중 오류가 발생했습니다."));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancel(Principal principal, @PathVariable Long id) {
        try {
            reservationService.cancel(id, principal.getName());
            return ResponseEntity.ok(Map.of(
                    "status", "SUCCESS",
                    "message", "예약이 취소되었습니다."));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(403).body(Map.of(
                    "status", "ERROR",
                    "message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of(
                    "status", "ERROR",
                    "message", "취소 처리 중 오류가 발생했습니다."));
        }
    }

    @Data
    static class ReservationRequest {
        private Long teamId;
        private Long roomId;
        private LocalDateTime startAt;
        private LocalDateTime endAt;
    }
}
