import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dmf-vietnam.de'
  const lastModified = new Date()

  return [
    // Homepage - Highest Priority
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'weekly',
      priority: 1,
    },
    // Main Service Pages - High Priority
    {
      url: `${baseUrl}/services/skilled-workers`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/azubi`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/services/seasonal`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // B2B Tools - High Priority
    {
      url: `${baseUrl}/roi-rechner`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fuer-arbeitgeber/roi-rechner`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/fuer-arbeitgeber/zeitplan`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    // Content Pages - Medium Priority
    {
      url: `${baseUrl}/referenzen`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Legal Pages - Low Priority
    {
      url: `${baseUrl}/impressum`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/datenschutz`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}

