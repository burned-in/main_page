import React from 'react';
import { Head } from 'vike-react/Head';
import { ThemeToggle } from '../src/ThemeToggle';
import '../src/styles.css';
import { layoutStyles as s } from '../src/styles';

type LayoutProps = {
  children: React.ReactNode;
};

const siteUrl = 'https://bunin.app/';
const siteName = 'bunIn · 번인';
const pageTitle = 'bunIn 번인 | 홈페이지와 앱을 만드는 제작사';
const pageDescription =
  'bunIn(번인)은 홈페이지, 앱, 예약, 결제, 관리자 화면을 만드는 제작사입니다.';
const ogImageUrl = 'https://bunin.app/og-image.png';
const keywordContent = [
  'bunIn',
  '번인',
  'BURNED-IN',
  '홈페이지',
  '앱',
  '예약과 결제',
  '예약 결제',
  '관리자 화면',
  '업무 관리',
  '반복 업무 줄이기',
].join(', ');

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}#organization`,
  name: 'bunIn',
  alternateName: ['번인', 'BURNED-IN'],
  legalName: '번인',
  url: siteUrl,
  logo: `${siteUrl}favicon.svg`,
  identifier: {
    '@type': 'PropertyValue',
    propertyID: 'Korean Business Registration Number',
    value: '315-70-00623',
  },
  description: pageDescription,
  knowsAbout: [
    'Website and app development',
    'Website production',
    'App production',
    'Reservation and payment flows',
    'Admin screens',
    'Business workflow improvement',
  ],
  sameAs: [
    'https://github.com/burned-in',
    'https://github.com/burned-in/react-native-micro-frontend',
    'https://github.com/burned-in/prisma-pg-crossdb',
    'https://rnmfe.bunin.app/',
    'https://pxdb.bunin.app/',
  ],
};

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}#website`,
  url: siteUrl,
  name: siteName,
  alternateName: ['bunIn', '번인', 'BURNED-IN'],
  inLanguage: 'ko-KR',
  publisher: { '@id': `${siteUrl}#organization` },
};

const webPageJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${siteUrl}#webpage`,
  url: siteUrl,
  name: pageTitle,
  description: pageDescription,
  inLanguage: 'ko-KR',
  isPartOf: { '@id': `${siteUrl}#website` },
  about: { '@id': `${siteUrl}#organization` },
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: ogImageUrl,
  },
};

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${siteUrl}#faq`,
  inLanguage: 'ko-KR',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'bunIn은 어떤 회사인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'bunIn(번인)은 홈페이지, 앱, 예약, 결제, 관리자 화면을 만드는 제작사입니다.',
      },
    },
    {
      '@type': 'Question',
      name: '어떤 일을 맡길 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '고객이 보는 화면부터 직원이 쓰는 관리 화면까지 맡길 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '개발을 잘 몰라도 상담할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네. 만들고 싶은 일과 불편한 점만 알려주셔도 됩니다. 필요한 순서는 함께 정합니다.',
      },
    },
  ],
};

const softwareJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: 'React Native Micro Frontend',
    codeRepository: 'https://github.com/burned-in/react-native-micro-frontend',
    url: 'https://rnmfe.bunin.app/',
    programmingLanguage: ['TypeScript', 'React Native'],
    applicationCategory: 'DeveloperApplication',
    description:
      'bunIn이 더 나은 앱 제작을 위해 운영하는 공개 프로젝트입니다. 앱 기능을 더 안전하게 관리하는 방법을 다룹니다.',
    author: { '@id': `${siteUrl}#organization` },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: 'Prisma PG CrossDB',
    codeRepository: 'https://github.com/burned-in/prisma-pg-crossdb',
    url: 'https://pxdb.bunin.app/',
    programmingLanguage: ['TypeScript', 'SQL'],
    applicationCategory: 'DeveloperApplication',
    runtimePlatform: 'Node.js',
    description:
      'bunIn이 반복되는 작업을 줄이기 위해 만든 공개 도구입니다. 여러 정보를 더 안전하게 다루는 데 도움을 줍니다.',
    author: { '@id': `${siteUrl}#organization` },
  },
];

const themeBootScript = `(() => {
  const storageKey = 'bunin-theme';
  const root = document.documentElement;
  const normalizeTheme = (theme) => theme === 'dark' || theme === 'light' ? theme : null;
  const readStoredTheme = () => {
    try {
      return normalizeTheme(localStorage.getItem(storageKey));
    } catch {
      return null;
    }
  };
  const getPreferredTheme = () => {
    try {
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  };
  const theme = readStoredTheme() || getPreferredTheme();
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
})();`;

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#05070c" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f5fbfa" media="(prefers-color-scheme: light)" />
        <meta name="application-name" content={siteName} />
        <meta name="apple-mobile-web-app-title" content="bunIn" />
        <meta name="author" content="bunIn" />
        <meta name="publisher" content="bunIn" />
        <meta name="keywords" content={keywordContent} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={siteUrl} />
        <link rel="alternate" hrefLang="ko-KR" href={siteUrl} />
        <link rel="alternate" hrefLang="x-default" href={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:site_name" content={siteName} />
        <meta property="og:locale" content="ko_KR" />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="bunIn 번인 - 홈페이지와 앱을 만드는 제작사" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content="bunIn 번인 - 홈페이지와 앱을 만드는 제작사" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/favicon.svg" color="#6ee7d8" />
        <link rel="manifest" href="/site.webmanifest" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }} />
      </Head>
      <div className={s.noise} aria-hidden="true" />
      <header className={s.header}>
        <a className={s.brand} href="#top" aria-label="bunIn 번인 홈">
          <span className={s.brandMark}>B</span>
          <span>
            <strong>bunIn</strong>
            <small>번인 · BURNED-IN</small>
          </span>
        </a>
        <div className={s.headerTools}>
          <nav className={s.nav} aria-label="주요 메뉴">
            <a href="#project">서비스</a>
            <a href="#stack">진행 방식</a>
            <a href="#seo-profile">기업 정보</a>
          </nav>
          <ThemeToggle />
        </div>
      </header>
      {children}
      <footer id="company" className={s.footer}>
        <div>
          <strong>bunIn · 번인 · BURNED-IN</strong>
          <p>홈페이지 · 앱 · 예약과 결제 · 관리자 화면 · 사업자등록번호 315-70-00623</p>
        </div>
        <div>
          <p><code>bunin.app</code></p>
          <p>© 2026 bunIn. 오래 쓰기 좋은 서비스를 만듭니다.</p>
        </div>
      </footer>
    </>
  );
}
