const fs = require("fs");
const superagent = require("superagent");
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const board = require("./board.js");

var message = config.message ?? "";

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
  if (message !== "") {
    try {
      let result = await superagent
        .patch(`${config.webhook}/messages/${message}`)
        .query({ wait: true })
        .send(embed)
        .then((x) => x.body);
      message = result.id;
      console.log(`updated message (${message})`);
    } catch {
      let result = await superagent
        .delete(`${config.webhook}/messages/${message}`)
        .query({ wait: true })
        .send(embed)
        .then((x) => x.body);
      console.log(`deleted message (${message})`);
      newMessage(embed);
    }
  } else {
    newMessage(embed);
  }
}

const timer = setInterval(doThing, 1000 * config.delay ?? 60);
doThing();
