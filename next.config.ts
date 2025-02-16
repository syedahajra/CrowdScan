/** @type {import('next').NextConfig} */
module.exports = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Increase limit to 10MB (adjust as needed)
    },
  },
};
