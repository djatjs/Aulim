package com.aulim.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class RecruitmentPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id")
    private Member author;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String singer;

    @Column(nullable = false)
    private String songName;

    private String targetPerformance;

    private String referenceLink;

    @Lob
    private String content;

    @Enumerated(EnumType.STRING)
    private PostStatus status = PostStatus.OPEN;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL)
    private List<RecruitmentSession> sessions = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();
}
