import { notFound } from 'next/navigation';
import Ambient from '@/components/Ambient';
import WishFace from '@/components/WishFace';
import { readShareId } from '@/lib/share';

export async function generateMetadata({ params }) {
  const { id } = await params;
  const wish = readShareId(id);
  return {
    title: wish ? `Lời nhắn riêng dành cho ${wish.person.full}` : '19/11 • Tập thể nữ 11 Nga',
    robots: { index: false, follow: false },
  };
}

// Public, read-only view opened from the QR code on an exported wish image.
export default async function SharedWishPage({ params }) {
  const { id } = await params;
  const wish = readShareId(id);
  if (!wish) notFound();

  return (
    <>
      <Ambient />
      <main className="relative z-10 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 my-auto">
        <WishFace person={wish.person} text={wish.text} />
      </main>
    </>
  );
}
