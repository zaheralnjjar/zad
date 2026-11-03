import React from 'react';
import { 
  Sparkles, 
  MapPin, 
  Mic, 
  ShieldCheck, 
  Settings, 
  Bookmark, 
  Clock, 
  Compass, 
  Bell,
  Volume2,
  Thermometer,
  BookOpen
} from 'lucide-react';
import { PrayerTime, PrayerKey } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { useWeatherCelsius } from '../hooks/useWeatherCelsius';

interface IslamicHeaderProps {
  currentPrayer: PrayerKey;
  nextPrayer: PrayerKey;
  minutesRemaining: number;
  prayerList: PrayerTime[];
  cityName: string;
  qiblaDegrees: number;
  latitude?: number;
  longitude?: number;
  isReminderActive: boolean;
  onOpenReminderModal: () => void;
  onOpenPermissions: () => void;
  onOpenSettings: () => void;
  onOpenHadithVerifier: () => void;
  onOpenAudioRehearsal: () => void;
  activeTab: 'all' | 'favorites' | 'history';
  setActiveTab: (tab: 'all' | 'favorites' | 'history') => void;
  favoritesCount: number;
}

export const IslamicHeader: React.FC<IslamicHeaderProps> = ({
  nextPrayer,
  minutesRemaining,
  prayerList,
  cityName,
  qiblaDegrees,
  latitude = 21.4225,
  longitude = 39.8262,
  isReminderActive,
  onOpenReminderModal,
  onOpenPermissions,
  onOpenSettings,
  onOpenHadithVerifier,
  onOpenAudioRehearsal,
  activeTab,
  setActiveTab,
  favoritesCount,
}) => {
  // Real-time Celsius temperature hook
  const { temperatureCelsius, conditionText } = useWeatherCelsius(latitude, longitude);

  const arabicPrayers: Record<string, string> = {
    fajr: 'الفجر',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    jumuah: 'الجمعة',
    all: 'الصلاة',
  };

  return (
    <header className="relative border-b border-[#DCD5C6] bg-[#FAF8F5] text-[#1A1A1A] select-none shadow-2xs">
      {/* Top subtle Kindle e-ink rule line */}
      <div className="h-0.5 bg-[#CEC5B4]" />

      {/* Main App Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-3 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand & Identity: Kindle book style */}
        <div className="flex items-center gap-2.5 sm:gap-3 text-right shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-[#242424] text-[#FAF8F5] border border-[#141414] shadow-2xs shrink-0">
            <BookOpen className="w-5 h-5 text-[#FAF8F5]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg md:text-xl font-bold font-kufi tracking-tight text-[#1A1A1A] leading-none">
                زاد الإمام والخطيب
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-bold text-[#454545] bg-[#EFE9DD] px-2 py-0.5 rounded border border-[#D5CCBC]">
                الشاملة والجامع
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#595959] font-medium hidden sm:block mt-0.5 font-cairo">
              دليل الكلمات والمواعظ بعد الصلوات · موثق أكاديمياً
            </p>
          </div>
        </div>

        {/* Center: Quiet next prayer info + Live Celsius Temperature (Desktop & Tablets) */}
        <div className="hidden lg:flex items-center gap-2.5 text-xs text-[#333333] bg-[#F2EDE2] px-3.5 py-1.5 rounded-lg border border-[#DCD5C6] font-medium">
          <Clock className="w-3.5 h-3.5 text-[#595959]" />
          <span>القادمة:</span>
          <strong className="text-[#1A1A1A] font-bold">{arabicPrayers[nextPrayer] || nextPrayer}</strong>
          <span className="text-[#8F8776]">·</span>
          <span className="text-[#1A1A1A] font-bold font-mono text-[11px]">
            خلال {minutesRemaining > 60 ? `${Math.floor(minutesRemaining / 60)} س و ${minutesRemaining % 60} د` : `${minutesRemaining} د`}
          </span>

          <span className="text-[#8F8776]">|</span>

          {/* Real Celsius Temperature Display */}
          <div 
            className="flex items-center gap-1 text-[#1A1A1A] font-semibold"
            title="درجة الحرارة الآن بالدرجة المئوية (Celsius)"
          >
            <Thermometer className="w-3.5 h-3.5 text-[#595959]" />
            <span className="font-mono text-xs">{temperatureCelsius}° م</span>
            <span className="text-[10px] text-[#706B5E]">({conditionText})</span>
          </div>

          <span className="text-[#8F8776]">|</span>

          {/* Location & Qibla Direction */}
          <button 
            onClick={onOpenPermissions}
            className="flex items-center gap-1 text-[#333333] hover:text-[#000000] cursor-pointer"
            title="موقع المسجد وتحديد اتجاه القبلة"
          >
            <MapPin className="w-3 h-3 text-[#595959]" />
            <span>{cityName}</span>
            <span className="text-[10px] text-[#706B5E]">(القبلة {Math.round(qiblaDegrees)}°)</span>
          </button>
        </div>

        {/* Unified Tools Bar: Classic Kindle e-reader buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* PWA Install Button (without word مثبت) */}
          <PWAInstallButton />

          {/* Post-Azan Reminder button */}
          <button
            onClick={onOpenReminderModal}
            className={`inline-flex items-center justify-center gap-1.5 h-8.5 px-2.5 sm:px-3 text-xs font-semibold rounded-lg transition cursor-pointer border shadow-2xs font-cairo ${
              isReminderActive 
                ? 'bg-[#242424] text-[#FAF8F5] border-[#141414]' 
                : 'bg-[#FAF8F5] hover:bg-[#EDE7DC] text-[#1A1A1A] border-[#DCD5C6]'
            }`}
            title="تذكير كلمة ما بعد الأذان"
          >
            <span className="relative flex items-center justify-center">
              <Bell className="w-3.5 h-3.5" />
              {isReminderActive && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-[#FAF8F5]" />
              )}
            </span>
            <span className="hidden md:inline">التذكير</span>
          </button>

          {/* Audio Rehearsal / Mic Coach */}
          <button
            onClick={onOpenAudioRehearsal}
            className="inline-flex items-center justify-center gap-1.5 h-8.5 px-2.5 sm:px-3 text-xs font-semibold rounded-lg bg-[#FAF8F5] hover:bg-[#EDE7DC] text-[#1A1A1A] border border-[#DCD5C6] shadow-2xs transition cursor-pointer font-cairo"
            title="تدريب الإلقاء وتسجيل الصوت بالذكاء الاصطناعي"
          >
            <Mic className="w-3.5 h-3.5 text-[#595959]" />
            <span className="hidden md:inline">تدريب الإلقاء</span>
          </button>

          {/* Hadith Verifier */}
          <button
            onClick={onOpenHadithVerifier}
            className="inline-flex items-center justify-center gap-1.5 h-8.5 px-2.5 sm:px-3 text-xs font-semibold rounded-lg bg-[#FAF8F5] hover:bg-[#EDE7DC] text-[#1A1A1A] border border-[#DCD5C6] shadow-2xs transition cursor-pointer font-cairo"
            title="محقّق الأحاديث والقصص من الشاملة"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#595959]" />
            <span className="hidden md:inline">محقّق الأحاديث</span>
          </button>

          {/* Permissions / Audio Settings */}
          <button
            onClick={onOpenPermissions}
            className="inline-flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EDE7DC] text-[#454545] hover:text-[#000000] border border-[#DCD5C6] shadow-2xs transition cursor-pointer"
            title="مركز أذونات الموقع والصوت والميكروفون"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>

          {/* Settings */}
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center justify-center w-8.5 h-8.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EDE7DC] text-[#454545] hover:text-[#000000] border border-[#DCD5C6] shadow-2xs transition cursor-pointer"
            title="إعدادات المنظومة والمواقيت"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>

        </div>
      </div>

      {/* Mobile Sub-strip: Next prayer + Celsius Temperature & Location */}
      <div className="lg:hidden px-3 py-1.5 border-t border-[#DCD5C6] bg-[#F2EDE2] flex items-center justify-between text-xs text-[#2A2A2A] font-medium">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-[#595959] shrink-0" />
          <span>القادمة:</span>
          <strong className="text-[#1A1A1A] font-bold">{arabicPrayers[nextPrayer] || nextPrayer}</strong>
          <span className="text-[#595959] text-[11px] font-mono">
            ({minutesRemaining > 60 ? `${Math.floor(minutesRemaining / 60)} س و ${minutesRemaining % 60} د` : `${minutesRemaining} د`})
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Real Celsius Temperature on Mobile */}
          <div className="flex items-center gap-1 font-bold text-[#1A1A1A]">
            <Thermometer className="w-3 h-3 text-[#595959]" />
            <span className="font-mono text-xs">{temperatureCelsius}° م</span>
          </div>

          <span className="text-[#CEC5B4]">|</span>

          <button 
            onClick={onOpenPermissions}
            className="flex items-center gap-1 text-[11px] text-[#454545] hover:text-[#000000] cursor-pointer"
          >
            <MapPin className="w-3 h-3 text-[#595959]" />
            <span>{cityName}</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Prayer Times Strip & Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-2 border-t border-[#DCD5C6] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5">
        
        {/* Horizontally scrollable prayer times strip (Kindle e-ink bookmark style) */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] text-[#706B5E] font-bold ml-1 shrink-0">المواقيت:</span>
          {prayerList.map((p) => {
            const isTarget = p.key === nextPrayer;
            return (
              <div 
                key={p.key}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition flex items-center gap-1 shrink-0 ${
                  isTarget 
                    ? 'bg-[#242424] text-[#FAF8F5] font-bold shadow-2xs border border-[#141414]' 
                    : 'bg-[#F4EFE6] text-[#2A2A2A] border border-[#DCD5C6]'
                }`}
              >
                <span>{p.arabicName}</span>
                <span className={`font-mono ${isTarget ? 'text-[#FAF8F5]' : 'text-[#595959]'}`}>
                  {p.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Segmented Navigation Tab Controller (Kindle e-ink tab bar) */}
        <div className="flex items-center bg-[#EAE4D6] p-1 rounded-lg border border-[#CEC5B4] shrink-0 self-center md:self-auto w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 md:flex-none px-3.5 py-1 rounded-md text-xs font-bold transition cursor-pointer text-center ${
              activeTab === 'all'
                ? 'bg-[#242424] text-[#FAF8F5] shadow-2xs'
                : 'text-[#454545] hover:text-[#000000]'
            }`}
          >
            الموضوعات (20)
          </button>
          
          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 md:flex-none px-3 py-1 rounded-md text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'favorites'
                ? 'bg-[#242424] text-[#FAF8F5] shadow-2xs'
                : 'text-[#454545] hover:text-[#000000]'
            }`}
          >
            <Bookmark className="w-3 h-3" />
            <span>المفضلة</span>
            {favoritesCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                activeTab === 'favorites' ? 'bg-[#FAF8F5] text-[#1A1A1A]' : 'bg-[#D5CCBC] text-[#1A1A1A]'
              }`}>
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 md:flex-none px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer text-center ${
              activeTab === 'history'
                ? 'bg-[#242424] text-[#FAF8F5] shadow-2xs'
                : 'text-[#454545] hover:text-[#000000]'
            }`}
          >
            سجل الملقاة
          </button>
        </div>

      </div>
    </header>
  );
};
