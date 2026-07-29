import { test, expect } from '@playwright/test';
test.describe('Authentication Acceptance Tests', () => {
  // Test 1: Đăng nhập thất bại khi sai mật khẩu
  test('Login failed with incorrect password', async ({ page }) => {
    await page.goto('http://localhost:3000/login'); // Đổi port nếu dự án bạn chạy khác
    // Điền thông tin sai
    await page.fill('input[placeholder="Username"]', 'testuser');
    await page.fill('input[type="password"]', 'sai_mat_khau');
    await page.click('button:has-text("Login")');
    // Kỳ vọng: Vẫn đang ở trang login và xuất hiện thông báo lỗi
    await expect(page).toHaveURL('http://localhost:3000/login');
    // Hãy kiểm tra xem trang web bạn dùng class nào cho thông báo lỗi (ví dụ: .error-message, .alert-danger)
    await expect(page.locator('.error-message')).toBeVisible(); 
  });
  // Test 2: Đăng ký tài khoản mới thành công
  test('Register a new user successfully', async ({ page }) => {
    // Tạo email ngẫu nhiên để chạy test không bị trùng lặp
    const randomEmail = `testuser_${Date.now()}@gmail.com`;
    await page.goto('http://localhost:3000/register');
    await page.fill('input[name="fullname"]', 'Test User Fullname');
    await page.fill('input[name="email"]', randomEmail);
    await page.fill('input[name="password"]', 'password123');
    await page.fill('input[name="confirmPassword"]', 'password123');
    await page.click('button:has-text("Register")'); // Hoặc type="submit"
    // Kỳ vọng: Đăng ký xong tự động chuyển sang trang Login
    await expect(page).toHaveURL('http://localhost:3000/login');
  });
});