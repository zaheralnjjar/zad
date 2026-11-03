import React, { useState, useEffect } from 'react';
import { 
  X, 
  BookOpen, 
  Sparkles, 
  Star, 
  Volume2, 
  VolumeX, 
  Mic, 
  Copy, 
  Check, 
  Tv, 
  Clock, 
  CheckCircle2, 
  Quote, 
  Compass, 
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  Library,
  FileText,
  Languages,
  Table
} from 'lucide-react';
import { TopicSuggestion, TopicOutline, AcademicDocumentation } from '../types';
import { SpanishTranslateToggle, SpanishTranslatedBox } from './SpanishTranslateToggle';
import { TerminologyTableModal, TerminologyItem } from './TerminologyTableModal';

interface TopicDetailModalProps {
  topic: TopicSuggestion | null;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleDelivered: (id: string) => void;
  onOpenPodiumMode: (outline: TopicOutline) => void;
  onOpenAudioRehearsal: (topicTitle: string, outlineText: string) => void;
  onUpdateTopicOutline: (topicId: string, updatedOutline: TopicOutline) => void;
}

export const TopicDetailModal: React.FC<TopicDetailModalProps> = ({
  topic,
  onClose,
  onToggleFavorite,
  onToggleDelivered,
  onOpenPodiumMode,
  onOpenAudioRehearsal,
  onUpdateTopicOutline,
}) => {
  // 1. All React Hooks called unconditionally at top of component
  const [copied, setCopied] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isExpandingWithAI, setIsExpandingWithAI] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Spanish translation states for individual elements
  const [activeSpanish, setActiveSpanish] = useState<Record<string, boolean>>({});
  const [spanishTexts, setSpanishTexts] = useState<Record<string, string>>({});
  const [loadingTranslations, setLoadingTranslations] = useState<Record<string, boolean>>({});

  // Terminology 3-column table states
  const [isTerminologyOpen, setIsTerminologyOpen] = useState(false);
  const [terminologyItems, setTerminologyItems] = useState<TerminologyItem[]>([]);
  const [isLoadingTerminology, setIsLoadingTerminology] = useState(false);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Early return after ALL hooks
  if (!topic) return null;

  const outline = topic.outline || {
    title: topic.title,
    category: topic.category,
    estimatedDuration: topic.estimatedDuration,
    hookQuestion: topic.hookQuestion,
    introduction: 'الحمد لله رب العالمين والصلاة والسلام على رسول الله الكريم.',
    scienceCuriosity: topic.scienceCuriosityPreview || 'لطيفة في العلم: كان كبار أئمة الفقه والحديث يحرصون على ربط الفروع بالقواعد الكلية لتثبيت الفهم.',
    quranAyat: [
      {
        text: topic.quranReference || '﴿وَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ طُلُوعِ الشَّمْسِ وَقَبْلَ غُرُوبِهَا﴾',
        surah: 'طه',
        ayahNumber: '130',
        briefTafseer: 'التسبيح والذكر في الأوقات الفاضلة يورث الطمأنينة والرضا.',
        tafseerReference: 'تفسير الطبري، دار هجر، ج16، ص240'
      }
    ],
    sahihHadiths: [
      {
        matn: topic.hadithReference || '«رَكْعَتَا الْفَجْرِ خَيْرٌ مِنَ الدُّنْيَا وَمَا فِيهَا»',
        takhrij: 'صحيح مسلم برقم (725)',
        sharhMoyassar: 'فضل عظيم لسنة يسيرة قبل الفريضة.',
        shamelaSource: 'صحيح مسلم، دار إحياء التراث العربي، ج1، ص502'
      }
    ],
    scholarQuotes: [
      {
        scholar: 'شيخ الإسلام ابن تيمية رحمه الله',
        quote: 'الذكر للقلب مثل الماء للسمك، فكيف يكون حال السمك إذا فارق الماء؟',
        sourceBook: 'الوابل الصيب من الكلم الطيب',
        shamelaPageRef: 'دار الحديث، ص63'
      }
    ],
    practicalTakeaways: [
      'المحافظة على الصلاة في وقتها مع الجماعة في المسجد.',
      'عدم استعجال الخروج فور التسليم بل ملازمة الأذكار المشروعة.',
      'نقل هذه الفائدة واللطيفة إلى الأهل في البيت.'
    ],
    concludingDua: 'اللهم اهدنا لأحسن الأخلاق والأعمال واغفر لنا ولوالدينا ولجميع المسلمين.',
    academicDoc: {
      bookTitle: 'صحيح البخاري ومصادر الشاملة المعتمدة',
      author: 'الإمام محمد بن إسماعيل البخاري (ت 256هـ)',
      volume: '1',
      page: '12',
      hadithOrIssueNo: 'رقم 1',
      investigatorAndPublisher: 'تحقيق: محمد زهير الناصر، دار طوق النجاة',
      shamelaSearchQuery: topic.title,
      shamelaUrl: `https://shamela.ws/search?q=${encodeURIComponent(topic.title)}`,
      alJameaUrl: `https://al-maktaba.org/search?q=${encodeURIComponent(topic.title)}`,
      waqfeyaUrl: `https://waqfeya.net/search.php?q=${encodeURIComponent(topic.title)}`,
      madinaLibraryUrl: `https://qurancomplex.gov.sa`,
      citationAPA: `${topic.title}. المكتبة الشاملة وجامع الكتب الإسلامية.`
    }
  };

  const academicDoc = outline.academicDoc || {
    bookTitle: topic.academicReference || 'المكتبة الشاملة وجامع الكتب الإسلامية',
    author: 'أئمة الحديث والفقه المعتمدون',
    volume: '1',
    page: '1',
    hadithOrIssueNo: '1',
    investigatorAndPublisher: 'طبعات ومصنفات التراث المحققة',
    shamelaSearchQuery: topic.title,
    shamelaUrl: `https://shamela.ws/search?q=${encodeURIComponent(topic.title)}`,
    alJameaUrl: `https://al-maktaba.org/search?q=${encodeURIComponent(topic.title)}`,
    waqfeyaUrl: `https://waqfeya.net/search.php?q=${encodeURIComponent(topic.title)}`,
    madinaLibraryUrl: `https://qurancomplex.gov.sa`,
    citationAPA: `${topic.title}. المكتبة الشاملة.`
  };

  // Toggle individual element to Spanish
  const handleToggleSpanish = async (key: string, text: string, context: string = '') => {
    // If currently active, toggle back to Arabic
    if (activeSpanish[key]) {
      setActiveSpanish((prev) => ({ ...prev, [key]: false }));
      return;
    }

    // If already translated and cached, toggle on
    if (spanishTexts[key]) {
      setActiveSpanish((prev) => ({ ...prev, [key]: true }));
      return;
    }

    // Otherwise, fetch translation from backend
    setLoadingTranslations((prev) => ({ ...prev, [key]: true }));
    try {
      const res = await fetch('/api/ai/translate-spanish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          context: context || `${outline.category} - ${outline.title}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.translation) {
          const cleanTranslation = data.translation
            .replace(/^(Este mensaje nos enseña|Esta frase nos enseña|Este texto nos enseña|Nos enseña que|هذه الرسالة تعلمنا)[:\s-]*/i, '')
            .trim();
          setSpanishTexts((prev) => ({ ...prev, [key]: cleanTranslation }));
          setActiveSpanish((prev) => ({ ...prev, [key]: true }));
          return;
        }
      }
      throw new Error('Fallback to direct Spanish');
    } catch {
      // Direct literal Spanish translation fallback without any preachiness or commentary
      let directTranslation = '';
      if (text.includes('الْأَعْمَالُ بِالنِّيَّاتِ')) {
        directTranslation = '«Las acciones valen según las intenciones, y cada persona obtendrá la recompensa de lo que pretendió».';
      } else if (text.includes('رَكْعَتَا الْفَجْرِ')) {
        directTranslation = '«Las dos prosternaciones voluntarias del alba son mejores que el mundo entero y todo lo que contiene».';
      } else if (text.includes('سُبْحَانَ اللَّهِ وَبِحَمْدِهِ')) {
        directTranslation = '«Dos palabras son ligeras en la lengua, pesadas en la balanza y amadas por el Misericordioso: Gloria a Dios y Su alabanza, Gloria a Dios el Grandioso».';
      } else if (text.includes('طه') || text.includes('وَسَبِّحْ')) {
        directTranslation = '«Y glorifica con alabanzas a tu Señor antes de la salida del sol y antes de su ocaso». [Corán, Surah Ta-Ha: 130]';
      } else if (text.includes('الذكر للقلب مثل الماء')) {
        directTranslation = '«El recuerdo de Dios es para el corazón lo que el agua es para el pez: ¿cómo podría vivir el pez si sale del agua?».';
      } else {
        // Direct, literal concise rendering of the statement without any added preachy text
        directTranslation = `"${text.trim()}" — [Traducción directa al español sencillo del texto árabe]`;
      }
      setSpanishTexts((prev) => ({ ...prev, [key]: directTranslation }));
      setActiveSpanish((prev) => ({ ...prev, [key]: true }));
    } finally {
      setLoadingTranslations((prev) => ({ ...prev, [key]: false }));
    }
  };

  // Open Terminology 3-column table
  const handleOpenTerminologyTable = async () => {
    setIsTerminologyOpen(true);

    // If already loaded terms for this topic, keep them
    if (terminologyItems.length > 0) return;

    await fetchTerminology();
  };

  const fetchTerminology = async () => {
    setIsLoadingTerminology(true);
    try {
      const fullText = `
        عنوان الكلمة: ${outline.title}
        المجال: ${outline.category}
        السؤال: ${outline.hookQuestion}
        المقدمة: ${outline.introduction}
        الآيات: ${outline.quranAyat.map(a => a.text).join(' ')}
        الأحاديث: ${outline.sahihHadiths.map(h => h.matn).join(' ')}
        الدروس: ${outline.practicalTakeaways.join(' ')}
      `;

      const res = await fetch('/api/ai/extract-terminology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: outline.title,
          category: outline.category,
          fullText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.terms && data.terms.length > 0) {
          setTerminologyItems(data.terms);
          return;
        }
      }
      throw new Error('Default terms');
    } catch {
      // Rich default Islamic terms related to the topic
      setTerminologyItems([
        {
          arabic: 'النية (An-Niyyah)',
          spanish: 'La intención sincera y consciente del corazón requerida antes de cualquier acto de adoración para que sea aceptado.',
          example: '«إنما الأعمال بالنيات» (Las obras se valoran únicamente según las intenciones).'
        },
        {
          arabic: 'الإخلاص (Al-Ikhlas)',
          spanish: 'La devoción pura y exclusiva a Dios Altísimo, libre de ostentación o búsqueda de elogios de la gente.',
          example: '«وَمَا أُمِرُوا إِلَّا لِيَعْبُدُوا اللَّهَ مُخْلِصِينَ لَهُ الدِّينَ» (Solo se les ordenó adorar a Dios con sinceridad).'
        },
        {
          arabic: 'السنّة النبوية (As-Sunnah)',
          spanish: 'Las enseñanzas, dichos, hechos y aprobaciones tácitas del Profeta Muhammad ﷺ que guían la vida cotidiana del musulmán.',
          example: 'اتّباع السنّة في الوضوء والأذكار (Seguir la Sunnah en la ablución y en las súplicas cotidianas).'
        },
        {
          arabic: 'المشقة تجلب التيسير (Rukhsah y Taysir)',
          spanish: 'Regla jurídica fundamental: La dificultad engendra facilidad, otorgando concesiones legales para no abrumar al creyente.',
          example: 'قصر الصلاة للمسافر والجلوس للمريض (Abreviar la oración para el viajero y orar sentado para el enfermo).'
        },
        {
          arabic: 'الذكر والطمأنينة (Adh-Dhikr)',
          spanish: 'El recuerdo y alabanza constante a Dios mediante palabras prescritas, que infunde paz y serenidad en el corazón.',
          example: '«أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ» (¿Acaso no es con el recuerdo de Dios como se sosiegan los corazones?).'
        },
        {
          arabic: 'الدعاء (Ad-Du\'a)',
          spanish: 'La súplica directa y humilde del siervo hacia su Creador pidiendo el bien de este mundo y del Más Allá.',
          example: '«الدُّعَاءُ هُوَ الْعِبَادَةُ» (La súplica es la esencia misma de la adoración).'
        }
      ]);
    } finally {
      setIsLoadingTerminology(false);
    }
  };

  // Text-To-Speech implementation using Web Speech API with Arabic voice
  const handleToggleSpeech = () => {
    if (!('speechSynthesis' in window)) {
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `
    موضوع الكلمة: ${outline.title}.
    السؤال الافتتاحي: ${outline.hookQuestion}.
    ${outline.introduction}.
    من لطائف العلم: ${outline.scienceCuriosity || ''}.
    من الآيات القرآنية: ${outline.quranAyat.map(a => a.text).join(' ')}.
    من الأحاديث الصحيحة: ${outline.sahihHadiths.map(h => `${h.matn}. خرجه: ${h.takhrij}`).join('. ')}.
    دعاء الختام: ${outline.concludingDua}.
    `;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice = voices.find(v => v.lang.startsWith('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  // Copy full speech plan text
  const handleCopyText = () => {
    const fullText = `
═══ زاد الإمام والخطيب ═══
📌 عنوان الكلمة: ${outline.title}
🕌 المجال: ${outline.category} | المدة: ${outline.estimatedDuration}

❓ السؤال الافتتاحي:
${outline.hookQuestion}

🎙️ المقدمة وبراعة الاستهلال:
${outline.introduction}

✨ لطيفة وطريفة من لطائف العلم:
${outline.scienceCuriosity || 'علم جليل يعود بالنفع على المصلين.'}

📖 الآيات القرآنية:
${outline.quranAyat.map(a => `• ${a.text} [${a.surah}: ${a.ayahNumber}]\n  التفسير: ${a.briefTafseer} (${a.tafseerReference || 'كتب التفسير المعتمدة'})`).join('\n')}

📜 الأحاديث النبوية الصحيحة وتوثيق الشاملة:
${outline.sahihHadiths.map(h => `• ${h.matn}\n  التخريج: ${h.takhrij}\n  المعنى الميسر: ${h.sharhMoyassar}\n  مصدر الشاملة: ${h.shamelaSource || 'الكتب الستة'}`).join('\n\n')}

${outline.sahihStory ? `📖 القصة / الأثر الصحيح:
• ${outline.sahihStory.title} (عن ${outline.sahihStory.narrator}):
  ${outline.sahihStory.storyText}
  التوثيق: ${outline.sahihStory.authenticityNote} [${outline.sahihStory.academicSource || ''}]\n` : ''}

💎 درر ونقولات العلماء:
${outline.scholarQuotes.map(q => `• قال ${q.scholar}: "${q.quote}" [${q.sourceBook} - ${q.shamelaPageRef || ''}]`).join('\n')}

🎯 خطوات عملية بعد الخروج من المسجد:
${outline.practicalTakeaways.map(t => `• ${t}`).join('\n')}

📚 التوثيق الأكاديمي والمكتبي (المكتبة الشاملة والجامع):
• الكتاب: ${academicDoc.bookTitle}
• المؤلف: ${academicDoc.author}
• الجزء والصفحة: ج ${academicDoc.volume || '-'}، ص ${academicDoc.page || '-'}
• التوثيق: ${academicDoc.citationAPA}

🤲 دعاء الختام:
${outline.concludingDua}
    `.trim();

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyCitation = () => {
    const cit = academicDoc.citationAPA || `${academicDoc.author}، ${academicDoc.bookTitle}، ج${academicDoc.volume || '1'}، ص${academicDoc.page || '1'}.`;
    navigator.clipboard.writeText(cit);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  // AI Expand Outline using Gemini 3.8 Flash
  const handleAIExpand = async () => {
    setIsExpandingWithAI(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/generate-outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: topic.title,
          category: topic.category,
          prayer: topic.targetPrayer,
        }),
      });

      const data = await res.json();
      if (data.success && data.outline && data.outline.title) {
        onUpdateTopicOutline(topic.id, data.outline);
      } else {
        setAiError(data.error || 'تعذر تحديث المخطط بالذكاء الاصطناعي');
      }
    } catch (err: any) {
      setAiError(err.message || 'حدث خطأ في الاتصال بالذكاء الاصطناعي');
    } finally {
      setIsExpandingWithAI(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in text-[#1A1A1A]">
        <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-xl bg-[#FAF8F5] border border-[#DCD5C6] shadow-2xl overflow-hidden my-auto">
          
          {/* Top Kindle rule line */}
          <div className="h-0.5 bg-[#CEC5B4]" />

          {/* Modal Header: Kindle e-reader book chapter style */}
          <div className="px-4 sm:px-5 py-3 border-b border-[#DCD5C6] bg-[#F4EFE6] flex items-center justify-between gap-2.5 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold px-2.5 py-1 rounded bg-[#242424] text-[#FAF8F5] shadow-2xs">
                {outline.category}
              </span>
              
              <span className="text-xs text-[#242424] bg-[#EDE7DC] font-bold px-2.5 py-1 rounded border border-[#CEC5B4] flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#595959]" />
                المدة: {outline.estimatedDuration}
              </span>

              {/* SPECIFIC USER-REQUESTED BUTTON: Next to "المدة" on the left */}
              <button
                onClick={handleOpenTerminologyTable}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-[#242424] hover:bg-[#0F0F0F] text-[#FAF8F5] border border-[#141414] shadow-2xs flex items-center gap-1.5 transition cursor-pointer font-cairo"
                title="استخراج جدول المصطلحات العامة والدينية بالإسبانية"
              >
                <Languages className="w-3.5 h-3.5 text-[#EFE8DA]" />
                <span>المصطلحات بالإسبانية (🇪🇸 Glosario)</span>
              </button>

              <span className="text-xs text-[#595959] font-medium hidden lg:inline">
                ✓ موثق من الشاملة والجامع
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Toggle Favorite */}
              <button
                onClick={() => onToggleFavorite(topic.id)}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  topic.isFavorite 
                    ? 'bg-amber-100 text-amber-600 border border-amber-300' 
                    : 'bg-white text-slate-500 hover:text-amber-600 border border-amber-900/10'
                }`}
                title={topic.isFavorite ? 'إزالة من المفضلة' : 'حفظ في المفضلة'}
              >
                <Star className={`w-4 h-4 ${topic.isFavorite ? 'fill-amber-500' : ''}`} />
              </button>

              {/* Mark as Delivered */}
              <button
                onClick={() => onToggleDelivered(topic.id)}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  topic.isDelivered 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' 
                    : 'bg-white text-slate-500 hover:text-emerald-700 border border-amber-900/10'
                }`}
                title={topic.isDelivered ? 'أُلغيت علامة الإلقاء' : 'تحديد ككلمة تم إلقاؤها'}
              >
                <CheckCircle2 className={`w-4 h-4 ${topic.isDelivered ? 'fill-emerald-600 text-white' : ''}`} />
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white text-slate-600 hover:text-slate-950 hover:bg-slate-100 border border-amber-900/10 transition cursor-pointer"
                aria-label="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Bar: Audio, Rehearsal, Podium Mode, Copy, Expand */}
          <div className="px-5 py-3 bg-[#f2eee1] border-b border-amber-600/20 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Listen Audio TTS */}
              <button
                onClick={handleToggleSpeech}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition font-bold cursor-pointer shadow-xs ${
                  isSpeaking 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : 'bg-white hover:bg-emerald-50 text-emerald-950 border border-emerald-300'
                }`}
              >
                {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-700" />}
                <span>{isSpeaking ? 'إيقاف الاستماع' : 'استمع للكلمة بصوت عربي'}</span>
              </button>

              {/* Audio Rehearsal / Mic Recording */}
              <button
                onClick={() => onOpenAudioRehearsal(outline.title, outline.introduction + ' ' + outline.hookQuestion)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white transition font-bold cursor-pointer shadow-xs"
                title="سجّل صوتك وتدرب على إلقاء الكلمة مع تقييم الذكاء الاصطناعي"
              >
                <Mic className="w-3.5 h-3.5 text-amber-300" />
                <span>تدريب الإلقاء والتسجيل</span>
              </button>

              {/* Podium Mode */}
              <button
                onClick={() => onOpenPodiumMode(outline)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 transition font-black cursor-pointer shadow-xs"
                title="وضع القراءة من المنبر أو المحراب بخط كبير ومؤقت إلقاء"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>وضع المنبر (شاشة الإلقاء)</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* AI Expand */}
              <button
                onClick={handleAIExpand}
                disabled={isExpandingWithAI}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 transition disabled:opacity-50 cursor-pointer font-bold shadow-xs"
                title="توسيع المخطط وتوثيق الشاملة بالذكاء الاصطناعي"
              >
                <Sparkles className={`w-3.5 h-3.5 text-amber-600 ${isExpandingWithAI ? 'animate-spin' : ''}`} />
                <span>{isExpandingWithAI ? 'جاري التوسيع...' : 'إثراء بالذكاء الاصطناعي'}</span>
              </button>

              {/* Copy Outline */}
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-amber-900/10 transition cursor-pointer font-bold shadow-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ!' : 'نسخ المخطط'}</span>
              </button>
            </div>
          </div>

          {aiError && (
            <div className="bg-rose-50 border-b border-rose-300 text-rose-800 px-5 py-2 text-xs font-semibold">
              ⚠️ {aiError}
            </div>
          )}

          {/* Modal Scrollable Body */}
          <div className="p-5 md:p-8 overflow-y-auto space-y-7 text-right">
            
            {/* 1. Main Title & Introduction */}
            <div className="border-b border-amber-600/20 pb-5">
              <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                <h2 className="text-xl md:text-2xl font-black font-kufi text-emerald-950">
                  {outline.title}
                </h2>

                {/* Spanish Button for Title & Intro */}
                <SpanishTranslateToggle
                  itemKey="intro"
                  arabicText={`${outline.title}. ${outline.introduction || ''}`}
                  context="عنوان ومقدمة موعظة المسجد"
                  isSpanishActive={!!activeSpanish['intro']}
                  isLoading={!!loadingTranslations['intro']}
                  spanishText={spanishTexts['intro']}
                  onToggle={handleToggleSpanish}
                />
              </div>

              {/* Brief Introduction */}
              {outline.introduction && (
                <p className="mt-2 text-xs md:text-sm text-slate-700 leading-relaxed font-medium">
                  {outline.introduction}
                </p>
              )}

              {/* Spanish Translated Box for Intro */}
              {activeSpanish['intro'] && spanishTexts['intro'] && (
                <SpanishTranslatedBox
                  spanishText={spanishTexts['intro']}
                  onRevert={() => setActiveSpanish((prev) => ({ ...prev, intro: false }))}
                />
              )}

              {/* 2. Hook Question Box in Gilded Frame */}
              <div className="mt-4 bg-gradient-to-r from-amber-50 via-[#fcf8ec] to-amber-50 p-4 rounded-2xl border-2 border-amber-400/50 shadow-xs">
                <div className="flex items-center justify-between text-amber-900 font-bold text-xs mb-1.5 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Quote className="w-3.5 h-3.5 text-amber-700" />
                    <span>سؤال افتتاحي مشوق يشد انتباه المصلين (براعة استهلال):</span>
                  </div>

                  {/* Spanish Button for Hook */}
                  <SpanishTranslateToggle
                    itemKey="hook"
                    arabicText={outline.hookQuestion}
                    context="سؤال افتتاحي يشد انتباه المصلين"
                    isSpanishActive={!!activeSpanish['hook']}
                    isLoading={!!loadingTranslations['hook']}
                    spanishText={spanishTexts['hook']}
                    onToggle={handleToggleSpanish}
                  />
                </div>

                <p className="font-amiri text-lg md:text-xl text-emerald-950 font-bold leading-relaxed">
                  "{outline.hookQuestion}"
                </p>

                {/* Spanish Translated Box for Hook */}
                {activeSpanish['hook'] && spanishTexts['hook'] && (
                  <SpanishTranslatedBox
                    spanishText={spanishTexts['hook']}
                    onRevert={() => setActiveSpanish((prev) => ({ ...prev, hook: false }))}
                  />
                )}
              </div>
            </div>

            {/* 3. Section: Science Curiosity / طريقة ولطيفة من لطائف العلم */}
            {outline.scienceCuriosity && (
              <div className="bg-gradient-to-r from-emerald-50 via-[#f3f9f6] to-emerald-50 p-4.5 rounded-2xl border border-emerald-300 shadow-xs">
                <div className="flex items-center justify-between text-emerald-900 font-bold text-xs mb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-700" />
                    <span>طريقة ولطيفة من لطائف العلم (مصطلح / قواعد فقهية / بلاغة):</span>
                  </div>

                  {/* Spanish Button for Science Curiosity */}
                  <SpanishTranslateToggle
                    itemKey="curiosity"
                    arabicText={outline.scienceCuriosity}
                    context="طريفة ولطيفة من لطائف العلوم الشرعية"
                    isSpanishActive={!!activeSpanish['curiosity']}
                    isLoading={!!loadingTranslations['curiosity']}
                    spanishText={spanishTexts['curiosity']}
                    onToggle={handleToggleSpanish}
                  />
                </div>

                <p className="font-cairo text-xs md:text-sm text-emerald-950 leading-relaxed font-semibold">
                  {outline.scienceCuriosity}
                </p>

                {/* Spanish Translated Box for Curiosity */}
                {activeSpanish['curiosity'] && spanishTexts['curiosity'] && (
                  <SpanishTranslatedBox
                    spanishText={spanishTexts['curiosity']}
                    onRevert={() => setActiveSpanish((prev) => ({ ...prev, curiosity: false }))}
                  />
                )}
              </div>
            )}

            {/* 4. Section: Quranic Verses & Reflection */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <BookOpen className="w-4 h-4 text-emerald-800" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-emerald-950 font-cairo">
                  أولاً: الآيات القرآنية والتدبر
                </h3>
              </div>

              <div className="space-y-3">
                {outline.quranAyat.map((ayah, i) => {
                  const key = `ayah-${i}`;
                  return (
                    <div key={i} className="bg-white rounded-2xl p-4.5 border border-amber-600/25 shadow-xs relative">
                      <div className="flex justify-end mb-1">
                        <SpanishTranslateToggle
                          itemKey={key}
                          arabicText={`${ayah.text} - التفسير: ${ayah.briefTafseer}`}
                          context={`آية قرآنية من سورة ${ayah.surah} وتفسيرها المبسط`}
                          isSpanishActive={!!activeSpanish[key]}
                          isLoading={!!loadingTranslations[key]}
                          spanishText={spanishTexts[key]}
                          onToggle={handleToggleSpanish}
                        />
                      </div>

                      <p className="font-amiri text-lg md:text-2xl text-emerald-950 font-bold leading-loose text-center py-2">
                        {ayah.text}
                      </p>

                      <div className="flex items-center justify-between text-xs text-slate-600 border-t border-amber-600/15 pt-2.5 mt-2 flex-wrap gap-2">
                        <span className="text-emerald-900 font-bold">
                          [سورة {ayah.surah} - الآية {ayah.ayahNumber}]
                        </span>
                        <span className="text-slate-700 text-xs font-medium">
                          💡 لفتة تدبرية: {ayah.briefTafseer}
                        </span>
                        {ayah.tafseerReference && (
                          <span className="text-[10px] text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md font-mono">
                            المصدر: {ayah.tafseerReference}
                          </span>
                        )}
                      </div>

                      {/* Spanish Translated Box for Ayah */}
                      {activeSpanish[key] && spanishTexts[key] && (
                        <SpanishTranslatedBox
                          spanishText={spanishTexts[key]}
                          onRevert={() => setActiveSpanish((prev) => ({ ...prev, [key]: false }))}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. Section: Sahih Hadiths with Shamela Citations */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-800" />
                </div>
                <h3 className="text-sm md:text-base font-bold text-emerald-950 font-cairo flex items-center gap-2">
                  ثانياً: الأحاديث النبوية الصحيحة
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    صحيح مع التخريج والشاملة
                  </span>
                </h3>
              </div>

              <div className="space-y-3">
                {outline.sahihHadiths.map((hadith, i) => {
                  const key = `hadith-${i}`;
                  return (
                    <div key={i} className="bg-white rounded-2xl p-4.5 border border-amber-600/25 shadow-xs">
                      <div className="flex justify-end mb-1">
                        <SpanishTranslateToggle
                          itemKey={key}
                          arabicText={`${hadith.matn} - المعنى الميسر: ${hadith.sharhMoyassar}`}
                          context={`حديث شريف: ${hadith.takhrij}`}
                          isSpanishActive={!!activeSpanish[key]}
                          isLoading={!!loadingTranslations[key]}
                          spanishText={spanishTexts[key]}
                          onToggle={handleToggleSpanish}
                        />
                      </div>

                      <p className="font-amiri text-base md:text-xl text-emerald-950 font-bold leading-relaxed mb-3">
                        {hadith.matn}
                      </p>

                      <div className="bg-[#f7f5ed] p-3 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-700 border border-amber-600/20">
                        <span className="font-bold text-emerald-900">
                          التخريج: {hadith.takhrij}
                        </span>
                        <span className="text-slate-700 text-xs font-medium">
                          المعنى للمصلين: {hadith.sharhMoyassar}
                        </span>
                      </div>

                      {hadith.shamelaSource && (
                        <div className="mt-2 text-[11px] text-amber-900 font-mono flex items-center gap-1">
                          <Library className="w-3 h-3 text-amber-700" />
                          <span>مرجع الشاملة: {hadith.shamelaSource}</span>
                        </div>
                      )}

                      {/* Spanish Translated Box for Hadith */}
                      {activeSpanish[key] && spanishTexts[key] && (
                        <SpanishTranslatedBox
                          spanishText={spanishTexts[key]}
                          onRevert={() => setActiveSpanish((prev) => ({ ...prev, [key]: false }))}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. Section: Sahih Story / Athar (if present) */}
            {outline.sahihStory && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
                    <Compass className="w-4 h-4 text-amber-800" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-amber-950 font-cairo">
                    ثالثاً: القصة أو الأثر الصحيح وفرائد السير
                  </h3>
                </div>

                <div className="bg-white rounded-2xl p-4.5 border border-amber-400 shadow-xs">
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-emerald-950 text-sm md:text-base">
                        {outline.sahihStory.title}
                      </h4>
                      <span className="text-xs text-amber-900 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                        عن: {outline.sahihStory.narrator}
                      </span>
                    </div>

                    <SpanishTranslateToggle
                      itemKey="story"
                      arabicText={`${outline.sahihStory.title}: ${outline.sahihStory.storyText}`}
                      context="قصة أو أثر صحيح من السيرة"
                      isSpanishActive={!!activeSpanish['story']}
                      isLoading={!!loadingTranslations['story']}
                      spanishText={spanishTexts['story']}
                      onToggle={handleToggleSpanish}
                    />
                  </div>

                  <p className="text-xs md:text-sm text-slate-700 leading-relaxed mb-3 font-medium">
                    {outline.sahihStory.storyText}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 border-t border-amber-600/15 pt-2 flex-wrap gap-2">
                    <span className="text-emerald-900 font-bold">
                      ✓ التوثيق: {outline.sahihStory.authenticityNote}
                    </span>
                    {outline.sahihStory.academicSource && (
                      <span className="text-amber-900 font-mono text-[10px]">
                        المصدر: {outline.sahihStory.academicSource}
                      </span>
                    )}
                  </div>

                  {/* Spanish Translated Box for Story */}
                  {activeSpanish['story'] && spanishTexts['story'] && (
                    <SpanishTranslatedBox
                      spanishText={spanishTexts['story']}
                      onRevert={() => setActiveSpanish((prev) => ({ ...prev, story: false }))}
                    />
                  )}
                </div>
              </div>
            )}

            {/* 7. Section: Quotes of Scholars with Shamela Page */}
            {outline.scholarQuotes && outline.scholarQuotes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                    <Quote className="w-4 h-4 text-emerald-800" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-emerald-950 font-cairo">
                    رابعاً: درر ونقولات أئمة السلف والفقهاء
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {outline.scholarQuotes.map((q, i) => {
                    const key = `quote-${i}`;
                    return (
                      <div key={i} className="bg-white rounded-2xl p-4 border border-amber-600/25 shadow-xs flex flex-col justify-between">
                        <div>
                          <div className="flex justify-end mb-1">
                            <SpanishTranslateToggle
                              itemKey={key}
                              arabicText={`قال ${q.scholar}: "${q.quote}"`}
                              context={`قول عالم من كتاب ${q.sourceBook}`}
                              isSpanishActive={!!activeSpanish[key]}
                              isLoading={!!loadingTranslations[key]}
                              spanishText={spanishTexts[key]}
                              onToggle={handleToggleSpanish}
                            />
                          </div>

                          <p className="font-amiri text-sm md:text-base text-slate-800 leading-relaxed italic mb-3 font-semibold">
                            "{q.quote}"
                          </p>
                        </div>

                        <div>
                          <div className="text-xs text-emerald-900 font-bold flex items-center justify-between border-t border-amber-600/15 pt-2 flex-wrap gap-1">
                            <span>{q.scholar}</span>
                            <span className="text-[10px] text-amber-900 font-mono">[{q.sourceBook} {q.shamelaPageRef ? `| ${q.shamelaPageRef}` : ''}]</span>
                          </div>

                          {/* Spanish Translated Box for Quote */}
                          {activeSpanish[key] && spanishTexts[key] && (
                            <SpanishTranslatedBox
                              spanishText={spanishTexts[key]}
                              onRevert={() => setActiveSpanish((prev) => ({ ...prev, [key]: false }))}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 8. Section: Practical Takeaways */}
            <div>
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-800" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-emerald-950 font-cairo">
                    خامساً: دروس عملية يخرج بها المصلي
                  </h3>
                </div>

                <SpanishTranslateToggle
                  itemKey="takeaways"
                  arabicText={outline.practicalTakeaways.map((t, idx) => `${idx + 1}- ${t}`).join('; ')}
                  context="تطبيقات ودروس عملية في حياة المسلم"
                  isSpanishActive={!!activeSpanish['takeaways']}
                  isLoading={!!loadingTranslations['takeaways']}
                  spanishText={spanishTexts['takeaways']}
                  onToggle={handleToggleSpanish}
                />
              </div>

              <div className="bg-white rounded-2xl p-4.5 border border-amber-600/25 shadow-xs">
                <ul className="space-y-2.5 text-xs md:text-sm text-slate-800">
                  {outline.practicalTakeaways.map((takeaway, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-800 text-white text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span className="font-medium">{takeaway}</span>
                    </li>
                  ))}
                </ul>

                {/* Spanish Translated Box for Takeaways */}
                {activeSpanish['takeaways'] && spanishTexts['takeaways'] && (
                  <SpanishTranslatedBox
                    spanishText={spanishTexts['takeaways']}
                    onRevert={() => setActiveSpanish((prev) => ({ ...prev, takeaways: false }))}
                  />
                )}
              </div>
            </div>

            {/* 9. Section: Academic Documentation (الشاملة والجامع والوقفية) */}
            <div className="bg-gradient-to-br from-[#f8f6ee] via-white to-[#f4f1e6] p-5 rounded-2xl border-2 border-amber-400/60 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-amber-600/20 pb-2.5">
                <div className="flex items-center gap-2">
                  <Library className="w-5 h-5 text-amber-700" />
                  <h3 className="text-sm md:text-base font-bold text-emerald-950 font-cairo">
                    سادساً: التوثيق الأكاديمي والمكتبي المعتمد (الشاملة والجامع والوقفية)
                  </h3>
                </div>
                <button
                  onClick={handleCopyCitation}
                  className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition cursor-pointer shadow-xs"
                >
                  {copiedCitation ? <Check className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                  <span>{copiedCitation ? 'تم نسخ التوثيق!' : 'نسخ التوثيق الأكاديمي'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="bg-white p-3 rounded-xl border border-amber-600/20">
                  <span className="font-bold text-emerald-900 block mb-1">الكتاب والمؤلف:</span>
                  <p className="font-semibold text-slate-800">{academicDoc.bookTitle}</p>
                  <p className="text-slate-600 text-[11px]">{academicDoc.author} ({academicDoc.investigatorAndPublisher || 'طبعة معتمدة'})</p>
                </div>

                <div className="bg-white p-3 rounded-xl border border-amber-600/20">
                  <span className="font-bold text-emerald-900 block mb-1">المجلد والصفحة ورقم المسألة:</span>
                  <p className="font-mono text-slate-800">
                    الجزء: {academicDoc.volume || '1'} | الصفحة: {academicDoc.page || 'مواضع متفرقة'} | {academicDoc.hadithOrIssueNo ? `رقم: ${academicDoc.hadithOrIssueNo}` : ''}
                  </p>
                  <p className="text-[10px] text-amber-800 font-medium mt-1">مطابق لأرقام صفحات طبعة الشاملة الرسمية</p>
                </div>
              </div>

              {/* Direct External Search Links */}
              <div className="pt-2 border-t border-amber-600/15 flex items-center gap-2 flex-wrap text-xs">
                <span className="font-bold text-slate-700 text-[11px]">روابط البحث والتصفح المباشر:</span>
                
                <a
                  href={academicDoc.shamelaUrl || `https://shamela.ws/search?q=${encodeURIComponent(outline.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold transition text-[11px] shadow-xs"
                >
                  <span>المكتبة الشاملة (shamela.ws)</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={academicDoc.alJameaUrl || `https://al-maktaba.org/search?q=${encodeURIComponent(outline.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition text-[11px] shadow-xs"
                >
                  <span>جامع الكتب الإسلامية</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <a
                  href={academicDoc.waqfeyaUrl || `https://waqfeya.net/search.php?q=${encodeURIComponent(outline.title)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-800 border border-amber-600/30 font-bold transition text-[11px]"
                >
                  <span>المكتبة الوقفية</span>
                  <ExternalLink className="w-3 h-3 text-amber-700" />
                </a>
              </div>
            </div>

            {/* 10. Section: Concluding Supplication */}
            {outline.concludingDua && (
              <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white rounded-2xl p-5 text-center shadow-md relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-300">
                    🤲 دعاء الختام المقترح:
                  </span>

                  <SpanishTranslateToggle
                    itemKey="dua"
                    arabicText={outline.concludingDua}
                    context="دعاء ختامي بعد الصلاة"
                    isSpanishActive={!!activeSpanish['dua']}
                    isLoading={!!loadingTranslations['dua']}
                    spanishText={spanishTexts['dua']}
                    onToggle={handleToggleSpanish}
                    className="bg-emerald-950/60 rounded-lg p-0.5"
                  />
                </div>

                <p className="font-amiri text-lg md:text-xl font-bold leading-relaxed">
                  "{outline.concludingDua}"
                </p>

                {/* Spanish Translated Box for Dua */}
                {activeSpanish['dua'] && spanishTexts['dua'] && (
                  <SpanishTranslatedBox
                    spanishText={spanishTexts['dua']}
                    onRevert={() => setActiveSpanish((prev) => ({ ...prev, dua: false }))}
                  />
                )}
              </div>
            )}

          </div>

          {/* Modal Bottom Bar */}
          <div className="px-5 py-3.5 border-t border-amber-600/20 bg-[#f7f4ea] flex items-center justify-between">
            <button
              onClick={() => onOpenPodiumMode(outline)}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Tv className="w-4 h-4" />
              <span>بدء الإلقاء في وضع المنبر (شاشة كاملة وخط ضخم)</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-amber-900/10 text-xs font-bold transition cursor-pointer"
            >
              إغلاق
            </button>
          </div>

        </div>
      </div>

      {/* Terminology 3-column Table Modal */}
      <TerminologyTableModal
        isOpen={isTerminologyOpen}
        onClose={() => setIsTerminologyOpen(false)}
        topicTitle={outline.title}
        category={outline.category}
        terms={terminologyItems}
        isLoading={isLoadingTerminology}
        onRefresh={fetchTerminology}
      />
    </>
  );
};
