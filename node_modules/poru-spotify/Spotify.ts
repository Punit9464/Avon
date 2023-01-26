import {fetch, Request} from "undici";
//import { trackInfo } from "poru/src/guild/Track";
import { Plugin ,Poru , ResolveOptions,Track} from "poru";
let spotifyPattern =
  /^(?:https:\/\/open\.spotify\.com\/(?:user\/[A-Za-z0-9]+\/)?|spotify:)(album|playlist|track|artist)(?:[/:])([A-Za-z0-9]+).*$/;
export interface SpotifyOptions {
  clientID: string;
  clientSecret: string;
  playlistLimit?: number;
  albumLimit?: number;
  artistLimit?: number;
  searchMarket?: string;
}


export interface SpotifyAccessTokenAPIResult {
    access_token?: string;
    expires_in: number;
}


export class Spotify extends Plugin {
  private baseURL: string;
  private authorization: string;
  private token:string
  private interval:number;
  public poru:Poru;
  public options: SpotifyOptions;
  private _search!: ({query,source,requester}:ResolveOptions)=> any;


  constructor(options: SpotifyOptions) {
    super("Spotify");
    this.baseURL = "https://api.spotify.com/v1";
    this.authorization = Buffer.from(`${options.clientID}:${options.clientSecret}`).toString("base64");
    this.options = {
      playlistLimit: options.playlistLimit,
      albumLimit: options.albumLimit,
      artistLimit: options.artistLimit,
      searchMarket: options.searchMarket,
      clientID: options.clientID,
      clientSecret: options.clientSecret,
    };
    this.interval = 0;
  }



public check(url:string):boolean {
    return spotifyPattern.test(url);
  }

public async load(poru:Poru){
    this.poru = poru;
    this._search = poru.resolve.bind(poru);
    poru.resolve = this.resolve.bind(this);
}


async requestToken() {
 
    try {
      const data = await fetch(
        "https://accounts.spotify.com/api/token?grant_type=client_credentials",
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${this.authorization}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const body = await data.json() as SpotifyAccessTokenAPIResult

      this.token = `Bearer ${body.access_token}`;
      this.interval = body.expires_in * 1000;
    } catch (e:any) {
      if (e.status === 400) {
        throw new Error("Spotify Plugin has been rate limited");
      }
    }
  }

  public async renew() {
    if (Date.now() >= this.interval) {
      await this.requestToken();
    }
  }

  public async requestData(endpoint) {
    await this.renew();

    const req = await fetch(`${this.baseURL}${/^\//.test(endpoint) ? endpoint : `/${endpoint}`}`,
      {
        headers: { Authorization: this.token },
      }
    );
    const data = await req.json();
    return data;
  }






public async resolve({query,source,requester}:ResolveOptions){

    if (!this.token) await this.requestToken();
    if(source ==="spotify"&& !this.check(query)) return this.fetch(query,requester);

    const data = spotifyPattern.exec(query) ?? [];
    const id:string = data[2];
    switch (data[1]) {
      case "playlist": {
        return this.fetchPlaylist(id,requester);
      }
      case "track": {
        return this.fetchTrack(id,requester);
      }
      case "album": {
        return this.fetchAlbum(id,requester);
      }
      case "artist": {
        return this.fetchArtist(id,requester);
      }
    }


}
async fetchPlaylist(id,requester:any) {
    try {
      const playlist:any = await this.requestData(`/playlists/${id}`);
      await this.fetchPlaylistTracks(playlist);

      const limitedTracks = this.options.playlistLimit
        ? playlist.tracks.items.slice(0, this.options.playlistLimit): playlist.tracks.items;

      const unresolvedPlaylistTracks = await Promise.all(
        limitedTracks.map((x:any) => this.buildUnresolved(x.track,requester))
      );

      return this.buildResponse("PLAYLIST_LOADED",unresolvedPlaylistTracks,playlist.name);
    } catch (e:any) {
      return this.buildResponse(
        e.status === 404 ? "NO_MATCHES" : "LOAD_FAILED",
        [],
        undefined,
        e.body?.error.message ?? e.message
      );
    }
  }

  async fetchAlbum(id:string,requester:any) {
    try {
      const album:any = await this.requestData(`/albums/${id}`);

      const limitedTracks = this.options.albumLimit
        ? album.tracks.items.slice(0, this.options.albumLimit * 100)
        : album.tracks.items;

      const unresolvedPlaylistTracks = await Promise.all(
        limitedTracks.map((x:any) => this.buildUnresolved(x,requester))
      );
      return this.buildResponse(
        "PLAYLIST_LOADED",
        unresolvedPlaylistTracks,
        album.name
      );
    } catch (e:any) {
      return this.buildResponse(
        e.body?.error.message === "invalid id" ? "NO_MATCHES" : "LOAD_FAILED",
        [],
        undefined,
        e.body?.error.message ?? e.message
      );
    }
  }

  async fetchArtist(id,requester:any) {
    try {
      const artist:any = await this.requestData(`/artists/${id}`);

      const data:any = await this.requestData(
        `/artists/${id}/top-tracks?market=${this.options.searchMarket ?? "US"}`
      );

      const limitedTracks = this.options.artistLimit
        ? data.tracks.slice(0, this.options.artistLimit * 100)
        : data.tracks;

      const unresolvedPlaylistTracks = await Promise.all(
        limitedTracks.map((x:any) => this.buildUnresolved(x,requester))
      );

      return this.buildResponse(
        "PLAYLIST_LOADED",
        unresolvedPlaylistTracks,
        artist.name
      );
    } catch (e:any) {
      return this.buildResponse(
        e.body?.error.message === "invalid id" ? "NO_MATCHES" : "LOAD_FAILED",
        [],
        undefined,
        e.body?.error.message ?? e.message
      );
    }
  }

  async fetchTrack(id,requester:any) {
    try {
      const data = await this.requestData(`/tracks/${id}`);
      const unresolvedTrack = await this.buildUnresolved(data,requester);

      return this.buildResponse("TRACK_LOADED", [unresolvedTrack]);
    } catch (e:any) {
      return this.buildResponse(
        e.body?.error.message === "invalid id" ? "NO_MATCHES" : "LOAD_FAILED",
        [],
        undefined,
        e.body?.error.message ?? e.message
      );
    }
  }

  async fetch(query:string,requester:any) {
    try {
      if (this.check(query)) return this.resolve({query,source:this.poru.options.defaultPlatform,requester});

      const data:any = await this.requestData(
        `/search/?q="${query}"&type=artist,album,track&market=${
          this.options.searchMarket ?? "US"
        }`
      );
      const unresolvedTracks = await Promise.all(
        data.tracks.items.map((x:any) => this.buildUnresolved(x,requester))
      );
      return this.buildResponse("TRACK_LOADED", unresolvedTracks);
    } catch (e:any) {
      return this.buildResponse(
        e.body?.error.message === "invalid id" ? "NO_MATCHES" : "LOAD_FAILED",
        [],
        undefined,
        e.body?.error.message ?? e.message
      );
    }
  }


  async fetchPlaylistTracks(spotifyPlaylist:any) {
    let nextPage = spotifyPlaylist.tracks.next;
    let pageLoaded = 1;
    while (nextPage) {
      if (!nextPage) break;
      const req = await fetch(nextPage, {
        headers: { Authorization: this.token },
      });
      const body:any = await req.json();
      if (body.error) break;
      spotifyPlaylist.tracks.items.push(...body.items);

      nextPage = body.next;
      pageLoaded++;
    }
  }

  async buildUnresolved(track:any,requester:any) {
    if (!track) throw new ReferenceError("The Spotify track object was not provided");
    

    return new Track({
      track: "",
      info: {
        sourceName: "spotify",
        identifier: track.id,
        isSeekable: true,
        author: track.artists[0]?.name || "Unknown Artist",
        length: track.duration_ms,
        isStream: false,
        title: track.name,
        uri: `https://open.spotify.com/track/${track.id}`,
        image: track.album?.images[0]?.url,
        requester
      },
    });
  }

 
 
  compareValue(value:any) {
    return typeof value !== "undefined"
      ? value !== null
      : typeof value !== "undefined";
  }

  buildResponse(loadType:any, tracks:any, playlistName? :any, exceptionMsg?:any) {
    return Object.assign(
      {
        loadType,
        tracks,
        playlistInfo: playlistName ? { name: playlistName } : {},
      },
      exceptionMsg
        ? { exception: { message: exceptionMsg, severity: "COMMON" } }
        : {}
    );
  }
}