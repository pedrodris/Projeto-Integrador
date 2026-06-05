type ProfileSetupPrefill = {
  phone?: string;
  username?: string;
};

const storageKey = "nutri.profile.setup-prefill";

export function readProfileSetupPrefill() {
  const rawPrefill = window.sessionStorage.getItem(storageKey);

  if (!rawPrefill) {
    return null;
  }

  try {
    return JSON.parse(rawPrefill) as ProfileSetupPrefill;
  } catch {
    window.sessionStorage.removeItem(storageKey);
    return null;
  }
}

export function saveProfileSetupPrefill(prefill: ProfileSetupPrefill) {
  const nextPrefill: ProfileSetupPrefill = {};

  if (prefill.username?.trim()) {
    nextPrefill.username = prefill.username.trim();
  }

  if (prefill.phone?.trim()) {
    nextPrefill.phone = prefill.phone.trim();
  }

  if (!nextPrefill.username && !nextPrefill.phone) {
    window.sessionStorage.removeItem(storageKey);
    return;
  }

  window.sessionStorage.setItem(storageKey, JSON.stringify(nextPrefill));
}

export function clearProfileSetupPrefill() {
  window.sessionStorage.removeItem(storageKey);
}
