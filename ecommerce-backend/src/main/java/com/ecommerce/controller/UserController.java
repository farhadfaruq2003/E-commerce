package com.ecommerce.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.entity.User;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.JwtService;

@RestController
@RequestMapping("/api/user")

public class UserController {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );

        if (authentication.isAuthenticated()) {
            User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
            // Use the user's role from database (USER, SELLER, or ADMIN)
            String userRole = user.getRole() != null ? user.getRole() : "USER";
            String token = jwtService.generateToken(email, userRole);
            Map<String, Object> res = new HashMap<>();
            res.put("success", true);
            res.put("message", "Login successful");
            res.put("token", token);
            res.put("user", user);
            return res;
        } else {
            throw new UsernameNotFoundException("Invalid user request!");
        }
    }

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Map<String, String> body) {
        Optional<User> existingUser = userRepository.findByEmail(body.get("email"));
        if (existingUser.isPresent()) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            res.put("message", "User with this email already exists");
            return res;
        }

        User user = new User();
        user.setName(body.get("name"));
        user.setEmail(body.get("email"));
        user.setPassword(passwordEncoder.encode(body.get("password")));
        user.setCartItems("{}"); // Initialize with empty cart

        User savedUser = userRepository.save(user);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "User registered successfully");
        res.put("user", savedUser);
        return res;
    }

    @GetMapping("/is-auth")
    public Map<String, Object> isAuth(Principal principal) {
        if (principal == null) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            return res;
        }
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("user", user);
        return res;
    }

    @GetMapping("/logout")
    public Map<String, Object> logout() {
        return Map.of("success", true, "message", "Logged Out");
    }

    @PostMapping("/update-profile")
    public Map<String, Object> updateProfile(@RequestBody Map<String, String> body, Principal principal) {
        if (principal == null) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            res.put("message", "User not authenticated");
            return res;
        }

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Update user fields
        if (body.containsKey("name") && body.get("name") != null) {
            user.setName(body.get("name"));
        }
        if (body.containsKey("phone") && body.get("phone") != null) {
            user.setPhone(body.get("phone"));
        }
        if (body.containsKey("image") && body.get("image") != null) {
            user.setImage(body.get("image"));
        }

        User updatedUser = userRepository.save(user);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Profile updated successfully");
        res.put("user", updatedUser);
        return res;
    }

    @PostMapping("/become-seller")
    public Map<String, Object> becomeSeller(@RequestBody Map<String, String> body, Principal principal) {
        if (principal == null) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            res.put("message", "User not authenticated");
            return res;
        }

        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        // Check if already a seller
        if (user.getIsSeller() != null && user.getIsSeller()) {
            Map<String, Object> res = new HashMap<>();
            res.put("success", false);
            res.put("message", "You are already a seller");
            return res;
        }

        // Upgrade to seller
        user.setIsSeller(true);
        user.setRole("SELLER"); // Set role to SELLER for proper authorization
        user.setShopName(body.get("shopName"));
        user.setShopDescription(body.get("shopDescription"));
        user.setSellerSince(java.time.LocalDateTime.now().toString());

        User updatedUser = userRepository.save(user);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Successfully became a seller!");
        res.put("user", updatedUser);
        return res;
    }
}
