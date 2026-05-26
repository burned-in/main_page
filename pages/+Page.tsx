import { useCallback, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { cx } from '../styled-system/css';
import { pageStyles as s } from '../src/styles';

const principles = [
  ['01. 자동화 집착', '반복 작업은 CLI, 스크립트, 워커, 파이프라인으로 흡수합니다.'],
  ['02. 제품 중심 개발', '웹앱, 관리자 페이지, 결제, 문서, 데이터 흐름을 실제 사용 시나리오 기준으로 연결합니다.'],
  ['03. 운영 중심 설계', '로그, 권한, 재시도, 백업, 장애 대응을 제품의 일부로 봅니다.'],
  ['04. 풀스택 실행력', '프론트엔드, 백엔드, 배포, 자동화, 모바일까지 필요한 범위를 끝까지 책임집니다.'],
] as const;

const modelNodes = ['App Shell', 'Feature A', 'Feature B', 'OTA Gate'] as const;

type ModelRotation = {
  x: number;
  y: number;
};

const defaultModelRotation = { x: -18, y: 34 } satisfies ModelRotation;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const seoServices = [
  ['고객이 만나는 화면', '랜딩, 웹앱, 대시보드, 관리자 페이지를 빠르게 이해되고 오래 쓰이는 흐름으로 만듭니다.'],
  ['손안에서 돌아가는 앱', '모바일 앱과 네이티브 기능 연동까지 제품의 속도와 사용감을 해치지 않게 설계합니다.'],
  ['일이 줄어드는 시스템', '인증, 권한, 데이터 처리, 파일·문서 흐름처럼 반복 업무를 줄이는 백엔드를 연결합니다.'],
  ['안심하고 올리는 운영', '배포 자동화, 로그, 롤백, 장애 대응까지 제품 출시 이후의 운영을 처음부터 포함합니다.'],
] as const;

const faqs = [
  ['bunIn은 어떤 기업인가요?', 'bunIn(번인)은 아이디어를 화면, 앱, 백엔드, 배포 운영까지 이어 실제로 돌아가는 제품으로 만드는 풀스택 개발 기업입니다.'],
  ['bunIn은 어떤 일을 잘하나요?', '고객용 화면, 내부 운영 도구, 모바일 앱, 데이터 흐름, 업무 자동화, 배포 운영까지 제품이 실제로 쓰이는 전 과정을 함께 설계합니다.'],
  ['bunIn이 중요하게 보는 가치는 무엇인가요?', '멋있어 보이는 데모보다 실제 사람이 쓰기 쉬운 화면, 안정적인 데이터 처리, 운영 로그, 자동화, 유지보수 가능한 코드를 중요하게 봅니다.'],
] as const;

export default function Page() {
  const [modelRotation, setModelRotation] = useState<ModelRotation>(defaultModelRotation);
  const dragStartRef = useRef<{ x: number; y: number; rotation: ModelRotation } | null>(null);

  const modelStyle = {
    '--model-rx': `${modelRotation.x}deg`,
    '--model-ry': `${modelRotation.y}deg`,
  } as CSSProperties;

  const handleModelPointerDown = useCallback((event: PointerEvent<HTMLDivElement>) => {
    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      rotation: modelRotation,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }, [modelRotation]);

  const handleModelPointerMove = useCallback((event: PointerEvent<HTMLDivElement>) => {
    const dragStart = dragStartRef.current;
    if (!dragStart) return;

    const nextX = clamp(dragStart.rotation.x - (event.clientY - dragStart.y) * 0.18, -42, 34);
    const nextY = dragStart.rotation.y + (event.clientX - dragStart.x) * 0.22;

    setModelRotation({ x: nextX, y: nextY });
  }, []);

  const handleModelPointerUp = useCallback((event: PointerEvent<HTMLDivElement>) => {
    dragStartRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleModelKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 12 : 7;

    if (event.key === 'Home') {
      event.preventDefault();
      setModelRotation(defaultModelRotation);
      return;
    }

    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;

    event.preventDefault();
    setModelRotation((current) => {
      if (event.key === 'ArrowUp') return { ...current, x: clamp(current.x - step, -42, 34) };
      if (event.key === 'ArrowDown') return { ...current, x: clamp(current.x + step, -42, 34) };
      if (event.key === 'ArrowLeft') return { ...current, y: current.y - step };
      return { ...current, y: current.y + step };
    });
  }, []);

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
            bunIn(번인)은 화면, 앱, 백엔드, 배포 운영을 따로 떼어 보지 않습니다.
            사용자는 더 쉽게 쓰고, 팀은 더 적게 반복하고, 제품은 더 안전하게 커지도록
            처음부터 끝까지 하나의 흐름으로 설계합니다.
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
          <div
            className={s.modelStage}
            role="img"
            aria-label="드래그하거나 방향키로 회전할 수 있는 앱 런타임 3D 모델"
            tabIndex={0}
            style={modelStyle}
            onPointerDown={handleModelPointerDown}
            onPointerMove={handleModelPointerMove}
            onPointerUp={handleModelPointerUp}
            onPointerCancel={handleModelPointerUp}
            onKeyDown={handleModelKeyDown}
            onDoubleClick={() => setModelRotation(defaultModelRotation)}
          >
            <div className={s.modelGrid} aria-hidden="true" />
            <div className={s.modelGlow} aria-hidden="true" />
            <div className={s.modelRig} aria-hidden="true">
              <div className={s.modelPlate} />
              <div className={s.modelBeams}>
                <span />
                <span />
                <span />
              </div>
              <div className={s.orbitOne} />
              <div className={s.orbitTwo} />
              <div className={s.orbitThree} />
              <div className={s.coreCube}>
                <span className={cx(s.cubeFace, s.faceFront)}>bunIn</span>
                <span className={cx(s.cubeFace, s.faceBack)}>SAFE</span>
                <span className={cx(s.cubeFace, s.faceRight)}>OTA</span>
                <span className={cx(s.cubeFace, s.faceLeft)}>MFE</span>
                <span className={cx(s.cubeFace, s.faceTop)}>RUN</span>
                <span className={cx(s.cubeFace, s.faceBottom)}>OPS</span>
              </div>
            </div>
            <div className={s.modelNodes} aria-hidden="true">
              {modelNodes.map((node) => (
                <span key={node}>{node}</span>
              ))}
            </div>
            <span className={s.modelHint} aria-hidden="true">drag · arrows · double click reset</span>
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
        <article><strong>Launch</strong><span>아이디어를 바로 만져지는 제품으로</span></article>
        <article><strong>Flow</strong><span>화면, 앱, 데이터가 끊기지 않게</span></article>
        <article><strong>Ops</strong><span>배포와 장애 대응이 무섭지 않게</span></article>
        <article><strong>Scale</strong><span>작게 시작해도 커질 수 있게</span></article>
      </section>

      <section id="project" className={s.section}>
        <div className={s.sectionHeading}>
          <p className={s.eyebrow}>What We Build</p>
          <h2 className={s.h2}>bunIn은 제품이 처음 쓰이는 순간부터 운영되는 날까지 함께 만듭니다.</h2>
          <p>
            프론트엔드와 앱에서 끝나지 않고 백엔드, 인프라, 배포 자동화,
            운영 안정성까지 비즈니스에 필요한 소프트웨어를 풀스택으로 연결합니다.
          </p>
        </div>

        <div className={s.projectGrid}>
          <article className={s.projectCard}>
            <div className={s.cardTop}>
              <span className={s.tag}>Full Stack</span>
              <span className={s.status}>Idea → Ops</span>
            </div>
            <h3 className={s.h3}>아이디어가 실제 업무 흐름이 되기까지</h3>
            <p>
              bunIn은 고객이 보는 웹 화면, 모바일 앱, 직원이 쓰는 관리자 페이지, 데이터를 처리하는 백엔드,
              배포와 운영 자동화까지 하나의 제품 흐름으로 만듭니다.
              기술 이름보다 중요한 것은 사용자가 막히지 않고, 팀의 반복 업무가 줄고,
              출시 이후에도 안전하게 고칠 수 있는 구조입니다.
            </p>
            <div className={s.projectActions}>
              <a href="#seo-profile">서비스 영역</a>
              <a href="https://github.com/burned-in/react-native-micro-frontend" target="_blank" rel="noreferrer">오픈소스 런타임 보기</a>
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
          <h2 id="seo-profile-title" className={s.h2}>bunIn은 만들고 끝내지 않고, 운영되는 제품을 설계하는 풀스택 기업입니다.</h2>
          <p>
            검색엔진과 고객이 같은 답을 얻도록 bunIn이 만드는 것, 해결하는 문제,
            일하는 방식과 기업 식별 정보를 명확한 문장과 구조로 공개합니다.
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
            <dd>제품 설계, 앱 경험, 백엔드 흐름, 업무 자동화, 배포 운영</dd>
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
