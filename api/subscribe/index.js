const { CosmosClient } = require('@azure/cosmos');

module.exports = async function (context, req) {
    context.log('Push notification subscription request received');

    // CORS headers for browser requests
    context.res = {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    };

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
        context.res.status = 200;
        return;
    }

    if (req.method !== 'POST') {
        context.res.status = 405;
        context.res.body = { error: 'Method not allowed' };
        return;
    }

    try {
        const { subscription, userAgent } = req.body;

        // Validate subscription object
        if (!subscription || !subscription.endpoint || !subscription.keys) {
            context.res.status = 400;
            context.res.body = { 
                success: false, 
                error: 'Invalid subscription object' 
            };
            return;
        }

        // Initialize Cosmos DB client
        const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
        if (!connectionString) {
            throw new Error('Cosmos DB connection string not configured');
        }

        const client = new CosmosClient(connectionString);
        const database = client.database('HomeMuscleBuilder');
        const container = database.container('PushSubscriptions');

        // Create subscription document
        const subscriptionDoc = {
            id: generateSubscriptionId(),
            endpoint: subscription.endpoint,
            keys: subscription.keys,
            userAgent: userAgent || 'Unknown',
            createdAt: new Date().toISOString(),
            lastUsed: new Date().toISOString(),
            ttl: 7776000 // 90 days in seconds
        };

        // Save to Cosmos DB
        await container.items.create(subscriptionDoc);

        context.log('Subscription saved successfully:', subscriptionDoc.id);

        context.res.status = 201;
        context.res.body = {
            success: true,
            subscriptionId: subscriptionDoc.id,
            message: 'Subscription saved successfully'
        };

    } catch (error) {
        context.log.error('Error saving subscription:', error);
        
        context.res.status = 500;
        context.res.body = {
            success: false,
            error: 'Internal server error'
        };
    }
};

function generateSubscriptionId() {
    return 'sub_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}
