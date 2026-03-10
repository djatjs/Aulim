package com.aulim.controller;

import com.aulim.domain.RecruitmentPost;
import com.aulim.service.RecruitmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruitments")
@RequiredArgsConstructor
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    @GetMapping
    public ResponseEntity<?> getList() {
        List<RecruitmentPost> posts = recruitmentService.findAll();
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "data", posts));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody RecruitmentPost post) {
        Long postId = recruitmentService.createPost(post);
        return ResponseEntity.ok(Map.of(
                "status", "SUCCESS",
                "data", Map.of("postId", postId),
                "message", "모집 게시글이 등록되었습니다."));
    }
}
