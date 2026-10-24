const { expect } = require('@playwright/test');

class BookStorePage {
  constructor(page) {
    this.page = page;
    this.searchBox = page.locator('#searchBox');
    this.bookStoreButton = page.locator('#gotoStore');
  }

  async clickBookStore() {
    if (await this.bookStoreButton.isVisible()) {
      await Promise.all([
        this.page.waitForURL('**/books'),
        this.bookStoreButton.click()
      ]);
    } else {
      await this.page.goto('/books', { waitUntil: 'domcontentloaded' });
    }
    await this.searchBox.waitFor({ state: 'visible' });
  }

  async searchBook(title) {
    await this.searchBox.fill(title);
  }

  async validateBookPresent(title) {
    const bookLink = this.page.getByRole('link', { name: title });
    await expect(bookLink).toBeVisible();
  }

  async getBookDetails(title) {
    const bookRow = this.page.getByRole('row').filter({ hasText: title });
    await expect(bookRow).toBeVisible();

    const cells = bookRow.getByRole('cell');
    const bookTitle = await bookRow.getByRole('link', { name: title }).innerText();
    const author = await cells.nth(2).innerText();
    const publisher = await cells.nth(3).innerText();

    return { 
      title: bookTitle.trim(), 
      author: author.trim(), 
      publisher: publisher.trim() 
    };
  }
}

module.exports = { BookStorePage };
