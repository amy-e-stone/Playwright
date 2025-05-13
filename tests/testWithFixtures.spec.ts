// ** Code taken from usePageObjects.spec.ts ** //

//import { test, expect } from '@playwright/test'
import { test } from '../test-options'
//import { PageManager } from '../page-objects/pageManager' // This import can be removed now with addition of the fixture in 'test-options.ts'
import { faker } from '@faker-js/faker'

// The following block is replaced by the fixture in 'test-options.ts'
//test.beforeEach(async ({ page }) => {
//    await page.goto('/')
//})

// We can remove the 'formsLayoutPage' parameter from this test. See the use of { auto: true } in 'test-options.ts'
// test('parametrized methods', async({ page, formLayoutsPage }) => { // pass the fixture from the file 'test-options.ts' to this test

// ... and instead of passing the default 'page', we can pass the new fixture 'pageManager'
//test('parametrized methods', async({ page }) => {
test('parametrized methods', async({ pageManager }) => {
    // The following line of code is replaced by the 'pageManager' fixture in 'test-options.ts'
    //const pm = new PageManager(page)
    const randomFullName = faker.person.fullName() // this will return a random full name
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com` // replace the space with no space in the full name (JS library)

    // The following line of code is replaced by the 'formLayoutsPage' fixture in 'test-options.ts'
    //await pm.navigateTo().formLayoutsPage()

    // Replace 'pm' with the 'pageManager' fixture
    //await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'Welcome1', 'Option 2')
    //await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
    await pageManager.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'Welcome1', 'Option 2')
    await pageManager.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
})