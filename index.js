import puppeteer from "puppeteer";

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

export const all = async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--disable-setuid-sandbox"],
        "ignoreHTTPSErrors": true
    });
 
    const getEmojis = async (browser, url) => {
        let page = await browser.newPage();
        console.log(`Downloading emojis from ${url}...`);
        await page.goto(url);
        await page.waitForSelector(".emoji-list");

        const emojis = await page.$$eval("ul.emoji-list > li", links => {
            links = links.map(el => el.querySelector("a").textContent);
            return links;
        });
        return emojis; 
    };

    const promises = urls.map(url => getEmojis(browser, url));
    const result = await Promise.all(promises);
    await browser.close();

    return result.flat();
};

export default {
    all,
};
