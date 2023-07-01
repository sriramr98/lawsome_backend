export default {
  db: {
    database: process.env.SQL_DATABASE || "test",
    username: process.env.SQL_USERNAME || "root",
    password: process.env.SQL_PASSWORD || "root",
    host: process.env.SQL_HOST || "localhost",
    port: process.env.SQL_PORT || 3306,
    uri: process.env.SQL_URI || "",
  },
  firebase: {
    databaseURL: process.env.FIREBASE_DATABASE_URL || "",
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY || "",
    environment: process.env.PINECONE_ENVIRONMENT || "",
    indexName: process.env.PINECONE_INDEX_NAME || "",
  }
};
