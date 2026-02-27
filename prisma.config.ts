const { defineConfig } = require('prisma/define-config');

module.exports = defineConfig({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
