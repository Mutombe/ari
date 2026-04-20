import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  Globe,
  Clock,
  Linkedin,
  Twitter,
  Facebook,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

const colors = {
  primary: "bg-emerald-600",
  primaryHover: "hover:bg-emerald-700",
  secondary: "bg-purple-600",
  accent: "bg-amber-500",
};

const offices = [
  {
    country: "Zimbabwe",
    flag: "🇿🇼",
    role: "Regional HQ",
    address: "Harare, Zimbabwe",
    email: "info@africarecsintl.org",
    phone: "+263 77 000 0000",
  },
  {
    country: "Zambia",
    flag: "🇿🇲",
    role: "Country Office",
    address: "Lusaka, Zambia",
    email: "zambia@africarecsintl.org",
    phone: "+260 97 000 0000",
  },
  {
    country: "Uganda",
    flag: "🇺🇬",
    role: "Country Office",
    address: "Kampala, Uganda",
    email: "uganda@africarecsintl.org",
    phone: "+256 70 000 0000",
  },
];

const topics = [
  "General Inquiry",
  "Device Registration",
  "Issue Request Support",
  "Partnership / Investment",
  "Press & Media",
  "Technical Support",
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    organisation: "",
    topic: topics[0],
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  const update = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Please enter your name";
    if (!form.email.trim()) next.email = "Please enter your email";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "That doesn't look like a valid email";
    if (!form.message.trim() || form.message.trim().length < 10)
      next.message = "Message must be at least 10 characters";
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    const subject = encodeURIComponent(`[${form.topic}] ${form.name}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\n` +
        `Email: ${form.email}\n` +
        (form.organisation ? `Organisation: ${form.organisation}\n` : "") +
        `Topic: ${form.topic}\n\n` +
        `${form.message}\n`
    );
    window.location.href = `mailto:info@africarecsintl.org?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-purple-600 opacity-90" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.18),transparent_45%)]" />
        </div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            className="max-w-3xl text-white"
          >
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-3 py-1 rounded-full text-xs font-medium mb-4">
              <MessageSquare className="h-3.5 w-3.5" /> We'd love to hear from you
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Get in touch
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl">
              Questions about registering devices, issuing RECs, partnerships
              or media — our team across Africa is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick contact strip */}
      <section className="py-10 -mt-8 relative z-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <Mail className="h-5 w-5" />,
                label: "Email us",
                value: "info@africarecsintl.org",
                href: "mailto:info@africarecsintl.org",
                tint: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
              },
              {
                icon: <Phone className="h-5 w-5" />,
                label: "Call the team",
                value: "+263 77 000 0000",
                href: "tel:+263770000000",
                tint: "bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
              },
              {
                icon: <Clock className="h-5 w-5" />,
                label: "Office hours",
                value: "Mon – Fri · 08:00 – 17:00 CAT",
                tint: "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
              },
            ].map((c, i) => (
              <motion.a
                key={c.label}
                href={c.href}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5 flex items-center gap-4 hover:shadow-lg transition-shadow"
              >
                <div className={`p-3 rounded-xl ${c.tint}`}>{c.icon}</div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">
                    {c.label}
                  </p>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {c.value}
                  </p>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Form + offices */}
      <section className="py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 md:p-8"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Send us a message
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                We'll get back to you within one working day.
              </p>
            </div>

            {sent && (
              <div className="mb-5 flex items-start gap-3 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200">
                <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  Your email client should now be open with a pre-filled
                  message. If nothing happened, just email us directly at{" "}
                  <a
                    href="mailto:info@africarecsintl.org"
                    className="font-semibold underline"
                  >
                    info@africarecsintl.org
                  </a>
                  .
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    Full name
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={update("name")}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3.5 py-2.5 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Tatenda Moyo"
                  />
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3.5 py-2.5 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    Organisation{" "}
                    <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={form.organisation}
                    onChange={update("organisation")}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3.5 py-2.5 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Green Energy Ltd."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                    Topic
                  </label>
                  <select
                    value={form.topic}
                    onChange={update("topic")}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3.5 py-2.5 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {topics.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={5}
                  value={form.message}
                  onChange={update("message")}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3.5 py-2.5 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y"
                  placeholder="Tell us a bit about what you need…"
                />
                {errors.message && (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                    {errors.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By submitting, you agree our team may contact you about your
                  enquiry.
                </p>
                <button
                  type="submit"
                  className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 ${colors.primary} ${colors.primaryHover} text-white font-semibold rounded-lg shadow-sm transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2`}
                >
                  Send message
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>

          {/* Offices */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            className="lg:col-span-2 space-y-4"
          >
            <div className="bg-gradient-to-br from-emerald-600 to-purple-700 rounded-2xl shadow-md p-6 text-white">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Our offices</h3>
              </div>
              <p className="text-white/85 text-sm">
                Present across the continent with country programmes running in
                Zimbabwe, Zambia, Uganda, Malawi, Namibia, Lesotho, Eswatini,
                Angola and the DRC.
              </p>
            </div>

            {offices.map((o, i) => (
              <motion.div
                key={o.country}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden>
                      {o.flag}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white leading-tight">
                        {o.country}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {o.role}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span>{o.address}</span>
                  </div>
                  <a
                    href={`mailto:${o.email}`}
                    className="flex items-start gap-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    <Mail className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span>{o.email}</span>
                  </a>
                  <a
                    href={`tel:${o.phone.replace(/\s+/g, "")}`}
                    className="flex items-start gap-2 text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400"
                  >
                    <Phone className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
                    <span>{o.phone}</span>
                  </a>
                </div>
              </motion.div>
            ))}

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-5">
              <p className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                Follow our work
              </p>
              <div className="flex items-center gap-3">
                {[
                  { Icon: Linkedin, href: "#", label: "LinkedIn" },
                  { Icon: Twitter, href: "#", label: "Twitter / X" },
                  { Icon: Facebook, href: "#", label: "Facebook" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-2.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ strip */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 dark:text-white">
            Before you reach out
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">
            A few quick answers to the things we get asked the most.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {[
              {
                q: "How long does device registration take?",
                a: "Most submissions are reviewed within 3 working days once all supporting documents are attached.",
              },
              {
                q: "Who can issue RECs on this platform?",
                a: "Any operator of an approved renewable energy device located in a supported country can submit issue requests.",
              },
              {
                q: "Is there a fee to join?",
                a: "Creating an account is free. Issuance fees depend on your country programme — the team will confirm on request.",
              },
              {
                q: "Can I migrate from an existing registry?",
                a: "Yes. Email us with your current registry details and we'll walk you through the migration process.",
              },
            ].map((f) => (
              <div
                key={f.q}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5"
              >
                <p className="font-semibold text-gray-900 dark:text-white mb-1">
                  {f.q}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
