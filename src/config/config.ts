export default () => ({
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.SQL_HOST,
        port: parseInt(process.env.SQL_PORT, 10) || 3306,
        username: process.env.SQL_USERNAME,
        password: process.env.SQL_PASSWORD,
        database: process.env.SQL_DATABASE,
    },
    pinecone: {
        apiKey: process.env.PINECONE_API_KEY,
        env: process.env.PINECONE_ENV,
        index: process.env.PINECONE_INDEX,
    },
    ai: {
        azureApiKey: process.env.AZURE_OPENAI_API_KEY,
        azureApiEmbeddingDeploymentName:
            process.env.AZURE_OPENAI_API_EMBEDDING_DEPLOYMENT_NAME,
        azureApiDeploymentName: process.env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
        azureApiVersion: process.env.AZURE_OPENAI_API_VERSION,
        azureApiInstanceName: process.env.AZURE_OPENAI_API_INSTANCE_NAME,
    },
});
