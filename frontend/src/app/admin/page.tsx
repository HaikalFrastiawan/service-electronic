'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Package, Clock, CheckCircle2, Search, Filter, RefreshCw, ArrowLeft, Plus, Eye, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { fetchAllOrders, updateOrderStatusApi } from '@/lib/api';
import { ServiceOrderResponse, UpdateServiceStatusRequest } from '@/lib/types';
import { StatusBadge } from '@/components/StatusBadge';
import { OrderDrawer } from '@/components/OrderDrawer';
import { formatDate, formatRupiah } from '@/lib/utils';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<ServiceOrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Selected Order for Slide-over Drawer
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrderResponse | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateOrder = async (orderId: string, data: UpdateServiceStatusRequest) => {
    const updated = await updateOrderStatusApi(orderId, data);
    setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
    setSelectedOrder(updated);
  };

  const handleRowClick = (order: ServiceOrderResponse) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  // Filtered Orders calculation
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
        o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Calculate Summary Metrics
  const activeOrdersCount = orders.filter((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;
  const inRepairCount = orders.filter((o) => o.status === 'IN_PROGRESS').length;
  const waitingPartsCount = orders.filter((o) => o.status === 'WAITING_PARTS').length;
  const completedTodayCount = orders.filter((o) => o.status === 'COMPLETED').length;

  return (
      <div className="min-h-screen bg-slate-100/70 text-slate-900 font-sans pb-16 selection:bg-blue-600 selection:text-white">
        {/* Admin Header */}
        <header className="relative z-10 border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                  href="/"
                  className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
              <div>
                <h1 className="font-extrabold text-lg tracking-tight text-slate-900 flex items-center gap-2">
                  <span>Management Dashboard Teknisi</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold border border-blue-200">
                  LIVE
                </span>
                </h1>
                <p className="text-xs text-slate-500">Monitoring & Pembaruan Status Service Perangkat</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                  onClick={loadData}
                  className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs transition-all flex items-center gap-2 text-xs font-semibold cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh Data</span>
              </button>
              <Link
                  href="/"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Tiket Baru</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Container */}
        <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
          {/* SUMMARY METRICS - 4 CARDS */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Active Orders */}
            <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Active Orders</span>
                <span className="text-3xl font-extrabold font-mono text-slate-900 mt-1 block">
                {activeOrdersCount}
              </span>
                <span className="text-[11px] text-amber-600 mt-1 block font-medium">Dalam antrean & pengerjaan</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600">
                <Clock className="w-6 h-6" />
              </div>
            </motion.div>

            {/* Card 2: In Repair */}
            <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-500 block">In Repair</span>
                <span className="text-3xl font-extrabold font-mono text-blue-600 mt-1 block">
                {inRepairCount}
              </span>
                <span className="text-[11px] text-blue-600 mt-1 block font-medium">Sedang ditangani teknisi</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600">
                <Wrench className="w-6 h-6" />
              </div>
            </motion.div>

            {/* Card 3: Waiting Parts */}
            <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Waiting Parts</span>
                <span className="text-3xl font-extrabold font-mono text-orange-600 mt-1 block">
                {waitingPartsCount}
              </span>
                <span className="text-[11px] text-orange-600 mt-1 block font-medium">Menunggu sparepart</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 text-orange-600">
                <Package className="w-6 h-6" />
              </div>
            </motion.div>

            {/* Card 4: Completed Today */}
            <motion.div
                whileHover={{ y: -2 }}
                className="rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Completed Today</span>
                <span className="text-3xl font-extrabold font-mono text-emerald-600 mt-1 block">
                {completedTodayCount}
              </span>
                <span className="text-[11px] text-emerald-600 mt-1 block font-medium">Selesai & diuji</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </motion.div>
          </section>

          {/* DATA TABLE SECTION */}
          <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
            {/* Table Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                    type="text"
                    placeholder="Cari nomor resi, brand, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 transition-all"
                />
              </div>

              {/* Filter Tabs / Select */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <Filter className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
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

            {/* Table Container */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3.5 px-4 font-mono">Nomor Resi</th>
                  <th className="py-3.5 px-4">Perangkat</th>
                  <th className="py-3.5 px-4">Pelanggan</th>
                  <th className="py-3.5 px-4">Status Perbaikan</th>
                  <th className="py-3.5 px-4">Estimasi Biaya</th>
                  <th className="py-3.5 px-4">Tanggal Masuk</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        {loading ? 'Memuat data pesanan...' : 'Tidak ada data pesanan yang sesuai dengan filter.'}
                      </td>
                    </tr>
                ) : (
                    filteredOrders.map((order) => (
                        <tr
                            key={order.id}
                            onClick={() => handleRowClick(order)}
                            className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-blue-600 group-hover:underline">
                            {order.orderNumber}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-900">
                              {order.brand} {order.modelName}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">{order.category}</div>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            {order.customerEmail || '-'}
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-900">
                            {formatRupiah(order.totalCost || order.estimatedCost)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">
                            {formatDate(order.createdAt)}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRowClick(order);
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Edit</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                    ))
                )}
                </tbody>
              </table>
            </div>
          </section>
        </main>

        {/* Slide-over Drawer for Order Updates */}
        <OrderDrawer
            order={selectedOrder}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onUpdateOrder={handleUpdateOrder}
        />
      </div>
  );
}