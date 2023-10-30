var express = require('express');
var router = express.Router();
const axios = require('axios');
const spotify = require('../library/Spotify');
const { Spotify } = require('../models');
const { Op } = require('sequelize');



router.post('/', async function (req, res, next) {

  //Get ISRC from request
  if (!req.body.ISRC) return res.json({ msg: "No ISRC provided" });

  let ISRC = req.body.ISRC;

  //Check in db if ISRC exists
  let dbTrack = await Spotify.findOne({
    where: {
      ISRC
    }
  });
  if (dbTrack) {
    let track = dbTrack.get();
    return res.json({ msg: "Track already exists in db" });
  } else {
    const token = await spotify.getToken();
    let tracks = await spotify.getTrackData(token, ISRC);
    console.log(tracks.tracks.items.length);
    if (tracks.tracks.items.length == 0) return res.json({ msg: "Track not found" });
    let mostPopularTrack = tracks.tracks.items.sort((a, b) => b.popularity - a.popularity)[0];
    let payload = {
      "ISRC": ISRC,
      "image": mostPopularTrack.album.images[0].url,
      "artist": mostPopularTrack.artists[0].name,
      "track": mostPopularTrack.name,
    };
    //Save to db
    await Spotify.create({
      ...payload
    });
  }

  res.json({ msg: "Track created" });
});

//get By ISRC
router.get('/isrc/:ISRC', async function (req, res, next) {
  let ISRC = req.params.ISRC;
  let track = await Spotify.findOne({
    where: {
      ISRC
    }
  });
  if (!track) return res.json({ msg: "Track not found" });
  res.json(track);
});

//search by artist
router.get('/artist/:artist', async function (req, res, next) {
  let artist = req.params.artist;
  let tracks = await Spotify.findAll({
    where: {
      artist: {
        [Op.like]: `%${artist}%`
      }
    }
  });
  if (!tracks) return res.json({ msg: "No tracks found" });
  res.json(tracks);
});

module.exports = router;
