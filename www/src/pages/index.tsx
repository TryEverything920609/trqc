import Head from '@docusaurus/Head';
import { useLocation } from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import React, { useEffect, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { Button } from '../components/Button';
import { Features } from '../components/Features';
import { GithubStarsButton } from '../components/GithubStarsButton';
import { Preview } from '../components/Preview';
import { SectionTitle } from '../components/SectionTitle';
import { TopSponsors } from '../components/TopSponsors';
import { TwitterWall } from '../components/TwitterWall';
import { Sponsors } from '../components/sponsors';

type Version = 'current' | '9.x';

const getLocalStorageVersion = (): Version => {
  if (typeof window === 'undefined') {
    return '9.x';
  }
  return (window.localStorage.getItem('docs-preferred-version-default') ||
    '9.x') as Version;
};
/**
 * Hack to get the selected version of the page from local storage
 */
function useLocalStorageVersion() {
  const [version, setVersion] = useState<Version>(() =>
    getLocalStorageVersion(),
  );

  return {
    active: version,
    set(value: Version) {
      setVersion(value as Version);
      window.localStorage.setItem('docs-preferred-version-default', value);
    },
  };
}
function useInitialWindowSize() {
  const [windowSize] = useState<null | {
    width: number;
    height: number;
  }>(() => {
    if (typeof window === 'undefined') {
      return null;
    }
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  return windowSize;
}

function searchParams(obj: Record<string, string | string[]>): string {
  return Object.entries(obj)
    .map(([key, value]) => {
      const values = Array.isArray(value) ? value : [value];

      return values.map((v) => `${key}=${encodeURIComponent(v)}`).join('&');
    })
    .join('&');
}

function Home() {
  const context = useDocusaurusContext();

  /** initial theme used for stackblitz embed. dont want to reload the embed on theme-toggle so we just load it once */
  // const [initialTheme] = React.useState<'dark' | 'light'>(() => {
  //   // const localStorageTheme = window.localStorage.getItem('theme');
  //   // if (localStorageTheme) {
  //   //   return localStorageTheme;
  //   // }
  //   const prefersDark = window.matchMedia(
  //     '(prefers-color-scheme: dark)',
  //   ).matches;
  //   return prefersDark ? 'dark' : 'light';
  // });

  const { siteConfig } = context;

  const version = useLocalStorageVersion();
  const windowSize = useInitialWindowSize();

  const location = useLocation();

  const isV10 = version.active === 'current';
  const [isMounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Layout
      title={`${siteConfig.title} - ${siteConfig.tagline}`}
      description="End-to-end typesafe APIs made easy. Automatic typesafety & autocompletion inferred from your API-paths, their input data, &amp; outputs 🧙‍♂️"
    >
      <Head>
        <body className="homepage" />
        <html className={isV10 ? 'v10' : 'v9'} />
        <script
          async
          src="https://platform.twitter.com/widgets.js"
          charSet="utf-8"
        />
      </Head>
      <main className="px-6 mx-auto space-y-28">
        <header className="pt-12 lg:pt-16 xl:pt-24 max-w-[66ch] mx-auto text-center">
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-center whitespace-pre-wrap md:text-3xl lg:text-4xl xl:text-5xl">
            {siteConfig.tagline}
          </h1>
          <p className="pt-3 text-sm font-medium text-center text-gray-600 md:text-lg dark:text-gray-400">
            Experience the full power of{' '}
            <span className="underline text-slate-900 dark:text-slate-100 decoration-rose-500 underline-offset-2 decoration-wavy decoration-from-font">
              TypeScript
            </span>{' '}
            inference and boost productivity while building your next full-stack
            application.
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="flex-1 flex justify-end">
              <GithubStarsButton />
            </div>
            <div className="flex-1 flex justify-start">
              <Button
                variant="primary"
                href={`/docs/${isV10 ? 'v10' : 'v9'}/quickstart`}
                className="text-lg"
              >
                Quickstart
                <FiArrowRight size={20} strokeWidth={3} />
              </Button>
            </div>
          </div>
          <Preview />
          <TopSponsors />
        </header>

        <section className="container">
          <Features />
        </section>

        <section className="mx-auto max-w-[1600px] hidden md:block">
          <SectionTitle
            id="try-it-out"
            title={<>Try it out for yourself!</>}
            description={
              <>
                This is a minimal full-stack React-application using tRPC &amp;
                Next.js
              </>
            }
          />
          <div className="h-[600px] w-full rounded-xl overflow-hidden z-10 relative my-4">
            {isMounted && (
              // If we change `src` of the iframe, it'll steal focus and scroll down, so we wait until first mount to render it
              <iframe
                className="h-full w-full absolute"
                src={
                  `https://stackblitz.com/github/trpc/trpc/tree/${
                    isV10 ? 'next' : 'main'
                  }/examples/next-minimal-starter?` +
                  searchParams({
                    embed: '1',
                    file: [
                      // Opens these side-by-side
                      'src/pages/index.tsx',
                      'src/pages/api/trpc/[trpc].ts',
                    ],
                    hideNavigation: '1',
                    terminalHeight: '1',
                    showSidebar: '0',
                    view: 'editor',
                  })
                }
                frameBorder="0"
              />
            )}
          </div>
          <div className="flex justify-center">
            <Button
              variant="tertiary"
              href="https://github.com/trpc/next-minimal-starter/generate"
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="fill-[#181717] dark:fill-white h-5 pr-1"
              >
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              <span className="dark:text-zinc-300 text-zinc-900 no-underline font-semibold mx-auto">
                Use this template
              </span>
            </Button>
          </div>
        </section>

        <section className="max-w-[80ch] px-6 mx-auto md:px-0">
          <SectionTitle
            id="quote"
            title={<>You may not need a traditional API</>}
          />
          <blockquote
            cite="https://twitter.com/alexdotjs"
            className="py-2 mt-6 space-y-2"
          >
            <p className="text-sm text-gray-600 md:text-base dark:text-gray-400">
              I built tRPC to allow people to <strong>move faster</strong> by
              removing the need of a traditional API-layer, while still having
              confidence that our apps won&apos;t break as we rapidly iterate.
            </p>
            <p className="text-sm text-gray-600 md:text-base dark:text-gray-400">
              Try it out for yourself and let us know what you think!
            </p>
          </blockquote>
          <a
            className="flex items-center gap-3 pt-6 group hover:no-underline"
            href="http://twitter.com/alexdotjs"
          >
            <img
              src="https://avatars.githubusercontent.com/u/459267?v=4"
              alt="Alex/KATT"
              loading="lazy"
              className="w-12 h-12 mr-2 rounded-full md:w-14 md:h-14"
            />
            <div>
              <h3 className="mb-0 text-base font-bold md:text-lg">Alex/KATT</h3>
              <p className="text-xs text-gray-600 md:text-sm dark:text-gray-400">
                Creator of tRPC
              </p>
            </div>
          </a>
        </section>
        <section className="container">
          <SectionTitle id="twitter-wall" title="Don't take our word for it!" />
          <TwitterWall />
        </section>
        <section className="pb-12">
          <SectionTitle
            id="all-sponsors"
            title="All Sponsors"
            description={
              <>
                We really love all of our amazing{' '}
                <a
                  href="https://github.com/sponsors/KATT"
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  sponsors
                </a>
                , who help make sure tRPC is here to stay.
              </>
            }
          />
          <div className="max-w-screen-md mx-auto">
            <div className="my-3 aspect-square">
              <Sponsors />
            </div>
            <div className="flex justify-center">
              <Button variant="primary" href="https://github.com/sponsors/KATT">
                Become a sponsor!
              </Button>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}

export default Home;
