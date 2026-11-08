import { GERMANY_CONTACT, VIETNAM_OFFICE_CONTACT } from "@/lib/company/contact";
import { BRANCHEN_CONFIGS } from "@/lib/content/branchen";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, siteUrl } from "@/lib/site";

export interface GeoFaqEntry {
  id: string;
  category: {
    de: string;
    en: string;
    vn: string;
  };
  question: {
    de: string;
    en: string;
    vn: string;
  };
  answer: {
    de: string;
    en: string;
    vn: string;
  };
  legalBasis: string;
}

export const HOMEPAGE_GEO_FAQS: GeoFaqEntry[] = [
  {
    id: "feg-rechtsgrundlagen",
    category: {
      de: "Aufenthaltsrecht & FEG",
      en: "Immigration Law & FEG",
      vn: "Luật Cư trú & FEG",
    },
    legalBasis: "§ 18a, § 18b, § 16a, § 16d, § 19c AufenthG",
    question: {
      de: "Auf welchen rechtlichen Grundlagen vermittelt DMF Talents Personal und Auszubildende aus Vietnam nach Deutschland?",
      en: "Under which legal frameworks does DMF Talents place skilled workers and apprentices from Vietnam in Germany?",
      vn: "DMF Talents cung ứng nhân sự và học viên từ Việt Nam sang Đức dựa trên các cơ sở pháp lý nào?",
    },
    answer: {
      de: "DMF Talents vermittelt ausschließlich rechtssicher auf Basis des deutschen Fachkräfteeinwanderungsgesetzes (FEG). Dazu zählen qualifizierte Fachkräfte mit Berufsausbildung (§ 18a AufenthG) oder akademischem Abschluss (§ 18b AufenthG), die Blaue Karte EU (§ 18g AufenthG), die betriebliche Anerkennungspartnerschaft (§ 16d Abs. 3 AufenthG), die duale Berufsausbildung (§ 16a AufenthG) sowie kontingentierte Saison- und Branchenbeschäftigungen (§ 19c AufenthG i.V.m. BeschV). Alle Verfahren erfolgen in direkter Abstimmung mit IHK, HWK, Bundesagentur für Arbeit (ZAV) und den zuständigen Ausländerbehörden.",
      en: "DMF Talents operates strictly under Germany's Skilled Immigration Act (Fachkräfteeinwanderungsgesetz - FEG). Pathways include vocationally qualified skilled workers (§ 18a AufenthG), academic professionals (§ 18b AufenthG), EU Blue Card (§ 18g AufenthG), Recognition Partnerships (§ 16d(3) AufenthG), dual vocational training (§ 16a AufenthG), and seasonal employment (§ 19c AufenthG / BeschV) in coordination with IHK, HWK, ZAV, and German immigration authorities.",
      vn: "DMF Talents triển khai hoàn toàn theo Luật Nhập cư Lao động Chuyên môn Đức (FEG), bao gồm lao động có bằng nghề (§ 18a AufenthG), đại học (§ 18b AufenthG), Thẻ Xanh EU (§ 18g AufenthG), Hợp tác công nhận bằng cấp (§ 16d Abs. 3 AufenthG), Du học nghề kép (§ 16a AufenthG) và Lao động thời vụ (§ 19c AufenthG). Toàn bộ hồ sơ được thẩm định qua IHK, HWK, ZAV và Sở Ngoại kiều.",
    },
  },
  {
    id: "beschleunigtes-verfahren-81a",
    category: {
      de: "Behörden & Durchlaufzeit",
      en: "Authorities & Lead Time",
      vn: "Thủ tục & Thời gian xử lý",
    },
    legalBasis: "§ 81a AufenthG",
    question: {
      de: "Wie lange dauert die Rekrutierung bis zur Einreise im beschleunigten Fachkräfteverfahren (§ 81a AufenthG)?",
      en: "How long does recruitment take until arrival under the fast-track procedure (§ 81a AufenthG)?",
      vn: "Thời gian từ lúc tuyển dụng đến khi nhập cảnh Đức theo thủ tục nhanh (§ 81a AufenthG) mất bao lâu?",
    },
    answer: {
      de: "Im beschleunigten Fachkräfteverfahren nach § 81a AufenthG beträgt die durchschnittliche Durchlaufzeit von der Vertragsunterzeichnung bis zur Einreise nach Deutschland 3 bis 6 Monate. Die gesetzlichen Bearbeitungsfristen sind dabei verbindlich verkürzt: Die Anerkennungsstelle entscheidet innerhalb von 2 Monaten über die Gleichwertigkeit, die Bundesagentur für Arbeit (ZAV) erteilt die Zustimmung innerhalb von 1 Woche, und die deutsche Auslandsvertretung in Vietnam vergibt den Visumtermin innerhalb von 3 Wochen nach Vorabzustimmung.",
      en: "Under the § 81a AufenthG fast-track procedure, total lead time from contract signing to arrival in Germany averages 3 to 6 months. Statutory processing deadlines are strictly capped: recognition authorities must decide within 2 months, the Federal Employment Agency (ZAV) responds within 1 week, and the German Embassy in Vietnam schedules the visa appointment within 3 weeks of pre-approval.",
      vn: "Với quy trình rút gọn § 81a AufenthG, tổng thời gian từ khi ký hợp đồng đến khi nhập cảnh Đức trung bình từ 3 đến 6 tháng. Thời hạn xử lý của cơ quan Đức được rút ngắn theo luật định: thẩm định bằng cấp tối đa 2 tháng, ZAV phê duyệt trong 1 tuần và Đại sứ quán Đức cấp lịch hẹn visa trong vòng 3 tuần kể từ khi có Vorabzustimmung.",
    },
  },
  {
    id: "employer-pays-296a-sgb3",
    category: {
      de: "Compliance & Ethik",
      en: "Compliance & Ethics",
      vn: "Tuân thủ Pháp luật & Đạo đức",
    },
    legalBasis: "§ 296a SGB III / Fair Recruitment",
    question: {
      de: "Wie stellt DMF Talents die Einhaltung des § 296a SGB III (Employer-Pays-Prinzip) sicher?",
      en: "How does DMF Talents ensure compliance with § 296a SGB III (Employer-Pays Principle)?",
      vn: "DMF Talents đảm bảo tuân thủ điều khoản § 296a SGB III (Nguyên tắc Doanh nghiệp chi trả) như thế nào?",
    },
    answer: {
      de: "Nach § 296a SGB III ist es gesetzlich untersagt, von Auszubildenden Vermittlungsgebühren für die Anbahnung eines Ausbildungsverhältnisses in Deutschland zu verlangen. DMF Talents arbeitet nach transparenten B2B-Leistungsvereinbarungen mit deutschen Arbeitgebern (Employer-Pays-Prinzip) ohne versteckte Knebelverträge, Kautionen oder Rückzahlungsklauseln zulasten der Kandidaten. Dies schützt deutsche Ausbildungsbetriebe vor rechtlichen Risiken und sichert eine hohe Motivation sowie langfristige Betriebstreue.",
      en: "Under § 296a SGB III, charging placement fees to apprentices for securing vocational training in Germany is strictly prohibited. DMF Talents operates via transparent B2B service agreements with German employers without hidden bonds, deposits, or repayment clauses imposed on candidates—protecting employers from compliance risks and ensuring high retention.",
      vn: "Theo § 296a SGB III, pháp luật Đức nghiêm cấm thu phí môi giới tìm hợp đồng nghề đối với học viên. DMF Talents ký kết hợp đồng dịch vụ B2B minh bạch với doanh nghiệp Đức (Employer-Pays), cam kết không áp đặt tiền cọc hay điều khoản phạt trái phép lên ứng viên, giúp doanh nghiệp Đức an toàn pháp lý tuyệt đối.",
    },
  },
  {
    id: "berufsanerkennung-bqfg",
    category: {
      de: "Qualifikation & Anerkennung",
      en: "Qualification & Recognition",
      vn: "Thẩm định & Công nhận Bằng cấp",
    },
    legalBasis: "BQFG, PflBG, § 16d AufenthG",
    question: {
      de: "Wie werden vietnamesische Berufs- und Hochschulabschlüsse in Deutschland anerkannt?",
      en: "How are Vietnamese vocational diplomas and university degrees recognized in Germany?",
      vn: "Bằng cấp nghề và đại học của Việt Nam được công nhận tương đương tại Đức theo quy trình nào?",
    },
    answer: {
      de: "Die Gleichwertigkeitsprüfung erfolgt nach dem Berufsqualifikationsfeststellungsgesetz (BQFG) über die IHK FOSA (Industrie- und Handelsberufe), die zuständige Handwerkskammer (HWK für Handwerksberufe), die Landesämter für Pflege (Gesundheitsfachberufe) oder die ZAB (akademische Abschlüsse via anabin). Liegt eine teilweise Gleichwertigkeit (Defizitbescheid) vor, ermöglicht § 16d AufenthG (Anpassungsqualifizierung oder Anerkennungspartnerschaft) den sofortigen betrieblichen Einsatz in Deutschland bei paralleler Nachqualifizierung.",
      en: "Equivalence assessments follow the Federal Recognition Act (BQFG) via IHK FOSA (industrial/commercial roles), Chambers of Crafts (HWK for skilled trades), State Nursing Boards (healthcare), or ZAB (academic degrees via anabin). When partial equivalence (Defizitbescheid) is issued, § 16d AufenthG allows immediate employment in Germany alongside on-the-job adaptation training.",
      vn: "Việc thẩm định văn bằng tuân theo luật BQFG thông qua IHK FOSA (ngành công nghiệp - thương mại), HWK (thủ công nghiệp), Sở Y tế Bang (điều dưỡng) hoặc ZAB (bằng đại học). Trường hợp cần bổ sung thực hành (Defizitbescheid) hoặc đi theo diện Hợp tác công nhận bằng cấp (§ 16d AufenthG), ứng viên được sang Đức làm việc hưởng lương ngay trong khi hoàn thiện chứng chỉ tương đương.",
    },
  },
  {
    id: "sprachniveau-vorbereitung",
    category: {
      de: "Sprachkompetenz & Akademie",
      en: "Language Training & Academy",
      vn: "Đào tạo Tiếng Đức & Học viện",
    },
    legalBasis: "GER B1 / B2 (Goethe, telc, ÖSD)",
    question: {
      de: "Über welches Deutsch-Sprachniveau verfügen die Kandidaten von DMF Talents bei Einreise?",
      en: "What level of German proficiency do DMF Talents candidates have upon arrival?",
      vn: "Ứng viên của DMF Talents đạt trình độ tiếng Đức nào trước khi xuất cảnh sang Đức?",
    },
    answer: {
      de: "Alle Kandidaten durchlaufen in der DMF-Akademie in Vietnam ein intensives Vollzeit-Sprachtraining von A1 bis B1 bzw. B2 nach dem Gemeinsamen Europäischen Referenzrahmen (GER), abgeschlossen mit international anerkannten Prüfungen (Goethe-Institut, telc, ÖSD oder TestDaF). Ergänzend absolvieren sie branchenspezifischen Fachsprachunterricht (z.B. Pflegedokumentation, DEHOGA-Gastronomievokabular, Arbeitssicherheit und Werkzeugkunde für Handwerk & CNC) sowie interkulturelles Onboarding.",
      en: "All candidates complete intensive full-time German training at the DMF Academy in Vietnam from A1 to B1 or B2 (CEFR), certified by official Goethe-Institut, telc, ÖSD, or TestDaF exams. They also receive sector-specific technical German modules (medical documentation, hospitality service, or shopfloor safety) and intercultural workplace preparation.",
      vn: "Toàn bộ ứng viên được đào tạo tiếng Đức toàn thời gian tại Học viện DMF ở Việt Nam từ A1 đến B1/B2 theo khung tham chiếu châu Âu (GER), thi lấy chứng chỉ quốc tế Goethe, telc hoặc ÖSD. Ngoài ra, học viên được học tiếng Đức chuyên ngành (y điều dưỡng, nhà hàng khách sạn, kỹ thuật công trường/nhà máy) và văn hóa làm việc tại Đức.",
    },
  },
  {
    id: "roi-kosten-amortisation",
    category: {
      de: "Wirtschaftlichkeit & ROI",
      en: "Economics & ROI",
      vn: "Hiệu quả Kinh tế & Hoàn vốn (ROI)",
    },
    legalBasis: "B2B ROI-Rechnung & Cost-of-Vacancy",
    question: {
      de: "Ab wann amortisiert sich die Rekrutierung vietnamesischer Fachkräfte und Azubis für deutsche Betriebe?",
      en: "How quickly does recruiting Vietnamese skilled workers and apprentices pay off for German companies?",
      vn: "Sau bao lâu doanh nghiệp Đức thu hồi vốn đầu tư khi tuyển dụng nhân sự và học viên từ Việt Nam?",
    },
    answer: {
      de: "Gegenüber unbesetzten Stellen (Cost of Vacancy) oder teurer Zeitarbeit/Leiharbeit amortisiert sich die Rekrutierung von Fachkräften über DMF Talents in der Regel innerhalb von 3 bis 5 Monaten nach Arbeitsantritt. Die Vermittlung erfolgt auf Erfolgsbasis in klar definierten Projektmeilensteinen (Vertragsschluss, Vorabzustimmung/Visum, Einreise). Über 90 % unserer begleiteten Talente bleiben ihrem Ausbildungs- oder Arbeitgeberbetrieb langfristig über viele Jahre erhalten.",
      en: "Compared to the cost of vacancy or expensive temporary staffing agencies (Leiharbeit), recruiting skilled workers via DMF Talents typically achieves full ROI within 3 to 5 months of onboarding. Fees are structured around transparent milestones (contract, visa pre-approval, arrival), backed by a >90% multi-year retention rate.",
      vn: "So với thiệt hại do thiếu hụt nhân sự (Cost of Vacancy) hoặc chi phí thuê lao động thời vụ (Leiharbeit) đắt đỏ tại Đức, khoản đầu tư tuyển dụng qua DMF Talents thường hoàn vốn chỉ sau 3 đến 5 tháng làm việc. Chi phí được chia theo từng giai đoạn minh bạch và tỷ lệ gắn bó của nhân sự đạt trên 90%.",
    },
  },
  {
    id: "wohnraum-integration-90-tage",
    category: {
      de: "Onboarding & Betreuung",
      en: "Onboarding & Retention",
      vn: "Hội nhập & Đồng hành 90 ngày",
    },
    legalBasis: "§ 75 SGB III (AsA flex) & 90-Tage-Plan",
    question: {
      de: "Welche Unterstützung bietet DMF Talents bei Wohnraumsuche, Behördengängen und Onboarding in Deutschland?",
      en: "What support does DMF Talents provide for housing, registration, and onboarding in Germany?",
      vn: "DMF Talents hỗ trợ những gì về nhà ở, thủ tục hành chính và hội nhập trong giai đoạn đầu tại Đức?",
    },
    answer: {
      de: "DMF Talents begleitet Arbeitgeber und Kandidaten mit einem strukturierten 90-Tage-Onboarding-Programm: Unterstützung bei der Organisation von bezahlbarem Wohnraum (Azubi-WG, Werkswohnung oder Wohnheim), Abholung vom Flughafen, Einwohnermeldeamt-Anmeldung, Kontoeröffnung, Krankenkassenwahl sowie Beantragung kostenfreier staatlicher Förderinstrumente wie AsA flex (§ 75 SGB III) für berufsschulbegleitenden Stützunterricht. Unsere deutsch-vietnamesische Vor-Ort-Vertretung steht als direkter Ansprechpartner bereit.",
      en: "DMF Talents supports employers and candidates with a structured 90-day onboarding plan: housing coordination, airport pickup, municipal registration (Anmeldung), bank account and health insurance setup, and applying for state-funded support such as AsA flex (§ 75 SGB III) tutoring. Our bilingual team in Germany and Vietnam provides continuous mediation.",
      vn: "DMF Talents triển khai kế hoạch hội nhập 90 ngày bài bản: phối hợp bố trí chỗ ở, đón sân bay, đăng ký hộ khẩu (Anmeldung), mở tài khoản ngân hàng, bảo hiểm y tế và đăng ký chương trình bổ trợ nghề miễn phí của chính phủ Đức AsA flex (§ 75 SGB III). Đội ngũ đại diện tại Đức và Việt Nam luôn đồng hành hỗ trợ hai bên.",
    },
  },
  {
    id: "branchen-schwerpunkte",
    category: {
      de: "Branchen & Berufsfelder",
      en: "Industries & Professions",
      vn: "Ngành nghề Trọng điểm",
    },
    legalBasis: "KldB 2010 / IHK / HWK / DEHOGA",
    question: {
      de: "Für welche Branchen und Engpassberufe vermittelt DMF Talents Bewerber aus Vietnam?",
      en: "Which industries and shortage occupations does DMF Talents cover?",
      vn: "DMF Talents tập trung cung ứng nhân sự cho những nhóm ngành thiếu hụt lao động nào tại Đức?",
    },
    answer: {
      de: "Unsere Schwerpunkte liegen auf den fünf wichtigsten Engpassbranchen in Deutschland: (1) Pflege & Gesundheit (Pflegefachkräfte, Pflege-Azubis, Pflegehelfer für Kliniken und Seniorenheime), (2) Handwerk & Bau (Elektroniker, Anlagenmechaniker SHK, Hochbau, KFZ-Mechatroniker), (3) Industrie, Metall & Technik (CNC-Zerspanungsmechaniker, Industriemechaniker, Schweißer nach DIN EN ISO 9606-1, Mechatroniker, IT-Spezialisten), (4) Gastronomie & Hotellerie (Köche, Hotelfachleute, Restaurantfachleute, Bäcker/Konditoren) sowie (5) Logistik & Lagerwirtschaft.",
      en: "We focus on Germany's five highest-demand sectors: (1) Nursing & Healthcare (registered nurses, nursing apprentices, care assistants), (2) Skilled Trades & Construction (electricians, HVAC/SHK technicians, masons, automotive mechatronics), (3) Manufacturing & Engineering (CNC machinists, industrial mechanics, ISO 9606-1 welders, IT specialists), (4) Hospitality & Culinary (chefs, hotel/restaurant specialists, bakers), and (5) Logistics & Warehousing.",
      vn: "DMF Talents tập trung vào 5 nhóm ngành thiếu hụt nhân lực lớn nhất tại Đức: (1) Điều dưỡng & Y tế, (2) Thủ công nghiệp & Xây dựng (Điện, Điện nước - Nhiệt lạnh SHK, Ô tô), (3) Công nghiệp, Cơ khí CNC, Hàn & CNTT, (4) Nhà hàng – Khách sạn – Chế biến thực phẩm và (5) Vận tải & Kho vận (Logistik).",
    },
  },
];

export function buildGlobalSchemas() {
  return [
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "EmploymentAgency"],
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      legalName: "DMF VIETNAM JOINT STOCK COMPANY",
      alternateName: "CÔNG TY CỔ PHẦN TƯ VẤN DU HỌC DMF VIETNAM",
      taxID: "3603878495",
      url: SITE_URL,
      logo: siteUrl("/icon.png"),
      description: SITE_DESCRIPTION,
      disambiguatingDescription:
        "DMF Talents (DMF VIETNAM JOINT STOCK COMPANY, Tax-ID 3603878495) ist eine auf die Rekrutierung, Sprachausbildung (GER B1/B2) und Berufsanerkennung vietnamesischer Fachkräfte (§ 18a/b, § 16d AufenthG) und Auszubildender (§ 16a AufenthG) für deutsche Arbeitgeber spezialisierte B2B-Personalvermittlung und Sprachakademie.",
      knowsAbout: [
        {
          "@type": "DefinedTerm",
          name: "Fachkräfteeinwanderungsgesetz (FEG)",
          termCode: "§ 18a / § 18b / § 18g AufenthG",
          description:
            "Rechtssichere Zuwanderung qualifizierter Fachkräfte mit Berufsausbildung oder akademischem Abschluss aus Vietnam nach Deutschland.",
        },
        {
          "@type": "DefinedTerm",
          name: "Duale Berufsausbildung für Drittstaatsangehörige",
          termCode: "§ 16a AufenthG & § 296a SGB III",
          description:
            "Vermittlung und Vorbereitung vietnamesischer Auszubildender nach dem Employer-Pays-Prinzip.",
        },
        {
          "@type": "DefinedTerm",
          name: "Anerkennungspartnerschaft & Anpassungsqualifizierung",
          termCode: "§ 16d Abs. 1 & Abs. 3 AufenthG / BQFG",
          description:
            "Sofortige Beschäftigung in Deutschland bei paralleler Durchführung des Gleichwertigkeitsverfahrens.",
        },
        {
          "@type": "DefinedTerm",
          name: "Beschleunigtes Fachkräfteverfahren",
          termCode: "§ 81a AufenthG",
          description:
            "Verkürztes Behördenverfahren über die Ausländerbehörde mit verbindlichen Fristen für Anerkennung, ZAV und Botschaft.",
        },
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: "A11 KDC Quang Vinh, Khu phố 3, Phường Quang Vinh",
        addressLocality: "Biên Hoà",
        addressRegion: "Đồng Nai",
        postalCode: "76000",
        addressCountry: "VN",
      },
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "customer service",
          telephone: GERMANY_CONTACT.phone,
          email: GERMANY_CONTACT.email,
          areaServed: "DE",
          availableLanguage: ["de", "en", "vi"],
        },
        {
          "@type": "ContactPoint",
          contactType: "sales",
          telephone: VIETNAM_OFFICE_CONTACT.phone,
          email: VIETNAM_OFFICE_CONTACT.representativeEmail,
          areaServed: ["DE", "VN"],
          availableLanguage: ["de", "en", "vi"],
        },
      ],
      areaServed: {
        "@type": "Country",
        name: "Deutschland",
      },
      knowsLanguage: ["de-DE", "en", "vi"],
      sameAs: [VIETNAM_OFFICE_CONTACT.websiteHref],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Personalvermittlung & Fachkräftegewinnung aus Vietnam",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Fachkräfteprogramm (§ 18a / § 18b AufenthG)",
              description:
                "Vermittlung qualifizierter Fachkräfte aus Vietnam mit staatlich anerkanntem Berufs- oder Hochschulabschluss inklusive BQFG-Anerkennung und § 81a Visumverfahren.",
              url: siteUrl("/services/skilled-workers"),
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Duales Ausbildungsprogramm (§ 16a AufenthG)",
              description:
                "Rekrutierung, B1/B2-Sprachausbildung und interkulturelle Vorbereitung vietnamesischer Auszubildender für deutsche Ausbildungsbetriebe.",
              url: siteUrl("/services/azubi"),
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "Saisonkräfte & Kurzzeitbeschäftigung (§ 19c AufenthG)",
              description:
                "Rechtssichere Vermittlung von Saisonpersonal für Gastronomie, Hotellerie, Landwirtschaft und Logistik.",
              url: siteUrl("/services/seasonal"),
            },
          },
          ...BRANCHEN_CONFIGS.map((b) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: b.metaTitle,
              description: b.metaDescription,
              url: siteUrl(`/fuer-arbeitgeber/branchen/${b.slug}`),
            },
          })),
        ],
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "de-DE",
      publisher: { "@id": `${SITE_URL}/#organization` },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [
          "#geo-knowledge-base h2",
          "#geo-knowledge-base h3",
          "#geo-knowledge-base p",
          ".aeo-direct-answer",
        ],
      },
    },
  ];
}

export function buildHomepageFaqSchema(lang: "de" | "en" | "vn" = "de") {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: HOMEPAGE_GEO_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question[lang],
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer[lang],
      },
    })),
  };
}
