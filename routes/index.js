var express = require('express');
var router = express.Router();
const axios = require('axios');
const spotify = require('../library/Spotify');
const { Spotify } = require('../models');
const { Op } = require('sequelize');
/**
 * @swagger
 * definitions:
 *   ISRCpost:
 *     type: object
 *     properties:
 *       ISRC:
 *         type: string
 *         description: The ISRC of the track
 *         example: "USVT10300001"
 */

/**
 * @swagger
 * /:
 *   post:
 *     tags:
 *       - Spotify
 *     description: Create a new Spotify track by ISRC
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: ISRC
 *         description: Spotify ISRC
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/ISRCpost'
 *     responses:
 *       200:
 *         description: Track created
 *       400:
 *         description: No ISRC provided
 *       409:
 *         description: Track already exists in db
 *       404:
 *         description: Track not found
 */
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

/**
 * @swagger
 * /isrc/{isrc}:
 *   get:
 *     tags:
 *       - Spotify
 *     description: Get a Spotify track by ISRC
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: isrc
 *         description: Spotify ISRC
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A Spotify track
 *       404:
 *         description: Track not found
 */
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

/**
 * @swagger
 * /artist/{artist}:
 *   get:
 *     tags:
 *       - Spotify
 *     description: Get a Spotify track by artist
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: artist
 *         description: Artist name
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A Spotify track
 *       404:
 *         description: Track not found
 */
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
