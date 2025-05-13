import { test as base } from '@playwright/test'
import { PageManager } from './page-objects/pageManager'

export type TestOptions = {
    globalsQaURL: string
    formLayoutsPage: string // fixture
    pageManager: PageManager
}

export const test = base.extend<TestOptions>({
    globalsQaURL: ['', { option: true }], // Here you can put an empty string or a default value, we will use the empty string as a placeholder and we will override the value of globalsQaURL later, in playwright.config.ts

    // fixture # 1
    formLayoutsPage: /*[*/ async({ page }, use) => { // the [ is commented out because { auto: true } is commented out below (we want { auto: true } if we are not using a dependency)
        await page.goto('/')
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
        await use('') // use() will activate this feature, anything after is will execute after the test has completed
        console.log('Tear Down')
    // The following line is commented out to demonstrate a dependency (we don't want to use '{ auto: true }' in that case )
    //}, { auto: true }], // this tells Playwright to automatically initialize formLayoutsPage as the very first thing when the test is run (with this, we can remove it from the parameters of the test)
    },

    // fixture # 2
    //pageManager: async({ page }, use) => { // no dependency
    pageManager: async({ page, formLayoutsPage }, use) => { // with dependency - now, the pageManager fixture will trigger the formLayoutsPage fixture
        const pm = new PageManager(page) // this line is responsible for building the page manager object
        await use(pm) // use() will activate this feature
    }
})

// Now, we need to import this into playwright.config.ts