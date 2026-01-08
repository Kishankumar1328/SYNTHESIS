package com.synthetic.platform.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Map<String, RateLimitInfo> requestCounts = new ConcurrentHashMap<>();
    private static final int MAX_REQUESTS_PER_MINUTE = 100;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Skip rate limiting for static assets if needed
        String path = request.getRequestURI();
        if (path.contains("/h2-console")) {
            filterChain.doFilter(request, response);
            return;
        }

        String key = getClientIP(request);
        RateLimitInfo rateLimitInfo = requestCounts.computeIfAbsent(key, k -> new RateLimitInfo());

        synchronized (rateLimitInfo) {
            Instant now = Instant.now();

            // Reset if more than 1 minute has passed
            if (Duration.between(rateLimitInfo.windowStart, now).toMinutes() >= 1) {
                rateLimitInfo.requestCount = 0;
                rateLimitInfo.windowStart = now;
            }

            if (rateLimitInfo.requestCount < MAX_REQUESTS_PER_MINUTE) {
                rateLimitInfo.requestCount++;
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\"}");
            }
        }
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }

    // Moved outside of the main class scope in the same file to help some
    // classloaders
}

class RateLimitInfo {
    int requestCount = 0;
    Instant windowStart = Instant.now();
}
