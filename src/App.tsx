import React, { useState } from 'react';
import { ViewTab } from './types';
import { AndroidDeviceSimulator } from './components/AndroidDeviceSimulator';
import { SourceCodeViewer } from './components/SourceCodeViewer';
import { AdMobDashboard } from './components/AdMobDashboard';
import { 
  Smartphone, Code, Shield, BookOpen, Download, ExternalLink, 
  CheckCircle2, Layers, Cpu, Globe, ArrowUpRight, Terminal
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ViewTab>('preview');
  const [interstitialReadCount, setInterstitialReadCount] = useState(0);
  const [showTestInterstitial, setShowTestInterstitial] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans selection:bg-red-600 selection:text-white">
      {/* Top Navigation Header */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* App Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white font-bold text-base shadow-sm">
              NS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-blue-900">
                  NS Guruji
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                  Android Native
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Compose M3
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <span>Official News App for</span>
                <a
                  href="https://nsguruji.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:text-red-700 font-semibold inline-flex items-center gap-0.5"
                >
                  nsguruji.com <ArrowUpRight className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>

          {/* Quick Action Download */}
          <div className="flex items-center gap-2">
            <a
              href="/ns-guruji-android-source.zip"
              download="ns-guruji-android-source.zip"
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold shadow-sm transition"
            >
              <Download className="w-4 h-4" />
              <span>Download Project (.ZIP)</span>
            </a>
          </div>
        </div>

        {/* Tab Navigation (Bento Pill Bar) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1.5 border-t border-slate-100 py-1.5 text-xs sm:text-sm overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 py-2 px-3.5 font-semibold rounded-xl transition ${
              activeTab === 'preview'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Interactive Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-2 py-2 px-3.5 font-semibold rounded-xl transition ${
              activeTab === 'code'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Code className="w-4 h-4" />
            <span>Source Code (56 Files)</span>
          </button>

          <button
            onClick={() => setActiveTab('admob')}
            className={`flex items-center gap-2 py-2 px-3.5 font-semibold rounded-xl transition ${
              activeTab === 'admob'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>AdMob Monetization</span>
          </button>

          <button
            onClick={() => setActiveTab('docs')}
            className={`flex items-center gap-2 py-2 px-3.5 font-semibold rounded-xl transition ${
              activeTab === 'docs'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Architecture & Setup</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: INTERACTIVE ANDROID SIMULATOR */}
        {activeTab === 'preview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Device Simulator */}
            <div className="lg:col-span-6 flex justify-center">
              <AndroidDeviceSimulator
                onArticleReadCountChange={setInterstitialReadCount}
                showInterstitialDirectly={showTestInterstitial}
                onDismissInterstitialDirectly={() => setShowTestInterstitial(false)}
              />
            </div>

            {/* Right: Feature Highlights & Interactive Testing (Bento Stack) */}
            <div className="lg:col-span-6 space-y-4 text-xs sm:text-sm">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <h2 className="text-base font-bold text-blue-900 mb-1.5 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Live Android Application Specifications
                </h2>
                <p className="text-slate-500 text-xs mb-4">
                  Engineered strictly as a production-grade native Android project using Jetpack Compose, Kotlin coroutines, and Material 3 design tokens.
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wide">App Purpose</span>
                    <strong className="text-slate-900">NS Guruji News & Education</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wide">Authentication</span>
                    <strong className="text-emerald-600">100% Zero Login Required</strong>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wide">Package Name</span>
                    <code className="text-blue-900 font-mono text-[11px] font-semibold">com.nsguruji.app</code>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wide">Target SDK</span>
                    <strong className="text-slate-900">Android 14 / 15 (SDK 34/35)</strong>
                  </div>
                </div>
              </div>

              {/* AdMob Quick Action in Simulator */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-50 via-white to-slate-50 border border-blue-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                    Smart AdMob Frequency Cap
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-blue-100 text-blue-800 font-bold">
                    Articles Read: {interstitialReadCount}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                  In strict compliance with Google AdMob policy, interstitial ads only appear every <strong>3rd article read</strong>, never at app launch or without user intent.
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setShowTestInterstitial(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold shadow-sm transition"
                  >
                    Simulate Interstitial Ad Now
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-full text-xs font-semibold border border-slate-200 transition"
                  >
                    View AdManager.kt
                  </button>
                </div>
              </div>

              {/* Core Features Tested */}
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2.5 text-xs">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                  Included Native Components
                </h3>
                <div className="space-y-2 text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    <span><strong className="text-slate-900">WordPress REST API:</strong> Live JSON deserialization with Retrofit & OkHttp</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    <span><strong className="text-slate-900">RSS Fallback:</strong> XML PullParser for /feed/ if REST is ever blocked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    <span><strong className="text-slate-900">Dynamic Categories:</strong> Govt Job, Schemes, Results, Admit Card, etc.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    <span><strong className="text-slate-900">Hindi Typography:</strong> Devanagari font scaling & HTML body formatting</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    <span><strong className="text-slate-900">Pull-to-Refresh & Shimmer:</strong> Animated skeleton loaders</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-600" />
                    <span><strong className="text-slate-900">Offline Error Handler:</strong> "इंटरनेट कनेक्शन उपलब्ध नहीं है" + retry button</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SOURCE CODE EXPLORER */}
        {activeTab === 'code' && (
          <SourceCodeViewer />
        )}

        {/* TAB 3: ADMOB MONETIZATION DASHBOARD */}
        {activeTab === 'admob' && (
          <AdMobDashboard
            onTriggerTestInterstitial={() => {
              setShowTestInterstitial(true);
              setActiveTab('preview');
            }}
            interstitialCount={interstitialReadCount}
          />
        )}

        {/* TAB 4: ARCHITECTURE & BUILD GUIDE */}
        {activeTab === 'docs' && (
          <div className="space-y-6 text-slate-800 text-xs sm:text-sm">
            {/* Architecture Overview */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-blue-900 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-600" />
                Modern Android MVVM Clean Architecture
              </h2>
              <p className="text-slate-600 leading-relaxed">
                The codebase follows Android's recommended Modern App Architecture guidelines:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <strong className="text-blue-900 block mb-1">1. UI Layer (Compose)</strong>
                  <p className="text-slate-500">
                    Declarative Jetpack Compose UI with <code className="text-slate-700">Material 3</code> tokens, Scaffold, TopAppBar, LazyColumn, and SubcomposeAsyncImage (Coil).
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <strong className="text-emerald-700 block mb-1">2. ViewModel Layer</strong>
                  <p className="text-slate-500">
                    <code className="text-slate-700">HomeViewModel</code>, <code className="text-slate-700">ArticleDetailViewModel</code>, and <code className="text-slate-700">SearchViewModel</code> exposing immutable StateFlow to the UI.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <strong className="text-purple-700 block mb-1">3. Repository Layer</strong>
                  <p className="text-slate-500">
                    <code className="text-slate-700">NewsRepositoryImpl</code> coordinates in-memory caching, offline HTTP cache, and RSS fallback.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <strong className="text-red-700 block mb-1">4. Ads & Lifecycle</strong>
                  <p className="text-slate-500">
                    <code className="text-slate-700">AdManager</code> manages preloading, memory lifecycle, and frequency capping of Google Mobile Ads.
                  </p>
                </div>
              </div>
            </div>

            {/* Build & Run Commands */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-600" />
                Build Instructions for Android Studio
              </h3>

              <div className="bg-slate-900 p-4 rounded-2xl font-mono text-xs text-slate-200 space-y-2 shadow-inner">
                <p className="text-slate-400"># 1. Open the project in Android Studio (Ladybug / Koala 2024.1+)</p>
                <p className="text-blue-300">File &gt; Open... &gt; select the `android/` directory</p>
                <p className="text-slate-400 mt-2"># 2. Build Debug APK directly</p>
                <p className="text-emerald-400">./gradlew assembleDebug</p>
                <p className="text-slate-400 mt-2"># 3. Build Production Signed APK</p>
                <p className="text-emerald-400">./gradlew assembleRelease</p>
                <p className="text-slate-400 mt-2"># 4. Generate Google Play App Bundle (.aab)</p>
                <p className="text-emerald-400">./gradlew bundleRelease</p>
              </div>
            </div>

            {/* Package File Inventory */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-600" />
                Project File Inventory (100% Included, No Placeholders)
              </h3>
              <p className="text-xs text-slate-500">
                All 56 files exist in the file tree and can be built immediately:
              </p>
              <ul className="list-disc list-inside text-xs text-slate-600 space-y-1.5">
                <li><code className="font-mono text-blue-900 font-semibold">android/app/src/main/AndroidManifest.xml</code> - Permissions & AdMob App ID</li>
                <li><code className="font-mono text-blue-900 font-semibold">android/app/build.gradle.kts</code> & <code className="font-mono text-blue-900 font-semibold">gradle/libs.versions.toml</code> - Modern Gradle Version Catalog</li>
                <li><code className="font-mono text-blue-900 font-semibold">android/app/src/main/java/com/nsguruji/app/MainActivity.kt</code> - Compose Entry Point</li>
                <li><code className="font-mono text-blue-900 font-semibold">android/app/src/main/java/com/nsguruji/app/NSGurujiApp.kt</code> - Mobile Ads SDK Init</li>
                <li><code className="font-mono text-blue-900 font-semibold">android/app/src/main/java/com/nsguruji/app/ads/AdManager.kt</code> - Frequency Capper</li>
                <li><code className="font-mono text-blue-900 font-semibold">android/app/src/main/java/com/nsguruji/app/data/api/WordPressApiService.kt</code> - Retrofit REST API</li>
                <li><code className="font-mono text-blue-900 font-semibold">android/app/src/main/java/com/nsguruji/app/ui/screens/HomeScreen.kt</code> - News Feed with Pull-To-Refresh</li>
                <li><code className="font-mono text-blue-900 font-semibold">android/app/src/main/java/com/nsguruji/app/ui/screens/ArticleDetailScreen.kt</code> - HTML Reader with Share Sheet</li>
                <li><code className="font-mono text-blue-900 font-semibold">android/app/src/main/java/com/nsguruji/app/ui/screens/SearchScreen.kt</code> - Debounced Search</li>
              </ul>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <p>NS Guruji Native Android Application • Built for nsguruji.com • 100% Kotlin & Jetpack Compose</p>
      </footer>
    </div>
  );
}
