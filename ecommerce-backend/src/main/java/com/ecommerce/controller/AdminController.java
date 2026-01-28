package com.ecommerce.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.User;
import com.ecommerce.repository.OrderRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.ProductService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserRepository userRepository;

    // ==================== PRODUCT MANAGEMENT ====================

    @PostMapping("/product/add")
    public Map<String, Object> addProduct(@RequestBody Map<String, Object> payload) {
        try {
            Product product = new Product();
            product.setName(payload.get("name").toString());
            product.setPrice(Double.parseDouble(payload.get("price").toString()));
            product.setOfferPrice(Double.parseDouble(payload.get("offerPrice").toString()));
            product.setCategory(payload.get("category").toString());
            product.setInStock(Boolean.parseBoolean(payload.get("inStock").toString()));

            // Handle image - can be array or single URL
            Object imageObj = payload.get("image");
            if (imageObj instanceof List) {
                product.setImage(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(imageObj));
            } else {
                product.setImage("[\"" + imageObj.toString() + "\"]");
            }

            // Handle description - can be array or string
            Object descObj = payload.get("description");
            if (descObj instanceof List) {
                product.setDescription(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(descObj));
            } else {
                product.setDescription("[\"" + descObj.toString() + "\"]");
            }

            Product savedProduct = productRepository.save(product);
            return Map.of("success", true, "message", "Product added successfully", "product", savedProduct);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to add product: " + e.getMessage());
        }
    }

    @PutMapping("/product/edit/{id}")
    public Map<String, Object> editProduct(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Optional<Product> existingProduct = productRepository.findById(id);
            if (existingProduct.isEmpty()) {
                return Map.of("success", false, "message", "Product not found");
            }

            Product product = existingProduct.get();
            if (payload.containsKey("name")) product.setName(payload.get("name").toString());
            if (payload.containsKey("price")) product.setPrice(Double.parseDouble(payload.get("price").toString()));
            if (payload.containsKey("offerPrice")) product.setOfferPrice(Double.parseDouble(payload.get("offerPrice").toString()));
            if (payload.containsKey("category")) product.setCategory(payload.get("category").toString());
            if (payload.containsKey("inStock")) product.setInStock(Boolean.parseBoolean(payload.get("inStock").toString()));

            // Handle image update
            if (payload.containsKey("image")) {
                Object imageObj = payload.get("image");
                if (imageObj instanceof List) {
                    product.setImage(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(imageObj));
                } else {
                    product.setImage("[\"" + imageObj.toString() + "\"]");
                }
            }

            // Handle description update
            if (payload.containsKey("description")) {
                Object descObj = payload.get("description");
                if (descObj instanceof List) {
                    product.setDescription(new com.fasterxml.jackson.databind.ObjectMapper().writeValueAsString(descObj));
                } else {
                    product.setDescription("[\"" + descObj.toString() + "\"]");
                }
            }

            Product updatedProduct = productRepository.save(product);
            return Map.of("success", true, "message", "Product updated successfully", "product", updatedProduct);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to update product: " + e.getMessage());
        }
    }

    @DeleteMapping("/product/delete/{id}")
    public Map<String, Object> deleteProduct(@PathVariable Long id) {
        try {
            if (!productRepository.existsById(id)) {
                return Map.of("success", false, "message", "Product not found");
            }
            productRepository.deleteById(id);
            return Map.of("success", true, "message", "Product deleted successfully");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to delete product: " + e.getMessage());
        }
    }

    @GetMapping("/products")
    public Map<String, Object> getAllProducts() {
        try {
            List<Product> products = productService.getAllProducts();
            List<Map<String, Object>> processedProducts = products.stream().map(this::processProduct).toList();
            return Map.of("success", true, "products", processedProducts);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to retrieve products: " + e.getMessage());
        }
    }

    // ==================== ORDER MANAGEMENT ====================

    @GetMapping("/orders")
    public Map<String, Object> getAllOrders() {
        try {
            List<Order> orders = orderRepository.findAll();
            List<Map<String, Object>> processedOrders = orders.stream().map(this::processOrder).toList();
            return Map.of("success", true, "orders", processedOrders);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to retrieve orders: " + e.getMessage());
        }
    }

    @PutMapping("/order/status/{id}")
    public Map<String, Object> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        try {
            Optional<Order> existingOrder = orderRepository.findById(id);
            if (existingOrder.isEmpty()) {
                return Map.of("success", false, "message", "Order not found");
            }

            Order order = existingOrder.get();
            String newStatus = payload.get("status");
            order.setStatus(newStatus); // This automatically updates updatedAt timestamp

            // If status is Delivered, mark as paid
            if ("Delivered".equals(newStatus)) {
                order.setPaid(true);
            }

            Order updatedOrder = orderRepository.save(order);
            return Map.of("success", true, "message", "Order status updated successfully", "order", processOrder(updatedOrder));
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to update order status: " + e.getMessage());
        }
    }

    @GetMapping("/stats")
    public Map<String, Object> getDashboardStats() {
        try {
            long totalProducts = productRepository.count();
            long totalOrders = orderRepository.count();
            long totalUsers = userRepository.count();

            // Calculate total revenue from all orders
            List<Order> orders = orderRepository.findAll();
            double totalRevenue = orders.stream().mapToDouble(Order::getAmount).sum();

            // Count pending orders
            long pendingOrders = orders.stream().filter(o -> "Order Placed".equals(o.getStatus())).count();

            Map<String, Object> stats = new HashMap<>();
            stats.put("totalProducts", totalProducts);
            stats.put("totalOrders", totalOrders);
            stats.put("totalUsers", totalUsers);
            stats.put("totalRevenue", totalRevenue);
            stats.put("pendingOrders", pendingOrders);

            return Map.of("success", true, "stats", stats);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to retrieve stats: " + e.getMessage());
        }
    }

    // ==================== USER MANAGEMENT ====================

    @GetMapping("/users")
    public Map<String, Object> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();
            List<Map<String, Object>> processedUsers = users.stream()
                    .filter(user -> !"ADMIN".equals(user.getRole())) // Don't show admin users
                    .map(this::processUser)
                    .toList();
            return Map.of("success", true, "users", processedUsers);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to retrieve users: " + e.getMessage());
        }
    }

    // ==================== SELLER MANAGEMENT ====================

    @GetMapping("/sellers")
    public Map<String, Object> getAllSellers() {
        try {
            List<User> sellers = userRepository.findByIsSeller(true);
            
            List<Map<String, Object>> sellerStats = sellers.stream().map(seller -> {
                Map<String, Object> sellerMap = new HashMap<>();
                sellerMap.put("id", seller.getId());
                sellerMap.put("name", seller.getName());
                sellerMap.put("email", seller.getEmail());
                sellerMap.put("phone", seller.getPhone());
                sellerMap.put("shopName", seller.getShopName());
                sellerMap.put("shopDescription", seller.getShopDescription());
                sellerMap.put("sellerSince", seller.getSellerSince());
                
                // Get seller's products
                List<Product> products = productRepository.findBySellerId(seller.getId());
                sellerMap.put("totalProducts", products.size());
                
                // Get seller's orders
                List<Order> orders = orderRepository.findAll();
                long sellerOrders = orders.stream()
                    .filter(order -> {
                        try {
                            Object parsedItems = order.getParsedItems();
                            if (parsedItems instanceof java.util.List) {
                                java.util.List<?> items = (java.util.List<?>) parsedItems;
                                return items.stream().anyMatch(item -> {
                                    if (item instanceof Map) {
                                        Object sellerIdObj = ((Map<?, ?>) item).get("sellerId");
                                        if (sellerIdObj != null) {
                                            return seller.getId().equals(Long.parseLong(sellerIdObj.toString()));
                                        }
                                    }
                                    return false;
                                });
                            }
                            return false;
                        } catch (Exception e) {
                            return false;
                        }
                    })
                    .count();
                sellerMap.put("totalOrders", sellerOrders);
                
                // Calculate revenue
                double revenue = orders.stream()
                    .filter(order -> {
                        try {
                            Object parsedItems = order.getParsedItems();
                            if (parsedItems instanceof java.util.List) {
                                java.util.List<?> items = (java.util.List<?>) parsedItems;
                                return items.stream().anyMatch(item -> {
                                    if (item instanceof Map) {
                                        Object sellerIdObj = ((Map<?, ?>) item).get("sellerId");
                                        if (sellerIdObj != null) {
                                            return seller.getId().equals(Long.parseLong(sellerIdObj.toString()));
                                        }
                                    }
                                    return false;
                                });
                            }
                            return false;
                        } catch (Exception e) {
                            return false;
                        }
                    })
                    .mapToDouble(Order::getAmount)
                    .sum();
                sellerMap.put("totalRevenue", revenue);
                
                return sellerMap;
            }).toList();
            
            return Map.of("success", true, "sellers", sellerStats);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to retrieve sellers: " + e.getMessage());
        }
    }

    // ==================== HELPER METHODS ====================

    private Map<String, Object> processProduct(Product product) {
        Map<String, Object> productMap = new HashMap<>();
        productMap.put("id", product.getId());
        productMap.put("_id", product.getId());
        productMap.put("name", product.getName());
        productMap.put("price", product.getPrice());
        productMap.put("offerPrice", product.getOfferPrice());
        productMap.put("category", product.getCategory());
        productMap.put("inStock", product.isInStock());
        productMap.put("image", product.getParsedImage());
        productMap.put("description", product.getParsedDescription());
        return productMap;
    }

    private Map<String, Object> processOrder(Order order) {
        Map<String, Object> orderMap = new HashMap<>();
        orderMap.put("_id", order.getId());
        orderMap.put("id", order.getId());
        orderMap.put("userId", order.getUserId());
        orderMap.put("items", order.getParsedItems());
        orderMap.put("amount", order.getAmount());
        orderMap.put("address", order.getAddress());
        orderMap.put("status", order.getStatus());
        orderMap.put("paymentType", order.getPaymentType());
        orderMap.put("paid", order.isPaid());
        orderMap.put("date", order.getCreatedAt());

        // Get user details
        try {
            Optional<User> user = userRepository.findById(Long.parseLong(order.getUserId()));
            if (user.isPresent()) {
                orderMap.put("userName", user.get().getName());
                orderMap.put("userEmail", user.get().getEmail());
            }
        } catch (Exception e) {
            // Ignore user lookup errors
        }

        return orderMap;
    }

    private Map<String, Object> processUser(User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getId());
        userMap.put("_id", user.getId());
        userMap.put("name", user.getName());
        userMap.put("email", user.getEmail());
        userMap.put("phone", user.getPhone());
        userMap.put("role", user.getRole());
        
        // Count user's orders
        try {
            long orderCount = orderRepository.findAll().stream()
                    .filter(o -> o.getUserId().equals(user.getId().toString()))
                    .count();
            userMap.put("orderCount", orderCount);
        } catch (Exception e) {
            userMap.put("orderCount", 0);
        }
        
        return userMap;
    }
}
