import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "wouter";
import { Search, ChevronDown, Star, ExternalLink, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/constants";
import { Badge } from "@/components/ui/badge";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AppResult {
  name: string;
  store: "App Store" | "Play Store";
  developer: string;
  rating: number | null;
  icon: string | null;
  appId: string;
  url: string;
}

interface SearchState {
  results: AppResult[];
  loading: boolean;
  error: string | null;
  keyword: string;
  done: boolean;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

import appStoreIconSvg from "@/assets/app-store.svg";

const AppStoreIcon = ({ size = 20 }: { size?: number }) => (
  <img src={appStoreIconSvg} width={size} height={size} alt="App Store" />
);

const GooglePlayIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 3.27L13.19 12L4.5 20.73C4.19 20.55 4 20.22 4 19.84V4.16C4 3.78 4.19 3.45 4.5 3.27Z" fill="#32BBFF" />
    <path d="M16.96 9.22L14.3 10.75L13.19 12L14.3 13.25L16.96 14.78L19.22 13.43C19.72 13.14 20 12.58 20 12C20 11.42 19.72 10.86 19.22 10.57L16.96 9.22Z" fill="#FFD900" />
    <path d="M5.41 3.18L14.3 10.75L16.96 9.22L7.13 3.73C6.53 3.39 5.84 3.44 5.41 3.18Z" fill="#FF3333" />
    <path d="M5.41 20.82L14.3 13.25L16.96 14.78L7.13 20.27C6.53 20.61 5.84 20.56 5.41 20.82Z" fill="#00F076" />
    <path d="M4.5 3.27C4.76 3.1 5.09 3.06 5.41 3.18L14.3 10.75L4.5 3.27Z" fill="#32BBFF" />
    <path d="M4.5 20.73C4.76 20.9 5.09 20.94 5.41 20.82L14.3 13.25L4.5 20.73Z" fill="#32BBFF" />
  </svg>
);

const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸", GB: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷", ES: "🇪🇸",
  IT: "🇮🇹", BR: "🇧🇷", IN: "🇮🇳", JP: "🇯🇵", KR: "🇰🇷",
  AU: "🇦🇺", CA: "🇨🇦", MX: "🇲🇽", RU: "🇷🇺", NL: "🇳🇱",
  SE: "🇸🇪", PL: "🇵🇱", TR: "🇹🇷", SG: "🇸🇬", AE: "🇦🇪",
};

const PLATFORMS = [
  { value: "ios", label: "App Store", Icon: AppStoreIcon },
  { value: "android", label: "Google Play", Icon: GooglePlayIcon },
  { value: "both", label: "Both Stores", Icon: Search as any },
];

// ─── Fetch helpers ─────────────────────────────────────────────────────────────

async function fetchDiscoverSearch(
  keyword: string,
  country: string,
  platform: string
): Promise<AppResult[]> {
  const url = `/api/discover/search?q=${encodeURIComponent(keyword)}&country=${country.toLowerCase()}&platform=${platform}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Discover search failed");
  const data = await res.json();
  if (!data.success) return [];
  return (data.results ?? []) as AppResult[];
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-xs text-gray-400">No rating</span>;
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.25 && rating - full < 0.75;
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${i < full ? "fill-amber-400 text-amber-400" : i === full && hasHalf ? "fill-amber-200 text-amber-400" : "text-gray-300"}`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-gray-600">{rating.toFixed(1)}</span>
    </div>
  );
}

// ─── App Card ─────────────────────────────────────────────────────────────────

import { addApp } from "@/lib/app-store";

function AppCard({ app }: { app: AppResult }) {
  const isAppStore = app.store === "App Store";
  const [, setLocation] = useLocation();

  const handleSelectApp = () => {
    addApp({
      id: app.appId,
      name: app.name,
      developer: app.developer,
      platform: isAppStore ? "iOS" : "Android",
      iconUrl: app.icon,
      rating: app.rating,
      bundleId: app.appId,
      storeUrl: app.url,
      addedAt: new Date().toISOString()
    });
    setLocation(`/apps`);
  };

  return (
    <div 
      onClick={handleSelectApp}
      className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
    >
      {/* Icon */}
      <div className="flex-shrink-0 w-16 h-16 rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
        {app.icon
          ? <img src={app.icon} alt={app.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
          : <span className="text-2xl">{isAppStore ? "🍎" : "▶"}</span>
        }
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight truncate group-hover:text-primary transition-colors">{app.name}</h3>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{app.developer}</p>
          </div>
          <a
            href={app.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-shrink-0 text-gray-400 hover:text-primary transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
        <div className="flex items-center gap-2 mt-2">
          <StarRating rating={app.rating} />
          <Badge
            variant="secondary"
            className={`text-xs px-2 py-0.5 flex items-center gap-1 ${isAppStore ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"}`}
          >
            {isAppStore ? <AppStoreIcon size={10} /> : <GooglePlayIcon size={10} />}
            {app.store}
          </Badge>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SearchResults() {
  const [location] = useLocation();

  // Parse query params from URL hash (wouter uses hash routing support)
  const params = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : ""
  );
  const initialQ = params.get("q") ?? "";
  const initialPlatform = (params.get("platform") ?? "both") as "ios" | "android" | "both";
  const initialCountry = params.get("country") ?? "IN";

  const [query, setQuery] = useState(initialQ);
  const [inputValue, setInputValue] = useState(initialQ);
  const [platform, setPlatform] = useState(initialPlatform);
  const [country, setCountry] = useState(initialCountry);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  const [state, setState] = useState<SearchState>({
    results: [],
    loading: false,
    error: null,
    keyword: initialQ,
    done: false,
  });

  const runSearch = useCallback(async (q: string, plat: string, ctr: string) => {
    if (!q.trim()) return;
    setState({ results: [], loading: true, error: null, keyword: q, done: false });

    try {
      const allResults = await fetchDiscoverSearch(q, ctr, plat);
      setState({ results: allResults, loading: false, error: null, keyword: q, done: true });
    } catch {
      setState({ results: [], loading: false, error: "Search failed. Please try again.", keyword: q, done: true });
    }
  }, []);

  // Trigger search on mount if query exists
  useEffect(() => {
    if (initialQ) runSearch(initialQ, initialPlatform, initialCountry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    const q = inputValue.trim();
    if (!q) return;
    setQuery(q);
    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set("q", q);
    url.searchParams.set("platform", platform);
    url.searchParams.set("country", country);
    window.history.pushState({}, "", url.toString());
    runSearch(q, platform, country);
  };

  const currentCountry = COUNTRIES.find(c => c.code === country) ?? COUNTRIES[7];
  const currentPlatform = PLATFORMS.find(p => p.value === platform) ?? PLATFORMS[2];
  const PlatformIcon = currentPlatform.Icon;

  const appStoreResults = state.results.filter(r => r.store === "App Store");
  const playStoreResults = state.results.filter(r => r.store === "Play Store");

  return (
    <div className="min-h-screen bg-gray-50" onClick={() => { setPlatformOpen(false); setCountryOpen(false); }}>
      {/* Sticky Search Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <Link href="/">
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-xs">AV</div>
              <span className="font-black text-lg tracking-tight text-foreground hidden sm:block">AppVersal</span>
            </div>
          </Link>

          {/* Inline Search Bar */}
          <div
            className="flex items-center flex-1 bg-gray-50 rounded-full border border-gray-200 overflow-visible"
            style={{ height: "44px" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Platform */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setPlatformOpen(o => !o); setCountryOpen(false); }}
                className="flex items-center gap-1 pl-4 pr-2 h-full text-xs font-medium text-gray-600 hover:text-gray-900 whitespace-nowrap"
                style={{ height: "44px" }}
              >
                <PlatformIcon size={16} />
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {platformOpen && (
                <div className="absolute top-full left-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  {PLATFORMS.map((p) => {
                    const PIcon = p.Icon;
                    return (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => { setPlatform(p.value as any); setPlatformOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${platform === p.value ? "text-primary font-semibold" : "text-gray-700"}`}
                      >
                        <PIcon size={18} />
                        {p.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="w-px bg-gray-200 flex-shrink-0" style={{ height: "22px" }} />

            {/* Country */}
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setCountryOpen(o => !o); setPlatformOpen(false); }}
                className="flex items-center gap-1 px-2 h-full text-xs font-medium text-gray-600 hover:text-gray-900"
                style={{ height: "44px" }}
              >
                <span>{COUNTRY_FLAGS[currentCountry.code] ?? "🌐"}</span>
                <ChevronDown className="w-3 h-3 text-gray-400" />
              </button>
              {countryOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                  <div className="max-h-64 overflow-y-auto">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => { setCountry(c.code); setCountryOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${country === c.code ? "text-primary font-semibold" : "text-gray-700"}`}
                      >
                        <span>{COUNTRY_FLAGS[c.code] ?? "🌐"}</span>
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="w-px bg-gray-200 flex-shrink-0" style={{ height: "22px" }} />

            {/* Text Input */}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Enter an app or a keyword…"
              className="flex-1 px-3 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent outline-none min-w-0"
            />

            {/* Search Button */}
            <button
              type="button"
              onClick={handleSearch}
              className="flex-shrink-0 w-9 h-9 mr-1 rounded-full flex items-center justify-center bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Loading */}
        {state.loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-gray-500 text-sm">Searching App Store &amp; Play Store for <strong>"{state.keyword}"</strong>…</p>
          </div>
        )}

        {/* Empty state */}
        {!state.loading && state.done && state.results.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <AlertCircle className="w-10 h-10 text-gray-300" />
            <p className="text-gray-600 font-medium">No apps found for "{state.keyword}"</p>
            <p className="text-gray-400 text-sm">Try a different keyword or change the store/country filter.</p>
          </div>
        )}

        {/* Initial empty state */}
        {!state.loading && !state.done && (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <Search className="w-10 h-10 text-gray-200" />
            <p className="text-gray-400 text-sm">Search for any app or keyword above to see results</p>
          </div>
        )}

        {/* Results */}
        {!state.loading && state.results.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Results for <span className="text-primary">"{state.keyword}"</span>
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">{state.results.length} apps found across {appStoreResults.length > 0 && playStoreResults.length > 0 ? "both stores" : appStoreResults.length > 0 ? "App Store" : "Play Store"}</p>
              </div>
            </div>

            {/* Two-column layout: App Store | Play Store */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* App Store Column */}
              {appStoreResults.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AppStoreIcon size={22} />
                    <h2 className="font-bold text-gray-800">App Store</h2>
                    <span className="text-xs text-gray-400 ml-1">{appStoreResults.length} results</span>
                  </div>
                  <div className="space-y-3">
                    {appStoreResults.map((app) => (
                      <AppCard key={`ios-${app.appId}`} app={app} />
                    ))}
                  </div>
                </div>
              )}

              {/* Play Store Column */}
              {playStoreResults.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <GooglePlayIcon size={22} />
                    <h2 className="font-bold text-gray-800">Google Play</h2>
                    <span className="text-xs text-gray-400 ml-1">{playStoreResults.length} results</span>
                  </div>
                  <div className="space-y-3">
                    {playStoreResults.map((app) => (
                      <AppCard key={`android-${app.appId}`} app={app} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
