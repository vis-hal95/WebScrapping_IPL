const cheerio = require("cheerio");
const request = require("request");

const scoreCardObj = require("./scoreboard");

function getAllMatchlink(uri) {
  request(uri, function (error, response, html) {
    if (error) {
      console.log(error);
    } else {
      extratAllLink(html);
    }
  });
}
function extratAllLink(html) {
  let $ = cheerio.load(html);

  let scoreCard = $(
    ".ds-grow.ds-px-4.ds-border-r.ds-border-line-default-translucent >a "
  );

  for (let i = 0; i < scoreCard.length; i++) {
    let link = $(scoreCard[i]).attr("href");
    //  console.log(link)
    let fulllink = "https://www.espncricinfo.com/" + link;
    // console.log(fulllink)

    scoreCardObj.ps(fulllink);
  }
}

module.exports = {
  getAllMatch: getAllMatchlink,
};
