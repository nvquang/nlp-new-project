const config = {
  mongoURL: process.env.MONGO_URL || 'mongodb://admin:admin@cluster0-shard-00-00-svsgx.mongodb.net:27017,cluster0-shard-00-01-svsgx.mongodb.net:27017,cluster0-shard-00-02-svsgx.mongodb.net:27017/mern-starter?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin',
  port: process.env.PORT || 8000,
};

export default config;
