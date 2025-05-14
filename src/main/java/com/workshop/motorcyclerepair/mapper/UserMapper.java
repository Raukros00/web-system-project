package com.workshop.motorcyclerepair.mapper;

import com.workshop.motorcyclerepair.dto.UserDTO;
import com.workshop.motorcyclerepair.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface UserMapper {
    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDTO toDto(User user);
    User toEntity(UserDTO userDTO);

}
