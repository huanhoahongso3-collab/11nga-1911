import Ambient from '@/components/Ambient';
import GuessGame from '@/components/GuessGame';

export const metadata = {
  title: 'Đoán xem ai đây? • 11 Nga',
  description: 'Trò chơi nhỏ: đoán tên các chàng trai 11 Nga qua ảnh mờ và gợi ý.',
};

export default function GuessPage() {
  return (
    <>
      <Ambient />
      <main className="relative z-10 w-full max-w-xl mx-auto px-4 sm:px-6 py-8 sm:py-12 my-auto">
        <GuessGame />
      </main>
    </>
  );
}
