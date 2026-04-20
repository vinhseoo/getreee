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
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Per-IP rate limiter on auth endpoints. Counters reset every 60 seconds.
 * Login is kept tight (5/min) to slow brute-force; refresh is more lenient
 * since page reloads can trigger it.
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Map<String, Integer> PATH_LIMITS = Map.of(
            "/api/auth/login",   5,
            "/api/auth/refresh", 20
    );

    private final ConcurrentHashMap<String, AtomicInteger> counters = new ConcurrentHashMap<>();

    @Scheduled(fixedRate = 60_000)
    public void resetCounters() {
        counters.clear();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !PATH_LIMITS.containsKey(request.getRequestURI());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String path  = request.getRequestURI();
        int limit    = PATH_LIMITS.get(path);
        String key   = path + "|" + resolveClientIp(request);
        int count    = counters.computeIfAbsent(key, k -> new AtomicInteger()).incrementAndGet();

        if (count > limit) {
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
