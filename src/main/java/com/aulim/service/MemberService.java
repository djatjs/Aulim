package com.aulim.service;

import com.aulim.domain.Member;
import com.aulim.dto.MemberRegistrationDto;
import com.aulim.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public Long register(MemberRegistrationDto dto) {
        if (memberRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        }

        Member member = new Member();
        member.setName(dto.getName());
        member.setEmail(dto.getEmail());
        member.setPassword(passwordEncoder.encode(dto.getPassword()));
        member.setMainPart(dto.getMainPart());
        member.setPhone(dto.getPhone());

        return memberRepository.save(member).getId();
    }

    public void updateProfile(String email, com.aulim.dto.MemberUpdateDto dto) {
        Member member = memberRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        member.setName(dto.getName());
        member.setMainPart(dto.getMainPart());
        member.setPhone(dto.getPhone());
    }
}
