module.exports = {
  siteUrl: process.env.SITE_URL || 'https://salescout.app',
  generateRobotsTxt: true,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      }
    ],
    additionalSitemaps: [
      `${process.env.SITE_URL || 'https://salescout.app'}/server-sitemap.xml`,
    ],
  },
};
