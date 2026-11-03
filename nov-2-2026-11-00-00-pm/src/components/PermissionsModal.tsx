import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Mic, 
  Volume2, 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck
} from 'lucide-react';

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
  onRequestLocation: () => void;
  locationStatus: 'granted' | 'denied' | 'prompt';
}

export const PermissionsModal: React.FC<PermissionsModalProps> = ({
  isOpen,
  onClose,
  cityName,
  onRequestLocation,
  locationStatus,
}) => {
  const [micStatus, setMicStatus] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [notifStatus, setNotifStatus] = useState<NotificationPermission>('default');
  const [soundTestPlaying, setSoundTestPlaying] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setNotifStatus(Notification.permission);
    }

    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'microphone' as any })
        .then((res) => {
          setMicStatus(res.state as any);
          res.onchange = () => setMicStatus(res.state as any);
        })
        .catch(() => {});
    }
  }, []);

  if (!isOpen) return null;

  const handleRequestMic = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicStatus('granted');
      stream.getTracks().forEach((track) => track.stop());
    } catch {
      setMicStatus('denied');
    }
  };

  const handleRequestNotifications = async () => {
    if (!('Notification' in window)) {
      alert('الإشعارات غير مدعومة في هذا المتصفح');
      return;
    }
    const perm = await Notification.requestPermission();
    setNotifStatus(perm);
    if (perm === 'granted') {
      new Notification('زاد الإمام والخطيب', {
        body: 'تم تفعيل التنبيهات بنجاح! سنذكرك بموضوع الكلمة قبل موعد الصلاة.',
        icon: '/favicon.ico',
      });
    }
  };

  const handleTestSound = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance('زاد الإمام والخطيب. تم اختبار الصوت والقراءة الآلية بنجاح.');
    utt.lang = 'ar-SA';
    utt.onstart = () => setSoundTestPlaying(true);
    utt.onend = () => setSoundTestPlaying(false);
    utt.onerror = () => setSoundTestPlaying(false);
    window.speechSynthesis.speak(utt);
  };

  const getStatusBadge = (status: 'granted' | 'denied' | 'prompt' | 'default') => {
    if (status === 'granted') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-700" />
          <span>مُفعّل وممنوح</span>
        </span>
      );
    }
    if (status === 'denied') {
      return (
        <span className="flex items-center gap-1 text-[11px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full border border-rose-300">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          <span>مرفوض من المتصفح</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
        <span>بانتظار الإذن</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs overflow-y-auto animate-fade-in text-slate-800">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#fdfcf9] border-2 border-amber-500/40 shadow-2xl overflow-hidden my-auto">
        
        {/* Top gold bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-800 via-amber-500 to-emerald-800" />

        {/* Header */}
        <div className="px-5 py-4 border-b border-amber-600/20 bg-[#f7f4ea] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300">
              <ShieldCheck className="w-5 h-5 text-emerald-800" />
            </div>
            <div>
              <h2 className="text-base font-bold font-cairo text-emerald-950">
                مركز الأذونات وتكامل النظام
              </h2>
              <p className="text-xs text-slate-600">
                إدارة أذونات الموقع، الميكروفون، الصوت، والإشعارات لتشغيل جميع الميزات
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

        {/* Body Items */}
        <div className="p-5 space-y-4 text-right text-xs">
          
          {/* Permission 1: Geolocation */}
          <div className="bg-white p-4 rounded-2xl border border-amber-600/25 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                <MapPin className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-emerald-950 text-sm">إذن الموقع الجغرافي (GPS)</h3>
                  {getStatusBadge(locationStatus)}
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                  لحساب مواقيت الصلاة الفلكية بدقة في مدينتك، وتحديد اتجاه القبلة، واقتراح مواضيع الصلاة الحالية تلقائياً.
                </p>
                <span className="text-amber-800 text-[10px] font-bold block mt-1">
                  الموقع الحالي: {cityName}
                </span>
              </div>
            </div>

            <button
              onClick={onRequestLocation}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
            >
              تحديث الموقع
            </button>
          </div>

          {/* Permission 2: Microphone */}
          <div className="bg-white p-4 rounded-2xl border border-amber-600/25 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                <Mic className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-emerald-950 text-sm">إذن الميكروفون والتسجيل</h3>
                  {getStatusBadge(micStatus)}
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                  لتسجيل تدريبك على إلقاء الكلمة، ورسم الذبذبات الصوتية الحية، وتقديم التحليل الصوتي الذكي.
                </p>
              </div>
            </div>

            <button
              onClick={handleRequestMic}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
            >
              منح الإذن
            </button>
          </div>

          {/* Permission 3: Sound / TTS */}
          <div className="bg-white p-4 rounded-2xl border border-amber-600/25 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                <Volume2 className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-emerald-950 text-sm">إذن الصوت والقراءة الآلية (TTS)</h3>
                  <span className="text-[11px] font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                    جاهز ومُفعّل
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                  لقراءة المخططات والأحاديث صوتياً بنطق عربي سليم أثناء تنقلك أو مراجعتك قبل الصلاة.
                </p>
              </div>
            </div>

            <button
              onClick={handleTestSound}
              disabled={soundTestPlaying}
              className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {soundTestPlaying ? 'جاري التشغيل...' : 'تجربة الصوت'}
            </button>
          </div>

          {/* Permission 4: Notifications */}
          <div className="bg-white p-4 rounded-2xl border border-amber-600/25 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800 shrink-0 mt-0.5">
                <Bell className="w-5 h-5 text-emerald-800" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-emerald-950 text-sm">إشعارات التذكير بالكلمة</h3>
                  {getStatusBadge(notifStatus as any)}
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
                  لإرسال تنبيه قبل أذان الصلاة باقتراح فكرة كلمة دعوية سريعة وموثقة.
                </p>
              </div>
            </div>

            <button
              onClick={handleRequestNotifications}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs"
            >
              تفعيل التنبيهات
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-amber-600/20 bg-[#f7f4ea] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition cursor-pointer shadow-xs"
          >
            تم وحفظ الإعدادات
          </button>
        </div>

      </div>
    </div>
  );
};
