package com.gatre.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public final class SlugUtils {

    private static final Pattern COMBINING_MARKS = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
    private static final Pattern NON_SLUG_CHARS   = Pattern.compile("[^a-z0-9\\s-]");
    private static final Pattern WHITESPACE        = Pattern.compile("[\\s]+");
    private static final Pattern MULTIPLE_DASHES   = Pattern.compile("-+");

    private SlugUtils() {}

    /**
     * Converts a Vietnamese or Latin string to a URL-safe slug.
     * Example: "Gà Tre Lông Đỏ" → "ga-tre-long-do"
     *
     * Note: handles Đ/đ explicitly since it doesn't decompose via NFD.
     * Admins can override the generated slug via ProductUpdateRequest.
     */
    public static String toSlug(String input) {
        if (input == null || input.isBlank()) return "";

        String result = input.trim()
                // Handle Đ/đ — does not decompose in NFD
                .replaceAll("[Đ]", "D")
                .replaceAll("[đ]", "d");

        // NFD decomposition splits accented chars into base + combining marks
        result = Normalizer.normalize(result, Normalizer.Form.NFD);

        return MULTIPLE_DASHES.matcher(
                NON_SLUG_CHARS.matcher(
                        WHITESPACE.matcher(
                                COMBINING_MARKS.matcher(result).replaceAll("")
                                        .toLowerCase()
                        ).replaceAll("-")
                ).replaceAll("")
        ).replaceAll("-").trim();
    }
}