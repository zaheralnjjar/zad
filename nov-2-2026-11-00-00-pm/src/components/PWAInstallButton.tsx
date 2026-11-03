import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Check, 
  X, 
  Share, 
  MoreVertical, 
  Monitor, 
  PlusSquare, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'header' | 'banner' | 'card';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  variant = 'header',
  className = ''
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(
    isIOS ? 'ios' : 'android'
  );

  const handleClick = async () => {
    if (isInstallable) {
      const accepted = await install();
      if (!accepted) {
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  // If already installed, hide completely as requested (no "مثبت" text anywhere on screen)
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {variant === 'banner' ? null : (
        /* Kindle E-Reader Style Header button */
        <button
          onClick={handleClick}
          className={`inline-flex items-center justify-center gap-1.5 h-8.5 px-3 rounded-lg bg-[#242424] hover:bg-[#0f0f0f] text-[#F6F3EB] font-bold text-xs shadow-2xs transition cursor-pointer border border-[#1a1a1a] shrink-0 font-cairo ${className}`}
          title="تثبيت التطبيق على الشاشة الرئيسية للعمل دون إنترنت"
        >
          <Download className="w-3.5 h-3.5 text-[#E5DFD3] shrink-0" />
          <span className="whitespace-nowrap">
            <span className="sm:hidden">تثبيت</span>
            <span className="hidden sm:inline">تثبيت على الشاشة</span>
          </span>
        </button>
      )}

      {/* High-Fidelity Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-5 animate-fade-in text-slate-800">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#fdfcf9] border-2 border-amber-500/50 shadow-2xl overflow-hidden my-auto text-right">
            
            {/* Top gold bar */}
            <div className="h-2.5 bg-gradient-to-r from-emerald-800 via-amber-400 to-emerald-800" />

            {/* Header */}
            <div className="px-5 py-4 border-b border-amber-600/20 bg-[#f7f4ea] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-800 text-amber-300">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-cairo text-emerald-950 flex items-center gap-1.5">
                    تثبيت على الشاشة الرئيسية
                    <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                      PWA
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600">
                    يعمل كتطبيق هاتف سريع ومستقل دون شريط عناوين
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowGuideModal(false)}
                className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-500 border border-amber-900/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* OS Selection Tabs */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-3 gap-2 bg-[#f0ebd9] p-1.5 rounded-2xl border border-amber-600/20 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('android')}
                  className={`py-2 px-1 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'android'
                      ? 'bg-emerald-800 text-amber-300 shadow-xs'
                      : 'text-slate-700 hover:text-emerald-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>أندرويد</span>
                </button>

                <button
                  onClick={() => setActiveTab('ios')}
                  className={`py-2 px-1 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'ios'
                      ? 'bg-emerald-800 text-amber-300 shadow-xs'
                      : 'text-slate-700 hover:text-emerald-900'
                  }`}
                >
                  <Share className="w-3.5 h-3.5" />
                  <span>آيفون (iOS)</span>
                </button>

                <button
                  onClick={() => setActiveTab('desktop')}
                  className={`py-2 px-1 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'desktop'
                      ? 'bg-emerald-800 text-amber-300 shadow-xs'
                      : 'text-slate-700 hover:text-emerald-900'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  <span>الكمبيوتر</span>
                </button>
              </div>

              {/* Tab 1: Android */}
              {activeTab === 'android' && (
                <div className="space-y-3 animate-fade-in text-xs text-slate-700">
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-emerald-950">
                        فتح قائمة المتصفح (Chrome أو سامسونج):
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        اضغط على النقاط الثلاث <MoreVertical className="w-3.5 h-3.5 inline text-emerald-800" /> في أعلى يسار أو أسفل المتصفح.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-bold text-emerald-950">
                        اختيار أمر التثبيت:
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        اختر <strong>«تثبيت التطبيق» (Install app)</strong> أو <strong>«إضافة إلى الشاشة الرئيسية»</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#f7f5ee] border border-amber-600/20 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-bold text-emerald-950">
                        تأكيد التثبيت:
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        اضغط <strong>«تثبيت»</strong>؛ وستظهر أيقونة «زاد الإمام» على شاشة هاتفك الرئيسية فوراً!
                      </p>
                    </div>
                  </div>

                  {isInstallable && (
                    <button
                      onClick={async () => {
                        await install();
                        setShowGuideModal(false);
                      }}
                      className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-900 text-amber-300 font-bold text-xs shadow-md border border-amber-400 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 animate-bounce" />
                      <span>اضغط هنا لبدء التثبيت التلقائي الآن</span>
                    </button>
                  )}
                </div>
              )}

              {/* Tab 2: iOS (Safari) */}
              {activeTab === 'ios' && (
                <div className="space-y-3 animate-fade-in text-xs text-slate-700">
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-emerald-950">
                        زر المشاركة في متصفح سفاري (Safari):
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        انقر على أيقونة المشاركة <Share className="w-3.5 h-3.5 inline mx-1 text-emerald-800" /> في الشريط السفلي للآيفون أو أعلى الآيباد.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-bold text-emerald-950">
                        إضافة إلى الشاشة الرئيسية:
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        مرر القائمة لأسفل ثم اضغط على <strong>«إضافة إلى الصفحة الرئيسية» (Add to Home Screen <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-emerald-800" />)</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#f7f5ee] border border-amber-600/20 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div>
                      <p className="font-bold text-emerald-950">
                        التأكيد والحفظ:
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        اضغط <strong>«إضافة (Add)»</strong> في الزاوية العلوية؛ وسيصبح التطبيق متاحاً كتطبيق أصيل على شاشة هاتفك مع سائر التطبيقات.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Desktop */}
              {activeTab === 'desktop' && (
                <div className="space-y-3 animate-fade-in text-xs text-slate-700">
                  <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div>
                      <p className="font-bold text-emerald-950">
                        أيقونة شريط العنوان (URL):
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        في متصفح كروم أو إيدج (Chrome / Edge)، انقر على أيقونة التثبيت <strong>⊕</strong> أو شاشة الكمبيوتر في أقصى يمين شريط العنوان.
                      </p>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-800 text-amber-300 font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div>
                      <p className="font-bold text-emerald-950">
                        من قائمة المتصفح (⋮):
                      </p>
                      <p className="text-slate-600 mt-0.5">
                        يمكنك أيضاً فتح قائمة المتصفح ثم اختيار <strong>«تثبيت زاد الإمام والخطيب...»</strong>.
                      </p>
                    </div>
                  </div>

                  {isInstallable && (
                    <button
                      onClick={async () => {
                        await install();
                        setShowGuideModal(false);
                      }}
                      className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-900 text-amber-300 font-bold text-xs shadow-md border border-amber-400 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4 animate-bounce" />
                      <span>تثبيت الآن على الكمبيوتر</span>
                    </button>
                  )}
                </div>
              )}

              {/* Bottom dismissal */}
              <div className="pt-2">
                <button
                  onClick={() => setShowGuideModal(false)}
                  className="w-full py-2.5 rounded-xl bg-[#eee8d5] hover:bg-[#e4dcbf] text-emerald-950 font-bold text-xs transition cursor-pointer"
                >
                  إغلاق النافذة
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
