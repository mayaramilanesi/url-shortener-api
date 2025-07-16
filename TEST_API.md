# 🧪 Testing the API - Quick Guide

After running `make setup`, test if everything is working:

## 1. 🏥 Health Check

```bash
curl http://localhost:8080
# Should return: "Hello World!"
```

## 2. ✂️ Shorten a URL

```bash
curl -X POST http://localhost:8080/shorten \
  -H "Content-Type: application/json" \
  -d '{"url": "https://github.com"}'

# Expected response:
# {"shortUrl": "http://localhost:8080/abc123"}
```

## 3. 🔗 Test Redirection

Use the code returned above:

```bash
curl -I http://localhost:8080/abc123
# Should return 302 and Location: https://github.com
```

## 4. 🔐 Create User

```bash
curl -X POST http://localhost:8080/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password123"}'

# Expected response:
# {"accessToken": "eyJhbGciOiJIUzI1NiIs..."}
```

## 5. 📖 Access Documentation

Open in browser:

- **Swagger UI**: http://localhost:8080/docs
- **HTML Documentation**: http://localhost:8080/readme

## 🎯 Quick Test via Browser

1. Access: http://localhost:8080/docs
2. Test the `POST /shorten` endpoint
3. Use the returned code to access the shortened URL
4. See the redirection working!

## ✅ Everything Working?

If all the tests above worked, your API is **100% operational**! 🎉

## 🔧 Logs for Debug

If something didn't work:

```bash
make logs
# or
docker-compose logs -f
```
