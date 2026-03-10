package com.aulim.dto;

import com.aulim.domain.Part;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberRegistrationDto {
    private String name;
    private String email;
    private String password;
    private Part mainPart;
    private int experienceYears;
    private String phone;
}
