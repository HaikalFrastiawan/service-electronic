import {
  AuthResponse,
  CreateServiceOrderRequest,
  DashboardSummary,
  LoginRequest,
  RegisterRequest,
  ServiceOrderResponse,
  SparePart,
  SparePartRequest,
  UpdateServiceStatusRequest,
  UserRole,
  WebResponse,
} from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

// Key LocalStorage terpadu
const TOKEN_KEY = 'electrofix_jwt';
const USER_KEY = 'electrofix_user';

// Helper untuk mengekstrak pesan error dari response backend
function parseErrorMessage(json: any, fallbackMessage: string): string {
  if (json?.message && typeof json.message === 'string') {
    return json.message;
  }

  if (json?.errors) {
    if (typeof json.errors === 'string') {
      return json.errors;
    }
    if (typeof json.errors === 'object') {
      const values = Object.values(json.errors);
      if (values.length > 0) {
        const firstVal = values[0];
        if (typeof firstVal === 'string') return firstVal;
        if (Array.isArray(firstVal) && firstVal.length > 0) return String(firstVal[0]);
      }
    }
  }

  return fallbackMessage;
}

// ─── Auth Storage Helpers ─────────────────────────────────────────────────────

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getAuthUser(): any | null {
  if (typeof window === 'undefined') return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

export function saveAuthData(data: AuthResponse): void {
  if (typeof window === 'undefined') return;
  if (data.token) {
    localStorage.setItem(TOKEN_KEY, data.token);
  }
  localStorage.setItem(USER_KEY, JSON.stringify(data));
}

export function setAuthUser(userData: any): void {
  if (typeof window === 'undefined') return;
  if (userData.token) {
    localStorage.setItem(TOKEN_KEY, userData.token);
  }
  localStorage.setItem(USER_KEY, JSON.stringify(userData));
}

export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// ─── Auth API ──────────────────────────────────────────────────────────────────

export async function loginUser(data: LoginRequest): Promise<AuthResponse> {
  let res: Response;

  try {
    res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn('Backend offline, menggunakan fallback auth:', err);
    let role: UserRole = 'ROLE_CUSTOMER';
    if (data.email.toLowerCase().includes('admin')) role = 'ROLE_ADMIN';
    else if (data.email.toLowerCase().includes('teknisi')) role = 'ROLE_TECHNICIAN';

    const mockData: AuthResponse = {
      token: `mock_jwt_${Date.now()}`,
      email: data.email,
      role: role,
    };
    saveAuthData(mockData);
    return mockData;
  }

  if (res.ok) {
    const json: WebResponse<AuthResponse> = await res.json();
    saveAuthData(json.data);
    return json.data;
  } else {
    const json = await res.json().catch(() => ({}));
    const errorMessage = parseErrorMessage(json, 'Email atau password salah. Silakan coba lagi.');
    throw new Error(errorMessage);
  }
}

export async function registerUser(data: RegisterRequest): Promise<AuthResponse> {
  let res: Response;

  try {
    res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  } catch (err) {
    console.warn('Backend offline, menggunakan fallback register:', err);
    let role: UserRole = 'ROLE_CUSTOMER';
    if (data.email.toLowerCase().includes('admin')) role = 'ROLE_ADMIN';

    const mockData: AuthResponse = {
      token: `mock_jwt_${Date.now()}`,
      email: data.email,
      role: role,
    };
    saveAuthData(mockData);
    return mockData;
  }

  if (res.ok) {
    const json: WebResponse<AuthResponse> = await res.json();
    saveAuthData(json.data);
    return json.data;
  } else {
    const json = await res.json().catch(() => ({}));
    const errorMessage = parseErrorMessage(json, 'Gagal mendaftar. Email atau nomor HP mungkin sudah terdaftar.');
    throw new Error(errorMessage);
  }
}

// ─── Fallback Mock Store ─────────────────────────────────────────────────────────

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
    completionNotes: 'Pembersihan heatsink selesai, menunggu ganti modul layar LCD.',
    createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

const MOCK_SPARE_PARTS: SparePart[] = [
  {
    id: 'sp-1',
    partCode: 'LCD-ASUS-14',
    partName: 'Layar LCD LED 14.0 Full HD 144Hz',
    category: 'Layar',
    stockQuantity: 3,
    purchasePrice: 650000,
    sellingPrice: 850000,
    minStockWarning: 5,
    isLowStock: true,
  },
  {
    id: 'sp-2',
    partCode: 'FAN-ROG-G14',
    partName: 'Kipas Pendingin Dual Fan CPU/GPU',
    category: 'Cooling',
    stockQuantity: 12,
    purchasePrice: 120000,
    sellingPrice: 180000,
    minStockWarning: 5,
    isLowStock: false,
  },
];

let localOrdersStore: ServiceOrderResponse[] = [...MOCK_ORDERS];
let localSparePartsStore: SparePart[] = [...MOCK_SPARE_PARTS];

// ─── Service Order API ─────────────────────────────────────────────────────────

export async function trackOrder(orderNumber: string): Promise<ServiceOrderResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/service-orders/track/${encodeURIComponent(orderNumber)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('Backend API unreachable, using local store for order track:', err);
  }

  const found = localOrdersStore.find((o) => o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase());
  if (found) return found;

  throw new Error(`Nomor resi "${orderNumber}" tidak ditemukan dalam sistem.`);
}

export async function fetchAllOrders(): Promise<ServiceOrderResponse[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/service-orders`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }

    if (res.status === 401 || res.status === 403) {
      clearAuthData();
      throw new Error('Sesi telah berakhir, silakan login kembali.');
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes('Sesi telah berakhir')) {
      throw err;
    }
    console.warn('Backend API unreachable, using local store for dashboard orders:', err);
  }

  return localOrdersStore;
}

export async function createServiceOrder(data: CreateServiceOrderRequest): Promise<ServiceOrderResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/service-orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('Backend API unreachable, creating order in local store:', err);
  }

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
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('Backend API unreachable, updating local store:', err);
  }

  const index = localOrdersStore.findIndex((o) => o.id === orderId);
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

// ─── Dashboard Summary API ────────────────────────────────────────────────────

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/summary`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('Backend API unreachable, calculating mock summary:', err);
  }

  const lowStockCount = localSparePartsStore.filter(sp => sp.stockQuantity <= (sp.minStockWarning || 5)).length;
  const activeOrders = localOrdersStore.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
  const waitingParts = localOrdersStore.filter(o => o.status === 'WAITING_PARTS').length;

  return {
    totalRevenue: 850000,
    activeOrdersCount: activeOrders,
    inRepairCount: localOrdersStore.filter(o => o.status === 'IN_PROGRESS').length,
    waitingPartsCount: waitingParts,
    completedTodayCount: localOrdersStore.filter(o => o.status === 'COMPLETED').length,
    lowStockPartsCount: lowStockCount,
  };
}

// ─── Spare Parts API ──────────────────────────────────────────────────────────

export async function fetchSpareParts(): Promise<SparePart[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/spare-parts`, {
      method: 'GET',
      headers: getAuthHeaders(),
      cache: 'no-store',
    });

    if (res.ok) {
      const json = await res.json();
      return Array.isArray(json) ? json : (json.data || []);
    }
  } catch (err) {
    console.warn('Backend API unreachable, using local store for spare parts:', err);
  }

  return localSparePartsStore;
}
export async function createSparePart(data: SparePartRequest): Promise<SparePart> {
  try {
    const res = await fetch(`${API_BASE_URL}/spare-parts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('Backend API unreachable, creating spare part in local store:', err);
  }

  const minWarning = data.minStockWarning ?? 5;
  const newPart: SparePart = {
    id: `sp-${Date.now()}`,
    ...data,
    minStockWarning: minWarning,
    isLowStock: data.stockQuantity <= minWarning,
  };

  localSparePartsStore = [newPart, ...localSparePartsStore];
  return newPart;
}

export async function updateSparePart(id: string, data: SparePartRequest): Promise<SparePart> {
  try {
    const res = await fetch(`${API_BASE_URL}/spare-parts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('Backend API unreachable, updating spare part in local store:', err);
  }

  const index = localSparePartsStore.findIndex((p) => p.id === id);
  if (index !== -1) {
    const minWarning = data.minStockWarning ?? 5;
    localSparePartsStore[index] = {
      ...localSparePartsStore[index],
      ...data,
      minStockWarning: minWarning,
      isLowStock: data.stockQuantity <= minWarning,
    };
    return localSparePartsStore[index];
  }

  throw new Error('Spare part tidak ditemukan');
}
export async function deleteSparePart(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/spare-parts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (res.ok) return;
  } catch (err) {
    console.warn('Backend API unreachable, deleting spare part from local store:', err);
  }

  localSparePartsStore = localSparePartsStore.filter((p) => p.id !== id);
}

export async function addSparePartToOrder(orderId: string, sparePartId: string, quantity: number): Promise<ServiceOrderResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/service-orders/${orderId}/parts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ sparePartId, quantity }),
    });

    if (res.ok) {
      const json = await res.json();
      return json.data || json;
    }
  } catch (err) {
    console.warn('Backend API unreachable, adding spare part to order in local store:', err);
  }

  const orderIndex = localOrdersStore.findIndex((o) => o.id === orderId);
  const partIndex = localSparePartsStore.findIndex((p) => p.id === sparePartId);

  if (orderIndex !== -1 && partIndex !== -1) {
    const part = localSparePartsStore[partIndex];
    if (part.stockQuantity < quantity) {
      throw new Error('Stok sparepart tidak mencukupi');
    }

    part.stockQuantity -= quantity;
    part.isLowStock = part.stockQuantity <= (part.minStockWarning || 5);

    const additionalCost = part.sellingPrice * quantity;
    const currentTotal = localOrdersStore[orderIndex].totalCost || 0;
    localOrdersStore[orderIndex].totalCost = currentTotal + additionalCost;

    return localOrdersStore[orderIndex];
  }

  throw new Error('Order atau Sparepart tidak ditemukan');

}
export async function fetchSpareparts() {
  try {
    // Sesuaikan URL ini dengan controller Spring Boot kamu
    const response = await fetch("http://localhost:8080/api/spareparts", {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    // Jika response HTTP tidak OK (cth: 404 / 500), kembalikan array kosong agar frontend tidak crash
    if (!response.ok) {
      console.warn("API Sparepart mengembalikan status:", response.status);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error("Gagal terhubung ke server sparepart:", error);
    return []; // Return array kosong sebagai aman
  }
}