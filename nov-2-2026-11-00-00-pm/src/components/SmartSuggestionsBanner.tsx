import React, { useState } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  BookOpen, 
  MessageSquare, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { SmartSuggestionsData, PrayerKey } from '../types';

interface SmartSuggestionsBannerProps {
  currentPrayer: PrayerKey;
  onSelectTopicTitle: (title: string) => void;
}

export const SmartSuggestionsBanner: React.FC<SmartSuggestionsBannerProps> = ({
  currentPrayer,
  onSelectTopicTitle,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [suggestions, setSuggestions] = useState<SmartSuggestionsData>({
    timelyTopic: {
      title: currentPrayer === 'fajr' 
        ? 'البركة في البكور وركعتا الفجر' 
        : currentPrayer === 'asr'
        ? 'قاعدة: المشقة تجلب التيسير ورخص الصلاة'
        : currentPrayer === 'jumuah'
        ? 'فضل الصلاة على النبي ﷺ وساعة الإجابة'
        : 'قاعدة: الأمور بمقاصدها وتصحيح النيات في العادات',
      reason: 'موضوع فقهي وتربوي يناسب هذا التوقيت، موثق في الشاملة وصحيحي البخاري ومسلم.',
      scienceType: 'القواعد الفقهية وفقه العبادات'
    },
    imamWisdomTip: 'اجعل خاطرتك بين 3 إلى 5 دقائق بالضبط؛ فخير الكلام ما قل ودل، وافتتح بسؤال إشكالي لطيف يشحذ أذهان المصلين قبل الدخول في صلب الحديث.',
    quickSahihHadith: {
      matn: '«كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي المِيزَانِ، حَبِيبَتَانِ إِلَى الرَّحْمَنِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ العَظِيمِ»',
      source: 'متفق عليه: صحيح البخاري (6406) - الشاملة: ج8، ص89'
    },
    congregationEngagementIdea: 'اطرح سؤالاً افتتاحياً: "لو قيل لك إن هناك تجارة لا تستغرق عشر ثوانٍ تثقل ميزانك يوم القيامة، هل تفرط فيها؟"',
    scienceCuriosityNugget: 'طريفة مصطلحية: يُسمى الحديث الذي يتفق فيه رواة السند جميعاً على التبسم عند روايته بـ "المسلسل بالتبسم"، اقتداءً بتبسم النبي ﷺ عند ختمه!'
  });

  const handleRefreshAI = async () => {
    setIsLoading(true);
    setFeedbackMsg(null);
    try {
      const now = new Date();
      const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const dayName = days[now.getDay()];
      const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;

      const res = await fetch('/api/ai/smart-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPrayer,
          currentTime: timeStr,
          dayOfWeek: dayName,
        }),
      });

      const data = await res.json();
      if (data.success && data.suggestions && data.suggestions.timelyTopic) {
        setSuggestions(data.suggestions);
        setFeedbackMsg('تم تحديث الاقتراحات الذكية بنجاح!');
        setTimeout(() => setFeedbackMsg(null), 3000);
      }
    } catch (err) {
      console.error('Failed to refresh smart suggestions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative my-4 rounded-xl bg-[#FAF8F5] border border-[#DCD5C6] shadow-2xs overflow-hidden transition-all duration-200">
      {/* Subtle Kindle separator rule */}
      <div className="h-0.5 bg-[#CEC5B4]" />

      {/* Header bar: Kindle e-reader chapter bar */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#DCD5C6] bg-[#F4EFE6]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-md bg-[#242424] text-[#FAF8F5] shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#FAF8F5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-bold text-[#1A1A1A] font-cairo flex items-center gap-1.5">
                فقرة الاقتراحات واللطائف الذكية اللحظية للإمام
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#EDE7DC] text-[#242424] border border-[#CEC5B4]">
                توثيق الشاملة المباشر
              </span>
            </div>
            <p className="text-[11px] text-[#595959] hidden sm:block">
              توصيات متجددة ولطائف من كتب المصطلح والقواعد الفقهية والتفسير تناسب وقت الصلاة الحالي
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {feedbackMsg && (
            <span className="text-xs text-[#1A1A1A] font-bold flex items-center gap-1 bg-[#E8E1D3] px-2 py-0.5 rounded border border-[#CEC5B4]">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#1A1A1A]" />
              {feedbackMsg}
            </span>
          )}

          <button
            onClick={handleRefreshAI}
            disabled={isLoading}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#242424] hover:bg-[#0F0F0F] text-[#FAF8F5] transition disabled:opacity-50 cursor-pointer shadow-2xs border border-[#141414] font-cairo"
            title="توليد اقتراحات ولطائف ذكية جديدة بالذكاء الاصطناعي"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">تحديث التوصيات واللطائف</span>
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-[#595959] hover:text-[#1A1A1A] rounded transition cursor-pointer"
            aria-label="تبديل إظهار الفقرة"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Body Content: Kindle columns */}
      {isExpanded && (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
          {/* Card 1: Timely topic */}
          <div className="bg-[#FAF8F5] rounded-lg p-3.5 border border-[#DCD5C6] flex flex-col justify-between hover:border-[#B8AF9C] transition">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-[#1A1A1A] font-bold">
                  <Lightbulb className="w-3.5 h-3.5 text-[#595959]" />
                  <span>موضوع الساعة المقترح:</span>
                </div>
                {suggestions.timelyTopic.scienceType && (
                  <span className="text-[10px] bg-[#EDE7DC] text-[#242424] px-1.5 py-0.5 rounded font-bold border border-[#CEC5B4]">
                    {suggestions.timelyTopic.scienceType}
                  </span>
                )}
              </div>
              <p className="font-bold text-[#1A1A1A] text-sm leading-snug mb-1 font-cairo">
                {suggestions.timelyTopic.title}
              </p>
              <p className="text-[11px] text-[#454545] leading-relaxed">
                {suggestions.timelyTopic.reason}
              </p>
            </div>
            <button
              onClick={() => onSelectTopicTitle(suggestions.timelyTopic.title)}
              className="mt-2.5 pt-2 border-t border-[#DCD5C6] text-[#1A1A1A] hover:text-[#000000] text-[11px] font-bold flex items-center justify-between w-full cursor-pointer"
            >
              <span>عرض المخطط وتوثيق الشاملة</span>
              <ArrowLeft className="w-3 h-3 text-[#595959]" />
            </button>
          </div>

          {/* Card 2: Science Curiosity Nugget (طرائف ولطائف العلوم) */}
          <div className="bg-[#FAF8F5] rounded-lg p-3.5 border border-[#DCD5C6] flex flex-col justify-between hover:border-[#B8AF9C] transition">
            <div>
              <div className="flex items-center gap-1.5 text-[#1A1A1A] font-bold mb-1.5">
                <Compass className="w-3.5 h-3.5 text-[#595959]" />
                <span>طريفة ولطيفة من علوم الدين:</span>
              </div>
              <p className="text-[#2A2A2A] leading-relaxed text-[11px] font-medium bg-[#F4EFE6] p-2.5 rounded border border-[#DCD5C6]">
                {suggestions.scienceCuriosityNugget || 'طريفة فقهية: كان بعض السلف يفتتح درسه بالقواعد الجامعة لتسهيل ضبط المسائل المتشابهة.'}
              </p>
            </div>
            <div className="mt-2 text-[10px] text-[#595959] font-medium">
              📖 مأخوذ من مصادر الشاملة وكتب المصطلح والقواعد
            </div>
          </div>

          {/* Card 3: Rapid Sahih Capsule */}
          <div className="bg-[#FAF8F5] rounded-lg p-3.5 border border-[#DCD5C6] flex flex-col justify-between hover:border-[#B8AF9C] transition">
            <div>
              <div className="flex items-center gap-1.5 text-[#1A1A1A] font-bold mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#595959]" />
                <span>كبسولة نبوية صحيحة (30 ثانية):</span>
              </div>
              <p className="font-amiri text-xs text-[#1A1A1A] font-semibold leading-relaxed bg-[#F4EFE6] p-2.5 rounded border border-[#DCD5C6]">
                {suggestions.quickSahihHadith.matn}
              </p>
            </div>
            <p className="text-[10px] text-[#595959] mt-2 font-mono font-medium">
              {suggestions.quickSahihHadith.source}
            </p>
          </div>

          {/* Card 4: Preacher wisdom & Engagement Idea */}
          <div className="bg-[#FAF8F5] rounded-lg p-3.5 border border-[#DCD5C6] flex flex-col justify-between hover:border-[#B8AF9C] transition">
            <div>
              <div className="flex items-center gap-1.5 text-[#1A1A1A] font-bold mb-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#595959]" />
                <span>نصيحة المنبر وسؤال المصلين:</span>
              </div>
              <p className="text-[#2A2A2A] leading-relaxed text-[11px] mb-2 font-cairo">
                {suggestions.imamWisdomTip}
              </p>
              <div className="bg-[#F4EFE6] p-2 rounded text-[10px] text-[#1A1A1A] font-medium border border-[#DCD5C6]">
                سؤال مقترح: "{suggestions.congregationEngagementIdea}"
              </div>
            </div>
            <div className="mt-2 text-[10px] text-[#595959] font-medium">
              💡 سر التأثير: الاختصار وبراعة الاستهلال
            </div>
          </div>

        </div>
      )}
    </div>
  );
};
