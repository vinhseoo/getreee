package com.gatre.dto.response;

public record DashboardStatsDTO(
        long totalProducts,
        long availableProducts,
        long totalConversations,
        long unreadMessages,
        long totalUsers
) {}
