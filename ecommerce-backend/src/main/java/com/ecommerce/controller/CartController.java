package com.ecommerce.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/cart")

public class CartController {

    @PostMapping("/update")
    public Map<String, Object> update(@RequestBody Map<String, Object> body) {
        // In a real app, persist body.get("cartItems") for current user
        return Map.of("success", true);
    }
}
