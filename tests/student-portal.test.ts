import { describe, expect, it } from "vitest";
import {
  DOCUMENT_CHECKLIST_CONFIG,
  PROGRAM_TRACK_CONFIG,
  computeCandidateAssessmentMetrics,
  detectTimelineGaps,
  type EducationEntry,
  type WorkExperienceEntry,
} from "@/lib/portal/types";
import {
  legalSignatureSchema,
  studentMotivationLetterSchema,
  studentProfileUpdateSchema,
} from "@/lib/portal/schemas";
import {
  evaluateStudentInterviewAnswer,
  generateDin5008MotivationLetter,
} from "@/lib/portal/ai-service";

describe("Student Portal & German Dossier Standardization", () => {
  it("detects timeline gaps > 2 months in Tabellarischer Lebenslauf (Lücken-Detektor)", () => {
    const education: EducationEntry[] = [
      {
        id: "edu-1",
        fromMonth: "2019-09",
        toMonth: "2022-06",
        institutionVn: "THPT Nguyễn Thị Minh Khai",
        institutionDe: "Oberschule Nguyen Thi Minh Khai",
        location: "Ho-Chi-Minh-Stadt",
        degreeVn: "Tốt nghiệp THPT",
        degreeDe: "Allgemeine Hochschulreife",
        detailsDe: "",
      },
      {
        id: "edu-2",
        fromMonth: "2023-03",
        toMonth: "heute",
        institutionVn: "DMF Vietnam Academy",
        institutionDe: "DMF Vietnam Academy",
        location: "Ho-Chi-Minh-Stadt",
        degreeVn: "Khoá tiếng Đức B1-B2",
        degreeDe: "Intensivsprachkurs Deutsch B1–B2",
        detailsDe: "",
      },
    ];
    const work: WorkExperienceEntry[] = [];

    const gaps = detectTimelineGaps(education, work);
    expect(gaps.length).toBeGreaterThanOrEqual(1);
    expect(gaps[0].fromMonth).toBe("2022-07");
    expect(gaps[0].toMonth).toBe("2023-02");
    expect(gaps[0].missingMonths).toBe(8);
  });

  it("returns zero timeline gaps when education and work are seamless (lückenlos)", () => {
    const education: EducationEntry[] = [
      {
        id: "edu-1",
        fromMonth: "2020-09",
        toMonth: "2023-06",
        institutionVn: "THPT",
        institutionDe: "Oberschule",
        location: "Hanoi",
        degreeVn: "Tốt nghiệp THPT",
        degreeDe: "Abitur",
        detailsDe: "",
      },
      {
        id: "edu-2",
        fromMonth: "2023-08",
        toMonth: "heute",
        institutionVn: "DMF Academy",
        institutionDe: "DMF Academy",
        location: "Hanoi",
        degreeVn: "Tiếng Đức B2",
        degreeDe: "Deutschkurs B2",
        detailsDe: "",
      },
    ];
    const gaps = detectTimelineGaps(education, []);
    expect(gaps).toHaveLength(0);
  });

  it("defines distinct required document checklists for Ausbildung, Fachkräfte, Studium, and Seasonal tracks", () => {
    expect(PROGRAM_TRACK_CONFIG.azubi.legalBasis).toContain("16a");
    expect(PROGRAM_TRACK_CONFIG.skilled.legalBasis).toContain("18a");
    expect(PROGRAM_TRACK_CONFIG.studium.legalBasis).toContain("16b");

    const skilledRequired = DOCUMENT_CHECKLIST_CONFIG.filter((d) =>
      d.requiredForTracks.includes("skilled")
    );
    expect(skilledRequired.some((d) => d.docType === "vocational_degree")).toBe(true);
    expect(skilledRequired.some((d) => d.docType === "transcript_hours")).toBe(true);
  });

  it("validates DIN 5008 motivation letter and electronic signature schemas", () => {
    const validLetter = studentMotivationLetterSchema.safeParse({
      title: "Anschreiben Klinikum München",
      is_primary: true,
      target_company_name: "Klinikum München",
      target_company_address: "Lindwurmstraße 4",
      target_city: "80337 München",
      target_contact_person: "Frau Weber",
      target_position_de: "Auszubildende zur Pflegefachfrau",
      prompt_answers: {
        whyProfessionVn: "Yêu thích chăm sóc sức khoẻ",
        practicalExperienceVn: "Thực tập 3 tháng",
        whyGermanyAndCompanyVn: "Môi trường đào tạo chuẩn",
        personalStrengthsVn: "Kiên nhẫn, cẩn thận",
        futurePlanVn: "Làm việc lâu dài",
        earliestStartDateDe: "01.09.2026",
      },
      subject_de: "Bewerbung um einen Ausbildungsplatz als Pflegefachfrau ab 01.09.2026",
      salutation_de: "Sehr geehrte Frau Weber,",
      body_de: "mit großem Interesse bewerbe ich mich...",
      closing_de: "Mit freundlichen Grüßen",
    });
    expect(validLetter.success).toBe(true);

    const validSignature = legalSignatureSchema.safeParse({
      signature_data_url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA",
      signature_place: "Ho-Chi-Minh-Stadt",
      dsgvo_consent_accepted: true,
      vollmacht_accepted: true,
      vollmacht_employer_name: "Klinikum München GmbH",
    });
    expect(validSignature.success).toBe(true);

    const validProfile = studentProfileUpdateSchema.safeParse({
      program_track: "azubi",
      full_name: "Nguyen Thi Lan",
      given_name: "Thi Lan",
      family_name: "Nguyen",
      phone: "+84901234567",
      date_of_birth: "2004-05-12",
      place_of_birth: "Da Nang, Vietnam",
      nationality: "Vietnamesisch",
      marital_status: "Ledig",
      passport_number: "C9876543",
      passport_expiry: "2033-05-12",
      address_street: "12 Le Loi",
      address_city: "Da Nang",
      address_country: "Vietnam",
      avatar_url: "",
      target_profession: "Pflegefachfrau",
      experience_years: 1,
      german_level: "B2",
      education_history: [],
      work_experience: [],
      language_skills: [],
      special_skills: {
        drivingLicenseDe: "Klasse A1",
        edvSkillsDe: "MS Office",
        professionalSkillsDe: "Teamarbeit",
        hobbiesDe: "Lesen",
      },
      video_url: "",
      interview_script_de: "Guten Tag, mein Name ist Nguyen Thi Lan.",
    });
    expect(validProfile.success).toBe(true);
  });

  it("evaluates spoken German Vorstellungsgespräch answers with grammar, content, and culture scores", async () => {
    const mockProfile = {
      id: "student-1",
      user_id: "user-1",
      candidate_id: null,
      program_track: "azubi" as const,
      ai_enabled: true,
      invite_code_used: "DMF-2026",
      full_name: "Nguyen Thi Lan",
      given_name: "Thi Lan",
      family_name: "Nguyen",
      email: "lan@dmf-talents.de",
      phone: "+84901234567",
      date_of_birth: "2004-05-12",
      place_of_birth: "Da Nang",
      nationality: "Vietnamesisch",
      marital_status: "Ledig",
      passport_number: "C9876543",
      passport_expiry: "2033-05-12",
      address_street: "12 Le Loi",
      address_city: "Da Nang",
      address_country: "Vietnam",
      avatar_url: null,
      target_profession: "Pflegefachfrau",
      experience_years: 1,
      german_level: "B2" as const,
      education_history: [
        {
          id: "edu-1",
          fromMonth: "2020-09",
          toMonth: "heute",
          institutionVn: "DMF Academy",
          institutionDe: "DMF Vietnam Academy",
          location: "Da Nang",
          degreeVn: "B2",
          degreeDe: "Deutsch B2",
          detailsDe: "",
        },
      ],
      work_experience: [],
      language_skills: [],
      special_skills: {
        drivingLicenseDe: "Klasse A1",
        edvSkillsDe: "MS Office",
        professionalSkillsDe: "Patientenbetreuung",
        hobbiesDe: "Lesen",
      },
      video_url: null,
      interview_script_de: "",
      interview_qa: [],
      signature_data_url: null,
      signature_place: "Ho-Chi-Minh-Stadt",
      signature_updated_at: null,
      dsgvo_consent_accepted: true,
      dsgvo_consent_signed_at: null,
      vollmacht_accepted: true,
      vollmacht_signed_at: null,
      vollmacht_employer_name: "",
      sync_status: "draft" as const,
      admin_feedback: "Sehr zuverlässige Kandidatin",
      last_synced_at: null,
      last_synced_by: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const result = await evaluateStudentInterviewAnswer({
      profile: mockProfile,
      questionDe: "Warum möchten Sie eine Ausbildung zur Pflegefachfrau in Deutschland machen?",
      questionVn: "Tại sao bạn muốn học nghề Điều dưỡng tại Đức?",
      sampleAnswerDe:
        "Ich interessiere mich sehr für das duale Ausbildungssystem zur Pflegefachfrau in Deutschland, weil Theorie und Praxis eng verbunden sind.",
      studentAnswerDe:
        "Ich möchte Pflegefachfrau in Deutschland lernen, weil ich gerne Menschen helfe und im Krankenhaus Praktikum gemacht habe.",
    });

    expect(result.overallScore).toBeGreaterThanOrEqual(60);
    expect(result.grammatikScore).toBeGreaterThanOrEqual(60);
    expect(result.inhaltScore).toBeGreaterThanOrEqual(60);
    expect(result.kulturScore).toBeGreaterThanOrEqual(60);
    expect(result.upgradedB2VersionDe).toContain("Pflegefachfrau");
    expect(result.feedbackVn.length).toBeGreaterThan(10);

    const metrics = computeCandidateAssessmentMetrics(mockProfile, []);
    expect(metrics.isCvGapFree).toBe(true);
    expect(metrics.avgInterviewScore).toBeGreaterThanOrEqual(80);
    expect(metrics.overallReadinessScore).toBeGreaterThanOrEqual(50);

    // Verify DIN 5008 Anschreiben generator produces clean German structure without trailing dot in Betreff
    const letter = await generateDin5008MotivationLetter({
      profile: mockProfile,
      targetCompanyName: "Klinikum München",
      targetCity: "München",
      targetContactPerson: "Frau Weber",
      targetPositionDe: "Pflegefachfrau",
      answers: {
        whyProfessionVn: "Yêu thích điều dưỡng",
        practicalExperienceVn: "Thực tập tại bệnh viện Đà Nẵng",
        whyGermanyAndCompanyVn: "Ấn tượng với Klinikum München",
        personalStrengthsVn: "Cẩn thận, đúng giờ",
        futurePlanVn: "Gắn bó lâu dài",
        earliestStartDateDe: "01.09.2026",
      },
    });
    expect(letter.subject_de.endsWith(".")).toBe(false);
    expect(letter.salutation_de).toContain("Weber");
    expect(letter.body_de.length).toBeGreaterThan(50);
  });
});
