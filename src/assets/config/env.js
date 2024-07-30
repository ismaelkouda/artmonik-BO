(function (window) {
    window.__env = window.__env || {};

    // PROD Config
    window.__env.prod = {
        apiUrl: 'https://kestrelci.net/backend/api/v1/',
        fileUrl: 'https://kestrelci.net/backend/',
        environmentDeployment: 'PROD',
        enableDebug: false
    };

    // DEV Config
    window.__env.dev = {
        apiUrl: 'http://localhost/kestrelci_backend/api/v1/',
        fileUrl: 'http://localhost/kestrelci_backend/',
        environmentDeployment: 'DEV',
        enableDebug: true
    };

    window.__env.currentEnv = window.__env.dev;

}(this));
