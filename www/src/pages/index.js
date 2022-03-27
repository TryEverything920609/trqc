import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import GitHubButton from 'react-github-btn';
import Head from '@docusaurus/Head';

const features = [
  {
    title: <>🧙‍♂️&nbsp; Automatic typesafety</>,
    // imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Automatic typesafety & autocompletion inferred from your API-paths,
        their input&nbsp;data, &amp;&nbsp;outputs.
      </>
    ),
  },
  {
    title: <>🍃&nbsp; Light &amp; Snappy DX</>,
    // imageUrl: 'img/undraw_docusaurus_react.svg',
    description: (
      <>
        No code generation, run-time bloat, or build pipeline.{' '}
        <a href="#zero" aria-describedby="footnote-label" id="footnotes-ref">
          Zero dependencies
        </a>{' '}
        &amp; a tiny client-side footprint.
      </>
    ),
  },
  {
    title: <>🐻&nbsp; Add to existing brownfield project</>,
    // imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        Easy to add to your existing brownfield project with adapters for
        Connect/Express/Next.js.
      </>
    ),
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;

  return (
    <Layout
      title={`${siteConfig.title} - End-to-end typesafe APIs made easy`}
      description="Automatic typesafety & autocompletion inferred from your API-paths, their input data, &amp; outputs 🧙‍♂️"
    >
      <Head>
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charSet="utf-8"
        />
      </Head>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container main-container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <p>
            <GitHubButton
              href="https://github.com/trpc/trpc"
              data-icon="octicon-star"
              data-size="large"
              data-show-count="true"
              aria-label="Star trpc/trpc on GitHub"
            >
              Star
            </GitHubButton>
          </p>

          <figure className={styles.figure}>
            <img
              src="https://storage.googleapis.com/trpc/trpcgif.gif"
              alt="Server/client example"
            />
            <figcaption>
              The client doesn&apos;t import <em>any code</em> from the server,
              only a single TypeScript type. The <code>import type</code>{' '}
              declaration is{' '}
              <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export">
                fully erased
              </a>{' '}
              at runtime. tRPC transforms this type into a fully typesafe
              client.
            </figcaption>
          </figure>
          <p>
            <Link
              className={clsx('getStarted', styles.getStarted)}
              to={useBaseUrl('docs/')}
            >
              Get Started
            </Link>
          </p>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <>
            <section className={styles.features}>
              <div className="container">
                <div className="row">
                  {features.map((props, idx) => (
                    <Feature key={idx} {...props} />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </main>
      <footer className={`container ${styles.container}`}>
        <ol className="footnotes">
          <li id="zero">
            <code>@trpc/client</code> depends on some babel runtime helpers +
            that a <code>fetch()</code> polyfill/ponyfill is used if the browser
            doesn&apos;t support it. <code>@trpc/react</code> is built on top of{' '}
            <a href="https://react-query.tanstack.com/">react-query</a>.
          </li>
        </ol>
      </footer>
    </Layout>
  );
}

export default Home;
