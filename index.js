const fs = require("fs");
const superagent = require("superagent");
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const board = require("./board.js");

var message = "";

async function newMessage(embed) {
  let result = await superagent
    .post(config.webhook)
    .query({ wait: true })
    .send(embed)
    .then((x) => x.body);
  message = result.id;
  console.log(`sent new message (${message})`);
}

async function doThing() {
  let embed = await board();
  try {
    let result = await superagent
      .delete(`${config.webhook}/messages/${message}`)
      .send(embed)
      .then((x) => x.body);
  } catch (err) {
    console.error(err);
  }
  newMessage(embed);
}

const timer = setInterval(doThing, 1000 * 60 * 1);
doThing();
