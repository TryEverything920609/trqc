import { getRollupConfig } from '../../scripts/rollup';

const config = getRollupConfig({
  input: [
    'src/index.ts',
    'src/links/httpBatchLink.ts',
    'src/links/httpLink.ts',
    'src/links/loggerLink.ts',
    'src/links/splitLink.ts',
    'src/links/transformerLink.ts',
    'src/links/wsLink.ts',
    'src/rx/index.ts',
    'src/rx/operators/index.ts',
  ],
});

export default config;
