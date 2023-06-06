import { expect, test, describe, vi, beforeAll, afterAll } from 'vitest'
import { chromium, firefox, webkit } from "playwright";
import { getAbsolutePath } from './absolutePath.js'

const browserTypes = process.env.ALL_BROWSERS
    ? [chromium, firefox, webkit]
    : [chromium];

for (const browserType of browserTypes) {
    describe(`browser:${browserType.name()}`, () => {
        let browser;
        const fullPath = getAbsolutePath("../tasks/custom-events.html");

        beforeAll(async () => {
            browser = await browserType.launch({ headless: true });
        });

        afterAll(async () => {
            browser?.close();
        });

        test("pressing increase", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("div");

            await page.click("#add");

            const value = await page.evaluate(async () => {
                return document.getElementById("show").innerText;
            });

            expect(value).toEqual("1");
        });

        test("pressing decrease", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("div");

            await page.click("#sub");

            const value = await page.evaluate(async () => {
                return document.getElementById("show").innerText;
            });

            expect(value).toEqual("-1");
        });
    });
}