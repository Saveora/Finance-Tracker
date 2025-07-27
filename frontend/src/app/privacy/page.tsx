import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
    <Navbar />
      <main className="bg-[#030917] text-white min-h-screen px-4 md:px-12 py-28">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Privacy Policy</h1>
          <p className="text-center text-gray-400 mb-10">Last updated: April 2025</p>

          <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
            <p>
              Clario (“we,” “our,” or “us”) respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you interact with our website and services.
            </p>
            <p>
              When you visit our website or contact us, we may collect personal details like your name, email address, and any information you provide through forms or messages. We also collect technical data such as your IP address, browser type, pages you visit, and how you use our site. Additionally, we use cookies and similar technologies to enhance your experience and improve our services.
            </p>
            <p>
              We use your data to respond to your questions, provide support, improve and optimize our website, send you updates, newsletters, and offers (only if you agree), and meet our legal obligations.
            </p>
            <p>
              We do not sell or rent your personal information. We may share it with trusted service providers who help us run our website, manage communications, or host our data securely. If required by law or to protect our rights, we may also share information with authorities.
            </p>
            <p>
              You have full control over your personal data. You can access the information we hold about you, request corrections if data is incomplete or incorrect, opt out of marketing messages, and request deletion of your data (unless we’re legally required to keep it).
            </p>
            <p>
              To exercise any of these rights, just reach out to us at [Insert Contact Email].
            </p>
            <p>
              We take security seriously. While no system is 100% secure, we use trusted tools and practices to protect your data from unauthorized access or misuse.
            </p>
            <p>
              Our site may contain links to other websites. We’re not responsible for their privacy practices, so we recommend checking their policies separately.
            </p>
            <p>
              We may update this policy from time to time. If we do, we’ll post the changes here, so feel free to check back occasionally.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PrivacyPolicyPage;
