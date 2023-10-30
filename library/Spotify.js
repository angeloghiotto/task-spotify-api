const axios = require('axios');

function getToken() {
    const client_id = '950f5c5b4fd24ffd9fb3c75f0a272328';
    const client_secret = '88884d5aa29b4ba0844d6bcbb38a2e8b';
    return axios.post('https://accounts.spotify.com/api/token', {
        grant_type: 'client_credentials'
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        }
    }).then(function (response) {
        return response.data.access_token;
    }).catch(function (error) {
        console.log(error);
        return null;
    });
}

function getTrackData(token, trackId) {
    return axios.get('https://api.spotify.com/v1/search?q=isrc:' + trackId + '&type=track', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(function (response) {
        return response.data;
    }).catch(function (error) {
        console.log(error);
        return null;
    });
}

module.exports = {
    getToken: getToken,
    getTrackData: getTrackData
};