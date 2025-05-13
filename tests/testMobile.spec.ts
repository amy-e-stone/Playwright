import { test, expect } from '@playwright/test'

test('input fields', async ({ page }) => {

    await page.goto('/')
    await page.locator('.sidebar-toggle').click()
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
    await page.locator('.sidebar-toggle').click()
    const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" })
    await usingTheGridEmailInput.fill('test@test.com')
    await usingTheGridEmailInput.clear()
    await usingTheGridEmailInput.type('test2@test.com')
})

// We need to create a new project in 'playwright.config.ts'

// NOTE: When I replace 'await page.locator('sidebar-toggle').click()' with the code block below so this test will work under the condition of which test is selected to run, 'mobile' no longer works
//if(testInfo.project.name == 'mobile'){
//    await page.locator('sidebar-toggle').click()
//}