const Cookie = require('cookie');
const axios = require('axios').default;
axios.defaults.baseURL = 'https://iconverse-demo.taiger.io';
axios.defaults.headers.post['Accept'] = '*/*';
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

//const botID = 'a3051d97-c407-4b39-8a10-53fdb47a88e7';
//const botID = '076a85c2-bb5d-40c0-a17f-c3d9edb374eb';
const botID = process.env.BOT_ID;
var session = null;
var cookieStr = null;

function renderMesssge(message, cid, bot) {
  return JSON.parse(`{
  "text": "${message}",
  "value": "",
  "type": "DEFAULT",
  "source": "user",
  "cid": "${cid}",
  "lang": "en",
  "bot": "${bot}",
  "topic": "",
  "subtopic": "",
  "isAutoTriggered": false,
  "channel": "desktop-web"
}`);
}

// Create a new session
var createSession = function () {
  const responseFromAPI = new Promise(function (resolve, reject) {
    axios
      .post(
        '/iconverse-converse/startSession',
        {},
        {
          headers: {},
        }
      )
      .then((response) => {
        // Save cookie
        cookieStr = response.headers['set-cookie'][0];
        //console.log(response.data);
        //console.log(cookieStr);
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return responseFromAPI;
};

var getRes = function (query) {
  const responseFromAPI = new Promise(function (resolve, reject) {
    createSession().then(function (res) {
      axios
        .post('/iconverse-converse/message', renderMesssge(query, res, botID), {
          headers: {},
        })
        .then((response) => {
          resolve(response.data.text);
        })
        .catch((error) => {
          reject(error);
        });
    });
  });
  return responseFromAPI;
};

// Query the conversation of the chatbot
var getConversation = function (bot, cookie) {
  const responseFromAPI = new Promise(function (resolve, reject) {
    axios
      .post(`/iconverse-converse/conversations/session/${bot}`, {
        headers: { Cookie: `${cookie}` },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
  return responseFromAPI;
};

// test the command :
// getRes('Can 2 foreigners marry in Singapore?').then(function (res) {
//   console.log(res.text);
// });

// "<p>Your session has expired please start over.</p>"
// getRes().then(function (res) {
//   session = res;
//   console.log(session);
//   console.log(cookieStr);
// });

// getRes('hello').then(function (res) {
//   console.log(res);
// });

module.exports = { getRes };
