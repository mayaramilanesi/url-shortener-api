# Swagger Documentation - URL Shortener API

## 📋 Overview

Complete Swagger documentation has been implemented for the URL shortening API. The documentation includes all endpoints, data models, and authentication schemas.

## 🚀 How to Access Documentation

### 🏠 Local Development

1. **Start the application:**

   ```bash
   make setup
   ```

   > 💡 **Alternative:** You can also use `npm run start:dev` for local development without Docker

2. **Access Documentation:**
   - **Swagger UI**: `http://localhost:8080/docs`
   - **HTML Documentation**: `http://localhost:8080/readme`

### ☁️ Production/Cloud Deployment

1. **Access Documentation** (replace `your-domain.com` with your actual domain):
   - **Swagger UI**: `https://your-domain.com/docs`
   - **HTML Documentation**: `https://your-domain.com/readme`

### 📱 Features Available

- **Interactive Swagger UI**: Complete interface with all documented endpoints
- **HTML Documentation**: Beautiful, responsive page ideal for beginners
- **Real-time Testing**: Test all endpoints directly from the documentation

## 📚 Documented Features

### 🔐 Authentication (`/auth`)

- **POST /auth/signup** - Register new user
- **POST /auth/login** - User login and get JWT token

### 🔗 URL Management (`/urls`)

- **GET /urls** - List authenticated user's URLs
- **PATCH /urls/:id** - Update existing URL
- **DELETE /urls/:id** - Delete URL (soft delete)

### ✂️ Shortening (`/shorten`)

- **POST /shorten** - Create shortened URL (optional authentication)

### 🔄 Redirection (`/:code`) ⚠️ DEPRECATED

- **GET /:code** - Redirect to original URL (DO NOT TEST IN SWAGGER)

> ⚠️ **IMPORTANT:** The redirect endpoint is marked as **deprecated** in Swagger to avoid confusion. It works normally, but should be tested directly in the browser (e.g., `https://your-domain.com/abc123` or `http://localhost:8080/abc123` for local development), not through the Swagger interface.

## 🔑 JWT Authentication

### How to use authentication:

1. **Login** through the `/auth/login` endpoint
2. **Copy the token** returned in the `access_token` field
3. **In Swagger UI:**
   - Click the "Authorize" button (🔒)
   - Paste the token in the "Value" field
   - Click "Authorize"

### Protected endpoints:

- All endpoints in `/urls/*` require authentication
- The `/shorten` endpoint accepts optional authentication

## 📊 Data Models

### Input DTOs:

- **CreateUserDto** - User registration data
- **LoginDto** - Login credentials
- **CreateUrlDto** - URL to shorten
- **UpdateUrlDto** - URL update data

### Response DTOs:

- **AuthResponseDto** - Login response
- **UrlResponseDto** - URL data
- **ShortenResponseDto** - Shortened URL

### Entities:

- **User** - User data
- **Url** - Shortened URL data

## 🎯 Usage Examples

### 1. Register user:

```json
POST /auth/signup
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

### 2. Login:

```json
POST /auth/login
{
  "email": "user@example.com",
  "password": "mypassword123"
}
```

### 3. Shorten URL:

```json
POST /shorten
{
  "url": "https://example.com/my-very-long-url"
}
```

### 4. List URLs (authenticated):

```
GET /urls
Authorization: Bearer {your-jwt-token}
```

### 5. Test redirection (in browser):

**Local Development:**

```
http://localhost:8080/{returned-code}
```

**Production/Cloud:**

```
https://your-domain.com/{returned-code}
```

_Example: If `/shorten` returned `https://your-domain.com/abc123`, access this URL directly in the browser_

## 🛠️ Implemented Features

### ✅ Swagger Configuration:

- API title and description
- Versioning
- Tags organized by functionality
- Bearer JWT authentication schema
- Development server configured

### ✅ Endpoint Documentation:

- Detailed descriptions of each operation
- Request/response examples
- Documented HTTP status codes
- Common error documentation

### ✅ Data Models:

- All DTOs documented with examples
- Entities with detailed properties
- Validations and formats specified

### ✅ Error Handling:

- Standardized error responses
- Appropriate status codes
- Descriptive messages

## 🔧 Technical Configuration

### Dependencies used:

- `@nestjs/swagger` - Documentation generation
- `swagger-ui-express` - Web interface
- `marked` - Markdown to HTML conversion

### Configuration in main.ts:

- DocumentBuilder for configuration
- SwaggerModule for generation
- Authorization persistence enabled

## 📝 Important Notes

1. **Optional Authentication:** The `/shorten` endpoint works with or without authentication
2. **Anonymous URLs:** URLs created without authentication don't appear in user listings
3. **Soft Delete:** Deleted URLs are marked as deleted, not permanently removed
4. **Counters:** Each access via short code increments the click counter

## 🎨 Swagger Interface

The Swagger UI offers:

- Interactive testing of all endpoints
- Automatic data validation
- Pre-filled examples
- Complete schema documentation
- Integrated authentication
- Real-time responses

## 📄 HTML Documentation

The HTML documentation page offers:

- Modern and responsive design
- Complete documentation in a beautiful layout
- Direct link to Swagger UI
- Ideal for beginner users
- Mobile-friendly interface

**To access the documentation:**

- **Local Development:** `http://localhost:8080/docs` (Swagger) or `http://localhost:8080/readme` (HTML)
- **Production/Cloud:** `https://your-domain.com/docs` (Swagger) or `https://your-domain.com/readme` (HTML)

Replace `your-domain.com` with your actual deployed domain!
