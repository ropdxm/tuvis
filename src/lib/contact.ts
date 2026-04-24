export const phoneCountries = [
  { code: "+7", label: "KZ/RU", nationalLength: 10 },
  { code: "+996", label: "KG", nationalLength: 9 },
  { code: "+998", label: "UZ", nationalLength: 9 },
  { code: "+992", label: "TJ", nationalLength: 9 },
  { code: "+90", label: "TR", nationalLength: 10 },
  { code: "+86", label: "CN", nationalLength: 11 },
  { code: "+1", label: "US", nationalLength: 10 },
] as const;

export function getPhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export function normalizePhoneNumber(nationalPhone: string, countryCode: string) {
  return `${countryCode}${getPhoneDigits(nationalPhone)}`;
}

export function isValidPhoneForCountry(nationalPhone: string, countryCode: string) {
  const country = phoneCountries.find((item) => item.code === countryCode);
  const digits = getPhoneDigits(nationalPhone);
  return Boolean(country && digits.length === country.nationalLength);
}

export function cleanNationalPhoneInput(value: string, countryCode: string) {
  const digits = getPhoneDigits(value);
  const countryDigits = countryCode.replace(/\D/g, "");
  const country = phoneCountries.find((item) => item.code === countryCode);

  if (country && digits.startsWith(countryDigits) && digits.length > country.nationalLength) {
    return digits.slice(countryDigits.length);
  }

  return digits;
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

export function splitPhoneNumber(phone: string | undefined) {
  if (!phone) {
    return { countryCode: "+7", nationalNumber: "" };
  }

  const matchedCountry = [...phoneCountries]
    .sort((left, right) => right.code.length - left.code.length)
    .find((country) => phone.startsWith(country.code));

  if (!matchedCountry) {
    return { countryCode: "+7", nationalNumber: getPhoneDigits(phone) };
  }

  return {
    countryCode: matchedCountry.code,
    nationalNumber: getPhoneDigits(phone.slice(matchedCountry.code.length)),
  };
}
