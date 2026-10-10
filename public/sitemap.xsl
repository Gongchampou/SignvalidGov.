<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:html="http://www.w3.org/TR/REC-html40"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    exclude-result-prefixes="html sitemap image">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />

  <xsl:template match="/">
    <html lang="en">
      <head>
        <title>XML Sitemap | SignValid — Indian PDF Digital Signature Validator</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23126B44'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'/%3E%3C/svg%3E" />
        <style type="text/css">
          <![CDATA[
          :root {
            --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            --primary-green: #126B44;
            --primary-green-hover: #0E5435;
            --primary-green-subtle: #EAF5EE;
            --primary-green-light: #F0FDF4;
            --accent-green: #10B981;
            --text-dark: #0F172A;
            --text-body: #334155;
            --text-muted: #64748B;
            --text-light: #94A3B8;
            --border-color: #E2E8F0;
            --border-hover: #CBD5E1;
            --bg-page: #F8FAFC;
            --bg-card: #FFFFFF;
            --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.04);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -4px rgba(0, 0, 0, 0.03);
            --radius-sm: 6px;
            --radius-md: 10px;
            --radius-lg: 14px;
            --radius-full: 9999px;
          }

          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }

          body {
            font-family: var(--font-family);
            background-color: var(--bg-page);
            color: var(--text-body);
            line-height: 1.5;
            -webkit-font-smoothing: antialiased;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
          }

          /* Top Navigation Bar */
          .nav-header {
            background-color: #FFFFFF;
            border-bottom: 1px solid var(--border-color);
            position: sticky;
            top: 0;
            z-index: 50;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
          }

          .nav-container {
            max-width: 1140px;
            margin: 0 auto;
            padding: 0.85rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .brand-logo-group {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            text-decoration: none;
            color: inherit;
          }

          .brand-badge {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            background: linear-gradient(135deg, #126B44 0%, #0E5435 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #FFFFFF;
            font-weight: 700;
            font-size: 1.1rem;
            box-shadow: 0 2px 4px rgba(18, 107, 68, 0.25);
          }

          .brand-title {
            font-size: 1.25rem;
            font-weight: 800;
            letter-spacing: -0.02em;
            color: var(--text-dark);
          }

          .brand-title span {
            color: var(--primary-green);
          }

          .trust-tag {
            display: inline-flex;
            align-items: center;
            gap: 0.35rem;
            padding: 0.2rem 0.55rem;
            background: #EAF5EE;
            border: 1px solid #A7F3D0;
            border-radius: var(--radius-full);
            font-size: 0.72rem;
            font-weight: 600;
            color: #0E5435;
          }

          .nav-cta {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            background-color: var(--primary-green);
            color: #FFFFFF;
            padding: 0.5rem 1rem;
            border-radius: var(--radius-sm);
            font-size: 0.875rem;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.2s ease;
            box-shadow: var(--shadow-sm);
          }

          .nav-cta:hover {
            background-color: var(--primary-green-hover);
            transform: translateY(-1px);
            box-shadow: var(--shadow-md);
          }

          /* Main Container */
          .main-content {
            flex: 1;
            max-width: 1140px;
            width: 100%;
            margin: 0 auto;
            padding: 2.25rem 1.5rem 3rem;
          }

          /* Hero Card */
          .hero-card {
            background: #FFFFFF;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: 2rem 2.25rem;
            margin-bottom: 2rem;
            box-shadow: var(--shadow-sm);
            background-image: radial-gradient(at 100% 0%, rgba(18, 107, 68, 0.04) 0px, transparent 50%);
          }

          .pill-label {
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
            background: #F1F5F9;
            color: #475569;
            padding: 0.25rem 0.75rem;
            border-radius: var(--radius-full);
            font-size: 0.75rem;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
            margin-bottom: 0.85rem;
          }

          .pill-label::before {
            content: "";
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: var(--accent-green);
          }

          .hero-title {
            font-size: 1.85rem;
            font-weight: 800;
            color: var(--text-dark);
            letter-spacing: -0.025em;
            margin-bottom: 0.65rem;
          }

          .hero-description {
            font-size: 0.975rem;
            color: var(--text-muted);
            max-width: 800px;
            line-height: 1.6;
          }

          .hero-description a {
            color: var(--primary-green);
            text-decoration: underline;
            text-underline-offset: 3px;
            font-weight: 500;
          }

          /* Stats Grid */
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.25rem;
            margin-bottom: 2rem;
          }

          .stat-card {
            background: #FFFFFF;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-md);
            padding: 1.25rem 1.5rem;
            box-shadow: var(--shadow-sm);
            transition: border-color 0.2s ease;
          }

          .stat-card:hover {
            border-color: var(--border-hover);
          }

          .stat-label {
            font-size: 0.75rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            color: var(--text-muted);
            margin-bottom: 0.35rem;
          }

          .stat-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--text-dark);
          }

          .stat-sub {
            font-size: 0.75rem;
            color: var(--accent-green);
            font-weight: 600;
            margin-top: 0.2rem;
          }

          /* Table Section */
          .table-container {
            background: #FFFFFF;
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            overflow: hidden;
            box-shadow: var(--shadow-sm);
            margin-bottom: 2rem;
          }

          .table-header-bar {
            padding: 1.15rem 1.5rem;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: #FAFBFD;
          }

          .table-title {
            font-size: 1rem;
            font-weight: 700;
            color: var(--text-dark);
          }

          .table-count-tag {
            background: var(--primary-green-subtle);
            color: var(--primary-green);
            padding: 0.2rem 0.65rem;
            border-radius: var(--radius-full);
            font-size: 0.75rem;
            font-weight: 700;
          }

          .responsive-table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 0.875rem;
          }

          .responsive-table th {
            background: #F8FAFC;
            color: var(--text-muted);
            font-weight: 600;
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 0.85rem 1.25rem;
            border-bottom: 1px solid var(--border-color);
          }

          .responsive-table td {
            padding: 1rem 1.25rem;
            border-bottom: 1px solid var(--border-color);
            vertical-align: middle;
            color: var(--text-body);
          }

          .responsive-table tbody tr:last-child td {
            border-bottom: none;
          }

          .responsive-table tbody tr:hover {
            background-color: #F8FAFC;
          }

          .url-link {
            color: var(--primary-green);
            text-decoration: none;
            font-weight: 600;
            word-break: break-all;
            display: inline-flex;
            align-items: center;
            gap: 0.4rem;
          }

          .url-link:hover {
            color: var(--primary-green-hover);
            text-decoration: underline;
          }

          .badge {
            display: inline-flex;
            align-items: center;
            padding: 0.2rem 0.6rem;
            border-radius: var(--radius-sm);
            font-size: 0.75rem;
            font-weight: 600;
          }

          .badge-priority {
            background: #EFF6FF;
            color: #1D4ED8;
            border: 1px solid #DBEAFE;
          }

          .badge-freq {
            background: #F1F5F9;
            color: #475569;
            text-transform: capitalize;
          }

          .badge-date {
            color: var(--text-muted);
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            font-size: 0.8rem;
          }

          .badge-image {
            background: #ECFDF5;
            color: #065F46;
            border: 1px solid #A7F3D0;
            display: inline-flex;
            align-items: center;
            gap: 0.3rem;
          }

          /* Info Banner */
          .info-banner {
            background: #FFFFFF;
            border: 1px solid var(--border-color);
            border-left: 4px solid var(--primary-green);
            border-radius: var(--radius-md);
            padding: 1.25rem 1.5rem;
            margin-bottom: 2rem;
            font-size: 0.875rem;
            color: var(--text-muted);
            line-height: 1.6;
          }

          .info-banner strong {
            color: var(--text-dark);
          }

          /* Footer */
          .footer {
            border-top: 1px solid var(--border-color);
            background: #FFFFFF;
            padding: 1.75rem 1.5rem;
            margin-top: auto;
          }

          .footer-container {
            max-width: 1140px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 0.825rem;
            color: var(--text-muted);
            flex-wrap: wrap;
            gap: 1rem;
          }

          .footer-links {
            display: flex;
            gap: 1.25rem;
          }

          .footer-links a {
            color: var(--text-muted);
            text-decoration: none;
            transition: color 0.2s;
          }

          .footer-links a:hover {
            color: var(--primary-green);
          }

          @media (max-width: 768px) {
            .hero-card {
              padding: 1.5rem;
            }
            .hero-title {
              font-size: 1.45rem;
            }
            .responsive-table th, .responsive-table td {
              padding: 0.75rem 0.85rem;
            }
            .nav-container, .footer-container {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.75rem;
            }
          }
          ]]>
        </style>
      </head>
      <body>
        <!-- Header -->
        <header class="nav-header">
          <div class="nav-container">
            <a href="https://signvalid.pages.dev/" class="brand-logo-group" title="Back to SignValid">
              <div class="brand-badge">&#x2713;</div>
              <div class="brand-title">Sign<span>Valid</span></div>
              <div class="trust-tag">
                <span>&#128737; CCA India 2014</span>
              </div>
            </a>
            <a href="https://signvalid.pages.dev/" class="nav-cta">
              &#8592; Back to Validator App
            </a>
          </div>
        </header>

        <!-- Main Content -->
        <main class="main-content">
          <!-- Hero Section -->
          <div class="hero-card">
            <div class="pill-label">XML Sitemap Protocol 0.9</div>
            <h1 class="hero-title">SignValid Web Sitemap</h1>
            <p class="hero-description">
              This is a standard search engine sitemap generated for indexing on <strong>Google</strong>, <strong>Bing</strong>, and other web crawlers. 
              Rendered using an XSL stylesheet to provide a clean, human-readable overview.
            </p>
          </div>

          <!-- Quick Stats -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Total URLs Indexed</div>
              <div class="stat-value">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/>
              </div>
              <div class="stat-sub">100% Crawlable</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Indexed Images</div>
              <div class="stat-value">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url/image:image)"/>
              </div>
              <div class="stat-sub">Rich Snippets Enabled</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Primary Domain</div>
              <div class="stat-value" style="font-size: 1.15rem; word-break: break-all;">signvalid.pages.dev</div>
              <div class="stat-sub">Cloudflare Edge HTTPS</div>
            </div>
          </div>

          <!-- Table Section -->
          <div class="table-container">
            <div class="table-header-bar">
              <div class="table-title">URL Inventory</div>
              <span class="table-count-tag">
                <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URL(s)
              </span>
            </div>
            <table class="responsive-table">
              <thead>
                <tr>
                  <th style="width: 45px;">#</th>
                  <th>URL Location</th>
                  <th>Priority</th>
                  <th>Change Frequency</th>
                  <th>Last Modified</th>
                  <th>Images</th>
                </tr>
              </thead>
              <tbody>
                <xsl:for-each select="sitemap:urlset/sitemap:url">
                  <tr>
                    <td style="color: var(--text-light); font-weight: 600;">
                      <xsl:value-of select="position()"/>
                    </td>
                    <td>
                      <a class="url-link">
                        <xsl:attribute name="href">
                          <xsl:value-of select="sitemap:loc"/>
                        </xsl:attribute>
                        <xsl:attribute name="target">_blank</xsl:attribute>
                        <xsl:value-of select="sitemap:loc"/>
                        <span style="font-size: 0.75rem; opacity: 0.7;">&#8599;</span>
                      </a>
                    </td>
                    <td>
                      <span class="badge badge-priority">
                        <xsl:value-of select="sitemap:priority"/>
                      </span>
                    </td>
                    <td>
                      <span class="badge badge-freq">
                        <xsl:value-of select="sitemap:changefreq"/>
                      </span>
                    </td>
                    <td>
                      <span class="badge-date">
                        <xsl:value-of select="sitemap:lastmod"/>
                      </span>
                    </td>
                    <td>
                      <xsl:choose>
                        <xsl:when test="image:image">
                          <span class="badge badge-image" title="{image:image/image:title}">
                            &#128444; <xsl:value-of select="count(image:image)"/> Image
                          </span>
                        </xsl:when>
                        <xsl:otherwise>
                          <span style="color: var(--text-light); font-size: 0.8rem;">—</span>
                        </xsl:otherwise>
                      </xsl:choose>
                    </td>
                  </tr>
                </xsl:for-each>
              </tbody>
            </table>
          </div>

          <!-- Explanatory Info Banner -->
          <div class="info-banner">
            <strong>About XML Sitemaps:</strong> An XML sitemap is a machine-readable document that lists URLs for a site, helping search engine spiders discover all available pages and their update frequencies. Search engine bots (like Googlebot) read the raw XML data directly, completely ignoring the XSL stylesheet.
          </div>
        </main>

        <!-- Footer -->
        <footer class="footer">
          <div class="footer-container">
            <div>
              © SignValid — Indian Government PDF Digital Signature Verification
            </div>
            <div class="footer-links">
              <a href="https://signvalid.pages.dev/">Home</a>
              <a href="https://signvalid.pages.dev/robots.txt">robots.txt</a>
              <a href="https://signvalid.pages.dev/sitemap.xml">Raw XML</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
