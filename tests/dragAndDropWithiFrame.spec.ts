// Instead of importing test from the playwright library directly, we will import from the test-options file
//import { test, expect } from '@playwright/test'
import { expect } from '@playwright/test'
import { test } from '../test-options'

test('drag and drop with iframe', async({ page, globalsQaURL }) => { // now, we can add a second fixture which is the environment varialbe for globalsqa
    await page.goto(globalsQaURL)

    // an iFrame is like a website inside of a website (nested html)
    // we must define where that is first with the page locator
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe')

    // use 'frame.locator' instead of 'page.locator' when locating an element inside the iFrame
    await frame.locator('li', { hasText: "High Tatras 2" }).dragTo(frame.locator('#trash'))

    // for more precise control using the mouse
    await frame.locator('li', { hasText: "High Tatras 4" }).hover()
    // left-click on the element
    await page.mouse.down()
    // move the mouse in the direction where we want to drop the element
    await frame.locator('#trash').hover()
    // release the mouse button
    await page.mouse.up()

    // assertion to validate that those elements are contained in the trash
    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})