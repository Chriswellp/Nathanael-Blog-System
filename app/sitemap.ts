export const dynamic = 'force-dynamic';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://nathanael-blog-system-kebj-hrdg7uzzs-peyarachris-9027s-projects.vercel.app';

  // Static routes
  const staticRoutes = ['', '/about', '/blog', '/publications', '/resources', '/contact', '/live'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));

  try {
    // Optionally fetch dynamic blog posts or publications from your database/API to include them in the sitemap
    const blogsRes = await fetch(`${baseUrl}/api/blogs`, { cache: 'no-store' });
    const blogsData = blogsRes.ok ? await blogsRes.json() : [];
    const blogs = Array.isArray(blogsData) ? blogsData : blogsData.data || [];

    const dynamicBlogRoutes = blogs.map((post: any) => ({
      url: `${baseUrl}/blog?id=${post.id}`,
      lastModified: post.publishedAt ? new Date(post.publishedAt) : new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...dynamicBlogRoutes];
  } catch (err) {
    console.error('Error generating sitemap:', err);
    return staticRoutes;
  }
}