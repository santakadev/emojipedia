import puppeteer from "puppeteer";
import * as fs from "fs";

const emojipedia = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--disable-setuid-sandbox"],
        "ignoreHTTPSErrors": true
    });

    const urls = [
        "https://emojipedia.org/people/",
        "https://emojipedia.org/nature/",
        "https://emojipedia.org/food-drink/",
        "https://emojipedia.org/activity/",
        "https://emojipedia.org/travel-places/",
        "https://emojipedia.org/objects/",
        "https://emojipedia.org/symbols/",
        "https://emojipedia.org/flags/",
    ];
 
    const getEmojis = async (browser, url) => {
        let page = await browser.newPage();
        console.log(`Navigating to ${url}...`);
        await page.goto(url);
        await page.waitForSelector(".emoji-list");

        const emojis = await page.$$eval("ul.emoji-list > li", links => {
            links = links.map(el => el.querySelector("a").textContent);
            return links;
        });
        return emojis; 
    };

    let allEmojis = [];
    for (const url of urls) {
        const emojis = await getEmojis(browser, url);
        allEmojis = allEmojis.concat(emojis);
    }

    await browser.close();

    return allEmojis;
};


const emojis = await emojipedia();
const writer = fs.createWriteStream("/home/dani/emojis.txt");
emojis.forEach(emoji => writer.write(`${emoji}\n`));
writer.close();
