
import { useState } from "react";
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  CreditCard,
  Utensils,
  ShoppingBag,
  Bike,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  CalendarDays,
  Navigation,
  Store,
} from "lucide-react";

import {
  BUSINESS_INFO,
  BUSINESS_TEXT,
  LANGUAGES,
  DAY_KEYS,
} from "./businessInfoData";

function InfoCard({ icon: Icon, title, children }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#1b1b1b] p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl bg-red-500/10 p-2.5 text-red-400">
          <Icon size={20} />
        </div>

        <h3 className="font-bold text-white">{title}</h3>
      </div>

      {children}
    </section>
  );
}

export default function BusinessInfo() {
  const [language, setLanguage] = useState("es");
  const [openFaq, setOpenFaq] = useState(null);

  const text = BUSINESS_TEXT[language] || BUSINESS_TEXT.es;

  const serviceItems = [
    {
      key: "dineIn",
      icon: Store,
    },
    {
      key: "takeaway",
      icon: ShoppingBag,
    },
    {
      key: "delivery",
      icon: Bike,
    },
  ];

  return (
    <main className="min-h-screen bg-[#101010] px-4 py-6 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-red-400">
              <Utensils size={15} />
              Yutori Sushi Bar
            </div>

            <h1 className="text-3xl font-black sm:text-4xl">
              {text.title}
            </h1>

            <p className="mt-2 text-sm text-gray-400">
              {text.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(LANGUAGES).map(([code, name]) => (
              <button
                key={code}
                type="button"
                onClick={() => {
                  setLanguage(code);
                  setOpenFaq(null);
                }}
                className={`rounded-xl border px-3 py-2 text-xs font-bold transition ${
                  language === code
                    ? "border-red-500 bg-red-600 text-white"
                    : "border-white/10 bg-[#1b1b1b] text-gray-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </header>

        {/* Welcome banner */}
        <section className="relative overflow-hidden rounded-3xl border border-red-500/20 bg-gradient-to-br from-[#301414] via-[#201414] to-[#171717] p-6 sm:p-8">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-red-600/10 blur-3xl" />

          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-red-300">
              {text.about}
            </p>

            <h2 className="mt-3 text-3xl font-black">
              Yutori Sushi Bar
            </h2>

            <p className="mt-3 leading-relaxed text-gray-300">
              {text.tip}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={BUSINESS_INFO.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-green-500"
              >
                <MessageCircle size={18} />
                {text.whatsapp}
                <ExternalLink size={14} />
              </a>

              <a
                href={BUSINESS_INFO.mapsLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <Navigation size={17} />
                {text.directions}
              </a>
            </div>
          </div>
        </section>

        {/* Contact details */}
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard icon={MapPin} title={text.address}>
            <p className="text-sm leading-relaxed text-gray-300">
              {BUSINESS_INFO.address}
            </p>

            <a
              href={BUSINESS_INFO.mapsLink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300"
            >
              <MapPin size={16} />
              {text.directions}
              <ExternalLink size={13} />
            </a>
          </InfoCard>

          <InfoCard icon={Phone} title={text.contact}>
            <p className="text-sm text-gray-400">{text.phone}</p>

            <p className="mt-1 text-xl font-bold tracking-wide text-white">
              {BUSINESS_INFO.phone}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={BUSINESS_INFO.phoneLink}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-gray-200 hover:bg-white/10"
              >
                <Phone size={15} />
                {text.call}
              </a>

              <a
                href={BUSINESS_INFO.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-green-600/15 px-3 py-2 text-xs font-bold text-green-400 hover:bg-green-600/25"
              >
                <MessageCircle size={15} />
                WhatsApp
                <ExternalLink size={12} />
              </a>
            </div>
          </InfoCard>
        </div>

        {/* Services and payments */}
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard icon={Utensils} title={text.services}>
            <div className="space-y-3">
              {serviceItems.map(({ key, icon: Icon }) => (
                <div
                  key={key}
                  className="flex items-center gap-3 rounded-xl bg-[#242424] p-3"
                >
                  <div className="rounded-lg bg-red-500/10 p-2 text-red-400">
                    <Icon size={18} />
                  </div>

                  <span className="text-sm font-medium text-gray-200">
                    {text[key]}
                  </span>
                </div>
              ))}
            </div>
          </InfoCard>

          <InfoCard icon={CreditCard} title={text.payments}>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-xl bg-[#242424] p-3">
                <CreditCard size={19} className="text-red-400" />
                <span className="text-sm text-gray-200">
                  {text.credit}
                </span>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[#242424] p-3">
                <CreditCard size={19} className="text-red-400" />
                <span className="text-sm text-gray-200">
                  {text.debit}
                </span>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Opening hours */}
        <InfoCard icon={Clock} title={text.hours}>
          <div className="space-y-2">
            {DAY_KEYS.map((day, index) => {
              const hours = BUSINESS_INFO.hours[index];

              return (
                <div
                  key={day}
                  className="flex items-center justify-between gap-3 rounded-lg bg-[#242424] px-4 py-3"
                >
                  <span className="text-sm font-medium text-gray-300">
                    {text[day]}
                  </span>

                  <span className="text-sm font-bold tabular-nums text-white">
                    {hours.time}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-4">
            <Info
              size={18}
              className="mt-0.5 shrink-0 text-yellow-400"
            />

            <p className="text-xs leading-relaxed text-gray-400">
              {text.hoursNotice}
            </p>
          </div>
        </InfoCard>

        {/* FAQ */}
        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-500/10 p-2.5 text-red-400">
              <MessageCircle size={20} />
            </div>

            <h2 className="text-xl font-black">{text.faq}</h2>
          </div>

          {text.faqItems.map((item, index) => {
            const isOpen = openFaq === index;

            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-white/10 bg-[#1b1b1b]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-white/5"
                >
                  <span className="text-sm font-semibold text-gray-200">
                    {item.question}
                  </span>

                  {isOpen ? (
                    <ChevronUp
                      size={19}
                      className="shrink-0 text-red-400"
                    />
                  ) : (
                    <ChevronDown
                      size={19}
                      className="shrink-0 text-gray-500"
                    />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-white/10 px-4 py-4">
                    <p className="text-sm leading-relaxed text-gray-400">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </section>

        

        <p className="pb-4 text-center text-xs leading-relaxed text-gray-600">
          {text.lastNote}
        </p>
      </div>
    </main>
  );
}
