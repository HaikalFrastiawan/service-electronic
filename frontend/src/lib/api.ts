import {
  AuthResponse,
  CreateServiceOrderRequest,
  LoginRequest,
  RegisterRequest,
  ServiceOrderResponse,
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

// ─── Auth Storage Helpers (Diselaraskan) ───────────────────────────────────────

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

// ─── Fallback Mock Data ─────────────────────────────────────────────────────────

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

let localOrdersStore: ServiceOrderResponse[] = [...MOCK_ORDERS];

// ─── Service Order API ─────────────────────────────────────────────────────────

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
      const json: WebResponse<ServiceOrderResponse[]> = await res.json();
      return json.data;
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
      const json: WebResponse<ServiceOrderResponse> = await res.json();
      return json.data;
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
      const json: WebResponse<ServiceOrderResponse> = await res.json();
      return json.data;
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