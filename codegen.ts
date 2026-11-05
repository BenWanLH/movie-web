import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'http://localhost:4000/graphql',           // introspects the running movie-service
  documents: ['src/lib/graphql/**/*.ts', '!src/lib/graphql/generated/**'],
  generates: {
    'src/lib/graphql/generated/': {
      preset: 'client',
      presetConfig: { fragmentMasking: false },
      config: { useTypeImports: true, enumsAsTypes: true },
    },
  },
};
export default config;