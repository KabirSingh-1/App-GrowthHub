import { useState, useRef, useCallback, useEffect } from "react";
import appStoreIcon from "@/assets/app-store.svg";
import { getApps, StoredApp, addApp, getActiveAppId, setActiveAppId } from "@/lib/app-store";
import { AppLayout } from "@/components/layout/app-layout";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Settings, Upload, Info, Headphones, X, Copy, ChevronDown, Search, AlertCircle, PlusCircle, Plus, Loader2, BarChart2, Ticket, TrendingUp, RefreshCw, Trash2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const TARGET_COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
];

export default function OrderAsoInstalls() {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isIpad, setIsIpad] = useState(false);
  const [platform, setPlatform] = useState<"ios" | "android">("ios");

  // Load active app on mount
  useEffect(() => {
    const activeId = getActiveAppId();
    if (activeId) {
      const allApps = getApps();
      const activeApp = allApps.find(a => a.id === activeId);
      if (activeApp) {
        setSelectedApp(activeApp);
        setPlatform(activeApp.platform === "iOS" ? "ios" : "android");
      }
    }
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);
  const [language, setLanguage] = useState("English");
  const [deliveryType, setDeliveryType] = useState("Spread Installs Within 24h");
  const [focusedKeywordId, setFocusedKeywordId] = useState<string | null>(null);

  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleStartPromotion = () => {
    toast({
      title: "Promotion Started",
      description: "Your ASO Installs promotion has been successfully launched.",
    });
    setLocation("/orders");
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "Your promotion draft has been saved securely.",
    });
    setLocation("/orders");
  };

  const handleStartFuture = () => {
    toast({
      title: "Promotion Scheduled",
      description: "Your promotion has been scheduled for the future.",
    });
    setLocation("/orders");
  };

  // App dropdown states
  const [isAppDropdownOpen, setIsAppDropdownOpen] = useState(false);
  const [appSearchQuery, setAppSearchQuery] = useState("");
  const [savedApps, setSavedApps] = useState<StoredApp[]>([]);

  // Country dropdown states
  const [selectedCountry, setSelectedCountry] = useState(TARGET_COUNTRIES[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isModalCountryDropdownOpen, setIsModalCountryDropdownOpen] = useState(false);

  // Task Plan States
  type KeywordEntry = { id: string; installs: string; keyword: string; };
  type DayPlan = { id: string; dayNumber: number; keywords: KeywordEntry[]; };
  const [days, setDays] = useState<DayPlan[]>([{ id: "day-1", dayNumber: 1, keywords: [{ id: "kw-1", installs: "500", keyword: "" }] }]);
  const [activeDayId, setActiveDayId] = useState("day-1");

  const addDay = () => {
    const nextNum = days.length > 0 ? Math.max(...days.map(d => d.dayNumber)) + 1 : 1;
    const newId = `day-${Date.now()}`;
    setDays([...days, { id: newId, dayNumber: nextNum, keywords: [{ id: `kw-${Date.now()}`, installs: "500", keyword: "" }] }]);
    setActiveDayId(newId);
  };

  const removeDay = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (days.length <= 1) return;
    const newDays = days.filter(d => d.id !== id);
    setDays(newDays);
    if (activeDayId === id) setActiveDayId(newDays[newDays.length - 1].id);
  };

  const addKeyword = (dayId: string) => {
    setDays(days.map(d => d.id === dayId ? { ...d, keywords: [...d.keywords, { id: `kw-${Date.now()}-${Math.random()}`, installs: "500", keyword: "" }] } : d));
  };

  const updateKeyword = (dayId: string, kwId: string, field: "installs" | "keyword", value: string) => {
    setDays(days.map(d => d.id === dayId ? { ...d, keywords: d.keywords.map(kw => kw.id === kwId ? { ...kw, [field]: value } : kw) } : d));
  };

  const removeKeyword = (dayId: string, kwId: string) => {
    setDays(days.map(d => {
      if (d.id !== dayId) return d;
      // Don't allow deleting the last keyword
      if (d.keywords.length <= 1) return d;
      return { ...d, keywords: d.keywords.filter(kw => kw.id !== kwId) };
    }));
  };

  // Effect to load saved apps when dropdown opens
  useEffect(() => {
    if (isAppDropdownOpen) {
      setSavedApps(getApps());
    }
  }, [isAppDropdownOpen]);

  // Click outside listener for app dropdown
  const appDropdownRef = useRef<HTMLDivElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const modalCountryDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (appDropdownRef.current && !appDropdownRef.current.contains(e.target as Node)) {
        setIsAppDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(e.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
      if (modalCountryDropdownRef.current && !modalCountryDropdownRef.current.contains(e.target as Node)) {
        setIsModalCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

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
        const url = `/api/${endpoint}/search?q=${encodeURIComponent(value.trim())}&country=us&limit=8`;
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
  }, [platform]);

  useEffect(() => {
    if (searchQuery.trim().length >= 1) {
      handleInputChange(searchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform]);

  const handleSuggestionClick = (app: any) => {
    const appPlatform = app.store === "Play Store" ? "Android" : "iOS";
    const storedApp: StoredApp = {
      id: app.appId,
      name: app.name,
      developer: app.developer || "Unknown",
      platform: appPlatform,
      iconUrl: app.icon || null,
      rating: app.rating || null,
      bundleId: app.bundleId || app.appId,
      storeUrl: app.storeUrl || "",
      addedAt: new Date().toISOString(),
    };
    addApp(storedApp);
    setActiveAppId(storedApp.id);

    setSelectedApp(storedApp);
    setPlatform(appPlatform === "iOS" ? "ios" : "android");
    
    setIsModalOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!suggestionsOpen) {
      if (e.key === "Enter") {
        
        setIsModalOpen(false);
      }
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
        
        setIsModalOpen(false);
      }
    } else if (e.key === "Escape") {
      setSuggestionsOpen(false);
      setActiveSuggestion(-1);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen bg-[#f4f6fa] p-8 font-sans">

                  <div className="mb-6 relative z-10">
            {/* Active state Select Your APP Box */}
            <div className="bg-white rounded-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">

              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <div className="w-[4px] h-[16px] bg-[#635BFF] rounded-full"></div>
                <h2 className="text-[16px] font-extrabold text-[#111827] tracking-tight">Select Your APP</h2>
              </div>

              <div className="px-5 py-4 flex items-center">
                {/* Platform Icons Container (4 Icons) */}
                <div className="flex items-center gap-1.5 bg-[#f4f5f8] p-1.5 rounded-[8px] shrink-0 border border-gray-100/50">
                  <button
                    onClick={() => { setPlatform("ios"); setSelectedApp(null); }}
                    className={`w-[36px] h-[30px] rounded-[6px] flex items-center justify-center transition-colors ${platform === "ios" ? "bg-white border border-gray-200 shadow-sm" : "hover:bg-gray-200/50"}`}
                  >
                    <img src={appStoreIcon} alt="App Store" className="w-[16px] h-[16px]" />
                  </button>
                  <button
                    onClick={() => { setPlatform("android"); setSelectedApp(null); }}
                    className={`w-[36px] h-[30px] rounded-[6px] flex items-center justify-center transition-colors ${platform === "android" ? "bg-white border border-gray-200 shadow-sm" : "hover:bg-gray-200/50"}`}
                  >
                    <svg className="w-[16px] h-[16px] ml-0.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 3V21L13.5 12L4 3Z" fill="#00E676" />
                      <path d="M4 3L13.5 12L17.5 9.5L5.5 2L4 3Z" fill="#FF3B30" />
                      <path d="M4 21L13.5 12L17.5 14.5L5.5 22L4 21Z" fill="#007AFF" />
                      <path d="M13.5 12L17.5 9.5L20 11C20.8 11.5 20.8 12.5 20 13L17.5 14.5L13.5 12Z" fill="#FFC107" />
                    </svg>
                  </button>
                </div>

                <div className="w-[20px]"></div>

                {/* Selected App Display */}
                <div className="relative" ref={appDropdownRef}>
                  <div
                    onClick={() => setIsAppDropdownOpen(!isAppDropdownOpen)}
                    className={`flex items-center gap-2 rounded-[4px] py-[6px] cursor-pointer transition-all ${
                      selectedApp 
                        ? 'px-3 flex-1 min-w-[200px] border border-[#635BFF] bg-white shadow-[0_0_0_1px_rgba(99,91,255,0.2)] hover:bg-gray-50' 
                        : 'px-5 w-[140px] border border-dashed border-[#635BFF]/50 bg-[#635BFF]/5 hover:bg-[#635BFF]/10 hover:border-[#635BFF] justify-center'
                    }`}
                  >
                    {selectedApp ? (
                      <>
                        <img src={selectedApp.iconUrl || selectedApp.icon} alt="App Icon" className="w-5 h-5 rounded-[4px] shadow-sm" />
                        <span className="text-[13px] font-semibold text-gray-800">{selectedApp.name}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 ml-auto transition-transform ${isAppDropdownOpen ? "rotate-180" : ""}`} />
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 text-[#635BFF]" />
                        <span className="text-[13px] font-bold text-[#635BFF]">Add App</span>
                      </>
                    )}
                  </div>

                  {/* Saved Apps Dropdown */}
                  {isAppDropdownOpen && (
                    <div className="absolute top-full left-0 mt-3 w-[260px] bg-white rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-50 p-2">
                      {/* Triangle pointer */}
                      <div className="absolute -top-[6px] left-[30px] w-3 h-3 bg-white border-t border-l border-gray-100 rotate-45 rounded-tl-[2px]"></div>

                      <input
                        type="text"
                        placeholder="Search Your Apps"
                        value={appSearchQuery}
                        onChange={(e) => setAppSearchQuery(e.target.value)}
                        className="w-full border border-gray-200 rounded-[4px] text-[13px] px-3 py-[7px] mb-2 outline-none focus:border-[#635BFF] transition-colors relative z-10 bg-white placeholder:text-gray-400"
                        autoFocus
                      />

                      <div className="max-h-[220px] overflow-y-auto space-y-1 relative z-10 scrollbar-thin">
                        {savedApps.filter(a => a.name.toLowerCase().includes(appSearchQuery.toLowerCase())).map(app => (
                          <div
                            key={app.id}
                            onClick={() => {
                              setSelectedApp(app);
                              setPlatform(app.platform === "iOS" ? "ios" : "android");
                              setActiveAppId(app.id);
                              setIsAppDropdownOpen(false);
                            }}
                            className="flex items-center gap-3 px-2 py-2 rounded-[6px] hover:bg-[#f8f9fc] cursor-pointer transition-colors"
                          >
                            <div className="relative w-[32px] h-[32px] flex-shrink-0">
                              <img src={app.iconUrl || ""} alt={app.name} className="w-full h-full rounded-[6px] object-cover shadow-[0_2px_4px_rgba(0,0,0,0.05)] border border-gray-100/50" />
                              <div className="absolute -bottom-[5px] -right-[5px] w-[18px] h-[18px] rounded-[4px] bg-white shadow-sm flex items-center justify-center border border-gray-50">
                                {app.platform === "iOS" ? <img src={appStoreIcon} className="w-[12px] h-[12px]" /> : (
                                  <svg className="w-[12px] h-[12px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 3V21L13.5 12L4 3Z" fill="#00E676" />
                                    <path d="M4 3L13.5 12L17.5 9.5L5.5 2L4 3Z" fill="#FF3B30" />
                                    <path d="M4 21L13.5 12L17.5 14.5L5.5 22L4 21Z" fill="#007AFF" />
                                    <path d="M13.5 12L17.5 9.5L20 11C20.8 11.5 20.8 12.5 20 13L17.5 14.5L13.5 12Z" fill="#FFC107" />
                                  </svg>
                                )}
                              </div>
                            </div>
                            <span className="text-[13px] font-semibold text-[#635BFF] truncate">{app.name}</span>
                          </div>
                        ))}
                        {savedApps.length === 0 && (
                          <div className="text-[12px] text-gray-500 text-center py-4">
                            {appSearchQuery ? "No apps found" : "No saved apps"}
                          </div>
                        )}
                      </div>

                      <div className="border-t border-gray-100 mt-2 pt-2 relative z-10">
                        <button
                          onClick={() => {
                            setIsAppDropdownOpen(false);
                            setIsModalOpen(true);
                          }}
                          className="w-full flex items-center justify-center gap-1.5 py-2 text-[13px] font-medium text-[#635BFF] hover:text-[#5046e5] hover:bg-[#f8f9fc] rounded-[4px] transition-colors"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Add New App
                        </button>
                      </div>
                    </div>
                  )}
                </div>


                <div className="w-px h-6 bg-gray-200 mx-5"></div>

                {/* Country Select */}
                <div className="relative" ref={countryDropdownRef}>
                  <div
                    onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                    className="flex items-center gap-2 border border-gray-200 bg-white rounded-[6px] px-[12px] py-[8px] min-w-[190px] shadow-sm hover:border-gray-300 cursor-pointer transition-colors shrink-0"
                  >
                    <span className="text-[15px] shadow-sm rounded-[2px] overflow-hidden leading-none border border-gray-100">{selectedCountry.flag}</span>
                    <span className="text-[13px] text-gray-700 flex-1 font-medium">{selectedCountry.name}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCountryDropdownOpen ? "rotate-180" : ""}`} />
                  </div>

                  {isCountryDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-full min-w-[190px] bg-white rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-50 py-1.5 overflow-hidden">
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
              </div>

            </div>
          </div>

        {/* Huge Form Area / Content Area */}
          <div className="transition-all duration-300">
            {/* Section 2: Task Plan */}
            <div className="mb-6 relative z-0">
              <div className="bg-white rounded-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-[4px] h-[16px] bg-[#635BFF] rounded-full"></div>
                  <h2 className="text-[16px] font-extrabold text-[#111827] tracking-tight">Task Plan</h2>
                </div>

                <div className="p-6">
                  {/* Task Plan Content */}
                  <div className="bg-[#fafbfe] rounded-[8px] border border-gray-100 p-4 mb-6">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-[10px] mb-4">
                      <div className="flex items-center gap-3">
                        {/* Tabs */}
                        <div className="flex items-center gap-1 overflow-x-auto max-w-[500px] scrollbar-none">
                          {days.map((day) => (
                            <div
                              key={day.id}
                              onClick={() => setActiveDayId(day.id)}
                              className="flex items-center gap-1.5 px-3 py-1 relative cursor-pointer"
                            >
                              {activeDayId === day.id && <div className="absolute top-1 left-2 w-1 h-1 bg-[#FF6B6B] rounded-full"></div>}
                              <span className={`text-[13px] font-bold ml-2 ${activeDayId === day.id ? "text-[#635BFF]" : "text-gray-500 hover:text-gray-700"}`}>Day{day.dayNumber}</span>
                              {days.length > 1 && (
                                <button onClick={(e) => removeDay(day.id, e)} className={`${activeDayId === day.id ? "text-[#635BFF] hover:text-indigo-800" : "text-gray-400 hover:text-gray-600"} ml-1`}>
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {activeDayId === day.id && <div className="absolute -bottom-[11px] left-0 right-0 h-[2px] bg-[#635BFF]"></div>}
                            </div>
                          ))}
                        </div>
                        <button onClick={addDay} className="w-[20px] h-[20px] flex items-center justify-center rounded-full border border-gray-300 text-gray-400 hover:text-gray-600 hover:border-gray-400 transition-colors shrink-0">
                          <Plus className="w-[12px] h-[12px]" />
                        </button>
                      </div>
                    </div>

                    {days.find(d => d.id === activeDayId)?.keywords.map((kw, idx) => (
                      <div key={kw.id} className="flex items-center gap-4 mb-4 relative" style={{ zIndex: 100 - idx }}>
                        <span className="text-[13px] font-semibold text-gray-700">Install</span>
                        <input
                          type="text"
                          value={kw.installs}
                          onChange={(e) => updateKeyword(activeDayId, kw.id, "installs", e.target.value)}
                          className="w-[80px] h-[36px] border border-gray-200 rounded-[6px] px-3 text-[13px] font-medium outline-none focus:border-[#635BFF] bg-white shadow-sm text-gray-800"
                        />
                        <button className="w-[36px] h-[36px] flex items-center justify-center border border-gray-200 rounded-[6px] bg-white hover:bg-gray-50 text-gray-400 shadow-sm transition-colors shrink-0">
                          <BarChart2 className="w-[16px] h-[16px] -rotate-90" />
                        </button>

                        <div className="w-4"></div>

                        <span className="text-[13px] font-semibold text-gray-700 shrink-0">Search by</span>
                        <div className="relative flex-1 max-w-[280px]">
                          <input
                            type="text"
                            value={kw.keyword}
                            onChange={(e) => updateKeyword(activeDayId, kw.id, "keyword", e.target.value)}
                            onFocus={() => setFocusedKeywordId(kw.id)}
                            onBlur={() => setTimeout(() => setFocusedKeywordId(null), 200)}
                            placeholder="Input or select keyword"
                            className="w-full h-[36px] border border-gray-200 bg-white rounded-[6px] pl-3 pr-8 text-[13px] text-gray-800 font-medium outline-none focus:border-[#635BFF] shadow-sm placeholder:text-gray-400 placeholder:font-normal"
                          />
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />

                          {focusedKeywordId === kw.id && kw.keyword && (
                            <div className="absolute top-[calc(100%+4px)] left-0 w-full min-w-[280px] bg-white rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-50 overflow-hidden text-left">
                              {/* Triangle pointer */}
                              <div className="absolute -top-[5px] left-[30px] w-2.5 h-2.5 bg-white border-t border-l border-gray-100 rotate-45 rounded-tl-[2px]"></div>
                              
                              <div className="p-3 relative z-10 bg-white">
                                <div className="text-[12px] font-medium text-gray-400 mb-1">Recommended</div>
                                <button
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setFocusedKeywordId(null);
                                    addKeyword(activeDayId);
                                  }}
                                  className="w-full text-left text-[14px] text-[#635BFF] hover:bg-[#f8f9fc] p-2 -mx-2 rounded-[6px] transition-colors"
                                >
                                  + Add "{kw.keyword}" as my keyword
                                </button>
                              </div>
                              <div className="border-t border-gray-100 p-2.5 flex items-center justify-between bg-[#fafbfe] relative z-10">
                                <button 
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setFocusedKeywordId(null);
                                    addKeyword(activeDayId);
                                  }}
                                  className="flex items-center justify-center gap-1.5 h-[34px] px-4 border border-[#635BFF]/40 text-[#635BFF] rounded-[6px] text-[13px] font-semibold hover:bg-[#635BFF]/5 transition-colors"
                                >
                                  <PlusCircle className="w-[14px] h-[14px]" /> Add More
                                </button>
                                <button 
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    setFocusedKeywordId(null);
                                    addKeyword(activeDayId);
                                  }}
                                  className="flex items-center justify-center h-[34px] px-6 bg-[#635BFF] text-white rounded-[6px] text-[13px] font-semibold hover:bg-indigo-600 transition-colors shadow-sm"
                                >
                                  Add(1)
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <span className="text-[13px] font-bold text-[#3a3741] w-5 text-center shrink-0 ml-2">{18 - (idx * 2)}</span>
                        <button className="w-[24px] h-[24px] flex items-center justify-center text-[#9a97a0] hover:text-[#3a3741] transition-colors shrink-0">
                          <TrendingUp className="w-[16px] h-[16px]" />
                        </button>
                        <button className="w-[24px] h-[24px] flex items-center justify-center text-[#9a97a0] hover:text-[#3a3741] transition-colors shrink-0">
                          <RefreshCw className="w-[14px] h-[14px]" />
                        </button>
                        <button onClick={() => removeKeyword(activeDayId, kw.id)} className="w-[24px] h-[24px] flex items-center justify-center text-[#9a97a0] hover:text-red-500 transition-colors shrink-0">
                          <Trash2 className="w-[15px] h-[15px]" />
                        </button>
                        {idx === 0 && (
                          <button onClick={() => addKeyword(activeDayId)} className="w-[20px] h-[20px] flex items-center justify-center rounded-full border-[1.5px] border-[#9a97a0] text-[#9a97a0] hover:text-[#3a3741] hover:border-[#3a3741] transition-colors bg-transparent shrink-0 ml-1">
                            <Plus className="w-[12px] h-[12px]" />
                          </button>
                        )}
                      </div>
                    ))}

                    <div className="flex items-center gap-3 mt-5">
                      <button onClick={() => addKeyword(activeDayId)} className="flex items-center gap-1.5 bg-[#635BFF] hover:bg-indigo-600 text-white px-4 h-[36px] rounded-[6px] text-[13px] font-semibold transition-colors shadow-sm">
                        <PlusCircle className="w-[14px] h-[14px]" /> Add More Keywords
                      </button>
                      <button className="w-[36px] h-[36px] flex items-center justify-center border border-[#635BFF] text-[#635BFF] rounded-[6px] hover:bg-[#635BFF]/5 transition-colors shadow-sm bg-white">
                        <Upload className="w-[16px] h-[16px]" />
                      </button>
                    </div>
                  </div>

                  <div className="w-full h-px bg-gray-100 mb-6"></div>

                  <div className="grid grid-cols-[120px_1fr] gap-y-6 items-center">
                    <div className="flex items-center gap-1 text-[13px] font-semibold text-gray-700">
                      Language <Info className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <div>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="w-[200px] h-[36px] bg-white border-gray-200 text-[13px] text-gray-800 font-medium shadow-sm rounded-[6px] focus:ring-[#635BFF]">
                          <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-[6px] text-[13px]">
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Japanese">Japanese</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-1 text-[13px] font-semibold text-gray-700">
                      Delivery Type
                    </div>
                    <div>
                      <Select value={deliveryType} onValueChange={setDeliveryType}>
                        <SelectTrigger className="w-[280px] h-[36px] bg-white border-gray-200 text-[13px] text-gray-800 font-medium shadow-sm rounded-[6px] focus:ring-[#635BFF]">
                          <SelectValue placeholder="Delivery Type" />
                        </SelectTrigger>
                        <SelectContent className="bg-white rounded-[6px] text-[13px]">
                          <SelectItem value="Spread Installs Within 24h">Spread Installs Within 24h</SelectItem>
                          <SelectItem value="Deliver as fast as possible">Deliver as fast as possible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Section 3: Order Price */}
            <div className="mb-6 relative z-0">
              <div className="bg-white rounded-[12px] shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <div className="w-[4px] h-[16px] bg-[#635BFF] rounded-full"></div>
                  <h2 className="text-[16px] font-extrabold text-[#111827] tracking-tight">Order Price</h2>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-[120px_1fr] gap-y-5 items-center mb-6">
                    <div className="text-[13px] font-semibold text-gray-700 mt-2">
                      Total Price
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[18px] font-extrabold text-gray-900 border-b border-gray-900 leading-tight">$50.00</span>
                    </div>
                  </div>

                  <div className="w-full h-px bg-gray-100 mb-6"></div>

                  <div className="flex gap-3">
                    <button onClick={handleStartPromotion} className="bg-[#635BFF] hover:bg-indigo-600 text-white px-6 h-[40px] rounded-[6px] text-[13px] font-semibold transition-colors shadow-sm shadow-indigo-200">
                      Start Promotion
                    </button>
                    <button onClick={handleSaveDraft} className="border border-[#635BFF] text-[#635BFF] hover:bg-[#635BFF]/5 px-6 h-[40px] rounded-[6px] text-[13px] font-semibold transition-colors shadow-sm">
                      Save Draft
                    </button>
                    <button onClick={handleStartFuture} className="border border-[#635BFF] text-[#635BFF] hover:bg-[#635BFF]/5 px-6 h-[40px] rounded-[6px] text-[13px] font-semibold transition-colors shadow-sm">
                      Start in the Future
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>

      {/* Add New App Modal Overlay */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-visible gap-0 rounded-[20px] bg-transparent border-none shadow-none [&>button]:hidden">
          {/* Modal Content */}
          <div className="bg-white rounded-[20px] shadow-2xl w-full relative z-10 overflow-visible flex flex-col font-sans border border-gray-100">

            {/* Header */}
            <div className="flex items-center justify-between px-[24px] py-[20px] border-b border-gray-100 bg-[#fafbfe] rounded-t-[20px]">
              <h2 className="text-[17px] font-extrabold text-gray-900 tracking-tight">Add New App</h2>
              <button
                onClick={() => setIsModalOpen(false)}
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
                    <img src={appStoreIcon} alt="App Store" className="w-[18px] h-[18px] relative z-10" />
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
                <div className="relative" ref={modalCountryDropdownRef}>
                  <div
                    onClick={() => setIsModalCountryDropdownOpen(!isModalCountryDropdownOpen)}
                    className="flex items-center gap-2 border border-gray-200 rounded-[3px] px-[14px] py-[11px] min-w-[190px] cursor-pointer hover:border-gray-300 transition-colors shrink-0 bg-white"
                  >
                    <span className="text-[15px] rounded-[2px] overflow-hidden leading-none border border-gray-100 shadow-sm">{selectedCountry.flag}</span>
                    <span className="text-[13px] text-gray-800 flex-1 font-bold">{selectedCountry.name}</span>
                    <ChevronDown className={`w-[14px] h-[14px] text-gray-400 stroke-[1.5] transition-transform ${isModalCountryDropdownOpen ? "rotate-180" : ""}`} />
                  </div>

                  {isModalCountryDropdownOpen && (
                    <div className="absolute top-full left-0 mt-2 w-full min-w-[190px] bg-white rounded-[8px] shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 z-50 py-1.5 overflow-hidden">
                      {TARGET_COUNTRIES.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => { setSelectedCountry(c); setIsModalCountryDropdownOpen(false); }}
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
                                <img src={appStoreIcon} alt="App Store" className="w-[18px] h-[18px]" />
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
    </AppLayout>
  );
}
