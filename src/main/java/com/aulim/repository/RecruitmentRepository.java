package com.aulim.repository;

import com.aulim.domain.Member;
import com.aulim.domain.RecruitmentPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecruitmentRepository extends JpaRepository<RecruitmentPost, Long> {
    List<RecruitmentPost> findByAuthor(Member author);
}
