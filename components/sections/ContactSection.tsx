"use client";

import * as React from "react";
import { SectionWrapper } from "../ui/SectionWrapper";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Mail, MapPin, Send, CheckCircle2, Sparkles } from "lucide-react";

export interface ContactSectionProps {
  contactData?: {
    name?: string | null;
    position?: string | null;
    gmail?: string | null;
    location?: string | null;
    availability?: string | null;
  } | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ contactData }) => {
  const name = contactData?.name || "Zaenal Alfian";
  const position = contactData?.position || "Full-Stack Engineer";
  const gmail = contactData?.gmail || "zaenalalfian20@gmail.com";
  const location = contactData?.location || "Karawang, Indonesia / Remote";
  const availability = contactData?.availability || "Accepting Projects & Roles";

  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <SectionWrapper
      id="contact"
      kanjiSubtitle="お問い合わせ"
      sectionTitle="Let's Build Something Great!"
      sectionDescription="Open for senior engineering leadership, frontend architecture consulting, and high-impact web product development."
      bgVariant="paper"
      className="pt-10 sm:pt-14 pb-16 sm:pb-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Information Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 bg-surface space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-border-subtle">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif font-bold text-lg">
                印
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-ink">{name}</h3>
                <p className="text-xs font-mono text-ink-muted">{position}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-ink-muted">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-mono text-ink-muted block uppercase">Direct Email</span>
                  <a
                    href={`mailto:${gmail}`}
                    className="text-[#b34c53] font-medium hover:text-primary transition-colors text-base"
                  >
                    {gmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-mono text-ink-muted block uppercase">Location</span>
                  <span className="text-ink font-medium">{location}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-mono text-ink-muted block uppercase">Availability</span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {availability}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded bg-[#f6e0ce]/40 border border-[#ebd9c8] text-xs text-ink-muted font-serif italic">
              &quot;Quality is never an accident; it is always the result of high intention, sincere effort, and intelligent execution.&quot;
            </div>
          </Card>
        </div>

        {/* Right Contact Form Column */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 bg-surface">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-ink">Message Sent / 送信完了</h3>
                <p className="text-sm text-ink-muted max-w-md mx-auto">
                  Thank you for reaching out. I have received your message and will respond within 24 hours.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                  className="mt-4"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-ink font-medium">Your Name / お名前 *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Zaenal Alfian"
                      className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-ink font-medium">Email Address / メール *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. zaenal@example.com"
                      className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-ink font-medium">Subject / 件名 *</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Project Architecture Inquiry"
                    className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-ink font-medium">Message / 本文 *</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell me about your project, timeline, and product goals...."
                    className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="w-full justify-center"
                  icon={<Send className="w-4 h-4" />}
                >
                  {loading ? "Sending Message..." : "Send Message"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
};
