package com.gatre.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // Auth
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED,         "Bạn cần đăng nhập để thực hiện thao tác này."),
    FORBIDDEN(HttpStatus.FORBIDDEN,               "Bạn không có quyền thực hiện thao tác này."),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED,        "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."),
    TOKEN_INVALID(HttpStatus.UNAUTHORIZED,        "Token không hợp lệ. Vui lòng đăng nhập lại."),
    REFRESH_TOKEN_MISSING(HttpStatus.UNAUTHORIZED,"Không tìm thấy refresh token. Vui lòng đăng nhập lại."),

    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND,          "Không tìm thấy người dùng."),
    USER_INACTIVE(HttpStatus.FORBIDDEN,           "Tài khoản của bạn đã bị vô hiệu hóa."),

    // Category
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND,      "Không tìm thấy danh mục."),
    CATEGORY_HAS_PRODUCTS(HttpStatus.CONFLICT,    "Không thể xóa danh mục đang có sản phẩm."),

    // Product
    PRODUCT_NOT_FOUND(HttpStatus.NOT_FOUND,       "Không tìm thấy sản phẩm."),
    SLUG_ALREADY_EXISTS(HttpStatus.CONFLICT,      "Đường dẫn này đã tồn tại. Vui lòng chọn tên khác."),

    // Media
    MEDIA_NOT_FOUND(HttpStatus.NOT_FOUND,         "Không tìm thấy file media."),
    MEDIA_UPLOAD_FAILED(HttpStatus.BAD_GATEWAY,   "Tải ảnh/video thất bại. Vui lòng thử lại."),

    // General
    INTERNAL_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.");

    private final HttpStatus httpStatus;
    private final String message;
}
