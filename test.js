import {getNamesForDistance} from './Functionality/wikipediaScraper.js'
let initialArr = [{text:"Hitler", link:"https://en.wikipedia.org/wiki/Adolf_Hitler"}]
let names = await getNamesForDistance(initialArr, 0, 1);
console.log(names);
console.log("here");