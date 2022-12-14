import { createRequire } from "module";
const require = createRequire(import.meta.url);

const puppeteer = require("puppeteer");
const fs = require("fs/promises");

async function start(wikiPage, page) {
  await page.goto(wikiPage);

  const names = await page.evaluate(() => {
    function linkValidation(text) {
      //validating links
      if (text === "ISBN") return false;
      if (text === "") return false;
      if (text.split(" ")[0] === "Jump") return false;
      if (
        !(
          ("a" <= text[0] && text[0] <= "z") ||
          ("A" <= text[0] && text[0] <= "Z")
        )
      )
        return false;
      if (text.includes("http")) return false;
      return true;
    }
    return Array.from(
      document.getElementById("mw-content-text").querySelectorAll("a")
    )
      .map((x) => {
        let newElem = {
          text: x.textContent,
          link: x.href,
        };
        //

        if (
          linkValidation(x.textContent) &&
          !x.href.includes("identifier") &&
          !x.href.includes("commons") &&
          !x.href.includes("#") &&
          x.href.includes("wiki") &&
          !x.href.slice(6).includes(":")
        )
          return newElem;
        return "";
      })
      .filter((text) => text !== "");
    // the bot also returns some hidden links on the page
  });
  return names;
}

async function getNamesForDistance(name, distance, maxDistance) {
  // the distance represents how many links are between 2 page
  // the function returns all the links with a distance smaller than maxDistance
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-sandbox",
    ],
  });
  const page = await browser.newPage();
  await page.goto("https://www.wikipedia.org/");
  await page.type("#searchInput", name);
  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  let url = await page.url();
  if (url.includes("Special:")) {
    await browser.close();
    return [{ text: "error", link: `term not found` }];
  }
  try {
    // if the given names does not match perfectly with search results
    //wikipedia will redirect you twice not once
    await page.waitForNavigation({ timeout: 100 });
  } catch {}

  let arr = [{ text: name, link: `${url}` }];
  let allNames = arr;

  let iter = 0;

  for (const element of arr) {
    console.log(`${iter}`);
    iter += 1;
    let names = await start(element.link, page);
    allNames = allNames.concat(names);
  }

  if (distance < maxDistance - 1) {
    return await getNamesForDistance(allNames, distance + 1, maxDistance);
  } else {
    await browser.close();
    return allNames;
  }
}

function writeNames(names) {
  names = names.map((elem) => JSON.stringify(elem));
  fs.writeFile("names.txt", names.join("\r\n"));
}
export { getNamesForDistance };
