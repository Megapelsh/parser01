require ('dotenv').config()

const fs = require('fs')
const puppeter = require('puppeteer')

let link = process.env.url;

(async () => {
    let flag = true
    let res = []
    let lang = ['en', 'nl', 'dk', 'de', 'fr', 'es', 'pt', 'ar', 'zh', 'pl', 'ru', 'tr']
    let counter = 0
    let langCounter = 0
    let competencyCounter = 0


    try {
        let browser = await puppeter.launch({
            headless: false,
            slowMo: 200,
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

            let competensyArr = []

            try {
                competensys = document.querySelectorAll('h4.text-semibold')
                // console.log(competensys)
                for (let elem of competensys) {
                    competensyArr.push(elem.innerHTML)
                }
            }
            catch (e) {
                console.log(e)
            }

            return competensyArr
        }, {waitUntil: '.btn-social'})

        res.push(html)


        // отримуємо дані зі сторінки компетенції

        let finalRes = []

        // while (lang[counter] !== undefined) {
        while (counter < 1) {
            await page.goto(`${link}${lang[counter]}/Competency/${res[0][0]}`)
            await page.waitForSelector('.btn-social')

            let competencyObj = {}

            competencyObj = {
                lang: lang[langCounter],
                competency: res[0][competencyCounter]
            }

            let html = await page.evaluate(async () => {
                page = []


                try {
                    let data = document.querySelector('.container-fluid')
                    console.log(data)

                    let title = data.querySelector('h5').innerText
                    let description = data.querySelector('.padding-xs-vr p').innerText
                    let BehavorialExamples = () => {
                        let BehavorialExamplesGeneral = () => {
                            let arr = []
                            let divs = data.querySelectorAll('#generalBehaviouralExamples .list-group-item')
                            // console.log(divs)
                            divs.forEach(item => {
                                arr.push(item.innerText)
                            })
                            return arr
                        }
                        let BehavorialExamplesOperational = () => {
                            let arr = []
                            let divs = data.querySelectorAll('#operationalBehaviouralExamples .list-group-item')
                            divs.forEach(item => {
                                arr.push(item.innerText)
                            })
                            return arr
                        }
                        let BehavorialExamplesTactical = () => {
                            let arr = []
                            let divs = data.querySelectorAll('#tacticalBehaviouralExample .list-group-item')
                            divs.forEach(item => {
                                arr.push(item.innerText)
                            })
                            return arr
                        }
                        let BehavorialExamplesStrategical = () => {
                            let arr = []
                            let divs = data.querySelectorAll('#strategicalBehaviouralExample .list-group-item')
                            divs.forEach(item => {
                                arr.push(item.innerText)
                            })
                            return arr
                        }

                        let obj = {
                            general: BehavorialExamplesGeneral(),
                            operational: BehavorialExamplesOperational(),
                            tactical: BehavorialExamplesTactical(),
                            strategical: BehavorialExamplesStrategical(),
                        }
                        return obj
                    }

                    let DevelopmentPotential = () => {
                        let arr = []
                        let divs = data.querySelectorAll('#accordion_developmentPotential .list-group-item')
                        divs.forEach(item => {
                            arr.push(item.innerText)
                        })
                        return arr
                    }

                    let InteviewQuestions = () => {
                        let arr = []
                        let divs = data.querySelectorAll('#accordion_interviewQuestions .list-group-item')
                        divs.forEach(item => {
                            arr.push(item.innerText)
                        })
                        return arr
                    }

                    let DevelopmentActivity = () => {
                        let arr = []
                        let divs = data.querySelectorAll('#accordion_developmentActivity .list-group-item')
                        divs.forEach(item => {
                            arr.push(item.innerText)
                        })
                        return arr
                    }

                    let CoachingAdvice = () => {
                        let arr = []
                        let divs = data.querySelectorAll('#accordion_coachingAdvice .list-group-item')
                        divs.forEach(item => {
                            arr.push(item.innerText)
                        })
                        return arr
                    }

                    let obj = {
                        title: title,
                        description: description,
                        BehavorialExamples: BehavorialExamples(),
                        DevelopmentPotential: DevelopmentPotential(),
                        InteviewQuestions: InteviewQuestions(),
                        DevelopmentActivity: DevelopmentActivity(),
                        CoachingAdvice: CoachingAdvice(),
                    }

                    competencyObj
                    console.log(obj)
                }
                catch (e) {
                    console.log(e)
                }

            }, {waitUntil: '.btn-social'})

            finalRes.push(html)

            counter++

            // console.log(finalRes)
        }

    }
    catch (e) {
        console.log(e)
        // await browser.close()
    }

    // console.log(res)
})();