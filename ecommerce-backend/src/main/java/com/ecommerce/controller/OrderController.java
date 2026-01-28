package com.ecommerce.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecommerce.entity.Order;
import com.ecommerce.entity.User;
import com.ecommerce.service.OrderService;
import com.ecommerce.service.ProductService;
import com.ecommerce.service.UserService;

@RestController
@RequestMapping("/api/order")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @PostMapping("/cod")
    public Map<String, Object> cod(@RequestBody Map<String, Object> payload) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User user = userService.findByEmail(email);

            if (user == null) {
                return Map.of("success", false, "message", "User not found");
            }

            // Get the amount from the payload, or calculate it as backup
            double totalAmount;
            Object amountObj = payload.get("amount");
            if (amountObj != null) {
                try {
                    totalAmount = Double.parseDouble(amountObj.toString());
                } catch (NumberFormatException e) {
                    // If parsing fails, calculate from items
                    totalAmount = calculateAmountFromItems(payload.get("items"));
                }
            } else {
                // Calculate from items if not provided
                totalAmount = calculateAmountFromItems(payload.get("items"));
            }

            // Create and save the order
            Order order = new Order();
            order.setUserId(user.getId().toString());
            // Convert items to JSON string properly
            com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
            String itemsJson = objectMapper.writeValueAsString(payload.get("items"));
            order.setItems(itemsJson);
            order.setAmount(totalAmount);
            order.setAddress(payload.get("address").toString());
            order.setPaymentType("COD");
            order.setStatus("Order Placed");
            order.setPaid(false);

            Order savedOrder = orderService.saveOrder(order);

            return Map.of("success", true, "message", "Order Placed Successfully", "order", savedOrder);
        } catch (com.fasterxml.jackson.core.JsonProcessingException e) {
            return Map.of("success", false, "message", "Failed to process order data: " + e.getMessage());
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to place order: " + e.getMessage());
        }
    }

    @GetMapping("/user")
    public Map<String, Object> userOrders() {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User user = userService.findByEmail(email);

            // Get orders for this user
            List<Order> orders = orderService.getUserOrders(user.getId().toString());

            // Process orders to parse items properly
            List<Map<String, Object>> processedOrders = orders.stream().map(this::processOrder).toList();

            return Map.of("success", true, "orders", processedOrders);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to retrieve orders: " + e.getMessage(), "orders", List.of());
        }
    }

    @Autowired
    private ProductService productService;

    private Map<String, Object> processOrder(Order order) {
        Map<String, Object> orderMap = new java.util.HashMap<>();
        orderMap.put("id", order.getId());
        orderMap.put("_id", order.getId());
        orderMap.put("userId", order.getUserId());
        orderMap.put("items", processOrderItems(order.getParsedItems())); // Process items to include product info
        orderMap.put("amount", order.getAmount());
        orderMap.put("address", order.getAddress());
        orderMap.put("status", order.getStatus());
        orderMap.put("paymentType", order.getPaymentType());
        orderMap.put("isPaid", order.isPaid());
        orderMap.put("createdAt", order.getCreatedAt());
        orderMap.put("updatedAt", order.getUpdatedAt());
        orderMap.put("orderDate", order.getOrderDate());

        return orderMap;
    }

    @SuppressWarnings("unchecked")
    private double calculateAmountFromItems(Object itemsObj) {
        double totalAmount = 0;
        if (itemsObj instanceof java.util.List) {
            java.util.List<?> itemsList = (java.util.List<?>) itemsObj;
            for (Object itemObj : itemsList) {
                if (itemObj instanceof java.util.Map) {
                    java.util.Map<String, Object> itemMap = (java.util.Map<String, Object>) itemObj;
                    String productId = itemMap.get("product").toString();

                    // Find the product to get its price
                    java.util.List<com.ecommerce.entity.Product> allProducts = productService.getAllProducts();
                    for (com.ecommerce.entity.Product product : allProducts) {
                        if (product.getId().toString().equals(productId)) {
                            int quantity = Integer.parseInt(itemMap.get("quantity").toString());
                            totalAmount += product.getOfferPrice() * quantity;
                            break;
                        }
                    }
                }
            }
        }
        return totalAmount;
    }

    @SuppressWarnings("unchecked")
    private Object processOrderItems(Object itemsObj) {
        if (!(itemsObj instanceof java.util.List)) {
            return itemsObj;
        }

        java.util.List<?> itemsList = (java.util.List<?>) itemsObj;
        java.util.List<java.util.Map<String, Object>> processedItems = new java.util.ArrayList<>();

        for (Object itemObj : itemsList) {
            if (itemObj instanceof java.util.Map) {
                java.util.Map<String, Object> itemMap = (java.util.Map<String, Object>) itemObj;

                // Get the product ID from the item
                Object productIdObj = itemMap.get("product");
                if (productIdObj != null) {
                    String productId = productIdObj.toString();

                    // Fetch the actual product from the database
                    java.util.List<com.ecommerce.entity.Product> allProducts = productService.getAllProducts();
                    com.ecommerce.entity.Product matchedProduct = null;

                    for (com.ecommerce.entity.Product product : allProducts) {
                        if (product.getId().toString().equals(productId)) {
                            matchedProduct = product;
                            break;
                        }
                    }

                    // Create a new map with the full product information
                    java.util.Map<String, Object> newItemMap = new java.util.HashMap<>(itemMap);

                    if (matchedProduct != null) {
                        java.util.Map<String, Object> productMap = new java.util.HashMap<>();
                        productMap.put("id", matchedProduct.getId());
                        productMap.put("_id", matchedProduct.getId());
                        productMap.put("name", matchedProduct.getName());
                        productMap.put("price", matchedProduct.getPrice());
                        productMap.put("offerPrice", matchedProduct.getOfferPrice());
                        productMap.put("category", matchedProduct.getCategory());
                        productMap.put("inStock", matchedProduct.isInStock());

                        // Handle image and description fields
                        productMap.put("image", matchedProduct.getParsedImage());
                        productMap.put("description", matchedProduct.getParsedDescription());

                        newItemMap.put("product", productMap);
                    } else {
                        // If product not found, keep the original product reference
                        newItemMap.put("product", itemMap.get("product"));
                    }

                    processedItems.add(newItemMap);
                } else {
                    processedItems.add(itemMap);
                }
            } else {
                // itemObj is not a Map, add the original object
                processedItems.add(java.util.Map.of("item", itemObj));
            }
        }

        return processedItems;
    }

    @GetMapping("/seller")
    public Map<String, Object> sellerOrders() {
        try {
            // Get the authenticated seller
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User seller = userService.findByEmail(email);

            if (seller == null) {
                return Map.of("success", false, "message", "Seller not found", "orders", List.of());
            }

            // Get all orders
            List<Order> allOrders = orderService.getAllOrders();
            
            // Filter orders that contain at least one product from this seller
            List<Order> sellerOrders = allOrders.stream()
                .filter(order -> orderContainsSellerProduct(order, seller.getId()))
                .toList();

            // Process orders to parse items properly
            List<Map<String, Object>> processedOrders = sellerOrders.stream()
                .map(this::processOrder)
                .toList();

            return Map.of("success", true, "orders", processedOrders);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to retrieve orders: " + e.getMessage(), "orders", List.of());
        }
    }

    @SuppressWarnings("unchecked")
    private boolean orderContainsSellerProduct(Order order, Long sellerId) {
        try {
            Object itemsObj = order.getParsedItems();
            if (itemsObj instanceof java.util.List) {
                java.util.List<?> itemsList = (java.util.List<?>) itemsObj;
                for (Object itemObj : itemsList) {
                    if (itemObj instanceof java.util.Map) {
                        java.util.Map<String, Object> itemMap = (java.util.Map<String, Object>) itemObj;
                        Object productObj = itemMap.get("product");
                        
                        // Check if product has sellerId field
                        if (productObj instanceof java.util.Map) {
                            java.util.Map<String, Object> productMap = (java.util.Map<String, Object>) productObj;
                            Object sellerIdObj = productMap.get("sellerId");
                            if (sellerIdObj != null && sellerId.equals(Long.parseLong(sellerIdObj.toString()))) {
                                return true;
                            }
                        } else {
                            // Product is an ID, lookup the product
                            String productId = productObj.toString();
                            com.ecommerce.entity.Product product = productService.getProductById(Long.parseLong(productId));
                            if (product != null && product.getSellerId() != null && product.getSellerId().equals(sellerId)) {
                                return true;
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            // Log error but don't fail the entire operation
            System.err.println("Error checking seller product: " + e.getMessage());
        }
        return false;
    }

    @DeleteMapping("/delete/{id}")
    public Map<String, Object> deleteOrder(@PathVariable Long id) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User user = userService.findByEmail(email);

            if (user == null) {
                return Map.of("success", false, "message", "User not found");
            }

            // Find the order
            Order order = orderService.getOrderById(id);
            if (order == null) {
                return Map.of("success", false, "message", "Order not found");
            }

            // Check if the order belongs to the user
            if (!order.getUserId().equals(user.getId().toString())) {
                return Map.of("success", false, "message", "Unauthorized access");
            }

            // Check if order can be cancelled
            String status = order.getStatus().toLowerCase();
            if (status.equals("delivered") || status.equals("cancelled")) {
                return Map.of("success", false, "message", "Cannot cancel " + status + " order");
            }

            // Delete the entire order
            orderService.deleteOrder(id);

            return Map.of("success", true, "message", "Order cancelled successfully");
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to cancel order: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{orderId}/item/{itemIndex}")
    public Map<String, Object> deleteOrderItem(@PathVariable Long orderId, @PathVariable int itemIndex) {
        try {
            // Get the authenticated user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User user = userService.findByEmail(email);

            if (user == null) {
                return Map.of("success", false, "message", "User not found");
            }

            // Find the order
            Order order = orderService.getOrderById(orderId);
            if (order == null) {
                return Map.of("success", false, "message", "Order not found");
            }

            // Check if the order belongs to the user
            if (!order.getUserId().equals(user.getId().toString())) {
                return Map.of("success", false, "message", "Unauthorized access");
            }

            // Check if order can be modified
            String status = order.getStatus().toLowerCase();
            if (status.equals("delivered") || status.equals("cancelled")) {
                return Map.of("success", false, "message", "Cannot cancel items from " + status + " order");
            }

            // Parse the items JSON
            com.fasterxml.jackson.databind.ObjectMapper objectMapper = new com.fasterxml.jackson.databind.ObjectMapper();
            java.util.List<java.util.Map<String, Object>> items = objectMapper.readValue(
                order.getItems(), 
                new com.fasterxml.jackson.core.type.TypeReference<java.util.List<java.util.Map<String, Object>>>() {}
            );

            // Check if item index is valid
            if (itemIndex < 0 || itemIndex >= items.size()) {
                return Map.of("success", false, "message", "Invalid item index");
            }

            // Remove the item
            java.util.Map<String, Object> removedItem = items.remove(itemIndex);

            // If no items left, delete the entire order
            if (items.isEmpty()) {
                orderService.deleteOrder(orderId);
                return Map.of("success", true, "message", "Item cancelled and order removed", "orderDeleted", true);
            }

            // Recalculate the order amount
            double newAmount = 0.0;
            for (java.util.Map<String, Object> item : items) {
                Object quantityObj = item.get("quantity");
                int quantity = quantityObj != null ? Integer.parseInt(quantityObj.toString()) : 1;
                
                Object productObj = item.get("product");
                if (productObj instanceof java.util.Map) {
                    java.util.Map<String, Object> product = (java.util.Map<String, Object>) productObj;
                    Object priceObj = product.get("offerPrice");
                    double price = priceObj != null ? Double.parseDouble(priceObj.toString()) : 0.0;
                    newAmount += price * quantity;
                }
            }

            // Update the order with new items and amount
            order.setItems(objectMapper.writeValueAsString(items));
            order.setAmount(newAmount);
            orderService.saveOrder(order);

            return Map.of("success", true, "message", "Item cancelled successfully", "orderDeleted", false);
        } catch (Exception e) {
            return Map.of("success", false, "message", "Failed to cancel item: " + e.getMessage());
        }
    }
}
