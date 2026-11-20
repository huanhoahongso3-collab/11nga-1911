// Tên gọi = từ cuối của họ tên. Dùng chung cho client (kiểm tra form) và server (API).
export const NAMES = [
  { full: 'Dao Hong Phuc', call: 'Phúc' },
  { full: 'Tran Manh Khang', call: 'Khang' },
  { full: 'Nguyen Anh Tuan', call: 'Tuấn' },
  { full: 'Do Tran Thien Minh', call: 'Minh' },
  { full: 'Nguyen Tan Phat', call: 'Phát' },
  { full: 'Tran Tu Nguyen', call: 'Nguyên' },
  { full: 'Truong Ngoc Thai An', call: 'An' },
  { full: 'Nguyen Tuan Thanh', call: 'Thành' },
  { full: 'Trinh Phan Manh Tan', call: 'Tân' },
  { full: 'Lai Minh Quang', call: 'Quang' },
  { full: 'Vu Duc Quy', call: 'Quý' },
];

export function normName(s) {
  return String(s)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

// Hợp lệ khi và chỉ khi trùng họ tên đầy đủ hoặc trùng đúng từ cuối của họ tên.
export function findPerson(input) {
  const n = normName(input);
  if (!n) return null;
  return (
    NAMES.find((p) => {
      const full = normName(p.full);
      return n === full || n === full.split(' ').pop();
    }) || null
  );
}
