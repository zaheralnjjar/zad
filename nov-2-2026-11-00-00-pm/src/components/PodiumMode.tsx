import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronsDown, 
  Clock, 
  Sun, 
  Moon,
  ChevronRight,
  ChevronLeft,
  ListOrdered
} from 'lucide-react';
import { TopicOutline } from '../types';

interface PodiumModeProps {
  outlines: TopicOutline[] | null;
  initialIndex?: number;
  onClose: () => void;
}

export const PodiumMode: React.FC<PodiumModeProps> = ({ 
  outlines, 
  initialIndex = 0, 
  onClose 
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Font size multiplier
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('large');

  // Theme: light luxurious parchment vs night mihrab
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Timer: 3 minutes by default (180 seconds)
  const [secondsLeft, setSecondsLeft] = useState(180);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Auto-scroll
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Reset timer on outline switch
  useEffect(() => {
    setSecondsLeft(180);
    setIsTimerRunning(false);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [currentIndex]);

  // Timer effect
  useEffect(() => {
    let timer: any;
    if (isTimerRunning && secondsLeft > 0) {
      timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, secondsLeft]);

  // Auto-scroll effect
  useEffect(() => {
    let scrollInterval: any;
    if (isAutoScrolling && scrollContainerRef.current) {
      scrollInterval = setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollTop += 1;
        }
      }, 50);
    }
    return () => clearInterval(scrollInterval);
  }, [isAutoScrolling]);

  if (!outlines || outlines.length === 0) return null;

  const outline = outlines[currentIndex] || outlines[0];

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (secondsLeft <= 30) return 'text-rose-600 border-rose-400 bg-rose-50 animate-pulse';
    if (secondsLeft <= 60) return 'text-amber-700 border-amber-400 bg-amber-50';
    return theme === 'light' ? 'text-emerald-800 border-emerald-400 bg-emerald-50' : 'text-emerald-300 border-emerald-600 bg-emerald-950/40';
  };

  const fontClass = {
    normal: 'text-lg md:text-xl leading-relaxed',
    large: 'text-xl md:text-2xl leading-loose font-semibold',
    huge: 'text-2xl md:text-3xl leading-loose font-bold',
  }[fontSize];

  return (
    <div className={`fixed inset-0 z-50 flex flex-col select-none overflow-hidden animate-fade-in ${
      theme === 'light' ? 'bg-[#f8f5eb] text-[#1c2e27]' : 'bg-[#061510] text-slate-100'
    }`}>
      
      {/* Top Floating Control Bar */}
      <div className={`px-4 py-3 border-b flex items-center justify-between gap-3 flex-wrap ${
        theme === 'light' 
          ? 'bg-[#ede7d5]/95 border-amber-600/25 text-slate-800 shadow-sm' 
          : 'bg-[#0a1e17]/95 border-emerald-800/50 text-slate-100'
      }`}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping" />
            <h1 className="font-black font-kufi text-base md:text-lg text-emerald-950 line-clamp-1">
              وضع المنبر: {outline.title}
            </h1>
          </div>

          {/* Playlist Indicator if multiple topics */}
          {outlines.length > 1 && (
            <div className="flex items-center gap-1.5 bg-amber-500 text-slate-950 px-2.5 py-1 rounded-xl font-black text-xs shadow-2xs">
              <ListOrdered className="w-3.5 h-3.5" />
              <span>موضوع {currentIndex + 1} من {outlines.length}</span>
            </div>
          )}
        </div>

        {/* Center: Countdown Timer for delivery control */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-sm font-mono font-black ${getTimerColor()}`}>
            <Clock className="w-4 h-4" />
            <span>{formatTimer(secondsLeft)}</span>
          </div>

          <button
            onClick={() => setIsTimerRunning(!isTimerRunning)}
            className="p-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold cursor-pointer shadow-xs"
            title={isTimerRunning ? 'إيقاف مؤقت' : 'بدء المؤقت'}
          >
            {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setIsTimerRunning(false);
              setSecondsLeft(180);
            }}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-300 cursor-pointer shadow-xs"
            title="إعادة ضبط 3 دقائق"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Right Tools: Playlist navigation, Theme toggle, Font size, Auto scroll, Exit */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Multi-topic Previous / Next buttons */}
          {outlines.length > 1 && (
            <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-300 p-0.5 shadow-xs">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="p-1 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                title="الموضوع السابق"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                disabled={currentIndex === outlines.length - 1}
                onClick={() => setCurrentIndex((prev) => Math.min(outlines.length - 1, prev + 1))}
                className="p-1 rounded-lg text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                title="الموضوع التالي"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Light / Dark Mode Toggle */}
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 shadow-xs cursor-pointer"
            title={theme === 'light' ? 'التبديل إلى الوضع الليلي' : 'التبديل إلى الوضع الفاتح الفخم'}
          >
            {theme === 'light' ? <Moon className="w-4 h-4 text-emerald-800" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Auto Scroll */}
          <button
            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs ${
              isAutoScrolling 
                ? 'bg-amber-600 text-white' 
                : 'bg-emerald-800 text-white hover:bg-emerald-900'
            }`}
            title="تمرير الشاشة تلقائياً أثناء الحديث"
          >
            <ChevronsDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAutoScrolling ? 'إيقاف التمرير' : 'تمرير تلقائي'}</span>
          </button>

          {/* Font Controls */}
          <div className="flex items-center bg-white rounded-xl border border-slate-300 p-0.5 shadow-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 text-xs rounded-lg font-bold ${fontSize === 'normal' ? 'bg-emerald-800 text-white' : 'text-slate-600'}`}
            >
              عادي
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 text-xs rounded-lg font-bold ${fontSize === 'large' ? 'bg-emerald-800 text-white' : 'text-slate-600'}`}
            >
              كبير
            </button>
            <button
              onClick={() => setFontSize('huge')}
              className={`px-2 py-1 text-xs rounded-lg font-black ${fontSize === 'huge' ? 'bg-emerald-800 text-white' : 'text-slate-600'}`}
            >
              ضخم
            </button>
          </div>

          {/* Close / Exit Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white cursor-pointer shadow-xs"
            title="إنهاء وضع المنبر"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Prompter Text Scroll Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 md:px-12 py-8 max-w-4xl mx-auto w-full text-right space-y-8"
      >
        {/* Hook */}
        <div className={`p-5 rounded-2xl border-2 ${
          theme === 'light' ? 'bg-amber-50/80 border-amber-400 text-emerald-950 shadow-sm' : 'bg-amber-950/40 border-amber-500 text-amber-100'
        }`}>
          <span className="text-amber-800 font-black text-sm block mb-1">
            سؤال الافتتاح (شد انتباه المصلين):
          </span>
          <p className={`font-amiri font-bold ${fontClass}`}>
            "{outline.hookQuestion}"
          </p>
        </div>

        {/* Science curiosity if present */}
        {outline.scienceCuriosity && (
          <div className={`p-4 rounded-2xl border ${
            theme === 'light' ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-emerald-950/30 border-emerald-600 text-emerald-200'
          }`}>
            <span className="text-emerald-800 font-black text-sm block mb-1">
              ✨ لطيفة من علوم الدين:
            </span>
            <p className={`font-cairo font-semibold ${fontClass}`}>
              {outline.scienceCuriosity}
            </p>
          </div>
        )}

        {/* Intro */}
        {outline.introduction && (
          <div className={`p-4 rounded-2xl border ${
            theme === 'light' ? 'bg-white border-amber-600/20 text-slate-800 shadow-xs' : 'bg-black/30 border-emerald-900/40 text-gray-200'
          }`}>
            <p className={`${fontClass}`}>
              {outline.introduction}
            </p>
          </div>
        )}

        {/* Quran */}
        {outline.quranAyat && outline.quranAyat.length > 0 && (
          <div>
            <h2 className="text-emerald-900 font-black text-xl mb-3 flex items-center gap-2">
              <span>📖 من كتاب الله العزيز:</span>
            </h2>
            <div className="space-y-4">
              {outline.quranAyat.map((ayah, i) => (
                <div key={i} className={`p-5 rounded-2xl border-2 text-center ${
                  theme === 'light' ? 'bg-white border-amber-400 text-emerald-950 shadow-xs' : 'bg-emerald-950/40 border-emerald-600 text-amber-200'
                }`}>
                  <p className={`font-amiri font-black ${fontClass}`}>
                    {ayah.text}
                  </p>
                  <p className="text-xs text-slate-600 mt-2 font-mono font-bold">
                    [سورة {ayah.surah} : {ayah.ayahNumber}]
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hadith */}
        {outline.sahihHadiths && outline.sahihHadiths.length > 0 && (
          <div>
            <h2 className="text-emerald-900 font-black text-xl mb-3 flex items-center gap-2">
              <span>📜 من صحيح السنة النبوية:</span>
            </h2>
            <div className="space-y-4">
              {outline.sahihHadiths.map((h, i) => (
                <div key={i} className={`p-5 rounded-2xl border ${
                  theme === 'light' ? 'bg-white border-amber-600/25 text-emerald-950 shadow-xs' : 'bg-emerald-950/30 border-emerald-700 text-emerald-100'
                }`}>
                  <p className={`font-amiri font-bold ${fontClass}`}>
                    {h.matn}
                  </p>
                  <div className="mt-2 text-xs text-amber-800 font-bold">
                    ✓ {h.takhrij} {h.shamelaSource ? `[الشاملة: ${h.shamelaSource}]` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sahih Story */}
        {outline.sahihStory && (
          <div className={`p-5 rounded-2xl border-2 ${
            theme === 'light' ? 'bg-white border-amber-400 text-slate-800 shadow-xs' : 'bg-black/40 border-amber-600 text-gray-200'
          }`}>
            <h2 className="text-emerald-900 font-black text-lg mb-2">
              قصة وعبرة: {outline.sahihStory.title}
            </h2>
            <p className={`${fontClass}`}>
              {outline.sahihStory.storyText}
            </p>
            <p className="text-xs text-emerald-800 font-bold mt-2">
              التوثيق: {outline.sahihStory.authenticityNote}
            </p>
          </div>
        )}

        {/* Scholar Quotes */}
        {outline.scholarQuotes && outline.scholarQuotes.length > 0 && (
          <div className={`p-5 rounded-2xl border ${
            theme === 'light' ? 'bg-white border-amber-600/25 shadow-xs' : 'bg-emerald-950/20 border-emerald-800'
          }`}>
            <h2 className="text-emerald-900 font-black text-lg mb-2">
              من درر الفقهاء والعلماء:
            </h2>
            {outline.scholarQuotes.map((q, i) => (
              <div key={i} className="mb-3 last:mb-0">
                <p className={`font-amiri italic font-bold text-slate-800 ${fontClass}`}>
                  "{q.quote}"
                </p>
                <p className="text-xs text-amber-800 font-bold mt-1">
                  — {q.scholar} [{q.sourceBook}]
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Takeaways */}
        {outline.practicalTakeaways && outline.practicalTakeaways.length > 0 && (
          <div>
            <h2 className="text-emerald-900 font-black text-xl mb-3">
              🎯 الخلاصة والعمل:
            </h2>
            <ul className="space-y-3">
              {outline.practicalTakeaways.map((t, i) => (
                <li key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${
                  theme === 'light' ? 'bg-white border-amber-600/20 text-slate-800 shadow-xs' : 'bg-black/30 border-emerald-800 text-gray-100'
                } ${fontClass}`}>
                  <span className="w-8 h-8 rounded-full bg-emerald-800 text-white font-black text-sm flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Concluding Dua */}
        {outline.concludingDua && (
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white p-6 rounded-2xl text-center shadow-lg">
            <span className="text-amber-300 font-bold text-sm block mb-1">دعاء الختام:</span>
            <p className={`font-amiri font-bold ${fontClass}`}>
              "{outline.concludingDua}"
            </p>
          </div>
        )}

        <div className="h-20" />
      </div>

    </div>
  );
};
