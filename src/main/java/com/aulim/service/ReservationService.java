package com.aulim.service;

import com.aulim.domain.Member;
import com.aulim.domain.Reservation;
import com.aulim.domain.Room;
import com.aulim.domain.Team;
import com.aulim.repository.MemberRepository;
import com.aulim.repository.ReservationRepository;
import com.aulim.repository.RoomRepository;
import com.aulim.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final TeamRepository teamRepository;
    private final RoomRepository roomRepository;
    private final MemberRepository memberRepository;

    @Transactional
    public Long reserve(String userEmail, Long teamId, Long roomId, LocalDateTime startAt, LocalDateTime endAt) {
        Member member = memberRepository.findByEmail(userEmail)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new IllegalArgumentException("팀을 찾을 수 없습니다."));
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("연습실을 찾을 수 없습니다."));

        // 1. 예약 시간 유효성 검사 (팀당 1일 최대 2시간)
        validateReservationTime(team, startAt, endAt);

        Reservation reservation = new Reservation();
        reservation.setMember(member);
        reservation.setTeam(team);
        reservation.setRoom(room);
        reservation.setStartAt(startAt);
        reservation.setEndAt(endAt);

        return reservationRepository.save(reservation).getId();
    }

    @Transactional
    public void cancel(Long reservationId, String userEmail) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("예약을 찾을 수 없습니다."));

        if (!reservation.getMember().getEmail().equals(userEmail)) {
            throw new IllegalStateException("본인의 예약만 취소할 수 있습니다.");
        }

        reservationRepository.delete(reservation);
    }

    private void validateReservationTime(Team team, LocalDateTime startAt, LocalDateTime endAt) {
        LocalDateTime startOfDay = startAt.toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startAt.toLocalDate().plusDays(1).atStartOfDay();

        List<Reservation> dailyReservations = reservationRepository.findByTeamAndDate(team, startOfDay, endOfDay);

        long totalMinutes = dailyReservations.stream()
                .mapToLong(r -> Duration.between(r.getStartAt(), r.getEndAt()).toMinutes())
                .sum();

        long newMinutes = Duration.between(startAt, endAt).toMinutes();

        if (totalMinutes + newMinutes > 120) {
            throw new IllegalStateException(
                    "팀당 하루 최대 예약 시간은 2시간(120분)입니다. 현재 남은 예약 가능 시간: " + (120 - totalMinutes) + "분");
        }
    }

    public List<Reservation> getDailyReservations(LocalDateTime date) {
        LocalDateTime start = date.toLocalDate().atStartOfDay();
        LocalDateTime end = date.toLocalDate().plusDays(1).atStartOfDay();
        return reservationRepository.findByStartAtBetween(start, end);
    }
}
