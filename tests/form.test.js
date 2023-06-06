import { expect, test, describe, vi, beforeAll, afterAll } from 'vitest'
import { chromium, firefox, webkit } from "playwright";
import { getAbsolutePath } from './absolutePath.js'

const browserTypes = process.env.ALL_BROWSERS
    ? [chromium, firefox, webkit]
    : [chromium];

for (const browserType of browserTypes) {
    describe(`browser:${browserType.name()}`, () => {
        let browser;
        const fullPath = getAbsolutePath("../tasks/form.html");

        beforeAll(async () => {
            browser = await browserType.launch({ headless: true });
        });

        afterAll(async () => {
            browser?.close();
        });

        test("using the form", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("form");

            let info = await page.evaluate(async () => {
                return document.getElementById("infoMessage").innerText
            });

            expect(info).toEqual("");

            await page.click("button");

            info = await page.evaluate(async () => {
                return document.getElementById("infoMessage").innerText
            });

            expect(info).toEqual("Name is required");

            await page.locator("#name").fill("John");
            await page.click("button");

            info = await page.evaluate(async () => {
                return document.getElementById("infoMessage").innerText
            });

            expect(info).toEqual("Email is required");

            await page.locator("#email").fill("John@doe.de");
            await page.click("button");

            info = await page.evaluate(async () => {
                return document.getElementById("infoMessage").innerText
            });

            expect(info).toEqual("Password is required");

            await page.locator("#password").fill("pw");
            await page.click("button");

            info = await page.evaluate(async () => {
                return document.getElementById("infoMessage").innerText
            });

            expect(info).toEqual("Confirm Password is required");

            await page.locator("#confirm").fill("pwf");
            await page.click("button");

            info = await page.evaluate(async () => {
                return document.getElementById("infoMessage").innerText
            });

            expect(info).toEqual("Password and Confirm Password must be same");

            await page.locator("#confirm").fill("pw");
            await page.click("button");

            info = await page.evaluate(async () => {
                return document.getElementById("infoMessage").innerText
            });

            expect(info).toEqual("Success");

            
        });
    });
}