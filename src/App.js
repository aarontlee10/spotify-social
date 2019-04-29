import React, { Component } from "react";
import Spotify from "spotify-web-api-js";
import ArtistCards from "./ArtistCards.jsx";
import Search from "./Search.jsx";
// import { Input, InputGroup, Form } from "reactstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      following: [],
      currentDevice: "",
      artists: []
    };
  }

  getSearchResults = results => {
    if (results.length !== 0) {
      this.setState({ artists: results });
    } else {
      this.getTopArtists();
    }
  };

  getTopArtists = async () => {
    const options = {
      limit: 10
    };

    await this.spotifyClient.getMyTopArtists(options).then(data => {
      var artistIds = [];
      data.items.map(artist => artistIds.push(artist.id));
      this.setState({ artists: artistIds });
    });
  };

  async componentDidMount() {
    if (window.location.hash) {
      // Remove the "#"
      const queryString = window.location.hash.substring(1);
      // Parse the access_token out
      this.accessToken = new URLSearchParams(queryString).get("access_token");
      this.spotifyClient = new Spotify();
      this.spotifyClient.setAccessToken(this.accessToken);

      this.setState({
        authenticated: true
      });
    }
  }

  render() {
    if (!this.state.authenticated) {
      return (
        <a
          href={`https://accounts.spotify.com/authorize/?client_id=468f8ece2880441da7f5c9531877c6ac&response_type=token&redirect_uri=${window
            .location.origin +
            window.location
              .pathname}&scope=user-read-playback-state user-modify-playback-state user-top-read user-read-private`}
        >
          Login with Spotify
        </a>
      );
    }
    if (this.state.artists.length > 0) {
      return (
        // <ArtistCard
        //   Spotify={this.spotifyClient}
        //   artistId={this.state.artists[0].id}
        // />
        <div>
          <Search
            spotifyClient={this.spotifyClient}
            passSearchResults={this.getSearchResults}
          />
          <ArtistCards
            Spotify={this.spotifyClient}
            artists={this.state.artists}
          />
        </div>
      );
    }
    this.getTopArtists();
    return <div />;
  }
}

export default App;
