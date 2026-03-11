package com.aulim.repository;

import com.aulim.domain.Member;
import com.aulim.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByMemberOrderByCreatedAtDesc(Member member);
    List<Notification> findByMemberAndIsReadFalseOrderByCreatedAtDesc(Member member);
    long countByMemberAndIsReadFalse(Member member);
}
