"use client";

import * as React from "react";
import { SectionWrapper } from "../ui/SectionWrapper";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Sparkles,
  XCircle,
  Loader2,
} from "lucide-react";
import { sendContactMessageAction } from "@/app/actions/contact";

import contentData from "@/data/content.json";
import mockupData from "@/data/mockup.json";

export interface ContactSectionProps {
  contactData?: {
    name?: string | null;
    position?: string | null;
    gmail?: string | null;
    location?: string | null;
    availability?: string | null;
  } | null;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contactData,
}) => {
  const name = contactData?.name || mockupData.user.name;
  const position = contactData?.position || mockupData.user.position;
  const gmail = contactData?.gmail || mockupData.contact.gmail;
  const location = contactData?.location || mockupData.contact.location;
  const availability = contactData?.availability || mockupData.contact.availability;

  const [submitted, setSubmitted] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [fallbackGmail, setFallbackGmail] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFailed(false);

    const result = await sendContactMessageAction(formData);

    setLoading(false);
    if (result.success) {
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    } else {
      setFallbackGmail(result.gmail ?? null);
      setFailed(true);
    }
  };

  const handleRetry = () => {
    setFailed(false);
  };

  return (
    <SectionWrapper
      id="contact"
      kanjiSubtitle={contentData.contact.kanjiSubtitle}
      sectionTitle={contentData.contact.sectionTitle}
      sectionDescription={contentData.contact.sectionDescription}
      bgVariant="paper"
      className="pt-10 sm:pt-14 pb-16 sm:pb-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Information Column */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 bg-surface space-y-6">
            <div className="flex items-center space-x-3 pb-4 border-b border-border-subtle">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-serif font-bold text-lg">
                {contentData.contact.infoCard.hankoGlyph}
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-ink">
                  {name}
                </h3>
                <p className="text-xs font-mono text-ink-muted">{position}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-ink-muted">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-mono text-ink-muted block uppercase">
                    {contentData.contact.infoCard.labelDirectEmail}
                  </span>
                  <a
                    href={`mailto:${gmail}`}
                    className="text-[#b34c53] font-medium hover:text-primary transition-colors text-base"
                  >
                    <span>{gmail}</span>
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-mono text-ink-muted block uppercase">
                    {contentData.contact.infoCard.labelLocation}
                  </span>
                  <span className="text-ink font-medium">{location}</span>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-mono text-ink-muted block uppercase">
                    {contentData.contact.infoCard.labelAvailability}
                  </span>
                  <span className="text-emerald-700 font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {availability}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded bg-[#f6e0ce]/40 border border-[#ebd9c8] text-xs text-ink-muted font-serif italic">
              &quot;{contentData.contact.infoCard.quote}&quot;
            </div>
          </Card>
        </div>

        {/* Right Contact Form Column */}
        <div className="lg:col-span-7">
          <Card className="p-6 sm:p-8 bg-surface">
            {loading ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary mx-auto flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-ink">
                  {contentData.contact.states.loading.title}
                </h3>
                <p className="text-sm text-ink-muted max-w-md mx-auto">
                  {contentData.contact.states.loading.description}
                </p>
              </div>
            ) : submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-ink">
                  {contentData.contact.states.success.title}
                </h3>
                <p className="text-sm text-ink-muted max-w-md mx-auto">
                  {contentData.contact.states.success.description}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSubmitted(false)}
                  className="mt-4"
                >
                  {contentData.contact.states.success.ctaSendAnother}
                </Button>
              </div>
            ) : failed ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
                  <XCircle className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-ink">
                  {contentData.contact.states.failed.title}
                </h3>
                <p className="text-sm text-ink-muted max-w-sm mx-auto">
                  {contentData.contact.states.failed.description}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button variant="outline" size="sm" onClick={handleRetry}>
                    {contentData.contact.states.failed.ctaRetry}
                  </Button>
                  {fallbackGmail && (
                    <a
                      href={`mailto:${fallbackGmail}?subject=${encodeURIComponent(formData.subject || "Hello")}&body=${encodeURIComponent(
                        `Hi,\n\n${formData.message}\n\nBest regards,\n${formData.name}`,
                      )}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                      <Mail className="w-4 h-4" />
                      {contentData.contact.states.failed.ctaEmailDirect}
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-ink font-medium">
                      {contentData.contact.form.labelName}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={contentData.contact.form.placeholderName}
                      className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-ink font-medium">
                      {contentData.contact.form.labelEmail}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder={contentData.contact.form.placeholderEmail}
                      className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-ink font-medium">
                    {contentData.contact.form.labelSubject}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder={contentData.contact.form.placeholderSubject}
                    className="w-full px-3.5 py-2.5 rounded-md border border-border-warm bg-paper text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-ink font-medium">
                    {contentData.contact.form.labelMessage}
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder={contentData.contact.form.placeholderMessage}
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
                  {loading
                    ? contentData.contact.form.submitSending
                    : contentData.contact.form.submitLabel}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </SectionWrapper>
  );
};
