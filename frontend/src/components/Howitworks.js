'use client'

import Image from 'next/image'

const steps = [
  {
    step: 'Step 1',
    title: 'Connect your accounts',
    desc: 'Sync all your bank accounts, credit cards — securely and instantly.',
    img: '/step1.png',
  },
  {
    step: 'Step 2',
    title: 'Track your money',
    desc: 'See where your money goes with real-time spending insights and clear breakdowns.',
    img: '/step2.png',
  },
  {
    step: 'Step 3',
    title: 'Set goals & stay on track',
    desc: 'Plan your savings, set monthly budgets, and let Saveora keep you in control.',
    img: '/step3.png',
  },
]

export default function HowItWorks() {
  return (
    <section className="bg-[#030917] py-24 text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-white">
          How Saveora works
        </h2>

        <div className="grid md:grid-cols-3 gap-10">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#000000] rounded-3xl p-6 border border-[#1a1f30]  transition transform hover:scale-105 hover:shadow-[0_0_25px_rgba(255,215,0,0.8)] duration-300 relative z-10"
            >
              <div className="bg-[#07243f] rounded-2xl p-2 mb-3 shadow-inner">
                <Image
                  src={item.img}
                  alt={`Step ${idx + 1}`}
                  width={300}
                  height={200}
                  className="rounded-xl mx-auto"
                />
              </div>

              <p className="text-sm text-[#FFD700] font-semibold mb-2 tracking-wide">
                • {item.step}
              </p>

              <h3 className="text-lg font-bold mb-2 text-white">
                {item.title}
              </h3>

              <p className="text-sm text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Optional soft background glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#0084FF] opacity-10 blur-3xl rounded-full z-0" />
    </section>
  )
}
