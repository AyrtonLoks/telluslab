import type { LessonMeta, RegisteredSource, Slug, SourceRegistryId, TellusContentBundleV1 } from './types.mjs';

export type * from './types.mjs';

export interface SchemaProblem {
  path: Array<string | number>;
  message: string;
}

export interface ContentError {
  /** Caminho relativo à raiz de content/. */
  file: string;
  line?: number;
  path?: Array<string | number>;
  message: string;
}

export type SchemaFile = 'common.schema.json' | 'pack.schema.json' | 'lesson.schema.json' |
  'exercise.schema.json' | 'card.schema.json' | 'source.schema.json';

export interface LessonBlock {
  name: string;
  attrs: Record<string, string>;
  line: number;
  content: string;
}

export const SCHEMA_VERSION: '1.0.0';
export const SLUG_CODES: Readonly<Record<Slug, string>>;
export const SCHEMAS: Readonly<Record<SchemaFile, object>>;
export const LESSON_BLOCKS: Readonly<Record<string, {required: string[]; optional: string[]}>>;

export class FrontMatterError extends Error {
  line: number;
}

export function validateAgainst(schemaFile: SchemaFile, value: unknown): SchemaProblem[];
export function formatPath(path: Array<string | number>): string;
export function formatError(error: ContentError): string;
export function expressionProblems(expression: string, names: Set<string>): string[];
export function parseFrontMatter(lines: string[], firstLine?: number): Record<string, unknown>;
export function splitFrontMatter(text: string): {data: Record<string, unknown>; body: string; bodyLine: number};
export function parseLessonBody(body: string, firstLine?: number): {blocks: LessonBlock[];
  problems: Array<{line: number; message: string}>};
export function parseLesson(text: string): {meta: LessonMeta | null; body: string; blocks: LessonBlock[];
  problems: Array<{line: number; message: string}>};
export function loadSourceRegistry(root: string): {entries: Map<SourceRegistryId, RegisteredSource>; errors: ContentError[]};
export function validateContentPack(dir: string, options?: {root?: string;
  registry?: Map<SourceRegistryId, RegisteredSource>}): {errors: ContentError[]; bundle: TellusContentBundleV1 | null};
export function loadContentPacks(root: string): {errors: ContentError[]; bundles: TellusContentBundleV1[]};
export function contentFiles(root: string): Array<{path: string; contents: string}>;
