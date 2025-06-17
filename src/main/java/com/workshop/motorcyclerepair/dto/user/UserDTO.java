package com.workshop.motorcyclerepair.dto.user;

import com.workshop.motorcyclerepair.utils.Role;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDTO {
    private Long id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;

}
