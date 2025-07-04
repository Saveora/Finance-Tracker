"use client";

import React, { useState } from "react";

const faqData = [
  {
    number: "01",
    question: "What kind of businesses is this template built for?",
    answer:
      "Clario is designed for SaaS tools, dashboards, fintech platforms, or any digital product that needs a modern, conversion-focused landing page. It’s fully customizable to fit a wide range of web-based services.",
  },
  {
    number: "02",
    question: "Is the template mobile-friendly and responsive?",
    answer:
      "Yes, it's fully responsive and works perfectly on all screen sizes.",
  },
  {
    number: "03",
    question: "Can I use this template without coding skills?",
    answer: "Absolutely! You can customize it without writing any code.",
  },
  {
    number: "04",
    question: "Will I get access to future updates?",
    answer: "Yes, you'll receive all future updates at no extra cost.",
  },
  {
    number: "05",
    question: "Can I use this template for commercial projects?",
    answer: "Yes, it's licensed for both personal and commercial use.",
  },
  {
    number: "06",
    question: "How can I get support if I run into issues?",
    answer:
      "You can reach out via the contact page or support email mentioned in the docs.",
  },
];

export default function FaqAccordion() {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggle = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-[#030917] text-white px-6 py-10 md:px-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-10">
        <h1 className="text-4xl font-bold leading-snug">
          Got questions?
          <br />
          We’ve got answers.
        </h1>
        <div className="text-slate-300 text-sm max-w-sm">
          <p className="mb-2">
            Here's everything you need to know before getting started.
          </p>
          <a href="#" className="font-semibold" style={{ color: '#FFD700' }}>
            Contact us →
          </a>

        </div>
      </div>

      <div className="flex flex-col gap-4">
        {faqData.map((item, index) => (
          <div
            key={index}
            className={`rounded-xl p-4 transition-all ${
              activeIndex === index ? "bg-black" : "bg-black"
            }`}
          >
            <div
              onClick={() => toggle(index)}
              className="flex items-center justify-between cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: "#04192D", color: '#FFD700' }}>
                  {item.number}
                </span>

                <span className="font-semibold text-base text-left">
                  {item.question}
                </span>
              </div>
              <span className="text-gold text-xl font-bold">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>
            {activeIndex === index && (
              <p className="mt-3 text-sm text-slate-400">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
