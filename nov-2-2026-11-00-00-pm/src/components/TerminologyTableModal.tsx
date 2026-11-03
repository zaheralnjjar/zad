import React, { useState } from 'react';
import { 
  X, 
  Languages, 
  Copy, 
  Check, 
  RefreshCw, 
  Table
} from 'lucide-react';

export interface TerminologyItem {
  arabic: string;
  spanish: string;
  example: string;
}

interface TerminologyTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  category: string;
  terms: TerminologyItem[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const TerminologyTableModal: React.FC<TerminologyTableModalProps> = ({
  isOpen,
  onClose,
  topicTitle,
  category,
  terms,
  isLoading,
  onRefresh,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyTable = () => {
    let text = `═══ جدول المصطلحات العامة والدينية المترجمة للإسبانية ═══\n`;
    text += `📌 موضوع الكلمة: ${topicTitle} (${category})\n\n`;
    text += `المصطلح بالعربية | Traducción al español | مثال توضيحي (Ejemplo)\n`;
    text += `------------------------------------------------------------\n`;
    terms.forEach((t) => {
      text += `• ${t.arabic} | ${t.spanish} | ${t.example}\n`;
    });
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-xs overflow-y-auto animate-fade-in text-[#1A1A1A]">
      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-xl bg-[#FAF8F5] border border-[#DCD5C6] shadow-2xl overflow-hidden my-auto text-right">
        
        {/* Top Kindle rule line */}
        <div className="h-0.5 bg-[#CEC5B4]" />

        {/* Header */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-[#DCD5C6] bg-[#F4EFE6] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#242424] text-[#FAF8F5] shadow-2xs">
              <Languages className="w-4 h-4 text-[#FAF8F5]" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#1A1A1A] font-cairo flex items-center gap-2">
                جدول المصطلحات الدينية والعامة بالإسبانية
                <span className="text-[10px] font-bold font-sans bg-[#EDE7DC] text-[#242424] border border-[#CEC5B4] px-2 py-0.5 rounded">
                  🇪🇸 Glosario
                </span>
              </h2>
              <p className="text-xs text-[#595959] font-medium font-cairo">
                مستخرج من كلمة: <strong>«{topicTitle}»</strong> ({category})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Copy Table */}
            <button
              onClick={handleCopyTable}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EDE7DC] text-[#1A1A1A] border border-[#DCD5C6] text-xs font-bold shadow-2xs transition cursor-pointer font-cairo"
              title="نسخ الجدول بالكامل"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#1A1A1A]" /> : <Copy className="w-3.5 h-3.5 text-[#595959]" />}
              <span>{copied ? 'تم النسخ!' : 'نسخ الجدول'}</span>
            </button>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#242424] hover:bg-[#0F0F0F] text-[#FAF8F5] text-xs font-bold shadow-2xs transition cursor-pointer disabled:opacity-50 font-cairo"
              title="إعادة استخراج المصطلحات بالذكاء الاصطناعي"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLoading ? 'جاري الاستخراج...' : 'تحديث المصطلحات'}</span>
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EDE7DC] text-[#595959] hover:text-[#1A1A1A] border border-[#DCD5C6] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-bar explaining columns */}
        <div className="px-5 py-2 bg-[#F2EDE2] border-b border-[#DCD5C6] text-xs text-[#454545] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 font-bold text-[#1A1A1A]">
            <Table className="w-3.5 h-3.5 text-[#595959]" />
            <span>جدول ثلاثي الأعمدة: المصطلح بالعربية | الترجمة بالإسبانية المبسطة | مثال توضيحي وسياق</span>
          </div>
          <span className="text-[11px] text-[#706B5E] font-semibold">
            {terms.length} مصطلحات مستخرجة
          </span>
        </div>

        {/* Table Content: Kindle Book Table */}
        <div className="p-3 sm:p-5 overflow-y-auto max-h-[68vh]">
          {isLoading && terms.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#EDE7DC] border border-[#CEC5B4] text-[#1A1A1A] animate-spin">
                <RefreshCw className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-[#1A1A1A]">
                جاري استخراج المصطلحات الدينية والعامة وصياغة الأمثلة بالإسبانية...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#DCD5C6] shadow-2xs">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-[#242424] text-[#FAF8F5] text-xs sm:text-sm font-bold">
                    <th className="py-3 px-4 border-l border-[#3D3D3D] w-1/4">
                      العمود الأول: باللغة العربية
                      <span className="block text-[10px] text-[#C2B8A3] font-normal mt-0.5">Término en Árabe</span>
                    </th>
                    <th className="py-3 px-4 border-l border-[#3D3D3D] w-5/12 text-left" dir="ltr">
                      Segundo: En Español Sencillo
                      <span className="block text-[10px] text-[#C2B8A3] font-normal mt-0.5">الترجمة والمعنى المبسط</span>
                    </th>
                    <th className="py-3 px-4 w-1/3">
                      العمود الثالث: مثال
                      <span className="block text-[10px] text-[#C2B8A3] font-normal mt-0.5">Ejemplo Práctico</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DCD5C6] text-xs sm:text-sm bg-[#FAF8F5]">
                  {terms.map((item, index) => (
                    <tr 
                      key={index}
                      className={index % 2 === 0 ? 'bg-[#FAF8F5] hover:bg-[#F2ECE0] transition' : 'bg-[#F4EFE6] hover:bg-[#F2ECE0] transition'}
                    >
                      {/* Column 1: Arabic */}
                      <td className="py-3 px-4 font-bold text-[#1A1A1A] border-l border-[#DCD5C6] align-top">
                        <span className="font-cairo text-sm text-[#1A1A1A] block font-bold">
                          {item.arabic}
                        </span>
                      </td>

                      {/* Column 2: Spanish translation */}
                      <td className="py-3 px-4 text-[#242424] border-l border-[#DCD5C6] align-top text-left font-sans leading-relaxed" dir="ltr">
                        <span className="font-normal text-[#1A1A1A] block">
                          {item.spanish}
                        </span>
                      </td>

                      {/* Column 3: Example */}
                      <td className="py-3 px-4 text-[#454545] align-top leading-relaxed">
                        <div className="bg-[#FAF8F5] p-2 rounded border border-[#DCD5C6]">
                          <p className="font-medium text-[#1A1A1A] text-xs">
                            {item.example}
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-3 border-t border-[#DCD5C6] bg-[#F4EFE6] flex items-center justify-between">
          <p className="text-[11px] text-[#595959] font-medium hidden sm:block">
            💡 صُمم هذا الجدول ليعين الإمام والخطيب على شرح المعاني للمسلمين الناطقين بالإسبانية بدقة ووضوح.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#242424] hover:bg-[#0F0F0F] text-[#FAF8F5] font-bold text-xs shadow-2xs transition cursor-pointer font-cairo"
          >
            إغلاق الجدول
          </button>
        </div>

      </div>
    </div>
  );
};
