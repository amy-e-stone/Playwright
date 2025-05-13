import { Page, expect } from "@playwright/test";
import { HelperBase } from "./helperBase";

// For notes on class layout, see navigationPage.ts
// For notes on extends keyword, and why we do not need the field varialbe anymore, see navigationPage.ts

export class DatepickerPage extends HelperBase {

    //private readonly page: Page

    constructor(page: Page) {
        super(page)
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number) {
        // find the locator for the date picker form and click
        const calendarInputField = this.page.getByPlaceholder('Form Picker')
        await calendarInputField.click()

        // assign what is returned from the helper method so we can use it here
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)

        // assertion
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    async selectDatepickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number) {
        // find the locator for the date picker form and click
        const calendarInputField = this.page.getByPlaceholder('Range Picker')
        await calendarInputField.click()

        // assign what is returned from the helper method so we can use it here
        const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)

        // create a new expected string from the results of the helper function
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`

        // assertion
        await expect(calendarInputField).toHaveValue(dateToAssert)
    }

    // Helper class function
    private async selectDateInTheCalendar (numberOfDaysFromToday: number) {
        let date = new Date() // JS object that can perform different operations with the current date and time, we can play around with this on MDN website
        date.setDate(date.getDate() + numberOfDaysFromToday)
        const expectedDate = date.getDate().toString()
        const expectedMonthShort = date.toLocaleString('En-US', { month: 'short'}) // "Short" because it is the short version of the month
        const expectedMonthLong = date.toLocaleString('En-US', { month: 'long'}) // we need the longer version of the month
        const expectedYear = date.getFullYear()
        const dateToAssert = `${expectedMonthShort} ${expectedDate}, ${expectedYear}`
    
        // if we have 'date.setDate(date.getDate() + 14)' for example, and that happens to end up in the next month, we need to adjust for that or else the test will fail
        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent() // get the text in the current datepicker selector
        const expectedMonthAndYear = ` ${expectedMonthLong} ${expectedYear}` // NOTE that there are spaces before and after the string as seen in the DevTools
        
        // if the calendar month and year does not match the expected month and year ...
        while(!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            // click to the next calendar page (right chevron)
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click()
            // get the text one more time
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent()
        }
        
        // must be modified because the locator for date RANGE is different
        //await this.page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, { exact: true }).click()
        // replace with -
        const dayCell = this.page.locator('[class="day-cell ng-star-inserted"]')
        const rangeCell = this.page.locator('[class="range-cell day-cell ng-star-inserted"]')
        if(await dayCell.first().isVisible()) {
            await dayCell.getByText(expectedDate, { exact: true }).click()
        } else {
            await rangeCell.getByText(expectedDate, { exact: true }).click()
        }

        return dateToAssert
    }
}