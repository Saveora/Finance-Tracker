'use client'

import React, { useState, useRef, useEffect, FormEvent, JSX } from 'react'
import { Mail, MessageCircle, HelpCircle, Phone, X, Twitter, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type FAQ = {
  question: string
  answer: string
}

const faqs: FAQ[] = [
  {
    question: 'How do I connect my bank account?',
    answer:
      'Go to "Connect Bank" from the sidebar and follow the instructions to securely link your bank with Saveora. We use bank-grade encryption and never store your full credentials.'
  },
  {
    question: 'Is my financial data secure?',
    answer:
      'Yes — all your information is encrypted at rest and in transit. We only use the minimum data required to deliver services and never share it without your consent.'
  },
  {
    question: 'How can I reset my password?',
    answer:
      'Visit your account settings → Change Password. If you can’t access your account, request a password reset link or contact support below.'
  }
]

export default function SupportPage(): JSX.Element {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  const [phone, setPhone] = useState('')
  const [callbackSubmitted, setCallbackSubmitted] = useState(false)

  // Live chat
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ from: 'user' | 'agent'; text: string }>>([
    { from: 'agent', text: 'Hi! 👋 Welcome to Saveora support — how can we help today?' }
  ])
  const [input, setInput] = useState('')
  const [connecting, setConnecting] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isChatOpen) inputRef.current?.focus()
  }, [isChatOpen])

  function sendMessage(e?: FormEvent) {
    e?.preventDefault()
    if (!input.trim()) return
    const userMsg = { from: 'user' as const, text: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')

    // Mock agent reply
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'agent', text: "Thanks — an agent will get back to you shortly. If it's urgent, call us." }])
    }, 900)
  }

  function requestCallback(e: FormEvent) {
    e.preventDefault()
    // Simple validation
    if (!/^\d{10,15}$/.test(phone)) return alert('Please enter a valid phone number (10–15 digits).')
    setCallbackSubmitted(true)
    setTimeout(() => setCallbackSubmitted(false), 3500)
  }

  function connectToAgent() {
    setConnecting(true)
    setTimeout(() => {
      setConnecting(false)
      setIsChatOpen(true)
      setMessages(prev => [...prev, { from: 'agent', text: 'You are now connected to an agent — how can we help?' }])
    }, 1400)
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Support</h1>
          <p className="text-sm text-gray-600">We’re here to help — browse FAQs, chat live, or contact us directly.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left column: FAQs */}
        <section aria-labelledby="faqs-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="faqs-heading" className="text-lg font-semibold text-[#0f1724]">Frequently Asked Questions</h2>
            <button
              onClick={() => setActiveFAQ(0)}
              className="text-sm text-gray-500 hover:text-gray-700"
              aria-label="Collapse all"
            >
              Collapse all
            </button>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFAQ === idx
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18, delay: idx * 0.03 }}
                  className="bg-white rounded-xl shadow-sm border p-4"
                >
                  <button
                    className="w-full flex items-start justify-between gap-3 text-left"
                    onClick={() => setActiveFAQ(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <div>
                      <div className="font-medium text-[#0f1724]">{faq.question}</div>
                      <div className="text-xs text-gray-400">Click to {isOpen ? 'hide' : 'view'} answer</div>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="text-gray-400"
                    >
                      &gt;
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="mt-3 text-gray-600 text-sm"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>

          {/* Quick actions */}
          <div className="flex gap-3 mt-5">
            <button
              onClick={() => setIsChatOpen(true)}
              className="inline-flex items-center gap-2 py-2 px-3 rounded-lg bg-blue-500 text-white font-semibold shadow hover:shadow-md transition"
            >
              <MessageCircle className="w-4 h-4" /> Live chat
            </button>

            <button
              onClick={() => window.open('mailto:support@saveora.com')}
              className="inline-flex items-center gap-2 py-2 px-3 rounded-lg bg-yellow-50 text-[#0f1724] font-medium border"
            >
              <Mail className="w-4 h-4 text-yellow-400" /> Email support
            </button>

            <button
              onClick={() => window.open('tel:+910000000000')}
              className="inline-flex items-center gap-2 py-2 px-3 rounded-lg bg-white text-[#0f1724] font-medium border"
            >
              <Phone className="w-4 h-4 text-green-500" /> Call us
            </button>
          </div>
        </section>

        {/* Right column: Contact card + callback form */}
        <aside className="space-y-4">
          <div className="bg-white rounded-2xl shadow-md border p-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#0f1724] flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" /> Contact Us
                </h3>
                <p className="text-sm text-gray-600">Available 9am — 9pm IST · Response within 24 hours</p>
              </div>
              <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" /> Secure
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-yellow-400" />
                <a href="mailto:support@saveora.com" className="text-sm font-medium text-[#0f1724] underline">
                  support@saveora.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-500" />
                <a href="tel:+910000000000" className="text-sm font-medium text-[#0f1724]">
                  +91 00000 00000
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Twitter className="w-4 h-4 text-sky-500" />
                <a href="https://twitter.com/saveora" target="_blank" rel="noreferrer" className="text-sm font-medium text-[#0f1724] underline">
                  @Saveora
                </a>
              </div>

              <div className="pt-2">
                <button
                  onClick={connectToAgent}
                  className="w-full py-2 rounded-lg bg-black text-white font-semibold hover:opacity-95 transition"
                  aria-pressed={connecting}
                >
                  {connecting ? 'Connecting…' : 'Connect to an agent'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-5">
            <h4 className="text-sm font-semibold text-[#0f1724] mb-2">Request a callback</h4>
            <form onSubmit={requestCallback} className="flex flex-col gap-2">
              <label htmlFor="phone" className="text-xs text-gray-500">Phone number</label>
              <input
                id="phone"
                name="phone"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="Enter phone number"
                inputMode="tel"
                pattern="[0-9]{10,15}"
                className="p-2 border rounded bg-gray-50"
              />

              <button type="submit" className="py-2 rounded-lg bg-yellow-400 text-black font-semibold">{callbackSubmitted ? 'Requested' : 'Request Callback'}</button>
            </form>

            <div className="mt-3 text-xs text-gray-400">You can also reach us on WhatsApp: <a href="https://wa.me/910000000000" target="_blank" rel="noreferrer" className="underline">Message on WhatsApp</a></div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border">
            <div className="text-sm font-medium text-[#0f1724]">Support tip</div>
            <div className="text-xs text-gray-600 mt-1">For faster support, include a screenshot of the issue and your account email when contacting us.</div>
          </div>
        </aside>
      </div>

      {/* Chat widget (floating) */}
      <div className="fixed right-5 bottom-5 z-50">
        <AnimatePresence>
          {!isChatOpen && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsChatOpen(true)}
              aria-label="Open live chat"
              className="w-14 h-14 rounded-full bg-blue-500 shadow-lg flex items-center justify-center text-white"
              title="Live chat"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isChatOpen && (
            <motion.aside
              initial={{ opacity: 0, y: 10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="w-[340px] md:w-[380px] bg-white rounded-2xl shadow-2xl border overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <div className="text-sm font-semibold">Live Support</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsChatOpen(false)
                    }}
                    className="p-1 rounded hover:bg-gray-100"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-2" style={{ minHeight: 160 }}>
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`${m.from === 'user' ? 'bg-yellow-400 text-black' : 'bg-gray-100 text-gray-800'} rounded-xl px-3 py-2 max-w-[80%]`}>{m.text}</div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="p-3 border-t">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg bg-gray-50"
                  />
                  <button type="submit" className="py-2 px-3 rounded-lg bg-black text-white">Send</button>
                </div>
              </form>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
