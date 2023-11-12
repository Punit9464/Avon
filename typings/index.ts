import {
  ClusterManager,
  HeartbeatManager,
  ReClusterManager,
  messageType,
} from "discord-hybrid-sharding";
import AvonConfig from "./src/config/Config.js";
const Config = new AvonConfig();
const manager = new ClusterManager("./build/src/avon.js", {
  totalClusters: "auto",
  totalShards: "auto",
  respawn: true,
  token: Config.token,
  shardsPerClusters: 7,
  mode: "process",
  restarts: { max: 5, interval: 60000 * 60 },
  spawnOptions: {
    amount: "auto",
    delay: 10000,
    timeout: -1,
  },
});

manager.extend(
  new HeartbeatManager({
    interval: 2000,
    maxMissedHeartbeats: 5,
  })
);

manager.extend(new ReClusterManager());

manager.on("clusterReady", (cluster) =>
  console.log(`Cluster ready :${cluster.id}`)
);
manager.on("clusterCreate", (cluster: any) => {
  cluster.on("message", (message: any) => {
    console.log(message);
    if (message?._type !== messageType.CUSTOM_REQUEST) return;
    message.reply({
      content: `Hello Avon!`,
    });
    setInterval(() => {
      cluster.send({ content: `I am Alive!` });
      cluster
        .request({ content: `Are you alive?`, alive: true })
        .then((e: any) => console.log(e));
    }, 5000);
  });
  console.log(`Cluster is Created: ${cluster.id}`);
});
manager.on("debug", (info) => console.info(info));
manager.spawn();

process.on("unhandledRejection", async (e: any) => {
  console.log(e);
});
