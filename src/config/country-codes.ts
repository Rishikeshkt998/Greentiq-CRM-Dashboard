export interface CountryCodeOption {
  code: string;
  country: string;
  name: string;
  flag: string;
  label: string;
  digits: number | [number, number];
  placeholder: string;
}

export const COUNTRY_CODES: CountryCodeOption[] = [
  { code: '+1', country: 'US', name: 'United States', flag: '🇺🇸', label: 'United States (+1)', digits: 10, placeholder: '(555) 123-4567' },
  { code: '+91', country: 'IN', name: 'India', flag: '🇮🇳', label: 'India (+91)', digits: 10, placeholder: '98765 43210' },
  { code: '+44', country: 'GB', name: 'United Kingdom', flag: '🇬🇧', label: 'United Kingdom (+44)', digits: [10, 11], placeholder: '7911 123456' },
  { code: '+1', country: 'CA', name: 'Canada', flag: '🇨🇦', label: 'Canada (+1)', digits: 10, placeholder: '(555) 123-4567' },
  { code: '+61', country: 'AU', name: 'Australia', flag: '🇦🇺', label: 'Australia (+61)', digits: 9, placeholder: '412 345 678' },
  { code: '+49', country: 'DE', name: 'Germany', flag: '🇩🇪', label: 'Germany (+49)', digits: [10, 11], placeholder: '151 12345678' },
  { code: '+33', country: 'FR', name: 'France', flag: '🇫🇷', label: 'France (+33)', digits: 9, placeholder: '6 12 34 56 78' },
  { code: '+81', country: 'JP', name: 'Japan', flag: '🇯🇵', label: 'Japan (+81)', digits: 10, placeholder: '90 1234 5678' },
  { code: '+55', country: 'BR', name: 'Brazil', flag: '🇧🇷', label: 'Brazil (+55)', digits: 11, placeholder: '11 91234-5678' },
  { code: '+52', country: 'MX', name: 'Mexico', flag: '🇲🇽', label: 'Mexico (+52)', digits: 10, placeholder: '55 1234 5678' },
  { code: '+86', country: 'CN', name: 'China', flag: '🇨🇳', label: 'China (+86)', digits: 11, placeholder: '138 1234 5678' },
  { code: '+65', country: 'SG', name: 'Singapore', flag: '🇸🇬', label: 'Singapore (+65)', digits: 8, placeholder: '8123 4567' },
  { code: '+971', country: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', label: 'United Arab Emirates (+971)', digits: 9, placeholder: '50 123 4567' },
  { code: '+27', country: 'ZA', name: 'South Africa', flag: '🇿🇦', label: 'South Africa (+27)', digits: 9, placeholder: '82 123 4567' },
  { code: '+82', country: 'KR', name: 'South Korea', flag: '🇰🇷', label: 'South Korea (+82)', digits: [9, 10], placeholder: '10 1234 5678' },
  { code: '+39', country: 'IT', name: 'Italy', flag: '🇮🇹', label: 'Italy (+39)', digits: 10, placeholder: '312 345 6789' },
  { code: '+34', country: 'ES', name: 'Spain', flag: '🇪🇸', label: 'Spain (+34)', digits: 9, placeholder: '612 34 56 78' },
  { code: '+31', country: 'NL', name: 'Netherlands', flag: '🇳🇱', label: 'Netherlands (+31)', digits: 9, placeholder: '6 12345678' },
  { code: '+46', country: 'SE', name: 'Sweden', flag: '🇸🇪', label: 'Sweden (+46)', digits: 9, placeholder: '70 123 45 67' },
  { code: '+41', country: 'CH', name: 'Switzerland', flag: '🇨🇭', label: 'Switzerland (+41)', digits: 9, placeholder: '79 123 45 67' },
  { code: '+60', country: 'MY', name: 'Malaysia', flag: '🇲🇾', label: 'Malaysia (+60)', digits: [9, 10], placeholder: '12 345 6789' },
  { code: '+64', country: 'NZ', name: 'New Zealand', flag: '🇳🇿', label: 'New Zealand (+64)', digits: 9, placeholder: '21 123 4567' },
  { code: '+63', country: 'PH', name: 'Philippines', flag: '🇵🇭', label: 'Philippines (+63)', digits: 10, placeholder: '917 123 4567' },
  { code: '+92', country: 'PK', name: 'Pakistan', flag: '🇵🇰', label: 'Pakistan (+92)', digits: 10, placeholder: '300 1234567' },
  { code: '+880', country: 'BD', name: 'Bangladesh', flag: '🇧🇩', label: 'Bangladesh (+880)', digits: 10, placeholder: '1712 345678' },
  { code: '+234', country: 'NG', name: 'Nigeria', flag: '🇳🇬', label: 'Nigeria (+234)', digits: 10, placeholder: '802 123 4567' },
  { code: '+20', country: 'EG', name: 'Egypt', flag: '🇪🇬', label: 'Egypt (+20)', digits: 10, placeholder: '100 123 4567' },
  { code: '+54', country: 'AR', name: 'Argentina', flag: '🇦🇷', label: 'Argentina (+54)', digits: 10, placeholder: '9 11 1234 5678' },
  { code: '+56', country: 'CL', name: 'Chile', flag: '🇨🇱', label: 'Chile (+56)', digits: 9, placeholder: '9 1234 5678' },
  { code: '+57', country: 'CO', name: 'Colombia', flag: '🇨🇴', label: 'Colombia (+57)', digits: 10, placeholder: '300 123 4567' },
  { code: '+62', country: 'ID', name: 'Indonesia', flag: '🇮🇩', label: 'Indonesia (+62)', digits: [10, 11], placeholder: '812 3456 7890' },
  { code: '+66', country: 'TH', name: 'Thailand', flag: '🇹🇭', label: 'Thailand (+66)', digits: 9, placeholder: '81 234 5678' },
  { code: '+84', country: 'VN', name: 'Vietnam', flag: '🇻🇳', label: 'Vietnam (+84)', digits: 9, placeholder: '91 234 56 78' },
  { code: '+90', country: 'TR', name: 'Turkey', flag: '🇹🇷', label: 'Turkey (+90)', digits: 10, placeholder: '532 123 45 67' },
  { code: '+48', country: 'PL', name: 'Poland', flag: '🇵🇱', label: 'Poland (+48)', digits: 9, placeholder: '512 345 678' },
  { code: '+32', country: 'BE', name: 'Belgium', flag: '🇧🇪', label: 'Belgium (+32)', digits: 9, placeholder: '471 23 45 67' },
  { code: '+43', country: 'AT', name: 'Austria', flag: '🇦🇹', label: 'Austria (+43)', digits: [10, 11], placeholder: '664 1234567' },
  { code: '+45', country: 'DK', name: 'Denmark', flag: '🇩🇰', label: 'Denmark (+45)', digits: 8, placeholder: '20 12 34 56' },
  { code: '+358', country: 'FI', name: 'Finland', flag: '🇫🇮', label: 'Finland (+358)', digits: 9, placeholder: '40 1234567' },
  { code: '+47', country: 'NO', name: 'Norway', flag: '🇳🇴', label: 'Norway (+47)', digits: 8, placeholder: '412 34 567' },
  { code: '+353', country: 'IE', name: 'Ireland', flag: '🇮🇪', label: 'Ireland (+353)', digits: 9, placeholder: '85 123 4567' },
  { code: '+351', country: 'PT', name: 'Portugal', flag: '🇵🇹', label: 'Portugal (+351)', digits: 9, placeholder: '912 345 678' },
  { code: '+30', country: 'GR', name: 'Greece', flag: '🇬🇷', label: 'Greece (+30)', digits: 10, placeholder: '691 234 5678' },
  { code: '+966', country: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', label: 'Saudi Arabia (+966)', digits: 9, placeholder: '50 123 4567' },
  { code: '+972', country: 'IL', name: 'Israel', flag: '🇮🇱', label: 'Israel (+972)', digits: 9, placeholder: '50 123 4567' },
];

export function validatePhoneNumberForCountry(phone: string, countryCode: string = '+91'): { isValid: boolean; error?: string } {
  const digitsOnly = phone.replace(/\D/g, '');
  const config = COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES.find((c) => c.code === '+91') || COUNTRY_CODES[0];

  if (!digitsOnly) {
    return { isValid: false, error: 'Phone number is required' };
  }

  // India (+91) specific rules: 10 digits starting with 6, 7, 8, or 9
  if (countryCode === '+91' || config.country === 'IN') {
    if (digitsOnly.length !== 10) {
      return { isValid: false, error: 'India (+91) phone number must be exactly 10 digits' };
    }
    if (!/^[6-9]/.test(digitsOnly)) {
      return { isValid: false, error: 'India (+91) mobile number must start with 6, 7, 8, or 9' };
    }
    return { isValid: true };
  }

  // US/Canada (+1) specific rules: 10 digits
  if (countryCode === '+1' || config.country === 'US' || config.country === 'CA') {
    if (digitsOnly.length !== 10) {
      return { isValid: false, error: `${config.name} (${config.code}) phone number must be exactly 10 digits` };
    }
    return { isValid: true };
  }

  // General Country digit-length range verification
  if (Array.isArray(config.digits)) {
    const [min, max] = config.digits;
    if (digitsOnly.length < min || digitsOnly.length > max) {
      return { isValid: false, error: `${config.name} (${config.code}) phone number must be ${min}-${max} digits` };
    }
  } else if (config.digits) {
    if (digitsOnly.length !== config.digits) {
      return { isValid: false, error: `${config.name} (${config.code}) phone number must be exactly ${config.digits} digits` };
    }
  } else {
    // E.164 standard fallback: 7-15 digits
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return { isValid: false, error: 'Phone number must be between 7 and 15 digits' };
    }
  }

  return { isValid: true };
}

