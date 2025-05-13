import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

export class NavigationPage extends HelperBase { 

    // see comments below and specifically line 21 as to why this was commented out
    // field (this is like an instance variable in Java or C++)
    //readonly page: Page

    // extends HelperBase broke the constructor because the page instance of the helper base is conflicting with the existing page instance
    // we will need to use the instance of a page that belongs to the helper base
    // to correct this broken code ...

    // the parameter is how TS determines the type (the parameter 'page' has a type of 'Page')
    //constructor(page: Page){
        // assign the parameter, 'this' refers to this instance of the page that was passed as a parameter
        // we can now use this as our instance variable on line 7
    //    this.page = page
    //}

    // .. we need to use the keyword super. We can delete 'readonly page: Page' on line 7 because we are using the page instance from HelperBase
    constructor(page: Page){
        super(page)
    }

    // now we can use the 'waitForNumberOfSeconds(timeInSeconds: number)' method from HelperBase (see line 32)

    async formLayoutsPage () {
        //await this.page.getByText('Forms').click() // moved this functionality into the helper method which checks to see if a menu item is already open 
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Form Layouts').click()
        // from HelperBase class
        await this.waitForNumberOfSeconds(2)
    }

    async datepickerPage () {
        //await this.page.getByText('Forms').click()
        await this.selectGroupMenuItem('Forms')
        await this.page.getByText('Datepicker').click()
    }

    async smartTablePage () {
        //await this.page.getByText('Tables & Data').click()
        await this.selectGroupMenuItem('Tables & Data')
        await this.page.getByText('Smart Table').click()
    }

    async toastrPage () {
        //await this.page.getByText('Modal & Overlays').click()
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Toastr').click()
    }

    async tooltipPage () {
        //await this.page.getByText('Modal & Overlays').click()
        await this.selectGroupMenuItem('Modal & Overlays')
        await this.page.getByText('Tooltip').click()
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