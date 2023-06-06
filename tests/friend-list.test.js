import { expect, test, describe, vi, beforeAll, afterAll } from 'vitest'
import { chromium, firefox, webkit } from "playwright";
import { getAbsolutePath } from './absolutePath.js'

const browserTypes = process.env.ALL_BROWSERS
    ? [chromium, firefox, webkit]
    : [chromium];

for (const browserType of browserTypes) {
    describe(`browser:${browserType.name()}`, () => {
        let browser;
        const fullPath = getAbsolutePath("../tasks/friend-list.html");

        beforeAll(async () => {
            browser = await browserType.launch({ headless: true });
        });

        afterAll(async () => {
            browser?.close();
        });

        test("adding incorrect data", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("h2");

            await page.click("button");

            const value = await page.evaluate(async () => {
                return document.getElementById("friendList").innerHTML.trim();
            });

            expect(value).toEqual("");
        });

        test("adding a friend", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("h2");

            await page.locator("#name").fill("John");
            await page.locator("#email").fill("John@doe");

            await page.click("button");

            const value = await page.evaluate(async () => {
                return document.getElementById("friendList").innerHTML.trim();
            });

            expect(value).toEqual("<div><h3>John</h3><p>John@doe</p><button>Edit</button><button>Remove</button></div>");
        });

        test("removing a friend", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("h2");

            await page.locator("#name").fill("John");
            await page.locator("#email").fill("John@doe");

            await page.click("button");

            const value = await page.evaluate(async () => {
                return document.getElementById("friendList").innerHTML.trim();
            });

            expect(value).toEqual("<div><h3>John</h3><p>John@doe</p><button>Edit</button><button>Remove</button></div>");

            await page.click("button:has-text('Remove')");

            const value2 = await page.evaluate(async () => {
                return document.getElementById("friendList").innerHTML.trim();
            });

            expect(value2).toEqual("");
        });

        test("editing a friend", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("h2");

            await page.locator("#name").fill("John");
            await page.locator("#email").fill("John@doe");

            await page.click("button");

            const value = await page.evaluate(async () => {
                return document.getElementById("friendList").innerHTML.trim();
            });

            expect(value).toEqual("<div><h3>John</h3><p>John@doe</p><button>Edit</button><button>Remove</button></div>");

            await page.click("button:has-text('Edit')");

            await page.locator("#friendList > form > input").first().fill("Jane");
            await page.locator("#friendList > form > input").last().fill("Jane@doe");

            await page.click("button:has-text('Update')");

            const value2 = await page.evaluate(async () => {
                return document.getElementById("friendList").innerHTML.trim();
            });

            expect(value2).toEqual("<div><h3>Jane</h3><p>Jane@doe</p><button>Edit</button><button>Remove</button></div>");
        });

        test("cancel editing a friend", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("h2");

            await page.locator("#name").fill("John");
            await page.locator("#email").fill("John@doe");

            await page.click("button");

            const value = await page.evaluate(async () => {
                return document.getElementById("friendList").innerHTML.trim();
            });

            expect(value).toEqual("<div><h3>John</h3><p>John@doe</p><button>Edit</button><button>Remove</button></div>");

            await page.click("button:has-text('Edit')");

            await page.locator("#friendList > form > input").first().fill("Jane");
            await page.locator("#friendList > form > input").last().fill("Jane@doe");

            await page.click("button:has-text('Cancel')");

            const value2 = await page.evaluate(async () => {
                return document.getElementById("friendList").innerHTML.trim();
            });

            expect(value2).toEqual(value);
        });
    });
}