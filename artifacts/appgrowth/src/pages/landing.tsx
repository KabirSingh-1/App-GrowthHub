import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/constants";
import { Search, ChevronDown, Loader2 } from "lucide-react";
import { addApp } from "@/lib/app-store";

// ─── Platform Icons ───────────────────────────────────────────────────────────

const AppStoreIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5.5" fill="#1C8EF9" />
    <path d="M12 4.5L13.545 7.636H16.8L14.13 9.546L15.18 12.75L12 10.909L8.82 12.75L9.87 9.546L7.2 7.636H10.455L12 4.5Z" fill="white" />
    <path d="M8.5 14.5H15.5M10.5 17H13.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const GooglePlayIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.5 3.27L13.19 12L4.5 20.73C4.19 20.55 4 20.22 4 19.84V4.16C4 3.78 4.19 3.45 4.5 3.27Z" fill="#32BBFF" />
    <path d="M16.96 9.22L14.3 10.75L13.19 12L14.3 13.25L16.96 14.78L19.22 13.43C19.72 13.14 20 12.58 20 12C20 11.42 19.72 10.86 19.22 10.57L16.96 9.22Z" fill="#FFD900" />
    <path d="M5.41 3.18L14.3 10.75L16.96 9.22L7.13 3.73C6.53 3.39 5.84 3.44 5.41 3.18Z" fill="#FF3333" />
    <path d="M5.41 20.82L14.3 13.25L16.96 14.78L7.13 20.27C6.53 20.61 5.84 20.56 5.41 20.82Z" fill="#00F076" />
    <path d="M4.5 3.27C4.76 3.1 5.09 3.06 5.41 3.18L14.3 10.75L4.5 3.27Z" fill="#32BBFF" />
    <path d="M4.5 20.73C4.76 20.9 5.09 20.94 5.41 20.82L14.3 13.25L4.5 20.73Z" fill="#32BBFF" />
  </svg>
);

// ─── Constants ────────────────────────────────────────────────────────────────

const PLATFORMS = [
  { value: "ios", label: "App Store", Icon: AppStoreIcon },
  { value: "android", label: "Google Play", Icon: GooglePlayIcon },
];

const COUNTRY_FLAGS: Record<string, string> = {
  US: "🇺🇸", GB: "🇬🇧", DE: "🇩🇪", FR: "🇫🇷", ES: "🇪🇸",
  IT: "🇮🇹", BR: "🇧🇷", IN: "🇮🇳", JP: "🇯🇵", KR: "🇰🇷",
  AU: "🇦🇺", CA: "🇨🇦", MX: "🇲🇽", RU: "🇷🇺", NL: "🇳🇱",
  SE: "🇸🇪", PL: "🇵🇱", TR: "🇹🇷", SG: "🇸🇬", AE: "🇦🇪",
};

interface Suggestion {
  name: string;
  developer: string;
  icon: string | null;
  appId: string;
  store: string;
  url: string;
  rating: number | null;
}

// ─── Fetch suggestions from scraper APIs ───────────────────────────────────────

async function fetchSuggestions(keyword: string, country: string, platform: string): Promise<Suggestion[]> {
  const endpoint = platform === "android" ? "playstore" : "appstore";
  const url = `/api/${endpoint}/search?q=${encodeURIComponent(keyword)}&country=${country.toLowerCase()}&limit=8`;
  const res = await fetch(url);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.results ?? []).slice(0, 8).map((app: any): Suggestion => ({
    name: app.name ?? "",
    developer: app.developer ?? "",
    icon: app.icon ?? null,
    appId: String(app.appId ?? ""),
    store: app.store ?? (platform === "android" ? "Play Store" : "App Store"),
    url: app.url ?? (platform === "android" ? `https://play.google.com/store/apps/details?id=${app.appId}` : `https://apps.apple.com/app/id${app.appId}`),
    rating: app.rating ?? null,
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Landing() {
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [country, setCountry] = useState(COUNTRIES[7]); // India default
  const [searchQuery, setSearchQuery] = useState("");
  const [platformOpen, setPlatformOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Debounced fetch on input change
  const handleInputChange = useCallback((value: string) => {
    setSearchQuery(value);
    setActiveSuggestion(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (!value.trim() || value.trim().length < 1) {
      setSuggestions([]);
      setSuggestionsOpen(false);
      setLoadingSuggestions(false);
      return;
    }

    setLoadingSuggestions(true);
    setSuggestionsOpen(true);

    debounceRef.current = setTimeout(async () => {
      abortRef.current = new AbortController();
      try {
        const results = await fetchSuggestions(value.trim(), country.code, platform.value);
        setSuggestions(results);
        setSuggestionsOpen(results.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 350);
  }, [country.code]);

  // Re-fetch suggestions when country or platform changes (if there's a query)
  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      handleInputChange(searchQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country.code, platform.value]);

  const handleSearch = (query = searchQuery) => {
    const q = query.trim();
    if (!q) return;
    setSuggestionsOpen(false);
    const params = new URLSearchParams({
      q,
      platform: platform.value,
      country: country.code,
    });
    window.location.href = `/search?${params.toString()}`;
  };

  const handleSuggestionClick = (s: Suggestion) => {
    // Save the app to My Apps (localStorage)
    addApp({
      id: s.appId,
      name: s.name,
      developer: s.developer,
      platform: s.store === "Play Store" ? "Android" : "iOS",
      iconUrl: s.icon,
      rating: s.rating,
      bundleId: s.appId,
      storeUrl: s.url,
      addedAt: new Date().toISOString(),
    });
    // Navigate to My Apps
    window.location.href = "/apps";
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestionsOpen) {
      if (e.key === "Enter") handleSearch();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeSuggestion >= 0 && suggestions[activeSuggestion]) {
        handleSuggestionClick(suggestions[activeSuggestion]);
      } else {
        handleSearch();
      }
    } else if (e.key === "Escape") {
      setSuggestionsOpen(false);
      setActiveSuggestion(-1);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setPlatformOpen(false);
        setCountryOpen(false);
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 w-full bg-background/80 backdrop-blur-md z-50 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-black text-sm tracking-tight">
              AV
            </div>
            <span className="font-black text-xl tracking-tight text-foreground">AppVersal</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="rounded-xl font-medium">Log in</Button>
            </Link>
            <Link href="/dashboard">
              <Button className="rounded-xl font-bold px-6 shadow-sm hover-elevate">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-32 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none text-foreground">
            The co-pilot every app developer <span className="text-primary">wishes</span> they had.
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-medium">
            From your first 100 downloads to your first million. Ratings, ASO, Meta ads, and user acquisition—all in one place.
          </p>

          {/* Search Bar + Autocomplete */}
          <div className="pt-4 flex justify-center">
            <div ref={wrapperRef} className="relative w-full max-w-2xl">

              {/* Bar */}
              <div
                className="flex items-center bg-white rounded-full shadow-lg border border-gray-200"
                style={{ height: "56px" }}
              >
                {/* Platform Dropdown */}
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => { setPlatformOpen(o => !o); setCountryOpen(false); setSuggestionsOpen(false); }}
                    className="flex items-center gap-1.5 pl-5 pr-3 h-full text-sm font-medium text-gray-700 hover:text-gray-900 whitespace-nowrap"
                    style={{ height: "56px" }}
                  >
                    {(() => { const PlatformIcon = platform.Icon; return <PlatformIcon />; })()}
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  {platformOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden py-1">
                      {PLATFORMS.map((p) => {
                        const PIcon = p.Icon;
                        return (
                          <button
                            key={p.value}
                            type="button"
                            onClick={() => { setPlatform(p); setPlatformOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${platform.value === p.value ? "text-primary font-semibold" : "text-gray-700"}`}
                          >
                            <PIcon size={20} />
                            {p.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-200 flex-shrink-0" style={{ height: "28px" }} />

                {/* Country Dropdown */}
                <div className="relative flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => { setCountryOpen(o => !o); setPlatformOpen(false); setSuggestionsOpen(false); }}
                    className="flex items-center gap-1.5 px-3 h-full text-sm font-medium text-gray-700 hover:text-gray-900 whitespace-nowrap"
                    style={{ height: "56px" }}
                  >
                    <span className="text-lg">{COUNTRY_FLAGS[country.code] ?? "🌐"}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                  {countryOpen && (
                    <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                      <div className="max-h-64 overflow-y-auto py-1">
                        {COUNTRIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => { setCountry(c); setCountryOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${country.code === c.code ? "text-primary font-semibold" : "text-gray-700"}`}
                          >
                            <span className="text-base">{COUNTRY_FLAGS[c.code] ?? "🌐"}</span>
                            {c.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-200 flex-shrink-0" style={{ height: "28px" }} />

                {/* Text Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => { if (suggestions.length > 0) setSuggestionsOpen(true); }}
                  placeholder="Enter an app or a keyword to check the performance"
                  className="flex-1 px-4 text-sm text-gray-700 placeholder:text-gray-400 bg-transparent outline-none min-w-0"
                  autoComplete="off"
                />

                {/* Spinner / Search Button */}
                {loadingSuggestions ? (
                  <div className="flex-shrink-0 w-12 h-12 mr-1 flex items-center justify-center">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSearch()}
                    className="flex-shrink-0 w-12 h-12 mr-1 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Autocomplete Suggestions Dropdown */}
              {suggestionsOpen && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="py-1.5">
                    {suggestions.map((s, i) => (
                      <button
                        key={s.appId}
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(s); }}
                        onMouseEnter={() => setActiveSuggestion(i)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${activeSuggestion === i ? "bg-gray-50" : "hover:bg-gray-50"}`}
                      >
                        {/* App icon */}
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                          {s.icon
                            ? <img src={s.icon} alt={s.name} className="w-full h-full object-cover" />
                            : <span className="text-xs text-gray-400">App</span>
                          }
                        </div>
                        {/* App info */}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{s.name}</p>
                          <p className="text-xs text-gray-400 truncate">{s.developer}</p>
                        </div>
                        {/* Store badge */}
                        <div className="flex-shrink-0">
                          {s.store === "Play Store" ? <GooglePlayIcon size={16} /> : <AppStoreIcon size={16} />}
                        </div>
                      </button>
                    ))}
                    {/* "Search all results" footer */}
                    <button
                      type="button"
                      onMouseDown={(e) => { e.preventDefault(); handleSearch(); }}
                      className="w-full flex items-center gap-3 px-4 py-3 border-t border-gray-100 text-sm text-primary font-medium hover:bg-primary/5 transition-colors"
                    >
                      <Search className="w-4 h-4" />
                      Search all results for <span className="font-bold ml-1">"{searchQuery}"</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Link href="/dashboard">
              <Button size="lg" className="h-16 px-10 text-xl rounded-2xl font-bold shadow-lg hover-elevate">
                Launch Mission Control
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
