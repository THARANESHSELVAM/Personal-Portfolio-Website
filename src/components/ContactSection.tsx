"use client";

import { useState } from "react";
import { PROFILE } from "@/data/profile";
import confetti from "canvas-confetti";
import { 
  Mail, 
  Send, 
  Copy, 
  Check, 
  Calendar, 
  MapPin, 
  Phone, 
  Sparkles, 
  AlertCircle,
  ExternalLink,
  Clock,
  CheckCircle2,
  X
} from "lucide-react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Technical Architecture / Principal Role Inquiry",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  // Validate form
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Full name is required.";
    if (!formData.email.trim()) {
      errs.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Please provide a valid corporate or personal email.";
    }
    if (!formData.message.trim() || formData.message.trim().length < 15) {
      errs.message = "Message must be at least 15 characters to provide context.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    // Simulate realistic async submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Fallback gracefully
      }
    }, 900);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(PROFILE.contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 mb-3">
            <Mail className="w-3.5 h-3.5" />
            <span>LET&apos;S CONNECT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Initiate a Technical Conversation
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
            Exploring high-impact Principal / Staff engineering leadership opportunities, architectural advisory, or system design deep-dives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info & Quick Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Contact Coordinates
              </h3>

              <div className="space-y-4">
                {/* Email with 1-click copy */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-mono text-slate-400">Direct Email</div>
                      <a
                        href={`mailto:${PROFILE.contact.email}`}
                        className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-cyan-500 transition-colors"
                      >
                        {PROFILE.contact.email}
                      </a>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Copy email address"
                  >
                    {copiedEmail ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">Location</div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      {PROFILE.contact.location}
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-mono text-slate-400">Direct Phone</div>
                    <div className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                      {PROFILE.contact.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting Scheduler CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setIsSchedulerOpen(true)}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book 30-Min Technical Architecture Sync</span>
                </button>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Typical response time:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> &lt; 12 Hours
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Client-Validated Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800">
              {isSuccess ? (
                <div className="text-center py-12 space-y-4 animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Transmission Received
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                    Thank you, <span className="font-semibold">{formData.name}</span>. Your message has been routed directly to Alex&apos;s priority inbox. Expect a response within 12 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSuccess(false);
                      setFormData({
                        name: "",
                        email: "",
                        subject: "Technical Architecture / Principal Role Inquiry",
                        message: "",
                      });
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      Direct Inquiries
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Fill out the form below for technical discussions, hiring opportunities, or advisory work.
                    </p>
                  </div>

                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sarah Connor"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errors.name) setErrors({ ...errors, name: "" });
                      }}
                      className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border focus:outline-none focus:ring-2 ${
                        errors.name
                          ? "border-rose-500 focus:ring-rose-500/50"
                          : "border-slate-200 dark:border-slate-700 focus:ring-cyan-500/50"
                      }`}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  {/* Email field */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. sarah@enterprise.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border focus:outline-none focus:ring-2 ${
                        errors.email
                          ? "border-rose-500 focus:ring-rose-500/50"
                          : "border-slate-200 dark:border-slate-700 focus:ring-cyan-500/50"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>

                  {/* Subject field */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Topic / Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 bg-white dark:bg-slate-900"
                    >
                      <option value="Principal / Staff Role Inquiry">Principal / Staff Role Inquiry</option>
                      <option value="System Design & Architecture Advisory">System Design &amp; Architecture Advisory</option>
                      <option value="Technical Consultation">Technical Consultation</option>
                      <option value="Other">Other Inquiry</option>
                    </select>
                  </div>

                  {/* Message field */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Message <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Share details about the role, scale challenges, or technical problem..."
                      value={formData.message}
                      onChange={(e) => {
                        setFormData({ ...formData, message: e.target.value });
                        if (errors.message) setErrors({ ...errors, message: "" });
                      }}
                      className={`w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl glass-panel text-slate-900 dark:text-white placeholder-slate-400 border focus:outline-none focus:ring-2 resize-none ${
                        errors.message
                          ? "border-rose-500 focus:ring-rose-500/50"
                          : "border-slate-200 dark:border-slate-700 focus:ring-cyan-500/50"
                      }`}
                    />
                    {errors.message && (
                      <p className="text-[11px] text-rose-500 flex items-center gap-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors.message}</span>
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-600 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm shadow-md shadow-cyan-500/20 transition-all duration-200 active:scale-98"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Transmitting Secure Message...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send Direct Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Meeting Scheduler Interactive Modal */}
      {isSchedulerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
            onClick={() => setIsSchedulerOpen(false)}
          />
          <div className="relative w-full max-w-lg glass-panel bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 z-10 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    Schedule 30-Min Technical Sync
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Direct calendar reservation via Cal.com / Calendly
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSchedulerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <div className="font-bold text-cyan-600 dark:text-cyan-400">Sync Agenda:</div>
                <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Technical leadership alignment &amp; principal scope</li>
                  <li>Architecture challenges, high-concurrency pipelines, or scale roadmap</li>
                  <li>Mutual cultural and engineering philosophy fit</li>
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-center">
                  <div className="font-mono text-cyan-500 font-bold">Tuesday &amp; Thursday</div>
                  <div className="text-[11px] text-slate-500">2:00 PM - 5:00 PM PST</div>
                </div>
                <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-center">
                  <div className="font-mono text-cyan-500 font-bold">Wednesday &amp; Friday</div>
                  <div className="text-[11px] text-slate-500">9:00 AM - 12:00 PM PST</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={PROFILE.contact.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-xs shadow-md transition-all"
              >
                <span>Open Instant Calendly Booking</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                type="button"
                onClick={() => setIsSchedulerOpen(false)}
                className="w-full py-2.5 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
