"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    FileBarChart2,
    Users,
    Home,
    LogOut,
    Wrench,
} from "lucide-react";
import { clearAuthData } from "@/lib/api";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        clearAuthData();
        router.push("/login");
    };

    const navItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Kelola Sparepart",
            href: "/dashboard/spareparts",
            icon: Package,
        },
        {
            name: "Laporan & Transaksi",
            href: "/dashboard/reports",
            icon: FileBarChart2,
        },
        {
            name: "Manajemen User",
            href: "/dashboard/users",
            icon: Users,
        },
    ];

    return (
        <aside className="w-64 bg-[#0F172A] text-slate-300 min-h-screen flex flex-col justify-between p-4 sticky top-0 h-screen">
            <div>
                {/* Logo / Brand Header */}
                <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-slate-800">
                    <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                        EF
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-base leading-tight">ElectroFix</h2>
                        <p className="text-xs text-slate-400 font-medium">Admin Panel</p>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="space-y-1.5">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/30"
                                        : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer Navigation */}
            <div className="space-y-1 pt-4 border-t border-slate-800">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-xl transition-colors"
                >
                    <Home className="w-4 h-4" />
                    <span>Ke Landing Page</span>
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors text-left"
                >
                    <LogOut className="w-4 h-4" />
                    <span>Keluar Akun</span>
                </button>
            </div>
        </aside>
    );
}