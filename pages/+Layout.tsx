import React from 'react';
import { Head } from 'vike-react/Head';
import '../src/styles.css';
import { layoutStyles as s } from '../src/styles';

type LayoutProps = {
  children: React.ReactNode;
};

const siteUrl = 'https://bunin.app/';
const siteName = 'bunIn · 번인';
const pageTitle = 'bunIn 번인 | 풀스택·앱·클라우드 네이티브 개발 기업';
const pageDescription =
  'bunIn(번인)은 아이디어를 화면, 앱, 백엔드, 배포 운영까지 이어 실제로 돌아가는 제품으로 만드는 풀스택 개발 기업입니다.';
const ogImageUrl = 'https://bunin.app/og-image.png';
const keywordContent = [
  'bunIn',
  '번인',
  'BURNED-IN',
  '풀스택 개발',
  '웹앱 개발',
  '앱 개발',
  '클라우드 네이티브',
  'Kubernetes',
  'Docker',
  'Argo CD',
  'React',
  'Next.js',
  'Vite',
  'React Native',
  'Kotlin',
  'Swift',
  'Java',
  'Rust',
  'Go',
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
    'Full-stack product development',
    'React',
    'Next.js',
    'Vite',
    'React Native',
    'Kotlin',
    'Swift',
    'Java',
    'Rust',
    'Go',
    'Docker',
    'Kubernetes',
    'Argo CD',
    'Cloud native engineering',
  ],
  sameAs: [
    'https://github.com/burned-in',
    'https://github.com/burned-in/react-native-micro-frontend',
    'https://rnmfe.bunin.app/',
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
      name: 'bunIn은 어떤 기업인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'bunIn(번인)은 아이디어를 화면, 앱, 백엔드, 배포 운영까지 이어 실제로 돌아가는 제품으로 만드는 풀스택 개발 기업입니다.',
      },
    },
    {
      '@type': 'Question',
      name: 'bunIn은 어떤 일을 잘하나요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '고객용 화면, 내부 운영 도구, 모바일 앱, 데이터 흐름, 업무 자동화, 배포 운영까지 제품이 실제로 쓰이는 전 과정을 함께 설계합니다.',
      },
    },
    {
      '@type': 'Question',
      name: 'bunIn이 중요하게 보는 가치는 무엇인가요?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '자동화, 안전한 배포, 운영 로그, 롤백 가능성, 다시 읽히는 코드처럼 실제 운영에서 살아남는 엔지니어링을 중요하게 봅니다.',
      },
    },
  ],
};

const softwareJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareSourceCode',
  name: 'React Native Micro Frontend',
  codeRepository: 'https://github.com/burned-in/react-native-micro-frontend',
  url: 'https://rnmfe.bunin.app/',
  programmingLanguage: ['TypeScript', 'React Native'],
  applicationCategory: 'DeveloperApplication',
  description:
    'bunIn의 오픈소스 React Native Micro Frontend 프로젝트입니다. 모바일 앱 기능 모듈의 독립 배포, OTA 검증 게이트, 안전한 런타임 운영을 다룹니다.',
  author: { '@id': `${siteUrl}#organization` },
};

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

const themeToggleScript = `(() => {
  const storageKey = 'bunin-theme';
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const label = document.querySelector('[data-theme-toggle-label]');
  const normalizeTheme = (theme) => theme === 'dark' || theme === 'light' ? theme : null;
  const getPreferredTheme = () => {
    try {
      return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  };
  const persistTheme = (theme) => {
    try {
      localStorage.setItem(storageKey, theme);
    } catch {
      // Some in-app browsers, including KakaoTalk WebView variants, can block storage.
    }
  };
  const applyTheme = (theme, options = {}) => {
    const nextTheme = normalizeTheme(theme) || getPreferredTheme();
    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    if (options.persist !== false) persistTheme(nextTheme);
    if (toggle) toggle.setAttribute('aria-pressed', String(nextTheme === 'light'));
    if (label) label.textContent = nextTheme === 'light' ? 'Light' : 'Dark';
  };
  applyTheme(root.dataset.theme, { persist: false });
  toggle?.addEventListener('click', () => {
    applyTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
  });
})();`;

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <Head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#050814" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#f7fbff" media="(prefers-color-scheme: light)" />
        <meta name="application-name" content={siteName} />
        <meta name="apple-mobile-web-app-title" content="bunIn" />
        <meta name="author" content="bunIn" />
        <meta name="publisher" content="bunIn" />
        <meta name="keywords" content={keywordContent} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css" />
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
        <meta property="og:image:alt" content="bunIn 번인 - 풀스택, 앱, 클라우드 네이티브 개발 기업" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={ogImageUrl} />
        <meta name="twitter:image:alt" content="bunIn 번인 - 풀스택, 앱, 클라우드 네이티브 개발 기업" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="mask-icon" href="/favicon.svg" color="#36f1cd" />
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
            <a href="#project">프로젝트</a>
            <a href="#stack">기술</a>
            <a href="#seo-profile">기업정보</a>
          </nav>
          <button className={s.themeToggle} type="button" data-theme-toggle aria-pressed="false" aria-label="다크/라이트 테마 전환">
            <span aria-hidden="true" className={s.themeToggleOrb} />
            <span data-theme-toggle-label>Dark</span>
          </button>
        </div>
      </header>
      <script dangerouslySetInnerHTML={{ __html: themeToggleScript }} />
      {children}
      <footer id="company" className={s.footer}>
        <div>
          <strong>bunIn · 번인 · BURNED-IN</strong>
          <p>제품 설계 · 앱 경험 · 백엔드 흐름 · 배포 운영 · 사업자등록번호 315-70-00623</p>
        </div>
        <div>
          <p>Official domain: <code>bunin.app</code></p>
          <p>© 2026 bunIn. Built for obsessive engineers.</p>
        </div>
      </footer>
    </>
  );
}
