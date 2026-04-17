package com.gatre.service;

import org.springframework.web.multipart.MultipartFile;

public interface CloudinaryService {

    record UploadResult(String url, String publicId) {}

    UploadResult upload(MultipartFile file, String folder);

    /**
     * Deletes the asset from Cloudinary.
     * Failure is logged but NOT rethrown — the DB record is deleted regardless.
     */
    void delete(String publicId);
}