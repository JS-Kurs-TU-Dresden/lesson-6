import { expect, test, describe, vi, beforeAll, afterAll } from 'vitest'
import { chromium, firefox, webkit } from "playwright";
import { getAbsolutePath } from './absolutePath.js'

const browserTypes = process.env.ALL_BROWSERS
    ? [chromium, firefox, webkit]
    : [chromium];

for (const browserType of browserTypes) {
    describe(`browser:${browserType.name()}`, () => {
        let browser;
        const fullPath = getAbsolutePath("../tasks/lists.html");

        beforeAll(async () => {
            browser = await browserType.launch({ headless: true });
        });

        afterAll(async () => {
            browser?.close();
        });

        test("viewing first list", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("ul");

            const list = await page.evaluate(async () => {
                const list1 = document.getElementById("list1");

                const items = Array.from(list1.getElementsByTagName("li")).map((item) => item.innerText);
                
                return items;
            })

            expect(list).toEqual(["Dog", "Cat", "Bird", "Fish", "Lizard"]);
            
        });

        test("viewing second list", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("ol");

            const list = await page.evaluate(async () => {
                const list2 = document.getElementById("list2");

                const items = Array.from(list2.getElementsByTagName("li")).map((item) => item.innerText);
                
                return items;
            })

            expect(list).toEqual(["Apple", "Banana", "Orange", "Pear", "Grape"]);
            
        });
    });
}