import puppeteer from "puppeteer"
import * as fs from "fs"

const run = async () => {
const browser = await puppeteer.launch({
    headless: false,
    args: ["--disable-setuid-sandbox"],
    'ignoreHTTPSErrors': true
});

const urls = [
    'https://emojipedia.org/people/',
    'https://emojipedia.org/nature/',
    'https://emojipedia.org/food-drink/',
    'https://emojipedia.org/activity/',
    'https://emojipedia.org/travel-places/',
    'https://emojipedia.org/objects/',
    'https://emojipedia.org/symbols/',
    'https://emojipedia.org/flags/',
]
const url = "https://emojipedia.org/people/";


const getEmojis = async (browser, url) => {
    return new Promise(async (resolve) => {
let page = await browser.newPage()
console.log(`Navigating to ${url}...`);
await page.goto(url);
await page.waitForSelector('.emoji-list');

        const emojis = await page.$$eval('ul.emoji-list > li', links => {
	        links = links.map(el => el.querySelector('a').textContent)
	        return links;
        });
        resolve(emojis) 
    })
}


const writer = fs.createWriteStream('/home/dani/emojis.txt')
for (const url of urls) {
const emojis = await getEmojis(browser, url)
emojis.forEach(emoji => writer.write(`${emoji}\n`));
}

writer.close()
await browser.close()
}


run()
