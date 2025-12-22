import { z } from 'zod';

export const transformSchema = z.object({
  formats: z.string().array().optional(),
  excludes: z.union([z.string(), z.array(z.string())]).optional(),
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
        js: z.union([z.boolean(), z.function()]),
        css: z.union([z.boolean(), z.function()]),
      }),
    ])
    .optional(),
  polyfill: z.union([z.literal(false), z.enum(['entry', 'usage'])]).optional(),
  compileDependencies: z.union([z.boolean(), z.union([z.string(), z.instanceof(RegExp)]).array()]).optional(),
  browser: z.boolean().optional(),
  codeSplitting: z.boolean().optional(),
});

export const userConfigSchema = z.object({
  entry: z.union([z.string(), z.string().array(), z.record(z.string(), z.string())]).optional(),
  alias: z.record(z.string(), z.string()).optional(),
  define: z
    .record(z.string(), z.union([z.string(), z.boolean(), z.number(), z.null(), z.record(z.string(), z.any())]))
    .optional(),
  sourceMaps: z.union([z.boolean(), z.enum(['inline'])]).optional(),
  generateTypeForJs: z.boolean().optional(),
  jsxRuntime: z.enum(['classic', 'automatic']).optional(),
  plugins: z.any().array().optional(),

  transform: transformSchema.optional(),
  bundle: bundleSchema.optional(),
  declaration: z.union([
    z.boolean(),
    z.object({
      outputMode: z.enum(['multi', 'unique']).optional(),
      generator: z.enum(['tsc', 'oxc']).optional(),
    }),
  ]),
});

export type UserConfigSchemaType = z.infer<typeof userConfigSchema>;
