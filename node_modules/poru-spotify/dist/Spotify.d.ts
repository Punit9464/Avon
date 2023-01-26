import { Plugin, Poru, ResolveOptions, Track } from "poru";
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
export declare class Spotify extends Plugin {
    private baseURL;
    private authorization;
    private token;
    private interval;
    poru: Poru;
    options: SpotifyOptions;
    private _search;
    constructor(options: SpotifyOptions);
    check(url: string): boolean;
    load(poru: Poru): Promise<void>;
    requestToken(): Promise<void>;
    renew(): Promise<void>;
    requestData(endpoint: any): Promise<unknown>;
    resolve({ query, source, requester }: ResolveOptions): any;
    fetchPlaylist(id: any, requester: any): Promise<{
        loadType: any;
        tracks: any;
        playlistInfo: {
            name: any;
        } | {
            name?: undefined;
        };
    } & ({
        exception: {
            message: any;
            severity: string;
        };
    } | {
        exception?: undefined;
    })>;
    fetchAlbum(id: string, requester: any): Promise<{
        loadType: any;
        tracks: any;
        playlistInfo: {
            name: any;
        } | {
            name?: undefined;
        };
    } & ({
        exception: {
            message: any;
            severity: string;
        };
    } | {
        exception?: undefined;
    })>;
    fetchArtist(id: any, requester: any): Promise<{
        loadType: any;
        tracks: any;
        playlistInfo: {
            name: any;
        } | {
            name?: undefined;
        };
    } & ({
        exception: {
            message: any;
            severity: string;
        };
    } | {
        exception?: undefined;
    })>;
    fetchTrack(id: any, requester: any): Promise<{
        loadType: any;
        tracks: any;
        playlistInfo: {
            name: any;
        } | {
            name?: undefined;
        };
    } & ({
        exception: {
            message: any;
            severity: string;
        };
    } | {
        exception?: undefined;
    })>;
    fetch(query: string, requester: any): any;
    fetchPlaylistTracks(spotifyPlaylist: any): Promise<void>;
    buildUnresolved(track: any, requester: any): Promise<Track>;
    compareValue(value: any): boolean;
    buildResponse(loadType: any, tracks: any, playlistName?: any, exceptionMsg?: any): {
        loadType: any;
        tracks: any;
        playlistInfo: {
            name: any;
        } | {
            name?: undefined;
        };
    } & ({
        exception: {
            message: any;
            severity: string;
        };
    } | {
        exception?: undefined;
    });
}
