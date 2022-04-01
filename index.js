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
                console.log(competensys)
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

        // await console.log(res)
        await console.log('competency list was created')


        // отримуємо дані зі сторінки компетенції

        let finalRes = []

        // while (lang[counter] !== undefined) {
        while (competencyCounter < 1) {
            let competencyObj = {
                competency: res[0][competencyCounter],
            }
            // while (lang[langCounter] !== undefined) {
            while (langCounter < 1) {

                let url = `${link}${lang[langCounter]}/Competency/${res[0][competencyCounter]}`
                await console.log('gathering data from')
                await console.log(url)

                await page.goto(url)
                await page.waitForSelector('.btn-social')

                let html = await page.evaluate(async () => {
                    page = []

                    try {
                        let data = document.querySelector('.container-fluid')
                        console.log(data)

                        let title = data.querySelector('h5').innerText
                        let description = data.querySelector('.padding-xs-vr p').innerText
                        let BehavorialLevels = data.querySelectorAll('#accordion_behaviouralExamples .card-header button')
                        let BehavorialExamples = () => {
                            let BehavorialExamplesGeneral = () => {
                                let arr = []
                                let divs = data.querySelectorAll('#generalBehaviouralExamples .list-group-item')
                                divs.forEach(item => {
                                    arr.push(item.innerText)
                                })

                                let obj = {
                                    title: BehavorialLevels[0].innerText.trim(),
                                    data: arr
                                }

                                return obj

                            }
                            let BehavorialExamplesOperational = () => {
                                let arr = []
                                let divs = data.querySelectorAll('#operationalBehaviouralExamples .list-group-item')
                                divs.forEach(item => {
                                    arr.push(item.innerText)
                                })

                                let obj = {
                                    title: BehavorialLevels[1].innerText.trim(),
                                    data: arr
                                }

                                return obj

                            }
                            let BehavorialExamplesTactical = () => {
                                let arr = []
                                let divs = data.querySelectorAll('#tacticalBehaviouralExample .list-group-item')
                                divs.forEach(item => {
                                    arr.push(item.innerText)
                                })
                                let obj = {
                                    title: BehavorialLevels[2].innerText.trim(),
                                    data: arr
                                }

                                return obj
                            }
                            let BehavorialExamplesStrategical = () => {
                                let arr = []
                                let divs = data.querySelectorAll('#strategicalBehaviouralExample .list-group-item')
                                divs.forEach(item => {
                                    arr.push(item.innerText)
                                })
                                let obj = {
                                    title: BehavorialLevels[3].innerText.trim(),
                                    data: arr
                                }

                                return obj
                            }

                            let obj = {
                                title: data.querySelector('.bg-success button').innerText,
                                data: {
                                    general: BehavorialExamplesGeneral(),
                                    operational: BehavorialExamplesOperational(),
                                    tactical: BehavorialExamplesTactical(),
                                    strategical: BehavorialExamplesStrategical(),
                                }
                            }
                            return obj
                        }

                        let DevelopmentPotential = () => {
                            let arr = []
                            let divs = data.querySelectorAll('#accordion_developmentPotential .list-group-item')
                            divs.forEach(item => {
                                arr.push(item.innerText)
                            })

                            let obj = {
                                title: data.querySelector('.panel-warning button').innerText.trim(),
                                data: arr
                            }

                            return obj
                        }

                        let InteviewQuestions = () => {
                            let arr = []
                            let divs = data.querySelectorAll('#accordion_interviewQuestions .list-group-item')
                            divs.forEach(item => {
                                arr.push(item.innerText)
                            })
                            let obj = {
                                title: data.querySelector('.panel-danger button').innerText.trim(),
                                data: arr
                            }

                            return obj
                        }

                        let DevelopmentActivity = () => {
                            let arr = []
                            let divs = data.querySelectorAll('#accordion_developmentActivity .list-group-item')
                            divs.forEach(item => {
                                arr.push(item.innerText)
                            })
                            let obj = {
                                title: data.querySelector('.panel-info button').innerText.trim(),
                                data: arr
                            }

                            return obj
                        }

                        let CoachingAdvice = () => {
                            let arr = []
                            let divs = data.querySelectorAll('#accordion_coachingAdvice .list-group-item')
                            divs.forEach(item => {
                                arr.push(item.innerText)
                            })
                            let obj = {
                                title: data.querySelector('.panel-default button').innerText.trim(),
                                data: arr
                            }

                            return obj
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

                        console.log(obj)
                        return obj
                    }
                    catch (e) {
                        console.log(e)
                    }

                }, {waitUntil: '.btn-social'})

                competencyObj[lang[langCounter]] = html

                langCounter++
            }
            finalRes.push(competencyObj)
            competencyCounter++
        }

        fs.writeFile('competencys.json', JSON.stringify({'data': finalRes}), err => {
            if (err) throw err
            console.log('file is saved')
            console.log(finalRes.length + 'elements')
        })

    }
    catch (e) {
        console.log(e)
        // await browser.close()
    }


})();