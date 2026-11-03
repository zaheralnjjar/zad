export type PrayerKey = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha' | 'jumuah' | 'all';

export type CategoryKey = 
  | 'متنوع شامل'
  | 'القواعد الفقهية والأصول'
  | 'علم المصطلح وطرائف الرواية'
  | 'عقيدة وتوحيد'
  | 'تفسير وتدبر ولطائف بلاغية'
  | 'فقه العبادات'
  | 'فقه المعاملات والبيوع'
  | 'رقائق وتزكية النفوس'
  | 'سيرة وفرائد قصص الصحابة'
  | 'أخلاق وأسرة'
  | 'تصحيح مفاهيم وأحاديث'
  | 'آداب المسجد';

export interface AcademicDocumentation {
  bookTitle: string;
  author: string;
  volume?: string | number;
  page?: string | number;
  hadithOrIssueNo?: string | number;
  investigatorAndPublisher?: string;
  shamelaSearchQuery: string;
  shamelaUrl: string;
  alJameaUrl: string;
  waqfeyaUrl: string;
  madinaLibraryUrl: string;
  citationAPA: string;
}

export interface QuranAyah {
  text: string;
  surah: string;
  ayahNumber: string | number;
  briefTafseer: string;
  tafseerReference?: string;
}

export interface SahihHadith {
  matn: string;
  takhrij: string;
  sharhMoyassar: string;
  shamelaSource?: string;
}

export interface SahihStory {
  title: string;
  narrator: string;
  storyText: string;
  authenticityNote: string;
  academicSource?: string;
}

export interface ScholarQuote {
  scholar: string;
  quote: string;
  sourceBook: string;
  shamelaPageRef?: string;
}

export interface TopicOutline {
  title: string;
  category: string;
  estimatedDuration: string;
  hookQuestion: string;
  introduction: string;
  quranAyat: QuranAyah[];
  sahihHadiths: SahihHadith[];
  sahihStory?: SahihStory;
  scholarQuotes: ScholarQuote[];
  practicalTakeaways: string[];
  concludingDua: string;
  academicDoc?: AcademicDocumentation;
  scienceCuriosity?: string; // طريفة أو لطيفة من لطائف العلم (مصطلح / أصول / بلاغة)
}

export interface TopicSuggestion {
  id: string;
  title: string;
  category: CategoryKey;
  targetPrayer: PrayerKey;
  estimatedDuration: string;
  hookQuestion: string;
  shortSummary: string;
  quranReference?: string;
  hadithReference?: string;
  academicReference?: string;
  scienceCuriosityPreview?: string; // لفتة أو طريفة علمية سريعة
  outline?: TopicOutline;
  isFavorite?: boolean;
  isDelivered?: boolean;
  deliveredAt?: string;
}

export interface PrayerTime {
  key: PrayerKey;
  arabicName: string;
  time: string; // HH:MM
  isNext: boolean;
  minutesLeft: number;
}

export interface SmartSuggestionsData {
  timelyTopic: {
    title: string;
    reason: string;
    scienceType?: string;
  };
  imamWisdomTip: string;
  quickSahihHadith: {
    matn: string;
    source: string;
  };
  congregationEngagementIdea: string;
  scienceCuriosityNugget?: string; // طريفة علمية سريعة من الشاملة والجامع
}

export interface AppSettings {
  prayerCalculationMethod: 'MWL' | 'Makkah' | 'Egypt' | 'ISNA';
  fontSize: 'normal' | 'large' | 'huge';
  enableAudioTTS: boolean;
  ttsSpeed: number;
  autoScrollSpeed: number;
  podiumTimerMinutes: number;
  showSmartBanner: boolean;
  preferredLibrarySource: 'shamela' | 'aljamea' | 'waqfeya' | 'madina';
  enablePostAzanReminder: boolean;
  reminderDelayMinutes: number; // 0: مباشرة بعد الأذان, 5: بعد 5 دقائق, 15: بعد الصلاة
  enableChimeSound: boolean;
}
