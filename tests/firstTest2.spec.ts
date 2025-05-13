// LOCATOR SYNTAX RULES
import { test, expect } from '@playwright/test'

test.beforeEach(async({ page }) => {
    await page.goto('/') // see baseURL setting in playwright.config.ts
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

test('Locator syntax rules', async({ page }) => {
    // 'locator' will accept 2 arguments - (<'a string that matches the DOM'>, {})
    // {} is an object with different options of the locator

    // All of the following are gotten from the highlighted area in the DOM when we inspect an element on the web page

    // by Tag name
    page.locator('input') // if '.click' were used here, we would get an error that playwright found multiple elements (it does not know which one to click)
    //page.locator('input').first().click() // here, we specify which one to click

    // by ID
    await page.locator('#inputEmail1').click()

    // by Class value
    page.locator('.shape-rectangle')

    // by Attribute
    page.locator('[placeholder="Email"]')

    // by Class value (full)
    page.locator('[input-full-width size-medium status-basic shape-rectangle nb-transition]')

    // combine different selectors (no spaces!)
    page.locator('input[placeholder="Email"][nbinput]') // playwright will find elements with all 3 of these attributes

    // [NOT RECOMMENDED] by XPath (XML Path Language) - a way to navigate and locate elements in the DOM using a path-like syntax, good for finding children, etc.
    page.locator('//*[@id="inputEmail1"]')

    // by partial text match (simple text on the page)
    page.locator(':text("Using")')

    // by exact text match
    page.locator(':text-is("Using the Grid")')
})

test('User facing locators', async({ page }) => {
    // .getByRole() selects elements based on their ARIA role, not directly from the raw HTML. Playwright finds the correct element based on accessibility roles (e.g., button, textbox).
    await page.getByRole('textbox', { name: "Email" }).first().click() // we are looking for the textbox that has the name Email
    await page.getByRole('button', { name: "Sign in" }).first().click()

    await page.getByLabel('Email').first().click()

    await page.getByPlaceholder('Jane Doe').click()

    await page.getByText('Using the Grid').click()

    //await page.getByTitle('IoT Dashboard').click() // this doesn't work with the next line because 'IoT Dashboard' is a parent of 'SignIn'

    await page.getByTestId('SignIn').click() // an ID that can be identified in the source html code, this isn't as user-facing though. Added 'data-testid="SignIn"' in the html - <button data-testid="SignIn" type="submit" nbButton status="primary">Sign in</button>
})

test('Locating child elements', async({ page }) => {
    // nb-card is the parent, children come after
    await page.locator('nb-card nb-radio :text-is("Option 1")').click()

    // can also be chained together
    await page.locator('nb-card').locator('nb-radio').locator(':text-is("Option 2")').click()

    // by combination of the regular locator and the user-facing locator (these can be done in any order, ex. use getByRole first)
    // here, we don't really need 'nb-card' as shown on line 48. This is just to show an example
    await page.locator('nb-card').getByRole('button', { name: "Sign In" }).first().click()

    // [NOT RECOMMENDED] by using the index of the element (note that 3 is the 4th element)
    await page.locator('nb-card').nth(3).getByRole('button').click()

    // ** try to avoid using order like .first, .last, and nth element because the order could change ** //
})

test('Locating parent elements', async({ page }) => {
    // by passing the 'hasText' filter as the object for the locator
    await page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" }).click()

    // by passing another locator with the 'has' filter as the object for the locator
    await page.locator('nb-card', { has: page.locator('#inputEmail1') }).getByRole('textbox', { name: "Email" }).click()

    // by using the .filter() independent method, has the same capabilities as the second arg passed in the locators above
    // note that .filter() can be chained, unlike finding an element by passing a filter as the second arg in locator
    await page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole('textbox', { name: "Email" }).click()
    await page.locator('nb-card').filter({ has: page.locator('.status-danger') }).getByRole('textbox', { name: "Password" }).click()

    // by chaining the .filter() method
    await page.locator('nb-card').filter({ has: page.locator('nb-checkbox') }).filter({ hasText: "Sign in" })
        .getByRole('textbox', { name: "Email" }).click()

    // [NOT RECOMMENDED] by using XPath to find one level up from an element to it's parent element
    await page.locator(':text-is("Using the Grid")').locator('..').getByRole('textbox', { name: "Email" }).click()
})

test('Reusing the locators', async({ page }) => {
    // to automate filling out the Basic form section of the webpage
    // this exmample has a lot of duplication
    await page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole('textbox', { name: "Email" }).fill('test@test.com')
    await page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole('textbox', { name: "Password" }).fill('Welcome123')
    await page.locator('nb-card').filter({ hasText: "Basic form" }).getByRole('button').click()

    // we can extract the duplicated code as a constant
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
    // and we can create another level of abstraction using the constant
    const emailField = basicForm.getByRole('textbox', { name: "Email" })

    await emailField.fill('test@test.com')
    await basicForm.getByRole('textbox', { name: "Password" }).fill('Welcome123')
    await basicForm.locator('nb-checkbox').click() // checks the check mark box
    await basicForm.getByRole('button').click()

    await expect(emailField).toHaveValue('test@test.com') // assertion
})

test('Extracting values', async({ page }) => {
    // singe text value
    const basicForm = page.locator('nb-card').filter({ hasText: "Basic form" })
    const buttonText = await basicForm.locator('button').textContent() // takes the text from the button and assigns to the buttonText variable
    expect(buttonText).toEqual('Submit')  // assertion

    // all text values
    const allRadioButtonsLabels = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonsLabels).toContain("Option 1") // at least one of the buttons should have this text

    // input value (different from a text value!)
    const emailField = basicForm.getByRole('textbox', { name: "Email" })
    await emailField.fill('test@test.com')
    const emailValue = await emailField.inputValue()
    expect(emailValue).toEqual('test@test.com')

    // get the value of the attribute, these can change based on the state of the application (when a button it clicked, it changes color for exmaple)
    // we want to check if a placeholder attribute has the value "Email"
    const placeholderValue = await emailField.getAttribute('placeholder')
    expect(placeholderValue).toEqual('Email')
})

test('Assertions', async({ page }) => {
    const basicFormButton = page.locator('nb-card').filter({ hasText: "Basic form" }).locator('button')

    // general assertions
    const value = 5
    expect(value).toEqual(5) // generic assertions - we can see this in the dropdown after the dot notation

    const text = await basicFormButton.textContent() // don't forget to put await here (always check this by hovering over the method to see what it returns, ex. a Promise)
    expect(text).toEqual("Submit")

    // locator assertions - instead of providing the exact value, we provide a locator
    await expect(basicFormButton).toHaveText('Submit') // now we have a choice of locator assertions as well as the generic ones

    // soft assertions - the test will continue executing even if the assertion has failed
    await expect.soft(basicFormButton).toHaveText('Submit5') // despite this failing, it will move on to click the button
    await basicFormButton.click()

    // ** without .soft, the test will fail at line 154 and not continue the execution ** //
})







































