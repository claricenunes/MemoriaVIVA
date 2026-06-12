const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    optimizePackageImports: ['@radix-ui/react-dialog', '@radix-ui/react-select'],
  },
}

module.exports = nextConfig
