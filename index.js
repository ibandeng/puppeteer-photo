const puppeteer = require('puppeteer');
const path = require('path');

const url = 'http://localhost:3000/';

// Support for pkg
const executablePath =
    process.env.PUPPETEER_EXECUTABLE_PATH ||
    (process.pkg
        ? path.join(
            path.dirname(process.execPath),
            'puppeteer',
            ...puppeteer
                .executablePath()
                .split(path.sep)
                .slice(6),
        )
        : puppeteer.executablePath());


(async () => {
    console.log('启动中。。。。。。');
    const browser = await puppeteer.launch({
        args: ['--use-fake-ui-for-media-stream'],
        executablePath,
        // headless: false,
        // devtools: true
    })

    const page = await browser.newPage();
    await page.goto(url);
    await page.evaluate(async () => {

        const sleep = async () => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, 1000)
            })

        }

        try {
            await window.openMedia();
            await window.takePhoto();
            await sleep()
            await window.takePhoto();
            await sleep()
            await window.takePhoto();
        } catch (error) {

        }

    });
    await browser.close();
})()

