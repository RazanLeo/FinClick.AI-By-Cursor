

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  FileText,
  Settings,
  Shield,
  Database,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Mail,
  Lock
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import UserManagement from '@/components/admin/UserManagement';
import SubscriptionManagement from '@/components/admin/SubscriptionManagement';
import SystemAnalytics from '@/components/admin/SystemAnalytics';
import SecuritySettings from '@/components/admin/SecuritySettings';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { getSystemStats } from '@/lib/admin/analytics';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAdminAuth();
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [activeTab, setActiveTab] = useState('overview');
  const [systemStats, setSystemStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    totalAnalyses: 0,
    systemHealth: 100,
    storageUsed: 0,
    dailyActiveUsers: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    if (isAdmin) {
      loadSystemStats();
    }
  }, [isAdmin]);

  const loadSystemStats = async () => {
    try {
      const stats = await getSystemStats();
      setSystemStats(stats);
    } catch (error) {
      console.error('Error loading system stats:', error);
      toast.error('فشل تحميل إحصائيات النظام');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gold mb-2">غير مصرح</h1>
          <p className="text-gold/70">ليس لديك صلاحية الوصول لهذه الصفحة</p>
        </div>
      </div>
    );
  }

  const content = {
    ar: {
      title: 'لوحة تحكم المدير',
      overview: 'نظرة عامة',
      users: 'المستخدمين',
      subscriptions: 'الاشتراكات',
      analytics: 'التحليلات',
      security: 'الأمان',
      settings: 'الإعدادات',
      totalUsers: 'إجمالي المستخدمين',
      activeSubscriptions: 'الاشتراكات النشطة',
      monthlyRevenue: 'الإيرادات الشهرية',
      totalAnalyses: 'إجمالي التحليلات',
      systemHealth: 'صحة النظام',
      storageUsed: 'المساحة المستخدمة',
      dailyActiveUsers: 'المستخدمون النشطون يومياً',
      pendingPayments: 'المدفوعات المعلقة'
    },
    en: {
      title: 'Admin Dashboard',
      overview: 'Overview',
      users: 'Users',
      subscriptions: 'Subscriptions',
      analytics: 'Analytics',
      security: 'Security',
      settings: 'Settings',
      totalUsers: 'Total Users',
      activeSubscriptions: 'Active Subscriptions',
      monthlyRevenue: 'Monthly Revenue',
      totalAnalyses: 'Total Analyses',
      systemHealth: 'System Health',
      storageUsed: 'Storage Used',
      dailyActiveUsers: 'Daily Active Users',
      pendingPayments: 'Pending Payments'
    }
  };

  const t = content[language];

  const tabs = [
    { id: 'overview', label: t.overview, icon: Activity },
    { id: 'users', label: t.users, icon: Users },
    { id: 'subscriptions', label: t.subscriptions, icon: DollarSign },
    { id: 'analytics', label: t.analytics, icon: TrendingUp },
    { id: 'security', label: t.security, icon: Shield },
    { id: 'settings', label: t.settings, icon: Settings }
  ];

  const statCards = [
    {
      title: t.totalUsers,
      value: systemStats.totalUsers.toLocaleString(),
      icon: Users,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: t.activeSubscriptions,
      value: systemStats.activeSubscriptions.toLocaleString(),
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: t.monthlyRevenue,
      value: `${systemStats.monthlyRevenue.toLocaleString()} SAR`,
      icon: DollarSign,
      color: 'text-gold',
      bgColor: 'bg-gold/10'
    },
    {
      title: t.totalAnalyses,
      value: systemStats.totalAnalyses.toLocaleString(),
      icon: FileText,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: t.systemHealth,
      value: `${systemStats.systemHealth}%`,
      icon: Activity,
      color: systemStats.systemHealth > 90 ? 'text-green-500' : 'text-yellow-500',
      bgColor: systemStats.systemHealth > 90 ? 'bg-green-500/10' : 'bg-yellow-500/10'
    },
    {
      title: t.storageUsed,
      value: `${systemStats.storageUsed} GB`,
      icon: Database,
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    },
    {
      title: t.dailyActiveUsers,
      value: systemStats.dailyActiveUsers.toLocaleString(),
      icon: Activity,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500/10'
    },
    {
      title: t.pendingPayments,
      value: systemStats.pendingPayments.toLocaleString(),
      icon: AlertCircle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <AdminLayout language={language} setLanguage={setLanguage}>
      <div className="min-h-screen bg-black p-6">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gold font-playfair mb-2">
            {t.title}
          </h1>
          <p className="text-gold/70">
            مرحباً رزان - نظام FinClick.AI
          </p>
        </motion.div>

        {/* التبويبات */}
        <div className="flex space-x-1 mb-8 bg-black/50 backdrop-blur-lg rounded-lg p-1 border border-gold/20">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gold text-black'
                    : 'text-gold/70 hover:text-gold hover:bg-gold/10'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-semibold">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* المحتوى حسب التبويب */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {statCards.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`${stat.bgColor} backdrop-blur-lg rounded-2xl p-6 border border-gold/20`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                    <RefreshCw 
                      className="w-5 h-5 text-gold/50 cursor-pointer hover:text-gold transition-colors"
                      onClick={loadSystemStats}
                    />
                  </div>
                  <h3 className="text-gold/70 text-sm mb-1">{stat.title}</h3>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'users' && <UserManagement language={language} />}
        {activeTab === 'subscriptions' && <SubscriptionManagement language={language} />}
        {activeTab === 'analytics' && <SystemAnalytics language={language} />}
        {activeTab === 'security' && <SecuritySettings language={language} />}
        {activeTab === 'settings' && (
          <div className="bg-black/50 backdrop-blur-lg rounded-2xl p-6 border border-gold/20">
            <h2 className="text-2xl font-bold text-gold mb-4">إعدادات النظام</h2>
            {/* إعدادات النظام */}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
