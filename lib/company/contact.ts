export const VIETNAM_OFFICE_CONTACT = {
  title: "Hauptsitz & Vertretung in Vietnam",
  name: "Herr Achim Betticher",
  location: "Dong Nai, Vietnam",
  phone: "+84 855 070773",
  phoneHref: "tel:+84855070773",
  officePhone: "+84 251 6609 500",
  officePhoneHref: "tel:+842516609500",
  email: "contact@dmf-talents.de",
  emailHref: "mailto:contact@dmf-talents.de",
  representativeEmail: "achim.betticher@dmf-talents.de",
  representativeEmailHref: "mailto:achim.betticher@dmf-talents.de",
  website: "dmf.edu.vn",
  websiteHref: "https://dmf.edu.vn",
} as const;

export const GERMANY_CONTACT = {
  title: "Direkte Vertretung in Deutschland",
  name: "Herr Umit Elezov",
  rawName: "Umit Elezov",
  location: "Deutschland",
  phone: "+49 174 9015811",
  phoneHref: "tel:+491749015811",
  email: "contact@dmf-talents.de",
  emailHref: "mailto:contact@dmf-talents.de",
} as const;

export const PRIMARY_CONTACT = {
  email: VIETNAM_OFFICE_CONTACT.email,
  phone: GERMANY_CONTACT.phone,
} as const;
