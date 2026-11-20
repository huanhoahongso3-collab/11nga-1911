import { Quicksand, Patrick_Hand } from 'next/font/google';
import './globals.css';
import ThemeToggle from '@/components/ThemeToggle';

const quicksand = Quicksand({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-quicksand',
  display: 'swap',
});

const patrickHand = Patrick_Hand({
  subsets: ['latin', 'vietnamese'],
  weight: '400',
  variable: '--font-hand',
  display: 'swap',
});

export const metadata = {
  title: '19/11 • Tập thể nữ 11 Nga gửi tặng cậu ✨',
  description: 'Thiệp 19/11 dành cho các chàng trai 11 Nga, với lời chúc riêng cho từng bạn.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FFFDF9' },
    { media: '(prefers-color-scheme: dark)', color: '#18161C' },
  ],
};

// Applies a saved light/dark choice before first paint so the page never flashes the wrong theme.
const THEME_SCRIPT = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${quicksand.variable} ${patrickHand.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans antialiased selection:bg-butter selection:text-ink flex flex-col justify-between">
        {children}
        <ThemeToggle />
      </body>
    </html>
  );
}
