import type { Config } from 'vike/types';
import vikeReact from 'vike-react/config';

export default {
  extends: vikeReact,
  prerender: true,
  lang: 'ko-KR',
  viewport: null,
  title: 'bunIn 번인 | 풀스택·앱·클라우드 네이티브 개발 기업',
  description:
    'bunIn(번인)은 아이디어를 화면, 앱, 백엔드, 배포 운영까지 이어 실제로 돌아가는 제품으로 만드는 풀스택 개발 기업입니다.',
} satisfies Config;
