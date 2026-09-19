export type ServiceStatus = 'PENDING' | 'IN_PROGRESS' | 'WAITING_PARTS' | 'COMPLETED' | 'CANCELLED';

export type UserRole = 'ROLE_ADMIN' | 'ROLE_TECHNICIAN' | 'ROLE_CUSTOMER';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: UserRole;
}

export type DeviceCategory = 'LAPTOP' | 'SMARTPHONE' | 'TELEVISION' | 'REFRIGERATOR' | 'WASHING_MACHINE' | 'OTHER';

export interface ServiceOrderResponse {
  id: string;
  orderNumber: string;
  status: ServiceStatus;
  estimatedCost?: number;
  totalCost?: number;
  completionNotes?: string;
  createdAt: string;
  updatedAt: string;
  deviceId?: string;
  category: DeviceCategory;
  brand: string;
  modelName: string;
  serialNumber?: string;
  issueDescription: string;
  customerEmail: string;
  technicianEmail?: string;
}

export interface CreateServiceOrderRequest {
  category: DeviceCategory;
  brand: string;
  modelName: string;
  serialNumber?: string;
  issueDescription: string;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
}

export interface UpdateServiceStatusRequest {
  status?: ServiceStatus;
  estimatedCost?: number;
  totalCost?: number;
  completionNotes?: string;
  technicianId?: string;
}

export interface WebResponse<T> {
  success?: boolean;
  message?: string;
  data: T;
  errors?: unknown;
}