import { useState, useRef, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Loader2, X, ChevronDown, AlertCircle } from "lucide-react";
import { addApp, type StoredApp } from "@/lib/app-store";
import appStoreIconSvg from "@/assets/app-store.svg";

// ─── Constants ────────────────────────────────────────────────────────────────

const TARGET_COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
];

export function AddAppModal({ 
  children, 
  onAppAdded 
}: { 
  children: React.ReactNode;
  onAppAdded: (app: StoredApp) => void;
}) {
  const [open, setOpen] = useState(false);
  
  // State from aso-installs modal
  const [platform, setPlatform] = useState<"ios" | "android">("ios");
  const [selectedCountry, setSelectedCountry] = useState(TARGET_COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

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
        const endpoint = platform === "android" ? "playstore" : "appstore";
        const url = `/api/${endpoint}/search?q=${encodeURIComponent(value.trim())}&country=${selectedCountry.code.toLowerCase()}&limit=8`;
        const res = await fetch(url, { signal: abortRef.current.signal });
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        const results = (data.results ?? []).slice(0, 8);
        setSuggestions(results);
        setSuggestionsOpen(results.length > 0);
      } catch (e: any) {
        if (e.name !== 'AbortError') setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 350);
  }, [platform, selectedCountry]);

  // Re-fetch suggestions when platform/country changes
  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      handleInputChange(searchQuery);
    }
  }, [platform, selectedCountry]);

  const handleSuggestionClick = (app: any) => {
    const appPlatform = app.store === "Play Store" ? "Android" : "iOS";
    const newApp: StoredApp = {
      id: app.appId,
      name: app.name,
      developer: app.developer || "Unknown",
      platform: appPlatform,
      iconUrl: app.icon || null,
      rating: app.rating || null,
      bundleId: app.bundleId || app.appId,
      storeUrl: app.storeUrl || "",
      addedAt: new Date().toISOString()
    };
    addApp(newApp);
    onAppAdded(newApp);
    setOpen(false);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestionsOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveSuggestion(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveSuggestion(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter" && activeSuggestion >= 0) {
      e.preventDefault();
      if (suggestions[activeSuggestion]) {
        handleSuggestionClick(suggestions[activeSuggestion]);
      }
    } else if (e.key === "Escape") {
      setSuggestionsOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] p-0 overflow-visible gap-0 rounded-[20px] bg-transparent border-none shadow-none [&>button]:hidden">
        {/* Custom Modal Content identical to aso-installs */}
        <div className="bg-white rounded-[20px] shadow-2xl w-full relative z-10 overflow-visible flex flex-col font-sans border border-gray-100">
          
          {/* Header */}
          <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-gray-100 bg-[#fafbfe] rounded-t-[20px]">
            <h2 className="text-[17px] font-extrabold text-gray-900 tracking-tight">Add New App</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Body */}
          <div className="px-[24px] py-[20px]">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-[24px]">
              {/* Platform icons in modal */}
              <div className="flex items-center gap-1.5 bg-[#f5f6fa] p-1.5 rounded-[3px] border border-gray-100/50 shadow-sm shrink-0">
                <button
                  onClick={() => setPlatform("ios")}
                  className={`w-[42px] h-[34px] rounded-[2px] flex items-center justify-center relative overflow-hidden transition-colors ${platform === "ios" ? "bg-white border border-[#635BFF]/30 shadow-sm" : "bg-transparent border border-transparent hover:bg-gray-200/50"}`}
                >
                  {platform === "ios" && <div className="absolute inset-0 bg-[#635BFF]/5"></div>}
                  <img src={appStoreIconSvg} alt="App Store" className="w-[18px] h-[18px] relative z-10" />
                </button>
                <button
                  onClick={() => setPlatform("android")}
                  className={`w-[42px] h-[34px] rounded-[2px] flex items-center justify-center transition-colors shadow-sm ${platform === "android" ? "bg-white border border-[#635BFF]/30" : "bg-white border border-gray-200/50 hover:bg-gray-50"}`}
                >
                  <svg className="w-[20px] h-[20px] ml-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 3V21L13.5 12L4 3Z" fill="#00E676" />
                    <path d="M4 3L13.5 12L17.5 9.5L5.5 2L4 3Z" fill="#FF3B30" />
                    <path d="M4 21L13.5 12L17.5 14.5L5.5 22L4 21Z" fill="#007AFF" />
                    <path d="M13.5 12L17.5 9.5L20 11C20.8 11.5 20.8 12.5 20 13L17.5 14.5L13.5 12Z" fill="#FFC107" />
                  </svg>
                </button>
              </div>

              {/* Country Select */}
              <div className="relative" ref={countryDropdownRef}>
                <div
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="flex items-center gap-2 border border-gray-200 rounded-[3px] px-[14px] py-[11px] min-w-[190px] cursor-pointer hover:border-gray-300 transition-colors shrink-0 bg-white"
                >
                  <span className="text-[15px] rounded-[2px] overflow-hidden leading-none border border-gray-100 shadow-sm">{selectedCountry.flag}</span>
                  <span className="text-[13px] text-gray-800 flex-1 font-bold">{selectedCountry.name}</span>
                  <ChevronDown className={`w-[14px] h-[14px] text-gray-400 stroke-[1.5] transition-transform ${isCountryDropdownOpen ? "rotate-180" : ""}`} />
                </div>

                {isCountryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full min-w-[190px] bg-white rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-50 py-1.5 overflow-hidden">
                    {TARGET_COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => { setSelectedCountry(c); setIsCountryDropdownOpen(false); }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-[13px] transition-colors ${selectedCountry.code === c.code ? "bg-[#f8f9fc] font-semibold text-[#635BFF]" : "hover:bg-gray-50 text-gray-700 font-medium"}`}
                      >
                        <span className="text-[15px] shadow-sm rounded-[2px] overflow-hidden leading-none border border-gray-100">{c.flag}</span>
                        {c.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Search Input with Autocomplete */}
              <div className="flex-1 relative" ref={wrapperRef}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => { if (suggestions.length > 0) setSuggestionsOpen(true); }}
                  placeholder="Search by ID / link / name"
                  className="w-full border border-gray-200 rounded-[3px] pl-[14px] pr-10 py-[11px] text-[13px] font-semibold outline-none focus:border-[#635BFF] transition-all placeholder:text-gray-400 bg-white"
                />

                {loadingSuggestions ? (
                  <Loader2 className="w-[14px] h-[14px] text-[#635BFF] absolute right-4 top-[14px] pointer-events-none animate-spin" />
                ) : (
                  <Search className="w-[14px] h-[14px] text-gray-300 absolute right-4 top-[14px] pointer-events-none stroke-[1.5]" />
                )}

                {/* Suggestions Dropdown */}
                {suggestionsOpen && suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-100 z-50 overflow-visible">
                    {/* Triangle pointer */}
                    <div className="absolute -top-[6px] left-[20px] w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45 rounded-tl-[2px]"></div>

                    <div className="py-2 max-h-[360px] overflow-y-auto relative z-10 bg-white rounded-2xl">
                      {suggestions.map((s, i) => (
                        <button
                          key={s.appId}
                          type="button"
                          onMouseDown={(e) => { e.preventDefault(); handleSuggestionClick(s); }}
                          onMouseEnter={() => setActiveSuggestion(i)}
                          className={`w-full flex items-center gap-4 px-5 py-3 text-left transition-colors ${activeSuggestion === i ? "bg-[#f8f9fc]" : "hover:bg-[#f8f9fc]"}`}
                        >
                          {/* App icon */}
                          <div className="w-[44px] h-[44px] rounded-[10px] shadow-sm overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
                            {s.icon ? (
                              <img src={s.icon} alt={s.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-gray-400 font-medium">App</span>
                            )}
                          </div>
                          {/* App info */}
                          <div className="min-w-0 flex-1">
                            <p className="text-[15px] font-medium text-gray-900 truncate tracking-tight">{s.name}</p>
                            <p className="text-[13px] text-gray-400 truncate mt-0.5">{s.developer}</p>
                          </div>
                          {/* Store badge */}
                          <div className="flex-shrink-0 pl-3">
                            {platform === "android" ? (
                              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 3V21L13.5 12L4 3Z" fill="#00E676" />
                                <path d="M4 3L13.5 12L17.5 9.5L5.5 2L4 3Z" fill="#FF3B30" />
                                <path d="M4 21L13.5 12L17.5 14.5L5.5 22L4 21Z" fill="#007AFF" />
                                <path d="M13.5 12L17.5 9.5L20 11C20.8 11.5 20.8 12.5 20 13L17.5 14.5L13.5 12Z" fill="#FFC107" />
                              </svg>
                            ) : (
                              <img src={appStoreIconSvg} alt="App Store" className="w-[18px] h-[18px]" />
                            )}
                          </div>
                        </button>
                      ))}
                      {/* "Search all results" footer */}
                      <button
                        type="button"
                        onMouseDown={(e) => { e.preventDefault(); if (suggestions[0]) handleSuggestionClick(suggestions[0]); }}
                        className="w-full flex items-center gap-3 px-5 py-3.5 border-t border-gray-100 text-[14px] text-[#8b5cf6] hover:text-[#7c3aed] font-medium hover:bg-[#f8f9fc] transition-colors mt-1"
                      >
                        <Search className="w-4 h-4 stroke-[2]" />
                        Search all results for <span className="font-bold">"{searchQuery}"</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Notice Section */}
            <div className="bg-[#fcfcff] border border-[#eef0ff] rounded-[12px] p-4 flex gap-3">
              <div className="mt-0.5">
                <AlertCircle className="w-[18px] h-[18px] text-[#635BFF]" />
              </div>
              <div>
                <h4 className="text-[14px] font-extrabold text-gray-900 mb-2 tracking-tight">Notice</h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-[13px] text-gray-600 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#635BFF] mt-[6px] shrink-0"></div>
                    <span>Please ensure that the app you submit is a <span className="font-bold text-[#635BFF]">free application</span>. Paid apps are not supported.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[13px] text-gray-600 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#635BFF] mt-[6px] shrink-0"></div>
                    <span>The app must be freely available and not restricted in the country you selected.</span>
                  </li>
                  <li className="flex items-start gap-2 text-[13px] text-gray-600 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#635BFF] mt-[6px] shrink-0"></div>
                    <span>The app must not require any special system permissions to install.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
