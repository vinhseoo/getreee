package com.gatre.mapper;

import com.gatre.dto.admin.AdminCategoryDTO;
import com.gatre.dto.response.PublicCategoryDTO;
import com.gatre.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    PublicCategoryDTO toPublicDTO(Category category);
    AdminCategoryDTO toAdminDTO(Category category);
}
