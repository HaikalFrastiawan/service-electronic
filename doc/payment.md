# Payment & Invoice API Specification

## Get Invoice Detail
- **Endpoint:** `GET /api/v1/tickets/{id}/invoice`
- **Header:** `Authorization: Bearer <token>`

### Response Body (200 OK)
```json
{
  "success": true,
  "message": "Invoice berhasil diambil",
  "data": {
    "invoice_number": "INV-202609-0042",
    "ticket_number": "SRV-20260913-001",
    "items": [
      {
        "description": "Jasa Perbaikan Mainboard",
        "amount": 150000
      },
      {
        "description": "IC Power Management TPS51225",
        "amount": 350000
      }
    ],
    "subtotal": 500000,
    "tax_amount": 55000,
    "grand_total": 555000,
    "payment_status": "UNPAID"
  },
  "timestamp": "2026-09-13T15:30:00Z"
}
```

---

## Process Payment & Close Ticket
- **Endpoint:** `POST /api/v1/tickets/{id}/payments`
- **Header:** `Authorization: Bearer <token>`

### Request Body
```json
{
  "payment_method": "CASH",
  "amount_paid": 600000,
  "notes": "Pembayaran tunai di kasir"
}
```

### Response Body (200 OK)
```json
{
  "success": true,
  "message": "Pembayaran berhasil diproses",
  "data": {
    "transaction_id": "trx_98123891238",
    "invoice_number": "INV-202609-0042",
    "grand_total": 555000,
    "amount_paid": 600000,
    "change_amount": 45000,
    "payment_status": "PAID",
    "ticket_status": "CLOSED"
  },
  "timestamp": "2026-09-13T16:00:00Z"
}
```
