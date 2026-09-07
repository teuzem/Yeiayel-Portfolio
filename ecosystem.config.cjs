module.exports = {
  apps: [
    {
      name: "yeiayel-portfolio",
      script: ".next/standalone/server.js",
      env: { NODE_ENV: "production", PORT: 3000, HOSTNAME: "0.0.0.0" },
      max_memory_restart: "512M",
      autorestart: true,
    },
  ],
};
