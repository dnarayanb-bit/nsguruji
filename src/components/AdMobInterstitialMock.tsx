import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface AdMobInterstitialMockProps {
  onClose: () => Unit;
  unitId?: string;
  isTest?: boolean;
}

type Unit = () => void;

export const AdMobInterstitialMock: React.FC<AdMobInterstitialMockProps> = ({
  onClose,
  unitId = 'ca-app-pub-3784953261980933/6654086959',
  isTest = true
}) => {
  const [countdown, setCountdown] = useState(3);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanClose(true);
    }
  }, [countdown]);

  return (
    <div className="absolute inset-0 z-50 bg-slate-950 flex flex-col justify-between text-white p-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-6 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] rounded">
            AdMob Interstitial
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {isTest ? 'Official Google Test Ad' : 'Production Unit'}
          </span>
        </div>
        {canClose ? (
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
            title="Close Ad"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <span className="text-xs bg-slate-800 px-2 py-1 rounded text-slate-300 font-mono">
            Reward in {countdown}s
          </span>
        )}
      </div>

      {/* Main Ad Creative Mockup */}
      <div className="my-auto flex flex-col items-center text-center px-4">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-3xl font-extrabold shadow-xl shadow-blue-500/20 mb-4">
          NS
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          NS Guruji Mobile App
        </h3>
        <p className="text-xs text-slate-400 max-w-[260px] mb-4">
          राजस्थान एवं भारत की सभी सरकारी भर्तियाँ, रिजल्ट, एडमिट कार्ड व योजनाओं की ताज़ा अपडेट्स।
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-[11px] text-slate-400 font-mono text-left w-full mb-6">
          <p className="text-amber-400 font-semibold mb-1">AdMob Frequency Cap Triggered:</p>
          <p>• Displayed on natural 3rd article read</p>
          <p>• Ad Unit: {unitId}</p>
          <p>• Preloaded in background asynchronously</p>
        </div>

        <a
          href="https://nsguruji.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition"
        >
          Visit nsguruji.com <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Footer */}
      <div className="text-center py-2 text-[10px] text-slate-500">
        Google Mobile Ads SDK • Frequency-capped Android Interstitial
      </div>
    </div>
  );
};
