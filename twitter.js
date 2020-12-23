const superagent = require("superagent");
const twiKey = Buffer.from(
  "3rJOl1ODzm9yZy63FACdg:5jPoQ5kQvMJFDYRNE8bQ4rHuds4xJqhvgNJM4awaE8"
).toString("base64");

async function getBearer() {
  return new Promise(async (resolve, reject) => {
    let token = await superagent
      .post(
        "https://api.twitter.com/oauth2/token?grant_type=client_credentials"
      )
      .set("Authorization", `Basic ${twiKey}`)
      .then((x) => x.body.access_token);
    resolve(token);
  });
}

async function getRecentPost() {
  return new Promise(async (resolve, reject) => {
    let token = await getBearer();
    let data = await superagent
      .get(
        `https://api.twitter.com/1.1/statuses/user_timeline.json?user_id=1311639359456776193&count=1&tweet_mode=extended`
      )
      .set("Authorization", `Bearer ${token}`)
      .set(
        "User-Agent",
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:69.0) Gecko/20100101 Firefox/69.0"
      )
      .then((x) => x.body[0])
      .catch((e) => reject(e));
    resolve(data);
  });
}

module.exports = getRecentPost;
