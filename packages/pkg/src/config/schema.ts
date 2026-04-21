import { z } from 'zod';

export const transformSchema = z.object({
  formats: z.string().array().optional(),
  excludes: z.union([z.string(), z.array(z.string())]).optional(),
  entryRoot: z.string().optional(),
});

export const bundleSchema = z.object({
  name: z.string().optional(),
  outputDir: z.string().optional(),
  modes: z.enum(['production', 'development']).array().optional(),
  formats: z.string().array().optional(),
  externals: z
    .union([
      z.boolean(),
      z.record(z.string(), z.string()),
      z.array(z.union([z.string(), z.instanceof(RegExp), z.record(z.string(), z.string())])),
    ])
    .optional(),
  minify: z
    .union([
      z.boolean(),
      z.object({
        js: z.union([z.boolean(), z.function()]).optional(),
        css: z.union([z.boolean(), z.function()]).optional(),
      }),
    ])
    .optional(),
  polyfill: z.union([z.literal(false), z.enum(['entry', 'usage'])]).optional(),
  compileDependencies: z.union([z.boolean(), z.union([z.string(), z.instanceof(RegExp)]).array()]).optional(),
  browser: z.boolean().optional(),
  codeSplitting: z.boolean().optional(),
});

export const serverPublicDirOptionSchema = z.object({
  name: z.string().optional(),
});

export const serverPublicDirOptionWithStringSchema = z.union([z.string(), serverPublicDirOptionSchema]);

export const serverSchema = z.object({
  publicDir: z
    .union([serverPublicDirOptionWithStringSchema, z.array(serverPublicDirOptionWithStringSchema)])
    .optional(),
  port: z.number().optional(),
  https: z.any().optional(),
  host: z.string().optional(),
  headers: z.record(z.string(), z.union([z.string(), z.string().array()])).optional(),
  cors: z.union([z.boolean(), z.any()]).optional(),
  proxy: z.union([z.record(z.string(), z.union([z.string(), z.any()])), z.any().array()]).optional(),
  autoServeBundle: z.boolean().optional(),
});

export const userConfigSchema = z.object({
  entry: z.union([z.string(), z.string().array(), z.record(z.string(), z.string())]).optional(),
  alias: z.record(z.string(), z.string()).optional(),
  define: z
    .record(z.string(), z.union([z.string(), z.boolean(), z.number(), z.null(), z.record(z.string(), z.any())]))
    .optional(),
  sourceMaps: z.union([z.boolean(), z.enum(['inline'])]).optional(),
  jsxRuntime: z.enum(['classic', 'automatic']).optional(),
  plugins: z.any().array().optional(),
  helpers: z.enum(['external', 'inline']).optional(),

  transform: transformSchema.optional(),
  bundle: bundleSchema.optional(),
  declaration: z.union([
    z.boolean(),
    z.object({
      outputMode: z.enum(['multi', 'unique']).optional(),
      generator: z.enum(['tsc', 'oxc']).optional(),
      allowJs: z.boolean().optional(),
    }),
  ]),
  server: z.union([z.boolean(), serverSchema]).optional(),
});

export type UserConfigSchemaType = z.infer<typeof userConfigSchema>;
