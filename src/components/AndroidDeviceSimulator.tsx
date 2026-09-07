import React, { useState, useEffect } from 'react';
import { Article, CategoryItem, ScreenRoute } from '../types';
import { AdMobBannerMock } from './AdMobBannerMock';
import { AdMobInterstitialMock } from './AdMobInterstitialMock';
import { 
  Search, ArrowLeft, Share2, Globe, RefreshCw, WifiOff, Calendar, 
  User, Check, Sparkles, ExternalLink, ChevronRight, Bookmark, Volume2
} from 'lucide-react';

interface AndroidDeviceSimulatorProps {
  onArticleReadCountChange: (count: number) => void;
  showInterstitialDirectly: boolean;
  onDismissInterstitialDirectly: () => void;
}

export const AndroidDeviceSimulator: React.FC<AndroidDeviceSimulatorProps> = ({
  onArticleReadCountChange,
  showInterstitialDirectly,
  onDismissInterstitialDirectly
}) => {
  // Navigation State
  const [currentRoute, setCurrentRoute] = useState<ScreenRoute>('splash');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Data State
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Offline Simulation State
  const [simulateOffline, setSimulateOffline] = useState(false);

  // AdMob State
  const [readCount, setReadCount] = useState(0);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [pendingArticle, setPendingArticle] = useState<Article | null>(null);

  // Fallback data in case of CORS or connectivity block
  const sampleArticles: Article[] = [
    {
      id: 101,
      title: "Rajasthan Police Constable Result 2025: राजस्थान पुलिस कांस्टेबल रिजल्ट और मेरिट लिस्ट जारी, यहाँ से चेक करें",
      excerpt: "राजस्थान पुलिस कांस्टेबल भर्ती परीक्षा 2024-25 का परिणाम और कट ऑफ मार्क्स आधिकारिक पोर्टल पर घोषित कर दिए गए हैं...",
      content: "<p>राजस्थान पुलिस भर्ती एवं पदोन्नति बोर्ड द्वारा कांस्टेबल सामान्य, चालक एवं बैंड के रिक्त पदों हेतु आयोजित लिखित परीक्षा का परिणाम जारी कर दिया गया है।</p><h3>महत्वपूर्ण तिथियां व परिणाम विवरण</h3><p>परीक्षार्थी अपने रोल नंबर और जन्म तिथि की सहायता से अपना स्कोरकार्ड और मेरिट सूची डाउनलोड कर सकते हैं। शारीरिक दक्षता परीक्षा (PET/PST) के लिए चयनित अभ्यर्थियों के एडमिट कार्ड जल्द जारी होंगे।</p><p>अधिक जानकारी के लिए nsguruji.com और आधिकारिक वेबसाइट पर विजिट करें।</p>",
      date: "2025-05-12T10:30:00",
      formattedDate: "12 मई 2025",
      featuredImageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&auto=format&fit=crop&q=80",
      categoryName: "Govt Job",
      authorName: "NS Guruji Team",
      originalUrl: "https://nsguruji.com"
    },
    {
      id: 102,
      title: "PM Kisan 19th Installment 2025: पीएम किसान सम्मान निधि की 19वीं किस्त जारी, किसानों के खाते में ₹2000 ट्रांसफर",
      excerpt: "प्रधानमंत्री किसान सम्मान निधि योजना के तहत 19वीं किस्त का पैसा सीधे बैंक खाते में DBT के माध्यम से ट्रांसफर कर दिया गया है...",
      content: "<p>केंद्र सरकार द्वारा देश के करोड़ों किसानों के बैंक खातों में प्रधानमंत्री किसान सम्मान निधि योजना की 19वीं किस्त की राशि 2000 रुपये हस्तांतरित कर दी गई है।</p><h3>ई-केवाईसी और बैंक स्थिति की जांच</h3><p>जिन किसानों ने अपनी e-KYC प्रक्रिया पूर्ण कर ली है और जिनका बैंक खाता आधार से लिंक है, केवल उन्हीं के खाते में राशि क्रेडिट हुई है। आप PM Kisan पोर्टल पर जाकर अपना स्टेटस चेक कर सकते हैं।</p>",
      date: "2025-05-11T14:15:00",
      formattedDate: "11 मई 2025",
      featuredImageUrl: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=800&auto=format&fit=crop&q=80",
      categoryName: "Govt Schemes",
      authorName: "NS Guruji Team",
      originalUrl: "https://nsguruji.com"
    },
    {
      id: 103,
      title: "REET 2025 Notification: राजस्थान शिक्षक पात्रता परीक्षा रीट 2025 का विस्तृत नोटिफिकेशन, ऑनलाइन आवेदन शुरू",
      excerpt: "राजस्थान माध्यमिक शिक्षा बोर्ड द्वारा रीट 2025 का विज्ञापन जारी कर दिया गया है। प्राथमिक एवं उच्च प्राथमिक शिक्षकों के पदों हेतु आवेदन आमंत्रित हैं...",
      content: "<p>राजस्थान में शिक्षक बनने का सपना देख रहे युवाओं के लिए बड़ी खुशखबरी है। माध्यमिक शिक्षा बोर्ड राजस्थान (BSER) ने राजस्थान शिक्षक पात्रता परीक्षा (REET) का विस्तृत विज्ञापन जारी कर दिया है।</p><h3>शैक्षणिक योग्यता व चयन प्रक्रिया</h3><p>लेवल-1 (कक्षा 1 से 5) तथा लेवल-2 (कक्षा 6 से 8) के लिए निर्धारित न्यूनतम योग्यताधारी अभ्यर्थी ऑनलाइन पोर्टल पर जाकर आवेदन कर सकते हैं।</p>",
      date: "2025-05-10T09:00:00",
      formattedDate: "10 मई 2025",
      featuredImageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
      categoryName: "Latest Updates",
      authorName: "NS Guruji Team",
      originalUrl: "https://nsguruji.com"
    },
    {
      id: 104,
      title: "SSC GD Constable Final Result 2025: एसएससी जीडी कांस्टेबल अंतिम परीक्षा परिणाम घोषित, स्टेट वाइज कट ऑफ देखें",
      excerpt: "कर्मचारी चयन आयोग (SSC) ने सीएपीएफ, एनआईए, एसएसएफ और असम राइफल्स में कांस्टेबल भर्ती का फाइनल रिजल्ट जारी कर दिया है...",
      content: "<p>कर्मचारी चयन आयोग (SSC) द्वारा आयोजित GD कांस्टेबल भर्ती के विभिन्न अर्धसैनिक बलों (BSF, CISF, CRPF, SSB, ITBP, AR) के रिक्त पदों हेतु अंतिम चयन सूची जारी कर दी गई है।</p>",
      date: "2025-05-09T18:45:00",
      formattedDate: "09 मई 2025",
      featuredImageUrl: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&auto=format&fit=crop&q=80",
      categoryName: "Results",
      authorName: "NS Guruji Team",
      originalUrl: "https://nsguruji.com"
    }
  ];

  const sampleCategories: CategoryItem[] = [
    { id: 1, name: "Govt Job", count: 120 },
    { id: 2, name: "Latest Updates", count: 95 },
    { id: 3, name: "Govt Schemes", count: 64 },
    { id: 4, name: "Results", count: 88 },
    { id: 5, name: "Admit Card", count: 52 },
    { id: 6, name: "Financial News", count: 40 }
  ];

  // Splash Screen timeout
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setCurrentRoute('home');
    }, 1600);
    return () => clearTimeout(splashTimer);
  }, []);

  // Fetch Articles from nsguruji.com
  const fetchArticles = async () => {
    if (simulateOffline) {
      setErrorMessage("इंटरनेट कनेक्शन उपलब्ध नहीं है");
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const url = selectedCategoryId
        ? `https://nsguruji.com/wp-json/wp/v2/posts?categories=${selectedCategoryId}&per_page=15&_embed`
        : `https://nsguruji.com/wp-json/wp/v2/posts?per_page=15&_embed`;

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      if (Array.isArray(data) && data.length > 0) {
        const parsed: Article[] = data.map((item: any) => {
          let img: string | null = null;
          try {
            img = item._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
                  item.featured_media_src_url || null;
          } catch (e) {
            img = null;
          }

          let category = "ताज़ा खबर";
          try {
            const termList = item._embedded?.['wp:term']?.[0];
            if (Array.isArray(termList) && termList.length > 0) {
              category = termList[0].name;
            }
          } catch (e) {
            category = "ताज़ा खबर";
          }

          const rawDate = item.date || new Date().toISOString();
          const d = new Date(rawDate);
          const formatted = `${d.getDate()} ${d.toLocaleString('hi-IN', { month: 'short' })} ${d.getFullYear()}`;

          return {
            id: item.id,
            title: item.title?.rendered?.replace(/&[#\w]+;/g, ' ') || "शीर्षक उपलब्ध नहीं",
            excerpt: item.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim() || "",
            content: item.content?.rendered || "",
            date: rawDate,
            formattedDate: formatted,
            featuredImageUrl: img,
            categoryName: category,
            authorName: "NS Guruji",
            originalUrl: item.link || "https://nsguruji.com"
          };
        });

        setArticles(parsed);
      } else {
        setArticles(sampleArticles);
      }
    } catch (err) {
      console.warn("Using sample backup for preview:", err);
      setArticles(sampleArticles);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch Categories from nsguruji.com
  const fetchCategories = async () => {
    try {
      const res = await fetch("https://nsguruji.com/wp-json/wp/v2/categories?per_page=12");
      if (res.ok) {
        const cats = await res.json();
        if (Array.isArray(cats) && cats.length > 0) {
          setCategories(cats.map((c: any) => ({
            id: c.id,
            name: c.name,
            count: c.count
          })));
          return;
        }
      }
    } catch (e) {
      // ignore
    }
    setCategories(sampleCategories);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategoryId, simulateOffline]);

  // Handle Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`https://nsguruji.com/wp-json/wp/v2/posts?search=${encodeURIComponent(searchQuery)}&per_page=10&_embed`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const parsed = data.map((item: any) => {
              const d = new Date(item.date || Date.now());
              return {
                id: item.id,
                title: item.title?.rendered?.replace(/&[#\w]+;/g, ' ') || "शीर्षक",
                excerpt: item.excerpt?.rendered?.replace(/<[^>]*>/g, '').trim() || "",
                content: item.content?.rendered || "",
                date: item.date || "",
                formattedDate: `${d.getDate()} ${d.toLocaleString('hi-IN', { month: 'short' })} ${d.getFullYear()}`,
                featuredImageUrl: item._embedded?.['wp:featuredmedia']?.[0]?.source_url || null,
                categoryName: "खोज परिणाम",
                authorName: "NS Guruji",
                originalUrl: item.link || "https://nsguruji.com"
              };
            });
            setSearchResults(parsed);
          }
        }
      } catch (e) {
        setSearchResults(articles.filter(a => a.title.toLowerCase().includes(searchQuery.toLowerCase())));
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click Article handler with AdMob Frequency Cap
  const handleArticleClick = (article: Article) => {
    const nextCount = readCount + 1;
    setReadCount(nextCount);
    onArticleReadCountChange(nextCount);

    // Every 3rd article triggers the AdMob Interstitial
    if (nextCount % 3 === 0) {
      setPendingArticle(article);
      setShowInterstitial(true);
    } else {
      setSelectedArticle(article);
      setCurrentRoute('detail');
    }
  };

  const handleCloseInterstitial = () => {
    setShowInterstitial(false);
    if (pendingArticle) {
      setSelectedArticle(pendingArticle);
      setCurrentRoute('detail');
      setPendingArticle(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full py-2">
      {/* Simulation Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 w-full max-w-[390px] mb-3 px-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-700 font-bold">Android Device Simulator</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
            Read: {readCount} (Ad @ 3)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSimulateOffline(!simulateOffline)}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-semibold transition ${
              simulateOffline
                ? 'bg-red-100 text-red-700 border border-red-200'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
            title="Toggle offline error screen test"
          >
            <WifiOff className="w-3 h-3" />
            {simulateOffline ? 'Offline' : 'Online'}
          </button>

          <button
            onClick={() => {
              setIsRefreshing(true);
              fetchArticles();
            }}
            disabled={isRefreshing}
            className="p-1.5 rounded-full bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Android Device Bezel */}
      <div className="relative w-[380px] h-[750px] bg-slate-900 rounded-[44px] p-2.5 shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-600/30 flex flex-col overflow-hidden select-none">
        {/* Screen Glass Area */}
        <div className="relative flex-1 w-full bg-slate-50 rounded-[34px] overflow-hidden flex flex-col shadow-inner">
          {/* Punch Hole Camera & Status Bar */}
          <div className="h-7 w-full bg-slate-900 flex items-center justify-between px-6 text-[10px] text-slate-300 font-medium z-30 shrink-0">
            <span>10:30</span>
            <div className="w-3 h-3 rounded-full bg-slate-950 border border-slate-700" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <div className="w-4 h-2 border border-slate-400 rounded-xs p-0.5">
                <div className="h-full w-3/4 bg-slate-400 rounded-2xs" />
              </div>
            </div>
          </div>

          {/* SCREEN ROUTER */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* SPLASH SCREEN */}
            {currentRoute === 'splash' && (
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900 to-slate-900 flex flex-col items-center justify-center text-white p-6 z-40">
                <div className="w-20 h-20 bg-red-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl mb-4 animate-in zoom-in-75 duration-700">
                  NS
                </div>
                <h1 className="text-2xl font-black tracking-wide text-white mb-1">NS Guruji</h1>
                <p className="text-xs text-blue-200 font-medium mb-4">शिक्षा एवं रोजगार का विश्वसनीय मंच</p>
                <div className="w-10 h-1 bg-red-600 rounded-full animate-pulse" />
              </div>
            )}

            {/* HOME SCREEN */}
            {currentRoute === 'home' && (
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                {/* Top App Bar */}
                <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-xs">
                      NS
                    </div>
                    <div>
                      <h2 className="font-bold text-sm text-blue-900 leading-tight">NS Guruji</h2>
                      <p className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold">Education & News</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setCurrentRoute('search')}
                    className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    title="Search News"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>

                {/* Horizontal Categories */}
                <div className="bg-white px-3 py-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none">
                  <button
                    onClick={() => setSelectedCategoryId(null)}
                    className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium transition ${
                      selectedCategoryId === null
                        ? 'bg-red-600 text-white font-bold shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Latest
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategoryId(cat.id)}
                      className={`px-3 py-1 rounded-full text-xs whitespace-nowrap font-medium transition ${
                        selectedCategoryId === cat.id
                          ? 'bg-red-600 text-white font-bold shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Main Articles Scrollable Feed */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {/* Internet Error State */}
                  {errorMessage ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-center px-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                      <WifiOff className="w-12 h-12 text-slate-400 mb-3" />
                      <h3 className="text-base font-bold text-slate-800 mb-1">इंटरनेट कनेक्शन उपलब्ध नहीं है</h3>
                      <p className="text-xs text-slate-500 mb-4 max-w-[220px]">
                        कृपया अपना डेटा कनेक्शन जांचें और पुनः प्रयास करें।
                      </p>
                      <button
                        onClick={() => {
                          setSimulateOffline(false);
                          fetchArticles();
                        }}
                        className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-full flex items-center gap-1.5 transition shadow-sm"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        पुनः प्रयास करें
                      </button>
                    </div>
                  ) : isLoading ? (
                    /* Shimmer Loaders */
                    <div className="space-y-3 animate-pulse">
                      <div className="w-full h-44 bg-slate-200 rounded-3xl" />
                      <div className="flex gap-3 bg-white border border-slate-200 p-3 rounded-2xl">
                        <div className="w-20 h-20 bg-slate-200 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="w-16 h-3 bg-slate-200 rounded" />
                          <div className="w-full h-3 bg-slate-200 rounded" />
                          <div className="w-2/3 h-3 bg-slate-200 rounded" />
                        </div>
                      </div>
                      <div className="flex gap-3 bg-white border border-slate-200 p-3 rounded-2xl">
                        <div className="w-20 h-20 bg-slate-200 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2 py-1">
                          <div className="w-16 h-3 bg-slate-200 rounded" />
                          <div className="w-full h-3 bg-slate-200 rounded" />
                          <div className="w-2/3 h-3 bg-slate-200 rounded" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Featured Hero Article */}
                      {articles[0] && (
                        <div
                          onClick={() => handleArticleClick(articles[0])}
                          className="group relative w-full h-48 rounded-3xl overflow-hidden cursor-pointer shadow-sm bg-slate-900 shrink-0 border border-slate-200"
                        >
                          <img
                            src={articles[0].featuredImageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800"}
                            alt={articles[0].title}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
                            <span className="self-start px-2.5 py-0.5 rounded-full bg-red-600 text-white font-bold text-[10px] uppercase tracking-wider mb-1.5 shadow-sm">
                              {articles[0].categoryName}
                            </span>
                            <h2 className="text-sm font-bold text-white leading-snug line-clamp-2 drop-shadow-sm mb-1">
                              {articles[0].title}
                            </h2>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{articles[0].formattedDate}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Section Title */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">ताज़ा खबरें</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">Latest Updates</span>
                      </div>

                      {/* Remaining Articles List (Bento Tile Cards) */}
                      {articles.slice(1).map(article => (
                        <div
                          key={article.id}
                          onClick={() => handleArticleClick(article)}
                          className="flex items-center gap-3 p-3 bg-white hover:bg-slate-50/90 rounded-2xl border border-slate-200 cursor-pointer transition shadow-2xs group"
                        >
                          <img
                            src={article.featuredImageUrl || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400"}
                            alt={article.title}
                            className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100 group-hover:scale-102 transition"
                          />
                          <div className="flex-1 flex flex-col justify-between py-0.5 overflow-hidden">
                            <div>
                              <span className="inline-block text-[10px] font-bold uppercase tracking-wide text-red-600 mb-0.5">
                                {article.categoryName}
                              </span>
                              <h3 className="text-xs font-bold text-slate-800 group-hover:text-blue-900 line-clamp-2 leading-snug">
                                {article.title}
                              </h3>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1">
                              <Calendar className="w-2.5 h-2.5 text-slate-400" />
                              <span>{article.formattedDate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                {/* Bottom AdMob Banner View */}
                <AdMobBannerMock />
              </div>
            )}

            {/* SEARCH SCREEN */}
            {currentRoute === 'search' && (
              <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
                {/* Search Bar */}
                <div className="bg-white border-b border-slate-200 px-3 py-2 flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setCurrentRoute('home')}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-700"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="खबरें, रिजल्ट, एडमिट कार्ड खोजें..."
                    autoFocus
                    className="flex-1 bg-transparent text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-red-600 font-semibold px-1"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Search Content */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-10 text-slate-500 text-xs gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                      <span>nsguruji.com पर खोज रहे हैं...</span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <>
                      <div className="text-[11px] font-semibold text-slate-600 mb-1">
                        कुल {searchResults.length} परिणाम मिले:
                      </div>
                      {searchResults.map(res => (
                        <div
                          key={res.id}
                          onClick={() => handleArticleClick(res)}
                          className="flex gap-2.5 p-2.5 bg-white rounded-2xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition shadow-2xs"
                        >
                          <img
                            src={res.featuredImageUrl || "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=400"}
                            alt={res.title}
                            className="w-20 h-16 rounded-xl object-cover bg-slate-100 shrink-0 border border-slate-100"
                          />
                          <div className="flex-1 flex flex-col justify-between py-0.5">
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                              {res.title}
                            </h4>
                            <span className="text-[10px] text-slate-500">{res.formattedDate}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  ) : searchQuery.trim() ? (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      कोई परिणाम नहीं मिला। कृपया कोई अन्य शब्द लिखकर खोजें।
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-500 text-xs">
                      सरकारी नौकरी, एडमिट कार्ड, रिजल्ट और योजनाएं खोजें
                    </div>
                  )}
                </div>

                <AdMobBannerMock />
              </div>
            )}

            {/* ARTICLE DETAIL SCREEN */}
            {currentRoute === 'detail' && selectedArticle && (
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* Detail App Bar */}
                <div className="bg-white border-b border-slate-200 px-3 py-2 flex items-center justify-between shrink-0 shadow-2xs">
                  <button
                    onClick={() => setCurrentRoute('home')}
                    className="p-1 rounded-full hover:bg-slate-100 text-slate-700 flex items-center gap-1 text-xs font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>वापस</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: selectedArticle.title,
                            url: selectedArticle.originalUrl
                          }).catch(() => {});
                        } else {
                          window.open(selectedArticle.originalUrl, '_blank');
                        }
                      }}
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition"
                      title="Share Article"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <a
                      href={selectedArticle.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition"
                      title="Open in Browser"
                    >
                      <Globe className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Article Reader Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 text-slate-800">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200/60 text-[10px] font-bold uppercase tracking-wider">
                    {selectedArticle.categoryName}
                  </span>

                  <h1 className="text-base font-bold text-blue-900 leading-snug">
                    {selectedArticle.title}
                  </h1>

                  <div className="flex items-center gap-3 text-[11px] text-slate-500 border-b border-slate-100 pb-2">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {selectedArticle.authorName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {selectedArticle.formattedDate}
                    </span>
                  </div>

                  {selectedArticle.featuredImageUrl && (
                    <img
                      src={selectedArticle.featuredImageUrl}
                      alt={selectedArticle.title}
                      className="w-full rounded-2xl object-cover shadow-sm border border-slate-200 my-2"
                    />
                  )}

                  {/* Rendered HTML article body */}
                  <div
                    className="text-xs leading-relaxed text-slate-700 space-y-2.5 font-sans"
                    dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                  />

                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: selectedArticle.title,
                            url: selectedArticle.originalUrl
                          }).catch(() => {});
                        } else {
                          window.open(selectedArticle.originalUrl, '_blank');
                        }
                      }}
                      className="py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      शेयर करें
                    </button>

                    <a
                      href={selectedArticle.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      वेबसाइट पर देखें
                    </a>
                  </div>
                </div>

                <AdMobBannerMock />
              </div>
            )}

            {/* ADMOB INTERSTITIAL TEST OVERLAY */}
            {(showInterstitial || showInterstitialDirectly) && (
              <AdMobInterstitialMock
                onClose={() => {
                  if (showInterstitialDirectly) {
                    onDismissInterstitialDirectly();
                  } else {
                    handleCloseInterstitial();
                  }
                }}
              />
            )}
          </div>

          {/* Android Home Navigation Gesture Bar */}
          <div className="h-4 w-full bg-slate-950 flex items-center justify-center shrink-0">
            <div className="w-24 h-1 bg-slate-600/70 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
