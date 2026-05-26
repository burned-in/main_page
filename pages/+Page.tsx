const principles = [
  ['01. 자동화 집착', '반복 작업은 CLI, 스크립트, 워커, 파이프라인으로 흡수합니다.'],
  ['02. 안전한 배포', '런타임 호환성, 네이티브 계약, 환경 차이를 배포 전에 검증합니다.'],
  ['03. 운영 중심 설계', '로그, 큐, 재시도, 롤백, 장애 대응을 제품의 일부로 봅니다.'],
  ['04. 모바일 현실 최적화', 'React Native 앱의 네이티브 제약과 OTA 배포 리스크를 시스템으로 다룹니다.'],
] as const;

const modelNodes = ['App Shell', 'Feature A', 'Feature B', 'OTA Gate'] as const;

export default function Page() {
  return (
    <main id="top">
      <section className="hero section-grid">
        <div className="hero-copy">
          <p className="eyebrow">IT에 미친 기업 · Automation First · Ship Safe</p>
          <h1>
            현장의 문제를
            <span>끝까지 코드로 태우는</span>
            기술 조직.
          </h1>
          <p className="hero-text">
            번인은 React Native Micro Frontend를 중심으로 모바일 앱을 더 작게 나누고,
            더 자주 배포하고, 더 안전하게 되돌리는 방법을 파고듭니다. 멋진 데모보다
            장애 없는 배포, 정확한 검증, 다시 읽히는 코드를 우선합니다.
          </p>
          <div className="hero-actions">
            <a className="button primary" href="#project">대표 프로젝트 보기</a>
            <a
              className="button ghost"
              href="https://github.com/burned-in/react-native-micro-frontend"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>

        <aside className="hero-visual" aria-label="React Native Micro Frontend 런타임 3D 모델">
          <div className="model-stage" role="img" aria-label="앱 셸과 기능 모듈, OTA 검증 게이트가 연결된 3D 런타임 모델">
            <div className="model-grid" aria-hidden="true" />
            <div className="orbit orbit-one" aria-hidden="true" />
            <div className="orbit orbit-two" aria-hidden="true" />
            <div className="core-cube" aria-hidden="true">
              <span className="face front">BUNIN</span>
              <span className="face back">SAFE</span>
              <span className="face right">OTA</span>
              <span className="face left">MFE</span>
              <span className="face top">RUN</span>
              <span className="face bottom">OPS</span>
            </div>
            <div className="model-nodes" aria-hidden="true">
              {modelNodes.map((node) => (
                <span key={node}>{node}</span>
              ))}
            </div>
          </div>
          <div className="terminal-card mini-terminal" aria-label="번인 기술 원칙">
            <div className="terminal-bar"><span /><span /><span /></div>
            <pre><code>{`$ bunin run mission
> 반복 업무는 자동화한다
> 위험한 배포는 검증한다
> 운영 로그는 거짓말하지 않는다

status: obsessed_with_it`}</code></pre>
          </div>
        </aside>
      </section>

      <section className="metrics" aria-label="핵심 역량">
        <article><strong>Mobile</strong><span>React Native · OTA · MFE</span></article>
        <article><strong>Runtime</strong><span>Native contract · Safety gate</span></article>
        <article><strong>DX</strong><span>CLI · Config · Integration</span></article>
        <article><strong>Ops</strong><span>CI/CD · Rollback · Verification</span></article>
      </section>

      <section id="project" className="section">
        <div className="section-heading">
          <p className="eyebrow">Flagship Project</p>
          <h2>번인이 밀어붙이는 대표 프로젝트</h2>
          <p>
            React Native 앱 배포와 네이티브 호환성 문제를 집요하게 파고든
            번인의 핵심 오픈소스 엔지니어링 자산입니다.
          </p>
        </div>

        <div className="project-grid single-project">
          <article className="project-card featured">
            <div className="card-top">
              <span className="tag">Open Source</span>
              <span className="status">Active</span>
            </div>
            <h3>React Native Micro Frontend</h3>
            <p>
              React Native 앱에서 기능 모듈을 독립 배포하면서도 네이티브 호환성과
              OTA 안전성을 잃지 않도록 만드는 런타임/CLI/검증 레이어입니다.
              모바일 앱을 더 작게 나누고, 더 자주 배포하고, 더 안전하게 되돌리는
              번인의 대표 엔지니어링 프로젝트입니다.
            </p>
            <div className="project-actions">
              <a href="https://rnmfe.bunin.app/" target="_blank" rel="noreferrer">문서 사이트</a>
              <a href="https://github.com/burned-in/react-native-micro-frontend" target="_blank" rel="noreferrer">GitHub</a>
            </div>
          </article>
        </div>
      </section>

      <section id="stack" className="section split">
        <div>
          <p className="eyebrow">Engineering Style</p>
          <h2>우리는 화려함보다 재현성과 운영성을 믿습니다.</h2>
        </div>
        <div className="principles">
          {principles.map(([title, body]) => (
            <div key={title}>
              <strong>{title}</strong>
              <p>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta">
        <p className="eyebrow">Burned-in, not patched-on</p>
        <h2>한 번 만들고 끝나는 웹사이트보다, 매일 살아남는 시스템을 만듭니다.</h2>
      </section>
    </main>
  );
}
