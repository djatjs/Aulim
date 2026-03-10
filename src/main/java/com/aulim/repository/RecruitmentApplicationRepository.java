package com.aulim.repository;

import com.aulim.domain.RecruitmentApplication;
import com.aulim.domain.RecruitmentPost;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecruitmentApplicationRepository extends JpaRepository<RecruitmentApplication, Long> {
    List<RecruitmentApplication> findByPost(RecruitmentPost post);

    List<RecruitmentApplication> findByApplicantEmail(String email);
}
