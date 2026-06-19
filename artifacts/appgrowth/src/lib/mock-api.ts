// Mock API Data and Hooks

export interface MockApp {
  id: number;
  name: string;
  platform: string;
  bundleId: string;
  iconUrl: string;
  totalDownloads: number;
  rating: number;
  category?: string;
  reviewCount?: number;
  monthlyActiveUsers?: number;
}

export const MOCK_APPS: MockApp[] = [
  { id: 1, name: "Fitness Tracker Pro", platform: "iOS", bundleId: "com.fitnesstracker.pro", iconUrl: "https://placehold.co/100x100/2563eb/ffffff?text=FT", totalDownloads: 12500, rating: 4.8, category: "Health & Fitness", reviewCount: 1240, monthlyActiveUsers: 5400 },
  { id: 2, name: "Zen Meditation", platform: "Android", bundleId: "com.zen.meditation", iconUrl: "https://placehold.co/100x100/16a34a/ffffff?text=ZM", totalDownloads: 8900, rating: 4.2, category: "Health & Fitness", reviewCount: 890, monthlyActiveUsers: 3200 },
  { id: 3, name: "Crypto Portfolio", platform: "iOS", bundleId: "com.crypto.portfolio", iconUrl: "https://placehold.co/100x100/f59e0b/ffffff?text=CP", totalDownloads: 3400, rating: 3.9, category: "Finance", reviewCount: 340, monthlyActiveUsers: 1200 },
];

export interface MockReview {
  id: number;
  appId: number;
  author: string;
  rating: number;
  text: string;
  body: string;
  date: string;
  reply: string | null;
}

export const MOCK_REVIEWS: MockReview[] = [
  { id: 1, appId: 1, author: "John D.", rating: 5, text: "Amazing app, changed my life!", body: "Amazing app, changed my life!", date: new Date().toISOString(), reply: null },
  { id: 2, appId: 1, author: "Sarah M.", rating: 4, text: "Great UI but needs more features.", body: "Great UI but needs more features.", date: new Date().toISOString(), reply: "Thanks for the feedback! We are working on new features." },
  { id: 3, appId: 2, author: "Mike R.", rating: 1, text: "Crashes on startup.", body: "Crashes on startup.", date: new Date().toISOString(), reply: null },
];

export interface MockAsoKeyword {
  id: number;
  appId: number;
  keyword: string;
  searchVolume: number;
  volume: number;
  difficulty: number;
  currentRank: number;
  rank: number;
  traffic: number;
}

export const MOCK_ASO_KEYWORDS: MockAsoKeyword[] = [
  { id: 1, appId: 1, keyword: "fitness", searchVolume: 8500, volume: 8500, difficulty: 75, currentRank: 12, rank: 12, traffic: 15 },
  { id: 2, appId: 1, keyword: "workout tracker", searchVolume: 4200, volume: 4200, difficulty: 60, currentRank: 5, rank: 5, traffic: 22 },
  { id: 3, appId: 2, keyword: "meditation", searchVolume: 9500, volume: 9500, difficulty: 88, currentRank: 24, rank: 24, traffic: 8 },
];

export interface MockOrder {
  id: number;
  appId: number;
  serviceType: string;
  status: string;
  amount: number;
  createdAt: string;
  country?: string;
  quantity?: number;
  keywords?: string;
  notes?: string;
}

export const MOCK_ORDERS: MockOrder[] = [
  { id: 1, appId: 1, serviceType: "aso_installs", status: "completed", amount: 150.00, createdAt: new Date().toISOString(), country: "US", quantity: 100, keywords: "fitness, tracker", notes: "Please run on iOS only" },
  { id: 2, appId: 2, serviceType: "ratings", status: "pending", amount: 45.00, createdAt: new Date().toISOString(), country: "US", quantity: 50, keywords: "", notes: "" },
];

export const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Campaign Completed", body: "Your ASO campaign for Fitness Tracker Pro has finished.", status: 'sent', deliveredCount: 4500, openRate: 0.24, createdAt: new Date().toISOString() },
  { id: 2, title: "New Negative Review", body: "Zen Meditation received a 1-star review. Reply now.", status: 'scheduled', scheduledAt: new Date(Date.now() + 86400000).toISOString(), createdAt: new Date().toISOString() },
];

export interface MockCampaign {
  id: number;
  appId: number;
  name: string;
  status: string;
  budget: string;
  spent: string;
  spend: number;
  impressions: number;
  installs: number;
  type: string;
  cpi: number;
  ctr: number;
}

export const MOCK_CAMPAIGNS: MockCampaign[] = [
  { id: 1, appId: 1, name: "Summer Launch ASO", status: "active", budget: "500.00", spent: "250.00", spend: 250, impressions: 15000, installs: 1200, type: "aso_installs", cpi: 0.21, ctr: 0.08 },
  { id: 2, appId: 2, name: "Mindfulness Ads", status: "paused", budget: "1000.00", spent: "1000.00", spend: 1000, impressions: 50000, installs: 3400, type: "meta_ads", cpi: 0.29, ctr: 0.068 },
];


export const MOCK_STATS = {
  totalDownloads: 45200,
  avgRating: 4.6,
  totalReviews: 3205,
  activeCampaigns: 2,
  totalSpend: 1540.50
};

export const MOCK_RECOMMENDATIONS = [
  { id: 1, title: "Improve ASO Keywords", description: "Your app 'Zen Meditation' is missing out on high-volume keywords like 'sleep sounds'.", priority: "high", ctaLabel: "View ASO Tools" },
  { id: 2, title: "Boost Ratings", description: "Recent updates have dropped your average rating to 4.1. Consider a review campaign.", priority: "medium", ctaLabel: "Order Ratings" },
];

// Mock Hooks that match api-client-react signatures
export const useListApps = () => ({ data: MOCK_APPS, isLoading: false });
export const useGetApp = (id: number, options?: any) => ({ data: MOCK_APPS.find(a => a.id === Number(id)), isLoading: false });
export const useListReviews = (appId: number, options?: any) => ({ data: appId ? MOCK_REVIEWS.filter(r => r.appId === Number(appId)) : MOCK_REVIEWS, isLoading: false });
export const useReplyToReview = () => ({ mutateAsync: async () => {}, mutate: () => {} });

export const useListAsoKeywords = (params?: { appId?: number }, options?: any) => {
  const appId = params?.appId;
  return {
    data: appId ? MOCK_ASO_KEYWORDS.filter(k => k.appId === Number(appId)) : MOCK_ASO_KEYWORDS,
    isLoading: false,
  };
};

export const useListOrders = () => ({ data: MOCK_ORDERS, isLoading: false });
export const getListOrdersQueryKey = () => ['orders'];

export const useCreateOrder = (options?: { mutation?: { onSuccess?: (order: { id: number }) => void } }) => {
  return {
    mutate: (params?: any) => {
      if (options?.mutation?.onSuccess) {
        options.mutation.onSuccess({ id: Math.floor(Math.random() * 100000) });
      }
    },
    mutateAsync: async (params?: any) => {
      if (options?.mutation?.onSuccess) {
        options.mutation.onSuccess({ id: Math.floor(Math.random() * 100000) });
      }
    },
    isPending: false,
  };
};

export const useDeleteOrder = (options?: { mutation?: { onSuccess?: () => void } }) => {
  return {
    mutate: (params?: any) => {
      if (options?.mutation?.onSuccess) {
        options.mutation.onSuccess();
      }
    },
    mutateAsync: async (params?: any) => {
      if (options?.mutation?.onSuccess) {
        options.mutation.onSuccess();
      }
    },
    isPending: false,
  };
};

export const useListNotifications = () => ({ data: MOCK_NOTIFICATIONS, isLoading: false });
export const useListCampaigns = () => ({ data: MOCK_CAMPAIGNS, isLoading: false });
export const useGetDashboardStats = () => ({ data: MOCK_STATS, isLoading: false });
export const useGetRecommendations = () => ({ data: MOCK_RECOMMENDATIONS, isLoading: false });
