# 번인 메인 페이지

Vite + Vike SSR/prerender 기반 번인 회사 소개 페이지입니다.

## 배포 주소

https://bunin.app

GitHub Pages 커스텀 도메인으로 배포하며, `public/CNAME`에 `bunin.app`을 유지합니다.

## 명령어

```bash
bun install
bun run dev
bun run typecheck
bun run build
bun run preview
```

## 배포

1. DNS에서 `bunin.app`을 GitHub Pages로 연결합니다.
2. GitHub 저장소 Settings → Pages → Source를 `GitHub Actions`로 설정합니다.
3. Pages 커스텀 도메인에 `bunin.app`을 등록하고 HTTPS를 활성화합니다.
4. `main` 브랜치에 push하면 `.github/workflows/pages.yml`이 `vike build` 후 `dist/client`를 배포합니다.
5. 빌드 결과에는 `public/CNAME`이 포함되어 `bunin.app` 도메인이 유지됩니다.

사업자등록번호: `315-70-00623`

## 라이선스

이 저장소와 웹사이트 콘텐츠는 번인의 독점 자산이며, 별도 서면 허가 없이 복제·수정·배포·재사용할 수 없습니다. 자세한 내용은 [`LICENSE`](./LICENSE)를 확인하세요.

