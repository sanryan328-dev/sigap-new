const STORAGE_KEY = 'saved_login_accounts';
const MAX_ACCOUNTS = 10;

export interface SavedAccount {
  username: string;
  nama_lengkap: string;
  role: string;
}

export function getSavedAccounts(): SavedAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item: any) =>
        item && typeof item.username === 'string' && typeof item.nama_lengkap === 'string' && typeof item.role === 'string'
    );
  } catch {
    return [];
  }
}

function persistAccounts(accounts: SavedAccount[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(accounts.slice(0, MAX_ACCOUNTS)));
  } catch {
    /* quota exceeded — abaikan */
  }
}

export function saveAccount(account: SavedAccount): void {
  const accounts = getSavedAccounts();
  const filtered = accounts.filter((a) => a.username !== account.username);
  filtered.unshift(account);
  persistAccounts(filtered);
}

export function removeSavedAccount(username: string): void {
  const accounts = getSavedAccounts();
  persistAccounts(accounts.filter((a) => a.username !== username));
}
