/** @type {import('next').NextConfig} */
module.exports = {
  swcMinify: true,
  distDir: 'build',
  reactStrictMode: false,
  // 정적 페이지의 결과물이 이 폴더에 생긴다.
  // basePath: '',
  // 결과물의 기본 경로를 설정한다.
  images: {
    remotePatterns: [ {
      hostname: '**',
      protocol: 'https',
      port: '',
      pathname: '*/**',
    }, ],
  },
  output: 'standalone',
  eslint: {
    dirs: [],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [ '@svgr/webpack', ],
    });
    return config;
  },
};
