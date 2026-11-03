import React from 'react';
import { X, Settings, Clock, Type, Volume2, Compass, Library, Smartphone } from 'lucide-react';
import { AppSettings } from '../types';
import { CALCULATION_METHODS } from '../utils/prayerTimes';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in text-slate-800">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#fdfcf9] border-2 border-amber-500/40 shadow-2xl overflow-hidden my-auto">
        
        {/* Top gold bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-800 via-amber-500 to-emerald-800" />

        {/* Header */}
        <div className="px-5 py-4 border-b border-amber-600/20 bg-[#f7f4ea] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-900 border border-amber-400">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-cairo text-emerald-950">
                إعدادات وتخصيص المنظومة
              </h2>
              <p className="text-xs text-slate-600">
                ضبط خيارات الحساب الفلكي، القراءة على المنبر، ومكتبات التوثيق
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-amber-900/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-right text-xs">
          
          {/* Setting 1: Prayer calculation method */}
          <div className="bg-white p-4 rounded-2xl border border-amber-600/25 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-950 font-bold">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>طريقة حساب مواقيت الصلاة الفلكية:</span>
            </div>
            <select
              value={settings.prayerCalculationMethod}
              onChange={(e) => onUpdateSettings({ prayerCalculationMethod: e.target.value as any })}
              className="w-full bg-[#f9f7f2] border border-amber-600/30 rounded-xl p-2.5 text-slate-900 text-xs focus:outline-none focus:border-emerald-700 font-semibold cursor-pointer"
            >
              {Object.entries(CALCULATION_METHODS).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.name}
                </option>
              ))}
            </select>
          </div>

          {/* Setting 2: Preferred Library */}
          <div className="bg-white p-4 rounded-2xl border border-amber-600/25 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-950 font-bold">
              <Library className="w-4 h-4 text-amber-700" />
              <span>المصدر الأكاديمي الافتراضي للبحث:</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { key: 'shamela', label: 'المكتبة الشاملة (shamela.ws)' },
                { key: 'aljamea', label: 'جامع الكتب الإسلامية' },
                { key: 'waqfeya', label: 'المكتبة الوقفية' },
                { key: 'madina', label: 'مكتبة المدينة ومجمع فهد' },
              ].map((lib) => (
                <button
                  key={lib.key}
                  onClick={() => onUpdateSettings({ preferredLibrarySource: lib.key as any })}
                  className={`p-2 rounded-xl text-[11px] font-bold transition cursor-pointer text-center ${
                    settings.preferredLibrarySource === lib.key
                      ? 'bg-amber-500 text-slate-950 border border-amber-600 shadow-xs'
                      : 'bg-[#f8f6f0] text-slate-700 hover:bg-amber-50 border border-amber-900/10'
                  }`}
                >
                  {lib.label}
                </button>
              ))}
            </div>
          </div>

          {/* Setting 2.5: Post-Azan Automatic Reminder */}
          <div className="bg-white p-4 rounded-2xl border border-amber-600/25 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-950 font-bold">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>تذكير بعد الأذان بالكلمة دائماً:</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.enablePostAzanReminder}
                  onChange={(e) => onUpdateSettings({ enablePostAzanReminder: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-800"></div>
              </label>
            </div>

            {settings.enablePostAzanReminder && (
              <div className="space-y-2 pt-2 border-t border-amber-600/10">
                <span className="text-slate-600 font-bold text-[11px] block">وقت ظهور التذكير:</span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 0, label: 'مباشرة عند الأذان' },
                    { val: 5, label: 'بعد 5 دقائق' },
                    { val: 15, label: 'بين الأذان والإقامة' },
                  ].map((d) => (
                    <button
                      key={d.val}
                      onClick={() => onUpdateSettings({ reminderDelayMinutes: d.val })}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                        settings.reminderDelayMinutes === d.val
                          ? 'bg-amber-500 text-slate-950 shadow-xs'
                          : 'bg-[#f8f6f0] text-slate-700 hover:bg-slate-100 border border-amber-900/10'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-slate-700 font-medium text-[11px]">نغمة تنبيه وقورة عند التذكير:</span>
                  <input
                    type="checkbox"
                    checked={settings.enableChimeSound}
                    onChange={(e) => onUpdateSettings({ enableChimeSound: e.target.checked })}
                    className="w-4 h-4 accent-emerald-800 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Setting 3: Podium Timer duration */}
          <div className="bg-white p-4 rounded-2xl border border-amber-600/25 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-950 font-bold">
              <Clock className="w-4 h-4 text-amber-700" />
              <span>المدة المستهدفة للكلمة في وضع المنبر:</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4, 5].map((mins) => (
                <button
                  key={mins}
                  onClick={() => onUpdateSettings({ podiumTimerMinutes: mins })}
                  className={`py-2 rounded-xl font-bold transition cursor-pointer ${
                    settings.podiumTimerMinutes === mins
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-[#f8f6f0] text-slate-700 hover:bg-slate-100 border border-amber-900/10'
                  }`}
                >
                  {mins} دقائق
                </button>
              ))}
            </div>
          </div>

          {/* Setting 4: Font size */}
          <div className="bg-white p-4 rounded-2xl border border-amber-600/25 shadow-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-950 font-bold">
              <Type className="w-4 h-4 text-emerald-700" />
              <span>حجم الخط الافتراضي لعرض المخطط:</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'normal', label: 'عادي' },
                { key: 'large', label: 'كبير ومريح' },
                { key: 'huge', label: 'ضخم جداً' },
              ].map((f) => (
                <button
                  key={f.key}
                  onClick={() => onUpdateSettings({ fontSize: f.key as any })}
                  className={`py-2 rounded-xl font-bold transition cursor-pointer ${
                    settings.fontSize === f.key
                      ? 'bg-emerald-800 text-white shadow-xs'
                      : 'bg-[#f8f6f0] text-slate-700 hover:bg-slate-100 border border-amber-900/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Setting 5: Audio TTS speed */}
          <div className="bg-white p-4 rounded-2xl border border-amber-600/25 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-emerald-950 font-bold">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-700" />
                <span>سرعة القراءة الصوتية (TTS):</span>
              </div>
              <span className="font-mono text-amber-800">{settings.ttsSpeed}x</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[0.8, 1.0, 1.2].map((speed) => (
                <button
                  key={speed}
                  onClick={() => onUpdateSettings({ ttsSpeed: speed })}
                  className={`py-2 rounded-xl font-bold transition cursor-pointer ${
                    settings.ttsSpeed === speed
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-[#f8f6f0] text-slate-700 hover:bg-slate-100 border border-amber-900/10'
                  }`}
                >
                  {speed === 0.8 ? 'متأنٍ (0.8x)' : speed === 1.0 ? 'طبيعي (1.0x)' : 'سريع (1.2x)'}
                </button>
              ))}
            </div>
          </div>

          {/* Setting 6: Install on Home Screen (PWA) */}
          <div className="bg-white p-4 rounded-2xl border border-amber-600/25 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-950 font-bold">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>تثبيت على الشاشة الرئيسية (PWA):</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-600">
              يمكنك تشغيل البرنامج بملء الشاشة دون متصفح مع حفظ البيانات والمواقيت تلقائياً.
            </p>
            <div className="pt-1">
              <PWAInstallButton variant="header" className="w-full justify-center py-2.5" />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-amber-600/20 bg-[#f7f4ea] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition cursor-pointer shadow-xs"
          >
            حفظ وإغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
