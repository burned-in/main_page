import type { Config } from 'vike/types';
import vikeReact from 'vike-react/config';

export default {
  extends: vikeReact,
  prerender: true,
  lang: 'ko-KR',
  viewport: null,
  title: 'bunIn 번인 | 풀스택·앱·클라우드 네이티브 개발 기업',
  description:
    'bunIn(번인)은 React, Next.js, Vite, React Native, Kotlin, Swift, Java, Rust, Go, Docker, Kubernetes, Argo CD까지 다루는 풀스택·앱·클라우드 네이티브 개발 기업입니다.',
} satisfies Config;
