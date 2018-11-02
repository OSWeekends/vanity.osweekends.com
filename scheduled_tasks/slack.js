const puppeteer = require('puppeteer');
const config = require('../config');

function delay(timeout) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}

async function slackInfo(goblinDB) {
    console.time("[Slack Scraper]");
    console.log("[Slack Scraper] Has started");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    console.log("[Slack Scraper] Step 1: Access to Slack...");
    await page.goto('https://osweekends.slack.com/');
    await delay(7000);
    
    console.log("[Slack Scraper] Step 2: Login in Slack...");
    await page.type('#email', config.slack.user);
    await page.type('#password', config.slack.pass);
    await page.click('#signin_btn');
    await delay(7000);
    
    console.log("[Slack Scraper] Step 3: Redirect to stats and retrive data....");
    let data; 
    page.on("response", async response => {
      const url = response.url();
      if (url.match(/^https:\/\/osweekends\.slack\.com\/api\/team\.stats\.timeSeries.*/)) {
          const body = await response.text();
          const json = JSON.parse(body);
          data = json.stats;
      }
    });
    await page.goto('https://osweekends.slack.com/stats#overview');
    await delay(7000);

    const lastestData = data[data.length - 1];
    const latestSnapshot = {
      generation_date: new Date().getTime(),
      date: lastestData.ds,
      users: {
          active_readers: lastestData.readers_count_1d,
          active_writers: lastestData.writers_count_1d,
          total: lastestData.full_members_count,
          guest: lastestData.guests_count
      },
      dicussion: {
          messages_total: lastestData.messages_count,
          channels_total: lastestData.channels_count,
          open_channels_percentage: lastestData.cursor_marks_percentage_1d,
          open_channels_total: lastestData.cursor_marks_channels_count_1d,
          private_channels_percentage: lastestData.chats_channels_count_percentage_1d,
          private_channels_total: lastestData.chats_channels_count_1d,
          dm_percentage: lastestData.cursor_marks_dms_percentage_1d,
          dm_total: lastestData.cursor_marks_dms_count_1d
      }
    };
    
    goblinDB.set(latestSnapshot, "slack");
    await browser.close();
    console.log("[Slack Scraper] Has finished");
    console.timeEnd("[Slack Scraper]");
}

module.exports = {slackInfo};