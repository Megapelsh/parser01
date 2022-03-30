const fs = require('fs')
const puppeter = require('puppeteer')

let link = 'https://www.competencylibrary.com/';

(async () => {
    let flag = true
    let res = []
    let lang = 'en'
    let counter = 0

    try {
        let browser = await puppeter.launch({
            headless: false,
            slowMo: 100,
            devtools: true,
        })
        let page = await browser.newPage()
        await page.setViewport({
            width: 1400, height: 900
        })

        while ((flag)) {
            await  page.goto(`${link}${lang}`)
            console.log(`${link}${lang}`)
            counter++
            console.log(counter)
        }
    }
    catch (e) {
        console.log(e)
        await browser.close()
    }
})();