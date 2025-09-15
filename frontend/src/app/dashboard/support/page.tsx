'use client'

import React, { useEffect, useRef, useState, FormEvent, JSX } from 'react'
import {
  Mail,
  MessageCircle,
  HelpCircle,
  Phone,
  X,
  Twitter,
  Check,
  Search,
  ChevronRight,
  ChevronDown,
  FilePlus,
  Clock,
  Star
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type FAQ = { id: string; question: string; answer: string }
const faqs: FAQ[] = [
  {
    id: 'connect-bank',
    question: 'How do I connect my bank account?',
    answer:
      'Go to "Connect Bank" from the sidebar and follow the instructions to securely link your bank with Saveora. We use bank-grade encryption and never store your full credentials.'
  },
  {
    id: 'data-secure',
    question: 'Is my financial data secure?',
    answer:
      'Yes — all your information is encrypted at rest and in transit. We only use the minimum data required to deliver services and never share it without your consent.'
  },
  {
    id: 'reset-password',
    question: 'How can I reset my password?',
    answer:
      'Visit your account settings → Change Password. If you can’t access your account, request a password reset link or contact support below.'
  }
]

export default function SupportPage(): JSX.Element {
  // FAQs
  const [activeFAQ, setActiveFAQ] = useState<string | null>(null)
  const [query, setQuery] = useState('')

  // contact & callback
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [preferredTime, setPreferredTime] = useState('') // ISO datetime-local value
  const [callbackQuery, setCallbackQuery] = useState('')
  const [callbackSubmitted, setCallbackSubmitted] = useState(false)

  // ticket form
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketDesc, setTicketDesc] = useState('')
  const [ticketFile, setTicketFile] = useState<File | null>(null)
  const [ticketSubmitting, setTicketSubmitting] = useState(false)
  const [ticketSuccess, setTicketSuccess] = useState<{ id: string; eta?: string } | null>(null)

  // chat
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [messages, setMessages] = useState<Array<{ from: 'user' | 'agent'; text: string }>>([
    { from: 'agent', text: 'Hi! 👋 Welcome to Saveora support — how can we help today?' }
  ])
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (isChatOpen) inputRef.current?.focus()
  }, [isChatOpen])

  // derived FAQ list (search only)
  const visibleFAQs = faqs.filter(
    f =>
      query.trim() === '' ||
      f.question.toLowerCase().includes(query.toLowerCase()) ||
      f.answer.toLowerCase().includes(query.toLowerCase())
  )

  // helpers
  function toggleFAQ(id: string) {
    setActiveFAQ(prev => (prev === id ? null : id))
  }

  // Chat send
  function sendMessage(e?: FormEvent) {
    e?.preventDefault()
    if (!input.trim()) return
    const userMsg = { from: 'user' as const, text: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    // mock agent reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: 'agent', text: "Thanks — an agent will get back to you shortly. If it's urgent, call us." }
      ])
    }, 900)
  }

  // Connect to agent
  function connectToAgent() {
    setConnecting(true)
    setTimeout(() => {
      setConnecting(false)
      setIsChatOpen(true)
      setMessages(prev => [...prev, { from: 'agent', text: 'You are now connected to an agent — how can we help?' }])
    }, 1200)
  }

  // Callback request
  function requestCallback(e: FormEvent) {
    e.preventDefault()
    const digits = phone.replace(/\D/g, '')
    if (digits.length < 6 || digits.length > 15) {
      return alert('Please enter a valid phone number (6–15 digits).')
    }
    // Here you would send countryCode, phone, preferredTime, callbackQuery to your API
    setCallbackSubmitted(true)
    // emulate network
    setTimeout(() => setCallbackSubmitted(false), 4000)
    // optional: clear form
    setPhone('')
    setPreferredTime('')
    setCallbackQuery('')
  }

  // Ticket submit
  function submitTicket(e: FormEvent) {
    e.preventDefault()
    if (!ticketSubject.trim() || !ticketDesc.trim()) {
      return alert('Please add a subject and description for the ticket.')
    }
    setTicketSubmitting(true)
    // simulate API — returns a ticket id
    setTimeout(() => {
      const ticketId = 'TCK-' + Math.random().toString(36).slice(2, 8).toUpperCase()
      setTicketSubmitting(false)
      setTicketSuccess({ id: ticketId, eta: '24–48 hours' })
      // reset fields
      setTicketSubject('')
      setTicketDesc('')
      setTicketFile(null)
    }, 1400)
  }

  // small helper to show file name
  function onFileChange(f?: FileList | null) {
    setTicketFile(f?.[0] ?? null)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-6 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Support</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">We’re here to help — browse FAQs, raise a ticket, or chat live with an agent.</p>
        </div>

        {/* removed Light toggle and availability text as requested */}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column: FAQs & search */}
        <section aria-labelledby="faqs-heading" className="md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 id="faqs-heading" className="text-lg font-semibold text-[#0f1724] dark:text-white">Frequently Asked Questions</h2>
              <p className="text-xs text-gray-500 dark:text-gray-300">Search articles and FAQs for instant help.</p>
            </div>

            {/* removed expand/collapse quick action buttons as requested */}
          </div>

          <div className="flex gap-3 items-center mb-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                aria-label="Search FAQs"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search FAQs, e.g. 'password', 'bank'"
                className="w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-50 dark:bg-slate-800"
              />
            </div>

            {/* removed category/tag buttons; keeping layout simple */}
          </div>

          <div className="space-y-3">
            {visibleFAQs.length === 0 && (
              <div className="p-4 rounded-lg bg-yellow-50 text-sm">No results — try different keywords or contact support.</div>
            )}

            {visibleFAQs.map((faq, idx) => {
              const isOpen = activeFAQ === faq.id
              return (
                <motion.article
                  key={faq.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16, delay: idx * 0.02 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border p-4"
                >
                  <button
                    className="w-full flex items-start justify-between gap-3 text-left"
                    onClick={() => toggleFAQ(faq.id)}
                    aria-expanded={isOpen}
                  >
                    <div>
                      <div className="font-medium text-[#0f1724] dark:text-gray-100">{faq.question}</div>
                      <div className="text-xs text-gray-400 dark:text-gray-400">Click to {isOpen ? 'hide' : 'view'} answer</div>
                    </div>

                    <motion.span
                      animate={{ rotate: isOpen ? 90 : 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="text-gray-400"
                    >
                      <ChevronRight />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="mt-3 text-gray-600 dark:text-gray-300 text-sm"
                      >
                        {faq.answer}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>
              )
            })}
          </div>

          {/* Suggested articles */}
          <div className="mt-6 bg-gradient-to-r from-white to-gray-50 dark:from-slate-900 dark:to-slate-800 p-4 rounded-xl border">
            <h3 className="text-sm font-semibold mb-2">Suggested articles</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                  <a href="#" className="underline">How Saveora keeps your data secure</a>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </li>
              <li className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FilePlus className="w-4 h-4 text-gray-400" />
                  <a className="underline">Guide: Linking a new bank (step-by-step)</a>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </li>
            </ul>
          </div>
        </section>

        {/* Right Column: Contact card + callback + ticket */}
        <aside className="space-y-4">
          {/* Contact card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#0f1724] dark:text-white flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" /> Contact Us
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-300">Response typically within 24–48 hours</p>
              </div>

              <div className="text-sm text-green-600 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" /> Secure
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-yellow-400" />
                <a href="mailto:support@saveora.com" className="text-sm font-medium text-[#0f1724] dark:text-gray-100 underline">
                  support@saveora.com
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-green-500" />
                <a href="tel:+910000000000" className="text-sm font-medium text-[#0f1724] dark:text-gray-100">+91 00000 00000</a>
              </div>

              <div className="flex items-center gap-3">
                <Twitter className="w-4 h-4 text-sky-500" />
                <a href="https://twitter.com/saveora" target="_blank" rel="noreferrer" className="text-sm font-medium text-[#0f1724] dark:text-gray-100 underline">
                  @Saveora
                </a>
              </div>

              {/* Agent status + connect */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-300 mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Estimated wait: <strong className="text-black dark:text-white">~5 min</strong></span>
                  </div>
                </div>

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

          {/* Request callback */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border p-5">
            <h4 className="text-sm font-semibold text-[#0f1724] dark:text-white mb-2">Request a callback</h4>
            <form onSubmit={requestCallback} className="flex flex-col gap-3">
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={e => setCountryCode(e.target.value)}
                  aria-label="Country code"
                  className="p-2 rounded border bg-gray-50 dark:bg-slate-800"
                >
                  <option value="+91">🇮🇳 +91</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+44">🇬🇧 +44</option>
                </select>
                <input
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="Phone number"
                  inputMode="tel"
                  className="flex-1 p-2 border rounded bg-gray-50 dark:bg-slate-800"
                />
              </div>

              {/* Preferred time */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Preferred callback time (optional)</label>
                <input
                  type="datetime-local"
                  value={preferredTime}
                  onChange={e => setPreferredTime(e.target.value)}
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-slate-800"
                />
              </div>

              {/* Query / brief message */}
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Query (brief)</label>
                <textarea
                  placeholder="Tell us briefly what you need — agent will review before calling"
                  value={callbackQuery}
                  onChange={e => setCallbackQuery(e.target.value)}
                  rows={3}
                  className="w-full p-2 border rounded bg-gray-50 dark:bg-slate-800"
                />
              </div>

              <button
                type="submit"
                className="py-2 rounded-lg bg-yellow-400 text-black font-semibold"
                aria-live="polite"
              >
                {callbackSubmitted ? 'Requested' : 'Request Callback'}
              </button>
            </form>

            <div className="mt-3 text-xs text-gray-400 dark:text-gray-400">You can also reach us on WhatsApp: <a href="https://wa.me/910000000000" target="_blank" rel="noreferrer" className="underline">Message on WhatsApp</a></div>
          </div>

          {/* Ticket / screenshot upload */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-[#0f1724] dark:text-white">Raise a support ticket</h4>
              <div className="text-xs text-gray-500 dark:text-gray-300">Include a screenshot for faster help</div>
            </div>

            {!ticketSuccess && (
              <form onSubmit={submitTicket} className="mt-3 flex flex-col gap-2">
                <input
                  placeholder="Subject"
                  value={ticketSubject}
                  onChange={e => setTicketSubject(e.target.value)}
                  className="p-2 border rounded bg-gray-50 dark:bg-slate-800"
                />
                <textarea
                  placeholder="Describe the issue (steps to reproduce, expected vs actual)"
                  value={ticketDesc}
                  onChange={e => setTicketDesc(e.target.value)}
                  rows={4}
                  className="p-2 border rounded bg-gray-50 dark:bg-slate-800"
                />
                <label className="flex items-center gap-2 text-sm text-gray-500">
                  <input type="file" accept="image/*" onChange={e => onFileChange(e.target.files)} />
                  <span className="text-xs">Attach screenshot (optional)</span>
                </label>

                <button type="submit" disabled={ticketSubmitting} className="py-2 rounded-lg bg-black text-white font-semibold">
                  {ticketSubmitting ? 'Submitting…' : 'Create Ticket'}
                </button>
              </form>
            )}

            {ticketSuccess && (
              <div className="mt-3 p-3 rounded bg-green-50 dark:bg-green-900/20 text-sm">
                <div className="font-medium">Ticket submitted — {ticketSuccess.id}</div>
                <div className="text-xs text-gray-600 dark:text-gray-300">We'll respond within {ticketSuccess.eta}</div>
                <div className="mt-2">
                  <button onClick={() => setTicketSuccess(null)} className="text-sm underline">Create another ticket</button>
                </div>
              </div>
            )}
          </div>

          {/* Support tip */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border">
            <div className="text-sm font-medium text-[#0f1724] dark:text-white">Support tip</div>
            <div className="text-xs text-gray-600 dark:text-gray-300 mt-1">For faster support, include a screenshot and account email. Mention recent steps and timestamps.</div>
          </div>
        </aside>
      </div>

      {/* Floating chat widget */}
      <div className="fixed right-5 bottom-5 z-50">
        <AnimatePresence>
          {!isChatOpen && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              onClick={() => setIsChatOpen(true)}
              aria-label="Open live chat"
              className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg flex items-center justify-center text-white"
              title="Live chat"
            >
              <MessageCircle className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isChatOpen && (
            <motion.aside
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.16 }}
              className="w-[340px] md:w-[420px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-3 border-b dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-500" />
                  <div className="text-sm font-semibold">Live Support</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-800"
                    aria-label="Close chat"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>

              <div className="flex-1 p-3 overflow-y-auto space-y-2" style={{ minHeight: 160 }}>
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`rounded-xl px-3 py-2 max-w-[80%] text-sm ${
                        m.from === 'user' ? 'bg-yellow-400 text-black' : 'bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="p-3 border-t dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg bg-gray-50 dark:bg-slate-800"
                  />
                  <button type="submit" className="py-2 px-3 rounded-lg bg-black text-white">Send</button>
                </div>

                {/* Quick feedback */}
                <div className="mt-2 text-xs text-gray-400">Tip: include screenshots for faster resolution.</div>
              </form>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* Inline rating CTA */}
      <div className="fixed left-50 bottom-8 z-0">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow p-3 border flex items-center gap-3">
          <div className="text-sm">Was this page helpful?</div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onClick={() => alert(`Thanks for rating ${n} ⭐ — we appreciate it!`)}
                title={`Rate ${n}`}
                className="p-1"
              >
                <Star className="w-4 h-4 text-yellow-400" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
