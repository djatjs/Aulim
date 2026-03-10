package com.aulim.controller;

import com.aulim.dto.RecruitPostDto;
import com.aulim.service.RecruitService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/recruits")
@RequiredArgsConstructor
public class RecruitController {

    private final RecruitService recruitService;

    @PostMapping
    public ResponseEntity<?> createPost(Authentication authentication,
            @RequestBody RecruitPostDto.CreateRequest request) {
        Long postId = recruitService.createPost(authentication.getName(), request);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "data", Map.of("postId", postId)));
    }

    @GetMapping
    public ResponseEntity<List<RecruitPostDto.Response>> getAllPosts() {
        return ResponseEntity.ok(recruitService.getAllPosts());
    }

    @PostMapping("/{id}/apply")
    public ResponseEntity<?> apply(Authentication authentication, @PathVariable Long id,
            @RequestBody RecruitPostDto.ApplicationRequest request) {
        recruitService.apply(id, authentication.getName(), request);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "참여 신청이 완료되었습니다."));
    }

    @PatchMapping("/applications/{appId}/accept")
    public ResponseEntity<?> acceptApplication(Authentication authentication, @PathVariable Long appId) {
        recruitService.acceptApplication(appId, authentication.getName());
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "신청을 수락했습니다."));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecruitPostDto.Response> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(recruitService.convertToDto(
                recruitService.getPostById(id)));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updatePost(Authentication authentication, @PathVariable Long id,
            @RequestBody RecruitPostDto.CreateRequest request) {
        recruitService.updatePost(id, authentication.getName(), request);
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "게시글이 수정되었습니다."));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(Authentication authentication, @PathVariable Long id) {
        recruitService.deletePost(id, authentication.getName());
        return ResponseEntity.ok(Map.of("status", "SUCCESS", "message", "게시글이 삭제되었습니다."));
    }
}
