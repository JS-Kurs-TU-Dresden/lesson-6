import { expect, test, describe, vi, beforeAll, afterAll } from 'vitest'
import { chromium, firefox, webkit } from "playwright";
import { getAbsolutePath } from './absolutePath.js'

const browserTypes = process.env.ALL_BROWSERS
    ? [chromium, firefox, webkit]
    : [chromium];

for (const browserType of browserTypes) {
    describe(`browser:${browserType.name()}`, () => {
        let browser;
        const fullPath = getAbsolutePath("../tasks/tables.html");

        beforeAll(async () => {
            browser = await browserType.launch({ headless: true });
        });

        afterAll(async () => {
            browser?.close();
        });

        test("viewing table", async () => {
            const page = await browser.newPage();
            await page.goto(`file://${fullPath}`);

            await page.waitForSelector("table");

            const data = await page.evaluate(async () => {
                const table = document.getElementById("table");

                const rows = table.getElementsByTagName("tr");

                const headings = Array.from(rows[0].getElementsByTagName("th")).map((heading) => heading.innerText.toLowerCase());

                const data = Array.from(rows).slice(1).map((row) => {
                    const cells = Array.from(row.getElementsByTagName("td"));
                    return cells.reduce((acc, cell, index) => {
                        acc[headings[index]] = index === 0 ? cell.innerText : Number(cell.innerText);
                        return acc;
                    }, {});
                });

                return data;
            })
            expect(data).toEqual([
                {
                    planet: "Mercury",
                    moons: 0,
                    diameter: 3031,
                    distance: 57.9
                },
                {
                    planet: "Venus",
                    moons: 0,
                    diameter: 7521,
                    distance: 108.2
                },
                {
                    planet: "Earth",
                    moons: 1,
                    diameter: 7926,
                    distance: 149.6
                },
                {
                    planet: "Mars",
                    moons: 2,
                    diameter: 4222,
                    distance: 227.9
                },
                {
                    planet: "Jupiter",
                    moons: 79,
                    diameter: 88846,
                    distance: 778.6
                },
                {
                    planet: "Saturn",
                    moons: 82,
                    diameter: 74898,
                    distance: 1433.5
                },
                {
                    planet: "Uranus",
                    moons: 27,
                    diameter: 31763,
                    distance: 2872.5
                },
                {
                    planet: "Neptune",
                    moons: 14,
                    diameter: 30775,
                    distance: 4495.1
                }
            ])
        });
    });
}