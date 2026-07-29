import { test, expect } from '@playwright/test';

test.describe('Cart Acceptance Tests', () => {

  // Lưu ý: Để test giỏ hàng, thường bạn cần đăng nhập trước.
  // Bạn có thể dùng test.beforeEach để đăng nhập trước mỗi test.
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.fill('input[placeholder="Username"]', 'testuser'); // Tài khoản đã tồn tại
    await page.fill('input[type="password"]', 'password123');
    await page.click('button:has-text("Login")');
    await expect(page).toHaveURL('http://localhost:3000/'); // Đợi login xong
  });

  test('Add product to cart and verify badge count', async ({ page }) => {
    // Đi đến trang sản phẩm
    await page.goto('http://localhost:3000/products');
    
    // Lấy nút "Add to Cart" của sản phẩm đầu tiên và click (Sửa selector '.product-card' cho đúng với giao diện bạn)
    await page.locator('.product-card button:has-text("Add to Cart")').first().click();
    
    // Đợi 1 chút để API cập nhật giỏ hàng
    await page.waitForTimeout(1000);
    
    // Kiểm tra số trên badge giỏ hàng (Giả sử badge nằm trong thẻ có class .cart-badge)
    const badgeText = await page.locator('.cart-badge').innerText();
    expect(Number(badgeText)).toBeGreaterThan(0); 
  });

  test('Remove product from cart', async ({ page }) => {
    await page.goto('http://localhost:3000/cart'); // Trang giỏ hàng
    
    // Click nút xóa sản phẩm (Giả sử có nút Xóa hoặc icon thùng rác)
    await page.locator('button:has-text("Xóa")').first().click(); 
    // Hoặc dùng icon: await page.locator('svg.trash-icon').first().click();

    // Kỳ vọng: Thông báo giỏ hàng trống xuất hiện
    await expect(page.locator('text=Giỏ hàng của bạn đang trống')).toBeVisible();
  });
});