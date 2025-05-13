import { Page } from "@playwright/test";
import { HelperBase } from "./helperBase";

// For notes on class layout, see navigationPage.ts
// For notes on extends keyword, and why we do not need the field varialbe anymore, see navigationPage.ts

export class FormLayoutsPage extends HelperBase {

    //private readonly page: Page

    constructor(page: Page) {
        super(page)
    }

    async submitUsingTheGridFormWithCredentialsAndSelectOption(email: string, password: string, optionText: string) {
        // locator for the 'Using the Grid' form
        const usingTheGridForm = this.page.locator('nb-card', { hasText: "Using the Grid" })

        // locate and fill the email and password input fields
        await usingTheGridForm.getByRole('textbox', { name: "Email" }).fill(email)
        await usingTheGridForm.getByRole('textbox', { name: "Password" }).fill(password)

        // locate and check the first option radio button
        await usingTheGridForm.getByRole('radio', { name: optionText }).check({ force: true })

        // locate and click the submit button
        await usingTheGridForm.getByRole('button').click()
    }

    // Just type "/**" + Enter directly before a method for it to automatically list the params
    // You can put a description after the first * and after each param (start with a -), that will serve as a tooltip where ever this method is used

    /**
     * This method will fill out the Inline form with user details
     * @param name - should be first and last name
     * @param email - valid email fot he test user
     * @param rememberMe - true or false if user session should be saved
     */
    async submitInlineFormWithNameEmailAndCheckbox(name: string, email: string, rememberMe: boolean) {
        // locator for the 'Using the Grid' form
        const inlineForm = this.page.locator('nb-card', { hasText: "Inline form" })

        // locate and fill the email and password input fields
        await inlineForm.getByRole('textbox', { name: "Jane Doe" }).fill(name)
        await inlineForm.getByRole('textbox', { name: "Email" }).fill(email)

        // ensures that the checkbox is only checked if rememberMe is true
        if (rememberMe) {
            await inlineForm.getByRole('checkbox').check({ force: true })
            await inlineForm.getByRole('button').click()
        }
    }
}