const { ShardingManager } = require("discord.js");
const {token} = require(`../config.json`);
const manager = new ShardingManager('src/index.js',{
    totalShards : 3,
    respawn : true,
    token : token,
    autoSpawn : true,
    shardList : "auto"
});
manager.spawn();
