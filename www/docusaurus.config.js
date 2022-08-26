// @ts-check

/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: 'tRPC',
  tagline: 'Move Fast and Break Nothing.\nEnd-to-end typesafe APIs made easy.',
  url: 'https://trpc.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'trpc', // Usually your GitHub org/user name.
  projectName: 'trpc', // Usually your repo name.
  themeConfig: {
    defaultMode: 'darkMode',
    disableSwitch: false,
    respectPrefersColorScheme: true,
    image: 'img/facebook_cover_photo_2.png',
    prism: {
      theme: require('prism-react-renderer/themes/vsDark'),
    },
    algolia: {
      appId: 'BTGPSR4MOE',
      apiKey: 'ed8b3896f8e3e2b421e4c38834b915a8',
      indexName: 'trpc',
      // contextualSearch: true,
      // searchParameters: {},
    },
    announcementBar: {
      id: 'v10',
      content:
        "🚀 You are looking at a pre-release of tRPC v10! See <a href='https://alpha.trpc.io/docs/v10/migrate-from-v9-to-v10'>the migration guide</a> for a summary of what is changing &amp; <a href='https://github.com/trpc/examples-v10-next-prisma-starter-sqlite'>go here</a> to try out a real project using this version.",
      backgroundColor: 'var(--ifm-color-primary-dark)',
      textColor: '#ffffff',
      isCloseable: false,
    },
    navbar: {
      title: 'tRPC',
      logo: {
        alt: 'tRPC logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'doc',
          docId: 'main/introduction',
          label: 'Docs',
        },
        {
          type: 'doc',
          docId: 'main/quickstart',
          label: 'Quickstart',
        },
        {
          type: 'doc',
          docId: 'main/awesome-trpc',
          label: 'Awesome tRPC Collection',
        },
        {
          type: 'doc',
          docId: 'nextjs/introduction',
          label: 'Usage with Next.js',
        },
        {
          href: 'https://github.com/trpc/trpc/tree/next',
          label: 'GitHub',
          position: 'right',
          className: 'navbar-external-link',
        },
        {
          href: 'https://twitter.com/alexdotjs',
          label: 'Twitter',
          position: 'right',
          className: 'navbar-external-link',
        },
        {
          href: 'https://trpc.io/discord',
          label: 'Discord',
          position: 'right',
          className: 'navbar-external-link',
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
        },
      ],
    },
    footer: {
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Docs',
              to: 'docs/v9',
            },
            {
              label: 'Usage with Next.js',
              to: 'docs/v9/nextjs',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/trpc/trpc/tree/next',
              className: 'flex items-center',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/alexdotjs',
              className: 'flex items-center',
            },
            {
              label: 'Discord',
              href: 'https://trpc.io/discord',
              className: 'flex items-center',
            },
          ],
        },
        {
          title: 'More',
          items: [
            // {
            //   label: 'Blog',
            //   to: 'blog',
            // },
            {
              label: 'GitHub',
              href: 'https://github.com/trpc/trpc/tree/next',
              className: 'flex items-center',
            },
          ],
        },
      ],
      // copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
    },
  },
  plugins: [
    async function myPlugin() {
      return {
        name: 'docusaurus-tailwindcss',
        configurePostCss(postcssOptions) {
          // Appends TailwindCSS and AutoPrefixer.
          //eslint-disable-next-line
          postcssOptions.plugins.push(require('tailwindcss'));
          //eslint-disable-next-line
          postcssOptions.plugins.push(require('autoprefixer'));
          return postcssOptions;
        },
      };
    },
  ],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          lastVersion: '9.x',
          // disableVersioning: true,
          // onlyIncludeVersions: ['9.x'],
          versions: {
            current: {
              label: '10.x',
              path: 'v10',
              badge: true,
              className: 'v10',
            },
            '9.x': {
              label: '9.x',
              path: 'v9',
              className: 'v9',
            },
          },
          // includeCurrentVersion: false,
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/trpc/trpc/tree/next/www/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/trpc/trpc/tree/next/www/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        googleAnalytics: {
          trackingID: 'UA-198119985-2',
          // Optional fields.
          anonymizeIP: true, // Should IPs be anonymized?
        },
      },
    ],
    [
      'docusaurus-preset-shiki-twoslash',
      {
        // Not sure how reliable this path is (it's relative from the preset package)?
        // None of the light themes had good support for `diff` mode, so had to patch my own theme
        themes: ['../../../www/min-light-with-diff', 'nord'],
      },
    ],
  ],
  scripts: [
    {
      async: true,
      src: 'https://platform.twitter.com/widgets.js',
      charSet: 'utf-8',
    },
  ],
  clientModules: [require.resolve('./docusaurus.twitterReload.js')],
};
