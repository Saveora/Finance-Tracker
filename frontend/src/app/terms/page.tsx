// app/terms/page.tsx
"use client";

import React from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const TermsPage: React.FC = () => {
  return (
    <>
    <Navbar />
      <main className="bg-[#030917] text-white px-6 py-28 min-h-screen">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-semibold text-center mb-2">
            Terms & Conditions
          </h1>
          <p className="text-center text-sm text-gray-400 mb-10">
            Last updated: April 2025
          </p>

          <div className="space-y-5 text-gray-300 text-sm leading-relaxed">
            <p>
              By accessing and using Clario, you agree to these terms. Please read them carefully before using our website or services.
            </p>
            <p>
              You must be at least 18 years old to use Clario. By using our services, you confirm that you meet this requirement. If you are accessing Clario on behalf of an organization, you confirm that you have the authority to bind the organization to these terms.
            </p>
            <p>
              All content on our website, including text, graphics, logos, images, and software, is the property of Clario or its licensors. This content is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works based on our content without prior written consent.
            </p>
            <p>
              We work hard to keep Clario running smoothly and securely, but we cannot guarantee that our services will always be available, uninterrupted, or error-free. We are not liable for any interruptions, delays, or losses resulting from using our platform. You understand and agree that you use our services at your own risk.
            </p>
            <p>
              When using Clario, you agree to use our services responsibly. You must not misuse our platform, attempt to gain unauthorized access, or engage in any activity that could harm our website, users, or reputation. We reserve the right to suspend or terminate your account if you violate these terms or engage in harmful behavior.
            </p>
            <p>
              Our services may include links to third-party websites or services. These external links are provided for convenience, but we do not control or endorse their content. We are not responsible for the privacy practices, terms, or content of any third-party sites you visit.
            </p>
            <p>
              Payments and subscriptions for Clario services are billed as described on our pricing page. By purchasing a subscription, you authorize us to charge your selected payment method. You may cancel your subscription at any time, but please note that fees are non-refundable unless required by law.
            </p>
            <p>
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your personal data when you use Clario.
            </p>
            <p>
              We may update these Terms of Service from time to time to reflect changes in our services, legal requirements, or policies. If we make significant changes, we will notify you through our website or by email. Continued use of our services after changes means you accept the updated terms. We encourage you to review these terms periodically.
            </p>
            <p>
              If you have any questions about these terms or our services, feel free to contact us at [Insert Contact Email]. We're here to help.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default TermsPage;
