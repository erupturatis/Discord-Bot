import { createRequire } from "module";
const require = createRequire(import.meta.url);

const puppeteer = require("puppeteer");
const fs = require('fs/promises')



async function start() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://en.wikipedia.org/wiki/Adolf_Hitler");
  
  const names = await page.evaluate(()=>{

    function linkValidation(text) {
      if (text === 'ISBN') return false;
      if (text === '') return false;
      if (text.split(' ')[0] === 'Jump') return false;
      if (!(('a' <= text[0] && text[0] <= 'z')||('A' <= text[0] && text[0] <= 'Z'))) return false;
      return true;
    }
    //id selection of the main page
    return Array.from(document.querySelectorAll("a")).map(x => {
      let newElem = {
        text: x.textContent,
        link: x.href,
      }
      if(linkValidation(x.textContent) && x.href.includes('wiki')) return x.textContent;
      return '';
    }).filter(text => text !== '')
  })
  console.log(names)

  await fs.writeFile('names.txt', names.join('\r\n'))
  await browser.close();
}

start()
