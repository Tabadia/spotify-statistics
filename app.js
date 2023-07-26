const express = require("express");
require('dotenv').config({ path: __dirname + '/.env' });
const app = express();
const queryString = require("node:querystring");
const axios = require("axios");

app.listen(8080, () => {
  console.log("App is listening on port 8080!\n");
});

app.use(express.static(__dirname + '/'));

app.get("/", (req, res) => {
    res.send(
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
    const spotifyResponse = await axios.post(
        "https://accounts.spotify.com/api/token",
        queryString.stringify({
          grant_type: "authorization_code",
          code: req.query.code,
          redirect_uri: process.env.REDIRECT_URI_DECODED,
        }),
        {
          headers: {
            Authorization: "Basic " + process.env.CLIENT_SECRET,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
    );
    const tracks1short = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=49&offset=0",
        {
          headers: {
            Authorization: "Bearer " + spotifyResponse.data.access_token,
          },
        }
    );
    const tracks2short = await axios.get(
        "https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=50&offset=49",
        {
          headers: {
            Authorization: "Bearer " + spotifyResponse.data.access_token,
          },
        }
  );
  const tracks1medium = await axios.get(
    "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=49&offset=0",
    {
      headers: {
        Authorization: "Bearer " + spotifyResponse.data.access_token,
      },
    }
);
const tracks2medium = await axios.get(
    "https://api.spotify.com/v1/me/top/tracks?time_range=medium_term&limit=50&offset=49",
    {
      headers: {
        Authorization: "Bearer " + spotifyResponse.data.access_token,
      },
    }
  );
  const tracks1long = await axios.get(
    "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=49&offset=0",
    {
      headers: {
        Authorization: "Bearer " + spotifyResponse.data.access_token,
      },
    }
  );
  const tracks2long = await axios.get(
    "https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=50&offset=49",
    {
      headers: {
        Authorization: "Bearer " + spotifyResponse.data.access_token,
      },
    }
  );
  const artists1short = await axios.get(
    "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=49&offset=0",
    {
      headers: {
        Authorization: "Bearer " + spotifyResponse.data.access_token,
      },
    }
  );
  const artists2short = await axios.get(
    "https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=50&offset=49",
    {
      headers: {
        Authorization: "Bearer " + spotifyResponse.data.access_token,
      },
    }
  );
  const artists1medium = await axios.get(
    "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=49&offset=0",
    {
      headers: {
        Authorization: "Bearer " + spotifyResponse.data.access_token,
      },
    }
  );
  const artists2medium = await axios.get(
    "https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=50&offset=49",
    {
      headers: {
        Authorization: "Bearer " + spotifyResponse.data.access_token,
      },
    }
  );
  const artists1long = await axios.get(
    "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=49&offset=0",
    {
      headers: {
        Authorization: "Bearer " + spotifyResponse.data.access_token,
      },
    }
  );
  const artists2long = await axios.get(
    "https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=50&offset=49",
    {
      headers: {
        Authorization: "Bearer " + spotifyResponse.data.access_token,
      },
    }
  );
    
    //console.log(spotifyResponse.data);
    console.log(artists1short.data);
    //console.log(data2.data);

    res.send(
      '<link rel="stylesheet" type="text/css" href="css/home.css" />' +
      "<main>" +
      "<h1>Spotify Statistics</h1>" +
      "<div id='statsContainer'>" +
        "<div id='tracksContainer'>" +
        "<h2>Top Tracks</h2>" +
          "<div id='trackLists'>" +
          "<div class='olContainer'>" +
            "<h3>4 Weeks</h3>" +
            "<ol>" +
            tracks1short.data.items.map((item) => "<li><img src='"+ item.album.images[2].url + "'><br>" + item.name + "</li>").join("") +
            tracks2short.data.items.map((item) => "<li><img src='"+ item.album.images[2].url + "'><br>" + item.name + "</li>").join("") +
           "</ol>" +
          "</div>" +
          "<div class='olContainer'>" +
            "<h3>6 Months</h3>" +
            "<ol>" +
            tracks1medium.data.items.map((item) => "<li><img src='"+ item.album.images[2].url + "'><br>" + item.name + "</li>").join("") +
            tracks2medium.data.items.map((item) => "<li><img src='"+ item.album.images[2].url + "'><br>" + item.name + "</li>").join("") +
            "</ol>" +
          "</div>" +
          "<div class='olContainer'>" +
            "<h3>Lifetime</h3>" +
            "<ol>" +
            tracks1long.data.items.map((item) => "<li><img src='"+ item.album.images[2].url + "'><br>" + item.name + "</li>").join("") +
            tracks2long.data.items.map((item) => "<li><img src='"+ item.album.images[2].url + "'><br>" + item.name + "</li>").join("") +
            "</ol>" +
          "</div>" +
          "</div>" +
        "</div>" +
        "<div id='artistsContainer'>" +
          "<h2>Top Artists</h2>" +
          "<div id='artistLists'>" +
          "<div class='olContainer'>" +
            "<h3>4 Weeks</h3>" +
            "<ol>" +
            artists1short.data.items.map((item) => "<li><img src='"+ item.images[2].url + "' width='64'><br>" + item.name + "</li>").join("") +
            artists2short.data.items.map((item) => "<li><img src='"+ item.images[2].url + "' width='64'><br>" + item.name + "</li>").join("") +
            "</ol>" +
          "</div>" +
          "<div class='olContainer'>" +
            "<h3>6 Months</h3>" +
            "<ol>" +
            artists1medium.data.items.map((item) => "<li><img src='"+ item.images[2].url + "' width='64'><br>" + item.name + "</li>").join("") +
            artists2medium.data.items.map((item) => "<li><img src='"+ item.images[2].url + "' width='64'><br>" + item.name + "</li>").join("") +
            "</ol>" +
          "</div>" +
          "<div class='olContainer'>" +
            "<h3>Lifetime</h3>" +
            "<ol>" +
            artists1long.data.items.map((item) => "<li><img src='"+ item.images[2].url + "' width='64'><br>" + item.name + "</li>").join("") +
            artists2long.data.items.map((item) => "<li><img src='"+ item.images[2].url + "' width='64'><br>" + item.name + "</li>").join("") +
            "</ol>" +
          "</div>" +
          "</div>" +
        "</div>" +
      "</div>" +
      "</main>"
    );  
});

// Client ID: 5993ee842578446b8a04289c6f6676b9
// Client Secret: cd647456b8f24150bbf6d048f2f4bcd0