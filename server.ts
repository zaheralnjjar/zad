import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI with recommended telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Endpoint: Generate 20 tailored speech suggestions for a prayer with science specialization & academic documentation
app.post('/api/ai/generate-topics', async (req, res) => {
  try {
    const { prayer = 'عصر', category = 'متنوع شامل', occasion = '', customNote = '' } = req.body;

    const isSpecificScience = category && category !== 'متنوع شامل' && category !== 'الكل' && category !== 'متنوع';

    const prompt = `أنت عالم شريعة ومحقق في التراث الإسلامي وموسوعات كتب السنة والفقه (المكتبة الشاملة، وجامع الكتب الإسلامية، والمكتبة الوقفية، ومكتبة المدينة الرقمية).
المطلوب: توليد قائمة دقيقة وشاملة من 20 موضوعاً واقتراحاً مختلفاً ومتميزاً لكلمة قصيرة (خاطرة بعد الصلاة من 3 إلى 5 دقائق) مخصصة لإمام المسجد.

المحددات الصارمة:
- وقت الصلاة: ${prayer}
${isSpecificScience ? `- العلم المخصص المطلوب حصراً لجميع الموضوعات العشرين: [${category}]. يجب أن تركز كافة الموضوعات الـ 20 بالكامل على هذا العلم بعينه، مع إبراز أسراره وقواعده وتطبيقاته وطرائفه ولطائف الرواة ومسائله!` : `- النمط: [متنوع شامل في علوم الدين]. نوّع الموضوعات الـ 20 عبر: القواعد الفقهية والأصول، علم مصطلح الحديث ولطائف الرواية، التفسير والتدبر واللطائف البلاغية، العقيدة والتوحيد، فقه المعاملات والبيوع، الرقائق وتزكية النفوس، السيرة وفرائد قصص الصحابة والعلماء، تصحيح المفاهيم.`}
${occasion ? `- المناسبة أو الحال: ${occasion}` : ''}
${customNote ? `- ملاحظة إضافية: ${customNote}` : ''}

- التوثيق الأكاديمي والمكتبي:
يجب توثيق كل موضوع بمرجع أكاديمي دقيق مطابق للمصادر المعتمدة في المكتبة الشاملة والجامع والمكتبة الوقفية (مثال: فتح الباري لابن حجر، تهذيب التهذيب، المجموع للنووي، الأشباه والنظائر للسيوطي أو ابن نجيم، مدارج السالكين، التمهيد لابن عبد البر، جامع العلوم والحكم، سير أعلام النبلاء، وغيرها مع ذكر اسم الكتاب، الجزء، والصفحة ورقم المسألة).
- تضمين طرائف ولطائف العلوم (مثل: قاعدة فقهية عجيبة، حديث مسلسل بالمحبة أو التبسم، لطيفة إسنادية كالأقران، سبب ورود، أو أدب عالم جليل).
- شرط الصحة: الاستناد الحصري إلى الأحاديث الصحيحة والحسنة والآثار الثابتة، وتجنب الموضوعات والواهيات.

أخرج النتيجة بصيغة JSON حصراً مطابقة تماماً للمصفوفة التالية:
[
  {
    "id": "topic-unique-id",
    "title": "عنوان جذاب ورصين للكلمة",
    "category": "${isSpecificScience ? category : 'اسم العلم المحدد'}",
    "targetPrayer": "${prayer}",
    "estimatedDuration": "3-5 دقائق",
    "hookQuestion": "سؤال افتتاحي ذكي يشد انتباه المصلين",
    "shortSummary": "ملخص الفكرة والهدف بعبارة مركزة",
    "quranReference": "آية مع السورة",
    "hadithReference": "طرف الحديث الصحيح ومخرجه الدقيق",
    "academicReference": "التوثيق الأكاديمي المكتبي (اسم الكتاب، المؤلف، الجزء، الصفحة في الشاملة)",
    "scienceCuriosityPreview": "طريفة أو لطيفة علمية سريعة (من طرائف المصطلح أو القواعد أو السير)"
  }
]
أرجع 20 عنصراً بالضبط. لا تكتب أي مقدمات أو هوامش خارج الـ JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '[]';
    let topics = [];
    try {
      topics = JSON.parse(text);
    } catch {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        topics = JSON.parse(match[0]);
      }
    }

    res.json({ success: true, topics });
  } catch (error: any) {
    console.error('Error generating topics:', error);
    res.status(500).json({ success: false, error: error.message || 'فشل في توليد الموضوعات' });
  }
});

// Endpoint: Generate comprehensive verified outline with full Academic Documentation (Shamela, Jamea, Waqfeya)
app.post('/api/ai/generate-outline', async (req, res) => {
  try {
    const { title, category, prayer = 'عام' } = req.body;

    const prompt = `أنت عالم ومحقق تراث وباحث متخصص في كتب السنة والفقه المطبوعة والمحققة في المكتبة الشاملة، جامع الكتب الإسلامية، والمكتبة الوقفية.
المطلوب: إعداد مخطط تفصيلي متكامل وموثق توثيقاً أكاديمياً مكتبياً لكلمة بعد الصلاة بعنوان: "${title}" في مجال "${category}" لصلاة "${prayer}".
المدة: من 3 إلى 5 دقائق.

الشروط والمحتويات:
1. التوثيق الأكاديمي المكتبي الدقيق (Academic Documentation):
   - اسم الكتاب بدقة تامة.
   - المؤلف والمحقق ودار النشر المعتمدة في الشاملة والوقفية.
   - الجزء ورقم الصفحة ورقم الحديث أو المسألة.
   - صيغة التوثيق الأكاديمي (Citation APA / التوثيق التراثي).
2. طريفة أو لطيفة علمية (Science Curiosity): لطيفة من علم مصطلح الحديث، أو قاعدة فقهية جامعة، أو طرفة من طرائف المحدثين والفقهاء لشد انتباه المصلين وإثراء الكلمة.
3. الاعتماد الحصري على الأحاديث الصحيحة والحسنة مع التخريج الدقيق (البخاري، مسلم، السنن الصحيحة، مسند أحمد، كتب الألباني وشعيب الأرنؤوط).
4. الآيات القرآنية مع لفتة تفسيرية وتدبرية (من تفسير الطبري، القرطبي، ابن كثير، أو السعدي).
5. نقولات كبار الأئمة والفقهاء موثقة بالأجزاء والصفحات.
6. خطوات عملية واقعية ودعاء ختامي جامع.

أخرج النتيجة بصيغة JSON حصراً بهذا الهيكل:
{
  "title": "${title}",
  "category": "${category}",
  "estimatedDuration": "3-5 دقائق",
  "hookQuestion": "سؤال افتتاحي يشد انتباه المصلين",
  "introduction": "مقدمة افتتاحية سريعة وبراعة استهلال",
  "scienceCuriosity": "طريفة أو لطيفة علمية محررة من طرائف الرواة أو القواعد الفقهية أو لطائف البلاغة",
  "quranAyat": [
    {
      "text": "نص الآية القرآنية بالشكل التام",
      "surah": "اسم السورة",
      "ayahNumber": "رقم الآية",
      "briefTafseer": "لفتة تدبرية أو تفسير ميسر",
      "tafseerReference": "اسم كتاب التفسير والجزء والصفحة"
    }
  ],
  "sahihHadiths": [
    {
      "matn": "متن الحديث الصحيح كاملاً ومضبوطاً",
      "takhrij": "التخريج الدقيق (مثال: صحيح البخاري برقم ... وصحيح مسلم برقم ...)",
      "sharhMoyassar": "المعنى المستفاد للمصلين",
      "shamelaSource": "مرجع الشاملة والوقفية: اسم الكتاب والجزء والصفحة"
    }
  ],
  "sahihStory": {
    "title": "عنوان القصة أو الأثر الصحيح",
    "narrator": "الراوي أو بطل القصة من الصحابة والتابعين",
    "storyText": "سرد القصة بأسلوب موجز ومؤثر",
    "authenticityNote": "توثيق القصة وصحتها في كتب التراجم والمصنفات",
    "academicSource": "الكتاب والمؤلف والجزء والصفحة"
  },
  "scholarQuotes": [
    {
      "scholar": "اسم العالم (مثلاً: الإمام ابن القيم رحمه الله)",
      "quote": "نص القول",
      "sourceBook": "اسم الكتاب",
      "shamelaPageRef": "الجزء والصفحة ورقم المجلد في الشاملة"
    }
  ],
  "practicalTakeaways": [
    "تطبيق عملي فوري بعد الصلاة",
    "سلوك في البيت ومع الأهل",
    "تنبيه عن خطأ شائع"
  ],
  "concludingDua": "دعاء ختامي جامع ومؤثر",
  "academicDoc": {
    "bookTitle": "اسم الكتاب الأبرز لهذا الموضوع",
    "author": "اسم المؤلف",
    "volume": "رقم الجزء إن وجد",
    "page": "رقم الصفحة إن وجد",
    "hadithOrIssueNo": "رقم الحديث أو المسألة",
    "investigatorAndPublisher": "تحقيق ودار النشر",
    "shamelaSearchQuery": "النص أو الكلمات المفتاحية للبحث المباشر في الشاملة",
    "shamelaUrl": "رابط مباشر للبحث في shamela.ws",
    "alJameaUrl": "رابط مباشر للبحث في جامع الكتب الإسلامية",
    "waqfeyaUrl": "رابط مباشر للبحث في المكتبة الوقفية",
    "madinaLibraryUrl": "رابط مباشر للبحث في مكتبة المدينة الرقمية",
    "citationAPA": "التوثيق الكامل: المؤلف. (سنة النشر). عنوان الكتاب. المحقق. دار النشر، ج..، ص.."
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let outline = {};
    try {
      outline = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        outline = JSON.parse(match[0]);
      }
    }

    res.json({ success: true, outline });
  } catch (error: any) {
    console.error('Error generating outline:', error);
    res.status(500).json({ success: false, error: error.message || 'فشل في إنشاء المخطط' });
  }
});

// Endpoint: Combine multiple selected topics into a unified cohesive speech outline
app.post('/api/ai/combine-topics', async (req, res) => {
  try {
    const { selectedTopics = [], prayer = 'عام' } = req.body;
    if (!selectedTopics.length) {
      return res.status(400).json({ success: false, error: 'يرجى تحديد موضوعين على الأقل للدمج' });
    }

    const topicsListStr = selectedTopics
      .map((t: any, i: number) => `${i + 1}. [${t.category}] ${t.title} - ${t.shortSummary || ''}`)
      .join('\n');

    const prompt = `أنت عالم شريعة وخطيب مفوه وباحث ومحقق في موسوعات التراث (المكتبة الشاملة والجامع والوقفية).
قام إمام المسجد باختيار الموضوعات التالية من القائمة ويريد دمجها في "كلمة واحدة جامعة ومترابطة" (خاطرة موحدة مدتها من 3 إلى 5 دقائق):

الموضوعات المختارة:
${topicsListStr}

المطلوب: صياغة مخطط إلقاء موحد وبديع يربط بين هذه الموضوعات بسلاسة فائقة، معتمداً حصرياً على الأحاديث الصحيحة، وتوثيق الشاملة، وقواعد الشريعة، ولطائف العلم.

أخرج النتيجة بصيغة JSON حصراً بهذا الهيكل:
{
  "title": "عنوان جامع وجذاب يدمج محاور الكلمات المختارة",
  "category": "موضوع جامع (متنوع)",
  "estimatedDuration": "4-5 دقائق",
  "hookQuestion": "سؤال افتتاحي ذكي يربط بين محاور الموضوعات المختارة",
  "introduction": "مقدمة جامعة رصينة تمهد لربط الموضوعات",
  "scienceCuriosity": "لطيفة أو طريفة علمية مشتركة (من القواعد الفقهية أو مصطلح الحديث)",
  "quranAyat": [
    {
      "text": "نص الآية القرآنية الجامعة",
      "surah": "اسم السورة",
      "ayahNumber": "رقم الآية",
      "briefTafseer": "لفتة تدبرية تربط بين المحاور",
      "tafseerReference": "اسم التفسير والجزء والصفحة"
    }
  ],
  "sahihHadiths": [
    {
      "matn": "متن حديث صحيح رئيس يجمع المعنى",
      "takhrij": "التخريج الدقيق (صحيح البخاري / مسلم)",
      "sharhMoyassar": "المعنى المستفاد للمصلين",
      "shamelaSource": "مرجع الشاملة والجامع"
    }
  ],
  "scholarQuotes": [
    {
      "scholar": "اسم العالم (مثلاً: الإمام ابن القيم أو النووي)",
      "quote": "نص القول الجامع",
      "sourceBook": "اسم الكتاب",
      "shamelaPageRef": "الجزء والصفحة"
    }
  ],
  "practicalTakeaways": [
    "تطبيق عملي 1 يجمع بين الموضوعين",
    "تطبيق عملي 2",
    "تطبيق عملي 3"
  ],
  "concludingDua": "دعاء ختامي شامل",
  "academicDoc": {
    "bookTitle": "المصنفات المعتمدة في الشاملة والجامع",
    "author": "أئمة الحديث والفقه",
    "volume": "1",
    "page": "1",
    "hadithOrIssueNo": "جامع المسائل",
    "investigatorAndPublisher": "طبعات الشاملة المعتمدة",
    "shamelaSearchQuery": "كلمات مفتاحية للبحث المباشر",
    "shamelaUrl": "https://shamela.ws",
    "alJameaUrl": "https://al-maktaba.org",
    "waqfeyaUrl": "https://waqfeya.net",
    "madinaLibraryUrl": "https://qurancomplex.gov.sa",
    "citationAPA": "توثيق أكاديمي مركب."
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let combinedOutline = {};
    try {
      combinedOutline = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        combinedOutline = JSON.parse(match[0]);
      }
    }

    res.json({ success: true, combinedOutline });
  } catch (error: any) {
    console.error('Error combining topics:', error);
    res.status(500).json({ success: false, error: error.message || 'فشل في دمج الموضوعات' });
  }
});

// Endpoint: Verify Hadith / Story Authenticity with Academic Shamela links
app.post('/api/ai/verify-hadith', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, error: 'النص مطلوب للتحقق' });
    }

    const prompt = `أنت عالم حديث وباحث متخصص في تخريج الأحاديث وبيان عللها ورواياتها عبر كتب التراث والموسوعات (المكتبة الشاملة والجامع والمكتبة الوقفية).
الاستفسار المقدم من إمام المسجد:
"${query}"

المطلوب التحقق التام والدقيق:
1. حكم الحديث أو الأثر (صحيح، حسن، ضعيف، موضوع، لا أصل له).
2. التخريج الدقيق مع أسماء الكتب والمصادر في الشاملة والمكتبة الوقفية مع أرقام الأحاديث والأجزاء والصفحات.
3. التوثيق الأكاديمي المكتبي الكامل.
4. المعنى والشرح الميسر.
5. توجيه للإمام: هل يجوز إيراده في الموعظة؟
6. بديل صحيح موثوق إن كان ضعيفاً.
7. لطيفة أو طريفة علمية تتعلق برواة هذا الحديث أو سياقه في كتب المصطلح والجرح والتعديل.

أخرج النتيجة بصيغة JSON:
{
  "query": "${query}",
  "ruling": "صحيح / حسن / ضعيف / موضوع / لا أصل له",
  "statusColor": "green / amber / red",
  "takhrij": "التخريج الدقيق مع أسماء الكتب والمحدثين",
  "academicCitation": "التوثيق الأكاديمي مع الجزء والصفحة في الشاملة والوقفية",
  "fullText": "اللفظ الصحيح الثابت للحديث",
  "explanation": "شرح المعنى باختصار",
  "imamGuidance": "توجيه وتوصية للإمام في مسجده",
  "authenticAlternative": "بديل صحيح وموثوق",
  "hadithAnecdote": "لطيفة أو طريفة علمية حول رواة هذا الحديث أو مصطلحه"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let result = {};
    try {
      result = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      }
    }

    res.json({ success: true, result });
  } catch (error: any) {
    console.error('Error verifying hadith:', error);
    res.status(500).json({ success: false, error: error.message || 'فشل في التحقق من الحديث' });
  }
});

// Endpoint: AI Rehearsal Coach & Speech Delivery Evaluator
app.post('/api/ai/analyze-speech', async (req, res) => {
  try {
    const { speechText, recordedDurationSeconds = 0, topicTitle = '' } = req.body;

    const prompt = `أنت مدرب خطباء وإلقاء معتمد وخبير في التوجيه الدعوي لأئمة المساجد.
قام إمام المسجد بإلقاء أو تسجيل كلمة تجريبية بعد الصلاة بعنوان: "${topicTitle}".
مدة التسجيل: ${recordedDurationSeconds} ثانية (${Math.round(recordedDurationSeconds / 60)} دقيقة).
نص الكلمة أو ملخص ما قاله الإمام:
"${speechText}"

المطلوب تقييم الإلقاء بموضوعية وبناء ودقة:
1. الالتزام بالوقت المناسب (الحد المثالي لخاطرة بعد الصلاة: من 3 إلى 5 دقائق حتى لا يُشق على المصلين).
2. الفصاحة وسلامة اللغة ونبرة الصوت المقترحة.
3. التوثيق وصحة الاستدلال.
4. درجة ملامسة قلوب المصلين وجذب انتباههم.
5. 3 نصائح عملية فورية لتحسين الإلقاء في المسجد.

أخرج النتيجة بصيغة JSON:
{
  "overallScore": 88,
  "timingAssessment": "تقييم المدة",
  "timingStatus": "optimal / too_long / too_short",
  "strengths": ["نقطة قوة 1", "نقطة قوة 2"],
  "improvementTips": ["نصيحة تطويرية 1", "نصيحة تطويرية 2", "نصيحة تطويرية 3"],
  "languageAndToneAdvice": "توجيه حول النبرة والفصاحة",
  "congregationReactionPrediction": "توقع أثر الكلمة على المصلين وتفاعلهم"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let feedback = {};
    try {
      feedback = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        feedback = JSON.parse(match[0]);
      }
    }

    res.json({ success: true, feedback });
  } catch (error: any) {
    console.error('Error analyzing speech:', error);
    res.status(500).json({ success: false, error: error.message || 'فشل في تقييم الكلمة' });
  }
});

// Endpoint: Instant Smart Suggestions Bar Generator with Science Curiosities & Shamela Links
app.post('/api/ai/smart-suggestions', async (req, res) => {
  try {
    const { currentPrayer = 'عصر', currentTime = '', dayOfWeek = 'الأحد', locationName = '' } = req.body;

    const prompt = `أنت نظام الذكاء الاصطناعي الذكي والملازم لإمام المسجد، المعتمد على الموسوعات الإسلامية الشاملة وجامع الكتب الإسلامية.
السياق: صلاة ${currentPrayer}، يوم ${dayOfWeek}، الوقت: ${currentTime}.

المطلوب توليد 4 اقتراحات ذكية لحظية فورية:
1. موضوع ذهبي مناسب للحظة مع بيان العلم الفقهي أو الأصولي الخاص به.
2. نصيحة إلقاء وبلاغة منبرية ذكية.
3. كبسولة نبوية صحيحة موثقة في الشاملة.
4. طريفة أو لطيفة علمية من لطائف علم المصطلح أو القواعد الفقهية أو فرائد الرواة لإمتاع المصلين وإفادتهم.

أخرج النتيجة بصيغة JSON:
{
  "timelyTopic": {
    "title": "عنوان الموضوع المناسب للحظة",
    "reason": "لماذا هذا الموضوع مناسب الآن؟",
    "scienceType": "نوع العلم (قواعد فقهية / مصطلح / تفسير / رقائق...)"
  },
  "imamWisdomTip": "نصيحة ذكية خاصة بالإمام لهذا الوقت",
  "quickSahihHadith": {
    "matn": "متن حديث صحيح قصير مؤثر",
    "source": "التخريج الدقيق ورقم المجلد والصفحة"
  },
  "congregationEngagementIdea": "فكرة تفاعلية لشد انتباه المصلين",
  "scienceCuriosityNugget": "طريفة أو لطيفة علمية نادرة ومحررة (من طرائف المصطلح أو القواعد)"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    let suggestions = {};
    try {
      suggestions = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) {
        suggestions = JSON.parse(match[0]);
      }
    }

    res.json({ success: true, suggestions });
  } catch (error: any) {
    console.error('Error generating smart suggestions:', error);
    res.status(500).json({ success: false, error: error.message || 'فشل في جلب الاقتراحات الذكية' });
  }
});

// Endpoint: Translate individual speech item into simple, clear Spanish (strictly literal and direct)
app.post('/api/ai/translate-spanish', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, error: 'النص مطلوب للترجمة' });
    }

    const prompt = `أنت مترجم فوري مباشر ومحترف.
المطلوب: ترجمة النص العربي التالي ترجمة مباشرة، حرفية ودقيقة إلى اللغة الإسبانية البسيطة والواضحة (Español sencillo y directo).

النص العربي:
"${text}"

شروط صارمة وإلزامية:
1. ترجمة مباشرة وحرفية فقط للنص دون أي تصرف خارج المعنى.
2. ممنوع منعاً باتاً كتابة أي مقدمات أو شروحات أو عبارات وعظية مثل: "Este mensaje nos enseña..." أو "هذه الرسالة تعلمنا" أو "En este versículo...". لا تضف أي كلمة لم يقلها النص.
3. لغة إسبانية بسيطة ومفهومة جداً.
4. أخرج فقط الترجمة داخل JSON.

أخرج النتيجة بصيغة JSON حصراً:
{
  "translation": "Traducción directa y sencilla al español aquí"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1,
      },
    });

    const textRes = response.text || '{}';
    let data = { translation: '' };
    try {
      data = JSON.parse(textRes);
    } catch {
      const match = textRes.match(/\{[\s\S]*\}/);
      if (match) data = JSON.parse(match[0]);
    }

    // Clean up any stray conversational prefix just in case
    let cleaned = (data.translation || '').trim();
    cleaned = cleaned.replace(/^(Este mensaje nos enseña|Esta frase nos enseña|Este texto nos enseña|Nos enseña que|هذه الرسالة تعلمنا|هذا يعلمنا)[:\s-]*/i, '');

    res.json({ success: true, translation: cleaned || data.translation || textRes });
  } catch (error: any) {
    console.error('Error translating to Spanish:', error);
    res.status(500).json({ success: false, error: error.message || 'فشل في الترجمة إلى الإسبانية' });
  }
});

// Endpoint: Extract Islamic and general terms with 3-column Spanish table
app.post('/api/ai/extract-terminology', async (req, res) => {
  try {
    const { title = '', category = '', fullText = '' } = req.body;

    const prompt = `أنت خبير في المصطلحات الإسلامية واللغة الإسبانية.
قام إمام المسجد بإلقاء كلمة بعنوان: "${title}" في مجال "${category}".
محتوى الكلمة:
${fullText}

المطلوب: استخراج أهم وأبرز المصطلحات الدينية والعامة الواردة في هذه الكلمة، وترجمتها وشرحها باللغة الإسبانية على شكل جدول تعليمي للمصلين الناطقين بالإسبانية.
يجب أن يحتوي الجدول على الأعمدة الثلاثة التالية:
1. العمود الأول: المصطلح باللغة العربية (Término en árabe)
2. العمود الثاني: الترجمة والشرح باللغة الإسبانية البسيطة (Traducción y explicación sencilla en español)
3. العمود الثالث: مثال توضيحي وسياق الاستخدام (Ejemplo de uso práctico)

استخرج بين 5 إلى 8 مصطلحات أساسية بارزة.

أخرج النتيجة بصيغة JSON حصراً:
{
  "topicTitle": "${title}",
  "terms": [
    {
      "arabic": "النية (An-Niyyah)",
      "spanish": "La intención sincera del corazón antes de realizar cualquier acto de adoración.",
      "example": "«إنما الأعمال بالنيات» - Las acciones valen según las intenciones."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const textRes = response.text || '{}';
    let data = { terms: [] };
    try {
      data = JSON.parse(textRes);
    } catch {
      const match = textRes.match(/\{[\s\S]*\}/);
      if (match) data = JSON.parse(match[0]);
    }

    res.json({ success: true, terms: data.terms || [] });
  } catch (error: any) {
    console.error('Error extracting terminology:', error);
    res.status(500).json({ success: false, error: error.message || 'فشل في استخراج المصطلحات' });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Only start the standalone HTTP listener when not inside a Vercel serverless container
if (!process.env.VERCEL) {
  startServer();
}

export default app;

