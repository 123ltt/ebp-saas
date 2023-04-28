const pptr = require('puppeteer')
const Path = require('path')
const serxy = require('serxy').default

async function bootstrap () {
  const port = 3100
  await serxy({
    port,
    directory: Path.resolve()
  })

  const browser = await pptr.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  page.on('console', async (msg) => {
    if (await msg.args()[0].jsonValue() === true) {
      console.log('\x1b[32m%s\x1b[0m', '✔ passed!')
    } else {
      console.log('\x1b[31m%s\x1b[0m', '❌ failed!')
    }
    process.exit()
  })

  page.on('pageerror', (err) => {
    console.log(err.message)
    process.exit()
  })

  await page.goto(`http://localhost:${port}/test/index.html`)
}

bootstrap()
