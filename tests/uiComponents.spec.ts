// UI COMPONENTS
import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.describe('Form Layouts page @block', () => {
    test.describe.configure({ retries: 0 }) // disables retrying failed tests in this describe block
    test.describe.configure({ mode: 'serial' }) // forces tests in this block to run sequentially (not in parallel)

    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('input fields', async ({ page }) => {
        // locator for the email input field
        const usingTheGridEmailInput = page.locator('nb-card', { hasText: "Using the Grid" }).getByRole('textbox', { name: "Email" })

        // to type something into the input field
        await usingTheGridEmailInput.fill('test@test.com')

        // to clear something from the input field (cannot chain .clear() to the previous line)
        await usingTheGridEmailInput.clear()

        // to type something into the input field and simulate the strokes of the keyboard (delay of 1/2 sec bewtween strokes)
        await usingTheGridEmailInput.pressSequentially('test2@test.com', { delay: 500 });

        // generic assertion
        // to extract the text from the input field use .inputValue()
        const inputValue = await usingTheGridEmailInput.inputValue()
        expect(inputValue).toEqual('test2@test.com')

        // locator assertion
        await expect(usingTheGridEmailInput).toHaveValue('test2@test.com')
    })

    test.only('radio buttons', async ({ page }) => { // we are only running this test
        // locator for the 'Using the Grid' form
        const usingTheGridForm = page.locator('nb-card', { hasText: "Using the Grid" })

        // to locate and click on the first radio button (2 ways)
        //await usingTheGridForm.getByLabel('Option 1').check({ force: true }) // we need to override 'visually-hidden' in the html by passing 'force'
        await usingTheGridForm.getByRole('radio', { name: "Option 1"}).check({ force: true })

        // to see the status of the radio button (selected or not)
        const radioStatus = await usingTheGridForm.getByRole('radio', { name: "Option 1"}).isChecked() // returns boolean

        // Visual Testing
        // create a snapshot of the web element that we are making an assertion on (see uiComponents.spec.ts-snapshots)
        // the first time this is run, there will be an error saying that there is nothing to compare the snapshot to, this is ok
        // the second time this is run, the current snapshot will be compared to the previous one
        // if we change "Option 1" to "Option 2" above, the test will fail and there will be additional screenshots generated under the new 'uiComponents-Form-Layouts-page-block-radio-buttons-chromium' folder under 'test-results'
        // these results can also be viewed in the html report with a slider that shows the difference in screenshots
        await expect(usingTheGridForm).toHaveScreenshot()
        // we can also set the maximum difference in pixels to set the precision
        //await expect(usingTheGridForm).toHaveScreenshot({ maxDiffPixels: 250 })

        // The following was commented out for the 'Visual Testing' lesson
        // generic assertion
        //expect(radioStatus).toBeTruthy()

        // locator assertion
        //await expect(usingTheGridForm.getByRole('radio', { name: "Option 1"})).toBeChecked()

        // to select the 2nd radio button 'Option 2' and then validate that after we select it, 'Option 1' should not be checked
        //await usingTheGridForm.getByRole('radio', { name: "Option 2"}).check({ force: true })
        // generic assertion
        //expect(await usingTheGridForm.getByRole('radio', { name: "Option 1"}).isChecked()).toBeFalsy()
        //expect(await usingTheGridForm.getByRole('radio', { name: "Option 2"}).isChecked()).toBeTruthy()
    })
})

test('checkboxes', async({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Toastr').click()

    // to click on the checkbox "Hide on click"
    //await page.getByRole('checkbox', { name: "Hide on click" }).click({ force: true })

    //** Note that the .click() method will just click on the checkbox and uncheck it, it does NOT check the status **//
    //** Note that the .check() method will check the status of the checkbox, if the box is already checked, it will NOT uncheck the box **//
    
    await page.getByRole('checkbox', { name: "Hide on click" }).uncheck({ force: true })
    await page.getByRole('checkbox', { name: "Prevent arising of duplicate toast" }).check({ force: true })

    // to select or unselect all checkboxes on the page
    const allBoxes = page.getByRole('checkbox')

    //** Note that allBoxes represent the locator of the 3 elements, this is not an array **//
    // to convert them into an array, use .all() method
    // RECALL that to loop through an array, we use for...of loops

    // to select all of the checkboxes
    for(const box of await allBoxes.all()) {
        await box.check({ force: true })
        expect(await box.isChecked()).toBeTruthy()
    }

    // to unselect all of the checkboxes
    for(const box of await allBoxes.all()) {
        await box.uncheck({ force: true })
        expect(await box.isChecked()).toBeFalsy()
    }
})

test('lists and dropdowns', async({ page }) => {
    // to expand the dropdown menu at the top of the page (color theme selection)
    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()

    // to select items from the list (2 ways)
    page.getByRole('list') // use when the list has a UL tag
    page.getByRole('listitem') // use when the list has a LI tag

    // 'list' is the parent, 'nb-option' is the child (2 ways)
    //const optionList = page.getByRole('list').locator('nb-option')
    const optionList = page.locator('nb-option-list nb-option') // same result as above, but this way is more compact

    // we can pass an array of texts that are expected to be in the drop down list
    await expect(optionList).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])

    // to select the Cosmic theme
    await optionList.filter({ hasText: "Cosmic" }).click()

    // to validate that the background has changed to a certain color
    //** Look at the styles and properties section to the right in devtools and grab the RGB background color (in Cosmic theme) **//
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    // to valdidate all of the color themes
    // create an object for each color theme
    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    }

    await dropDownMenu.click() // open the dropdown list
    // RECALL that to loop through an object, we use for...in loops
    // loop through the elements in the object
    for (const color in colors) {
        await optionList.filter({ hasText: color }).click()
        await expect(header).toHaveCSS('background-color', colors[color])
        if (color != "Corporate") {
            await dropDownMenu.click() // open the dropdown menu again for the next object
        } // else the loop will end with a closed list
    }
})

test('tooltips', async({ page }) => {
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Tooltip').click()

    const toolTipCard = page.locator('nb-card', { hasText: "Tooltip Placements" })
    await toolTipCard.getByRole('button', { name: "Top" }).hover() // hovers the mouse over the button

    //page.getByRole('tooltip') // can use this only if you have a role tooltip created in the html (this is not the case for our example so we cannot use it)
    const tooltip = await page.locator('nb-tooltip').textContent() // this grabs the text
    expect(tooltip).toEqual('This is a tooltip')
})

test('dialog box', async({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // we want to click the 1st trashcan icon to delete the row, but we need a listener for a browser dialog box (see notes)
    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    // locator for the trashcan icon
    await page.getByRole('table').locator('tr', { hasText: "mdo@gmail.com" }).locator('.nb-trash').click()

    // validate that it has been deleted
    await expect(page.locator('table tr').first()).not.toHaveText('')
})

test('web tables', async({ page }) => {
    await page.getByText('Tables & Data').click()
    await page.getByText('Smart Table').click()

    // [1] -> get the row by any unique text in this row
    // to find the 3rd row of the table and modify the age of the user
    const targetRow = page.getByRole('row', { name: "twitter@outlook.com" })
    // click on the pencil icon to edit the row
    await targetRow.locator('.nb-edit').click()
    // modify the age - NOTE that we cannot use targetRow now, because when we clicked the pencil icon, the e-mail changed from text to an input property
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    // click the checkmark to confirm the change
    await page.locator('.nb-checkmark').click()

    // to select a row by the ID column ...
    // ** this could pose as a porblem because the number in the ID column could match a number in the Age column ** //

    // [2] -> get the row based on the value in the specific column
    // to navigate to the second page of the table and update the user email with ID 11
    // to go to page 2
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    // to get to the user with ID 11
    //const targetRowByID = page.getByRole('row', { name: "11" }) // this will find 2 rows and throw an error, we need to filter those 2 rows
    const targetRowByID = page.getByRole('row', { name: "11" }).filter({ has: page.locator('td').nth(1).getByText('11') })
    // this filter .locator('td') will return all columns for each of those 2 rows
    // .nth(1) takes only the first column from the 2 rows
    // getByText('11') finds only the coloumn that has the text 11
    await targetRowByID.locator('.nb-edit').click()
    // modify the email
    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    // click the checkmark to confirm the change
    await page.locator('.nb-checkmark').click()
    // assertion to validate that we successfully made the change
    // NOTE that we can use targetRowByID again because it has changed from an input property back to text
    // locator('td') -> finds all columns in the row
    // E-mail is the 5th col in this row
    await expect(targetRowByID.locator('td').nth(5)).toHaveText('test@test.com')

    // [3] -> loop through the table rows and make a validation on them
    // identify the test data we want to use
    const ages = ["20", "30", "40", "200"]

    // try each of these values in the search field
    for ( let age of ages ) {
        // type the current value into the input field
        await page.locator('input-filter').getByPlaceholder('Age').clear()
        await page.locator('input-filter').getByPlaceholder('Age').fill(age)

        await page.waitForTimeout(500) // we need this delay because playwright runs faster than the search results to appear

        // locator for the rows that show up as the result output
        const ageRows = page.locator('tbody tr') // gives us all of the current rows inside of the table body

        // get all of the rows that show up for the current input and validate that they have the current value
        for ( let row of await ageRows.all() ) {
            // get a cell value for the current row
            const cellValue = await row.locator('td').last().textContent()
            if (age == "200") {
                expect(await page.getByRole('table').textContent()).toContain("No data found")
            } else {
                expect(cellValue).toEqual(age) // each row should be equal to the age tested
            }
        }
    }
})

test('datepicker', async({ page }) => {
    await page.getByText('Forms').click()
    await page.getByText('Datepicker').click()

    // find the locator for the date picker form
    const calendarInputField = page.getByPlaceholder('Form Picker')
    await calendarInputField.click()

    // select June 1st (or whatever the current month is when you are testing this)
    // NOTE that there can be duplicate dates in the calendar (they have different class names)

    //await page.locator('[class="day-cell ng-star-inserted"]').getByText('1').click() // this will not work if you select the 1st, because 1 is duplicated throughout the calendar
    //await page.locator('[class="day-cell ng-star-inserted"]').getByText('1', { exact: true }).click()
    // assertion
    //await expect(calendarInputField).toHaveValue('Mar 1, 2025') // you must change this to the current month you are testing!

    // make the date dynamic!
    let date = new Date() // JS object that can perform different operations with the current date and time, we can play around with this on MDN website
    date.setDate(date.getDate() + 3000)
    const expectedDate = date.getDate().toString()
    const expectedMonthShort = date.toLocaleString('En-US', { month: 'short'}) // "Short" because it is the short version of the month
    const expectedMonthLong = date.toLocaleString('En-US', { month: 'long'}) // we need the longer version of the month
    const expectedYear = date.getFullYear()
    const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`

    // if we have 'date.setDate(date.getDate() + 14)' for example, and that happens to end up in the next month, we need to adjust for that or else the test will fail
    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent() // get the text in the current datepicker selector
    const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}` // NOTE that there are spaces before and after the string as seen in the DevTools
    
    // if the calendar month and year does not match the expected month and year ...
    while(!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        // click to the next calendar page (right chevron)
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
        // get the text one more time
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
    }

    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click()
    await expect(calendarInputField).toHaveValue(dateToAssert)
})

test('sliders', async({ page }) => {
    // update the slider attribute -> in the DOM we can see the cx and cy coordinates change as we move the slider
    // here, we will move the slider as far as it will go and validate that the display shows 30 degrees
    
    // create the locator for the slider
    //const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')

    // get access to the x and y coordinates
    //await tempGauge.evaluate( node => {
    //    node.setAttribute('cx', '232.630')
    //    node.setAttribute('cy', '232.630')
    //})

    // we need to trigger the event that makes the value change, so far, we have just moved the circle
    //await tempGauge.click()

    // another way to do this is to simulate the actual mouse movement along the guage (this is more realistic)
    // create a locator for the area that we want to move the mouse
    // NOTE that the mouse does not have to be exactly on the circle to move the gauge so we can use the locator above, without 'circle'
    const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
    await tempBox.scrollIntoViewIfNeeded() // ensures that the entire box is diplayed on the page
    await tempBox.boundingBox() // define a bounding box -> playwright creates coordinates around the bounding box, you can define coordinates outside of it as well

    const box = await tempBox.boundingBox()

    // define the center of the bounding box and use it as a starting point
    const x = box.x + box.width / 2
    const y = box.y + box.height / 2

    // put the mouse cursor at the location we want to start from (the center as defined above)
    await page.mouse.move(x, y)

    // click the mouse button to begin movement (simulates left-click of the mouse)
    await page.mouse.down()

    // we want to move the mouse to the right - to move to the left it's 'move(x - 100, y)'
    await page.mouse.move(x + 100, y)
    // then we want to move the mouse down - to move to the left and down it's 'move(x + 100, y + 100)'
    await page.mouse.move(x + 100, y + 100)
    // after moving, we need to release the mouse button
    page.mouse.up()

    // assertion
    await expect(tempBox).toContainText('30')
})




























