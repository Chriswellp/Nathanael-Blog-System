import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://nathanael-blog-system-kebj-hrdg7uzzs-peyarachris-9027s-projects.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'], // Block bots from crawling the admin panel and internal backend API endpoints
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}