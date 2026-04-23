'use client';

import { useTranslations } from 'next-intl';

import { useFAQsQuery } from '@/hooks';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui';
import { HTMLRender } from '../HTMLRender';

export const FAQsBody = () => {
  const t = useTranslations();

  const faqsQuery = useFAQsQuery();

  if (!faqsQuery.data || faqsQuery.data?.length === 0)
    return <p className="m-auto text-center text-muted-foreground text-lg md:text-xl lg:text-2xl">{t('faqs_empty')}</p>;

  return (
    <Accordion type="single" collapsible defaultValue="item-1" className="border-0 gap-4 flex-1">
      {faqsQuery.data.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`faq-${index + 1}`}
          className="bg-sidebar-border p-4 gap-6 rounded-lg transition-colors duration-300"
        >
          <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>

          <AccordionContent>
            <FAQAnswerHTML html={faq.answer} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

const FAQAnswerHTML = HTMLRender('FAQAnswer');
