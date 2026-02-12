module.exports = {
  apps: [{
    name: 'swg-audit',
    script: 'npm',
    args: 'run dev',
    cwd: '/root/.openclaw/workspace/SWG-Audit',
    watch: ['src', 'public', 'lib'],
    ignore_watch: ['node_modules', 'dist', 'logs', 'temp', '.git', '*.md'],
    watch_options: {
      followSymlinks: false,
      usePolling: false
    },
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    error_file: '/root/.pm2/logs/swg-audit-error.log',
    out_file: '/root/.pm2/logs/swg-audit-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true
  }]
};
