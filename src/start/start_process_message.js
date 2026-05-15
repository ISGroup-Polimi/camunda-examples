import { Camunda8 } from '@camunda8/sdk'


void (async () => {
    const messageId = process.argv[2]

    if (!messageId) {
        console.error('Error: messageId must be provided as an argument')
        console.error('Usage: node start_process_message.js <messageId>')
        process.exit(1)
    }

    const client = new Camunda8({
        ZEEBE_GRPC_ADDRESS: 'grpc://localhost:26500',
        ZEEBE_REST_ADDRESS: 'http://localhost:8080',
        ZEEBE_CLIENT_ID: 'orchestration',
        ZEEBE_CLIENT_SECRET: 'secret',
        CAMUNDA_OAUTH_STRATEGY: 'OAUTH',
        CAMUNDA_OAUTH_URL:
            'http://localhost:18080/auth/realms/camunda-platform/protocol/openid-connect/token',
        CAMUNDA_TASKLIST_BASE_URL: 'http://localhost:8082',
        CAMUNDA_OPERATE_BASE_URL: 'http://localhost:8081',
        CAMUNDA_OPTIMIZE_BASE_URL: 'http://localhost:8083',
        CAMUNDA_MODELER_BASE_URL: 'http://localhost:8070/api',
        CAMUNDA_TENANT_ID: '', // We can override values in the env by passing an empty string value
        CAMUNDA_SECURE_CONNECTION: false,
    }).getCamundaRestClient()

    const proc = await client.publishMessage({
        messageId: messageId,
        name: messageId,
        timeToLive: 10,
        variables: { a: 9, b: 9}
    });

    console.log("process instance started")
    process.exit(0)
})()