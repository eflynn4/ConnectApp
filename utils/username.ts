// utils/username.ts
export function normalizeUsername(input: string): string {
    let u = input.toLowerCase();
    u = u.replace(/[^a-z0-9_]/g, "");      // remove invalid chars
    u = u.replace(/_{2,}/g, "_");          // collapse multiple underscores
    u = u.replace(/^_+|_+$/g, "");         // trim leading/trailing underscores
    return u;
  }
  
  export function validateUsername(u: string): { ok: boolean; error?: string } {
    if (!/^[a-z]/.test(u)) return { ok: false, error: "Must start with a letter." };
    if (u.length < 3)      return { ok: false, error: "At least 3 characters." };
    if (u.length > 20)     return { ok: false, error: "Max 20 characters." };
    if (!/^[a-z0-9_]+$/.test(u)) return { ok: false, error: "Only letters, numbers, and underscores." };
    if (/__/.test(u))      return { ok: false, error: "No consecutive underscores." };
    if (/^_|_$/.test(u))   return { ok: false, error: "Cannot begin or end with underscore." };
    return { ok: true };
  }
  