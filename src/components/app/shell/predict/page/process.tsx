'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { HelpCircle, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProcessItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
}

function ProcessAccordionItem({ question, answer, isOpen }: ProcessItemProps) {
  return (
    <div className="border border-border-default rounded-base mb-2 shadow-xs overflow-hidden bg-neutral-primary-soft">
      <div
        className={`w-full flex items-center justify-between px-5 py-4 transition-colors text-left ${
          isOpen ? 'bg-neutral-tertiary-soft' : 'bg-neutral-secondary-soft'
        }`}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <HelpCircle className="w-4 h-4 text-body" />
          <span className="text-heading font-medium text-sm">{question}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-body transition-transform duration-150 ${
            isOpen ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </div>
      <div 
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-5 py-4 border-t border-border-default bg-neutral-primary-soft">
            <p className="text-body text-sm leading-relaxed">{answer}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Process() {
  const t = useTranslations('PredictPage');
  const [activeIndex, setActiveIndex] = useState(0);

  const steps = [
    {
      question: t('steps.s1.title'),
      answer: t('steps.s1.description'),
    },
    {
      question: t('steps.s2.title'),
      answer: t('steps.s2.description'),
    },
    {
      question: t('steps.s3.title'),
      answer: t('steps.s3.description'),
    },
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + steps.length) % steps.length);
  };

  return (
    <section className="w-full py-16 lg:py-24 bg-neutral-primary-soft">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column */}
          <div className="w-full lg:w-1/3 flex flex-col items-start">
            <h2 className="text-heading text-3xl font-semibold mb-4">
              {t('title')}
            </h2>
            <p className="text-body text-base mb-8 max-w-[45ch]">
              {t('description')}
            </p>
            
            <div className="flex items-center gap-3 mt-4 lg:mt-auto">
              <Button 
                variant="outline" 
                size="icon"
                onClick={handlePrev}
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleNext}
                aria-label="Next step"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-2/3 flex flex-col">
            <div className="flex flex-col w-full">
              {steps.map((step, idx) => (
                <ProcessAccordionItem 
                  key={idx} 
                  question={step.question} 
                  answer={step.answer} 
                  isOpen={activeIndex === idx}
                />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
