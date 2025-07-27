'use client';

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, Variants, TargetAndTransition, Transition } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  number: string;
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    number: "01",
    question: "How secure is my financial data with Saveora?",
    answer:
      "Your data is protected with bank-level encryption and we never store your login credentials. We use read-only connections to your accounts and comply with all financial data protection regulations.",
  },
  {
    number: "02",
    question: "Which banks and financial institutions are supported?",
    answer:
      "We support over 12,000 financial institutions including major banks, credit unions, and investment accounts. New institutions are added regularly.",
  },
  {
    number: "03",
    question: "Can I set up automatic savings goals?",
    answer: "Yes! Set up automatic transfers to your savings goals and track your progress with visual indicators and milestone celebrations.",
  },
  {
    number: "04",
    question: "Is there a mobile app available?",
    answer: "Our web app is fully responsive and works great on mobile. Native iOS and Android apps are coming soon.",
  },
  {
    number: "05",
    question: "How much does Saveora cost?",
    answer: "We offer a free tier with basic features, and premium plans starting at $9.99/month for advanced analytics and unlimited goal tracking.",
  },
  {
    number: "06",
    question: "How can I get support if I need help?",
    answer:
      "Our support team is available 24/7 via chat, email, or phone. Plus, we have comprehensive guides and tutorials in our help center.",
  },
];

export default function FaqAccordion() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(Array(faqData.length).fill(false));

  const toggle = (index: number) => {
    setActiveIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const headingVariants: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const answerVariants: Variants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.4, ease: "easeInOut" } },
    exit: { opacity: 0, height: 0, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const getTransition = (delay: number, variantTransition?: Transition): Transition => {
    return {
      delay,
      duration: variantTransition?.duration,
      ease: variantTransition?.ease,
    };
  };

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((ref, index) => {
      if (ref) {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              setTimeout(() => {
                setVisibleItems(prev => {
                  const newState = [...prev];
                  newState[index] = true;
                  return newState;
                });
              }, index * 100);
            }
          },
          { threshold: 0.3 }
        );
        observer.observe(ref);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach(observer => observer.disconnect());
    };
  }, []);

  return (
    <div id="faqs" ref={ref} className="min-h-screen bg-[#030917] text-white px-6 py-13 md:px-20 relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 0.03, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", ease: "easeOut" }}
          className="absolute top-1/3 left-1/4 w-64 h-64 bg-finance-gold opacity-5 blur-3xl rounded-full"
        />
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={inView ? { opacity: 0.02, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: 0.5 }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-finance-gold opacity-3 blur-3xl rounded-full"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
          <motion.div
            variants={headingVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="md:w-1/2"
          >
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Got questions?
              <br />
              <span className="bg-gradient-to-r from-finance-gold to-finance-gold-light bg-clip-text text-transparent">
                We&apos;ve got answers.
              </span>
            </h1>
          </motion.div>

          <motion.div
            variants={headingVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            transition={getTransition(0.2, (headingVariants.visible as TargetAndTransition).transition)}
            className="md:w-1/2 text-gray-300 text-lg"
          >
            <p className="mb-6 leading-relaxed">
              Here&apos;s everything you need to know before getting started with Saveora.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col gap-4">
          {faqData.map((item, index) => (
            <motion.div
              key={index}
              ref={el => { if (el) itemRefs.current[index] = el; }}
              variants={itemVariants}
              initial="hidden"
              animate={visibleItems[index] ? "visible" : "hidden"}
              className="group"
            >
              <div className="rounded-2xl p-5 transition-all duration-300 bg-finance-black border border-finance-navy/30 hover:border-finance-gold/30 hover:scale-[1.01] relative overflow-hidden">
                <div
                  onClick={() => toggle(index)}
                  className="flex items-center justify-between cursor-pointer relative z-10"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span
                      className="text-sm font-bold px-3 py-1.5 rounded-full bg-[#06142e] text-finance-gold transition-all duration-300 group-hover:bg-finance-gold group-hover:text-finance-black shadow-sm"
                    >
                      {item.number}
                    </span>

                    <span className="font-semibold text-base text-left text-white transition-colors duration-300">
                      {item.question}
                    </span>
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    <motion.div
                      animate={{ rotate: activeIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-8 h-8 flex items-center justify-center transition-transform duration-300"
                    >
                      <ChevronDown
                        size={22}
                        className={`transition-colors duration-300 ${
                          activeIndex === index ? 'text-finance-gold' : 'text-finance-gold/60 group-hover:text-finance-gold'
                        }`}
                      />
                    </motion.div>
                  </div>
                </div>

                <AnimatePresence initial={false}>
                  {activeIndex === index && (
                    <motion.div
                      key="answer"
                      variants={answerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="overflow-hidden relative z-10"
                    >
                      <div className="pl-16 pr-12 pt-4">
                        <p className="text-gray-400 leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
