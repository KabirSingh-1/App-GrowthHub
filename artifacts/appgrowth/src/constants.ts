export const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "BR", name: "Brazil" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "MX", name: "Mexico" },
  { code: "RU", name: "Russia" },
  { code: "NL", name: "Netherlands" },
  { code: "SE", name: "Sweden" },
  { code: "PL", name: "Poland" },
  { code: "TR", name: "Turkey" },
  { code: "SG", name: "Singapore" },
  { code: "AE", name: "UAE" },
];

export const RATING_PRICE = 0.89;
export const ASO_INSTALL_PRICE = 0.12;
export const AI_VIDEO_PRICE = 10;
export const NON_AI_VIDEO_PRICE = 30;

export const RATING_QUANTITIES = [10, 25, 50, 100, 250, 500];
export const ASO_INSTALL_QUANTITIES = [50, 100, 250, 500, 1000];

export const SERVICE_LABELS: Record<string, string> = {
  ratings: "Ratings",
  aso_installs: "ASO Installs",
  ai_ugc_video: "AI UGC Video",
  non_ai_ugc_video: "Non-AI UGC Video",
  push_notifications: "Push Notifications",
  meta_ads: "Meta Ads",
  apple_search_ads: "Apple Search Ads",
};

export const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-gray-100 text-gray-600",
};
