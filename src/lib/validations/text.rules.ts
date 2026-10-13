export const EMAIL_MAX = 254;
export const PHONE_PATTERN = /^(?:\+\d{1,3}[\s-]?)?[6-9]\d{9}$/;

const NAME_ALLOWED = /^[\p{L}\p{M}][\p{L}\p{M}'\u2019.\- ]*$/u;
const ORGANISATION_ALLOWED = /^[\p{L}\p{N}][\p{L}\p{N}'\u2019.&(),\-/ ]*$/u;

const KEYBOARD_RUNS = [
  /qwer/i,
  /asdf/i,
  /zxcv/i,
  /qazw/i,
  /wsxc/i,
  /edcv/i,
  /hjkl/i,
  /fghj/i,
  /qweasd/i,
  /xyz/i,
];

const PLACEHOLDER_WORDS = new Set([
  "test",
  "testing",
  "testtest",
  "tests",
  "asdf",
  "asdfasdf",
  "qwerty",
  "zxcv",
  "lorem",
  "ipsum",
  "abc",
  "abcd",
  "xyz",
  "foo",
  "bar",
  "baz",
  "blah",
  "random",
  "text",
  "here",
  "hello",
  "world",
  "sample",
  "example",
  "aaaa",
  "bbbb",
  "cccc",
  "dddd",
  "none",
  "nothing",
]);

function toLetters(value: string) {
  return value.toLowerCase().replace(/[^\p{L}]/gu, "");
}

function topCharacterRatio(letters: string) {
  if (letters.length === 0) return 0;

  const counts = new Map<string, number>();
  for (const character of letters) {
    counts.set(character, (counts.get(character) ?? 0) + 1);
  }

  return Math.max(...counts.values()) / letters.length;
}

function maxConsonantRun(value: string) {
  let maximum = 0;
  let run = 0;

  for (const character of value.toLowerCase()) {
    if (/[a-z]/.test(character)) {
      if (/[aeiou]/.test(character)) {
        run = 0;
      } else {
        run += 1;
        maximum = Math.max(maximum, run);
      }
    } else {
      run = 0;
    }
  }

  return maximum;
}

function isAsciiDominant(value: string) {
  const letters = [...value].filter((character) => /\p{L}/u.test(character));
  if (letters.length === 0) return true;

  const ascii = letters.filter((character) => /[a-z]/i.test(character)).length;
  return ascii / letters.length >= 0.6;
}

function hasKeyboardRun(value: string) {
  return KEYBOARD_RUNS.some((pattern) => pattern.test(value));
}

function wordsOf(value: string) {
  return value
    .toLowerCase()
    .split(/[^\p{L}\p{N}']+/u)
    .filter(Boolean);
}

export function isValidEmail(value: string) {
  const email = value.trim();

  if (email.length === 0 || email.length > EMAIL_MAX) return false;
  if (/\s/.test(email)) return false;

  const parts = email.split("@");
  if (parts.length !== 2) return false;

  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  if (!/^[\p{L}\p{N}!#$%&'*+/=?^_`{|}~.-]+$/u.test(local)) return false;

  const labels = domain.split(".");
  if (labels.length < 2) return false;

  for (const label of labels) {
    if (!label) return false;
    if (!/^[\p{L}\p{N}](?:[\p{L}\p{N}-]{0,61}[\p{L}\p{N}])?$/u.test(label)) return false;
  }

  const tld = labels[labels.length - 1];
  return /^\p{L}{2,}$/u.test(tld);
}

export function isValidPhone(value: string) {
  const phone = value.trim();
  return PHONE_PATTERN.test(phone);
}

export function isHumanName(value: string) {
  const name = value.trim().replace(/\s+/g, " ");

  if (name.length < 2 || name.length > 80) return false;
  if (!NAME_ALLOWED.test(name)) return false;

  const letters = toLetters(name);
  if (letters.length < 2) return false;
  if (topCharacterRatio(letters) > 0.6) return false;
  if (/^(.{1,3})\1+$/.test(letters)) return false;

  const tokens = name.split(" ").filter(Boolean);
  if (tokens.some((token) => token.length > 40)) return false;

  if (isAsciiDominant(name)) {
    if (hasKeyboardRun(name)) return false;
    if (maxConsonantRun(name) > 4) return false;
    if (tokens.some((token) => token.length >= 4 && !/[aeiouy]/i.test(token))) return false;
  }

  return true;
}

export function isValidOrganisation(value: string) {
  const company = value.trim().replace(/\s+/g, " ");

  if (company.length < 2 || company.length > 160) return false;
  if (!ORGANISATION_ALLOWED.test(company)) return false;

  const letters = toLetters(company);
  if (letters.length < 2) return false;
  if (topCharacterRatio(letters) > 0.6) return false;
  if (/^(.{1,3})\1+$/.test(letters)) return false;

  if (isAsciiDominant(company)) {
    if (hasKeyboardRun(company)) return false;
    if (maxConsonantRun(company) > 5) return false;
  }

  return true;
}

export function isMeaningfulMessage(
  value: string,
  options: { minLength?: number; minLetters?: number; minWords?: number } = {},
) {
  const { minLength = 15, minLetters = 12, minWords = 3 } = options;
  const message = value.trim().replace(/\s+/g, " ");

  if (message.length < minLength) return false;

  const letters = toLetters(message);
  if (letters.length < minLetters) return false;
  if (new Set(letters).size < 5) return false;
  if (topCharacterRatio(letters) > 0.45) return false;

  const words = wordsOf(message).filter((word) => /\p{L}/u.test(word));
  if (words.length < minWords) return false;

  const uniqueWords = new Set(words).size;
  if (words.length >= 4 && uniqueWords / words.length < 0.4) return false;

  const placeholders = words.filter((word) => PLACEHOLDER_WORDS.has(word)).length;
  if (words.length > 0 && placeholders === words.length) return false;

  if (isAsciiDominant(message)) {
    if (hasKeyboardRun(message)) return false;
    if (maxConsonantRun(message) > 6) return false;

    const vowels = (message.match(/[aeiou]/gi) ?? []).length;
    if (vowels === 0) return false;
    if (vowels / letters.length < 0.12) return false;
  }

  return true;
}

export function isMeaningfulLabel(value: string) {
  const label = value.trim().replace(/\s+/g, " ");

  if (label.length < 3 || label.length > 160) return false;

  const letters = toLetters(label);
  if (letters.length < 3) return false;
  if (new Set(letters).size < 3) return false;
  if (topCharacterRatio(letters) > 0.6) return false;

  if (isAsciiDominant(label)) {
    if (hasKeyboardRun(label)) return false;
    if (maxConsonantRun(label) > 6) return false;
    if ((label.match(/[aeiou]/gi) ?? []).length === 0) return false;
  }

  return true;
}
