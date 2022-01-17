
require("chromedriver");
let swd = require("selenium-webdriver");
let fs = require("fs");
const { stringify } = require("querystring");

let browser = new swd.Builder().forBrowser(`chrome`).build();
let batsmanValue = ["playersName", "out", "run", "balls", "4s", "6s", "SR"];
let finalData = [];
let scoreCard = [];
// let z = 1
async function getPages(url) {
              let browser = new swd.Builder().forBrowser(`chrome`).build();
              await browser.get(url);
              await browser.wait(swd.until.elementLocated(swd.By.css(".cb-nav-tab" )));
              let buttons = await browser.findElements(swd.By.css(".cb-nav-tab" ));
              // console.log(buttons.length);
              await buttons[1].click();
              for(let i = 1; i<3; i++){
                await getBowler(browser,i);
              }
}
async function getBowler(browser,z){
              await browser.wait(swd.until.elementLocated(swd.By.css(`#innings_${z} .cb-col.cb-col-100.cb-ltst-wgt-hdr`))); 
              let tables = await browser.findElements(swd.By.css(`#innings_${z} .cb-col.cb-col-100.cb-ltst-wgt-hdr`));
              // console.log(tables.length);
              let rows = await tables[0].findElements(swd.By.css(`.cb-col.cb-col-100.cb-scrd-itms`));
              
                            let tname = await tables[0].findElement(swd.By.css(`.cb-col.cb-col-100.cb-scrd-hdr-rw`));
                            let obj = {};
                            let data = {};
                            obj["TeamName"] = await tname.findElement(swd.By.css(`span`)).getAttribute("innerText");
                            for(let i = 0;  i<rows.length ;i++){
                            let columns = await rows[i].findElements(swd.By.css(`.cb-col.cb-col`));
                            
                            if(columns.length==7){
                            for(let j in columns){
                              if(j!=1){
                               data[batsmanValue[j]] = await columns[j].getAttribute("innerText");
                              }
                            }
                            }
                            
                            
                            }
                            scoreCard.push(data);
                            obj["scoreCard"] = scoreCard;
                            finalData.push(obj);

                            

              }



async function cmd() {
              await browser.get("https://www.cricbuzz.com/cricket-series/3130/indian-premier-league-2020/matches");
              // browser.close();
              let matches = await browser.findElements(swd.By.css(".cb-text-complete"));
              for(let i  in matches){
                            if(i==4){
                            break;
                            }
                             let url = await matches[i].getAttribute("href");
                            //  console.log(url);
                               await getPages(url);

              }
              console.log(finalData);


              fs.writeFileSync("ipl.json", JSON.stringify(finalData));
             
}
cmd();