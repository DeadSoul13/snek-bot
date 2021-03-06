const tweet = require("./twitter.js");
const scoreRegex = /^Score: [0-9]+\nBest: [0-9]+\n\n/;

function direction(board) {
  // true for horizontal, false for vertical
  return board.match(/\u27A1\uFE0F/g);
}

function determine(likes, rts, dir) {
  let total = likes + rts;
  // polymars helped me confirm this line of code thanks man
  let tying = rts > likes - likes / 20 && rts < likes + likes / 20;

  if (!tying) {
    if (rts > likes) {
      return dir ? "Going left" : "Going up";
    } else {
      return dir ? "Going right" : "Going down";
    }
  } else {
    return "Going straight";
  }
}

function snowflake(flake) {
  let snowflake = parseInt(flake).toString(2);
  snowflake = "0".repeat(64 - snowflake.length) + snowflake;
  let date = snowflake.substr(0, 42);
  let timestamp = parseInt(date, 2) + 1288834974657;
  let final = new Date(timestamp);
  return final;
}

function buildDesc(gameboard, post, dir) {
  let dirstr = determine(post.favorite_count, post.retweet_count, dir);
  let rtdir = dir ? ":arrow_left:" : ":arrow_up:";
  let likedir = dir ? ":arrow_right:" : ":arrow_down:";
  let max = post.retweet_count + post.favorite_count;
  let rtpercent = Math.floor((post.retweet_count / max) * 100) + "%";
  let likepercent = Math.floor((post.favorite_count / max) * 100) + "%";
  let final = "";
  final = final += `${gameboard}\n\n`;
  final = final += `:repeat: ${rtdir} ${post.retweet_count} (${rtpercent})\n`;
  final = final += `:heart: ${likedir} ${post.favorite_count} (${likepercent})\n`;
  final = final += dirstr
  return final;
}

async function getInfo() {
  let post = await tweet();
  let dir = direction(post.full_text);
  // this shithole is to just trim the gameboard because i didnt want to write another regex
  let gameboard = post.full_text
    .replace(scoreRegex, "")
    .split("\n")
    .slice(0, 10)
    .join("\n");
  let desc = buildDesc(gameboard, post, dir);
  let snow = snowflake(post.id);
  let diff =
    30 - Math.abs(Math.round((Date.now() - snow.getTime()) / 1000 / 60));
  return {
    embeds: [
      {
        title: post.full_text.match(/^Score: [0-9]+/)[0],
        url: `https://twitter.com/SnakeGameBot/status/${post.id_str}`,
        description: desc,
        color: 14495300,
        footer: {
          text: `New post in ${diff} minutes`,
        },
        timestamp: snow.toISOString(),
      },
    ],
    username: "AppleEater",
    avatar_url: "https://xboxlive.party/i/ctes0c3s.png",
    allowed_mentions: {
      parse: [],
    },
  };
}

module.exports = getInfo;
