'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MapPin, Info, MessageCircle, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProcessItemProps {
  question: string;
  answer: string;
}

function ProcessAccordionItem({ question, answer }: ProcessItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-border-default rounded-base mb-2 shadow-xs overflow-hidden bg-neutral-primary-soft">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-5 py-4 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand text-left ${
          isOpen ? 'bg-neutral-tertiary-soft' : 'bg-neutral-secondary-soft hover:bg-neutral-tertiary-soft'
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
      </button>
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
            
            <div className="flex flex-col gap-4 mb-8 w-full">
              {/* Location Group */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-body-subtle mt-0.5 shrink-0" />
                <span className="text-body text-sm">
                  {t('contact.address')}
                </span>
              </div>
              
              {/* Contact Group */}
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-body-subtle mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-heading text-sm font-medium">{t('contact.label')}</span>
                  <a href={`mailto:${t('contact.email')}`} className="text-fg-brand text-sm hover:underline">
                    {t('contact.email')}
                  </a>
                </div>
              </div>
            </div>

            <Button variant="secondary" size="sm" className="gap-2">
              <MessageCircle className="w-4 h-4" />
              {t('contact.button')}
            </Button>
          </div>

          {/* Right Column */}
          <div className="w-full lg:w-2/3 flex flex-col">
            <div className="flex flex-col w-full">
              {steps.map((step, idx) => (
                <ProcessAccordionItem key={idx} question={step.question} answer={step.answer} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
