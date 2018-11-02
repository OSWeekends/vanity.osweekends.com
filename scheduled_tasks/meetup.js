const puppeteer = require('puppeteer');

async function meetupInfo(goblinDB) {
    console.time("[Meetup Scraper]");
    console.log("[Meetup Scraper] Has started");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.meetup.com/es-ES/Open-Source-Weekends');
    console.log("[Meetup Scraper] Step 1: Gathering data (Members & next Event)...");
    const data = {};
    data.total_members = await page.evaluate(() => {
        return parseInt(document.querySelector(".groupHomeHeaderInfo-memberLink").innerText.replace(".", ""), 10);
    });

    data.next_events = await page.evaluate(() => {
        return document.querySelectorAll(".groupHome-nextMeetup .card").length;
    });

    console.log("[Meetup Scraper] Step 2: Gathering data (Previous Events)...");
    await page.goto('https://www.meetup.com/es-ES/Open-Source-Weekends/events/past/');
    data.previous_events = await page.evaluate(async () => {
        let data;
        await new Promise((resolve, reject) => {
            try {
                let lastScroll = 0;
                const interval = setInterval(() => {

                    const totalTop = document.querySelector(".eventList").getBoundingClientRect().top;
                    const itemHeight = parseInt(getComputedStyle(document.querySelector(".eventList")).getPropertyValue("height"), 10);
                    const scrollTop = document.documentElement.scrollTop;

                    if (scrollTop !== 0 && scrollTop === lastScroll) {
                        const pastEvents = document.querySelectorAll(".list--infinite-scroll > li");
                        data = pastEvents.length;
                        resolve();

                        clearInterval(interval);
                    } else {
                        window.scrollBy(0, totalTop + itemHeight);
                        lastScroll = scrollTop;
                    }
                }, 1000);
            } catch (err) {
                console.log(err);
                reject(err.toString());
            }
        });
        return data;
    });
    
    data.generation_date = new Date().getTime();
    console.log("[Twitter Scraper] Has finished");
    goblinDB.set(data, "meetup");
    await browser.close();
    console.timeEnd("[Meetup Scraper]");
}

module.exports = {meetupInfo};
