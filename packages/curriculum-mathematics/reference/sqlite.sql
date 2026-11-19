PRAGMA foreign_keys = ON;
PRAGMA user_version = 1;

CREATE TABLE catalog_revision (
  id TEXT PRIMARY KEY, document_id TEXT NOT NULL, revision_id TEXT NOT NULL,
  source_url TEXT NOT NULL, source_sha256 TEXT NOT NULL
) STRICT;
CREATE TABLE track (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, source_line INTEGER NOT NULL
) STRICT;
CREATE TABLE requirement (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, source_line INTEGER NOT NULL
) STRICT;
CREATE TABLE level (
  id INTEGER PRIMARY KEY CHECK (id BETWEEN 1 AND 9), title TEXT NOT NULL, source_line INTEGER NOT NULL
) STRICT;
CREATE TABLE book_category (id TEXT PRIMARY KEY, title TEXT NOT NULL) STRICT;
CREATE TABLE book (
  id TEXT PRIMARY KEY, title TEXT NOT NULL, authors_text TEXT NOT NULL,
  authors_json TEXT NOT NULL CHECK (json_valid(authors_json) AND json_type(authors_json) = 'array'),
  category_id TEXT NOT NULL REFERENCES book_category(id), source_line INTEGER NOT NULL
) STRICT;
CREATE TABLE topic (
  id TEXT PRIMARY KEY, level_id INTEGER NOT NULL REFERENCES level(id),
  track_id TEXT NOT NULL REFERENCES track(id), title TEXT NOT NULL,
  complexity INTEGER NOT NULL CHECK (complexity BETWEEN 1 AND 5), source_line INTEGER NOT NULL
) STRICT;
CREATE TABLE topic_modality (
  topic_id TEXT NOT NULL REFERENCES topic(id),
  modality TEXT NOT NULL CHECK (modality IN ('Cálculo/Algébrico','Demonstração Formal','Implementação Computacional')),
  PRIMARY KEY (topic_id, modality)
) STRICT;
CREATE TABLE topic_dependency (
  topic_id TEXT NOT NULL REFERENCES topic(id), prerequisite_id TEXT NOT NULL REFERENCES topic(id),
  PRIMARY KEY (topic_id, prerequisite_id), CHECK (topic_id <> prerequisite_id)
) STRICT;
CREATE INDEX topic_dependency_reverse ON topic_dependency(prerequisite_id, topic_id);
CREATE TABLE topic_bibliography (
  id TEXT PRIMARY KEY, topic_id TEXT NOT NULL REFERENCES topic(id), book_id TEXT NOT NULL REFERENCES book(id),
  role TEXT NOT NULL CHECK (role IN ('Intuição/Cálculo','Rigor/Prova','Algorítmica','Aplicação/Referência')),
  chapters TEXT NOT NULL, source_line INTEGER NOT NULL
) STRICT;
CREATE INDEX topic_bibliography_book ON topic_bibliography(book_id, topic_id);
CREATE TABLE subtopic (
  id TEXT PRIMARY KEY, topic_id TEXT NOT NULL REFERENCES topic(id), ordinal INTEGER NOT NULL CHECK (ordinal > 0),
  description TEXT NOT NULL, source_line INTEGER NOT NULL, UNIQUE(topic_id, ordinal)
) STRICT;
CREATE TABLE acceptance_criterion (
  id TEXT PRIMARY KEY, topic_id TEXT NOT NULL REFERENCES topic(id),
  kind TEXT NOT NULL CHECK (kind IN ('mandatory','capstone')),
  description TEXT NOT NULL, source_line INTEGER NOT NULL, UNIQUE(topic_id,kind)
) STRICT;
CREATE TABLE catalog_sanitization (
  topic_id TEXT PRIMARY KEY REFERENCES topic(id), source_line INTEGER NOT NULL,
  original TEXT NOT NULL, corrected TEXT NOT NULL
) STRICT;

CREATE TABLE topic_progress (
  topic_id TEXT PRIMARY KEY REFERENCES topic(id),
  state TEXT NOT NULL CHECK (state IN ('S0','S1','S2','S3','S4','S5','S6')),
  mastered_at TEXT,
  CHECK ((state IN ('S4','S5','S6')) = (mastered_at IS NOT NULL))
) STRICT;
CREATE TABLE theory_evidence (
  topic_id TEXT PRIMARY KEY REFERENCES topic_progress(topic_id), notes TEXT NOT NULL, completed_at TEXT NOT NULL
) STRICT;
CREATE TABLE practice_evidence (
  topic_id TEXT PRIMARY KEY REFERENCES topic_progress(topic_id), correct INTEGER NOT NULL,
  total INTEGER NOT NULL CHECK (total > 0), evidence TEXT NOT NULL, completed_at TEXT NOT NULL,
  CHECK (correct BETWEEN 0 AND total AND 1.0 * correct / total >= 0.8)
) STRICT;
CREATE TABLE subtopic_completion (
  subtopic_id TEXT PRIMARY KEY REFERENCES subtopic(id), evidence TEXT NOT NULL, completed_at TEXT NOT NULL
) STRICT;
CREATE TABLE criterion_validation (
  criterion_id TEXT PRIMARY KEY REFERENCES acceptance_criterion(id), evidence TEXT NOT NULL, validated_at TEXT NOT NULL,
  approved INTEGER NOT NULL CHECK (approved = 1),
  without_consultation INTEGER CHECK (without_consultation = 1)
) STRICT;
CREATE TABLE proficiency_event (
  sequence INTEGER PRIMARY KEY, topic_id TEXT NOT NULL REFERENCES topic(id), occurred_at TEXT NOT NULL,
  from_state TEXT NOT NULL, to_state TEXT NOT NULL, kind TEXT NOT NULL, entity_id TEXT
) STRICT;
CREATE INDEX proficiency_event_time ON proficiency_event(occurred_at);
CREATE TABLE srs_card (
  id TEXT PRIMARY KEY, topic_id TEXT NOT NULL REFERENCES topic(id),
  subtopic_id TEXT REFERENCES subtopic(id), criterion_id TEXT REFERENCES acceptance_criterion(id),
  kind TEXT NOT NULL CHECK (kind IN ('statement','counterexample','proofIdea')),
  front_latex TEXT NOT NULL, back_latex TEXT NOT NULL, scheduler TEXT NOT NULL CHECK (scheduler = 'FSRS-5'),
  stability REAL CHECK (stability > 0), difficulty REAL CHECK (difficulty BETWEEN 1 AND 10),
  created_at TEXT NOT NULL, last_review TEXT, due_at TEXT NOT NULL,
  repetitions INTEGER NOT NULL CHECK (repetitions >= 0),
  lapses INTEGER NOT NULL CHECK (lapses BETWEEN 0 AND repetitions),
  CHECK ((subtopic_id IS NULL) <> (criterion_id IS NULL)),
  CHECK ((repetitions = 0 AND last_review IS NULL AND stability IS NULL AND difficulty IS NULL) OR
         (repetitions > 0 AND last_review IS NOT NULL AND stability IS NOT NULL AND difficulty IS NOT NULL)),
  UNIQUE(subtopic_id,kind), UNIQUE(criterion_id,kind)
) STRICT;
CREATE INDEX srs_card_due ON srs_card(due_at, topic_id);
CREATE TABLE srs_review (
  sequence INTEGER PRIMARY KEY, card_id TEXT NOT NULL REFERENCES srs_card(id), reviewed_at TEXT NOT NULL,
  grade INTEGER NOT NULL CHECK (grade BETWEEN 1 AND 4),
  last_due_at TEXT NOT NULL, due_at TEXT NOT NULL, stability REAL NOT NULL CHECK (stability > 0),
  difficulty REAL NOT NULL CHECK (difficulty BETWEEN 1 AND 10), UNIQUE(card_id, reviewed_at)
) STRICT;
CREATE INDEX srs_review_time ON srs_review(reviewed_at);

CREATE TABLE study_session (
  id TEXT PRIMARY KEY, created_at TEXT NOT NULL, scheduled_at TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds BETWEEN 2700 AND 4500 AND duration_seconds % 60 = 0),
  blocks_json TEXT NOT NULL CHECK (json_valid(blocks_json) AND json_type(blocks_json) = 'array'),
  gaps_json TEXT NOT NULL CHECK (json_valid(gaps_json) AND json_type(gaps_json) = 'array')
) STRICT;
CREATE INDEX study_session_schedule ON study_session(scheduled_at);
CREATE TABLE challenge (
  id TEXT PRIMARY KEY, session_id TEXT REFERENCES study_session(id),
  block TEXT NOT NULL CHECK (block IN ('standalone','advance','mixed')),
  created_at TEXT NOT NULL, scheduled_at TEXT NOT NULL, duration_seconds INTEGER NOT NULL CHECK (duration_seconds > 0),
  modality TEXT NOT NULL CHECK (modality IN ('Cálculo/Algébrico','Demonstração Formal','Implementação Computacional')),
  title TEXT NOT NULL, statement TEXT NOT NULL,
  requirements_json TEXT NOT NULL CHECK (json_valid(requirements_json) AND json_type(requirements_json) = 'array'),
  hypotheses_json TEXT NOT NULL CHECK (json_valid(hypotheses_json) AND json_type(hypotheses_json) = 'array'),
  examples_json TEXT NOT NULL CHECK (json_valid(examples_json) AND json_type(examples_json) = 'array'),
  tests_json TEXT NOT NULL CHECK (json_valid(tests_json) AND json_type(tests_json) = 'array'),
  UNIQUE(session_id,block), CHECK ((block = 'standalone') = (session_id IS NULL))
) STRICT;
CREATE INDEX challenge_schedule ON challenge(scheduled_at);
CREATE TABLE challenge_topic (
  challenge_id TEXT NOT NULL REFERENCES challenge(id), topic_id TEXT NOT NULL REFERENCES topic(id),
  ordinal INTEGER NOT NULL CHECK (ordinal > 0), PRIMARY KEY(challenge_id, topic_id), UNIQUE(challenge_id,ordinal)
) STRICT;
CREATE TABLE challenge_licensed_topic (
  challenge_id TEXT NOT NULL REFERENCES challenge(id), topic_id TEXT NOT NULL REFERENCES topic(id),
  ordinal INTEGER NOT NULL CHECK (ordinal > 0), assumed INTEGER NOT NULL CHECK (assumed IN (0,1)),
  PRIMARY KEY(challenge_id, topic_id), UNIQUE(challenge_id,ordinal)
) STRICT;
CREATE TABLE challenge_timer (
  challenge_id TEXT PRIMARY KEY REFERENCES challenge(id), started_at TEXT NOT NULL,
  running_since TEXT, updated_at TEXT NOT NULL, elapsed_ms INTEGER NOT NULL CHECK (elapsed_ms >= 0)
) STRICT;
CREATE TABLE attempt (
  id TEXT PRIMARY KEY, challenge_id TEXT NOT NULL REFERENCES challenge(id),
  started_at TEXT NOT NULL, submitted_at TEXT NOT NULL, elapsed_ms INTEGER NOT NULL CHECK (elapsed_ms > 0),
  draft TEXT NOT NULL CHECK (length(trim(draft)) > 0), draft_format TEXT NOT NULL CHECK (draft_format IN ('latex','code')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Lacuna em Pré-requisito','Heurística Inicial','Erro Algébrico',
    'Falha de Rigor/Quantificadores','Instabilidade/Bug')),
  UNIQUE(id, challenge_id)
) STRICT;
CREATE INDEX attempt_history ON attempt(submitted_at, challenge_id);
CREATE TABLE challenge_solution (
  challenge_id TEXT PRIMARY KEY REFERENCES challenge(id), created_from_attempt_id TEXT NOT NULL,
  commented_solution TEXT NOT NULL CHECK (length(trim(commented_solution)) > 0),
  FOREIGN KEY(created_from_attempt_id,challenge_id) REFERENCES attempt(id,challenge_id)
) STRICT;
CREATE TABLE attempt_feedback (
  attempt_id TEXT PRIMARY KEY REFERENCES attempt(id), created_at TEXT NOT NULL,
  assessment TEXT NOT NULL CHECK (assessment IN ('needsRevision','coherent','insufficientEvidence')),
  checks_json TEXT NOT NULL CHECK (json_valid(checks_json) AND json_type(checks_json) = 'array'),
  questions_json TEXT NOT NULL CHECK (json_valid(questions_json) AND json_type(questions_json) = 'array')
) STRICT;
CREATE TABLE agenda_micro_review (
  id TEXT PRIMARY KEY, topic_id TEXT NOT NULL REFERENCES topic(id), trigger_topic_id TEXT NOT NULL REFERENCES topic(id),
  due_at TEXT NOT NULL, completed_at TEXT, UNIQUE(topic_id, trigger_topic_id)
) STRICT;
CREATE INDEX agenda_micro_review_due ON agenda_micro_review(due_at, completed_at);
CREATE TABLE agenda_micro_review_source (
  agenda_id TEXT NOT NULL REFERENCES agenda_micro_review(id), attempt_id TEXT NOT NULL REFERENCES attempt(id),
  PRIMARY KEY(agenda_id,attempt_id)
) STRICT;
