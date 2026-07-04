import { useRef } from 'react';
import { cx } from '../../styled-system/css';
import {
  capabilityMetrics,
  companyFacts,
  faqs,
  customerPromises,
  principles,
  projects,
  scrollStoryPanels,
  serviceAreas,
} from './content';
import { HeroScene } from './HeroScene';
import { homeStyles as s } from './homeStyles';
import { useAnimeMicroInteractions } from './useAnimeMicroInteractions';
import { useGsapScrollEffects } from './useGsapScrollEffects';

export function HomePage() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGsapScrollEffects(rootRef);
  useAnimeMicroInteractions(rootRef);

  return (
    <main ref={rootRef} id="top" className={s.main}>
      <section className={s.scrollStage} data-scroll-stage>
        <div className={s.stageAura} data-depth="0.12" aria-hidden="true" />

        <div className={s.sceneRail}>
          <HeroScene />
        </div>

        <div className={s.storyFlow}>
          <section className={s.heroCopy} aria-labelledby="hero-title">
            <h1 id="hero-title" className={s.h1}>
              생각만 하던 일을
              <span>쓰이는 서비스로.</span>
            </h1>
            <p className={s.heroText}>
              홈페이지, 앱, 예약과 결제, 관리 화면을 함께 만듭니다.
            </p>
            <div className={s.actionRow}>
              <a className={s.buttonPrimary} href="#project" data-micro>
                무엇을 만들 수 있나요?
              </a>
              <a className={s.buttonGhost} href="#seo-profile" data-micro>
                회사 정보 보기
              </a>
            </div>
          </section>

          {scrollStoryPanels.map((panel, index) => (
            <article
              key={panel.title}
              className={s.storyPanel}
              data-side={index % 2 === 0 ? 'left' : 'right'}
              data-micro
              data-scene-step
            >
              <span className={s.storyTone}>{panel.tone}</span>
              <h2 className={s.h2}>{panel.title}</h2>
              <p>{panel.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={s.metrics} aria-label="핵심 역량" data-reveal>
        {capabilityMetrics.map(([title, body]) => (
          <article key={title} data-micro>
            <strong>{title}</strong>
            <span>{body}</span>
          </article>
        ))}
      </section>

      <section className={s.motionStrip} aria-label="고객 안내" data-reveal>
        {customerPromises.map(([title, body]) => (
          <article key={title} data-micro>
            <span>{title}</span>
            <p>{body}</p>
          </article>
        ))}
      </section>

      <section id="project" className={s.section}>
        <div className={s.sectionHeader} data-reveal>
          <h2 className={s.h2}>필요한 것부터 시작합니다.</h2>
          <p>
            홈페이지 하나만 필요해도 괜찮습니다. 예약, 결제, 문의, 관리 화면까지 필요한 만큼 정리합니다.
          </p>
        </div>

        <div className={s.projectGrid}>
          {projects.map((project) => (
            <article key={project.title} className={s.projectCard} data-reveal data-micro>
              <div className={s.cardTop}>
                <span className={s.label}>{project.kind}</span>
                <span className={s.mutedLabel}>{project.status}</span>
              </div>
              <h3 className={s.h3}>{project.title}</h3>
              <p>{project.body}</p>
              <div className={s.projectActions}>
                {project.links.map((link) => {
                  const isExternal = 'external' in link && link.external;

                  return (
                    <a
                      key={`${project.title}-${link.label}`}
                      href={link.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noreferrer' : undefined}
                      data-micro
                    >
                      {link.label}
                    </a>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="stack" className={cx(s.section, s.principlesSection)}>
        <div className={s.stickyText} data-reveal>
          <h2 className={s.h2}>어렵게 말하지 않습니다.</h2>
          <p>
            범위, 비용, 다음 할 일을 쉽게 설명합니다.
          </p>
        </div>
        <div className={s.principleGrid}>
          {principles.map(([title, body]) => (
            <article key={title} data-reveal data-micro>
              <h3 className={s.h3}>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="seo-profile" className={s.section} aria-labelledby="seo-profile-title">
        <div className={s.sectionHeader} data-reveal>
          <h2 id="seo-profile-title" className={s.h2}>
            무엇을 맡길 수 있는지 한눈에 보여드립니다.
          </h2>
          <p>
            bunIn이 하는 일과 기본 정보를 한곳에 정리했습니다.
          </p>
        </div>
        <div className={s.serviceGrid}>
          {serviceAreas.map(([title, body]) => (
            <article key={title} data-reveal data-micro>
              <h3 className={s.h3}>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>

        <dl className={s.companyFacts} aria-label="bunIn 기업 정보" data-reveal>
          {companyFacts.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={cx(s.section, s.faqSection)} aria-labelledby="faq-title">
        <div className={s.sectionHeader} data-reveal>
          <h2 id="faq-title" className={s.h2}>
            처음 문의 전에 많이 묻는 것들
          </h2>
        </div>
        <div className={s.faqList}>
          {faqs.map(([question, answer]) => (
            <article key={question} data-reveal data-micro>
              <h3 className={s.h3}>{question}</h3>
              <p>{answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={s.cta} data-reveal>
        <h2 className={s.h2}>만들고 싶은 일이 있다면, 짧게 들려주세요.</h2>
        <p>
          필요한 만큼만 정리해 바로 시작할 수 있습니다.
        </p>
      </section>
    </main>
  );
}
