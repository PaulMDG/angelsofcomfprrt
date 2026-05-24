import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Eyebrow } from "@/components/site/Reveal";
import { BotanicalSprig, MonogramAC } from "@/components/site/Botanical";
import { PageHeader } from "./PageHeader";
import { supabase } from "@/integrations/supabase/client";
import still from "@/assets/consultation-still.jpg";

const careTypeOptions = [
  "Dementia / Memory Care",
  "Companion Care",
  "Personal Care",
  "Respite Care",
  "Live-In Care",
  "Hospital Discharge",
  "Recovery Support",
  "Not sure yet",
] as const;

const schema = z.object({
  full_name: z.string().min(2, "Please share your name").max(120),
  email: z.string().email("Please share a valid email"),
  phone: z.string().min(7, "A reachable phone number, please").max(40),
  relationship: z.string().max(80).optional().or(z.literal("")),
  care_for: z.string().max(120).optional().or(z.literal("")),
  care_types: z.array(z.string()).optional(),
  timeline: z.string().max(60).optional().or(z.literal("")),
  zip: z.string().max(20).optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

export function ConsultationPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { care_types: [] },
  });

  const selected = watch("care_types") ?? [];

  const toggleCareType = (t: string) => {
    const next = selected.includes(t) ? selected.filter((s) => s !== t) : [...selected, t];
    setValue("care_types", next, { shouldDirty: true });
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const { error } = await supabase.from("consultations").insert({
      full_name: values.full_name,
      email: values.email,
      phone: values.phone,
      relationship: values.relationship || null,
      care_for: values.care_for || null,
      care_types: values.care_types?.length ? values.care_types : null,
      timeline: values.timeline || null,
      zip: values.zip || null,
      message: values.message || null,
    });
    if (error) {
      setServerError("Something went wrong on our end. Please try again or call us directly.");
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Schedule a Conversation"
        title="Let's talk about care for"
        italic="your loved one."
        intro="Tell us a little about your family. A senior care advisor will respond personally within one business day — and there is never any obligation."
      />

      <section className="bg-[var(--cream)]">
        <div className="container-editorial section-pad grid lg:grid-cols-12 gap-16">
          <aside className="lg:col-span-4">
            <Reveal>
              <div className="overflow-hidden rounded-[6px] hidden lg:block">
                <img
                  src={still}
                  alt="A journal, fountain pen, and lavender on a linen surface"
                  loading="lazy"
                  className="w-full h-[420px] object-cover"
                />
              </div>
              <div className="mt-8">
                <Eyebrow>Or reach us directly</Eyebrow>
                <ul className="mt-6 space-y-5 text-[15px] text-[var(--text-body)]">
                  <li>
                    <div className="text-[11px] tracking-[0.18em] uppercase text-[var(--gold)] mb-1">
                      By Phone
                    </div>
                    <a
                      href="tel:2404263304"
                      className="font-serif text-[26px] text-[var(--navy-deep)] hover:text-[var(--gold-muted)] transition-colors"
                    >
                      (240) 426-3304
                    </a>
                    <p className="text-[13px] text-[var(--warm-gray)] mt-1">
                      Mon–Fri 8am–6pm · 24/7 urgent line
                    </p>
                  </li>
                  <li>
                    <div className="text-[11px] tracking-[0.18em] uppercase text-[var(--gold)] mb-1">
                      By Email
                    </div>
                    <a
                      href="mailto:hello@angelsofcomfort.com"
                      className="font-serif text-[18px] text-[var(--navy-deep)] hover:text-[var(--gold-muted)] transition-colors"
                    >
                      hello@angelsofcomfort.com
                    </a>
                  </li>
                  <li>
                    <div className="text-[11px] tracking-[0.18em] uppercase text-[var(--gold)] mb-1">
                      In Person
                    </div>
                    <p className="text-[15px] leading-[1.7] text-[var(--text-body)]">
                      10400 Little Patuxent Pkwy
                      <br /> Suite 300, Columbia, MD 21044
                    </p>
                  </li>
                </ul>
                <BotanicalSprig className="w-28 h-8 text-[var(--gold)] mt-10" />
                <p className="mt-6 font-serif italic text-[18px] text-[var(--gold-muted)] leading-[1.5]">
                  "Every family we meet teaches us something new about love."
                </p>
              </div>
            </Reveal>
          </aside>

          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  className="bg-[var(--ivory)] border border-[var(--gold)]/30 rounded-[6px] p-12 lg:p-16 text-center"
                >
                  <MonogramAC className="w-14 h-14 text-[var(--gold)] mx-auto" />
                  <div className="mt-8 eyebrow eyebrow-center justify-center">Thank you</div>
                  <h2
                    className="mt-6 font-serif font-medium text-[var(--navy-deep)] leading-[1.05]"
                    style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
                  >
                    Your message is <span className="gold-italic">on its way.</span>
                  </h2>
                  <BotanicalSprig className="w-28 h-8 text-[var(--gold)] mx-auto mt-6" />
                  <p className="editorial-body mt-6 max-w-md mx-auto">
                    A senior care advisor will reach out personally within one business day.
                    If your situation is urgent, please call us at{" "}
                    <a
                      href="tel:2404263304"
                      className="text-[var(--gold-muted)] underline underline-offset-4"
                    >
                      (240) 426-3304
                    </a>{" "}
                    — we're here 24/7.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="bg-[var(--ivory)] border border-[var(--gold)]/30 rounded-[6px] p-8 lg:p-12 space-y-10"
                  noValidate
                >
                  <FormSection number="01" title="About you">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <Field label="Full Name" error={errors.full_name?.message}>
                        <input
                          {...register("full_name")}
                          className="form-input"
                          placeholder="Your name"
                        />
                      </Field>
                      <Field label="Relationship">
                        <input
                          {...register("relationship")}
                          className="form-input"
                          placeholder="Daughter, son, spouse…"
                        />
                      </Field>
                      <Field label="Email" error={errors.email?.message}>
                        <input
                          {...register("email")}
                          type="email"
                          className="form-input"
                          placeholder="you@email.com"
                        />
                      </Field>
                      <Field label="Phone" error={errors.phone?.message}>
                        <input
                          {...register("phone")}
                          type="tel"
                          className="form-input"
                          placeholder="(240) 555-0100"
                        />
                      </Field>
                    </div>
                  </FormSection>

                  <FormSection number="02" title="About your loved one">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <Field label="Their name (optional)">
                        <input
                          {...register("care_for")}
                          className="form-input"
                          placeholder="First name only is fine"
                        />
                      </Field>
                      <Field label="ZIP code">
                        <input
                          {...register("zip")}
                          className="form-input"
                          placeholder="21044"
                        />
                      </Field>
                    </div>
                    <Field label="What kind of care are you exploring?" className="mt-6">
                      <div className="flex flex-wrap gap-2.5 mt-1">
                        {careTypeOptions.map((opt) => {
                          const active = selected.includes(opt);
                          return (
                            <button
                              type="button"
                              key={opt}
                              onClick={() => toggleCareType(opt)}
                              className="px-4 py-2 rounded-full text-[12px] tracking-[0.06em] transition-all border"
                              style={{
                                background: active ? "var(--navy-deep)" : "transparent",
                                color: active ? "var(--gold-light)" : "var(--text-body)",
                                borderColor: active
                                  ? "var(--navy-deep)"
                                  : "rgba(184,147,90,0.4)",
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </Field>
                    <Field label="When might care begin?" className="mt-6">
                      <select {...register("timeline")} className="form-input">
                        <option value="">Select a timeline</option>
                        <option>As soon as possible</option>
                        <option>Within the next 2 weeks</option>
                        <option>Within the next month</option>
                        <option>Just exploring for now</option>
                      </select>
                    </Field>
                  </FormSection>

                  <FormSection number="03" title="Anything else?">
                    <Field label="Tell us about your situation">
                      <textarea
                        {...register("message")}
                        rows={5}
                        className="form-input resize-none"
                        placeholder="A few sentences is plenty — we'll follow up to learn more."
                      />
                    </Field>
                  </FormSection>

                  {serverError ? (
                    <p className="text-[14px] text-[var(--destructive)] bg-[var(--destructive)]/5 border border-[var(--destructive)]/30 rounded-[4px] px-4 py-3">
                      {serverError}
                    </p>
                  ) : null}

                  <div className="pt-6 border-t border-[var(--gold)]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <p className="text-[12px] tracking-[0.04em] text-[var(--warm-gray)] max-w-sm leading-relaxed">
                      Your information stays with us. We never share it with anyone, ever.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Sending…" : "Send Message"}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </>
  );
}

function FormSection({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-baseline gap-4 mb-6">
        <span className="text-[11px] tracking-[0.22em] uppercase text-[var(--gold)]">{number}</span>
        <h2 className="font-serif text-[24px] text-[var(--navy-deep)]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
  error,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="text-[11px] tracking-[0.18em] uppercase text-[var(--warm-gray)] block mb-2">
        {label}
      </span>
      {children}
      {error ? (
        <span className="text-[12px] text-[var(--destructive)] mt-2 block">{error}</span>
      ) : null}
    </label>
  );
}