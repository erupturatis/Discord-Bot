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

async function getNamesForDistance(arr, distance, maxDistance){
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
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


