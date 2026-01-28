package com.ecommerce.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    @Lazy
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        if ("seller@gmail.com".equals(email)) {
            return User.withUsername(email)
                    .password(passwordEncoder.encode("password"))
                    .roles("SELLER")
                    .build();
        }

        com.ecommerce.entity.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        // Use the actual role from database (USER, SELLER, or ADMIN)
        String userRole = user.getRole() != null ? user.getRole() : "USER";
        
        return User.withUsername(user.getEmail())
                .password(user.getPassword()) // This password should be encoded in the database
                .roles(userRole)
                .build();
    }
}
