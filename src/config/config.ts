export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development',
    firebase: {
        databaseURL: process.env.FIREBASE_DB_URL,
    },
    database: {
        host: process.env.SQL_HOST,
        port: parseInt(process.env.SQL_PORT, 10) || 3306,
        username: process.env.SQL_USERNAME,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DATABASE,
    },
});
