package com.ecommerce.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.ProductService;

@RestController
@RequestMapping("/api/product")

public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/")
    public String hello() {
        return "Ecommerce Backend is running!";
    }

    @PostMapping("/add-product")
    public Map<String, Object> addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("category") String category,
            @RequestParam("price") double price,
            @RequestParam("offerPrice") double offerPrice,
            @RequestParam(value = "image", required = false) MultipartFile[] images,
            Principal principal) {
        try {
            // Get seller information
            String email = principal.getName();
            User seller = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Seller not found"));

            // Create product
            Product product = new Product();
            product.setName(name);
            product.setDescription("[\"" + description + "\"]");
            product.setCategory(category);
            product.setPrice(price);
            product.setOfferPrice(offerPrice);
            product.setInStock(true);
            product.setSellerId(seller.getId());
            product.setSellerName(seller.getName());
            product.setShopName(seller.getShopName() != null ? seller.getShopName() : seller.getName() + "'s Shop");

            // Handle image uploads
            List<String> imageUrls = new ArrayList<>();
            if (images != null && images.length > 0) {
                String uploadDir = "uploads/products/";
                File directory = new File(uploadDir);
                if (!directory.exists()) {
                    directory.mkdirs();
                }

                for (MultipartFile image : images) {
                    if (!image.isEmpty()) {
                        String originalFilename = image.getOriginalFilename();
                        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
                        String filename = UUID.randomUUID().toString() + extension;
                        Path filepath = Paths.get(uploadDir, filename);
                        Files.write(filepath, image.getBytes());
                        imageUrls.add(filename);
                    }
                }
            }

            // Set image JSON array
            if (imageUrls.isEmpty()) {
                product.setImage("[\"https://via.placeholder.com/300\"]");
            } else {
                product.setImage("[\"" + String.join("\",\"", imageUrls) + "\"]");
            }

            Product savedProduct = productRepository.save(product);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Product added successfully");
            response.put("product", savedProduct);
            return response;
        } catch (IOException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to upload images: " + e.getMessage());
            return response;
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to add product: " + e.getMessage());
            return response;
        }
    }

    @GetMapping("/list")
    public Map<String, Object> list() {
        List<Product> products = productService.getAllProducts();

        // Process products to handle JSON strings for image and description
        List<Map<String, Object>> processedProducts = products.stream().map(this::processProduct).toList();

        return Map.of("success", true, "products", processedProducts);
    }

    private Map<String, Object> processProduct(Product product) {
        Map<String, Object> productMap = new java.util.HashMap<>();
        productMap.put("id", product.getId());
        productMap.put("_id", product.getId()); // Add _id for frontend compatibility
        productMap.put("name", product.getName());
        productMap.put("price", product.getPrice());
        productMap.put("offerPrice", product.getOfferPrice());
        productMap.put("category", product.getCategory());
        productMap.put("inStock", product.isInStock());

        // Use the helper methods to handle JSON parsing
        productMap.put("image", product.getParsedImage());
        productMap.put("description", product.getParsedDescription());

        return productMap;
    }

    @GetMapping("/id")
    public Map<String, Object> getById() {
        return Map.of("success", true, "product", Map.of());
    }

    @PostMapping("/stock")
    public Map<String, Object> stock(@RequestBody Map<String, Object> payload, Principal principal) {
        try {
            Long productId = Long.parseLong(payload.get("id").toString());
            Boolean inStock = Boolean.parseBoolean(payload.get("inStock").toString());
            
            // Get seller information to verify ownership
            String email = principal.getName();
            User seller = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Seller not found"));
            
            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));
            
            // Verify the product belongs to this seller
            if (!product.getSellerId().equals(seller.getId())) {
                return Map.of("success", false, "message", "You don't have permission to update this product");
            }
            
            product.setInStock(inStock);
            productRepository.save(product);
            
            return Map.of("success", true, "message", "Stock status updated successfully");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to update stock: " + e.getMessage());
        }
    }

    // Get products for logged-in seller
    @GetMapping("/seller-products")
    public Map<String, Object> getSellerProducts(Principal principal) {
        try {
            String email = principal.getName();
            User seller = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Seller not found"));
            
            List<Product> products = productRepository.findBySellerId(seller.getId());
            
            // Process products to handle JSON strings for image and description
            List<Map<String, Object>> processedProducts = products.stream().map(this::processProduct).toList();
            
            return Map.of("success", true, "products", processedProducts);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to fetch products: " + e.getMessage());
        }
    }
}
