// const url = 'https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard'

const request = require("request");
const cheerio = require("cheerio");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx");

function processScoreCard(url) {
  request(url, cb);
}

function cb(err, response, html) {
  if (err) {
    console.error(err);
  } else {
    ExtractMatchDetails(html);
  }
}

function ExtractMatchDetails(html) {
  let $ = cheerio.load(html);

  let descString = $(
    " .ds-grow > .ds-text-tight-m.ds-font-regular.ds-text-ui-typo-mid"
  );
  let descStringArr = descString.text().split(",");
  // console.log(descStringArr)
  let venue = descStringArr[1].trim();

  let date = descStringArr[2].trim();

  let result = $(
    ".ds-text-tight-m.ds-font-regular.ds-truncate.ds-text-typo-title"
  ).text();

  console.log(venue);
  console.log(date);
  console.log(result);
  console.log("------------------");

  let innings = $(
    ".ds-rounded-lg.ds-mt-2 .ds-w-full.ds-bg-fill-content-prime.ds-overflow-hidden.ds-rounded-xl.ds-border.ds-border-line.ds-mb-4"
  );

  let htmlString = "";

  for (let i = 0; i < innings.length; i++) {
    htmlString += $(innings[i]).html();
    let teamName = $(innings[i])
      .find(".ds-text-title-xs.ds-font-bold.ds-capitalize")
      .text();

    let opponentIndex = i == 0 ? 1 : 0;
    let opponentName = $(innings[opponentIndex])
      .find(".ds-text-title-xs.ds-font-bold.ds-capitalize")
      .text();

    // console.log(teamName , opponentName)

    let cInning = $(innings[i]);

    let allRows = cInning.find(
      ".ds-w-full.ds-table.ds-table-md.ds-table-auto.ci-scorecard-table tbody tr"
    );
    for (let j = 0; j < allRows.length; j++) {
      let allCols = $(allRows[j]).find("td");
      let isWorthy = $(allCols[0]).hasClass(
        "ds-w-0 ds-whitespace-nowrap ds-min-w-max"
      );

      if (isWorthy == true) {
        let playerName = $(allCols[0]).text().trim();
        let runs = $(allCols[2]).text().trim();
        let balls = $(allCols[3]).text().trim();
        let four = $(allCols[5]).text().trim();
        let sixes = $(allCols[6]).text().trim();
        let strike = $(allCols[7]).text().trim();

        console.log(
          `${playerName} | ${runs} | ${balls} | ${four} | ${sixes} | ${strike}`
        );

        processPlayer(
          teamName,
          opponentName,
          playerName,
          balls,
          four,
          sixes,
          strike,
          venue,
          date,
          result
        );
        //Template literal
      }
    }

    console.log(
      "-------------------------------------------------------------------------"
    );
  }

  // console.log(htmlString)
}

function processPlayer(
  teamName,
  opponentName,
  playerName,
  balls,
  four,
  sixes,
  strike,
  venue,
  date,
  result
) {
  let teamPath = path.join(__dirname, "IPL", teamName);
  dirCreator(teamPath);

  let filepath = path.join(teamPath, playerName + ".xlsx");

  let content = excelReader(filepath, playerName); //[empty error arga]

  let playerObj = {
    teamName,
    opponentName,
    playerName,
    balls,
    four,
    sixes,
    strike,
    venue,
    date,
    result,
  };
  content.push(playerObj);

  excelWriter(filepath, playerName, content);
}

function dirCreator(folderpath) {
  if (fs.existsSync(folderpath) == false) {
    fs.mkdirSync(folderpath);
  }
}

function excelWriter(fileName, sheetName, jsonData) {
  let newWB = xlsx.utils.book_new();
  //creating a new workbook
  let newWS = xlsx.utils.json_to_sheet(jsonData);
  //json is converted to sheet format(rows and cols)
  xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
  xlsx.writeFile(newWB, fileName);
}

function excelReader(fileName, sheetName) {
  if (fs.existsSync(fileName) == false) {
    return [];
  }
  let wb = xlsx.readFile(fileName);
  let excelData = wb.Sheets[sheetName];
  let ans = xlsx.utils.sheet_to_json(excelData);
  return ans;
}

module.exports = {
  ps: processScoreCard,
};
