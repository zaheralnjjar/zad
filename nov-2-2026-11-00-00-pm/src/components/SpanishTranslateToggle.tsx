import React from 'react';
import { Languages, Loader2, RotateCcw } from 'lucide-react';

interface SpanishTranslateToggleProps {
  itemKey: string;
  arabicText: string;
  context?: string;
  isSpanishActive: boolean;
  onToggle: (key: string, text: string, context?: string) => void;
  isLoading: boolean;
  spanishText?: string;
  className?: string;
}

export const SpanishTranslateToggle: React.FC<SpanishTranslateToggleProps> = ({
  itemKey,
  arabicText,
  context,
  isSpanishActive,
  onToggle,
  isLoading,
  spanishText,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(itemKey, arabicText, context);
        }}
        disabled={isLoading}
        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded transition cursor-pointer shadow-2xs border font-cairo ${
          isSpanishActive
            ? 'bg-[#242424] text-[#FAF8F5] border-[#141414]'
            : 'bg-[#FAF8F5] hover:bg-[#EDE7DC] text-[#1A1A1A] border-[#DCD5C6]'
        }`}
        title={isSpanishActive ? 'العودة للنص العربي' : 'الترجمة المباشرة إلى اللغة الإسبانية'}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-3 h-3 animate-spin text-[#595959]" />
            <span>جاري الترجمة...</span>
          </>
        ) : isSpanishActive ? (
          <>
            <RotateCcw className="w-3 h-3 text-[#FAF8F5]" />
            <span>الأصل العربي</span>
          </>
        ) : (
          <>
            <Languages className="w-3 h-3 text-[#595959]" />
            <span>ترجمة للإسبانية</span>
          </>
        )}
      </button>
    </div>
  );
};

interface SpanishTranslatedBoxProps {
  spanishText: string;
  onRevert: () => void;
}

export const SpanishTranslatedBox: React.FC<SpanishTranslatedBoxProps> = ({
  spanishText,
  onRevert,
}) => {
  return (
    <div className="mt-2.5 p-3 rounded-lg bg-[#F4EFE6] border border-[#DCD5C6] text-left font-sans text-xs sm:text-sm text-[#1A1A1A] animate-fade-in shadow-2xs">
      <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-[#DCD5C6] text-[10px] text-[#595959] font-bold uppercase tracking-wider">
        <span className="flex items-center gap-1">
          <span>🇪🇸</span> Traducción directa al español
        </span>
        <button
          onClick={onRevert}
          className="text-[#1A1A1A] hover:text-[#000000] underline font-cairo cursor-pointer"
        >
          العودة للأصل العربي
        </button>
      </div>
      <p className="leading-relaxed font-normal text-[#1A1A1A] select-text">
        {spanishText}
      </p>
    </div>
  );
};
