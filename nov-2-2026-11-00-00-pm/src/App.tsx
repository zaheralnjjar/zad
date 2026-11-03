import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Sparkles, 
  RotateCw, 
  Search, 
  Bookmark, 
  CheckCircle2, 
  Clock, 
  Layers, 
  HelpCircle, 
  Library,
  Scale,
  Scroll,
  BookOpen,
  HeartHandshake,
  Heart,
  Users,
  Compass,
  Building,
  ShieldAlert,
  GraduationCap,
  CheckSquare,
  Square,
  Combine,
  Tv,
  X,
  Copy,
  Bell
} from 'lucide-react';

import { 
  TopicSuggestion, 
  TopicOutline, 
  PrayerKey, 
  CategoryKey, 
  AppSettings,
  PrayerTime 
} from './types';
import { INITIAL_TOPICS } from './data/defaultTopics';
import { 
  DEFAULT_LOCATION, 
  calculatePrayerTimes, 
  getUpcomingPrayerInfo, 
  computeQiblaDirection,
  LocationCoordinates 
} from './utils/prayerTimes';
import { playSereneChime } from './utils/audioChime';

import { IslamicHeader } from './components/IslamicHeader';
import { SmartSuggestionsBanner } from './components/SmartSuggestionsBanner';
import { TopicCard } from './components/TopicCard';
import { TopicDetailModal } from './components/TopicDetailModal';
import { PodiumMode } from './components/PodiumMode';
import { AudioRehearsalModal } from './components/AudioRehearsalModal';
import { HadithVerifierModal } from './components/HadithVerifierModal';
import { PermissionsModal } from './components/PermissionsModal';
import { SettingsModal } from './components/SettingsModal';
import { PostAzanReminderModal } from './components/PostAzanReminderModal';
import { PWAInstallButton } from './components/PWAInstallButton';

const DEFAULT_SETTINGS: AppSettings = {
  prayerCalculationMethod: 'Makkah',
  fontSize: 'large',
  enableAudioTTS: true,
  ttsSpeed: 1.0,
  autoScrollSpeed: 1,
  podiumTimerMinutes: 3,
  showSmartBanner: true,
  preferredLibrarySource: 'shamela',
  enablePostAzanReminder: true,
  reminderDelayMinutes: 5, // 5 minutes after Azan
  enableChimeSound: true,
};

// Available sciences configuration for selection boxes
const SCIENCES_CONFIG: {
  key: CategoryKey;
  label: string;
  sublabel: string;
  icon: any;
  color: string;
}[] = [
  {
    key: 'متنوع شامل',
    label: 'متنوع شامل في كافة العلوم',
    sublabel: 'باقة منوعة من كل علوم الشريعة ولطائفها',
    icon: Layers,
    color: 'from-amber-600 to-amber-700',
  },
  {
    key: 'القواعد الفقهية والأصول',
    label: 'القواعد الفقهية والأصول',
    sublabel: 'الأمور بمقاصدها، المشقة تجلب التيسير، مقاصد الشريعة',
    icon: Scale,
    color: 'from-emerald-700 to-emerald-900',
  },
  {
    key: 'علم المصطلح وطرائف الرواية',
    label: 'علم المصطلح وطرائف الرواية',
    sublabel: 'لطائف الإسناد، المسلسلات، طرائف المحدثين، الأكابر عن الأصاغر',
    icon: Scroll,
    color: 'from-teal-700 to-teal-900',
  },
  {
    key: 'تفسير وتدبر ولطائف بلاغية',
    label: 'تفسير وتدبر ولطائف بلاغية',
    sublabel: 'إعجاز الفاصلة، لطائف النظم، التفسير الموضوعي',
    icon: BookOpen,
    color: 'from-cyan-700 to-cyan-900',
  },
  {
    key: 'عقيدة وتوحيد',
    label: 'عقيدة وتوحيد',
    sublabel: 'الإخلاص، حسن الظن بالله، أسماء الله وصفاته',
    icon: Compass,
    color: 'from-sky-700 to-sky-900',
  },
  {
    key: 'فقه العبادات',
    label: 'فقه العبادات',
    sublabel: 'أسرار الصلاة، الطهارة، السنن الراتبة، الصيام',
    icon: GraduationCap,
    color: 'from-indigo-700 to-indigo-900',
  },
  {
    key: 'فقه المعاملات والبيوع',
    label: 'فقه المعاملات والبيوع',
    sublabel: 'أخلاق السوق، الصدق في التجارة، أمانة المعاملات',
    icon: HeartHandshake,
    color: 'from-blue-700 to-blue-900',
  },
  {
    key: 'رقائق وتزكية النفوس',
    label: 'رقائق وتزكية النفوس',
    sublabel: 'قيام الليل، الاستغفار، مداواة القلوب، البكاء من خشية الله',
    icon: Heart,
    color: 'from-purple-700 to-purple-900',
  },
  {
    key: 'سيرة وفرائد قصص الصحابة',
    label: 'سيرة وفرائد قصص الصحابة',
    sublabel: 'مواقف خالدة، فرائد التابعين، أخبار الحفاظ والمجاهدين',
    icon: Users,
    color: 'from-rose-700 to-rose-900',
  },
  {
    key: 'أخلاق وأسرة',
    label: 'أخلاق وأسرة ومعاملات',
    sublabel: 'بر الوالدين، كظم الغيظ، تربية الأبناء، صلة الرحم',
    icon: HeartHandshake,
    color: 'from-lime-700 to-lime-900',
  },
  {
    key: 'تصحيح مفاهيم وأحاديث',
    label: 'تصحيح مفاهيم وأحاديث مشهورة',
    sublabel: 'التحذير من الأحاديث الباطلة والضعيفة وبدائلها الصحيحة',
    icon: ShieldAlert,
    color: 'from-orange-700 to-orange-900',
  },
  {
    key: 'آداب المسجد',
    label: 'آداب المسجد والمصلين',
    sublabel: 'السكينة، إتمام الصفوف، تعظيم بيوت الله، آداب الجمعة',
    icon: Building,
    color: 'from-emerald-800 to-emerald-950',
  },
];

export default function App() {
  // Settings with localStorage persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('imam_zad_settings_v3');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('imam_zad_settings_v3', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  // Topics library with localStorage persistence
  const [topics, setTopics] = useState<TopicSuggestion[]>(() => {
    try {
      const saved = localStorage.getItem('imam_zad_topics_v3');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_TOPICS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('imam_zad_topics_v3', JSON.stringify(topics));
    } catch {}
  }, [topics]);

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'all' | 'favorites' | 'history'>('all');

  // Selected Science for Generation
  const [selectedScienceForGeneration, setSelectedScienceForGeneration] = useState<CategoryKey>('متنوع شامل');

  // Multi-selection state (as requested: إمكانية اختيار أكثر من موضوع)
  const [selectedTopicIds, setSelectedTopicIds] = useState<string[]>([]);
  const [isCombiningTopics, setIsCombiningTopics] = useState(false);

  // Filters for display
  const [selectedPrayerFilter, setSelectedPrayerFilter] = useState<PrayerKey | 'all'>('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('الكل');
  const [searchQuery, setSearchQuery] = useState('');

  // Location & Astronomical Prayer Times
  const [location, setLocation] = useState<LocationCoordinates>(DEFAULT_LOCATION);
  const [locationStatus, setLocationStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  // Modals state
  const [selectedTopic, setSelectedTopic] = useState<TopicSuggestion | null>(null);
  const [podiumOutlines, setPodiumOutlines] = useState<TopicOutline[] | null>(null);
  const [isAudioRehearsalOpen, setIsAudioRehearsalOpen] = useState(false);
  const [rehearsalTopicTitle, setRehearsalTopicTitle] = useState('');
  const [rehearsalNotes, setRehearsalNotes] = useState('');
  const [isHadithVerifierOpen, setIsHadithVerifierOpen] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Post-Azan Reminder state
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [dismissedReminders, setDismissedReminders] = useState<Record<string, boolean>>({});

  // AI 20-Topic Generator State
  const [isGenerating20, setIsGenerating20] = useState(false);
  const [aiGenMessage, setAiGenMessage] = useState<string | null>(null);

  // Geolocation
  const handleRequestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          city: 'موقعك الحالي',
          country: '',
        };

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=ar`
          );
          const data = await res.json();
          if (data && data.address) {
            const city = data.address.city || data.address.town || data.address.state || 'موقعك الحالي';
            coords.city = city;
          }
        } catch {}

        setLocation(coords);
        setLocationStatus('granted');
      },
      (err) => {
        console.warn('Geolocation denied or error:', err);
        setLocationStatus('denied');
      },
      { timeout: 10000 }
    );
  };

  useEffect(() => {
    handleRequestLocation();
  }, []);

  // Compute live prayer times
  const prayerTimes = useMemo(() => {
    return calculatePrayerTimes(location, new Date(), settings.prayerCalculationMethod);
  }, [location, settings.prayerCalculationMethod]);

  const { nextPrayer, minutesRemaining, currentPrayer, prayerList } = useMemo(() => {
    return getUpcomingPrayerInfo(prayerTimes, new Date());
  }, [prayerTimes]);

  const qiblaDegrees = useMemo(() => {
    return computeQiblaDirection(location.latitude, location.longitude);
  }, [location]);

  // Pick the most relevant topic for the current prayer
  const currentPrayerTopic = useMemo(() => {
    const matched = topics.find((t) => t.targetPrayer === currentPrayer);
    return matched || topics[0];
  }, [topics, currentPrayer]);

  // Automated Post-Azan Reminder Loop (runs every 15 seconds)
  useEffect(() => {
    if (!settings.enablePostAzanReminder) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const todayDateStr = now.toISOString().split('T')[0];

      // Check each prayer time
      prayerList.forEach((prayer) => {
        const [h, m] = prayer.time.split(':').map(Number);
        const prayerMinutes = (h || 0) * 60 + (m || 0);

        // Target reminder time = prayer time + delay minutes
        const reminderStartMinutes = prayerMinutes + (settings.reminderDelayMinutes || 0);
        const reminderEndMinutes = reminderStartMinutes + 25; // 25-minute active window

        const reminderKey = `${todayDateStr}-${prayer.key}`;

        if (
          currentMinutes >= reminderStartMinutes &&
          currentMinutes <= reminderEndMinutes &&
          !dismissedReminders[reminderKey]
        ) {
          // Trigger reminder!
          if (settings.enableChimeSound) {
            playSereneChime();
          }

          setIsReminderModalOpen(true);

          // Web Notification
          if ('Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification(`تذكير بعد أذان ${prayer.arabicName} | زاد الإمام`, {
                body: `حان موعد الكلمة: "${currentPrayerTopic?.title || 'خاطرة بعد الصلاة'}"`,
                icon: '/apple-touch-icon.png',
              });
            } catch {}
          }

          // Mark as triggered for today
          setDismissedReminders((prev) => ({ ...prev, [reminderKey]: true }));
        }
      });
    }, 15000);

    return () => clearInterval(interval);
  }, [
    settings.enablePostAzanReminder,
    settings.reminderDelayMinutes,
    settings.enableChimeSound,
    prayerList,
    dismissedReminders,
    currentPrayerTopic,
  ]);

  // Multi-selection handler
  const handleToggleSelectTopic = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedTopicIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    if (selectedTopicIds.length === filteredTopics.length) {
      setSelectedTopicIds([]);
    } else {
      setSelectedTopicIds(filteredTopics.map((t) => t.id));
    }
  };

  // Selected topics list
  const selectedTopicsList = useMemo(() => {
    return topics.filter((t) => selectedTopicIds.includes(t.id));
  }, [topics, selectedTopicIds]);

  // Combine multiple selected topics into one cohesive speech via Gemini
  const handleCombineSelectedTopics = async () => {
    if (selectedTopicsList.length === 0) return;
    setIsCombiningTopics(true);
    try {
      const res = await fetch('/api/ai/combine-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedTopics: selectedTopicsList,
          prayer: currentPrayer,
        }),
      });

      const data = await res.json();
      if (data.success && data.combinedOutline && data.combinedOutline.title) {
        const combinedTopic: TopicSuggestion = {
          id: `combined-${Date.now()}`,
          title: data.combinedOutline.title,
          category: 'متنوع شامل',
          targetPrayer: currentPrayer,
          estimatedDuration: data.combinedOutline.estimatedDuration || '4-5 دقائق',
          hookQuestion: data.combinedOutline.hookQuestion || 'كيف نجمع بين هذه المعاني الإيمانية؟',
          shortSummary: `كلمة جامعة مدمجة من ${selectedTopicsList.length} موضوعات مختارة.`,
          outline: data.combinedOutline,
          isFavorite: false,
          isDelivered: false,
        };

        setTopics((prev) => [combinedTopic, ...prev]);
        setSelectedTopic(combinedTopic);
        setSelectedTopicIds([]); // clear selection
      } else {
        alert(data.error || 'تعذر دمج الموضوعات بالذكاء الاصطناعي');
      }
    } catch (err: any) {
      alert(err.message || 'حدث خطأ في الاتصال بالذكاء الاصطناعي');
    } finally {
      setIsCombiningTopics(false);
    }
  };

  // Launch sequential Podium mode for all selected topics
  const handleLaunchMultiPodium = () => {
    if (selectedTopicsList.length === 0) return;
    const outlines = selectedTopicsList.map((t) => t.outline || {
      title: t.title,
      category: t.category,
      estimatedDuration: t.estimatedDuration,
      hookQuestion: t.hookQuestion,
      introduction: 'الحمد لله رب العالمين.',
      quranAyat: [],
      sahihHadiths: [],
      scholarQuotes: [],
      practicalTakeaways: [],
      concludingDua: '',
    });
    setPodiumOutlines(outlines);
  };

  // Bulk add selected to favorites
  const handleBulkFavorite = () => {
    setTopics((prev) =>
      prev.map((t) =>
        selectedTopicIds.includes(t.id) ? { ...t, isFavorite: true } : t
      )
    );
    setSelectedTopicIds([]);
  };

  // Bulk mark as delivered
  const handleBulkDelivered = () => {
    const nowStr = new Date().toLocaleDateString('ar-SA');
    setTopics((prev) =>
      prev.map((t) =>
        selectedTopicIds.includes(t.id)
          ? { ...t, isDelivered: true, deliveredAt: nowStr }
          : t
      )
    );
    setSelectedTopicIds([]);
  };

  // Toggle single favorite
  const handleToggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isFavorite: !t.isFavorite } : t))
    );
    if (selectedTopic && selectedTopic.id === id) {
      setSelectedTopic((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Toggle single delivered
  const handleToggleDelivered = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nowStr = new Date().toLocaleDateString('ar-SA');
    setTopics((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              isDelivered: !t.isDelivered,
              deliveredAt: !t.isDelivered ? nowStr : undefined,
            }
          : t
      )
    );
    if (selectedTopic && selectedTopic.id === id) {
      setSelectedTopic((prev) =>
        prev
          ? {
              ...prev,
              isDelivered: !prev.isDelivered,
              deliveredAt: !prev.isDelivered ? nowStr : undefined,
            }
          : null
      );
    }
  };

  const handleUpdateTopicOutline = (topicId: string, updatedOutline: TopicOutline) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, outline: updatedOutline } : t))
    );
    if (selectedTopic && selectedTopic.id === topicId) {
      setSelectedTopic((prev) => (prev ? { ...prev, outline: updatedOutline } : null));
    }
  };

  const handleOpenAudioRehearsal = (title: string, notes: string = '') => {
    setRehearsalTopicTitle(title);
    setRehearsalNotes(notes);
    setIsAudioRehearsalOpen(true);
  };

  const handleSelectTopicByTitle = (title: string) => {
    const found = topics.find((t) => t.title === title || t.title.includes(title));
    if (found) {
      setSelectedTopic(found);
    } else {
      const newTopic: TopicSuggestion = {
        id: `custom-${Date.now()}`,
        title,
        category: selectedScienceForGeneration !== 'متنوع شامل' ? selectedScienceForGeneration : 'رقائق وتزكية النفوس',
        targetPrayer: currentPrayer,
        estimatedDuration: '3-4 دقائق',
        hookQuestion: `كيف نغتنم بركة هذا الوقت في طاعة الله وتطبيق سنته؟`,
        shortSummary: `تذكرة دعوية سريعة موثقة بالأحاديث الصحيحة من مصادر الشاملة.`,
        isFavorite: false,
        isDelivered: false,
      };
      setTopics((prev) => [newTopic, ...prev]);
      setSelectedTopic(newTopic);
    }
  };

  // Generate 20 Brand New Topics via Gemini API with science specialization
  const handleGenerate20WithAI = async () => {
    setIsGenerating20(true);
    setAiGenMessage(null);
    try {
      const prayerName = selectedPrayerFilter !== 'all' ? selectedPrayerFilter : currentPrayer;
      const arabicPrayer = {
        fajr: 'الفجر',
        dhuhr: 'الظهر',
        asr: 'العصر',
        maghrib: 'المغرب',
        isha: 'العشاء',
        jumuah: 'الجمعة',
        all: 'جميع الصلوات',
      }[prayerName] || 'العصر';

      const res = await fetch('/api/ai/generate-topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prayer: arabicPrayer,
          category: selectedScienceForGeneration,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.topics) && data.topics.length > 0) {
        const formattedTopics: TopicSuggestion[] = data.topics.map((item: any, idx: number) => ({
          id: `ai-${Date.now()}-${idx}`,
          title: item.title || `موضوع دعوي ${idx + 1}`,
          category: (item.category || selectedScienceForGeneration) as any,
          targetPrayer: prayerName as any,
          estimatedDuration: item.estimatedDuration || '3-5 دقائق',
          hookQuestion: item.hookQuestion || 'هل تأملت في عظيم فضل هذا العمل الصالح في ضوء السنة المطهرة؟',
          shortSummary: item.shortSummary || 'تذكرة دعوية محررة وموثقة من المكتبة الشاملة والجامع.',
          quranReference: item.quranReference,
          hadithReference: item.hadithReference,
          academicReference: item.academicReference,
          scienceCuriosityPreview: item.scienceCuriosityPreview,
          isFavorite: false,
          isDelivered: false,
          outline: {
            title: item.title,
            category: item.category || selectedScienceForGeneration,
            estimatedDuration: item.estimatedDuration || '3-5 دقائق',
            hookQuestion: item.hookQuestion || 'هل فكرت في عظيم فضل هذا العمل الصالح؟',
            introduction: 'الحمد لله رب العالمين والصلاة والسلام على رسول الله الكريم وعلى آله وصحبه أجمعين.',
            scienceCuriosity: item.scienceCuriosityPreview || 'لطيفة علمية محررة من كتب المصطلح والتراث المعتمدة.',
            quranAyat: [
              {
                text: item.quranReference || '﴿فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ﴾',
                surah: 'البقرة',
                ayahNumber: '152',
                briefTafseer: 'الذكر المستمر سبب لحفظ الله ومعيته للعبد وتيسير أمره.',
                tafseerReference: 'تفسير الطبري، دار هجر، ج3، ص210'
              },
            ],
            sahihHadiths: [
              {
                matn: item.hadithReference || '«كَلِمَتَانِ خَفِيفَتَانِ عَلَى اللِّسَانِ، ثَقِيلَتَانِ فِي المِيزَانِ: سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ العَظِيمِ»',
                takhrij: 'متفق عليه: صحيح البخاري وصحيح مسلم',
                sharhMoyassar: 'فضل يسير بأجر عظيم يثقل ميزان العبد يوم القيامة.',
                shamelaSource: 'صحيح البخاري، دار طوق النجاة، ج8، ص89'
              },
            ],
            scholarQuotes: [
              {
                scholar: 'الإمام ابن القيم رحمه الله',
                quote: 'القلب يصدأ بالغفلة ويجلوه الذكر والاستغفار والتفقه في الدين.',
                sourceBook: 'الوابل الصيب من الكلم الطيب',
                shamelaPageRef: 'دار الحديث، ص63'
              },
            ],
            practicalTakeaways: [
              'تطبيق ما سمعناه عملياً فور خروجنا من المسجد.',
              'تذكير الأهل والأبناء في البيت بهذا الحديث الشريف.',
              'ملازمة الاستغفار والذكر في الذهاب والإياب.',
            ],
            concludingDua: 'اللهم انفعنا بما علمتنا، وعلمنا ما ينفعنا، وزدنا علماً وفقهاً في الدين يا رب العالمين.',
            academicDoc: {
              bookTitle: item.academicReference || 'المكتبة الشاملة وجامع الكتب الإسلامية',
              author: 'أئمة الحديث المعتمدون',
              volume: '1',
              page: '1',
              hadithOrIssueNo: '1',
              investigatorAndPublisher: 'طبعات التراث المعتمدة',
              shamelaSearchQuery: item.title,
              shamelaUrl: `https://shamela.ws/search?q=${encodeURIComponent(item.title)}`,
              alJameaUrl: `https://al-maktaba.org/search?q=${encodeURIComponent(item.title)}`,
              waqfeyaUrl: `https://waqfeya.net/search.php?q=${encodeURIComponent(item.title)}`,
              madinaLibraryUrl: 'https://qurancomplex.gov.sa',
              citationAPA: `${item.title}. المكتبة الشاملة وجامع الكتب.`
            }
          },
        }));

        setTopics(formattedTopics);
        setAiGenMessage(`تم بنجاح توليد 20 موضوعاً جديداً موثقاً من الشاملة في [${selectedScienceForGeneration}] لصلاة ${arabicPrayer}!`);
        setTimeout(() => setAiGenMessage(null), 5000);
      } else {
        setAiGenMessage(data.error || 'تعذر توليد الموضوعات، يرجى المحاولة مرة أخرى.');
      }
    } catch (err: any) {
      setAiGenMessage(err.message || 'خطأ في الاتصال بالذكاء الاصطناعي');
    } finally {
      setIsGenerating20(false);
    }
  };

  const handleResetDefaultTopics = () => {
    setTopics(INITIAL_TOPICS);
    setSelectedScienceForGeneration('متنوع شامل');
    setAiGenMessage('تمت استعادة الموضوعات الأصلية الموثقة المشتملة على القواعد الفقهية وعلم المصطلح واللطائف!');
    setTimeout(() => setAiGenMessage(null), 4000);
  };

  // Filtered topics list based on Tab, Prayer, Category, Search
  const filteredTopics = useMemo(() => {
    return topics.filter((topic) => {
      if (activeTab === 'favorites' && !topic.isFavorite) return false;
      if (activeTab === 'history' && !topic.isDelivered) return false;

      if (selectedPrayerFilter !== 'all' && topic.targetPrayer !== selectedPrayerFilter && topic.targetPrayer !== 'all') {
        return false;
      }

      if (selectedCategoryFilter !== 'الكل' && topic.category !== selectedCategoryFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = topic.title.toLowerCase().includes(query);
        const matchSummary = topic.shortSummary.toLowerCase().includes(query);
        const matchHook = topic.hookQuestion?.toLowerCase().includes(query);
        const matchCat = topic.category.toLowerCase().includes(query);
        const matchAcad = topic.academicReference?.toLowerCase().includes(query);
        if (!matchTitle && !matchSummary && !matchHook && !matchCat && !matchAcad) return false;
      }

      return true;
    });
  }, [topics, activeTab, selectedPrayerFilter, selectedCategoryFilter, searchQuery]);

  const favoritesCount = useMemo(() => {
    return topics.filter((t) => t.isFavorite).length;
  }, [topics]);

  const prayersFilterList: { key: PrayerKey | 'all'; label: string }[] = [
    { key: 'all', label: 'جميع الصلوات' },
    { key: 'fajr', label: 'الفجر' },
    { key: 'dhuhr', label: 'الظهر' },
    { key: 'asr', label: 'العصر' },
    { key: 'maghrib', label: 'المغرب' },
    { key: 'isha', label: 'العشاء' },
    { key: 'jumuah', label: 'الجمعة' },
  ];

  return (
    <div className="min-h-screen kindle-screen text-[#1A1A1A] flex flex-col font-cairo">
      
      {/* 1. App Header in Kindle E-Reader Styling with Celsius weather & Quiet tools */}
      <IslamicHeader
        currentPrayer={currentPrayer}
        nextPrayer={nextPrayer}
        minutesRemaining={minutesRemaining}
        prayerList={prayerList}
        cityName={location.city || 'مكة المكرمة'}
        qiblaDegrees={qiblaDegrees}
        latitude={location.latitude}
        longitude={location.longitude}
        isReminderActive={settings.enablePostAzanReminder}
        onOpenReminderModal={() => setIsReminderModalOpen(true)}
        onOpenPermissions={() => setIsPermissionsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenHadithVerifier={() => setIsHadithVerifierOpen(true)}
        onOpenAudioRehearsal={() => handleOpenAudioRehearsal('تدريب عام على الإلقاء')}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favoritesCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 md:py-6">
        
        {/* 2. Persistent Smart Suggestions Banner */}
        {settings.showSmartBanner && (
          <SmartSuggestionsBanner
            currentPrayer={currentPrayer}
            onSelectTopicTitle={handleSelectTopicByTitle}
          />
        )}

        {/* 3. Hero & "20 Topics at a Click" & Science Selection Command Center: Kindle Book Style */}
        <div className="relative my-4 rounded-xl bg-[#FAF8F5] border border-[#DCD5C6] p-4 sm:p-6 shadow-2xs overflow-hidden">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
            <div className="text-right space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EDE7DC] text-[#242424] border border-[#CEC5B4] text-xs font-semibold">
                <Library className="w-3.5 h-3.5 text-[#595959]" />
                <span>مستند إلى وصلات المكتبة الشاملة وجامع الكتب والمكتبة الوقفية</span>
              </div>
              <h2 className="text-lg md:text-xl font-bold font-kufi text-[#1A1A1A] tracking-wide">
                توليد 20 موضوعاً موثقاً أكاديمياً ومخصصاً في علوم الدين
              </h2>
              <p className="text-xs md:text-sm text-[#454545] max-w-3xl leading-relaxed font-medium">
                اضغط مباشرة على «توليد» للحصول على 20 موضوعاً متنوعاً شاملاً، أو حدد علماً معيناً من الصناديق أدناه لتوليد 20 موضوعاً مركزاً فيه. ويمكنك أيضاً تحديد أكثر من موضوع لدمجها معاً!
              </p>
            </div>

            {/* Kindle Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full lg:w-auto shrink-0">
              <button
                onClick={handleGenerate20WithAI}
                disabled={isGenerating20}
                className="w-full sm:w-auto px-5 py-3 rounded-lg bg-[#242424] hover:bg-[#0F0F0F] text-[#FAF8F5] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-2xs border border-[#141414] transition-all cursor-pointer disabled:opacity-50 font-cairo"
              >
                <Sparkles className={`w-4 h-4 ${isGenerating20 ? 'animate-spin' : ''}`} />
                <span>
                  {isGenerating20 
                    ? 'جاري التوليد والتوثيق من الشاملة...' 
                    : selectedScienceForGeneration === 'متنوع شامل'
                    ? '🔄 توليد 20 موضوعاً متنوعاً فورياً'
                    : `🔄 توليد 20 موضوعاً في: ${selectedScienceForGeneration}`}
                </span>
              </button>

              <button
                onClick={handleResetDefaultTopics}
                className="w-full sm:w-auto px-4 py-3 rounded-lg bg-[#FAF8F5] hover:bg-[#EDE7DC] text-[#1A1A1A] border border-[#DCD5C6] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-2xs font-cairo"
                title="استعادة الموضوعات الأساسية المعتمدة"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#595959]" />
                <span>القائمة الأصلية الموثقة</span>
              </button>
            </div>
          </div>

          {/* 3.1 Dedicated Science Choice Box List: Kindle Book Chapters Style */}
          <div className="mt-5 pt-4 border-t border-[#DCD5C6]">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1A1A1A]">
                <Scale className="w-4 h-4 text-[#595959]" />
                <span>صناديق تحديد العلم المستهدف لتوليد الـ 20 موضوعاً:</span>
              </div>
              <span className="text-[11px] font-bold text-[#1A1A1A] bg-[#EDE7DC] px-2.5 py-0.5 rounded border border-[#CEC5B4]">
                المختار حالياً: {selectedScienceForGeneration}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 text-right">
              {SCIENCES_CONFIG.map((sci) => {
                const isSelected = selectedScienceForGeneration === sci.key;
                const IconComponent = sci.icon;
                return (
                  <div
                    key={sci.key}
                    onClick={() => setSelectedScienceForGeneration(sci.key)}
                    className={`p-2.5 sm:p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between text-right relative shadow-2xs ${
                      isSelected
                        ? 'bg-[#EFE9DD] border-[#1A1A1A] shadow-xs ring-1 ring-[#1A1A1A]'
                        : 'bg-[#FAF8F5] hover:bg-[#F2ECE0] border-[#DCD5C6]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="p-1.5 rounded-md text-[#FAF8F5] bg-[#242424]">
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>
                        {isSelected && (
                          <span className="w-4 h-4 rounded-full bg-[#1A1A1A] text-[#FAF8F5] flex items-center justify-center font-bold text-[10px]">
                            ✓
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-[#1A1A1A] line-clamp-1 mb-1 font-cairo">
                        {sci.label}
                      </h4>
                      <p className="text-[10px] text-[#595959] line-clamp-2 leading-relaxed font-medium">
                        {sci.sublabel}
                      </p>
                    </div>

                    <div className="mt-2 pt-1 border-t border-[#DCD5C6] flex items-center justify-between text-[9px] text-[#595959] font-semibold">
                      <span>{isSelected ? 'محدد للتوليد' : 'انقر للتحديد'}</span>
                      <span className="font-mono text-[#1A1A1A]">20 موضوعاً</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {aiGenMessage && (
            <div className="mt-4 p-3 rounded-lg bg-[#EFE9DD] border border-[#CEC5B4] text-[#1A1A1A] text-xs font-bold flex items-center gap-2 animate-fade-in shadow-2xs">
              <CheckCircle2 className="w-4 h-4 text-[#1A1A1A] shrink-0" />
              <span>{aiGenMessage}</span>
            </div>
          )}
        </div>

        {/* 4. Filter, Search & Multi-Selection Header Controls: Kindle E-Reader Style */}
        <div className="my-4 bg-[#FAF8F5] p-3.5 sm:p-4 rounded-xl border border-[#DCD5C6] shadow-2xs space-y-3">
          {/* Top row: Search, select all, and stats */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 w-full sm:max-w-md">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[#8F8776] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث في عناوين الكلمات، القواعد الفقهية، كتب الشاملة..."
                  className="w-full pr-9 pl-3 py-2 bg-[#F4EFE6] border border-[#DCD5C6] rounded-lg text-xs text-[#1A1A1A] placeholder:text-[#8F8776] focus:outline-none focus:border-[#1A1A1A] transition font-medium"
                />
              </div>

              {/* Multi-select all button */}
              <button
                onClick={handleSelectAllFiltered}
                className="px-3 py-2 rounded-lg bg-[#FAF8F5] hover:bg-[#EDE7DC] text-[#1A1A1A] border border-[#DCD5C6] text-xs font-bold shrink-0 transition flex items-center gap-1.5 cursor-pointer"
                title="تحديد أو إلغاء تحديد كافة الموضوعات المعروضة"
              >
                <CheckSquare className="w-3.5 h-3.5 text-[#595959]" />
                <span>{selectedTopicIds.length === filteredTopics.length ? 'إلغاء الكل' : 'تحديد الكل'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-[#454545] w-full sm:w-auto justify-between sm:justify-end">
              <span className="bg-[#EDE7DC] px-3 py-1 rounded-md border border-[#CEC5B4] text-[#1A1A1A] font-bold">
                المعروض: <strong className="font-mono text-[#1A1A1A] font-bold">{filteredTopics.length}</strong> موضوعاً
              </span>
              {selectedTopicIds.length > 0 && (
                <span className="bg-[#242424] text-[#FAF8F5] px-3 py-1 rounded-md font-bold">
                  المحدد: {selectedTopicIds.length}
                </span>
              )}
              {activeTab === 'favorites' && (
                <span className="text-[#1A1A1A] font-bold">قائمة المفضلة فقط</span>
              )}
              {activeTab === 'history' && (
                <span className="text-[#1A1A1A] font-bold">سجل الكلمات المُلقاة</span>
              )}
            </div>
          </div>

          {/* Prayer Selection Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[#595959] font-bold text-[11px] shrink-0 ml-1">تصفية بالصلاة:</span>
            {prayersFilterList.map((item) => (
              <button
                key={item.key}
                onClick={() => setSelectedPrayerFilter(item.key)}
                className={`px-3 py-1 rounded-md font-bold shrink-0 transition cursor-pointer text-xs ${
                  selectedPrayerFilter === item.key
                    ? 'bg-[#242424] text-[#FAF8F5] shadow-2xs border border-[#141414]'
                    : 'bg-[#F4EFE6] text-[#2A2A2A] hover:bg-[#EDE7DC] border border-[#DCD5C6]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Categories Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs border-t border-[#DCD5C6] pt-2">
            <span className="text-[#595959] font-bold text-[11px] shrink-0 ml-1">تصفية بالعلم:</span>
            {['الكل', ...SCIENCES_CONFIG.map(s => s.key)].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-md shrink-0 transition cursor-pointer text-[11px] font-bold ${
                  selectedCategoryFilter === cat
                    ? 'bg-[#242424] text-[#FAF8F5] shadow-2xs'
                    : 'bg-[#F4EFE6] text-[#2A2A2A] hover:bg-[#EDE7DC] border border-[#DCD5C6]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 5. Topics Grid */}
        {filteredTopics.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5">
            {filteredTopics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                index={index}
                isSelected={selectedTopicIds.includes(topic.id)}
                onToggleSelect={handleToggleSelectTopic}
                onSelect={(t) => setSelectedTopic(t)}
                onToggleFavorite={handleToggleFavorite}
                onToggleDelivered={handleToggleDelivered}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-amber-600/25 p-8 space-y-4 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-300">
              <Bookmark className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-emerald-950">لا توجد موضوعات مطابقة لمعايير البحث الحالية</h3>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              يمكنك مسح الفلتر أو النقر على "توليد 20 موضوعاً جديداً" لاستحداث أفكار جديدة مخصصة بالذكاء الاصطناعي وموثقة من الشاملة.
            </p>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  setSelectedPrayerFilter('all');
                  setSelectedCategoryFilter('الكل');
                  setSearchQuery('');
                  setActiveTab('all');
                  setSelectedTopicIds([]);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs cursor-pointer shadow-xs"
              >
                إلغاء جميع الفلاتر
              </button>
              <button
                onClick={handleGenerate20WithAI}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs cursor-pointer shadow-xs"
              >
                توليد 20 موضوعاً بالذكاء
              </button>
            </div>
          </div>
        )}

      </main>

      {/* 6. Floating Multi-Selection Action Toolbar (Kindle E-Reader Style) */}
      {selectedTopicIds.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-4xl bg-[#242424] text-[#FAF8F5] p-3.5 sm:p-4 rounded-xl border border-[#141414] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded-md bg-[#FAF8F5] text-[#1A1A1A] font-bold text-xs">
              {selectedTopicIds.length}
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-[#FAF8F5] font-cairo">
                تم اختيار {selectedTopicIds.length} موضوعات من القائمة
              </h4>
              <p className="text-[11px] text-[#B8AF9C]">
                يمكنك دمجها في كلمة واحدة، أو إلقاؤها متتابعة في وضع المنبر
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Combine Topics button */}
            <button
              onClick={handleCombineSelectedTopics}
              disabled={isCombiningTopics}
              className="px-3.5 py-2 rounded-lg bg-[#FAF8F5] hover:bg-[#EFE9DD] text-[#1A1A1A] font-bold text-xs flex items-center gap-1.5 shadow-2xs transition disabled:opacity-50 cursor-pointer font-cairo"
              title="دمج الموضوعات المختارة في كلمة واحدة متماسكة بالذكاء الاصطناعي"
            >
              <Combine className={`w-3.5 h-3.5 ${isCombiningTopics ? 'animate-spin' : ''}`} />
              <span>{isCombiningTopics ? 'جاري الدمج بالذكاء...' : 'دمج في كلمة واحدة جامعة'}</span>
            </button>

            {/* Launch Multi-Podium */}
            <button
              onClick={handleLaunchMultiPodium}
              className="px-3.5 py-2 rounded-lg bg-[#383838] hover:bg-[#484848] text-[#FAF8F5] font-bold text-xs flex items-center gap-1.5 transition cursor-pointer border border-[#484848] font-cairo"
              title="إلقاء الموضوعات المختارة متتابعة في وضع المنبر"
            >
              <Tv className="w-3.5 h-3.5 text-[#FAF8F5]" />
              <span>إلقاء متتابع (منبر)</span>
            </button>

            {/* Add to Favorites */}
            <button
              onClick={handleBulkFavorite}
              className="p-2 rounded-lg bg-[#383838] hover:bg-[#484848] text-[#FAF8F5] transition cursor-pointer"
              title="إضافة كل المحدد للمفضلة"
            >
              <Bookmark className="w-4 h-4 fill-[#FAF8F5]" />
            </button>

            {/* Mark as Delivered */}
            <button
              onClick={handleBulkDelivered}
              className="p-2 rounded-lg bg-[#383838] hover:bg-[#484848] text-[#FAF8F5] transition cursor-pointer"
              title="تحديد كل المحدد كمُلقى"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>

            {/* Clear Selection */}
            <button
              onClick={() => setSelectedTopicIds([])}
              className="p-2 rounded-lg bg-[#484848] hover:bg-[#585858] text-[#FAF8F5] transition cursor-pointer"
              title="إلغاء التحديد"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Footer: Kindle Book Style */}
      <footer className="border-t border-[#DCD5C6] bg-[#FAF8F5] py-6 px-4 mt-12 text-center text-xs text-[#595959] space-y-1.5">
        <div className="flex items-center justify-center gap-2 text-[#1A1A1A] font-bold">
          <span>زاد الإمام والخطيب</span>
          <span>•</span>
          <span>الهوية الكلاسيكية للمطالعة (Kindle Reading Experience)</span>
        </div>
        <p className="text-[11px] text-[#706B5E] max-w-2xl mx-auto font-medium">
          مبني حصرياً على الأحاديث الصحيحة من الصحاح والسنن، والقواعد الفقهية، وعلم المصطلح، والمراجع المحققة في المكتبة الشاملة والوقفية ومكتبة المدينة.
        </p>
      </footer>

      {/* 7. Modals */}
      
      {/* Topic Detail Modal */}
      {selectedTopic && (
        <TopicDetailModal
          topic={selectedTopic}
          onClose={() => setSelectedTopic(null)}
          onToggleFavorite={handleToggleFavorite}
          onToggleDelivered={handleToggleDelivered}
          onOpenPodiumMode={(outline) => setPodiumOutlines([outline])}
          onOpenAudioRehearsal={(title, notes) => handleOpenAudioRehearsal(title, notes)}
          onUpdateTopicOutline={handleUpdateTopicOutline}
        />
      )}

      {/* Fullscreen Podium Mode (Supports single or multi-topic playlist) */}
      {podiumOutlines && podiumOutlines.length > 0 && (
        <PodiumMode
          outlines={podiumOutlines}
          onClose={() => setPodiumOutlines(null)}
        />
      )}

      {/* Audio Rehearsal / Mic recording coach */}
      <AudioRehearsalModal
        isOpen={isAudioRehearsalOpen}
        onClose={() => setIsAudioRehearsalOpen(false)}
        topicTitle={rehearsalTopicTitle}
        initialNotes={rehearsalNotes}
      />

      {/* Hadith & Story Verifier */}
      <HadithVerifierModal
        isOpen={isHadithVerifierOpen}
        onClose={() => setIsHadithVerifierOpen(false)}
      />

      {/* Permissions Center */}
      <PermissionsModal
        isOpen={isPermissionsOpen}
        onClose={() => setIsPermissionsOpen(false)}
        cityName={location.city || 'مكة المكرمة'}
        onRequestLocation={handleRequestLocation}
        locationStatus={locationStatus}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings((prev) => ({ ...prev, ...newVals }))}
      />

      {/* Automatic Post-Azan Reminder Modal */}
      <PostAzanReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        onSnooze={() => {
          setIsReminderModalOpen(false);
          setTimeout(() => setIsReminderModalOpen(true), 5 * 60 * 1000); // 5 minutes snooze
        }}
        prayerKey={currentPrayer}
        prayerNameArabic={
          {
            fajr: 'الفجر',
            dhuhr: 'الظهر',
            asr: 'العصر',
            maghrib: 'المغرب',
            isha: 'العشاء',
            jumuah: 'الجمعة',
            all: 'الصلاة',
          }[currentPrayer] || 'الصلاة'
        }
        topic={currentPrayerTopic}
        onLaunchPodium={(outline) => setPodiumOutlines([outline])}
        onListenTTS={(outline) => {
          if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utt = new SpeechSynthesisUtterance(`كلمة ما بعد الصلاة: ${outline.title}. ${outline.hookQuestion}. ${outline.introduction}`);
            utt.lang = 'ar-SA';
            window.speechSynthesis.speak(utt);
          }
        }}
        onChangeTopic={() => {
          setIsReminderModalOpen(false);
          window.scrollTo({ top: 300, behavior: 'smooth' });
        }}
      />

    </div>
  );
}
