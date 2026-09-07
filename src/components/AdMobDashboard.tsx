import React from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, Smartphone, Layers, PlayCircle } from 'lucide-react';

interface AdMobDashboardProps {
  onTriggerTestInterstitial: () => void;
  interstitialCount: number;
}

export const AdMobDashboard: React.FC<AdMobDashboardProps> = ({
  onTriggerTestInterstitial,
  interstitialCount
}) => {
  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-900" />
            </div>
            <div>
              <h2 className="text-base font-bold text-blue-900">Google Mobile Ads (AdMob) Integration Status</h2>
              <p className="text-xs text-slate-500">
                Correctly configured in AndroidManifest.xml, build.gradle.kts, and AdManager.kt
              </p>
            </div>
          </div>

          <button
            onClick={onTriggerTestInterstitial}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full text-xs shadow-sm transition"
          >
            <PlayCircle className="w-4 h-4" />
            Simulate AdMob Interstitial
          </button>
        </div>
      </div>

      {/* Configuration Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* App ID */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AdMob App ID</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Verified
            </span>
          </div>
          <p className="font-mono text-xs text-slate-900 font-semibold break-all bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-2">
            ca-app-pub-3784953261980933~6912378306
          </p>
          <p className="text-[11px] text-slate-500">
            Declared in <code className="text-blue-900 font-mono font-semibold">AndroidManifest.xml</code> under <code className="text-slate-700">com.google.android.gms.ads.APPLICATION_ID</code>.
          </p>
        </div>

        {/* Banner Unit */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Banner Ad Unit</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Home & Detail Bottom
            </span>
          </div>
          <p className="font-mono text-xs text-blue-900 font-semibold break-all bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-2">
            ca-app-pub-3784953261980933/4286214969
          </p>
          <p className="text-[11px] text-slate-500">
            Rendered using Jetpack Compose <code className="text-blue-900 font-mono font-semibold">AdBannerView</code> with standard 320x50 AdSize.
          </p>
        </div>

        {/* Interstitial Unit */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interstitial Ad Unit</span>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Frequency Capped
            </span>
          </div>
          <p className="font-mono text-xs text-purple-900 font-semibold break-all bg-slate-50 p-2.5 rounded-xl border border-slate-200 mb-2">
            ca-app-pub-3784953261980933/6654086959
          </p>
          <p className="text-[11px] text-slate-500">
            Preloads in background. Shows every 3rd article opening. Never on startup.
          </p>
        </div>
      </div>

      {/* Policy Compliance Checklist */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Google AdMob Policy & Best Practice Compliance
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block">Safe Development Test IDs</strong>
              <span className="text-slate-600">
                Debug builds use Google's official test ad units automatically via <code className="text-blue-900 font-mono font-semibold">BuildConfig.USE_TEST_ADS</code>, ensuring your account is never suspended for self-impressions.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block">Sensible Frequency Capping</strong>
              <span className="text-slate-600">
                Current read counter: <span className="text-red-600 font-bold">{interstitialCount} articles read</span>. Interstitial ad only presents at natural reading breaks every 3rd click.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block">Non-Obtrusive Banner Placement</strong>
              <span className="text-slate-600">
                Fixed to bottom scaffold dock with safe area insets; never obscures text content, buttons, or navigation tabs.
              </span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block">Asynchronous Background Preloading</strong>
              <span className="text-slate-600">
                SDK initialized in background coroutine on Application start; next ad preloads immediately after current ad is dismissed.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
