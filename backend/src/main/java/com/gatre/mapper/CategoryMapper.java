package com.gatre.mapper;

import com.gatre.dto.admin.AdminCategoryDTO;
import com.gatre.dto.response.PublicCategoryDTO;
import com.gatre.entity.Category;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    PublicCategoryDTO toPublicDTO(Category category);

    @org.mapstruct.Mapping(target = "productCount", ignore = true)
    AdminCategoryDTO toAdminDTOBase(Category category);

    default AdminCategoryDTO toAdminDTO(Category category, long productCount) {
        AdminCategoryDTO base = toAdminDTOBase(category);
        return new AdminCategoryDTO(base.id(), base.name(), base.slug(), base.description(),
                base.createdAt(), base.updatedAt(), productCount);
    }
}
