> **🚀 You are looking at a pre-release of tRPC v10!**
>
> You might be looking for the [`main`](https://github.com/trpc/trpc/tree/main)-branch which is the stable v9-version.
>
> See our [migration guide](https://trpc.io/docs/v10/migrate-from-v9-to-v10) for a summary of what is changing or take a look at [the **v10 docs website**](https://alpha.trpc.io/).
> There is also [the `examples-v10-next-prisma-starter-sqlite` project](https://github.com/trpc/examples-v10-next-prisma-starter-sqlite) to try out a real project using this version.

---

[![tRPC](https://assets.trpc.io/www/trpc-readme.png)](https://trpc.io/)

<div align="center">
  <h1>tRPC</h1>
  <h3>Move fast and break nothing.<br />End-to-end typesafe APIs made easy.</h3>
  <a href="https://codecov.io/gh/trpc/trpc">
    <img alt="codecov" src="https://codecov.io/gh/trpc/trpc/branch/main/graph/badge.svg?token=KPPS918B0G">
  </a>
  <a href="https://github.com/trpc/trpc/blob/main/LICENSE">
    <img alt="MIT License" src="https://img.shields.io/github/license/trpc/trpc" />
  </a>
  <a href="https://trpc.io/discord">
    <img alt="Discord" src="https://img.shields.io/discord/867764511159091230?color=7389D8&label&logo=discord&logoColor=ffffff" />
  </a>
  <br />
  <a href="https://twitter.com/alexdotjs">
    <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40alexdotjs&style=social&url=https%3A%2F%2Ftwitter.com%2Falexdotjs" />
  </a>
  <a href="https://twitter.com/trpcio">
    <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40trpcio&style=social&url=https%3A%2F%2Ftwitter.com%2Falexdotjs" />
  </a>
  <br />
  <br />
  <figure>
    <img src="https://assets.trpc.io/www/v10/v10-dark-landscape.gif" alt="Demo" />
    <figcaption>
      <p align="center">
        The client above is <strong>not</strong> importing any code from the server, only its type declarations.
      </p>
    </figcaption>
  </figure>
</div>

<br />

## Intro

tRPC allows you to easily build & consume fully typesafe APIs, without schemas or code generation.

### Features

- ✅&nbsp; Well-tested and production ready.
- 🧙‍♂️&nbsp; Full static typesafety & autocompletion on the client, for inputs, outputs and errors.
- 🐎&nbsp; Snappy DX - No code generation, run-time bloat, or build pipeline.
- 🍃&nbsp; Light - tRPC has zero deps and a tiny client-side footprint.
- 🐻&nbsp; Easy to add to your existing brownfield project.
- 🔋&nbsp; Batteries included - React.js/Next.js/Express.js/Fastify adapters. _(But tRPC is not tied to React and there are many [community adapters](https://trpc.io/docs/awesome-trpc#-extensions--community-add-ons) for other libraries)_
- 🥃&nbsp; Subscriptions support.
- ⚡️&nbsp; Request batching - requests made at the same time can be automatically combined into one
- 👀&nbsp; Quite a few examples in the [./examples](./examples)-folder

## Quickstart

There are a few [examples](https://trpc.io/docs/example-apps) that you can use for playing out with tRPC or bootstrapping your new project. For example, if you want a next.js app, you can use the full-stack next.js example:

**Quick start with a full-stack Next.js example:**

```sh
# yarn
yarn create next-app --example https://github.com/trpc/trpc --example-path examples/next-prisma-starter trpc-prisma-starter
# npm
npx create-next-app --example https://github.com/trpc/trpc --example-path examples/next-prisma-starter trpc-prisma-starter
```

**👉 See full documentation on [tRPC.io](https://trpc.io/docs). 👈**

## Star History

> tRPC is rapidly gaining momentum!

<a href="https://star-history.com/#trpc/trpc"><img src="https://api.star-history.com/svg?repos=trpc/trpc&type=Date" alt="Star History Chart" width="600" /></a>

## Core Team

> Do you want to contribute? First, read the <a href="https://github.com/trpc/trpc/blob/next/CONTRIBUTING.md">Contributing Guidelines</a> before opening an issue or PR so you understand the branching strategy and local development environment. If you need any more guidance or want to ask more questions, feel free to write to us on <a href="https://trpc.io/discord">Discord</a>!

<table>
  <tr>
    <td align="center"><a href="https://twitter.com/alexdotjs"><img src="https://avatars.githubusercontent.com/u/459267?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alex / KATT</b></sub></a></td>
    <td>👋 Hi, I'm Alex and I am the creator of tRPC, don't hesitate to contact me on <a href="https://twitter.com/alexdotjs">Twitter</a> or <a href="mailto:alex@trpc.io">email</a> if you are curious about tRPC in any way.</td>
  </tr>
</table>

### Project leads

> The people who lead the API-design decisions and has the most active role in the development

<table>
  <tbody>
      <td align="center"><a href="https://twitter.com/s4chinraja"><img src="https://avatars.githubusercontent.com/u/58836760?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Sachin Raja</b></sub></a></td>
      <td align="center"><a href="https://twitter.com/alexdotjs"><img src="https://avatars.githubusercontent.com/u/459267?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Alex / KATT</b></sub></a></td>
    </tr>
  </tbody>
</table>

### Active contributors

> People who actively help out improving the codebase by making PRs and reviewing code

<table>
  <tbody>
    <tr>
      <td align="center"><a href="https://twitter.com/jlalmes"><img src="https://avatars.githubusercontent.com/u/69924001?v=4?s=100" width="100px;" alt=""/><br /><sub><b>James Berry</b></sub></a></td>
      <td align="center"><a href="http://www.jumr.dev"><img src="https://avatars.githubusercontent.com/u/51714798?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Julius Marminge</b></sub></a></td>
      <td align="center"><a href="https://elsakaan.dev"><img src="https://avatars.githubusercontent.com/u/20271968?v=4&s=100" width="100" alt="Ahmed%20Elsakaan"/><br /><sub><b>Ahmed Elsakaan</b></sub></a></td>
    </tr>
  </tbody>
</table>

### Special shout-outs

<table>
  <tbody>
    <tr>
      <td align="center"><a href="http://www.big-sir.com"><img src="https://avatars.githubusercontent.com/u/3660667?v=4?s=100" width="100px;" alt=""/><br /><sub><b>bautistaaa</b></sub></a></td>
      <td align="center"><a href="http://t3.gg"><img src="https://avatars.githubusercontent.com/u/6751787?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Theo Browne</b></sub></a></td>
    </tr>
  </tbody>
</table>

## Sponsors

If you enjoy working with tRPC and want to support me consider giving a token appreciation by [GitHub Sponsors](https://github.com/sponsors/KATT)!

Also, if your company using tRPC and want to support long-term maintenance of tRPC, have a look at the [sponsorship tiers](https://github.com/sponsors/KATT) or [get in touch](mailto:alex@trpc.io) to discuss potential partnerships.

<!-- SPONSORS:LIST:START -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

### 🥇 Gold Sponsors

<table>
  <tr>
   <td align="center"><a href="https://render.com"><img src="https://avatars.githubusercontent.com/u/36424661?v=4&s=180" width="180" alt="Render"/><br />Render</a></td>
   <td align="center"><a href="https://cal.com"><img src="https://avatars.githubusercontent.com/u/79145102?v=4&s=180" width="180" alt="Cal.com,%20Inc."/><br />Cal.com, Inc.</a></td>
  </tr>
</table>

### 🥈 Silver Sponsors

<table>
  <tr>
   <td align="center"><a href="https://Youarerad.org"><img src="https://avatars.githubusercontent.com/u/22589564?u=00737f7066b9bb06314a1ad7ca099ab252e101eb&v=4&s=150" width="150" alt="Jason%20Docton"/><br />Jason Docton</a></td>
   <td align="center"><a href="https://ping.gg/"><img src="https://avatars.githubusercontent.com/u/89191727?v=4&s=150" width="150" alt="Ping.gg"/><br />Ping.gg</a></td>
   <td align="center"><a href="https://www.prisma.io"><img src="https://avatars.githubusercontent.com/u/17219288?v=4&s=150" width="150" alt="Prisma"/><br />Prisma</a></td>
  </tr>
</table>

### 🥉 Bronze Sponsors

<table>
  <tr>
   <td align="center"><a href="https://www.newfront.com"><img src="https://avatars.githubusercontent.com/u/44950377?v=4&s=120" width="120" alt="Newfront"/><br />Newfront</a></td>
   <td align="center"><a href="https://github.com/hidrb"><img src="https://avatars.githubusercontent.com/u/77294655?v=4&s=120" width="120" alt="Dr.%20B"/><br />Dr. B</a></td>
   <td align="center"><a href="https://standardresume.co/r/ryan-edge"><img src="https://avatars.githubusercontent.com/u/6907797?u=71aca5cb761c401b4abbf100057978a76f2f5e22&v=4&s=120" width="120" alt="Ryan"/><br />Ryan</a></td>
   <td align="center"><a href="https://snaplet.dev"><img src="https://avatars.githubusercontent.com/u/69029941?v=4&s=120" width="120" alt="Snaplet"/><br />Snaplet</a></td>
   <td align="center"><a href="https://flylance.com"><img src="https://avatars.githubusercontent.com/u/67534310?v=4&s=120" width="120" alt="Flylance"/><br />Flylance</a></td>
  </tr>
</table>

### 😻 Individuals

<table>
  <tr>
   <td align="center"><a href="https://anthonyshort.me"><img src="https://avatars.githubusercontent.com/u/36125?u=a3d7f3e18939c0b2d362af8704349d851ee5c325&v=4&s=100" width="100" alt="Anthony%20Short"/><br />Anthony Short</a></td>
   <td align="center"><a href="https://hampuskraft.com"><img src="https://avatars.githubusercontent.com/u/24176136?u=ca9876f3b8e32cc2f624a5957d5814ee7ef3fee0&v=4&s=100" width="100" alt="Hampus%20Kraft"/><br />Hampus Kraft</a></td>
   <td align="center"><a href="https://github.com/danielyogel"><img src="https://avatars.githubusercontent.com/u/2037064?u=625c1b7bf16f83a378545126927aebed2db86bac&v=4&s=100" width="100" alt="Daniel%20Yogel"/><br />Daniel Yogel</a></td>
   <td align="center"><a href="https://samholmes.net"><img src="https://avatars.githubusercontent.com/u/8385528?u=fd301b43d02a6892be0ae749c14dd485d7a34835&v=4&s=100" width="100" alt="Sam%20Holmes"/><br />Sam Holmes</a></td>
   <td align="center"><a href="https://github.com/jzimmek"><img src="https://avatars.githubusercontent.com/u/40382?v=4&s=100" width="100" alt="Jan%20Zimmek"/><br />Jan Zimmek</a></td>
   <td align="center"><a href="https://t3.gg"><img src="https://avatars.githubusercontent.com/u/6751787?u=3b31853b56349de39c66e73c14e6d34d047f0b53&v=4&s=100" width="100" alt="Theo%20Browne"/><br />Theo Browne</a></td>
  </tr>
  <tr>
   <td align="center"><a href="https://maxgreenwald.me"><img src="https://avatars.githubusercontent.com/u/2615374?u=4c1402dd1e4e8ff7514f2e300adfe9b75ae76e85&v=4&s=100" width="100" alt="Max%20Greenwald"/><br />Max Greenwald</a></td>
   <td align="center"><a href="https://github.com/Memory-Lane-Games"><img src="https://avatars.githubusercontent.com/u/63847783?v=4&s=100" width="100" alt="Memory-Lane-Games"/><br />Memory-Lane-Games</a></td>
   <td align="center"><a href="https://react-hook-form.com"><img src="https://avatars.githubusercontent.com/u/10513364?u=a129aade5f9a7a92cf06172b47d67ccefc736933&v=4&s=100" width="100" alt="Bill"/><br />Bill</a></td>
   <td align="center"><a href="https://www.illarionvk.com"><img src="https://avatars.githubusercontent.com/u/5012724?u=f6f510f226382df2ebcea4a1935aaa94eacfcda4&v=4&s=100" width="100" alt="Illarion%20Koperski"/><br />Illarion Koperski</a></td>
   <td align="center"><a href="https://timcole.me"><img src="https://avatars.githubusercontent.com/u/6754577?u=9dba0a4292ebe8e206257b62008ac4d1e1ca5a07&v=4&s=100" width="100" alt="Timothy%20Cole"/><br />Timothy Cole</a></td>
   <td align="center"><a href="https://yorick.sh"><img src="https://avatars.githubusercontent.com/u/8572133?u=247a2ef2eb9bdba02076dfd8c6a25169a8ba3464&v=4&s=100" width="100" alt="Ethan%20Clark"/><br />Ethan Clark</a></td>
  </tr>
  <tr>
   <td align="center"><a href="https://github.com/utevo"><img src="https://avatars.githubusercontent.com/u/29740731?u=500ad30b9581936882ffedb62c15f4d98cfccfc7&v=4&s=100" width="100" alt="Micha%C5%82%20Kowieski"/><br />Michał Kowieski</a></td>
   <td align="center"><a href="https://iamkhan.io"><img src="https://avatars.githubusercontent.com/u/6490268?v=4&s=100" width="100" alt="SchlagerKhan"/><br />SchlagerKhan</a></td>
   <td align="center"><a href="https://lindeneg.org/"><img src="https://avatars.githubusercontent.com/u/30244485?u=70f85b684ede25d672974d81a42049b718fd33af&v=4&s=100" width="100" alt="Christian"/><br />Christian</a></td>
   <td align="center"><a href="https://github.com/nihinihi01"><img src="https://avatars.githubusercontent.com/u/57569287?v=4&s=100" width="100" alt="nihinihi01"/><br />nihinihi01</a></td>
   <td align="center"><a href="https://jwyce.gg"><img src="https://avatars.githubusercontent.com/u/16946573?u=a67088146d57205cf6201bee1add2e24cd811229&v=4&s=100" width="100" alt="Jared%20Wyce"/><br />Jared Wyce</a></td>
   <td align="center"><a href="https://blog.lucasviana.dev"><img src="https://avatars.githubusercontent.com/u/13911440?u=7ef3b7a25610a3f8fc0f18a4af76a7c0999f33d3&v=4&s=100" width="100" alt="Lucas%20Viana"/><br />Lucas Viana</a></td>
  </tr>
  <tr>
   <td align="center"><a href="https://farazpatankar.com/"><img src="https://avatars.githubusercontent.com/u/10681116?u=694385b48756c6be01f289f8c419e95b3103fa84&v=4&s=100" width="100" alt="Faraz%20Patankar"/><br />Faraz Patankar</a></td>
   <td align="center"><a href="https://github.com/okaforcj"><img src="https://avatars.githubusercontent.com/u/34102565?v=4&s=100" width="100" alt="okaforcj"/><br />okaforcj</a></td>
   <td align="center"><a href="https://patrickjs.com"><img src="https://avatars.githubusercontent.com/u/1016365?u=47d964a94849ae3bd59cc1a66e5f4aad0c43d2a2&v=4&s=100" width="100" alt="PatrickJS"/><br />PatrickJS</a></td>
   <td align="center"><a href="http://www.ivanbuncic.com"><img src="https://avatars.githubusercontent.com/u/29887111?v=4&s=100" width="100" alt="Ivan%20Buncic"/><br />Ivan Buncic</a></td>
   <td align="center"><a href="https://solberg.is"><img src="https://avatars.githubusercontent.com/u/701?u=0532b62166893d5160ef795c4c8b7512d971af05&v=4&s=100" width="100" alt="J%C3%B6kull%20S%C3%B3lberg%20Au%C3%B0unsson"/><br />Jökull Sólberg Auðunsson</a></td>
   <td align="center"><a href="https://github.com/aslaker"><img src="https://avatars.githubusercontent.com/u/51129804?u=72424dea624e663c5df731ad9852636f5c4471e5&v=4&s=100" width="100" alt="aslaker"/><br />aslaker</a></td>
  </tr>
  <tr>
   <td align="center"><a href="https://github.com/lmatheus"><img src="https://avatars.githubusercontent.com/u/8514703?u=8fa6072cc4524bdfedde3f80f0bb7fc96b2ff1a6&v=4&s=100" width="100" alt="Luis%20Matheus"/><br />Luis Matheus</a></td>
   <td align="center"><a href="https://github.com/dmaykov"><img src="https://avatars.githubusercontent.com/u/6147048?u=8ae662ac99e91917062164de0d9404002b99cf2e&v=4&s=100" width="100" alt="Dmitry%20Maykov"/><br />Dmitry Maykov</a></td>
   <td align="center"><a href="https://www.linkedin.com/in/zomars/"><img src="https://avatars.githubusercontent.com/u/3504472?u=e0fa7d7acefff37b6735387dc45d448717dbf8e2&v=4&s=100" width="100" alt="Omar%20L%C3%B3pez"/><br />Omar López</a></td>
   <td align="center"><a href="https://chrisbradley.dev"><img src="https://avatars.githubusercontent.com/u/11767079?u=e64f67faffd350af19aa896ff89a0708829e9a2a&v=4&s=100" width="100" alt="Chris%20Bradley"/><br />Chris Bradley</a></td>
   <td align="center"><a href="https://tryhackme.com/p/zast99"><img src="https://avatars.githubusercontent.com/u/29718978?u=b9dd3b8f5f77bffb47e98ad0084bd94198d266c0&v=4&s=100" width="100" alt="Mateo%20Carriqu%C3%AD"/><br />Mateo Carriquí</a></td>
   <td align="center"><a href="https://elsakaan.dev"><img src="https://avatars.githubusercontent.com/u/20271968?u=ab95f47bb661569e9b4ab1dadfdb802b77f9d1c6&v=4&s=100" width="100" alt="Ahmed%20Elsakaan"/><br />Ahmed Elsakaan</a></td>
  </tr>
  <tr>
   <td align="center"><a href="https://github.com/Sven1106"><img src="https://avatars.githubusercontent.com/u/28002895?v=4&s=100" width="100" alt="Svend%20Aage%20Roperos%20Nielsen"/><br />Svend Aage Roperos Nielsen</a></td>
   <td align="center"><a href="https://github.com/iway1"><img src="https://avatars.githubusercontent.com/u/12774588?u=e664ed8bd364b3e9103d080d72087e25904c6cab&v=4&s=100" width="100" alt="Isaac%20Way"/><br />Isaac Way</a></td>
   <td align="center"><a href="https://github.com/LoriKarikari"><img src="https://avatars.githubusercontent.com/u/7902980?u=d016e5a9c337fbd4c60a7ea61352185f8b88b585&v=4&s=100" width="100" alt="Lori%20Karikari"/><br />Lori Karikari</a></td>
   <td align="center"><a href="https://github.com/zzacong"><img src="https://avatars.githubusercontent.com/u/61817066?u=2b8d6fe70742b39a8bee1475ceea3105716168cf&v=4&s=100" width="100" alt="Zac%20Ong"/><br />Zac Ong</a></td>
   <td align="center"><a href="https://francisprovost.com"><img src="https://avatars.githubusercontent.com/u/6840361?v=4&s=100" width="100" alt="Francis%20Provost"/><br />Francis Provost</a></td>
   <td align="center"><a href="https://github.com/svobik7"><img src="https://avatars.githubusercontent.com/u/761766?u=1771454e0852904ddf71fe74e493e228331dd27a&v=4&s=100" width="100" alt="Jirka%20Svoboda"/><br />Jirka Svoboda</a></td>
  </tr>
  <tr>
   <td align="center"><a href="https://github.com/mshd"><img src="https://avatars.githubusercontent.com/u/17379661?u=2dc0effef1464639ae9ff98795cd29bb772bcce3&v=4&s=100" width="100" alt="Martin"/><br />Martin</a></td>
   <td align="center"><a href="https://github.com/fanvue"><img src="https://avatars.githubusercontent.com/u/72873652?v=4&s=100" width="100" alt="Fanvue"/><br />Fanvue</a></td>
   <td align="center"><a href="https://midu.dev"><img src="https://avatars.githubusercontent.com/u/1561955?u=9ebfec769d2505d88ee746b7389353c23312bca1&v=4&s=100" width="100" alt="Miguel%20%C3%81ngel%20Dur%C3%A1n"/><br />Miguel Ángel Durán</a></td>
   <td align="center"><a href="https://blog.mstill.dev"><img src="https://avatars.githubusercontent.com/u/2567177?u=9d4667a85a4e56457786b9028b3a551574e07120&v=4&s=100" width="100" alt="Malcolm%20Still"/><br />Malcolm Still</a></td>
   <td align="center"><a href="http://ballingt.com/"><img src="https://avatars.githubusercontent.com/u/458879?u=4b045ac75d721b6ac2b42a74d7d37f61f0414031&v=4&s=100" width="100" alt="Thomas%20Ballinger"/><br />Thomas Ballinger</a></td>
   <td align="center"><a href="https://polydelic.com"><img src="https://avatars.githubusercontent.com/u/6940726?u=8a48c9f7acb576505efbb87a8093552ce3f0d1e5&v=4&s=100" width="100" alt="Oliver%20Dixon"/><br />Oliver Dixon</a></td>
  </tr>
  <tr>
   <td align="center"><a href="https://larskarbo.no"><img src="https://avatars.githubusercontent.com/u/10865165?v=4&s=100" width="100" alt="Lars%20Karbo"/><br />Lars Karbo</a></td>
   <td align="center"><a href="https://github.com/changwo"><img src="https://avatars.githubusercontent.com/u/60525087?u=272c35c9792f781e536fd14c7e48c1052d54ddb5&v=4&s=100" width="100" alt="Habib%20Kadiri"/><br />Habib Kadiri</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- SPONSORS:LIST:END -->

## All contributors ✨

> tRPC is developed by [KATT](https://twitter.com/alexdotjs), originally based on a proof-of-concept by [colinhacks](https://github.com/colinhacks).

<a href="https://github.com/trpc/trpc/graphs/contributors">
  <p align="center">
    <img width="720" src="https://contrib.rocks/image?repo=trpc/trpc" alt="A table of avatars from the project's contributors" />
  </p>
</a>

---

[![Powered by Vercel](./images/powered-by-vercel.svg 'Powered by Vercel')](https://vercel.com/?utm_source=trpc&utm_campaign=oss)
