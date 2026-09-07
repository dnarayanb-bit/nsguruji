import React, { useState, useMemo } from 'react';
import { androidSourceFiles, AndroidSourceFile } from '../androidProjectFiles';
import { FileCode, Folder, Copy, Check, Download, Search, Terminal, Smartphone, Layers, Sparkles } from 'lucide-react';

export const SourceCodeViewer: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>(
    'app/src/main/java/com/nsguruji/app/MainActivity.kt'
  );
  const [searchFilter, setSearchFilter] = useState('');
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const selectedFile = useMemo(() => {
    return androidSourceFiles.find(f => f.path === selectedFilePath) || androidSourceFiles[0];
  }, [selectedFilePath]);

  const categorizedFiles = useMemo(() => {
    return androidSourceFiles.filter(file => {
      const matchesSearch = file.path.toLowerCase().includes(searchFilter.toLowerCase()) ||
                            file.name.toLowerCase().includes(searchFilter.toLowerCase());
      if (!matchesSearch) return false;

      if (activeCategory === 'all') return true;
      if (activeCategory === 'gradle') return file.path.includes('.gradle') || file.path.includes('.toml') || file.path.includes('.properties') || file.name === 'gradlew';
      if (activeCategory === 'manifest') return file.name.includes('AndroidManifest');
      if (activeCategory === 'ui') return file.path.includes('/ui/') || file.path.includes('/screens/') || file.path.includes('/components/');
      if (activeCategory === 'data') return file.path.includes('/data/') || file.path.includes('/api/') || file.path.includes('/model/') || file.path.includes('/repository/');
      if (activeCategory === 'ads') return file.path.includes('/ads/');
      if (activeCategory === 'res') return file.path.includes('/res/');
      return true;
    });
  }, [searchFilter, activeCategory]);

  const handleCopy = () => {
    if (!selectedFile) return;
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white text-slate-800 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-900 border border-blue-100 flex items-center justify-center font-bold">
            <Smartphone className="w-5 h-5 text-blue-900" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-blue-900 flex items-center gap-2">
              Android Studio Project Source Code
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200 font-mono font-bold">
                56 Files • Kotlin 2.0 • Compose
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Directly importable project structure for Android Studio Ladybug/Koala
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/ns-guruji-android-source.zip"
            download="ns-guruji-android-source.zip"
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full text-xs font-bold shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            Download Complete Project (.ZIP)
          </a>
        </div>
      </div>

      {/* Category Pill Filters */}
      <div className="flex items-center gap-1.5 px-5 py-2.5 bg-slate-50 border-b border-slate-200 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-xl font-medium transition ${activeCategory === 'all' ? 'bg-blue-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'}`}
        >
          All Files ({androidSourceFiles.length})
        </button>
        <button
          onClick={() => setActiveCategory('ui')}
          className={`px-3 py-1.5 rounded-xl font-medium transition ${activeCategory === 'ui' ? 'bg-blue-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'}`}
        >
          Compose UI & Screens
        </button>
        <button
          onClick={() => setActiveCategory('data')}
          className={`px-3 py-1.5 rounded-xl font-medium transition ${activeCategory === 'data' ? 'bg-blue-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'}`}
        >
          Data, API & Repository
        </button>
        <button
          onClick={() => setActiveCategory('ads')}
          className={`px-3 py-1.5 rounded-xl font-medium transition ${activeCategory === 'ads' ? 'bg-blue-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'}`}
        >
          AdMob Integration
        </button>
        <button
          onClick={() => setActiveCategory('gradle')}
          className={`px-3 py-1.5 rounded-xl font-medium transition ${activeCategory === 'gradle' ? 'bg-blue-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'}`}
        >
          Gradle & Config
        </button>
        <button
          onClick={() => setActiveCategory('res')}
          className={`px-3 py-1.5 rounded-xl font-medium transition ${activeCategory === 'res' ? 'bg-blue-900 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-white'}`}
        >
          XML Resources
        </button>
      </div>

      {/* Main Workspace: Left Sidebar File Tree + Right Code Viewer */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[460px]">
        {/* Left File List */}
        <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50/70 flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-200 bg-white">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                placeholder="Filter files..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[220px] md:max-h-none">
            {categorizedFiles.map(file => {
              const isSelected = file.path === selectedFile?.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center gap-2.5 transition ${
                    isSelected
                      ? 'bg-blue-50 text-blue-950 font-semibold border border-blue-200'
                      : 'text-slate-700 hover:bg-white hover:text-slate-900'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${
                    file.language === 'kotlin' ? 'text-red-600' :
                    file.language === 'xml' ? 'text-amber-600' :
                    file.language === 'toml' ? 'text-teal-600' : 'text-slate-500'
                  }`} />
                  <div className="truncate flex-1">
                    <span className="block truncate font-medium">{file.name}</span>
                    <span className="block text-[10px] text-slate-400 truncate font-mono">
                      {file.path}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
          {/* File Toolbar */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="font-mono text-slate-200 font-medium truncate">
                {selectedFile?.path}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 uppercase font-mono">
                {selectedFile?.language}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Code Content */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-slate-200 bg-slate-950">
            <pre className="whitespace-pre">
              {selectedFile?.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
