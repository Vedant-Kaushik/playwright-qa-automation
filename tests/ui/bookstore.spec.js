const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { BookStorePage } = require('../../pages/BookStorePage');
const testData = require('../../test-data/testData.json');
const fs = require('fs');
const path = require('path');

test.describe('DemoQA Book Store Application - UI Automation', () => {
  test('Complete Flow: Login, Search Book, Extract Details to File, and Logout', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const bookStorePage = new BookStorePage(page);

    // 1. Navigate to Login Page
    await loginPage.navigate();

    // 2. Login using the test user
    await loginPage.login(testData.user.username, testData.user.password);

    // 3. Validate username and logout button
    await loginPage.validateSession(testData.user.username);

    // 4. Click on bookstore button & Search for the book
    await bookStorePage.clickBookStore();
    await bookStorePage.searchBook(testData.book.title);

    // 5. Validate the search result contains this book
    await bookStorePage.validateBookPresent(testData.book.title);

    // 6. Extract Title, Author, Publisher and save to file
    const bookDetails = await bookStorePage.getBookDetails(testData.book.title);
    
    const outputDir = path.join(__dirname, '../../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    const fileContent = `Title: ${bookDetails.title}\nAuthor: ${bookDetails.author}\nPublisher: ${bookDetails.publisher}\n`;
    fs.writeFileSync(path.join(outputDir, 'book-details.txt'), fileContent, 'utf-8');

    // 7. Click on log out and verify session end
    await loginPage.logout();
    await expect(page).toHaveURL(/.*login/);

  });
});
