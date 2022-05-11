
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
            instance_var: 'INSTANCE_ID',
            instances: -1,
            exec_mode: 'cluster',
            min_uptime: 5000,
            max_restarts: 5,
            args: '',
            env: { NODE_ENV:'production' }
        }
    ]
};