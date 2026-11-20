import { Quicksand, Patrick_Hand } from 'next/font/google';
import './globals.css';

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
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${quicksand.variable} ${patrickHand.variable}`}>
      <body className="min-h-screen font-sans antialiased selection:bg-butter selection:text-ink flex flex-col justify-between">
        {children}
      </body>
    </html>
  );
}
