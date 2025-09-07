export interface AdminAnalytics {
  totalUsers: number;
  activeSubscriptions: number;
  totalAnalyses: number;
  revenue: number;
}

export async function getAdminAnalytics(): Promise<AdminAnalytics> {
  // Placeholder analytics data
  return {
    totalUsers: 150,
    activeSubscriptions: 120,
    totalAnalyses: 450,
    revenue: 540000,
  };
}

export async function getSystemStats() {
  return {
    cpu: 45,
    memory: 67,
    disk: 23,
    uptime: '99.9%',
  };
}
