export interface IProduct {
  name: string;
  category: string; // Danh mục sản phẩm
  sku: string; // Mã sản phẩm (SKU)
  price: number; // Giá sản phẩm
  availability: boolean; // Tình trạng hàng tồn kho (inStock, outOfStock, ...)
  image: string; // URL hình ảnh sản phẩm
  thumbnail: string; // URL hình ảnh nhỏ
  unit: string; // Đơn vị sản phẩm
  description?: string; // Mô tả sản phẩm
  usageInstructions?: string; // Hướng dẫn sử dụng
  brand?: string; // Thương hiệu
  rating?: number; // Đánh giá trung bình
  reviews?: number; // Số lượng đánh giá
}