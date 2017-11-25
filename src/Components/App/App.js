import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {
 constructor(props) {
   super(props);

   this.state = {
     searchResults: [],
     playlistName: 'Codecademy Playlist',
     playlistTracks: []
 };

 //this.addThis = this.addThis.bind(this);
 this.addTrack = this.addTrack.bind(this);
 this.removeTrack = this.removeTrack.bind(this);
 this.updatePlaylistName = this.updatePlaylistName.bind(this);
 this.savePlaylist = this.savePlaylist.bind(this);
 this.search = this.search.bind(this);
}

 addTrack(track) {
   let tracks = this.state.playlistTracks;
   if (!tracks.includes(track)) {
     tracks.push(track);
     this.setState({playlistTracks: tracks});
   }
 }

 removeTrack(track) {
    let tracks = this.state.playlistTracks.filter(currentTrack => currentTrack.name !== track.name);
    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name })
  }

//Will have to come back to this method - Step 63
  savePlaylist() {
    let trackURIs = this.state.playlistTracks.map(track => track.uri);
    console.log(trackURIs)
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
  }


  search(searchTerm) {
    Spotify.search(searchTerm).then(
      searchResults => {
        this.setState({searchResults:searchResults})
      }
    )
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
        < SearchBar onSearch={this.search}/>
        <div className="App-playlist">
        < SearchResults searchResults = {this.state.searchResults} onAdd={this.addTrack}/>
        < Playlist playlistName = {this.state.playlistName} playlistTracks={this.state.playlistTracks} onNameChange={this.state.updatePlaylistName}
          onSave={this.savePlaylist}
        />
        </div>
        </div>
      </div>
    );
  }
}

export default App;
