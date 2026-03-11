package com.aulim.dto;

import com.aulim.domain.Part;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberUpdateDto {
    private String name;
    private Part mainPart;
    private String phone;
}
