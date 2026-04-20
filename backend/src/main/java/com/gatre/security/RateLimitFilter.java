package com.gatre.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Simple per-IP rate limiter on auth mutation endpoints.
 * Counters reset every 60 seconds. Limit: 10 requests/min/IP.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int MAX_REQUESTS = 10;
    private static final Set<String> RATE_LIMITED_PATHS = Set.of(
            "/api/auth/login",
            "/api/auth/refresh"
    );

    private final ConcurrentHashMap<String, AtomicInteger> counters = new ConcurrentHashMap<>();

    @Scheduled(fixedRate = 60_000)
    public void resetCounters() {
        counters.clear();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !RATE_LIMITED_PATHS.contains(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String ip = resolveClientIp(request);
        int count = counters.computeIfAbsent(ip, k -> new AtomicInteger()).incrementAndGet();

        if (count > MAX_REQUESTS) {
            response.setStatus(429);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write(
                    "{\"success\":false,\"message\":\"Quá nhiều yêu cầu. Vui lòng thử lại sau.\"}");
            return;
        }

        chain.doFilter(request, response);
    }

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
