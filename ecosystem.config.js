export default {
  apps: [
    {
      name: 'hsfasaude',
      script: '/home/hsfasaude/htdocs/hsfasaude.com.br/server.js',
      cwd: '/home/hsfasaude/htdocs/hsfasaude.com.br',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/home/hsfasaude/htdocs/hsfasaude.com.br/logs/pm2-error.log',
      out_file: '/home/hsfasaude/htdocs/hsfasaude.com.br/logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      max_memory_restart: '500M',
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'dist', 'public_html']
    }
  ]
};

