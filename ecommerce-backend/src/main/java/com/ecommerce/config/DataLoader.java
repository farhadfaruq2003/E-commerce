package com.ecommerce.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.ecommerce.entity.Product;
import com.ecommerce.service.ProductService;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private ProductService productService;

    @Override
    public void run(String... args) throws Exception {
        // Check if the database is empty
        if (productService.isEmpty()) {
            System.out.println("Database is empty. Initializing with default products...");
            
            // Create and save products
            List<Product> defaultProducts = Arrays.asList(
                createProduct("Potato 500g", "[\"Fresh and organic\",\"Rich in carbohydrates\",\"Ideal for curries and fries\"]", 25, 20, "[\"https://images.unsplash.com/photo-1603161660785-70c4c1c0f04f?w=300\"]", "Vegetables"),
                createProduct("Tomato 1 kg", "[\"Juicy and ripe\",\"Rich in Vitamin C\",\"Perfect for salads and sauces\",\"Farm fresh quality\"]", 40, 35, "[\"https://images.unsplash.com/photo-1594470898140-16b7b43210f0?w=300\"]", "Vegetables"),
                createProduct("Carrot 500g", "[\"Sweet and crunchy\",\"Good for eyesight\",\"Ideal for juices and salads\"]", 30, 28, "[\"https://images.unsplash.com/photo-1542818212-9899bafcb9db?w=300\"]", "Vegetables"),
                createProduct("Spinach 500g", "[\"Rich in iron\",\"High in vitamins\",\"Perfect for soups and salads\"]", 18, 15, "[\"https://images.unsplash.com/photo-1596772227804-ee6d2e4f3e0e?w=300\"]", "Vegetables"),
                createProduct("Onion 500g", "[\"Fresh and pungent\",\"Perfect for cooking\",\"A kitchen staple\"]", 22, 19, "[\"https://images.unsplash.com/photo-1581044799570-77f3bdd97356?w=300\"]", "Vegetables"),
                createProduct("Apple 1 kg", "[\"Crisp and juicy\",\"Rich in fiber\",\"Boosts immunity\",\"Perfect for snacking and desserts\",\"Organic and farm fresh\"]", 120, 110, "[\"https://images.unsplash.com/photo-1570913149827-d2ac885b6b0f?w=300\"]", "Fruits"),
                createProduct("Orange 1 kg", "[\"Juicy and sweet\",\"Rich in Vitamin C\",\"Perfect for juices and salads\"]", 80, 75, "[\"https://images.unsplash.com/photo-1548369735-6e9f1c5fdc68?w=300\"]", "Fruits"),
                createProduct("Banana 1 kg", "[\"Sweet and ripe\",\"High in potassium\",\"Great for smoothies and snacking\"]", 50, 45, "[\"https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300\"]", "Fruits"),
                createProduct("Mango 1 kg", "[\"Sweet and flavorful\",\"Perfect for smoothies and desserts\",\"Rich in Vitamin A\"]", 150, 140, "[\"https://images.unsplash.com/photo-1581044799570-77f3bdd97356?w=300\"]", "Fruits"),
                createProduct("Grapes 500g", "[\"Fresh and juicy\",\"Rich in antioxidants\",\"Perfect for snacking and fruit salads\"]", 70, 65, "[\"https://images.unsplash.com/photo-1581044799570-77f3bdd97356?w=300\"]", "Fruits"),
                createProduct("Amul Milk 1L", "[\"Pure and fresh\",\"Rich in calcium\",\"Ideal for tea, coffee, and desserts\",\"Trusted brand quality\"]", 60, 55, "[\"https://images.unsplash.com/photo-1602884520881-88fb9443c10d?w=300\"]", "Dairy"),
                createProduct("Paneer 200g", "[\"Soft and fresh\",\"Rich in protein\",\"Ideal for curries and snacks\"]", 90, 85, "[\"https://images.unsplash.com/photo-1603161660785-70c4c1c0f04f?w=300\"]", "Dairy"),
                createProduct("Eggs 12 pcs", "[\"Farm fresh\",\"Rich in protein\",\"Ideal for breakfast and baking\"]", 90, 85, "[\"https://images.unsplash.com/photo-1594041680534-e8c8c6c96397?w=300\"]", "Dairy"),
                createProduct("Cheese 200g", "[\"Creamy and delicious\",\"Perfect for pizzas and sandwiches\",\"Rich in calcium\"]", 140, 130, "[\"https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=300\"]", "Dairy"),
                createProduct("Coca-Cola 1.5L", "[\"Refreshing and fizzy\",\"Perfect for parties and gatherings\",\"Best served chilled\"]", 80, 75, "[\"https://images.unsplash.com/photo-1548369735-6e9f1c5fdc68?w=300\"]", "Drinks"),
                createProduct("Pepsi 1.5L", "[\"Chilled and refreshing\",\"Perfect for celebrations\",\"Best served cold\"]", 78, 73, "[\"https://images.unsplash.com/photo-1602884520881-88fb9443c10d?w=300\"]", "Drinks"),
                createProduct("Sprite 1.5L", "[\"Refreshing citrus taste\",\"Perfect for hot days\",\"Best served chilled\"]", 79, 74, "[\"https://images.unsplash.com/photo-1548369735-6e9f1c5fdc68?w=300\"]", "Drinks"),
                createProduct("Fanta 1.5L", "[\"Sweet and fizzy\",\"Great for parties and gatherings\",\"Best served cold\"]", 77, 72, "[\"https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300\"]", "Drinks"),
                createProduct("7 Up 1.5L", "[\"Refreshing lemon-lime flavor\",\"Perfect for refreshing\",\"Best served chilled\"]", 76, 71, "[\"https://images.unsplash.com/photo-1518976712520-0a2c37ba1c1f?w=300\"]", "Drinks"),
                createProduct("Basmati Rice 5kg", "[\"Long grain and aromatic\",\"Perfect for biryani and pulao\",\"Premium quality\"]", 550, 520, "[\"https://images.unsplash.com/photo-1516450360442-8ac9f7d83a98?w=300\"]", "Grains"),
                createProduct("Wheat Flour 5kg", "[\"High-quality whole wheat\",\"Soft and fluffy rotis\",\"Rich in nutrients\"]", 250, 230, "[\"https://images.unsplash.com/photo-1542818212-9899bafcb9db?w=300\"]", "Grains"),
                createProduct("Organic Quinoa 500g", "[\"High in protein and fiber\",\"Gluten-free\",\"Rich in vitamins and minerals\"]", 450, 420, "[\"https://images.unsplash.com/photo-1516450360442-8ac9f7d83a98?w=300\"]", "Grains"),
                createProduct("Brown Rice 1kg", "[\"Whole grain and nutritious\",\"Helps in weight management\",\"Good source of magnesium\"]", 120, 110, "[\"https://images.unsplash.com/photo-1516450360442-8ac9f7d83a98?w=300\"]", "Grains"),
                createProduct("Barley 1kg", "[\"Rich in fiber\",\"Helps improve digestion\",\"Low in fat and cholesterol\"]", 150, 140, "[\"https://images.unsplash.com/photo-1516450360442-8ac9f7d83a98?w=300\"]", "Grains"),
                createProduct("Brown Bread 400g", "[\"Soft and healthy\",\"Made from whole wheat\",\"Ideal for breakfast and sandwiches\"]", 40, 35, "[\"https://images.unsplash.com/photo-1505427585681-6b707080e4a7?w=300\"]", "Bakery"),
                createProduct("Butter Croissant 100g", "[\"Flaky and buttery\",\"Freshly baked\",\"Perfect for breakfast or snacks\"]", 50, 45, "[\"https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300\"]", "Bakery"),
                createProduct("Chocolate Cake 500g", "[\"Rich and moist\",\"Made with premium cocoa\",\"Ideal for celebrations and parties\"]", 350, 325, "[\"https://cdn.pixabay.com/photo/2017/08/20/20/05/chocolate-cake-2662566_1280.jpg\"]", "Bakery"),
                createProduct("Whole Bread 400g", "[\"Healthy and nutritious\",\"Made with whole wheat flour\",\"Ideal for sandwiches and toast\"]", 45, 40, "[\"https://cdn.pixabay.com/photo/2017/03/18/18/03/bread-2155952_1280.jpg\"]", "Bakery"),
                createProduct("Vanilla Muffins 6 pcs", "[\"Soft and fluffy\",\"Perfect for a quick snack\",\"Made with real vanilla\"]", 100, 90, "[\"https://cdn.pixabay.com/photo/2017/03/26/21/47/muffins-2175711_1280.jpg\"]", "Bakery"),
                createProduct("Maggi Noodles 280g", "[\"Instant and easy to cook\",\"Delicious taste\",\"Popular among kids and adults\"]", 55, 50, "[\"https://cdn.pixabay.com/photo/2019/07/19/16/19/noodles-4347474_1280.jpg\"]", "Instant"),
                createProduct("Top Ramen 270g", "[\"Quick and easy to prepare\",\"Spicy and flavorful\",\"Loved by college students and families\"]", 45, 40, "[\"https://cdn.pixabay.com/photo/2017/03/26/21/27/ramen-2175677_1280.jpg\"]", "Instant"),
                createProduct("Knorr Cup Soup 70g", "[\"Convenient for on-the-go\",\"Healthy and nutritious\",\"Variety of flavors\"]", 35, 30, "[\"https://cdn.pixabay.com/photo/2016/03/22/16/03/soup-1272936_1280.jpg\"]", "Instant"),
                createProduct("Yippee Noodles 260g", "[\"Non-fried noodles for healthier choice\",\"Tasty and filling\",\"Convenient for busy schedules\"]", 50, 45, "[\"https://cdn.pixabay.com/photo/2019/07/19/16/19/noodles-4347474_1280.jpg\"]", "Instant"),
                createProduct("Oats Noodles 72g", "[\"Healthy alternative with oats\",\"Good for digestion\",\"Perfect for breakfast or snacks\"]", 40, 35, "[\"https://cdn.pixabay.com/photo/2016/03/26/22/01/oatmeal-1280659_1280.jpg\"]", "Instant")
            );

            for (Product product : defaultProducts) {
                productService.saveProduct(product);
            }
            
            System.out.println("Default products added to database.");
        } else {
            System.out.println("Database already has products. Skipping initialization.");
        }
    }

    private Product createProduct(String name, String description, double price, double offerPrice, String image, String category) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setOfferPrice(offerPrice);
        product.setImage(image);
        product.setCategory(category);
        product.setInStock(true);
        return product;
    }
}