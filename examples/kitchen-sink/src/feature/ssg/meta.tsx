import { ExampleProps } from 'utils/example';

export const ssgProps: ExampleProps = {
  title: 'Static Site Generation (SSG)',
  href: '/ssg',
  summary: (
    <>
      <p>
        Using Static Site Generation &amp; <code>getStaticProps</code>
      </p>
    </>
  ),
  files: [
    { title: 'Router', path: 'feature/ssg/router.ts' },
    { title: 'Page', path: 'pages/ssg.tsx' },
  ],
};
