# User & Auth API Specification

## Register User
- **Endpoint:** `POST /api/v1/auth/register`
- **Header:** `Content-Type: application/json`

### Request Body
```json
{
  "full_name": "Budi Santoso",
  "email": "budi.santoso@example.com",
  "password": "Password123!",
  "phone_number": "081234567890",
  "address": "Jl. Merdeka No. 45, Jakarta Selatan"
}
```

### Response Body (201 Created)
```json
{
  "success": true,
  "message": "Registrasi berhasil",
  "data": {
    "id": "usr_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "full_name": "Budi Santoso",
    "email": "budi.santoso@example.com",
    "phone_number": "081234567890",
    "role": "ROLE_CUSTOMER",
    "created_at": "2026-09-13T12:05:00Z"
  },
  "timestamp": "2026-09-13T12:05:00Z"
}
```

---

## Login User
- **Endpoint:** `POST /api/v1/auth/login`
- **Header:** `Content-Type: application/json`

### Request Body
```json
{
  "email": "budi.santoso@example.com",
  "password": "Password123!"
}
```

### Response Body (200 OK)
```json
{
  "success": true,
  "message": "Login berhasil",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "d98f7e6a-5b4c-3d2e-1f0a-9b8c7d6e5f4a",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": "usr_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "full_name": "Budi Santoso",
      "email": "budi.santoso@example.com",
      "role": "ROLE_CUSTOMER"
    }
  },
  "timestamp": "2026-09-13T12:10:00Z"
}
```

---

## Get Current User Profile
- **Endpoint:** `GET /api/v1/users/me`
- **Header:** `Authorization: Bearer <token>`

### Response Body (200 OK)
```json
{
  "success": true,
  "message": "Profil berhasil diambil",
  "data": {
    "id": "usr_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "full_name": "Budi Santoso",
    "email": "budi.santoso@example.com",
    "phone_number": "081234567890",
    "address": "Jl. Merdeka No. 45, Jakarta Selatan",
    "role": "ROLE_CUSTOMER",
    "created_at": "2026-09-13T12:05:00Z"
  },
  "timestamp": "2026-09-13T12:15:00Z"
}
```

---

## Update Current User Profile
- **Endpoint:** `PUT /api/v1/users/me`
- **Header:** `Authorization: Bearer <token>`

### Request Body
```json
{
  "full_name": "Budi Santoso Wibowo",
  "phone_number": "081299998888",
  "address": "Jl. Sudirman No. 12, Jakarta Pusat"
}
```

### Response Body (200 OK)
```json
{
  "success": true,
  "message": "Profil berhasil diperbarui",
  "data": {
    "id": "usr_9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "full_name": "Budi Santoso Wibowo",
    "email": "budi.santoso@example.com",
    "phone_number": "081299998888",
    "address": "Jl. Sudirman No. 12, Jakarta Pusat",
    "role": "ROLE_CUSTOMER",
    "updated_at": "2026-09-13T12:20:00Z"
  },
  "timestamp": "2026-09-13T12:20:00Z"
}
```
