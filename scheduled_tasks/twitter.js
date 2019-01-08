const puppeteer = require('puppeteer');
const config = require('../config');

async function twitterInfo (goblinDB) {
    console.time("[Twitter Scraper]");
    console.log("[Twitter Scraper] Has started");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://twitter.com/${config.twitter.user}`);

    const relevantInfo = await page.evaluate(() => {
        function parseSelectorData (slctr) {
            return parseInt(document.querySelector(slctr).getAttribute("data-count"), 10);
        }
        return {
            tweets: parseSelectorData(".ProfileNav-item--tweets .ProfileNav-value"),
            following: parseSelectorData(".ProfileNav-item--following .ProfileNav-value"),
            followers: parseSelectorData(".ProfileNav-item--followers .ProfileNav-value"),
            likes: parseSelectorData(".ProfileNav-item--favorites .ProfileNav-value")
        };
    });
    
    console.log("[Twitter Scraper] Has finished");
    relevantInfo.generation_date = new Date().getTime();
    goblinDB.set(relevantInfo, "twitter");
    await browser.close();
    console.timeEnd("[Twitter Scraper]");
}

module.exports = {twitterInfo};