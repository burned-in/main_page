import type { Config } from 'vike/types';
import vikeReact from 'vike-react/config';

export default {
  extends: vikeReact,
  prerender: true,
  lang: 'ko-KR',
  title: '번인 | IT에 미친 기업',
  description:
    '번인은 React Native Micro Frontend를 중심으로 모바일 앱 배포와 런타임 안전성을 끝까지 파고드는 IT 엔지니어링 스튜디오입니다.',
} satisfies Config;
