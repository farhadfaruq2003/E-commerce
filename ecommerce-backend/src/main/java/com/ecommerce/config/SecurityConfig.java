package com.ecommerce.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.ecommerce.security.JwtFilter;
import com.ecommerce.service.CustomUserDetailsService;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // ১. CORS কনফিগারেশন এনাবল করা
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // ২. CSRF ডিজেবল করা (যেহেতু আমরা JWT ব্যবহার করছি)
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // ৩. পাবলিক এন্ডপয়েন্ট (সবাই এক্সেস করতে পারবে)
                        .requestMatchers(
                                "/api/user/login",
                                "/api/user/register",
                                "/api/seller/login",
                                "/api/product/list",
                                "/api/product/id/**"
                        ).permitAll()
                        // ৪. লগইন করা যেকোনো ইউজারের জন্য (USER, SELLER, বা ADMIN)
                        .requestMatchers(
                                "/api/cart/update",
                                "/api/address/get",
                                "/api/address/add",
                                "/api/order/cod",
                                "/api/order/user",
                                "/api/order/delete/**",
                                "/api/user/update-profile",
                                "/api/user/become-seller",
                                "/api/user/is-auth",
                                "/api/seller/is-auth"
                        ).authenticated()
                        // ৫. শুধুমাত্র সেলারদের জন্য
                        .requestMatchers(
                                "/api/product/add-product",
                                "/api/product/stock",
                                "/api/product/seller-products",
                                "/api/order/seller"
                        ).hasRole("SELLER")
                        // ৬. শুধুমাত্র অ্যাডমিনদের জন্য
                        .requestMatchers(
                                "/api/admin/**"
                        ).hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                // ৭. স্টেটলেস সেশন (JWT এর জন্য জরুরি)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authenticationProvider(authenticationProvider())
                // ৮. JWT ফিল্টার যোগ করা
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // ফ্রন্টএন্ড (React) এর URL কে পারমিশন দেওয়া
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173", 
            "http://localhost:5174",
            "http://127.0.0.1:5173",
            "http://127.0.0.1:5174"
        )); 
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}