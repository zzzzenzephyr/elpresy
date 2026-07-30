import * as React from 'react';
import { ChevronRight } from 'lucide-react';

interface AccordionItemProps {
  id: string;
  title: string;
  numberSeq: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const AccordionItem = ({
  id,
  title,
  numberSeq,
  isOpen,
  onToggle,
  children
}: AccordionItemProps) => {
  return (
    <div className="flex flex-col border border-border-default rounded-[12px] bg-neutral-primary shadow-sm overflow-hidden mb-4 last:mb-0 transition-all">
      <button 
        onClick={onToggle}
        className="flex items-center justify-between w-full p-4 hover:bg-neutral-secondary-soft transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-brand-soft text-heading flex items-center justify-center text-sm font-bold shrink-0">
            {numberSeq}
          </div>
          <span className="font-semibold text-heading">{title}</span>
        </div>
        <ChevronRight className={`w-5 h-5 text-body-subtle shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      {isOpen && (
        <div className="p-4 pt-0 border-t border-border-default mt-2 overflow-hidden">
           <div className="pt-4 w-full">
             {children}
           </div>
        </div>
      )}
    </div>
  );
};
