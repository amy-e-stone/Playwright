// TESTS STRUCTURE

// import test method from the playwright library
import { test } from '@playwright/test'

// call the test method - this is the body of the test
// test() can accept 2 parameters - (name of test, () => {}) The second parameter is a function with the JS fat arrow syntax.

test('the example1 test', () => {}) // we can put as many as these as we want within a test file

// to group the test functions we can use test.describe('<any description you want>', () => {}), and place each test (above) inside

test.describe('test suite 1', () => {

    test('the first test', () => {

    })

    test('the second test', () => {

    })

    test('the third test', () => {

    })

})

test('the example2 test', ({page}) => { // need to pass the playwright page fixture which is the blank page of the browser (in order to run the test, we need to open a new browser)
    //page.goto('/') // if we hover over 'goto' we can see that it returns a promise, so this line will throw an error.
    //await page.goto('/') // we can use the keyword await, but it must be used in an asynchronous function
}) 

// in order to make the function asynchronous, we need to use the keyword 'async'
test('the first test1', async ({page}) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})

// **make sure that you check what the playwright function is returning, some are a promise and we must use await, some do not** //



// HOOKS & FLOW CONTROL

test('navigate to date picker page1', async ({page}) => {
    await page.goto('/')
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()
})

// since we have repetitive code in 'the first test' and 'navigate to date picker', we can use hooks with the .beforeEach method

//test.beforeEach(async ({page}) => { // there is also an 'after' that you can use. An example is using '.afterAll' when you want to delete test data that has been inserted to a database
//    await page.goto('/')
//    await page.getByText('Forms').click()
//})

test('the first test', async ({ page }) => {
    await page.getByText('Form Layouts').click()
})

test('navigate to date picker page', async ({ page }) => {
    await page.getByText('Datepicker').click()
})

// we can make a test suite as shown before, and have a higher level '.beforeEach' - on line 55
// each suite can have it's own '.beforeEach' as well

test.beforeEach(async ({ page }) => { // there is also an 'after' that you can use. An example is using '.afterAll' when you want to delete test data that has been inserted to a database
    await page.goto('/')
})

test.describe('suite1', () => {
    test.beforeEach(async ({ page }) => {
        //await page.goto('/')
        await page.getByText('Charts', { exact: true }).click() // Here, we must use the 'exact' option because the page also consists of other text that matches "Chart" -"ECharts"
    })

    test('the first test', async ({ page }) => {
        await page.getByText('ECharts').click()
    })
})

test.describe('suite2', () => {
    test.beforeEach(async ({ page }) => {
        //await page.goto('/')
        await page.getByText('Forms').click()
    })

    test('the first test', async ({ page }) => {
        await page.getByText('Form Layouts').click()
    })
    
    test('navigate to date picker page', async ({ page }) => {
        await page.getByText('Datepicker').click()
    })

})












