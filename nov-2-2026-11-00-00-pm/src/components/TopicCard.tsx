import React from 'react';
import { 
  Star, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  ChevronLeft,
  BookOpen,
  Sparkles,
  CheckSquare,
  Square
} from 'lucide-react';
import { TopicSuggestion } from '../types';

interface TopicCardProps {
  topic: TopicSuggestion;
  index: number;
  isSelected?: boolean;
  onToggleSelect?: (id: string, e: React.MouseEvent) => void;
  onSelect: (topic: TopicSuggestion) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onToggleDelivered: (id: string, e: React.MouseEvent) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  index,
  isSelected = false,
  onToggleSelect,
  onSelect,
  onToggleFavorite,
  onToggleDelivered,
}) => {
  const prayerNames: Record<string, string> = {
    fajr: 'الفجر',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
    jumuah: 'الجمعة',
    all: 'عام لجميع الصلوات',
  };

  return (
    <div 
      onClick={() => onSelect(topic)}
      className={`group relative rounded-xl p-4 sm:p-5 transition-all duration-150 cursor-pointer flex flex-col justify-between border ${
        isSelected
          ? 'bg-[#F2ECE0] border-[#1A1A1A] shadow-xs ring-1 ring-[#1A1A1A]'
          : topic.isDelivered 
          ? 'bg-[#EFEAE0] border-[#D5CCBC] opacity-75' 
          : 'bg-[#FAF8F5] hover:bg-[#F5F0E6] border-[#DCD5C6] shadow-2xs hover:border-[#B8AF9C]'
      }`}
    >
      {/* Top ribbon: Selection checkbox, index medallion, category, and action buttons */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Multi-selection Checkbox */}
            {onToggleSelect && (
              <button
                onClick={(e) => onToggleSelect(topic.id, e)}
                className={`p-1 rounded transition cursor-pointer ${
                  isSelected 
                    ? 'text-[#1A1A1A] bg-[#DDD6C6]' 
                    : 'text-[#8F8776] hover:text-[#1A1A1A] hover:bg-[#EFEAE0]'
                }`}
                title={isSelected ? 'إلغاء تحديد هذا الموضوع' : 'تحديد هذا الموضوع'}
              >
                {isSelected ? (
                  <CheckSquare className="w-4 h-4 text-[#1A1A1A]" />
                ) : (
                  <Square className="w-4 h-4 text-[#8F8776]" />
                )}
              </button>
            )}

            {/* Number medallion (Kindle chapter mark style) */}
            <div className={`flex items-center justify-center w-6 h-6 rounded font-mono font-bold text-xs ${
              isSelected ? 'bg-[#1A1A1A] text-[#FAF8F5]' : 'bg-[#242424] text-[#FAF8F5]'
            }`}>
              {index + 1}
            </div>

            {/* Category tag: Kindle book bookmark style */}
            <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#EDE7DC] text-[#242424] border border-[#CEC5B4]">
              {topic.category}
            </span>

            {/* Target Prayer */}
            <span className="text-[10px] text-[#595959] font-medium bg-[#F2EDE2] px-2 py-0.5 rounded border border-[#DCD5C6]">
              {prayerNames[topic.targetPrayer] || topic.targetPrayer}
            </span>
          </div>

          {/* Action icons: Favorite & Delivered */}
          <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => onToggleFavorite(topic.id, e)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                topic.isFavorite 
                  ? 'text-[#1A1A1A] bg-[#E2DBD0]' 
                  : 'text-[#8F8776] hover:text-[#1A1A1A] hover:bg-[#EDE7DC]'
              }`}
              title={topic.isFavorite ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
            >
              <Star className={`w-4 h-4 ${topic.isFavorite ? 'fill-[#1A1A1A]' : ''}`} />
            </button>

            <button
              onClick={(e) => onToggleDelivered(topic.id, e)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                topic.isDelivered 
                  ? 'text-[#FAF8F5] bg-[#242424]' 
                  : 'text-[#8F8776] hover:text-[#1A1A1A] hover:bg-[#EDE7DC]'
              }`}
              title={topic.isDelivered ? 'أُلغيت علامة الإلقاء' : 'تحديد ككلمة تم إلقاؤها'}
            >
              <CheckCircle2 className={`w-4 h-4 ${topic.isDelivered ? 'text-[#FAF8F5]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-[#1A1A1A] group-hover:text-[#000000] transition-colors leading-snug mb-2 font-cairo">
          {topic.title}
        </h3>

        {/* Short Summary */}
        <p className="text-xs text-[#454545] leading-relaxed line-clamp-2 mb-3 font-cairo">
          {topic.shortSummary}
        </p>

        {/* Hook Question preview: Kindle citation style */}
        {topic.hookQuestion && (
          <div className="bg-[#F4EFE6] rounded-lg p-2.5 border border-[#DCD5C6] mb-3 flex items-start gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-[#595959] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#242424] font-medium italic line-clamp-2">
              "{topic.hookQuestion}"
            </p>
          </div>
        )}

        {/* Science curiosity chip if available */}
        {topic.scienceCuriosityPreview && (
          <div className="mb-3 bg-[#EFEAE0] rounded-lg p-2 border border-[#D5CCBC] text-[10px] text-[#242424] flex items-start gap-1.5 line-clamp-1">
            <Sparkles className="w-3 h-3 text-[#595959] shrink-0 mt-0.5" />
            <span className="font-semibold">{topic.scienceCuriosityPreview}</span>
          </div>
        )}
      </div>

      {/* Bottom Footer: Academic reference, Duration, and Enter button */}
      <div className="pt-2.5 border-t border-[#DCD5C6] flex items-center justify-between text-xs text-[#595959]">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="flex items-center gap-1 text-[11px] text-[#242424] bg-[#EDE7DC] px-2 py-0.5 rounded border border-[#CEC5B4] font-semibold">
            <Clock className="w-3 h-3 text-[#595959]" />
            {topic.estimatedDuration || '3-5 دقائق'}
          </span>

          {topic.academicReference && (
            <span className="text-[10px] text-[#454545] font-medium bg-[#F2EDE2] px-2 py-0.5 rounded border border-[#DCD5C6] hidden sm:inline" title={topic.academicReference}>
              📖 {topic.academicReference.split('(')[0]}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[#1A1A1A] group-hover:text-[#000000] font-bold text-xs group-hover:translate-x-[-2px] transition-transform">
          <span>عرض الكلمة والتوثيق</span>
          <ChevronLeft className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
