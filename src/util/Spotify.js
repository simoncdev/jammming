const clientID = '3d21c0b964cf401f890c73ed786de28a';
const redirect = "http://scared-gold.surge.sh";


let token;

const Spotify = {
  getAccessToken() {
    if (token){
          return token;
  }

  const tokenMatch = window.location.href.match(/access_token=([^&]*)/)
	const expireMatch = window.location.href.match(/expires_in=([^&]*)/)

  if (tokenMatch && expireMatch) {
    token = tokenMatch[1];
    const expiresIn = Number(expireMatch[1]);

    window.setTimeout(() => token = '', expiresIn * 1000);
    window.history.pushState('Access Token', null, '/');
    console.log(token)
    return token;
  }
  else {
    const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirect}`;
			window.location = accessUrl;
  }
},
  search(searchTerm) {
    const token = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`,
    { headers: { Authorization: `Bearer ${token}`}
  }
).then( response => {return response.json()}).then(
  json => {
    if (!json.tracks) {
      return [];
    }
    return json.tracks.items.map(
      track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        uri: track.uri
      })
    )
  }
)
},

  savePlaylist(playlistName, trackURIs) {
    if(!playlistName || !trackURIs){
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { 'Authorization': `Bearer ${accessToken}`}
    let userID;
    let playlistID;

    return fetch(`https://api.spotify.com/v1/me`, {headers:headers}).then(
      response => {
        if(response.ok){
          return response.json()
        }
        throw new Error('Error obtaining UserID');
      }
    ).then(
      responseJSON => {
        userID = responseJSON.id;
        headers['Content-Type'] = 'application/json';
        let bodyString = JSON.stringify({  name: JSON.stringify(playlistName) });

				fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, { method: 'POST', headers: headers, body: bodyString }).then(
				  response => {
					if(response.ok) {
					  return response.json()
					}
					throw new Error("Error creating new playlist for user.");
				  }
				).then(
				  responseJSON => {
					playlistID = responseJSON.id;

					bodyString = JSON.stringify({ uris: trackURIs });
					fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`, {method: 'POST', headers: headers, body: bodyString}).then(
					  response => {
						if(!response.ok) {
						  throw new Error("Error adding tracks to playlist.");
						}
					  }
					).catch(
					  error => {
						console.log(`AddTrackToPlaylistError: ${error}`);
						return false;
					  }
					);
				  }
				).catch(
				  error => {
					console.log(`CreatePlaylistError: ${error}`);
					return false;
				  }
				)
				return true;
			  }
			).catch(error => {
			  console.log(`GetUserIDError ${error}`);
			  return false;
			});
      }
  }

export default Spotify;
