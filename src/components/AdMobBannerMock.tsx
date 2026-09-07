import React from 'react';

interface AdBannerMockProps {
  unitId?: string;
  isTest?: boolean;
}

export const AdMobBannerMock: React.FC<AdBannerMockProps> = ({
  unitId = 'ca-app-pub-3784953261980933/4286214969',
  isTest = true
}) => {
  return (
    <div className="w-full bg-slate-100 border-t border-slate-200 py-1.5 px-2 flex flex-col items-center justify-center shrink-0 z-10">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="text-[9px] font-bold px-1.5 py-0.5 bg-red-100 text-red-700 rounded-full uppercase tracking-wider">
          Advertisement
        </span>
        <span className="text-[9px] text-slate-500 font-mono">
          {isTest ? 'Test Mode 320x50' : 'Production'}
        </span>
      </div>
      <div className="w-full max-w-[320px] h-[48px] bg-white border border-slate-300 rounded-xl flex items-center justify-between px-3 text-xs text-slate-700 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-[11px]">
            Ad
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-slate-900 text-[11px] leading-tight">Google AdMob Banner</span>
            <span className="text-[9px] text-slate-500 truncate max-w-[140px] font-mono">{unitId}</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            window.open('https://nsguruji.com', '_blank');
          }}
          className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-[10px] font-bold transition shadow-xs"
        >
          Visit
        </button>
      </div>
    </div>
  );
};

