// Request filtering used by proxy.js and, as a second layer, by the API routes.

const SCANNER_AGENTS = /sqlmap|nikto|nmap|masscan|zgrab|wpscan|dirbuster|gobuster|nuclei|acunetix|nessus|openvas|havij|hydra|metasploit|ffuf|feroxbuster|burpcollaborator/i;

// Paths nobody legitimate asks for on this site: source and config files, dotfiles, and common CMS/server probes.
const BLOCKED_PATHS = [
  /(^|\/)\.(?!well-known\/)/,
  /^\/(node_modules|app|components|lib|src|scripts|\.next|\.git|\.vercel|\.netlify|vendor|cgi-bin|wp-[\w-]+|wordpress|phpmyadmin|pma|admin|administrator|actuator|server-status|server-info)(\/|$)/i,
  /^\/(package(-lock)?\.json|jsconfig\.json|tsconfig\.json|composer\.(json|lock)|next\.config\.\w+|tailwind\.config\.\w+|postcss\.config\.\w+|proxy\.js|server\.js|readme\.md|xmlrpc\.php|phpinfo\.php)$/i,
  /\.(map|env|ya?ml|toml|lock|log|bak|old|orig|swp|sql|sqlite|db|ini|conf|pem|key|php|asp|aspx|jsp|cgi)$/i,
];

export const isScanner = (userAgent) => SCANNER_AGENTS.test(userAgent || '');

export const isBlockedPath = (pathname) => BLOCKED_PATHS.some((pattern) => pattern.test(pathname));

// Encoded dots, null bytes, backslashes and dot segments are only ever used to escape the web root.
export const hasTraversal = (rawUrl) => {
  const path = String(rawUrl).replace(/^[a-z]+:\/\/[^/]+/i, '').split('?')[0];
  return /%2e|%00|%5c|%252e|\\|\.\.|\/\//i.test(path);
};

// A browser request that comes from another website must not be able to spend this site's AI quota.
export function isSameOrigin(request) {
  const site = request.headers.get('sec-fetch-site');
  if (site) return site === 'same-origin' || site === 'none';

  const origin = request.headers.get('origin');
  if (!origin) return true; // non-browser clients (curl) send none; they are still rate limited
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

// Prefer headers set by the hosting platform; the left side of X-Forwarded-For can be forged by the client.
export function clientIp(request) {
  const platform = request.headers.get('x-real-ip') || request.headers.get('x-nf-client-connection-ip');
  if (platform) return platform.trim();
  const forwarded = (request.headers.get('x-forwarded-for') || '').split(',').map((part) => part.trim()).filter(Boolean);
  return forwarded.at(-1) || 'unknown';
}

// Small JSON bodies only. Returns { value } or { error: 'too_large' | 'invalid' }.
export async function readJsonBody(request, maxBytes = 2048) {
  if (Number(request.headers.get('content-length') || 0) > maxBytes) return { error: 'too_large' };
  const text = await request.text();
  if (text.length > maxBytes) return { error: 'too_large' };
  try {
    return { value: JSON.parse(text) };
  } catch {
    return { error: 'invalid' };
  }
}
