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

// Shared field schemas reused across userConfigSchema and pkgUserConfigSchema
const entrySchema = z.union([z.string(), z.string().array(), z.record(z.string(), z.string())]).optional();
const aliasSchema = z.record(z.string(), z.string()).optional();
const defineSchema = z
  .record(z.string(), z.union([z.string(), z.boolean(), z.number(), z.null(), z.record(z.string(), z.any())]))
  .optional();
const sourceMapsSchema = z.union([z.boolean(), z.enum(['inline'])]).optional();
const jsxRuntimeSchema = z.enum(['classic', 'automatic']).optional();
const helpersSchema = z.enum(['external', 'inline']).optional();
const declarationSchema = z
  .union([
    z.boolean(),
    z.object({
      outputMode: z.enum(['multi', 'unique']).optional(),
      generator: z.enum(['tsc', 'oxc']).optional(),
      allowJs: z.boolean().optional(),
    }),
  ])
  .optional();

export const pkgUserConfigSchema = z.object({
  id: z.string().optional(),
  module: z.enum(['esm', 'cjs', 'umd', 'mf']).optional(),
  target: z.enum(['es5', 'es2017', 'es2022']).optional(),
  bundle: z.boolean().optional(),
  disable: z.boolean().optional(),
  outputDir: z.string().optional(),
  entryRoot: z.string().optional(),
  extends: z.array(z.string()).optional(),
  plugins: z.any().array().optional(),
  // fields shared with bundleSchema
  externals: bundleSchema.shape.externals,
  name: z.string().optional(),
  compileDependencies: bundleSchema.shape.compileDependencies,
  polyfill: bundleSchema.shape.polyfill,
  minify: bundleSchema.shape.minify,
  codeSplitting: z.boolean().optional(),
  engine: z.enum(['rollup', 'rslib', 'rolldown']).optional(),
  // fields shared with userConfigSchema
  entry: entrySchema,
  alias: aliasSchema,
  define: defineSchema,
  jsxRuntime: jsxRuntimeSchema,
  declaration: declarationSchema,
  sourceMaps: sourceMapsSchema,
  helpers: helpersSchema,
});

export const userConfigSchema = z.object({
  entry: entrySchema,
  alias: aliasSchema,
  define: defineSchema,
  sourceMaps: sourceMapsSchema,
  jsxRuntime: jsxRuntimeSchema,
  plugins: z.any().array().optional(),
  helpers: helpersSchema,

  // boolean | undefined is allowed to support `condition && { ... }` shorthand
  pkgs: z.array(z.union([z.string(), z.boolean(), z.undefined(), pkgUserConfigSchema])).optional(),
  transform: transformSchema.optional(),
  bundle: bundleSchema.optional(),
  declaration: declarationSchema,
  server: z.union([z.boolean(), serverSchema]).optional(),
});

export type UserConfigSchemaType = z.infer<typeof userConfigSchema>;
