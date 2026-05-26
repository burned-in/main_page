import React from 'react';
import { Head } from 'vike-react/Head';
import './style.css';

type LayoutProps = {
  children: React.ReactNode;
};

const themeBootScript = `(() => {
  const storageKey = 'bunin-theme';
  const root = document.documentElement;
  const savedTheme = localStorage.getItem(storageKey);
  const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const theme = savedTheme || preferredTheme;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
})();`;

const themeToggleScript = `(() => {
  const storageKey = 'bunin-theme';
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const label = document.querySelector('[data-theme-toggle-label]');
  const applyTheme = (theme) => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    localStorage.setItem(storageKey, theme);
    if (toggle) toggle.setAttribute('aria-pressed', String(theme === 'light'));
    if (label) label.textContent = theme === 'light' ? 'Light' : 'Dark';
  };
  applyTheme(root.dataset.theme || 'dark');
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
        <meta property="og:title" content="번인 | IT에 미친 기업" />
        <meta
          property="og:description"
          content="React Native Micro Frontend를 중심으로 모바일 앱 배포와 런타임 안전성을 끝까지 파고드는 기술 조직."
        />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <div className="noise" aria-hidden="true" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="번인 홈">
          <span className="brand-mark">B</span>
          <span>
            <strong>번인</strong>
            <small>BURNED-IN</small>
          </span>
        </a>
        <div className="header-tools">
          <nav aria-label="주요 메뉴">
            <a href="#project">프로젝트</a>
            <a href="#stack">기술</a>
            <a href="#company">회사정보</a>
          </nav>
          <button className="theme-toggle" type="button" data-theme-toggle aria-pressed="false" aria-label="다크/라이트 테마 전환">
            <span aria-hidden="true" className="theme-toggle-orb" />
            <span data-theme-toggle-label>Dark</span>
          </button>
        </div>
      </header>
      <script dangerouslySetInnerHTML={{ __html: themeToggleScript }} />
      {children}
      <footer id="company" className="site-footer">
        <div>
          <strong>번인 · BURNED-IN</strong>
          <p>사업자등록번호 315-70-00623</p>
        </div>
        <div>
          <p>GitHub Pages ready · 도메인: <code>bunin.app</code></p>
          <p>© 2026 BURNED-IN. Built for obsessive engineers.</p>
        </div>
      </footer>
    </>
  );
}
