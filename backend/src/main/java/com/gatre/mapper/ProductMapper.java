package com.gatre.mapper;

import com.gatre.dto.admin.AdminProductDTO;
import com.gatre.dto.admin.AdminProductMediaDTO;
import com.gatre.dto.response.ProductMediaDTO;
import com.gatre.dto.response.ProductSnapshotDTO;
import com.gatre.dto.response.PublicProductDTO;
import com.gatre.entity.Product;
import com.gatre.entity.ProductMedia;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = CategoryMapper.class)
public interface ProductMapper {

    @Mapping(target = "media", ignore = true)
    PublicProductDTO toPublicListDTO(Product product, String primaryMediaUrl);

    PublicProductDTO toPublicDetailDTO(Product product, String primaryMediaUrl, List<ProductMediaDTO> media);

    @Mapping(target = "media", ignore = true)
    AdminProductDTO toAdminListDTO(Product product, String primaryMediaUrl);

    AdminProductDTO toAdminDetailDTO(Product product, String primaryMediaUrl, List<AdminProductMediaDTO> media);

    ProductMediaDTO toPublicMediaDTO(ProductMedia media);

    AdminProductMediaDTO toAdminMediaDTO(ProductMedia media);

    ProductSnapshotDTO toSnapshotDTO(Product product, String primaryMediaUrl);
}
