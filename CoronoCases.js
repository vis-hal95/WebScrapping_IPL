// const request = require ('request')
// const cheerio = require('cheerio');

// console.log('before')

// request('https://www.worldometers.info/coronavirus/' , cb)
// function cb(error , response , html){
//     if(error){
//         console.log(error)
//     }else{
//         handleHtml(html)
//     }
// }

// function handleHtml(html){
    
//     let setTool = cheerio.load(html)
//     console.log(setTool)
// }

const request = require("request");
const cheerio = require("cheerio");

console.log("Before");

request("https://www.worldometers.info/coronavirus/", cb);

function cb(error, response, html) {
  if (error) {
    console.error(error);
  } else {
    handleHtml(html);
  }
}



function handleHtml(html){


  
  let selTool = cheerio.load(html)
  let content = selTool('.maincounter-number')
//   for(i=0; i<content.length; i++){
//     let data = selTool(content[i]).text()
//     console.log(data)
//   }

let totalcases = selTool(content[0]).text()
console.log(' total cases ' + totalcases)

let deaths =selTool(content[1]).text()
console.log('deaths cases ' + deaths)

let recoverd = selTool(content[2]).text()
console.log('recovered case' + recoverd)




}


console.log('after')
