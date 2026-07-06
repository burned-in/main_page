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
const pageTitle = 'bunIn 번인 | 홈페이지, 앱, 예약 결제, 관리자 화면 제작';
const pageDescription =
  'bunIn(번인)은 홈페이지와 앱, 예약 결제, 관리자 화면을 필요한 만큼 설계하고 만드는 서비스 개발사입니다.';
const ogImageUrl = 'https://bunin.app/og-image.png';
const keywordContent = [
  'bunIn',
  '번인',
  'BURNED-IN',
  '홈페이지',
  '앱',
  '예약과 결제',
  '예약 결제',
  '홈페이지 제작',
  '앱 제작',
  '랜딩페이지 제작',
  '관리자 화면',
  '관리자 페이지 제작',
  '업무 관리',
  '서비스 개발사',
  '웹앱 제작',
  '반복 업무 줄이기',
].join(', ');

const serviceCatalog = [
  {
    '@type': 'Service',
    '@id': `${siteUrl}#website-app-development`,
    name: '홈페이지와 앱 제작',
    serviceType: 'Website and app development',
    url: `${siteUrl}#project`,
    description: '회사 소개, 서비스 안내, 신청 버튼, 앱 화면을 처음 보는 사람도 자연스럽게 읽도록 구성합니다.',
    areaServed: { '@type': 'Country', name: 'KR' },
    provider: { '@id': `${siteUrl}#organization` },
  },
  {
    '@type': 'Service',
    '@id': `${siteUrl}#reservation-payment-development`,
    name: '예약 결제 화면 제작',
    serviceType: 'Reservation and payment flow development',
    url: `${siteUrl}#project`,
    description: '예약, 결제, 문의, 알림이 서비스 안에서 자연스럽게 이어지도록 연결합니다.',
    areaServed: { '@type': 'Country', name: 'KR' },
    provider: { '@id': `${siteUrl}#organization` },
  },
  {
    '@type': 'Service',
    '@id': `${siteUrl}#admin-dashboard-development`,
    name: '관리자 화면 제작',
    serviceType: 'Admin screen and workflow development',
    url: `${siteUrl}#seo-profile`,
    description: '주문, 문의, 회원, 파일처럼 반복해서 보는 일을 한 화면에서 확인하도록 구성합니다.',
    areaServed: { '@type': 'Country', name: 'KR' },
    provider: { '@id': `${siteUrl}#organization` },
  },
] as const;

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
  makesOffer: {
    '@type': 'OfferCatalog',
    name: 'bunIn 제작 서비스',
    itemListElement: serviceCatalog.map((service, index) => ({
      '@type': 'Offer',
      position: index + 1,
      itemOffered: { '@id': service['@id'] },
    })),
  },
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
  mainEntity: serviceCatalog.map((service) => ({ '@id': service['@id'] })),
  significantLink: [`${siteUrl}#project`, `${siteUrl}#stack`, `${siteUrl}#conversion`, `${siteUrl}#seo-profile`],
  primaryImageOfPage: {
    '@type': 'ImageObject',
    url: ogImageUrl,
  },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  '@id': `${siteUrl}#breadcrumb`,
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: '홈',
      item: siteUrl,
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: '서비스',
      item: `${siteUrl}#project`,
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: '시작 전 체크',
      item: `${siteUrl}#conversion`,
    },
  ],
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
        text: 'bunIn(번인)은 홈페이지와 앱, 예약 결제, 관리자 화면을 만드는 서비스 개발사입니다.',
      },
    },
    {
      '@type': 'Question',
      name: '어떤 일을 맡길 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '외부에 보여줄 랜딩페이지부터 내부에서 쓸 관리자 화면까지 맡길 수 있습니다.',
      },
    },
    {
      '@type': 'Question',
      name: '개발을 잘 몰라도 상담할 수 있나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '네. 만들고 싶은 것과 불편한 점만 편하게 알려주시면 됩니다. 필요한 순서는 함께 잡습니다.',
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
        <meta name="theme-color" content="#11110f" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f5f0e7" media="(prefers-color-scheme: light)" />
        <meta name="application-name" content={siteName} />
        <meta name="apple-mobile-web-app-title" content="bunIn" />
        <meta name="author" content="bunIn" />
        <meta name="publisher" content="bunIn" />
        <meta name="keywords" content={keywordContent} />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta name="format-detection" content="telephone=no, address=no, email=no" />
        <meta name="color-scheme" content="dark light" />
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
        <meta property="og:image:alt" content="bunIn 번인 - 생각만 하던 일을 쓰이는 서비스로" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={siteUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content="bunIn 번인 - 생각만 하던 일을 쓰이는 서비스로" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/favicon.svg" color="#ff4e57" />
        <link rel="manifest" href="/site.webmanifest" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
        {serviceCatalog.map((service) => (
          <script
            key={service['@id']}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', ...service }) }}
          />
        ))}
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
            <a href="#conversion" className={s.navCta}>시작 전 체크</a>
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
