import { expect, test, describe, vi, beforeAll, afterAll } from 'vitest'
import { chromium, firefox, webkit } from "playwright";
import { getAbsolutePath } from './absolutePath.js'

const browserTypes = process.env.ALL_BROWSERS
    ? [chromium, firefox, webkit]
    : [chromium];

for (const browserType of browserTypes) {
    describe(`browser:${browserType.name()}`, () => {
        let browser;
        const fullPath = getAbsolutePath("../tasks/more-events.html");

        beforeAll(async () => {
            browser = await browserType.launch({ headless: true });
        });

        afterAll(async () => {
            browser?.close();
        });

        test("Clicking Box1", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("div");

            const colorBeforeClick = await page.evaluate(async () => {
                return window.getComputedStyle(document.getElementById("box1")).backgroundColor;
            })
            expect(colorBeforeClick).toBe("rgb(211, 211, 211)");

            await page.click("#box1");

            const colorAfterClick = await page.evaluate(async () => {
                return window.getComputedStyle(document.getElementById("box1")).backgroundColor;
            })

            expect(colorAfterClick).toBe("rgb(0, 0, 255)");
        });

        test("Hovering Box2", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("div");
            
            const widthBeforeHover = await page.evaluate(async () => {
                return window.getComputedStyle(document.getElementById("box2")).width;
            })

            expect(widthBeforeHover).toBe("100px");

            await page.hover("#box2");

            const widthAfterHover = await page.evaluate(async () => {
                return window.getComputedStyle(document.getElementById("box2")).width;
            })

            expect(widthAfterHover).toBe("200px");

            await page.hover("#box3");

            const widthAfterHover2 = await page.evaluate(async () => {
                return window.getComputedStyle(document.getElementById("box2")).width;
            })

            expect(widthAfterHover2).toBe("100px");
        })

        test("Pressing any key (Box3)", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("div");
            
            const colorBeforePress = await page.evaluate(async () => {
                return window.getComputedStyle(document.getElementById("box3")).backgroundColor;
            })

            expect(colorBeforePress).toBe("rgb(211, 211, 211)");

            await page.keyboard.down("a");

            const colorAfterPress = await page.evaluate(async () => {
                return window.getComputedStyle(document.getElementById("box3")).backgroundColor;
            })

            expect(colorAfterPress).toBe("rgb(0, 128, 0)");

            await page.keyboard.up("a");

            const colorAfterRelease = await page.evaluate(async () => {
                return window.getComputedStyle(document.getElementById("box3")).backgroundColor;
            })

            expect(colorAfterRelease).toBe("rgb(211, 211, 211)");
        })

        test("Pressing D key (Box4)", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("div");
            
            const colorBeforePress = await page.evaluate(async () => {
                return window.getComputedStyle(document.getElementById("box4")).backgroundColor;
            })

            expect(colorBeforePress).toBe("rgb(211, 211, 211)");

            await page.keyboard.down("a");

            const colorAfterPress = await page.evaluate(async () => {
                return window.getComputedStyle(document.getElementById("box4")).backgroundColor;
            })

            expect(colorAfterPress).toBe("rgb(211, 211, 211)");

            await page.keyboard.up("a");
            await page.keyboard.down("d");

            const colorAfterCorrectPress = await page.evaluate(async () => {
                return window.getComputedStyle(document.getElementById("box4")).backgroundColor;
            })

            expect(colorAfterCorrectPress).toBe("rgb(255, 255, 0)");

            await page.keyboard.up("d");

            const colorAfterCorrectRelease = await page.evaluate(async () => {
                return window.getComputedStyle(document.getElementById("box4")).backgroundColor;
            })

            expect(colorAfterCorrectRelease).toBe("rgb(211, 211, 211)");

        })
    });
}