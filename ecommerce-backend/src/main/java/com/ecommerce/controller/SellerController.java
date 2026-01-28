package com.ecommerce.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.JwtService;

@RestController
@RequestMapping("/api/seller")

public class SellerController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        if (authentication.isAuthenticated()) {
            // Check if user is actually a seller
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
            if (user.getIsSeller() == null || !user.getIsSeller()) {
                Map<String, Object> res = new HashMap<>();
                res.put("success", false);
                res.put("message", "You are not a seller. Please become a seller first from your profile.");
                return res;
            }
            
            // Verify user has SELLER role
            if (!"SELLER".equals(user.getRole()) && !"ADMIN".equals(user.getRole())) {
                // Auto-fix: If user is marked as seller but role is not set properly
                user.setRole("SELLER");
                userRepository.save(user);
            }
            
            String token = jwtService.generateToken(email, user.getRole());
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("message", "Seller login successful");
            res.put("token", token);
            res.put("user", user);
            return res;
        } else {
            throw new UsernameNotFoundException("Invalid seller credentials");
        }
    }

    @GetMapping("/is-auth")
    public Map<String, Object> isAuth(Principal principal) {
        if (principal == null) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            return res;
        }
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("user", Map.of("email", principal.getName(), "role", "SELLER"));
        return res;
    }

    @GetMapping("/logout")
    public Map<String, Object> logout() {
        return Map.of("success", true, "message", "Seller Logged Out");
    }
}
