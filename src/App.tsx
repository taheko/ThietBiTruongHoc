import { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Sidebar, type PageKey } from '@/components/Sidebar';
import { DataProvider, useData } from '@/hooks/useData';

import { Dashboard } from '@/pages/Dashboard';
import { AssetsPage } from '@/pages/AssetsPage';
import { CategoriesPage } from '@/pages/CategoriesPage';
import { LocationsPage } from '@/pages/LocationsPage';
import { TransfersPage } from '@/pages/TransfersPage';
import { RepairsPage } from '@/pages/RepairsPage';
import { DisposalsPage } from '@/pages/DisposalsPage';
import { InventoryPage } from '@/pages/InventoryPage';
import { AIReportsPage } from '@/pages/AIReportsPage';
import LoginPage from '@/pages/LoginPage';

import {
  AlertCircle,
  RefreshCw,
  Loader2,
  LogOut,
  ChevronRight,
  Shield,
  Calendar,
} from 'lucide-react';

const PAGE_TITLES: Record<PageKey, string> = {
  dashboard: 'Tổng quan',
  assets: 'Quản lý tài sản',
  categories: 'Nhóm tài sản',
  locations: 'Vị trí phòng ban',
  transfers: 'Điều chuyển tài sản',
  repairs: 'Quản lý sửa chữa',
  disposals: 'Thanh lý tài sản',
  inventory: 'Kiểm kê định kỳ',
  'ai-reports': 'AI Báo cáo thông minh',
};

function PageContent({ page }: { page: PageKey }) {
  switch (page) {
    case 'dashboard':
      return <Dashboard />;
    case 'assets':
      return <AssetsPage />;
    case 'categories':
      return <CategoriesPage />;
    case 'locations':
      return <LocationsPage />;
    case 'transfers':
      return <TransfersPage />;
    case 'repairs':
      return <RepairsPage />;
    case 'disposals':
      return <DisposalsPage />;
    case 'inventory':
      return <InventoryPage />;
    case 'ai-reports':
      return <AIReportsPage />;
    default:
      return <Dashboard />;
  }
}

function ErrorBanner() {
  const { error, reload } = useData();
  if (!error) return null;

  return (
    <div className="mx-4 mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 shadow-xs">
      <div className="flex items-center gap-2.5 text-xs font-semibold text-red-700">
        <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
        <span>{error}</span>
      </div>
      <button
        onClick={reload}
        className="rounded-lg p-1.5 text-red-600 hover:bg-red-100 transition"
        title="Tải lại dữ liệu"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  );
}

function AppContent() {
  const [page, setPage] = useState<PageKey>('dashboard');
  const { session, logout } = useAuth();
  const userEmail = session?.user?.email || 'admin@example.com';
  const today = new Date().toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-50/80">
      <Sidebar current={page} onNavigate={setPage} />

      <div className="lg:pl-64">
        {/* Sticky Glass Header */}
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-md shadow-2xs">
          <div className="flex items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
            {/* Breadcrumb & Title */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-slate-400">Hệ thống</span>
              <ChevronRight className="h-3 w-3 text-slate-300" />
              <h1 className="text-sm font-bold text-slate-900 tracking-tight">
                {PAGE_TITLES[page]}
              </h1>
            </div>

            {/* Right Meta Info & Quick Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-500 font-medium bg-slate-100/70 px-3 py-1.5 rounded-lg border border-slate-200/50">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span className="capitalize">{today}</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 border-l border-slate-200 pl-4">
                <span className="font-semibold text-slate-800">{userEmail}</span>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60">
                  <Shield className="h-2.5 w-2.5" />
                  Quản trị viên
                </span>
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition shadow-2xs active:scale-95"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Đăng xuất</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Workspace Area */}
        <main className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <ErrorBanner />
          <PageContent page={page} />
        </main>
      </div>
    </div>
  );
}

function AuthenticatedApp() {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
}

function AuthGate() {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3 text-slate-600 card p-8 shadow-soft">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
          <span className="text-sm font-semibold text-slate-700">Đang khởi tạo phiên làm việc...</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return <LoginPage onLoginSuccess={() => {}} />;
  }

  return <AuthenticatedApp />;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthGate />
    </AuthProvider>
  );
}
