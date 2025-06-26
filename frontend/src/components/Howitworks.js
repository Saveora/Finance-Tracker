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
    <section className="bg-[#04192d] py-20 text-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-semibold mb-12">How Saveora works</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className={`bg-[#0f172a] rounded-3xl p-6 flex flex-col items-center text-center border border-transparent`}
            >
              <Image
                src={item.img}
                alt={`Step ${idx + 1}`}
                width={300}
                height={300}
                className="mb-6 rounded-xl"
              />
              
              <p className="text-sm text-lime-400 font-medium mb-2">• {item.step}</p>
              <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-gray-300">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
