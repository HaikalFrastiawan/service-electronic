'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser, clearAuthData } from '@/lib/api';
import {
  Wrench,
  LogOut,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  X,
  Save,
  Laptop,
  User,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // State Pencarian & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // State Drawer Editing
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [editStatus, setEditStatus] = useState('COMPLETED');
  const [editEstCost, setEditEstCost] = useState<number | string>(0);
  const [editFinalCost, setEditFinalCost] = useState<number | string>(0);
  const [editNotes, setEditNotes] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Fungsi Fetch Orders dari Backend API dengan Error Handling Aman
  const fetchOrders = async (token: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch('http://localhost:8080/api/v1/service-orders', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Gagal mengambil data (HTTP ${response.status})`);
      }

      const result = await response.json();
      // Menangani fleksibilitas struktur response data dari backend
      if (Array.isArray(result.data)) {
        setOrders(result.data);
      } else if (Array.isArray(result)) {
        setOrders(result);
      } else {
        setOrders([]);
      }
    } catch (error: any) {
      console.error('Network/Fetch error saat fetch orders:', error);
      setErrorMessage(
          error.name === 'TypeError'
              ? 'Gagal terhubung ke server Spring Boot (port 8080). Pastikan backend sudah di-Run.'
              : error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const user = getAuthUser();
    if (!user || !user.token) {
      router.replace('/login');
    } else if (user.role !== 'ROLE_ADMIN' && user.role !== 'ADMIN') {
      router.replace('/dashboard');
    } else {
      setAdminUser(user);
      fetchOrders(user.token);
    }
  }, [router]);

  const handleOpenDetail = (order: any) => {
    setSelectedOrder(order);
    setEditStatus(order.status || 'PENDING');
    setEditEstCost(order.estimatedCost || 0);
    setEditFinalCost(order.totalCost || order.finalCost || 0);
    setEditNotes(order.completionNotes || order.technicianNotes || '');
    setSaveSuccess(null);
  };

  const handleCloseDrawer = () => {
    setSelectedOrder(null);
    setSaveSuccess(null);
  };

  // Simpan Perubahan Status Ke API Backend dengan Validasi Error Jaringan
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    setIsSaving(true);
    setSaveSuccess(null);

    const orderId = selectedOrder.id || selectedOrder.orderNumber;
    if (!orderId) {
      alert('ID Order tidak valid.');
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/v1/service-orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${adminUser.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: editStatus,
          estimatedCost: Number(editEstCost) || 0,
          totalCost: Number(editFinalCost) || 0,
          completionNotes: editNotes,
        }),
      });

      if (response.ok) {
        setSaveSuccess('Perubahan berhasil disimpan!');
        await fetchOrders(adminUser.token);
        setTimeout(() => {
          handleCloseDrawer();
        }, 1000);
      } else {
        const errData = await response.json().catch(() => ({}));
        alert(`Gagal menyimpan (${response.status}): ${errData.message || 'Akses ditolak atau parameter salah'}`);
      }
    } catch (error: any) {
      console.error('Gagal menyimpan:', error);
      alert('Gagal terhubung ke server backend! Pastikan Spring Boot aktif di http://localhost:8080');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    clearAuthData();
    router.replace('/login');
  };

  // Logika Filter Data
  const filteredOrders = orders.filter((ord) => {
    const orderNo = (ord.orderNumber || ord.id || '').toLowerCase();
    const email = (ord.customerEmail || ord.userEmail || '').toLowerCase();
    const brand = (ord.brand || '').toLowerCase();
    const model = (ord.modelName || ord.model || '').toLowerCase(); // <-- DIBETULKAN DI SINI (menggunakan const model)

    const matchSearch =
        orderNo.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        brand.includes(searchTerm.toLowerCase()) ||
        model.includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === 'ALL' || ord.status === filterStatus;

    return matchSearch && matchStatus;
  });

  if (!adminUser) return null;

  return (
      <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
        {/* Header Admin */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-600/30">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 leading-none">
                Management Dashboard Teknisi
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">Monitoring & Pembaruan Status Servis Perangkat</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
          <span className="text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            Anda login sebagai: <strong>{adminUser.email}</strong>
          </span>
            <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Keluar
            </button>
          </div>
        </header>

        {/* Main Content Dashboard */}
        <main className="p-6 max-w-7xl mx-auto space-y-6">
          {/* Banner Error jika Fetch Gagal */}
          {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-3 font-semibold">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
                <button
                    onClick={() => fetchOrders(adminUser.token)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-xs font-bold cursor-pointer"
                >
                  Coba Lagi
                </button>
              </div>
          )}

          {/* Ringkasan Statistik */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Active Orders</span>
                <p className="text-2xl font-black text-slate-900">{orders.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">In Repair</span>
                <p className="text-2xl font-black text-slate-900">
                  {orders.filter((o) => o.status === 'IN_PROGRESS').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Wrench className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Waiting Parts</span>
                <p className="text-2xl font-black text-slate-900">
                  {orders.filter((o) => o.status === 'WAITING_PARTS').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase">Completed Today</span>
                <p className="text-2xl font-black text-slate-900">
                  {orders.filter((o) => o.status === 'COMPLETED').length}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Tabel Tiket Perbaikan */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Cari nomor resi, brand, atau email..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs outline-none focus:border-blue-600 focus:bg-white transition-all"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                    onClick={() => fetchOrders(adminUser.token)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-all flex items-center gap-1 text-xs font-semibold cursor-pointer"
                    title="Muat Ulang Data"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
                <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-600 outline-none focus:border-blue-600 cursor-pointer"
                >
                  <option value="ALL">Semua Status</option>
                  <option value="PENDING">PENDING</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="WAITING_PARTS">WAITING_PARTS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Nomor Resi</th>
                  <th className="p-4">Perangkat</th>
                  <th className="p-4">Pelanggan</th>
                  <th className="p-4">Status Perbaikan</th>
                  <th className="p-4">Biaya Final</th>
                  <th className="p-4">Tanggal Masuk</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                {isLoading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
                        Memuat data servis dari server...
                      </td>
                    </tr>
                ) : filteredOrders.length > 0 ? (
                    filteredOrders.map((ord) => (
                        <tr key={ord.id || ord.orderNumber} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-4 font-mono font-bold text-blue-600">{ord.orderNumber || ord.id}</td>
                          <td className="p-4">
                            <div className="font-bold text-slate-900">
                              {ord.brand} {ord.modelName || ord.model}
                            </div>
                            <div className="text-[10px] text-slate-400">{ord.category}</div>
                          </td>
                          <td className="p-4 text-slate-700">{ord.customerEmail || ord.userEmail || '-'}</td>
                          <td className="p-4">
                        <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${
                                ord.status === 'COMPLETED'
                                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                    : ord.status === 'IN_PROGRESS'
                                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                                        : ord.status === 'WAITING_PARTS'
                                            ? 'bg-orange-100 text-orange-700 border border-orange-200'
                                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                            }`}
                        >
                          {ord.status}
                        </span>
                          </td>
                          <td className="p-4 font-mono font-bold text-slate-900">
                            Rp {Number(ord.totalCost || ord.finalCost || 0).toLocaleString('id-ID')}
                          </td>
                          <td className="p-4 text-slate-500">
                            {ord.createdAt ? new Date(ord.createdAt).toLocaleString('id-ID') : ord.dateIn || '-'}
                          </td>
                          <td className="p-4 text-right">
                            <button
                                onClick={() => handleOpenDetail(ord)}
                                className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 font-bold hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                            >
                              Detail & Edit
                            </button>
                          </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Tidak ada data servis yang sesuai.
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          </div>
        </main>

        {/* Drawer Edit */}
        {selectedOrder && (
            <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-xs flex justify-end">
              <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Nomor Resi</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-700">
                    {editStatus}
                  </span>
                    </div>
                    <h2 className="text-xl font-mono font-black text-blue-600 mt-0.5">
                      {selectedOrder.orderNumber || selectedOrder.id}
                    </h2>
                  </div>
                  <button
                      onClick={handleCloseDrawer}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="p-6 space-y-6 flex-1">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Laptop className="w-4 h-4 text-blue-600" />
                      <span>Detail Perangkat</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 text-[10px]">Kategori</span>
                        <p className="font-bold text-slate-800">{selectedOrder.category}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">Merek / Brand</span>
                        <p className="font-bold text-slate-800">{selectedOrder.brand}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">Model / Tipe</span>
                        <p className="font-bold text-slate-800">{selectedOrder.modelName || selectedOrder.model}</p>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px]">Serial Number</span>
                        <p className="font-mono font-bold text-slate-800">{selectedOrder.serialNumber || '-'}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-slate-400 text-[10px] block">Deskripsi Keluhan</span>
                      <p className="text-xs font-medium text-slate-700 mt-0.5">
                        {selectedOrder.issueDescription || selectedOrder.problem}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Informasi Pelanggan</span>
                    </h3>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Email:</span>
                      <span className="font-mono font-bold text-slate-800">
                    {selectedOrder.customerEmail || selectedOrder.userEmail || '-'}
                  </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tanggal Masuk:</span>
                      <span className="font-bold text-slate-800">
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString('id-ID') : selectedOrder.dateIn}
                  </span>
                    </div>
                  </div>

                  <form id="edit-form" onSubmit={handleSave} className="space-y-4 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                      <Wrench className="w-4 h-4" />
                      <span>Perbarui Status & Biaya Perbaikan</span>
                    </h3>

                    {saveSuccess && (
                        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2 font-bold animate-in fade-in">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{saveSuccess}</span>
                        </div>
                    )}

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Status Perbaikan Baru
                      </label>
                      <select
                          value={editStatus}
                          onChange={(e) => setEditStatus(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                      >
                        <option value="PENDING">PENDING (Menunggu Konfirmasi)</option>
                        <option value="IN_PROGRESS">IN_PROGRESS (Sedang Dikerjakan)</option>
                        <option value="WAITING_PARTS">WAITING_PARTS (Menunggu Sparepart)</option>
                        <option value="COMPLETED">COMPLETED (Selesai & Siap Diambil)</option>
                        <option value="CANCELLED">CANCELLED (Dibatalkan)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Estimasi Biaya
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs text-slate-400 font-bold">Rp</span>
                          <input
                              type="number"
                              value={editEstCost}
                              onChange={(e) => setEditEstCost(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Biaya Final / Total
                        </label>
                        <div className="relative flex items-center">
                          <span className="absolute left-3 text-xs text-slate-400 font-bold">Rp</span>
                          <input
                              type="number"
                              value={editFinalCost}
                              onChange={(e) => setEditFinalCost(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Catatan Perbaikan / Teknisi
                      </label>
                      <textarea
                          rows={3}
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Tuliskan catatan kemajuan perbaikan..."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white"
                      />
                    </div>
                  </form>
                </div>

                <div className="p-4 border-t border-slate-200 bg-white sticky bottom-0 flex items-center justify-end gap-3 z-10">
                  <button
                      type="button"
                      onClick={handleCloseDrawer}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                      type="submit"
                      form="edit-form"
                      disabled={isSaving}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Menyimpan...</span>
                        </>
                    ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Simpan Perubahan</span>
                        </>
                    )}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}