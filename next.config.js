/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')(['@react-pdf-viewer/core', '@react-pdf-viewer/default-layout']);

const nextConfig = {
  reactStrictMode: true,
}

module.exports = withTM(nextConfig);
