const puppeteer = require('puppeteer')
const fs = require('fs')

async function run() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.goto('https://www.rectools.io', { timeout: 1200000 })

    // Take a screenshot
    await page.screenshot({ path: 'screenshot.png', fullPage: true })

    // make a pdf
    await page.pdf({ path: 'screenshot.pdf', format: 'A4' })

    // get the html of the page
    // const html = await page.content()

    // get the title of the page
    const title = await page.evaluate(() => document.title)

    // get the url of the page
    const url = await page.url()

    // get the categories of the page
    const categories = await page.evaluate(() => {
        const categoryNodes = document.querySelectorAll('.home-product-categories a')
        return Array.from(categoryNodes, node => ({ category: node.innerText.trim(), href: node.getAttribute('href') }))
    })

    // save the title, url, categories, to a rectools.json file
    fs.writeFile('rectools.json', JSON.stringify({ 
        title, 
        url, 
        categories 
    }, null, 2), (err) => {
        if (err) {
            throw err;
        }
        console.log('The file has been saved!');
    });
    

    await browser.close()
}


run()