import { Camunda8 } from '@camunda8/sdk'


void (async () => {

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
    
    let counter = 0;


    const addNumbersWorker = client.createJobWorker({ // The first type parameter is the input variables, the second is the output variables
        type: 'printer-worker',
        timeout: 10000, // Timeout for the job worker to complete the job before it is available for another worker poll
        maxJobsToActivate: 5, // Maximum number of jobs to process concurrently
        worker: 'printer-workerx',
        jobHandler: async (job, log) => {
            console.log('Processing printer job:', job.jobKey)
            counter++;
            console.log(`called ${counter} times`)
            // Simulate adding numbers
            await new Promise((resolve) => setTimeout(resolve, 2000))
            console.log(`counter job completed: ${job.jobKey}`)
            return job.complete({ counted: counter })
        }
    })

    console.log('Job workers started. Waiting for jobs...\n')
})()