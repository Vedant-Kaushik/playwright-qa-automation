const { test, expect } = require('@playwright/test');

test.describe('ReqRes API Automation', () => {
  const baseURL = 'https://reqres.in';
  let userId;

  test('Step 1: Create a user, validate status 201, fetch and store userId', async ({ request }) => {
    const response = await request.post(`${baseURL}/api/users`, {
      data: {
        name: 'Vedant Kaushik',
        job: 'QA Automation Intern'
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.name).toBe('Vedant Kaushik');
    expect(body.job).toBe('QA Automation Intern');
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('createdAt');

    userId = body.id;
  });

  test('Step 2: Get user details and validate', async ({ request }) => {
    // Validate GET /api/users endpoint returns 200 and valid user details schema
    const response = await request.get(`${baseURL}/api/users/2`);
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty('data');
    expect(body.data.id).toBe(2);
    expect(body.data).toHaveProperty('email');
    expect(body.data).toHaveProperty('first_name');
  });

  test('Step 3: Update user name and validate', async ({ request }) => {
    const response = await request.put(`${baseURL}/api/users/${userId || 2}`, {
      data: {
        name: 'Vedant Kaushik Updated',
        job: 'SDET'
      }
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.name).toBe('Vedant Kaushik Updated');
    expect(body.job).toBe('SDET');
    expect(body).toHaveProperty('updatedAt');
  });
});
