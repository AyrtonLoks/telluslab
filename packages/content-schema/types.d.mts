// Tipos do Content Pack v1 (ADR-003). Espelham os schemas JSON deste pacote.

export type DomainCode = 'MATH' | 'PROG' | 'ECON' | 'PHYS' | 'ENG' | 'HUM' | 'LANG' | 'LIT';
export type DomainId = `DOM-${DomainCode}`;
export type Slug = 'mathematics' | 'programming' | 'economics-finance' | 'physics' | 'engineering' |
  'humanities' | 'languages' | 'literature';
export type NodeId = `DOM-${DomainCode}:${number}.${number}`;
export type LessonId = `LIC-${DomainCode}-${string}`;
export type ExerciseId = `EXE-${DomainCode}-${string}`;
export type CardId = `CAR-${DomainCode}-${string}`;
export type SourceRegistryId = `FON-${string}`;
export type BookId = `BIB-${DomainCode}-${string}`;
export type SubtopicId = `${number}.${number}:sub:${number}`;
export type CriterionId = `${number}.${number}:dod:${string}`;
export type DifficultyId = `DIF-${DomainCode}-${string}`;
export type Review = 'pending' | 'ok';
export type ItemStatus = 'active' | 'retired';

export interface Provenance {
  authors: string[];
  aiAssisted: boolean;
}

export interface SourceRef {
  ref: BookId | SourceRegistryId;
  locator: string;
  excerpt?: boolean;
}

interface Item {
  revision: number;
  status?: ItemStatus;
  sources: SourceRef[];
  license?: string;
  review: Review;
  provenance: Provenance;
}

export interface TellusContentPackV1 {
  kind: 'TellusContentPackV1';
  schemaVersion: '1.0.0';
  domainId: DomainId;
  slug: Slug;
  version: string;
  defaultLicense: string;
  nodes: NodeId[];
}

export interface LessonMeta extends Item {
  id: LessonId;
  node: NodeId;
  title: string;
  minutes: number;
  objectives: string[];
  covers: SubtopicId[];
}

export interface Lesson extends LessonMeta {
  /** Corpo Markdown da lição, com os blocos :::explicacao, :::exemplo, :::figura e :::verificacao. */
  body: string;
}

export type Generator =
  | {int: [number, number]; step?: number}
  | {choice: Array<string | number>}
  | {pick: Array<Record<string, string | number>>};

export type Normalization = 'trim' | 'case' | 'accents' | 'spaces' | 'width';
export interface TextAnswer {
  accept: string[];
  normalize?: Normalization[];
}

export interface Choice { id: string; text: string }

export interface CommonError {
  match: string | number | unknown[] | Record<string, unknown>;
  feedback: string;
  difficulty: DifficultyId;
}

interface ExerciseBase<T extends string, A> extends Item {
  id: ExerciseId;
  type: T;
  role: 'check' | 'practice' | 'criterion';
  targets: {subtopics: SubtopicId[]; criterion?: CriterionId};
  attemptsValidFrom?: number;
  level: 1 | 2 | 3 | 4 | 5;
  prompt: string;
  params?: Record<string, Generator>;
  derived?: Record<string, string>;
  answer: A;
  hints: string[];
  solution: string[];
  commonErrors?: CommonError[];
}

export type Exercise =
  | ExerciseBase<'multiple-choice', {options: Choice[]; correct: string[]; shuffle?: boolean}>
  | ExerciseBase<'numeric', {value: number | string; tolerance: {absolute?: number; relative?: number};
      unit?: string; acceptUnits?: string[]}>
  | ExerciseBase<'short-text', TextAnswer>
  | ExerciseBase<'ordering', {items: Choice[]; order: string[]}>
  | ExerciseBase<'cloze', {blanks: Record<string, TextAnswer>}>
  | ExerciseBase<'expression', {expected: string; variables: string[]; domain?: {exclude?: number[]};
      form?: 'factored' | 'expanded' | 'simplified'}>
  | ExerciseBase<'code', {language: 'python' | 'javascript' | 'sql'; starter?: string; entrypoint: string;
      tests: Array<{args: unknown[]; expected: unknown; visible: boolean}>; reference: string;
      limits?: {timeMs?: number; memoryMb?: number}}>
  | ExerciseBase<'rubric', {criteria: Array<{id: string; description: string; evidence: string}>;
      minWords?: number; maxWords?: number; exemplar?: string}>;

export type ExerciseType = Exercise['type'];

export interface TellusExerciseSetV1 {
  kind: 'TellusExerciseSetV1';
  schemaVersion: '1.0.0';
  node: NodeId;
  exercises: Exercise[];
}

export interface Card extends Item {
  id: CardId;
  lesson?: LessonId;
  front: string;
  back: string;
  directions: Array<'recognition' | 'production'>;
  schedule: 'mastery' | 'lesson';
}

export interface TellusCardSetV1 {
  kind: 'TellusCardSetV1';
  schemaVersion: '1.0.0';
  node: NodeId;
  cards: Card[];
}

export interface RegisteredSource {
  id: SourceRegistryId;
  title: string;
  url: string;
  license: string;
  licenseNote?: string;
  attribution: string;
  verifiedAt: string;
}

export interface TellusSourceRegistryV1 {
  kind: 'TellusSourceRegistryV1';
  schemaVersion: '1.0.0';
  sources: RegisteredSource[];
}

/** Pacote de um domínio gravado pelo build em dist/content/<slug>.json. */
export interface TellusContentBundleV1 {
  kind: 'TellusContentBundleV1';
  schemaVersion: '1.0.0';
  domainId: DomainId;
  slug: Slug;
  version: string;
  defaultLicense: string;
  sources: RegisteredSource[];
  nodes: Record<NodeId, {lessons: Lesson[]; exercises: Exercise[]; cards: Card[]}>;
}

/** Índice gravado pelo build em dist/content/index.json. */
export interface TellusContentIndexV1 {
  kind: 'TellusContentIndexV1';
  schemaVersion: '1.0.0';
  packs: Array<{slug: Slug; domainId: DomainId; version: string; file: string; nodes: NodeId[]}>;
}
