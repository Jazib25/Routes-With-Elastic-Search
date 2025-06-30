const { Client } = require('@elastic/elasticsearch')

async function getESClient() {
    try {
        const client = new Client({
            node: "https://electric-es-staging.es.eastus2.azure.elastic-cloud.com:9243/",
            auth: { username: 'elastic',
                    password: '3rbC8UePJgRWxs2VtzDeFuSb' },
            })
        console.log("Connected to Elasticsearch successfully");
        return client;
    } catch (error) {
        console.error("Error connecting to Elasticsearch:", error);
    }
}

async function connectElasticDB() {
    const client = await getESClient();
    if (!client) {
        throw new Error("Failed to connect to Elasticsearch");
    }
    try {
        await client.cluster.health();
    } catch (error) {                           
        console.error("Error checking Elasticsearch cluster health:", error);
    }
    return client;
}
module.exports = {
    connectElasticDB,
    getESClient
};