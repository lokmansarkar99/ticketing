module.exports = {
  apps: [{
    name: 'prantik-cicd',
    script: 'src/index.ts',
    cwd: '/home/ubuntu/projects/prantik-cicd',
    interpreter: 'node',
    interpreter_args: '-r ts-node/register/transpile-only --max-old-space-size=1024',
    exec_mode: 'fork',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '400M',
    kill_timeout: 5000,
    env: {
      NODE_ENV: 'production',
      PORT: 5501,          
      TS_NODE_TRANSPILE_ONLY: 'true',
      DATABASE_CONNECTION_LIMIT: '5'
    },
    error_file: '/home/ubuntu/.pm2/logs/prantik-cicd-error.log',
    out_file: '/home/ubuntu/.pm2/logs/prantik-cicd-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};