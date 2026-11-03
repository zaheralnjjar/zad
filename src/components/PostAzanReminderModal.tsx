import React from 'react';
import { 
  Bell, 
  X, 
  Tv, 
  Volume2, 
  Clock, 
  BookOpen, 
  RotateCw, 
  ChevronLeft,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { TopicSuggestion, TopicOutline, PrayerKey } from '../types';

interface PostAzanReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSnooze: () => void;
  prayerKey: PrayerKey;
  prayerNameArabic: string;
  topic: TopicSuggestion | null;
  onLaunchPodium: (outline: TopicOutline) => void;
  onListenTTS: (outline: TopicOutline) => void;
  onChangeTopic: () => void;
}

export const PostAzanReminderModal: React.FC<PostAzanReminderModalProps> = ({
  isOpen,
  onClose,
  onSnooze,
  prayerNameArabic,
  topic,
  onLaunchPodium,
  onListenTTS,
  onChangeTopic,
}) => {
  if (!isOpen || !topic) return null;

  const outline = topic.outline || {
    title: topic.title,
    category: topic.category,
    estimatedDuration: topic.estimatedDuration,
    hookQuestion: topic.hookQuestion,
    introduction: 'الحمد لله رب العالمين والصلاة والسلام على رسول الله.',
    quranAyat: [],
    sahihHadiths: [],
    scholarQuotes: [],
    practicalTakeaways: [],
    concludingDua: '',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fade-in text-slate-800">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#fdfcf9] border-2 border-amber-500 shadow-2xl overflow-hidden my-auto">
        
        {/* Animated Golden Banner */}
        <div className="h-2.5 bg-gradient-to-r from-emerald-800 via-amber-400 to-emerald-800" />

        {/* Modal Top Ribbon */}
        <div className="p-4 bg-gradient-to-r from-[#fbf8ee] via-amber-50 to-[#fbf8ee] border-b border-amber-600/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-xs animate-bounce">
              <Bell className="w-5 h-5 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-950 px-2 py-0.5 rounded-full bg-amber-200">
                  تذكير بعد الأذان
                </span>
                <span className="text-xs font-bold text-emerald-900">
                  صلاة {prayerNameArabic}
                </span>
              </div>
              <h2 className="text-sm font-bold font-cairo text-slate-800 mt-0.5">
                حان وقت خاطرة ما بعد الصلاة
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-right text-xs">
          
          {/* Card for the selected topic */}
          <div className="bg-white p-4.5 rounded-2xl border-2 border-amber-400/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-950 border border-emerald-300">
                {topic.category}
              </span>
              <span className="text-slate-500 font-semibold flex items-center gap-1 text-[11px]">
                <Clock className="w-3 h-3 text-emerald-700" />
                {topic.estimatedDuration || '3-5 دقائق'}
              </span>
            </div>

            <h3 className="text-base font-black text-emerald-950 font-cairo leading-snug">
              {topic.title}
            </h3>

            {topic.hookQuestion && (
              <div className="bg-[#fcfaf4] p-3 rounded-xl border border-amber-600/20">
                <span className="text-[10px] font-bold text-amber-900 block mb-0.5">
                  سؤال الافتتاح للمصلين:
                </span>
                <p className="font-amiri text-sm font-bold text-slate-800 leading-relaxed italic">
                  "{topic.hookQuestion}"
                </p>
              </div>
            )}

            {topic.shortSummary && (
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {topic.shortSummary}
              </p>
            )}

            {topic.hadithReference && (
              <div className="text-[11px] text-emerald-900 font-bold bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
                ✓ {topic.hadithReference}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={() => {
                onLaunchPodium(outline);
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition transform hover:scale-[1.01]"
            >
              <Tv className="w-4 h-4" />
              <span>إلقاء الكلمة في وضع المنبر (شاشة كاملة)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onListenTTS(outline)}
                className="py-2.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span>استماع صوتي سريع</span>
              </button>

              <button
                onClick={() => {
                  onChangeTopic();
                  onClose();
                }}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-amber-50 text-slate-800 border border-amber-600/30 font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-2xs"
              >
                <RotateCw className="w-3.5 h-3.5 text-amber-700" />
                <span>اختيار موضوع آخر</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer Snooze */}
        <div className="px-5 py-3 border-t border-amber-600/15 bg-[#f7f5ee] flex items-center justify-between text-xs">
          <button
            onClick={onSnooze}
            className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer"
          >
            <Clock className="w-3 h-3 text-amber-600" />
            <span>تذكير بعد 5 دقائق</span>
          </button>

          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
          >
            إغلاق التنبيه
          </button>
        </div>

      </div>
    </div>
  );
};
