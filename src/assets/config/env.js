(function (window) {
    window.__env = window.__env || {};

    // PROD Config
    window.__env.prod = {
        apiUrl: 'https://artmonik.net/backend/api/v1/',
        fileUrl: 'https://artmonik.net/backend/',
        environmentDeployment: 'PROD',
        enableDebug: false
    };

    // DEV Config
    window.__env.dev = {
        apiUrl: 'https://artmonik.net/backend/api/v1/',
        fileUrl: 'https://artmonik.net/backend/',
        environmentDeployment: 'DEV',
        enableDebug: true
    };

    window.__env.currentEnv = window.__env.dev;

}(this));
