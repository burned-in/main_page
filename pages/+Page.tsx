import { cx } from '../styled-system/css';
import { pageStyles as s } from '../src/styles';

const principles = [
  ['01. 자동화 집착', '반복 작업은 CLI, 스크립트, 워커, 파이프라인으로 흡수합니다.'],
  ['02. 제품 중심 개발', '웹앱, 관리자 페이지, 결제, 문서, 데이터 흐름을 실제 사용 시나리오 기준으로 연결합니다.'],
  ['03. 운영 중심 설계', '로그, 권한, 재시도, 백업, 장애 대응을 제품의 일부로 봅니다.'],
  ['04. 풀스택 실행력', '프론트엔드, 백엔드, 배포, 자동화, 모바일까지 필요한 범위를 끝까지 책임집니다.'],
] as const;

const modelNodes = ['App Shell', 'Feature A', 'Feature B', 'OTA Gate'] as const;

const seoServices = [
  ['웹앱·프론트엔드', 'React, Next.js, Vite로 고객용 웹앱, 랜딩, 대시보드, 관리자 페이지를 만듭니다.'],
  ['앱·네이티브', 'React Native, Kotlin, Swift로 모바일 앱과 네이티브 연동이 필요한 제품을 설계합니다.'],
  ['백엔드·시스템', 'Java, Go, Rust 기반 API, 데이터 처리, 인증, 권한, 파일·문서 처리 흐름을 연결합니다.'],
  ['클라우드 네이티브 운영', 'Docker, Kubernetes, Argo CD로 배포 자동화, 운영 안정성, 확장 가능한 인프라를 잡습니다.'],
] as const;

const faqs = [
  ['bunIn은 어떤 기업인가요?', 'bunIn(번인)은 React, Next.js, Vite, React Native, Kotlin, Swift, Java, Rust, Go, Docker, Kubernetes, Argo CD까지 다루는 풀스택·앱·클라우드 네이티브 개발 기업입니다.'],
  ['bunIn은 어떤 일을 잘하나요?', '고객용 웹앱, 내부 관리자 페이지, 모바일 앱, 백엔드 API, 업무 자동화, Docker/Kubernetes 기반 인프라, Argo CD 배포 자동화까지 제품과 운영을 함께 설계합니다.'],
  ['bunIn이 중요하게 보는 가치는 무엇인가요?', '멋있어 보이는 데모보다 실제 사람이 쓰기 쉬운 화면, 안정적인 데이터 처리, 운영 로그, 자동화, 유지보수 가능한 코드를 중요하게 봅니다.'],
] as const;

export default function Page() {
  return (
    <main id="top" className={s.main}>
      <section className={cx(s.hero, s.sectionGrid)}>
        <div>
          <p className={s.eyebrow}>bunIn · 번인 · Full-stack · App · Cloud Native</p>
          <h1 className={s.h1}>
            비즈니스 문제를
            <span>제품으로 바꾸는</span>
            풀스택 기업.
          </h1>
          <p className={s.heroText}>
            bunIn(번인)은 React, Next.js, Vite, React Native부터 Kotlin, Swift, Java, Rust, Go,
            Docker, Kubernetes, Argo CD까지 제품과 운영을 한 번에 설계하는 IT 기업입니다.
            일반 사용자가 이해하기 쉬운 화면과 실제 업무가 줄어드는 시스템을 우선합니다.
          </p>
          <div className={s.actionRow}>
            <a className={s.buttonPrimary} href="#project">무엇을 만드는지 보기</a>
            <a
              className={s.buttonGhost}
              href="https://github.com/burned-in/react-native-micro-frontend"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        <aside className={s.heroVisual} aria-label="React Native Micro Frontend 런타임 3D 모델">
          <div className={s.modelStage} role="img" aria-label="앱 셸과 기능 모듈, OTA 검증 게이트가 연결된 3D 런타임 모델">
            <div className={s.modelGrid} aria-hidden="true" />
            <div className={s.orbitOne} aria-hidden="true" />
            <div className={s.orbitTwo} aria-hidden="true" />
            <div className={s.coreCube} aria-hidden="true">
              <span className={cx(s.cubeFace, s.faceFront)}>bunIn</span>
              <span className={cx(s.cubeFace, s.faceBack)}>SAFE</span>
              <span className={cx(s.cubeFace, s.faceRight)}>OTA</span>
              <span className={cx(s.cubeFace, s.faceLeft)}>MFE</span>
              <span className={cx(s.cubeFace, s.faceTop)}>RUN</span>
              <span className={cx(s.cubeFace, s.faceBottom)}>OPS</span>
            </div>
            <div className={s.modelNodes} aria-hidden="true">
              {modelNodes.map((node) => (
                <span key={node}>{node}</span>
              ))}
            </div>
          </div>
          <div className={s.terminal} aria-label="bunIn 기술 원칙">
            <div className={s.terminalBar}><span /><span /><span /></div>
            <pre><code>{`$ bunin run mission
> 반복 업무는 자동화한다
> 위험한 배포는 검증한다
> 운영 로그는 거짓말하지 않는다

status: obsessed_with_it`}</code></pre>
          </div>
        </aside>
      </section>

      <section className={s.metrics} aria-label="핵심 역량">
        <article><strong>Web</strong><span>React · Next.js · Vite</span></article>
        <article><strong>App</strong><span>React Native · Kotlin · Swift</span></article>
        <article><strong>Backend</strong><span>Java · Go · Rust · API</span></article>
        <article><strong>Cloud</strong><span>Docker · Kubernetes · Argo CD</span></article>
      </section>

      <section id="project" className={s.section}>
        <div className={s.sectionHeading}>
          <p className={s.eyebrow}>What We Build</p>
          <h2 className={s.h2}>bunIn은 풀스택 제품과 앱, 클라우드 운영 시스템을 함께 만듭니다.</h2>
          <p>
            프론트엔드와 앱에서 끝나지 않고 백엔드, 인프라, 배포 자동화,
            운영 안정성까지 비즈니스에 필요한 소프트웨어를 풀스택으로 연결합니다.
          </p>
        </div>

        <div className={s.projectGrid}>
          <article className={s.projectCard}>
            <div className={s.cardTop}>
              <span className={s.tag}>Full Stack</span>
              <span className={s.status}>Web · App · Cloud</span>
            </div>
            <h3 className={s.h3}>웹앱, 모바일 앱, 백엔드, 클라우드 운영</h3>
            <p>
              bunIn은 고객이 보는 웹 화면, 모바일 앱, 직원이 쓰는 관리자 페이지, 데이터를 처리하는 백엔드,
              Docker/Kubernetes 기반 인프라, Argo CD 배포 자동화까지 하나의 제품 흐름으로 만듭니다.
              필요한 기술이 React든 Go든 Rust든 Kotlin이든 제품에 맞는 선택으로 끝까지 구현합니다.
            </p>
            <div className={s.projectActions}>
              <a href="#seo-profile">서비스 영역</a>
              <a href="https://github.com/burned-in/react-native-micro-frontend" target="_blank" rel="noreferrer">기술 자산</a>
            </div>
          </article>
        </div>
      </section>

      <section id="stack" className={cx(s.section, s.split)}>
        <div>
          <p className={s.eyebrow}>Engineering Style</p>
          <h2 className={s.h2}>우리는 어려운 기술을 쉬운 제품 경험으로 바꿉니다.</h2>
        </div>
        <div className={s.principles}>
          {principles.map(([title, body]) => (
            <div key={title}>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="seo-profile" className={s.section} aria-labelledby="seo-profile-title">
        <div className={s.sectionHeading}>
          <p className={s.eyebrow}>Company Profile</p>
          <h2 id="seo-profile-title" className={s.h2}>bunIn은 웹앱, 앱, 백엔드, 클라우드 운영까지 만드는 풀스택 기업입니다.</h2>
          <p>
            검색엔진과 고객이 같은 답을 얻도록 bunIn이 만드는 것, 해결하는 문제,
            기술 범위와 기업 식별 정보를 명확한 문장과 구조로 공개합니다.
          </p>
        </div>
        <div className={s.seoGrid}>
          {seoServices.map(([title, body]) => (
            <article key={title}>
              <h3 className={s.h3}>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <dl className={s.companyFacts} aria-label="bunIn 기업 정보">
          <div>
            <dt>회사명</dt>
            <dd>bunIn · 번인 · BURNED-IN</dd>
          </div>
          <div>
            <dt>도메인</dt>
            <dd>bunin.app</dd>
          </div>
          <div>
            <dt>사업자등록번호</dt>
            <dd>315-70-00623</dd>
          </div>
          <div>
            <dt>핵심 키워드</dt>
            <dd>React, Next.js, Vite, React Native, Kotlin, Swift, Java, Rust, Go, Docker, Kubernetes, Argo CD</dd>
          </div>
        </dl>
      </section>

      <section className={cx(s.section, s.faqSection)} aria-labelledby="faq-title">
        <div className={s.sectionHeading}>
          <p className={s.eyebrow}>FAQ</p>
          <h2 id="faq-title" className={s.h2}>bunIn을 찾는 사람이 가장 먼저 확인해야 할 답</h2>
        </div>
        <div className={s.faqList}>
          {faqs.map(([question, answer]) => (
            <article key={question}>
              <h3 className={s.h3}>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={s.cta}>
        <p className={s.eyebrow}>Burned-in, not patched-on</p>
        <h2 className={s.h2}>예쁜 화면에서 끝나지 않고, 실제 업무가 돌아가는 제품을 만듭니다.</h2>
      </section>
    </main>
  );
}
