module.exports = {
  apps: [{
    name: 'prantik-cicd',
    cwd: '/home/ubuntu/projects/with-cicd/ticketing/backend',
    script: './dist/index.js',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '400M',
    kill_timeout: 5000,

    env_production: {
      NODE_ENV: 'production',
      PORT: '5501',
      DATABASE_URL: process.env.DATABASE_URL
    },

    error_file: '/home/ubuntu/.pm2/logs/prantik-cicd-error.log',
    out_file: '/home/ubuntu/.pm2/logs/prantik-cicd-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
