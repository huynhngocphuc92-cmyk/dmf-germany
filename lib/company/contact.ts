export const VIETNAM_OFFICE_CONTACT = {
  title: "Hauptsitz in Vietnam",
  location: "Dong Nai, Vietnam",
  phone: "+84 251 6609 500",
  phoneHref: "tel:+842516609500",
  email: "contact@dmf.edu.vn",
  emailHref: "mailto:contact@dmf.edu.vn",
  website: "dmf.edu.vn",
  websiteHref: "https://dmf.edu.vn",
} as const;

export const GERMANY_CONTACT = {
  title: "Ihr Ansprechpartner für Deutschland",
  name: "Herr Achim Betticher",
  location: "Deutschland",
  phone: "+84 855 070773",
  phoneHref: "tel:+84855070773",
  email: "achim.betticher@dmf.edu.vn",
  emailHref: "mailto:achim.betticher@dmf.edu.vn",
} as const;

export const PRIMARY_CONTACT = {
  email: VIETNAM_OFFICE_CONTACT.email,
  phone: GERMANY_CONTACT.phone,
} as const;
