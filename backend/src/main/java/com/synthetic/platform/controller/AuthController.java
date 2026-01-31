package com.synthetic.platform.controller;

import com.synthetic.platform.security.model.User;
import com.synthetic.platform.security.repository.AuthUserRepository;
import com.synthetic.platform.security.JwtTokenProvider;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final AuthUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(loginRequest.getUsername());

            return ResponseEntity.ok(new JwtAuthenticationResponse(jwt));
        } catch (BadCredentialsException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, "Invalid username or password"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Authentication failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequest signUpRequest) {
        try {
            // Validate input
            if (signUpRequest.getUsername() == null || signUpRequest.getUsername().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Username is required"));
            }

            if (signUpRequest.getEmail() == null || signUpRequest.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Email is required"));
            }

            if (signUpRequest.getPassword() == null || signUpRequest.getPassword().length() < 6) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Password must be at least 6 characters"));
            }

            // Check if username exists
            if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Username is already taken!"));
            }

            // Check if email exists
            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Email is already in use!"));
            }

            // Create new user
            User user = new User();
            user.setUsername(signUpRequest.getUsername().trim());
            user.setEmail(signUpRequest.getEmail().trim());
            user.setFullName(signUpRequest.getFullName() != null ? signUpRequest.getFullName().trim()
                    : signUpRequest.getUsername());
            user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
            user.setProvider("LOCAL");
            user.setEnabled(true);

            // Set default role
            Set<String> roles = new HashSet<>();
            roles.add("ROLE_USER");
            user.setRoles(roles);

            // Save user
            userRepository.save(user);

            return ResponseEntity.ok(new ApiResponse(true, "User registered successfully"));
        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Registration failed: " + e.getMessage()));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        return ResponseEntity.ok(new ApiResponse(true, "Auth endpoint is working!"));
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    public static class SignUpRequest {
        private String username;
        private String email;
        private String fullName;
        private String password;
    }

    @Data
    @RequiredArgsConstructor
    public static class JwtAuthenticationResponse {
        private final String accessToken;
        private String tokenType = "Bearer";
    }

    @Data
    @RequiredArgsConstructor
    public static class ApiResponse {
        private final Boolean success;
        private final String message;
    }
}
