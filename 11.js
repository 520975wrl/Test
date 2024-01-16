const axios = require('axios');
const puppeteer = require('puppeteer-core');

async function startBrowserAndPerformActions(userId) {
    try {
        // 启动 AdsPower 浏览器实例
        const res = await axios.get(`http://local.adspower.net:50325/api/v1/browser/start?user_id=${userId}`);
        console.log(res.data);

        if (res.data.code === 0 && res.data.data.ws && res.data.data.ws.puppeteer) {
            const browser = await puppeteer.connect({ browserWSEndpoint: res.data.data.ws.puppeteer, defaultViewport: null });
            const page = await browser.newPage();
            await page.goto('https://free-flow.xyz/mint');

            // 等待并点击第一个元素
            const button1Selector = '//*[@id="root"]/div/div[2]/div/button/div/span';
            await page.waitForXPath(button1Selector);
            const [button1] = await page.$x(button1Selector);
            if (button1) {
                await button1.click();
            }

            // 强制等待一段时间，以确保页面反应
            await page.waitForTimeout(3000);

            // 等待并点击第二个元素
            const button2Selector = '.chakra-button.css-1byb74s';
            await page.waitForSelector(button2Selector);
            const button2 = await page.$(button2Selector);
            if (button2) {
                await button2.click();
            }

            // 关闭浏览器
            await browser.close();
        }
    } catch (err) {
        console.log('Error during browser operation for user', userId, ':', err.message);
    }
}

// 用户ID数组
const userIds = ['j4gl2hc', 'j4gl2hb', 'j4gl2ha']; // 请替换为您的实际 user_id

// 并发执行所有浏览器实例
Promise.all(userIds.map(userId => startBrowserAndPerformActions(userId)))
    .then(() => console.log('All actions completed'))
    .catch(error => console.error('Error in performing actions:', error));
