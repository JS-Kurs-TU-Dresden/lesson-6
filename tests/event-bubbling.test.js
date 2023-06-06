import { expect, test, describe, vi, beforeAll, afterAll } from 'vitest'
import { chromium, firefox, webkit } from "playwright";
import { getAbsolutePath } from './absolutePath.js'

const browserTypes = process.env.ALL_BROWSERS
    ? [chromium, firefox, webkit]
    : [chromium];

for (const browserType of browserTypes) {
    describe(`browser:${browserType.name()}`, () => {
        let browser;
        const fullPath = getAbsolutePath("../tasks/event-bubbling.html");

        beforeAll(async () => {
            browser = await browserType.launch({ headless: true });
        });

        afterAll(async () => {
            browser?.close();
        });

        test("pressing the root", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("div");

			await page.locator("body > div").hover( { position: { x: 1, y: 1 } })
			await page.mouse.down()

            const highlighted = await page.evaluate(async () => {
                return document.querySelector("div").outerHTML.split("\n").map(line => line.trim()).join("").replace(/\t/g, "");
            })

            expect(highlighted).toEqual(`<div class="highlight"><div><div></div></div><div><div><div></div></div></div></div>`);
            
        });

		test("pressing the yellow square", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("div");

			await page.locator("body > div > div > div > div").hover( { position: { x: 1, y: 1 } })
			await page.mouse.down()

            const highlighted = await page.evaluate(async () => {
                return document.querySelector("div").outerHTML.split("\n").map(line => line.trim()).join("").replace(/\t/g, "");
            })

            expect(highlighted).toEqual(`<div class="highlight"><div><div></div></div><div class="highlight"><div class="highlight"><div class="highlight"></div></div></div></div>`);
            
        });

		test("pressing the first blue square", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("div");

			await page.locator("body > div > div").first().hover( { position: { x: 1, y: 1 } })
			await page.mouse.down()

            const highlighted = await page.evaluate(async () => {
                return document.querySelector("div").outerHTML.split("\n").map(line => line.trim()).join("").replace(/\t/g, "");
            })

            expect(highlighted).toEqual(`<div class="highlight"><div class="highlight"><div></div></div><div><div><div></div></div></div></div>`);
            
        });
    });
}