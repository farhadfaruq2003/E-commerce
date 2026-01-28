# Copilot Instructions for Ecommerce Backend

## Architecture Overview
This is a Spring Boot-based e-commerce backend application with JWT authentication. The application manages users, products, orders, and addresses using MySQL database with JPA/Hibernate.

### Key Components
- **Entities**: `User`, `Product`, `Order`, `Address` in `entity/` package
- **Repositories**: JPA repositories in `repository/` package extending `JpaRepository`
- **Controllers**: REST API endpoints in `controller/` package
- **Security**: JWT-based authentication with `JwtFilter` and `JwtService`
- **Configuration**: Security config in `config/SecurityConfig.java`

### Data Model Patterns
- User cart stored as JSON string in `cartItems` TEXT field
- Product images stored as base64 or URL in `image` TEXT field
- Order items stored as JSON in `items` TEXT field
- User references in orders and addresses use `userId` as String (email-based)

### Authentication Flow
1. User logs in via `/api/user/login` (currently hardcoded to "user@gmail.com")
2. Receives JWT token with email and role claims
3. Subsequent requests include `Authorization: Bearer <token>`
4. `JwtFilter` validates token and sets `email` and `role` in request attributes

### Security Configuration
- Public endpoints: login, register, seller login, product list/id
- All other endpoints require authentication
- CSRF disabled

### Development Notes
- Uses Spring Boot with Jakarta Persistence
- Database: MySQL with `ddl-auto=update`
- Port: 8080
- Controllers are currently stubbed (return strings instead of data)

### Common Patterns
- Entities use `@Column(columnDefinition = "TEXT")` for large strings
- Repositories follow standard JPA naming (e.g., `findByEmail`)
- Controllers use `@Autowired` for services (field injection)

### Build and Run
- Build with Maven: `mvn clean compile`
- Run with Maven: `mvn spring-boot:run`
- Requires Java 17+ and Maven installed
- Uses H2 in-memory database for development (no external DB setup needed)
- H2 console available at http://localhost:8080/h2-console (JDBC URL: jdbc:h2:mem:ecommerce, username: sa, password: password)
- JWT secret hardcoded in `JwtService`

This is a skeleton implementation - focus on completing the stubbed methods and proper data handling.