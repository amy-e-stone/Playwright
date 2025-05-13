/* NOTE: This is the recommended way of keeping locators out of the class functions. There are some drawbacks to this that can
ake the code very hard to read once many locators are added. It increases the chance that another developer can add a locator
hat already exists with a different name, and also increases the chance of dead locators that are never used. There is also the
ssue of passing a parameter through to a locator inside of the function (see the helper function below), this locator cannot be
emoved from the function or the code will throw an error. This results in having locators both outside and inside the class functions,
hich makes troubleshooting difficult. */

import { Page, Locator } from "@playwright/test";

export class NavigationPage {

    // field (this is like an instance variable in Java or C++)
    readonly page: Page
    // it is recommended that all locators should be placed outside of the methods
    readonly formLayoutsMenuItem: Locator // Locator type was imported from the library on line 1
    readonly datePickerMenuItem: Locator
    readonly smartTabMenuItem: Locator
    readonly toastrMenuItem: Locator
    readonly tooltipMenuItem: Locator

    // the parameter is how TS determines the type (the parameter 'page' has a type of 'Page')
    constructor(page: Page){
        // assign the parameter, 'this' refers to this instance of the page that was passed as a parameter
        // we can now use this as our instance variable on line 6
        this.page = page
        // it is recommended that all locators should be placed outside of the methods
        this.formLayoutsMenuItem = page.getByText('Form Layouts')
        this.datePickerMenuItem = page.getByText('Datepicker')
        this.smartTabMenuItem = page.getByText('Smart Table')
        this.toastrMenuItem = page.getByText('Toastr')
        this.tooltipMenuItem = page.getByText('Tooltip')

    }

    async formLayoutsPage () {
        //await this.page.getByText('Forms').click() // moved this functionality into the helper method which checks to see if a menu item is already open 
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutsMenuItem.click()
    }

    async datepickerPage () {
        //await this.page.getByText('Forms').click()
        await this.selectGroupMenuItem('Forms')
        await this.datePickerMenuItem.click()
    }

    async smartTablePage () {
        //await this.page.getByText('Tables & Data').click()
        await this.selectGroupMenuItem('Tables & Data')
        await this.smartTabMenuItem.click()
    }

    async toastrPage () {
        //await this.page.getByText('Modal & Overlays').click()
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.toastrMenuItem.click()
    }

    async tooltipPage () {
        //await this.page.getByText('Modal & Overlays').click()
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.tooltipMenuItem.click()
    }

    // Helper method to only click a menu item if it is closed and not already expanded
    // Since this method will be used only by other methods in this file, we want to make it private (not visible outside of this class)
    private async selectGroupMenuItem(groupItemTitle: string){
        const groupMenuItem = this.page.getByTitle(groupItemTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if (expandedState == "false") {
            // expands the menu
            await groupMenuItem.click()
        }
    }
}