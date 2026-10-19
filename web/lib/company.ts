// The company behind Selfi, as it must appear on the website (e-handelsloven § 7), in the EU declaration of
// conformity and on the rating label (RED art. 10(6), GPSR art. 9). Fill in the empty fields: a field left
// empty is simply not shown, but the declaration and the footer are not complete until all of them are set.
export const company = {
  name: "Selfi",
  legalName: "", // fx "Selfi ApS" eller "Selfi v/ Esben Christensen", som i CVR
  cvr: "", // fx "12345678"
  street: "", // fx "Eksempelvej 1"
  postcode: "", // fx "8000 Aarhus C"
  country: "Danmark",
  email: "", // fx "kontakt@selfi.dk": bruges til databeskyttelse, sikkerhedshuller og produktsikkerhed
  phone: "",
  web: "selfi.dk",
  signatory: { name: "Esben Christensen", title: "Stifter" },
};

export const companyAddress = [company.street, company.postcode, company.street || company.postcode ? company.country : ""]
  .filter(Boolean)
  .join(", ");

// Where people reach us when no e-mail is set: the contact form.
export const contactHref = company.email ? `mailto:${company.email}` : "/#kontakt";
export const contactText = company.email || "kontaktformularen på selfi.dk";
