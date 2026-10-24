const { expect } = require('@playwright/test');

class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#userName');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login');
    this.userNameValue = page.locator('#userName-value');
    this.logoutButton = page.getByRole('button', { name: /log\s*out/i });
  }

  async navigate() {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded' });
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async validateSession(expectedUsername) {
    await expect(this.userNameValue).toHaveText(expectedUsername);
    await expect(this.logoutButton).toBeVisible();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { LoginPage };
