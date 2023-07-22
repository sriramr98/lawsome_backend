export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    firebase: {
        databaseURL: process.env.FIREBASE_DB_URL,
    },
});
