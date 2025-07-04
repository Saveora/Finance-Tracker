import { FaUniversity, FaBullseye, FaClock, FaLock } from 'react-icons/fa';

const features = [
  {
    icon: <FaUniversity className="text-gold text-2xl" />,
    title: 'Multi-account sync',
    description: 'Connect and track all your bank accounts in one place.',
  },
  {
    icon: <FaBullseye className="text-gold text-2xl" />,
    title: 'Goal tracking',
    description: 'Visualize progress toward savings goals in real-time.',
  },
  {
    icon: <FaClock className="text-gold text-2xl" />,
    title: 'Spending limits',
    description: 'Set monthly caps and get notified when you’re close.',
  },
  {
    icon: <FaLock className="text-gold text-2xl" />,
    title: 'Secure & private',
    description: 'Your data is encrypted and never shared — ever.',
  },
];

export default function FeaturesSection() {
  return (
    <section className="bg-[#030917] text-white py-20 px-4 sm:px-8 lg:px-20">
      <div className="text-center mb-12">
        <p className="text-sm text-gold font-medium">• Features</p>
        <h2 className="text-3xl sm:text-4xl font-bold mt-2 leading-tight">
          Designed for clarity, built for<br />better money decisions
        </h2>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-black rounded-2xl p-6 flex items-start gap-4 
            shadow-sm transition-all duration-300 
            hover:scale-105
            hover:shadow-[0_0_25px_rgba(255,215,21,0.8)]

            "
          >
            <div>{feature.icon}</div>
            <div>
              <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-300">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-gold font-medium hover:underline"
        >
          Get Started <span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
</svg></span>
        </a>
      </div>
    </section>
  );
}
