import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { PageTransition } from "@/components/layout/PageTransition";
import { AssessmentForm } from "./_components/AssessmentForm";

export const metadata: Metadata = {
  title: "Request an Assessment",
  description:
    "Tell us what you need to measure, map or monitor. Our geospatial team will shape a practical assessment around your site and intended deliverables.",
  alternates: {
    canonical: "https://geosatsoln.com/request-assessment",
  },
  openGraph: {
    title: "Request an Assessment · GeoSAT Solutions",
    description:
      "Talk to the GeoSAT geospatial team about your survey, mapping or monitoring project.",
    url: "https://geosatsoln.com/request-assessment",
    siteName: "GeoSAT Solutions",
    type: "website",
  },
};

const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1511.1055754921463!2d85.3417787125851!3d27.674936374117895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb196ea8b0f72b%3A0x25180b75ad83a236!2sGeo%20SAT%20Solutions%20Pvt.%20Ltd.!5e1!3m2!1sen!2snp!4v1792039735524!5m2!1sen!2snp";

const CONTACT_CARDS: { icon: LucideIcon; label: string; detail: string }[] = [
  {
    icon: MapPin,
    label: "Headquarters",
    detail: "Phulbari Nagar Marg, Koteshwor-32, Kathmandu 44600, Nepal",
  },
  {
    icon: Phone,
    label: "Direct Call",
    detail: "+977 9842496370",
  },
  {
    icon: Mail,
    label: "Inquiries",
    detail: "info@geosatsolutions.com.np",
  },
  {
    icon: Clock,
    label: "Office Hours",
    detail: "Mon – Fri: 9:00 AM – 5:00 PM (NPT)",
  },
];

export default function RequestAssessmentPage() {
  return (
    <>
      <Navbar />

      <PageTransition
        id="main"
        className="min-h-screen flex-1 bg-[#f7f9fa] pt-[var(--nav-h)]"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 md:py-16">
          <header>
            <h1 className="font-serif font-bold text-3xl md:text-4xl text-slate-900 mb-3">
              Get in Touch with Our Geospatial Team
            </h1>
            <p className="text-slate-600 text-sm md:text-base max-w-2xl mb-10">
              Have a survey, mapping, or monitoring project in mind? Share your requirements or
              visit our headquarters in Kathmandu.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            <div className="flex flex-col gap-6 h-full">
              <div className="grid grid-cols-2 gap-4">
                {CONTACT_CARDS.map(({ icon: Icon, label, detail }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="size-5 shrink-0 text-[#059669]" aria-hidden="true" />
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        {label}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">{detail}</p>
                  </div>
                ))}
              </div>

              <div className="w-full h-[380px] lg:h-[420px] rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <iframe
                  src={MAP_EMBED_URL}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                  className="w-full h-full"
                  title="Geo SAT Solutions location map"
                />
              </div>
            </div>

            <AssessmentForm />
          </div>
        </div>
      </PageTransition>

      <Footer />
    </>
  );
}
