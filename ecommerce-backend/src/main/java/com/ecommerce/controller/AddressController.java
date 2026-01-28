package com.ecommerce.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/address")

public class AddressController {

    @PostMapping("/add")
    public Map<String, Object> add() {
        return Map.of("success", true, "message", "Address Added");
    }

    @GetMapping("/get")
    public Map<String, Object> get() {
        Map<String, Object> address = new HashMap<>();
        address.put("_id", "67b5b9e54ea97f71bbc196a0");
        address.put("userId", "67b5880e4d09769c5ca61644");
        address.put("firstName", "Great");
        address.put("lastName", "Stack");
        address.put("email", "user.greatstack@gmail.com");
        address.put("street", "Street 123");
        address.put("city", "Main City");
        address.put("state", "New State");
        address.put("zipcode", 123456);
        address.put("country", "IN");
        address.put("phone", "1234567890");
        return Map.of("success", true, "addresses", List.of(address));
    }
}
