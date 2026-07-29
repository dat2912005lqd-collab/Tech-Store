import { test, expect } from '@playwright/test';

test.describe('Product Catalog Acceptance Tests', () => {

  test('Search product successfully', async ({ page }) => {
    await page.goto('http://localhost:3000/products');
    
    // Tìm ô search (Giả sử ô search có placeholder là 'Search product...')
    await page.fill('input[placeholder="Search product..."]', 'Iphone');
    
    // Đợi API search trả về kết quả
    await page.waitForTimeout(1000);
    
    // Kiểm tra ít nhất 1 thẻ sản phẩm có tên chứa chữ "Iphone" xuất hiện
    // Giả sử tên sản phẩm nằm trong thẻ h3 hoặc thẻ có class .product-name
    await expect(page.locator('.product-name:has-text("Iphone")')).toBeVisible();
  });

  test('Filter products by price or category', async ({ page }) => {
    await page.goto('http://localhost:3000/products');
    
    // Giả sử có dropdown lọc giá. Bạn chọn option giá từ thấp đến cao.
    await page.selectOption('select.filter-price-select', { value: 'low-to-high' });
    
    // Đợi 1 chút để danh sách render lại
    await page.waitForTimeout(1000);

    // Kỳ vọng sản phẩm đầu tiên trên trang có giá thấp (Bạn chỉ cần test nó render lại không lỗi là được)
    await expect(page.locator('.product-card').first()).toBeVisible();
  });
});