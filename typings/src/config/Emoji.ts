export default class AvonEmoji extends Object {
  [x: string]: any;
  constructor(client: any) {
    super();
    this.tick = "<:avontick:1129741544694485024>";
    this.cross = "<:avoncross:1129741483998724206>";
    this.playing = "<a:nowplaying:1129817857727942738>";
    this.exclamation = "<:avonexe:1129744498449207296> ";
    this.queue = "<:avonquaie:1129744532074922014> ";
    this.info = "<:avoninfo2:1129751345226850375> ";
    this.defSearch = "<a:premium_avon:1064927294730272939>";
    this.premium = "<a:premium_avon:1064927294730272939>";
    this.invite = "<:T_RedInvite:1130724489911599125>";
    this.support = "<:Support:1130724620757127189>";
    this.spotiSearch = "<a:spotify:1129816498853138502>";
    this.deezSearch = "<:Deezer_avon:1065634451603861545>";
    this.vote = "<:vote_avon:1064932747400982588>";
    this.soundSearch = "<:Soundcloud_avon:1065634569262473277>";
    this.badges = {
      named: "<:owner:1073672248885518597>",
      owner: "<:avonowner:1129738528209780836>",
      dev: "<:avondev:1129738531527458856>",
      admin: "<:avonadmin:1129738535952449628>",
      codev: "<:avoncodev:1129738585713692682>",
      author: "<:author_avon:1129990460128108554>",
      friend: "<:avonfriend:1129744517080301638>",
      vip: "<:avonvip:1129741519243460698>",
      premiumUser: "<:avonpremium:1129741537731948544>",
      mod: "<:avonmod:1129741496858447982>",
      staff: "<:avonstaff:1129741494157328486>",
      supporter: "<:avonsupporter:1129741524536672378>",
      user: "<:avonmembers:1129741529448185917>",
    };
    this.helpMenu = {
      music: "<:Avon_Music:1130897739086045208>",
      home: "<:Avon_Home:1131253449158307850>",
      filters: "<:Avon_Filters:1130897583242485891>",
      info: "<:Avon_Info:1130897649000783893>",
      utility: "<:Avon_Utility:1130897694605459497>",
      allCommands: "<:Avon_AllCommands:1130897613131108402>",
    };
    this.setup = {
      pause: "<:avonpause:1129738547176419348>",
      resume: "<:avonplay:1129738549739147294>",
      skip: "<:avonslip:1129744547644190770>",
      previous: "<:avonright:1129738558660423680>",
      shuffle: "<:avonsuffle:1129751417138196623>",
      author: "<a:8accountsolid1:1094833733984604211>",
      nowPlaying: "<a:77pausesolid:1094833726753603735>",
      requester: "<a:19booksolid1:1094833798941786192>",
      duration: "<a:67clocksolid1:1094833814204846180>",
      stop: "<:avonstop:1129747306040791180>",
      loop: "<:avonrequest:1129747309094260837>",
      volLow: "<:avonvolminus:1129744510814011543>",
      volHigh: "<:avonvol:1129738595603857489>",
      fav: "<:avonfav:1129751420099375144>",
      autoplay: "<a:botautoplay:1105072801779568701>",
      filters: "<:avonfilter:1129751347869265920>",
    };
    this.avonNew = {
      emote: "<a:botplaying:1129819082343063664>",
      nowPlaying: "<a:botplaying:1129819082343063664>",
      requester: "<:avonrequest:1129747309094260837>",
      duration: "<:avontime:1129747295726997545>",
      author: "<:author_avon:1129990460128108554>",
      pause: "<:Pause:1129824564386467991>",
      resume: "<:resume:1129824021618380801>",
      skip: "<:forward10:986893749005217812>",
      fav: "",
      previous: "<:Avon_Previous:1137298056283430982>",
      stop: "<:stop:1129823823399751690>",
    };
    this.spotify = {
      emote: "<a:spotify:1129816498853138502>",
      filters: "<:filter:1100222067938435152>",
      nowPlaying: "<a:spotify:1129816498853138502>",
      requester: "<:avonrequest:1129747309094260837>",
      duration: "<:avontime:1129747295726997545>",
      pause: "<:ss_pause:1099927332204073011>",
      author: "<:author_avon:1066716583365447720>",
      resume: "<:resume:1099927448734408744>",
      stop: "<:ss_stop:1099927856651436082>",
      loop: "<:loop:1129823572991426651>",
      shuffle: "<:shuffle:1139766210213462066>",
      forward: "<:backward:1129823401175949322>",
      backward: "<:forward10:1129823372008759327>",
      volLow: "<:lower_vol:1139766602527690902>",
      volHigh: "<:higher_vol:1139766719917854751>",
      previous: "<:Avon_Previous:1137298056283430982>",
      skip: "<:last:1139768093766336632>",
    };
    this.special = {
      emote: "<a:premium_avon:1064927294730272939>",
      nowPlaying: "<a:premium_avon:1064927294730272939>",
      requester: "<:avonrequest:1129747309094260837>",
      duration: "<:avontime:1129747295726997545>",
      pause: "<:ss_pause:1099927332204073011>",
      author: "<:author_avon:1066716583365447720>",
      resume: "<:resume:1099927448734408744>",
      stop: "<:ss_stop:1099927856651436082>",
      loop: "<:loop:1129823572991426651>",
      shuffle: "<:shuffle:1139766210213462066>",
      forward: "<:backward:1129823401175949322>",
      backward: "<:forward10:1129823372008759327>",
      volLow: "<:lower_vol:1139766602527690902>",
      volHigh: "<:higher_vol:1139766719917854751>",
      previous: "<:Avon_Previous:1137298056283430982>",
      skip: "<:last:1139768093766336632>",
    };
    this.noButtons = {
      emote: "<a:botplaying:1129819082343063664>",
      nowPlaying: "<a:botplaying:1129819082343063664>",
      author: "<:author_avon:1066716583365447720>",
      requester: "<:avonrequest:1129747309094260837>",
      duration: "<:avontime:1129747295726997545>",
      filters: "<:filter:1100222067938435152>",
    };
    this.simple = {
      emote: "<a:nowplaying:1129817857727942738>",
      nowPlaying: "<a:nowplaying:1129817857727942738>",
      requester: "<:avonrequest:1129747309094260837>",
      author: "<:author_avon:1066716583365447720>",
      duration: "<:avontime:1129747295726997545>",
      filters: "<:filter:1100222067938435152>",
      pause: "<:ss_pause:1099927332204073011>",
      resume: "<:resume:1099927448734408744>",
      stop: "<:stop:1129823823399751690>",
      skip: "<:skip:1099927755342233720>",
      loop: "<:loop:1129823572991426651>",
    };
    this.oldStyle = {
      emote: "<a:nowplaying:1129817857727942738>",
      nowPlaying: "<a:nowplaying:1129817857727942738>",
      author: "<:author_avon:1129990460128108554>",
      requester: "<:avonrequest:1129747309094260837>",
      duration: "<:avontime:1129747295726997545>",
    };
  }
}
