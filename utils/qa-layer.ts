// Đây là "Bộ lọc chất lượng"
export function checkQuality(rawData: any, defaultContent: any) {
  // 1. Nếu không có dữ liệu đầu vào -> Trả về dữ liệu mặc định (Dự phòng)
  if (!rawData) {
    console.warn("⚠️ QA ALERT: Dữ liệu bị mất hoàn toàn! Đang dùng dữ liệu dự phòng.");
    return defaultContent;
  }

  // 2. Trộn dữ liệu: Cái gì rawData thiếu thì lấy từ defaultContent đắp vào
  return {
    ...defaultContent, // Lấy khung chuẩn làm nền
    ...rawData, // Đắp dữ liệu thật lên (nếu có)

    // Xử lý riêng cho Hero Section (đảm bảo không bao giờ thiếu)
    hero: {
      ...defaultContent.hero,
      ...(rawData.hero || rawData.intro || {}),
    },
  };
}
