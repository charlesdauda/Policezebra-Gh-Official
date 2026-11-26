// Returns "+233241234567" style, or null if it isn't a plausible number.
export function normalizePhone(input) {
  let p = String(input).trim().replace(/[\s\-()]/g, "");

  if (p.startsWith("00")) p = "+" + p.slice(2);
  else if (p.startsWith("0")) p = "+233" + p.slice(1); // local Ghana number
  else if (p.startsWith("233")) p = "+" + p;

  return /^\+[1-9]\d{7,14}$/.test(p) ? p : null;
}

// "+233241234567" -> "••• ••• 567"
export function maskPhone(phone) {
  return `••• ••• ${phone.slice(-3)}`;
}