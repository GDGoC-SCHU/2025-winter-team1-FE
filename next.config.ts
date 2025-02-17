/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: "http://192.168.219.100:8080", // ✅ 백엔드 API 주소 (로컬 환경)
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://192.168.219.100:8080/api/:path*", // ✅ API 프록시 설정 추가
      },
    ];
  },
};

module.exports = nextConfig;
