
'use strict';

module.exports = {
    apps: [
        {
            name: "Wal-Server",
            script: "./dist/app.js",
            watch: [
                "src",
                "dist",
                ".env",
                "package.json"
            ],
            instance_var: 'NODE_APP_INSTANCE',
            instances: -1,
            exec_mode: 'cluster',
            min_uptime: 5000,
            max_restarts: 5,
            args: '',
            env: { PORT: 8080, NODE_ENV:'production' }
        }
    ]
};