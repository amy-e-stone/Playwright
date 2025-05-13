import { test, expect } from '@playwright/test'
import { PageManager } from '../page-objects/pageManager'
import { faker } from '@faker-js/faker'
// ** we can now remove all other imports for each page and just have the page manager ** //
// import { NavigationPage } from '../page-objects/navigationPage'
// import { FormLayoutsPage } from '../page-objects/formLayoutsPage'
// import { DatepickerPage } from '../page-objects/datepickerPage'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

// '@smoke' is a tag to run this test, as well as other test that have this tag - we can run it in the command line like this: npx playwright test --project=chromium --grep @smoke
// ... that command will run 'navigate to form page' and 'parametrized methods' on line 46
// we can also add another following it and use it in the same way like so: npx playwright test --project=chromium --grep @regression
// ... that command will run 'navigate to form page' only
// NOTE: To run multiple tags in Windows, the command would be npx playwright test --project=chromium --grep --% “@block^|@smoke”
test('navigate to form page @smoke @regression', async({ page }) => {
    // create a new instance of the page
    const pm = new PageManager(page)
    //const navigateTo = new NavigationPage(page) <- we can now get rid of this instance and just use the page manager

    // NOTE that the syntax has changed from what is was in usePageObjectsNOPAGEMANAGER.spec.ts
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
    await pm.navigateTo().smartTablePage()
    await pm.navigateTo().toastrPage()
    await pm.navigateTo().tooltipPage()
})

// ** The following test was commented out and repeated below it to demonstrate the implementation of fake data ** //
// test('parametrized methods', async({ page }) => {
//     const pm = new PageManager(page)
//     // ** we can now remove all other pages created and just have the page manager ** //
//     //const navigateTo = new NavigationPage(page)
//     //const onFormLayoutsPage = new FormLayoutsPage(page)
//     //const onDatepickerPage = new DatepickerPage(page)

//     // NOTE that the syntax has changed from what is was in usePageObjectsNOPAGEMANAGER.spec.ts
//     await pm.navigateTo().formLayoutsPage()
//     await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'Welcome1', 'Option 2')
//     await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox('John Smith', 'John@test.com', true)
//     await pm.navigateTo().datepickerPage()
//     await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(10)
//     await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6, 15)
// })

test('parametrized methods @smoke', async({ page }) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName() // this will return a random full name
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com` // replace the space with no space in the full name (JS library)

    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption('test@test.com', 'Welcome1', 'Option 2')
    await pm.onFormLayoutsPage().submitInlineFormWithNameEmailAndCheckbox(randomFullName, randomEmail, true)
    // await pm.navigateTo().datepickerPage()
    // await pm.onDatepickerPage().selectCommonDatePickerDateFromToday(10)
    // await pm.onDatepickerPage().selectDatepickerWithRangeFromToday(6, 15)
})

test('testing with argos ci', async({ page }) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.navigateTo().datepickerPage()
})

