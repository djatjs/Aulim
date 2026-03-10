package com.aulim.repository;

import com.aulim.domain.Reservation;
import com.aulim.domain.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {

        @Query("SELECT r FROM Reservation r WHERE r.team = :team " +
                        "AND r.startAt >= :startOfDay AND r.startAt < :endOfDay")
        List<Reservation> findByTeamAndDate(@Param("team") Team team,
                        @Param("startOfDay") LocalDateTime startOfDay,
                        @Param("endOfDay") LocalDateTime endOfDay);

        List<Reservation> findByStartAtBetween(LocalDateTime start, LocalDateTime end);

        List<Reservation> findByMemberEmail(String email);
}
