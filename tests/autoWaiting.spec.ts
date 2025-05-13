// AUTO-WAITING
import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }, testInfo) => {
    await page.goto(process.env.URL)
    await page.getByText('Button Triggering AJAX Request').click() // triggers a success message to show up after 15 seconds
    testInfo.setTimeout(testInfo.timeout + 2000) // increases the default timeout by 2 seconds for all tests (must pass testInfo as a param)
})

test('Auto waiting', async ({ page }) => {
    const successMessage = page.locator('.bg-success')

    //await successMessage.click() // playwright will wait up to 30 seconds for the message to appear on the page (this can be set in playwright.config.ts)

    //const text = await successMessage.textContent()

    //const text = await successMessage.allTextContents() // this does not have auto wait logic, so it fails

    //await successMessage.waitFor({ state: "attached" })
    //const text = await successMessage.allTextContents()

    //expect(text).toContain('Data loaded with AJAX get request.')

    await expect(successMessage).toHaveText('Data loaded with AJAX get request.', { timeout: 20000 }) // this has a 5 second timeout, but we can override it with a 2nd param
})

// What to do if a method does not have auto-waiting?
test('Alternative waits', async ({ page }) => {
    const successMessage = page.locator('.bg-success')

    // wait for element
    //await page.waitForSelector('.bg-success')

    // wait for a particular response - See Network tab in DevTools to see server response
    // click on ajaxdata to get the url we are waiting for
    //await page.waitForResponse('http://uitestingplayground.com/ajaxdata')

    // [NOT RECOMMENDED] - wait for all network calls to be completed - if one gets stuck it will hang up the test
    await page.waitForLoadState('networkidle')

    // [NOT RECOMMENDED] - hardcode a timeout
    //await page.waitForTimeout(5000)

    const text = await successMessage.allTextContents()
    expect(text).toContain('Data loaded with AJAX get request.')
})

// TIMEOUTS
test('Timeouts', async ({ page }) => {
    //test.setTimeout(10000) // sets the time limit for the test to run
    test.slow() // multiplies the timeout by 3 (changed timeout to 10000 ms in playwright.config.ts)
    const successMessage = page.locator('.bg-success')
    //await successMessage.click({ timeout: 16000 }) // this overrides the 5000 actionTimeout set in playwright.config.ts
    await successMessage.click()
})






