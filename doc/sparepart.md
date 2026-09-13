# Sparepart API Specification

## Get Sparepart Catalog
- **Endpoint:** `GET /api/v1/spareparts`
- **Header:** `Authorization: Bearer <token>`
- **Query Params:** `category=RAM`, `search=Corsair`, `page=0`, `size=10`

### Response Body (200 OK)
```json
{
  "success": true,
  "message": "Katalog sparepart berhasil diambil",
  "data": [
    {
      "id": "part_ram_ddr4_16gb",
      "part_code": "SP-RAM-DDR4-16GB",
      "name": "RAM Corsair SODIMM DDR4 16GB",
      "category": "RAM",
      "price": 650000,
      "stock": 10,
      "unit": "Pcs",
      "is_active": true
    }
  ],
  "meta": {
    "page": 0,
    "size": 10,
    "total_elements": 1,
    "total_pages": 1
  },
  "timestamp": "2026-09-13T12:35:00Z"
}
```

---

## Create Sparepart (Admin Only)
- **Endpoint:** `POST /api/v1/spareparts`
- **Header:** `Authorization: Bearer <token>`

### Request Body
```json
{
  "part_code": "SP-RAM-DDR4-16GB",
  "name": "RAM Corsair SODIMM DDR4 16GB",
  "category": "RAM",
  "price": 650000,
  "stock": 10,
  "unit": "Pcs"
}
```

### Response Body (201 Created)
```json
{
  "success": true,
  "message": "Sparepart berhasil ditambahkan",
  "data": {
    "id": "part_ram_ddr4_16gb",
    "part_code": "SP-RAM-DDR4-16GB",
    "name": "RAM Corsair SODIMM DDR4 16GB",
    "price": 650000,
    "stock": 10
  },
  "timestamp": "2026-09-13T12:40:00Z"
}
```

---

## Update Sparepart / Stock (Admin Only)
- **Endpoint:** `PUT /api/v1/spareparts/{id}`
- **Header:** `Authorization: Bearer <token>`

### Request Body
```json
{
  "name": "RAM Corsair SODIMM DDR4 16GB",
  "category": "RAM",
  "price": 620000,
  "stock": 25,
  "is_active": true
}
```

### Response Body (200 OK)
```json
{
  "success": true,
  "message": "Sparepart berhasil diperbarui",
  "data": {
    "id": "part_ram_ddr4_16gb",
    "stock": 25,
    "price": 620000
  },
  "timestamp": "2026-09-13T12:45:00Z"
}
```

---

## Disable Sparepart (Admin Only)
- **Endpoint:** `DELETE /api/v1/spareparts/{id}`
- **Header:** `Authorization: Bearer <token>`

### Response Body (200 OK)
```json
{
  "success": true,
  "message": "Sparepart berhasil dinonaktifkan",
  "data": {
    "id": "part_ram_ddr4_16gb",
    "is_active": false
  },
  "timestamp": "2026-09-13T12:50:00Z"
}
```
