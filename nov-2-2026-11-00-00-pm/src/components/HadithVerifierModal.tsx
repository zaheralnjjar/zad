import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  BookOpen, 
  Library,
  ExternalLink
} from 'lucide-react';

interface HadithVerifierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HadithVerifierModal: React.FC<HadithVerifierModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = async (textToVerify: string = query) => {
    if (!textToVerify.trim()) return;
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ai/verify-hadith', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToVerify }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setResult(data.result);
      } else {
        setError(data.error || 'فشل في التحقق من الحديث');
      }
    } catch (err: any) {
      setError(err.message || 'خطأ في الاتصال');
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQueries = [
    'حديث: اطلبوا العلم ولو بالصين',
    'حديث: ركعتا الفجر خير من الدنيا وما فيها',
    'حديث: صوموا تصحوا',
    'حديث: المسلسل بالمحبة (يا معاذ والله إني لأحبك)',
    'حديث: الكلمة الطيبة صدقة'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in text-slate-800">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#fdfcf9] border-2 border-amber-500/40 shadow-2xl overflow-hidden my-auto">
        
        {/* Top gold bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-800 via-amber-500 to-emerald-800" />

        {/* Header */}
        <div className="px-5 py-4 border-b border-amber-600/20 bg-[#f7f4ea] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-900 border border-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-cairo text-emerald-950">
                مُحقّق الأحاديث والقصص بالمكتبة الشاملة
              </h2>
              <p className="text-xs text-slate-600">
                تأكد من صحة وتخريج أي حديث أو أثر في مصنفات السنة والجامع والوقفية
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
          
          {/* Input & Search button */}
          <div className="space-y-2">
            <label className="text-slate-700 font-bold block">
              أدخل نص الحديث، أو القصة، أو طرف العبارة للتحقق منها وتخريجها:
            </label>
            <div className="relative">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="مثال: حديث (ركعتا الفجر خير من الدنيا وما فيها) أو قصة أصحاب الغار..."
                className="w-full h-24 bg-white border border-amber-600/30 rounded-2xl p-3.5 text-slate-900 text-xs placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 shadow-xs transition"
              />
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
              {/* Quick sample chips */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-slate-600 font-bold">أمثلة سريعة:</span>
                {sampleQueries.slice(0, 3).map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuery(sample);
                      handleVerify(sample);
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 transition cursor-pointer font-bold"
                  >
                    {sample.replace('حديث: ', '')}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleVerify()}
                disabled={isLoading || !query.trim()}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition disabled:opacity-50 cursor-pointer"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{isLoading ? 'جاري التخريج في الشاملة...' : 'فحص وتخريج الحديث'}</span>
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl text-rose-800 font-bold">
              ⚠️ {error}
            </div>
          )}

          {/* Verification Result Card */}
          {result && (
            <div className="bg-white p-5 rounded-2xl border-2 border-amber-400 shadow-md space-y-4 animate-fade-in">
              {/* Ruling Header Badge */}
              <div className="flex items-center justify-between border-b border-amber-600/20 pb-3">
                <span className="text-slate-700 font-bold">حكم المحدثين والدرجة:</span>
                <span className={`px-3 py-1 rounded-xl text-xs font-black border flex items-center gap-1 ${
                  result.ruling.includes('صحيح') || result.ruling.includes('حسن')
                    ? 'bg-emerald-100 text-emerald-950 border-emerald-300'
                    : result.ruling.includes('ضعيف')
                    ? 'bg-amber-100 text-amber-950 border-amber-300'
                    : 'bg-rose-100 text-rose-950 border-rose-300'
                }`}>
                  {result.ruling.includes('صحيح') ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />}
                  <span>{result.ruling}</span>
                </span>
              </div>

              {/* Takhrij */}
              <div className="bg-[#f7f5ee] p-3.5 rounded-xl border border-amber-600/20">
                <span className="text-emerald-900 font-bold block mb-1">📚 التخريج والمصادر في كتب السنة والشاملة:</span>
                <p className="text-slate-800 leading-relaxed font-mono text-[11px] font-semibold">{result.takhrij}</p>
                {result.academicCitation && (
                  <p className="text-amber-900 text-[10px] font-mono mt-1 pt-1 border-t border-amber-600/10">
                    التوثيق: {result.academicCitation}
                  </p>
                )}
              </div>

              {/* Full Text */}
              {result.fullText && (
                <div>
                  <span className="text-emerald-900 font-bold block mb-1">اللفظ الثابت الصحيح:</span>
                  <p className="font-amiri text-base text-emerald-950 font-bold bg-[#f6fbf8] p-3 rounded-xl border border-emerald-200 leading-relaxed">
                    "{result.fullText}"
                  </p>
                </div>
              )}

              {/* Guidance for Imam */}
              {result.imamGuidance && (
                <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
                  <span className="text-emerald-950 font-bold block mb-1">💡 توصية للإمام في مسجده:</span>
                  <p className="text-slate-800 leading-relaxed font-medium">{result.imamGuidance}</p>
                </div>
              )}

              {/* Science Curiosity / Hadith Anecdote */}
              {result.hadithAnecdote && (
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <span className="text-amber-900 font-bold block mb-1">✨ لطيفة وطريفة حول الرواة والمصطلح:</span>
                  <p className="text-slate-800 leading-relaxed font-medium">{result.hadithAnecdote}</p>
                </div>
              )}

              {/* Authentic alternative if weak */}
              {result.authenticAlternative && (
                <div className="bg-amber-100/70 p-3 rounded-xl border border-amber-300">
                  <span className="text-amber-950 font-bold block mb-1">✨ البديل الصحيح الثابت الذي يؤدي المعنى:</span>
                  <p className="text-emerald-950 leading-relaxed font-amiri font-bold text-sm">{result.authenticAlternative}</p>
                </div>
              )}

              {/* Shamela direct search link */}
              <div className="pt-2 border-t border-amber-600/15 flex items-center justify-between">
                <a
                  href={`https://shamela.ws/search?q=${encodeURIComponent(query)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                >
                  <Library className="w-3.5 h-3.5" />
                  <span>فتح موضع البحث في المكتبة الشاملة (shamela.ws)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
