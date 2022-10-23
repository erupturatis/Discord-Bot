import { createRequire } from "module";
const require = createRequire(import.meta.url);

const puppeteer = require("puppeteer");
const fs = require('fs/promises')

async function start(wikiPage, page) {
  
  await page.goto(wikiPage);
  
  const names = await page.evaluate(()=>{
    
    function linkValidation(text) {
      //validating links
      if (text === 'ISBN') return false;
      if (text === '') return false;
      if (text.split(' ')[0] === 'Jump') return false;
      if (!(('a' <= text[0] && text[0] <= 'z')||('A' <= text[0] && text[0] <= 'Z'))) return false;
      if (text.includes('http')) return false;
      return true;
    }
    return Array.from(document.getElementById('mw-content-text').querySelectorAll("a")).map(x => {
      let newElem = {
        text: x.textContent,
        link: x.href,
      }
      //

      if(linkValidation(x.textContent) && !x.href.includes('identifier') && !x.href.includes('commons') && !x.href.includes('#') && x.href.includes('wiki') && !(x.href.slice(6)).includes(':')) return newElem;
      return '';
    }).filter(text => text !== '')
    // the bot also returns some hidden links on the page
  })

  return names;
}

async function getNamesForDistance(name, distance, maxDistance){
  
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.wikipedia.org/");
  await page.type("#searchInput", name);
  await page.keyboard.press('Enter');
  await page.waitForNavigation();

  console.log("aici");
  let url = await page.url();
  console.log("names distance");
  if (url.includes("Special:")){
    await browser.close();
    console.log("returned error");
    return [{text: "error", link:`term not found`}];
  }
  console.log("continued1");
  await page.waitForNavigation({ timeout: 100});
  
  console.log("continued2");
  

  let arr = [{text: name, link:`${url}`}]
  let allNames = arr

  let iter = 0;

  for(const element of arr){
    console.log(`${iter}`);
    iter+=1;
    let names = await start(element.link, page);
    allNames = allNames.concat(names);
  }
  
  if(distance < maxDistance-1){
    return await getNamesForDistance(allNames, distance + 1, maxDistance);
  }else{
    await browser.close();
    return allNames;
  }
  
}

// let initialArr = [{text:"hitler",link: "https://en.wikipedia.org/wiki/Adolf_Hitler"}]
// let names = await getNamesForDistance(initialArr, 0, 2);
function writeNames(names){
  names = names.map((elem) => JSON.stringify(elem))
  fs.writeFile('names.txt', names.join('\r\n'))
}
export {getNamesForDistance};


