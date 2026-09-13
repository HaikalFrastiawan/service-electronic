# Ticket API Specification

## Create Ticket
- **Endpoint:** `POST /api/v1/tickets`
- **Header:** `Authorization: Bearer <token>`

### Request Body
```json
{
  "device_type": "LAPTOP",
  "brand": "Asus",
  "model_series": "ROG Strix G15",
  "serial_number": "SN-ROG-2024-9982",
  "issue_description": "Layar mati total saat dinyalakan",
  "completeness": "Unit laptop, charger original 240W"
}
```

### Response Body (201 Created)
```json
{
  "success": true,
  "message": "Tiket servis berhasil dibuat",
  "data": {
    "id": "tkt_20260913-0001",
    "ticket_number": "SRV-20260913-001",
    "status": "RECEIVED",
    "created_at": "2026-09-13T12:25:00Z"
  },
  "timestamp": "2026-09-13T12:25:00Z"
}
```

---

## List Tickets (Search & Pagination)
- **Endpoint:** `GET /api/v1/tickets`
- **Header:** `Authorization: Bearer <token>`
- **Query Params:** `page=0`, `size=10`, `status=RECEIVED`, `search=Asus`

### Response Body (200 OK)
```json
{
  "success": true,
  "message": "Daftar tiket berhasil diambil",
  "data": [
    {
      "id": "tkt_20260913-0001",
      "ticket_number": "SRV-20260913-001",
      "customer_name": "Budi Santoso",
      "device_type": "LAPTOP",
      "brand": "Asus",
      "status": "RECEIVED",
      "created_at": "2026-09-13T12:25:00Z"
    }
  ],
  "meta": {
    "page": 0,
    "size": 10,
    "total_elements": 1,
    "total_pages": 1
  },
  "timestamp": "2026-09-13T12:30:00Z"
}
```

---

## Get Ticket Detail
- **Endpoint:** `GET /api/v1/tickets/{id}`
- **Header:** `Authorization: Bearer <token>`

### Response Body (200 OK)
```json
{
  "success": true,
  "message": "Detail tiket berhasil diambil",
  "data": {
    "id": "tkt_20260913-0001",
    "ticket_number": "SRV-20260913-001",
    "status": "DIAGNOSED",
    "diagnosis_notes": "IC Power Mainboard mengalami short sirkuit",
    "labor_fee": 150000,
    "parts_total": 350000,
    "total_estimated_cost": 500000,
    "parts_needed": [
      {
        "sparepart_id": "part_ic_pwr_01",
        "sparepart_name": "IC Power TPS51225",
        "quantity": 1,
        "unit_price": 350000,
        "subtotal": 350000
      }
    ]
  },
  "timestamp": "2026-09-13T14:05:00Z"
}
```

---

## Input Diagnosis (Technician)
- **Endpoint:** `PUT /api/v1/tickets/{id}/diagnosis`
- **Header:** `Authorization: Bearer <token>`

### Request Body
```json
{
  "diagnosis_notes": "IC Power Mainboard short",
  "labor_fee": 150000,
  "parts": [
    {
      "sparepart_id": "part_ic_pwr_01",
      "quantity": 1
    }
  ]
}
```

### Response Body (200 OK)
```json
{
  "success": true,
  "message": "Hasil diagnosis berhasil disimpan",
  "data": {
    "ticket_id": "tkt_20260913-0001",
    "status": "DIAGNOSED",
    "total_estimated_cost": 500000
  },
  "timestamp": "2026-09-13T14:00:00Z"
}
```

---

## Approve / Reject Estimation (Customer)
- **Endpoint:** `PATCH /api/v1/tickets/{id}/approval`
- **Header:** `Authorization: Bearer <token>`

### Request Body
```json
{
  "approved": true,
  "rejection_reason": null
}
```

### Response Body (200 OK)
```json
{
  "success": true,
  "message": "Persetujuan estimasi berhasil diproses",
  "data": {
    "ticket_id": "tkt_20260913-0001",
    "status": "APPROVED"
  },
  "timestamp": "2026-09-13T14:30:00Z"
}
```

---

## Update Ticket Status (Technician/Admin)
- **Endpoint:** `PATCH /api/v1/tickets/{id}/status`
- **Header:** `Authorization: Bearer <token>`

### Request Body
```json
{
  "status": "IN_PROGRESS",
  "notes": "Komponen sedang dipasang"
}
```

### Response Body (200 OK)
```json
{
  "success": true,
  "message": "Status tiket berhasil diperbarui",
  "data": {
    "ticket_id": "tkt_20260913-0001",
    "status": "IN_PROGRESS"
  },
  "timestamp": "2026-09-13T15:00:00Z"
}
```
