package com.gatre.controller.admin;

import com.gatre.dto.response.ApiResponse;
import com.gatre.dto.response.DashboardStatsDTO;
import com.gatre.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
@RequiredArgsConstructor
public class AdminDashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getStats()));
    }
}
