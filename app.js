const express = require("express");
require('dotenv').config({ path: __dirname + '/.env' });
const app = express();
const queryString = require("node:querystring");
const axios = require("axios");

app.listen(8080, () => {
  console.log("App is listening on port 8080!");
});

app.use(express.static(__dirname + '/'));

app.get("/", (req, res) => {
    res.send(
        '<meta name="viewport" content="width=device-width, initial-scale=1">' +
        '<link rel="stylesheet" type="text/css" href="css/login.css" />' +
        "<main>" +
        "<h1>Spotify Statistics</h1>" + 
        "<a href='https://accounts.spotify.com/authorize?client_id=" +
      process.env.CLIENT_ID +
        "&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2Fhome&scope=user-top-read'>Sign in</a>" +
        '<div class="waveDiv">' +
        '  <div class="box box1"></div>' +
        '  <div class="box box2"></div>' +
        '  <div class="box box3"></div>' +
        '  <div class="box box4"></div>' +
        '  <div class="box box5"></div>' +
        "</div>" +
        "<footer><h2>Made by Thalen</hd></footer>" +
        "</main>"
        );
});

app.get("/home", async (req, res) => {
    const clientId = process.env.CLIENT_ID.trim();
    const clientSecret = process.env.CLIENT_SECRET.trim();
    const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    const spotifyResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        queryString.stringify({
          grant_type: "authorization_code",
          code: req.query.code,
          redirect_uri: process.env.REDIRECT_URI_DECODED.trim(),
        }),
        {
          headers: {
            Authorization: `Basic ${authHeader}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
    );

    const accessToken = spotifyResponse.data.access_token;

    const fetchTopItems = async (type, timeRange, limit, offset) => {
      return axios.get(
        `https://api.spotify.com/v1/me/top/${type}?time_range=${timeRange}&limit=${limit}&offset=${offset}`,
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );
    };
    
    const [tracks1short, tracks2short, tracks1medium, tracks2medium, tracks1long, tracks2long, 
           artists1short, artists2short, artists1medium, artists2medium, artists1long, artists2long] = await Promise.all([
      fetchTopItems('tracks', 'short_term', 49, 0),
      fetchTopItems('tracks', 'short_term', 50, 49),
      fetchTopItems('tracks', 'medium_term', 49, 0),
      fetchTopItems('tracks', 'medium_term', 50, 49),
      fetchTopItems('tracks', 'long_term', 49, 0),
      fetchTopItems('tracks', 'long_term', 50, 49),
      fetchTopItems('artists', 'short_term', 50, 0),
      fetchTopItems('artists', 'short_term', 50, 49),
      fetchTopItems('artists', 'medium_term', 49, 0),
      fetchTopItems('artists', 'medium_term', 50, 49),
      fetchTopItems('artists', 'long_term', 49, 0),
      fetchTopItems('artists', 'long_term', 50, 49)
    ]);

    console.log(tracks1short.data.items[0].album.images);
    console.log(artists1short.data.items[0]);

    res.send(
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      '<link rel="stylesheet" type="text/css" href="css/home.css" />' +
      "<main>" +
      "<h1>Spotify Statistics</h1>" +
      "<div class='tabContainer'>" +
        "<div class='topTabs'>" +
          "<button class='tabButton active' onclick='showTab(\"tracks\")'>Tracks</button>" +
          "<button class='tabButton' onclick='showTab(\"artists\")'>Artists</button>" +
        "</div>" +
        "<div class='subTabs'>" +
          "<button class='tabButton active' onclick='showSubTab(\"4weeks\")'>4 Weeks</button>" +
          "<button class='tabButton' onclick='showSubTab(\"6months\")'>6 Months</button>" +
          "<button class='tabButton' onclick='showSubTab(\"lifetime\")'>Lifetime</button>" +
        "</div>" +
        "<div id='tracks' class='tabContent'>" +
          "<div id='4weeks-tracks' class='subTabContent'>" +
            "<h2>Top Tracks - 4 Weeks</h2>" +
            "<ol>" +
            tracks1short.data.items.map(item => `<li><img src='${item.album.images[1].url}'><br>${item.name}</li>`).join("") +
            tracks2short.data.items.map(item => `<li><img src='${item.album.images[1].url}'><br>${item.name}</li>`).join("") +
            "</ol>" +
          "</div>" +
          "<div id='6months-tracks' class='subTabContent hidden'>" +
            "<h2>Top Tracks - 6 Months</h2>" +
            "<ol>" +
            tracks1medium.data.items.map(item => `<li><img src='${item.album.images[1].url}'><br>${item.name}</li>`).join("") +
            tracks2medium.data.items.map(item => `<li><img src='${item.album.images[1].url}'><br>${item.name}</li>`).join("") +
            "</ol>" +
          "</div>" +
          "<div id='lifetime-tracks' class='subTabContent hidden'>" +
            "<h2>Top Tracks - Lifetime</h2>" +
            "<ol>" +
            tracks1long.data.items.map(item => `<li><img src='${item.album.images[1].url}'><br>${item.name}</li>`).join("") +
            tracks2long.data.items.map(item => `<li><img src='${item.album.images[1].url}'><br>${item.name}</li>`).join("") +
            "</ol>" +
          "</div>" +
        "</div>" +
        "<div id='artists' class='tabContent hidden'>" +
          "<div id='4weeks-artists' class='subTabContent'>" +
            "<h2>Top Artists - 4 Weeks</h2>" +
            "<ol>" +
            artists1short.data.items.map(item => `<li><img src='${item.images[1].url}' width='64'><br>${item.name}</li>`).join("") +
            artists2short.data.items.map(item => `<li><img src='${item.images[1].url}' width='64'><br>${item.name}</li>`).join("") +
            "</ol>" +
          "</div>" +
          "<div id='6months-artists' class='subTabContent hidden'>" +
            "<h2>Top Artists - 6 Months</h2>" +
            "<ol>" +
            artists1medium.data.items.map(item => `<li><img src='${item.images[1].url}' width='64'><br>${item.name}</li>`).join("") +
            artists2medium.data.items.map(item => `<li><img src='${item.images[1].url}' width='64'><br>${item.name}</li>`).join("") +
            "</ol>" +
          "</div>" +
          "<div id='lifetime-artists' class='subTabContent hidden'>" +
            "<h2>Top Artists - Lifetime</h2>" +
            "<ol>" +
            artists1long.data.items.map(item => `<li><img src='${item.images[1].url}' width='64'><br>${item.name}</li>`).join("") +
            artists2long.data.items.map(item => `<li><img src='${item.images[1].url}' width='64'><br>${item.name}</li>`).join("") +
            "</ol>" +
          "</div>" +
        "</div>" +
      "</div>" +
      "<script>" +
        "function showTab(tabId) {" +
          "document.querySelectorAll('.tabContent').forEach(el => el.classList.add('hidden'));" +
          "document.getElementById(tabId).classList.remove('hidden');" +
          "document.querySelectorAll('.topTabs .tabButton').forEach(el => el.classList.remove('active'));" +
          "event.target.classList.add('active');" +
          "showSubTab('4weeks');" + 
        "}" +
        "function showSubTab(subTabId) {" +
          "var tabId;" +
          "document.querySelectorAll('.topTabs .tabButton').forEach(el => {" +
            "if (el.classList.contains('active')) {" +
              "tabId = el.getAttribute('onclick').match(/showTab\\(\"(.*?)\"\\)/)[1];" +
            "}" +
          "});" +
          "document.querySelectorAll(`#${tabId} .subTabContent`).forEach(el => el.classList.add('hidden'));" +
          "document.getElementById(`${subTabId}-${tabId}`).classList.remove('hidden');" +
          "document.querySelectorAll('.subTabs .tabButton').forEach(el => el.classList.remove('active'));" +
          "event.target.classList.add('active');" +
        "}" +
      "</script>" +
      "</main>"
    );
});