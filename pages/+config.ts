import type { Config } from 'vike/types';
import vikeReact from 'vike-react/config';

export default {
  extends: vikeReact,
  prerender: true,
  lang: 'ko-KR',
  viewport: null,
  title: 'bunIn 번인 | 홈페이지, 앱, 예약 결제, 관리자 화면 제작',
  description:
    'bunIn(번인)은 홈페이지와 앱, 예약 결제, 관리자 화면을 필요한 만큼 설계하고 만드는 서비스 개발사입니다.',
} satisfies Config;
