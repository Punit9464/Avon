import { LavasfyClient } from "lavasfy";
export default class AvonSpotify extends LavasfyClient {
  constructor(client: any) {
    super(
      {
        clientID: client.config.spotiId,
        clientSecret: client.config.spotiSecret,
        playlistLoadLimit: 4,
        useSpotifyMetadata: true,
        audioOnlyResults: true,
        autoResolve: true,
      },
      client.config.spotiNodes
    );
  }
}
