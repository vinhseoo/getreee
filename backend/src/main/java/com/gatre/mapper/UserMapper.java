package com.gatre.mapper;

import com.gatre.dto.admin.AdminUserDTO;
import com.gatre.dto.response.UserProfileDTO;
import com.gatre.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserProfileDTO toProfileDTO(User user);
    AdminUserDTO toAdminDTO(User user);
}
