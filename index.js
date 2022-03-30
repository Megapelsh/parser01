require ('dotenv').config()

const fs = require('fs')
const puppeter = require('puppeteer')

let link = process.env.url;

(async () => {
    let flag = true
    let res = []
    let lang = ['en', 'nl', 'dk', 'de', 'fr', 'es', 'pt', 'ar', 'zh', 'pl', 'ru', 'tr']
    let counter = 0

    try {
        let browser = await puppeter.launch({
            headless: false,
            slowMo: 500,
            devtools: true,
        })
        let page = await browser.newPage()
        await page.setViewport({
            width: 1400, height: 900
        })

        // отримуємо список компетенцій англійською
        await page.goto(`${link}${lang[0]}`)
        await page.waitForSelector('.btn-social')
        let html = await page.evaluate(async () => {
            let page = []

            try {
                let competensyArr = document.querySelectorAll('h4.text-semibold')
                console.log(competensyArr)
            }
            catch (e) {
                console.log(e)
            }

            return ''
        }, {waitUntil: '.btn-social'})



        // while (flag && lang[counter] !== 0) {
        //     await  page.goto(`${link}${lang[counter]}`)
        //
        //     console.log(`${link}${lang[counter]}`)
        //     console.log(lang[counter])
        //
        //
        //
        //     counter++
        //
        // }
    }
    catch (e) {
        console.log(e)
        // await browser.close()
    }
})();