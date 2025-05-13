import { Page, expect } from "@playwright/test"
import { NavigationPage } from '../page-objects/navigationPage'
import { FormLayoutsPage } from '../page-objects/formLayoutsPage'
import { DatepickerPage } from '../page-objects/datepickerPage'

export class PageManager {

    // Page is a built-in class type in Playwright
    private readonly page: Page
    // NOTE: When we create classes within TypeScript, the class becomes a class type, much like a variable type
    private readonly navigationPage: NavigationPage
    private readonly formLayoutsPage: FormLayoutsPage
    private readonly datepickerPage: DatepickerPage

    constructor(page: Page) {
        this.page = page
        // we need to pass the page fixture into the navigation page object
        // but instead of passing just 'page', we need to pass the page fixture related to the page object manager, which is 'this.page'
        this.navigationPage = new NavigationPage(this.page)
        this.formLayoutsPage = new FormLayoutsPage(this.page)
        this.datepickerPage = new DatepickerPage(this.page)
    }

    // Methods that will return the instances of all of the page objects
    navigateTo() {
        return this.navigationPage
    }

    onFormLayoutsPage() {
        return this.formLayoutsPage
    }

    onDatepickerPage() {
        return this.datepickerPage
    }

}