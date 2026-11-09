"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import MapWrapper from "@/components/map/MapWrapper";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { REGIONAL_STANDORTE } from "@/lib/content/standorte";
import { getTotalPlacements, successStories } from "@/lib/data/success-stories";
import { SPEAKABLE_SPECIFICATION } from "@/lib/seo/aeo-schemas";
import { SITE_NAME, SITE_URL, siteUrl } from "@/lib/site";
import { ArrowRight, Briefcase, MapPin, ShieldCheck, Users } from "lucide-react";

const REFERENZEN_FAQS = [
  {
    question:
      "Welche Erfahrungen machen deutsche Arbeitgeber mit Fachkräften und Azubis von DMF Talents?",
    answer:
      "Mit über 66 erfolgreichen Platzierungen in mehr als 10 deutschen Städten (u. a. Berlin, München, Hamburg, Stuttgart, Frankfurt, Köln, Leipzig und Meppen/Niedersachsen) erzielen durch DMF Talents vorbereitete Kandidaten eine Bleibequote von über 95 % nach der Probezeit. Entscheidende Erfolgsfaktoren sind das zertifizierte B1/B2-Sprachtraining in Vietnam, die interkulturelle Vorbereitung mit deutschen Muttersprachlern (Achim Betticher) und die persönliche Begleitung bei Einreise und Wohnungsübergabe.",
  },
  {
    question:
      "Wie schneidet die Direktvermittlung über DMF Talents im 3-Jahres-Kostenvergleich gegenüber Zeitarbeit ab?",
    answer:
      "Während Zeitarbeit (Arbeitnehmerüberlassung) einem Betrieb oft 18.000 bis 25.000 EUR Mehrkosten pro Jahr verursacht und keine dauerhafte Personalbindung schafft, liegt die einmalige Investition einer DMF Full-Service-Direktvermittlung deutlich darunter und amortisiert sich im Schnitt bereits nach 4 bis 7 Monaten – bei festem Arbeits- oder Ausbildungsvertrag direkt mit Ihrem Unternehmen.",
  },
  {
    question:
      "Woran erkennen Arbeitgeber eine seriöse Personalvermittlung für Vietnam (§ 296a SGB III / Faire Migration)?",
    answer:
      "Seriöse Anbieter wie DMF Talents verfügen über einen eigenen Ausbildungscampus in Vietnam (DMF Vietnam JSC), einen festen Ansprechpartner in Deutschland (Umit Elezov), original dokumentierte D-Visa-Bescheide und arbeiten strikt nach dem Employer-Pays-Prinzip (§ 296a SGB III), sodass von Auszubildenden keine unzulässigen Vermittlungsgebühren verlangt werden.",
  },
];

type GalleryCategory = "all" | "visa" | "experts" | "community";

export default function ReferenzenPage() {
  const { t, lang } = useLanguage();
  const totalPlacements = getTotalPlacements();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>("all");

  const filterTabs: Array<{ id: GalleryCategory; label: string }> = [
    {
      id: "all",
      label:
        lang === "vn"
          ? "Tất cả (16)"
          : lang === "en"
            ? "All Highlights (16)"
            : "Alle Einblicke (16)",
    },
    {
      id: "visa",
      label:
        lang === "vn"
          ? "Thành tựu Visa & Xuất cảnh"
          : lang === "en"
            ? "Visa & Departure"
            : "Visumerfolge & Ausreise",
    },
    {
      id: "experts",
      label:
        lang === "vn"
          ? "Chuyên gia & Phái đoàn Đức"
          : lang === "en"
            ? "German Experts & Delegations"
            : "Deutsche Experten & Delegationen",
    },
    {
      id: "community",
      label:
        lang === "vn"
          ? "Học viện & Cộng đồng DMF"
          : lang === "en"
            ? "Academy & DMF Community"
            : "Akademie, Kohorten & Kultur",
    },
  ];

  const galleryItems: Array<{
    src: string;
    category: Exclude<GalleryCategory, "all">;
    title: string;
    desc: string;
  }> = [
    // VISA & ARRIVAL (5)
    {
      src: "/images/community/dmf-community-visa-hoang-duy.jpg",
      category: "visa",
      title:
        lang === "vn"
          ? "Trao Thị thực Đức — Hoàng Duy (Meppen)"
          : lang === "en"
            ? "German Visa Handover — Hoàng Duy (Meppen)"
            : "Visumübergabe — Hoàng Duy (Meppen)",
      desc:
        lang === "vn"
          ? "Học viên Hoàng Duy nhận hoa và thị thực nghề Đức cùng đội ngũ Học viện DMF trước ngày bay."
          : lang === "en"
            ? "DMF graduate Hoàng Duy celebrating his approved German apprenticeship visa before departing for Meppen."
            : "DMF-Absolvent Hoàng Duy feiert sein erteiltes Ausbildungsvisum vor dem Start in Meppen (Niedersachsen).",
    },
    {
      src: "/images/community/dmf-community-visa-hoang-dung.jpg",
      category: "visa",
      title:
        lang === "vn"
          ? "Trao Thị thực ZFA — Trần Thị Hoàng Dung"
          : lang === "en"
            ? "ZFA Dental Visa — Trần Thị Hoàng Dung"
            : "ZFA-Ausbildungsvisum — Trần Thị Hoàng Dung",
      desc:
        lang === "vn"
          ? "Học viên Hoàng Dung nhận thị thực đào tạo Trợ lý Nha khoa (ZFA) tại sảnh chính DMF Education."
          : lang === "en"
            ? "Graduate Trần Thị Hoàng Dung with her approved visa for Dental Assistant (ZFA) training in Germany."
            : "Erfolgreiche Visumerteilung für die Ausbildung zur Zahnmedizinischen Fachangestellten (ZFA).",
    },
    {
      src: "/images/community/dmf-community-visum-d-zusatzblatt.jpg",
      category: "visa",
      title:
        lang === "vn"
          ? "Thị thực Quốc gia D & Zusatzblatt Thật"
          : lang === "en"
            ? "Original National D-Visa & Zusatzblatt"
            : "Originales D-Visum & Zusatzblatt",
      desc:
        lang === "vn"
          ? "Minh chứng pháp lý 100%: Thị thực D do Tổng Lãnh sự quán Đức tại TP.HCM cấp cho học viên DMF."
          : lang === "en"
            ? "Verified legal compliance: Official German National D-Visa and work permit supplement."
            : "Verifizierte Prozesssicherheit: Nationales Visum (Kategorie D) inklusive Zusatzblatt.",
    },
    {
      src: "/images/community/dmf-community-airport-briefing-duy.jpg",
      category: "visa",
      title:
        lang === "vn"
          ? "Hướng dẫn Hồ sơ tại Sân bay Quốc tế"
          : lang === "en"
            ? "Pre-Flight Airport Dossier Briefing"
            : "Persönliches Flughafen-Briefing",
      desc:
        lang === "vn"
          ? "Điều phối viên DMF rà soát hộ chiếu, hợp đồng và lịch trình đón tiếp tại Đức ngay trước giờ khởi hành."
          : lang === "en"
            ? "DMF coordinator reviewing travel documents and arrival procedures directly at the international airport."
            : "Dokumenten- und Flug-Check durch unsere Koordinatoren direkt am internationalen Flughafen.",
    },
    {
      src: "/images/b2b/settlement-3-wohnung.jpg",
      category: "visa",
      title:
        lang === "vn"
          ? "Đón tiếp & Bàn giao Nhà ở tại CHLB Đức"
          : lang === "en"
            ? "Arrival & Apartment Handover in Germany"
            : "Wohnungsübergabe & Settling-in in DE",
      desc:
        lang === "vn"
          ? "Đội ngũ đại diện DMF tại Đức đồng hành nhận chìa khóa nhà, đăng ký cư trú và mở tài khoản ngân hàng."
          : lang === "en"
            ? "On-site accompaniment in Germany for apartment key handover, city registration, and onboarding."
            : "Persönliche Begleitung durch unser Team in Deutschland bei Schlüsselübergabe und Anmeldung.",
    },
    // GERMAN EXPERTS & DELEGATIONS (5)
    {
      src: "/images/community/dmf-community-achim-interview-panel.jpg",
      category: "experts",
      title:
        lang === "vn"
          ? "Hội đồng Phỏng vấn cùng Ông Achim Betticher"
          : lang === "en"
            ? "Interview Panel with Mr. Achim Betticher"
            : "Interview-Coaching mit Achim Betticher",
      desc:
        lang === "vn"
          ? "Chuyên gia Đức Achim Betticher trực tiếp sát hạch phản xạ phỏng vấn và tác phong làm việc của ứng viên."
          : lang === "en"
            ? "German expert Achim Betticher conducting realistic employer interview simulations at the DMF Campus."
            : "Herr Achim Betticher und deutsche Prüfer trainieren reale Vorstellungsgespräche an der DMF Academy.",
    },
    {
      src: "/images/community/dmf-community-german-delegation-gruezi.jpg",
      category: "experts",
      title:
        lang === "vn"
          ? "Phái đoàn Đức Giao lưu cùng Học viên DMF"
          : lang === "en"
            ? "German Delegation Classroom Exchange"
            : "Deutsche Gastdelegation am DMF-Campus",
      desc:
        lang === "vn"
          ? "Các đoàn đối tác và giảng viên bản xứ thường xuyên thăm trường, thẩm định chất lượng và giao lưu trực tiếp."
          : lang === "en"
            ? "Regular visits by German delegations enable authentic dialogue and on-site quality audits."
            : "Regelmäßige Besuche deutscher Delegationen fördern den direkten Dialog mit Muttersprachlern.",
    },
    {
      src: "/images/community/dmf-community-deutsche-kultur-whiteboard.jpg",
      category: "experts",
      title:
        lang === "vn"
          ? "Workshop Văn hóa, Ẩm thực & Tâm lý Hội nhập"
          : lang === "en"
            ? "German Culture & Integration Workshop"
            : "Workshop: Deutsche Kultur & Arbeitswelt",
      desc:
        lang === "vn"
          ? "Giảng viên bản xứ giảng dạy chuyên đề Văn hóa Đức, Con người và tháo gỡ những bỡ ngỡ trước khi xuất cảnh."
          : lang === "en"
            ? "Native speaker workshop covering German culture, daily habits, and workplace expectations."
            : "Interaktives Modul zu deutscher Kultur, Lebensalltag, Ängsten und Hoffnungen vor der Ausreise.",
    },
    {
      src: "/images/community/dmf-community-native-speaker-desk-coaching.jpg",
      category: "experts",
      title:
        lang === "vn"
          ? "Kèm cặp Phát âm 1-1 cùng Người Bản xứ"
          : lang === "en"
            ? "1-on-1 Native Speaker Desk Coaching"
            : "1-zu-1-Sprachcoaching mit Muttersprachlern",
      desc:
        lang === "vn"
          ? "Giảng viên người Đức chỉnh sửa phát âm và cách diễn đạt chuyên ngành trực tiếp tại bàn học."
          : lang === "en"
            ? "Individual pronunciation and comprehension coaching directly at the student's desk."
            : "Individuelle Förderung von Aussprache und Hörverständnis im direkten Einzelgespräch.",
    },
    {
      src: "/images/community/dmf-community-intercultural-roundtable.jpg",
      category: "experts",
      title:
        lang === "vn"
          ? "Tọa đàm Giao lưu Văn hóa Việt – Đức"
          : lang === "en"
            ? "German-Vietnamese Intercultural Roundtable"
            : "Interkulturelle Gesprächsrunde am Campus",
      desc:
        lang === "vn"
          ? "Thảo luận mở bằng tiếng Đức giữa khách mời Đức, Ban Giám đốc Học viện và học viên trình độ B1/B2."
          : lang === "en"
            ? "Open roundtable discussion in German between visiting partners, academy leadership, and B1/B2 students."
            : "Offener Austausch auf Deutsch zwischen Gästen, Akademieleitung und fortgeschrittenen Kursen.",
    },
    // ACADEMY, COHORTS & COMMUNITY CULTURE (6)
    {
      src: "/images/community/dmf-community-faculty-thay-khang-lecture.jpg",
      category: "community",
      title:
        lang === "vn"
          ? "Đào tạo Tiếng Đức Toàn thời gian (Thầy Khang)"
          : lang === "en"
            ? "Full-Time German Instruction (Mr. Khang)"
            : "Vollzeit-Deutschunterricht (Dozent Thầy Khang)",
      desc:
        lang === "vn"
          ? "Giảng dạy cấu trúc ngữ pháp và thói quen làm việc chuyên nghiệp với hệ thống phòng học hiện đại."
          : lang === "en"
            ? "Structured grammar and workplace routine training in our modern multimedia classrooms."
            : "Methodischer Präsenzunterricht zu Grammatik und beruflichen Routinen an der DMF Academy.",
    },
    {
      src: "/images/community/dmf-community-cohort-k32-written-exam.jpg",
      category: "community",
      title:
        lang === "vn"
          ? "Kỳ thi Kiểm tra Định kỳ (Khóa K32)"
          : lang === "en"
            ? "Written Progress Examination (Cohort K32)"
            : "Schriftliche Lernzielkontrolle (Kohorte K32)",
      desc:
        lang === "vn"
          ? "Kỷ luật học tập nghiêm túc qua các bài kiểm tra đánh giá năng lực hàng tuần từ K14 đến K50."
          : lang === "en"
            ? "Strict academic discipline with weekly written and oral progress evaluations."
            : "Verbindliche Qualitätsstandards durch wöchentliche Prüfungen in allen Kohorten.",
    },
    {
      src: "/images/community/dmf-community-cohort-k28-speaking-circle.jpg",
      category: "community",
      title:
        lang === "vn"
          ? "Vòng tròn Luyện Phản xạ Nói (Khóa K28)"
          : lang === "en"
            ? "Interactive Speaking Circle (Cohort K28)"
            : "Kommunikativer Sprechkreis (Kohorte K28)",
      desc:
        lang === "vn"
          ? "Học viên khóa K28 thực hành phản xạ giao tiếp nhóm cùng cả giáo viên Việt Nam và giáo viên Đức."
          : lang === "en"
            ? "Cohort K28 students practicing spontaneous German conversation in an interactive circle."
            : "Tägliches Training von freiem Sprechen, aktivem Zuhören und Teamkommunikation.",
    },
    {
      src: "/images/community/dmf-community-campus-reception-dossier.jpg",
      category: "community",
      title:
        lang === "vn"
          ? "Trung tâm Điều phối Học vụ & Hồ sơ DMF"
          : lang === "en"
            ? "DMF Academic & Dossier Coordination Desk"
            : "Studien- & Dossierkoordination am Campus",
      desc:
        lang === "vn"
          ? "Quản lý đồng bộ giáo trình tiếng Đức, hồ sơ dịch thuật công chứng và lịch thi chứng chỉ cho từng học viên."
          : lang === "en"
            ? "Centralized management of candidate dossiers, certified translations, and exam schedules."
            : "Zentrale Verwaltung von Kandidatenakten, beglaubigten Übersetzungen und Prüfungsanmeldungen.",
    },
    {
      src: "/images/community/dmf-community-weihnachten-christmas-event.jpg",
      category: "community",
      title:
        lang === "vn"
          ? "Lễ hội Giáng sinh Đức tại Học viện DMF"
          : lang === "en"
            ? "German Christmas Celebration at DMF"
            : "Weihnachtsfeier in der DMF Community",
      desc:
        lang === "vn"
          ? "Học viên DMF trải nghiệm không khí lễ hội Giáng sinh châu Âu và tìm hiểu phong tục truyền thống của Đức."
          : lang === "en"
            ? "Students celebrating German Christmas traditions together at the DMF Academy."
            : "Gelebte deutsch-vietnamesische Gemeinschaft beim gemeinsamen Weihnachtsfest am Campus.",
    },
    {
      src: "/images/community/dmf-community-tet-festival-lang-du-hoc-duc.jpg",
      category: "community",
      title:
        lang === "vn"
          ? "Sự kiện Văn hóa tại Làng Du học Đức DMF"
          : lang === "en"
            ? "Cultural Festival at DMF German Study Village"
            : "Kulturfest im Deutschen Studiendorf",
      desc:
        lang === "vn"
          ? "Gắn kết cộng đồng học viên DMF Talents vững mạnh, sẵn sàng tương trợ nhau khi học tập và làm việc tại Đức."
          : lang === "en"
            ? "Building a supportive DMF Talents alumni and student community before departure to Germany."
            : "Starker Zusammenhalt in der DMF Talents Community als Fundament für den Erfolg in Deutschland.",
    },
  ];

  const visibleGalleryItems =
    activeCategory === "all"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  const pageUrl = siteUrl("/referenzen");
  const referenzenSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: `Referenzen, Erfahrungen & Modellvergleich | ${SITE_NAME}`,
      description:
        "Verifizierte Erfolgsgeschichten, originale D-Visa-Nachweise, 66+ Platzierungen in 10+ deutschen Städten und 3-Jahres-TCO-Vergleich (Direktvermittlung vs. Zeitarbeit).",
      inLanguage: "de-DE",
      speakable: SPEAKABLE_SPECIFICATION,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "@id": `${pageUrl}#placements`,
      name: "Erfolgreiche DMF Talents Platzierungen nach deutschen Städten",
      numberOfItems: successStories.length,
      itemListElement: successStories.map((city, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: `${city.city}: ${city.candidateCount}+ vermittelte Fachkräfte & Azubis (${city.jobTypes.join(", ")})`,
        url: `${pageUrl}#city-${city.id}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: REFERENZEN_FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(referenzenSchemas) }}
      />
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground pt-28 md:pt-40 pb-16 md:pb-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t.map?.title || "Unsere Erfolgsgeschichten"}
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              {t.map?.desc || "Fachkräfte aus Vietnam in ganz Deutschland"}
            </p>
            <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-lg font-semibold">
                  {totalPlacements}+{" "}
                  {lang === "vn"
                    ? "Nhân sự đã sang Đức"
                    : lang === "en"
                      ? "Placements"
                      : "Vermittlungen"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-lg font-semibold">
                  {successStories.length}{" "}
                  {lang === "vn" ? "Thành phố" : lang === "en" ? "Cities" : "Städte"}
                </span>
              </div>
            </div>

            {/* AEO Direct Answer Proof Block */}
            <div className="aeo-direct-answer mt-8 text-left bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 md:p-6 text-primary-foreground">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-2 opacity-90">
                <ShieldCheck className="w-4 h-4" />
                Verifizierte B2B-Referenzen & Prozesssicherheit (E-E-A-T Nachweis)
              </div>
              <p className="text-xs md:text-sm leading-relaxed opacity-95">
                <strong>DMF Talents ({SITE_URL})</strong> dokumentiert über{" "}
                <strong>{totalPlacements}+ erfolgreiche Platzierungen</strong> von vietnamesischen
                Fachkräften (§ 18a/b, § 81a AufenthG) und Auszubildenden (§ 16a AufenthG) in mehr
                als <strong>{successStories.length} deutschen Wirtschaftszentren</strong> (u. a.
                Berlin, München, Hamburg, Stuttgart, Frankfurt, Köln, Leipzig und
                Meppen/Niedersachsen). Dank eigenem Vollzeit-Ausbildungscampus in Vietnam, original
                nachgewiesenen Nationalen D-Visa (inkl. Zusatzblatt) und persönlicher
                Wohnungsübergabe in Deutschland erreichen unsere Partnerbetriebe eine{" "}
                <strong>Bleibequote von über 95 %</strong>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <MapWrapper />
        </div>
      </section>

      {/* Authentic Visual Proof Gallery */}
      <section className="py-12 md:py-16 bg-slate-50 border-y border-slate-200/70">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              {lang === "vn"
                ? "Hình ảnh thực tế tại Học viện DMF & Đồng hành tại Đức"
                : lang === "en"
                  ? "Inside Our Academy & On-Site Support in Germany"
                  : "Einblicke in unsere Akademie & Begleitung in Deutschland"}
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              {lang === "vn"
                ? "Từ đào tạo tiếng Đức và tay nghề tại Việt Nam đến đón sân bay và bàn giao nhà ở tại CHLB Đức."
                : lang === "en"
                  ? "From certified language and vocational training in Vietnam to personal airport pickup and housing handover in Germany."
                  : "Vom zertifizierten Sprach- und Fachtraining in Vietnam bis zur persönlichen Abholung und Wohnungsübergabe in Deutschland."}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
            {filterTabs.map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all border ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-primary/40 hover:bg-slate-100"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {visibleGalleryItems.map((item) => (
              <div
                key={item.src}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 flex flex-col"
              >
                <div className="relative aspect-video w-full bg-slate-100">
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 280px"
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex-1">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories Grid - SEO Support */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              {lang === "vn"
                ? "Dự án cung ứng nhân sự theo Thành phố"
                : lang === "en"
                  ? "Successful Placements by City"
                  : "Erfolgreiche Vermittlungen nach Stadt"}
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              {lang === "vn"
                ? "Tổng quan mạng lưới nhân sự và học viên DMF đang làm việc tại các thành phố lớn của CHLB Đức"
                : lang === "en"
                  ? "Overview of our successful candidate placements across major German cities"
                  : "Überblick über unsere erfolgreichen Platzierungen in verschiedenen deutschen Städten"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {successStories.map((city) => (
                <div
                  key={city.id}
                  id={`city-${city.id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-100"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{city.city}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {city.position[0].toFixed(2)}°N, {city.position[1].toFixed(2)}°E
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-gray-900">
                        {city.candidateCount}+{" "}
                        {lang === "vn" ? "Nhân sự" : lang === "en" ? "Placements" : "Vermittlungen"}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                      <div className="flex items-start gap-2 mb-2">
                        <Briefcase className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs text-gray-500 mb-1 font-medium">
                            {lang === "vn"
                              ? "Vị trí:"
                              : lang === "en"
                                ? "Professions:"
                                : "Branchen:"}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {city.jobTypes.map((job, index) => (
                              <span
                                key={index}
                                className="inline-block px-2 py-1 bg-primary/10 text-primary rounded-md text-xs font-medium"
                              >
                                {job}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SSR 3-Model Comparison Matrix & Regional § 81a Hub Links */}
      <section className="py-12 md:py-16 bg-slate-50 border-t border-slate-200/80">
        <div className="container mx-auto px-4 max-w-6xl space-y-12">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
              Modellvergleich für Arbeitgeber: DMF Direktvermittlung vs. Zeitarbeit vs.
              Eigenrekrutierung
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              Objektiver 3-Jahres-Vergleich zu Gesamtkosten (TCO), Verfahrensdauer, Rechtssicherheit
              (§ 81a AufenthG / § 296a SGB III) und Mitarbeiterbindung.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <caption className="sr-only">
                  Vergleich zwischen DMF Talents Full-Service Direktvermittlung, Zeitarbeit und
                  Eigenrekrutierung
                </caption>
                <thead>
                  <tr className="bg-slate-100 text-slate-800 border-b border-slate-200">
                    <th className="py-3.5 px-4 font-semibold">Bewertungskriterium</th>
                    <th className="py-3.5 px-4 font-semibold text-primary">
                      DMF Talents Full-Service (Direktvermittlung)
                    </th>
                    <th className="py-3.5 px-4 font-semibold">
                      Zeitarbeit / Arbeitnehmerüberlassung
                    </th>
                    <th className="py-3.5 px-4 font-semibold">
                      Eigenständige Selbstrekrutierung im Ausland
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700">
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      Vertragsverhältnis & Bindung
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      Direkter Arbeits-/Ausbildungsvertrag mit Ihrem Betrieb (&gt; 95 % Bleibequote)
                    </td>
                    <td className="py-3.5 px-4">
                      Kein eigenes Stammpersonal, hohe Fluktuation bei Abzug
                    </td>
                    <td className="py-3.5 px-4">
                      Direkter Vertrag, aber hohes Abbruchrisiko ohne Vor-Ort-Campus
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      3-Jahres-Mehrkosten (TCO)
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      Einmaliges Erfolgshonorar (Amortisation nach ca. 4–7 Monaten)
                    </td>
                    <td className="py-3.5 px-4">
                      Laufender Aufschlag (oft 18.000–25.000 EUR+ Mehrkosten pro Jahr)
                    </td>
                    <td className="py-3.5 px-4">
                      Hohe interne Personalkosten, Reisekosten & Fehlinvestitionen
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      Verfahrensdauer bis Start
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      4–6 Monate über § 81a AufenthG (Saisonkräfte: 8–12 Wochen)
                    </td>
                    <td className="py-3.5 px-4">Kurzfristig, sofern Leihpersonal verfügbar</td>
                    <td className="py-3.5 px-4">
                      Oft 9–15 Monate wegen fehlender § 81a- und Kammer-Routine
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      Sprach- & Kulturvorbereitung
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      Vollzeit-Campus in Vietnam bis B1/B2 inkl. Training durch deutsche Prüfer
                    </td>
                    <td className="py-3.5 px-4">Häufig nur geringe Deutschkenntnisse (A1/A2)</td>
                    <td className="py-3.5 px-4">Schwer überprüfbare externe Sprachzertifikate</td>
                  </tr>
                  <tr>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      Compliance & § 296a SGB III
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      100 % Employer-Pays-Garantie (keine Gebühren für Bewerber/Azubis)
                    </td>
                    <td className="py-3.5 px-4">
                      AÜG-Höchstüberlassungsdauer (18 Monate) beachten
                    </td>
                    <td className="py-3.5 px-4">Risiko unlizenzierter Zwischenhändler vor Ort</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Regional Bundesländer § 81a Links */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Regionale § 81a AufenthG Leitfäden nach Bundesland
                </h2>
                <p className="text-sm text-slate-600">
                  Prüfen Sie die zuständige Zentralstelle für Fachkräfteeinwanderung (ZSEF, LZF,
                  ZFE, LEA BIS) und das Landesprüfungsamt für Ihren Standort:
                </p>
              </div>
              <Link
                href="/fuer-arbeitgeber/standorte"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline shrink-0"
              >
                Alle 16 Bundesländer ansehen
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {REGIONAL_STANDORTE.map((reg) => (
                <Link
                  key={reg.slug}
                  href={`/fuer-arbeitgeber/standorte/${reg.slug}`}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-primary hover:bg-white transition-all group"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-primary mb-1">
                    <span>{reg.shortName}</span>
                    <span>{reg.placementsCount}+ Referenzen</span>
                  </div>
                  <div className="text-sm font-bold text-slate-900 group-hover:text-primary mb-1">
                    {reg.stateName}
                  </div>
                  <div className="text-xs text-slate-500 line-clamp-2">{reg.authority81aName}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* Semantic H3 FAQ Section */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Häufige Arbeitgeber-Fragen zu Erfahrungen, Kosten & Seriosität
            </h2>
            <div className="space-y-6">
              {REFERENZEN_FAQS.map((faq) => (
                <div
                  key={faq.question}
                  className="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0"
                >
                  <h3 className="text-base font-bold text-slate-900 mb-2">{faq.question}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {lang === "vn"
                ? "Đồng hành cùng câu chuyện thành công của chúng tôi"
                : lang === "en"
                  ? "Become Part of Our Success Story"
                  : "Werden Sie Teil unserer Erfolgsgeschichte"}
            </h2>
            <p className="text-lg opacity-90 mb-8">
              {lang === "vn"
                ? "Hãy để chúng tôi cùng bạn tuyển dụng đội ngũ nhân sự chất lượng cao từ Việt Nam cho doanh nghiệp của bạn."
                : lang === "en"
                  ? "Let us work together to find qualified skilled workers and apprentices from Vietnam for your company."
                  : "Lassen Sie uns gemeinsam qualifizierte Fachkräfte aus Vietnam für Ihr Unternehmen finden."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#contact"
                className="px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                {lang === "vn"
                  ? "Liên hệ ngay"
                  : lang === "en"
                    ? "Get in Touch"
                    : "Kontakt aufnehmen"}
              </Link>
              <Link
                href="/services/skilled-workers"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                {lang === "vn"
                  ? "Dịch vụ của chúng tôi"
                  : lang === "en"
                    ? "Our Services"
                    : "Unsere Dienstleistungen"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
