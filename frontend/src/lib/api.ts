import { CreateServiceOrderRequest, ServiceOrderResponse, UpdateServiceStatusRequest, WebResponse } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Initial fallback mock data for testing/demo when backend is offline
const MOCK_ORDERS: ServiceOrderResponse[] = [
  {
    id: '1',
    orderNumber: 'SVC-20260918-A101',
    status: 'IN_PROGRESS',
    category: 'LAPTOP',
    brand: 'ASUS',
    modelName: 'ROG Zephyrus G14',
    serialNumber: 'SN-ASUS-99201',
    issueDescription: 'Layar flicker dan kipas pendingin berbunyi bising saat bermain game berat.',
    customerEmail: 'budi.santoso@example.com',
    estimatedCost: 850000,
    totalCost: undefined,
    completionNotes: 'Pembersihan heatsink selesai, menunggu ganti modul layar LCD.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: '2',
    orderNumber: 'SVC-20260918-B202',
    status: 'WAITING_PARTS',
    category: 'SMARTPHONE',
    brand: 'Samsung',
    modelName: 'Galaxy S23 Ultra',
    serialNumber: 'SN-SS-88129',
    issueDescription: 'Baterai cepat kembung dan port charging tidak merespons.',
    customerEmail: 'dewi.lestari@example.com',
    estimatedCost: 1200000,
    totalCost: undefined,
    completionNotes: 'Sparepart flex port charging original sedang dipesan dari distributor resmi.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: '3',
    orderNumber: 'SVC-20260918-C303',
    status: 'PENDING',
    category: 'TELEVISION',
    brand: 'LG',
    modelName: 'OLED 55 C2',
    serialNumber: 'SN-LG-55091',
    issueDescription: 'TV mati total setelah terkena lonjakan listrik pasca petir.',
    customerEmail: 'ahmad.rizky@example.com',
    estimatedCost: 1500000,
    totalCost: undefined,
    completionNotes: 'Masuk antrean diagnosa teknisi power supply.',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: '4',
    orderNumber: 'SVC-20260918-D404',
    status: 'COMPLETED',
    category: 'WASHING_MACHINE',
    brand: 'Panasonic',
    modelName: 'NA-F70S7',
    serialNumber: 'SN-PANA-33011',
    issueDescription: 'Pengering tidak berputar dan ada bau sangit saat mode centrifuge.',
    customerEmail: 'siti.aminah@example.com',
    estimatedCost: 450000,
    totalCost: 450000,
    completionNotes: 'Penggantian kapasitor dan tali fan belt motor drum. Pengujian 3x siklus berhasil.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  }
];

let localOrdersStore: ServiceOrderResponse[] = [...MOCK_ORDERS];

export async function trackOrder(orderNumber: string): Promise<ServiceOrderResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/service-orders/track/${encodeURIComponent(orderNumber)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (res.ok) {
      const json: WebResponse<ServiceOrderResponse> = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn('Backend API unreachable, using local store for order track:', err);
  }

  // Fallback to local store matching
  const found = localOrdersStore.find(o => o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase());
  if (found) return found;

  throw new Error(`Nomor resi "${orderNumber}" tidak ditemukan dalam sistem.`);
}

export async function fetchAllOrders(): Promise<ServiceOrderResponse[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/service-orders`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (res.ok) {
      const json: WebResponse<ServiceOrderResponse[]> = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn('Backend API unreachable, using local store for dashboard orders:', err);
  }

  return localOrdersStore;
}

export async function createServiceOrder(data: CreateServiceOrderRequest): Promise<ServiceOrderResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/service-orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json: WebResponse<ServiceOrderResponse> = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn('Backend API unreachable, creating order in local store:', err);
  }

  // Fallback mock order creation
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomHex = Math.floor(1000 + Math.random() * 9000).toString();
  const generatedResi = `SVC-${dateStr}-${randomHex}`;

  const newOrder: ServiceOrderResponse = {
    id: String(Date.now()),
    orderNumber: generatedResi,
    status: 'PENDING',
    category: data.category,
    brand: data.brand,
    modelName: data.modelName,
    serialNumber: data.serialNumber || '-',
    issueDescription: data.issueDescription,
    customerEmail: data.customerEmail || 'pelanggan@example.com',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  localOrdersStore = [newOrder, ...localOrdersStore];
  return newOrder;
}

export async function updateOrderStatusApi(orderId: string, data: UpdateServiceStatusRequest): Promise<ServiceOrderResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/service-orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json: WebResponse<ServiceOrderResponse> = await res.json();
      return json.data;
    }
  } catch (err) {
    console.warn('Backend API unreachable, updating local store:', err);
  }

  // Fallback update in local store
  const index = localOrdersStore.findIndex(o => o.id === orderId);
  if (index !== -1) {
    localOrdersStore[index] = {
      ...localOrdersStore[index],
      status: data.status || localOrdersStore[index].status,
      estimatedCost: data.estimatedCost !== undefined ? data.estimatedCost : localOrdersStore[index].estimatedCost,
      totalCost: data.totalCost !== undefined ? data.totalCost : localOrdersStore[index].totalCost,
      completionNotes: data.completionNotes !== undefined ? data.completionNotes : localOrdersStore[index].completionNotes,
      updatedAt: new Date().toISOString(),
    };
    return localOrdersStore[index];
  }

  throw new Error('Order tidak ditemukan');
}
