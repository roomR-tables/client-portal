module.exports = {
  apps: [{
    name: 'ClientPortal',
    script: './app.js',
    instances: "max",
    exec_mode: "cluster",

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    args: 'one two',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};