module.exports = {
  apps: [{
    name: 'shadcn-blog',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/projects/shadcn_uiux',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/home/ubuntu/logs/shadcn-blog-error.log',
    out_file: '/home/ubuntu/logs/shadcn-blog-out.log',
    log_file: '/home/ubuntu/logs/shadcn-blog-combined.log',
    time: true
  }]
}; 
 
 