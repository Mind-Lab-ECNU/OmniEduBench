import { useMemo, useState } from 'react';
import './App.css';

const inlineStyles = `
  .tight-figure,
  .is-tight-figure {
    margin-bottom: 0;
    margin-top: 0;
    margin-left: auto;
    margin-right: auto;
    display: block;
  }

  .tight-text {
    margin-top: 0.5rem;
  }

  .is-80-percent {
    width: 110%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .is-small-padding {
    padding-top: 0;
    padding-bottom: 0;
    margin-top: 0;
    margin-bottom: 0;
  }

  #EvaluationResults table {
    width: 100%;
    border-collapse: collapse;
    font-family: sans-serif;
    border: 1px solid #ddd;
    margin-bottom: 20px;
  }

  #EvaluationResults caption {
    font-weight: bold;
    margin-bottom: 15px;
    text-align: left;
    font-size: 1.1em;
  }

  #EvaluationResults th,
  #EvaluationResults td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    vertical-align: middle;
  }

  #EvaluationResults th {
    background-color: #f2f2f2;
  }

  #EvaluationResults td:first-child,
  #EvaluationResults th:first-child {
    text-align: left;
  }

  #EvaluationResults .highest {
    background-color: #F08080;
    color: black;
  }

  #EvaluationResults .second-highest {
    text-decoration: underline;
  }

  #EvaluationResults .section-header {
    background-color: #f9f9f9;
    color: gray;
    font-family: monospace;
    text-align: center;
    font-weight: bold;
  }

  #EvaluationResults code {
    font-family: monospace;
    background-color: #eee;
    padding: 2px 4px;
    border-radius: 3px;
  }

  #EvaluationResults .title {
    margin-bottom: 1.5rem;
  }

  .analysis-card p + p {
    margin-top: 1.5rem;
  }

  .stat-card {
    border: 1px solid #d0d7de;
    border-radius: 16px;
    padding: 1.75rem;
    background-color: #ffffff;
    box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .stat-card .stat-label {
    font-size: 0.85rem;
    color: #64748b;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .stat-card .stat-value {
    font-size: 2.4rem;
    font-weight: 600;
    color: #0f172a;
    margin-top: 0.75rem;
  }

  .stat-card .stat-helper {
    margin-top: 0.75rem;
    font-size: 0.85rem;
    color: #475569;
  }

  @media screen and (max-width: 1024px) {
    .is-80-percent {
      width: 100%;
    }
  }
`;

const keyHighlights = [
  '24.6K curated Chinese question-answer pairs spanning knowledge and cultivation competencies.',
  'Dual-axis design with 41 academic subjects and 20 pedagogical competencies across 11 question types.',
  'Four-stage curation pipeline that filters 927K raw items via public, private, and LLM-assisted sources.',
  'Comprehensive evaluation of 11 leading LLMs reveals persistent gaps between knowledge mastery and cultivation support.',
];

const knowledgeColumns = [
  { key: 'fd', label: 'FD' },
  { key: 'hh', label: 'HH' },
  { key: 'ssem', label: 'SSEM' },
  { key: 'lp', label: 'LP' },
  { key: 'mh', label: 'MH' },
  { key: 'iis', label: 'IIS' },
  { key: 'avg', label: 'Average' },
];

const knowledgeRows = [
  {
    model: 'Qwen3',
    params: '8B',
    access: 'Weights',
    creator: 'Alibaba',
    fd: 53.02,
    hh: 38.53,
    ssem: 36.58,
    lp: 30.17,
    mh: 36.71,
    iis: 37.75,
    avg: 43.86,
  },
  {
    model: 'Qwen3',
    params: '14B',
    access: 'Weights',
    creator: 'Alibaba',
    fd: 36.32,
    hh: 36.78,
    ssem: 35.12,
    lp: 27.29,
    mh: 36.82,
    iis: 35.67,
    avg: 35.62,
  },
  {
    model: 'MuduoLLM',
    params: '14B',
    access: 'Weights',
    creator: 'BNU & TAL',
    fd: 28.2,
    hh: 40.82,
    ssem: 32.99,
    lp: 36.15,
    mh: 39.11,
    iis: 31.4,
    avg: 33.68,
  },
  {
    model: 'QwQ',
    params: '32B',
    access: 'Weights',
    creator: 'Alibaba',
    fd: 61.25,
    hh: 48.51,
    ssem: 42.24,
    lp: 49.9,
    mh: 55.01,
    iis: 47.26,
    avg: 53.87,
  },
  {
    model: 'Seed-OSS',
    params: '36B',
    access: 'Weights',
    creator: 'ByteDance',
    fd: 48.81,
    hh: 50.14,
    ssem: 45.34,
    lp: 48.66,
    mh: 61.0,
    iis: 49.56,
    avg: 49.53,
  },
  {
    model: 'Qwen2.5',
    params: '72B',
    access: 'Weights',
    creator: 'Alibaba',
    fd: 19.53,
    hh: 30.95,
    ssem: 20.57,
    lp: 13.26,
    mh: 23.86,
    iis: 20.9,
    avg: 22.76,
  },
  {
    model: 'Qwen3',
    params: '235B (22B active)',
    access: 'Weights',
    creator: 'Alibaba',
    fd: 34.24,
    hh: 47.01,
    ssem: 36.21,
    lp: 44.26,
    mh: 58.71,
    iis: 46.61,
    avg: 40.82,
  },
  {
    model: 'DeepSeek-V3.1',
    params: '671B (37B active)',
    access: 'Weights',
    creator: 'DeepSeek',
    fd: 31.65,
    hh: 40.65,
    ssem: 35.0,
    lp: 29.42,
    mh: 50.54,
    iis: 45.19,
    avg: 36.05,
  },
  {
    model: 'GPT-4o',
    params: 'Undisclosed',
    access: 'API',
    creator: 'OpenAI',
    fd: 21.15,
    hh: 26.94,
    ssem: 23.92,
    lp: 22.13,
    mh: 34.75,
    iis: 27.13,
    avg: 24.17,
  },
  {
    model: 'Claude-4 Sonnet',
    params: 'Undisclosed',
    access: 'API',
    creator: 'Anthropic',
    fd: 41.49,
    hh: 44.29,
    ssem: 35.36,
    lp: 27.56,
    mh: 34.86,
    iis: 42.34,
    avg: 40.35,
  },
  {
    model: 'Gemini-2.5 Pro',
    params: 'Undisclosed',
    access: 'API',
    creator: 'Google',
    fd: 73.83,
    hh: 55.13,
    ssem: 46.68,
    lp: 55.4,
    mh: 60.68,
    iis: 54.16,
    avg: 62.76,
  },
];

const cultivationColumns = [
  { key: 'tcs', label: 'TCS' },
  { key: 'emh', label: 'EMH' },
  { key: 'sis', label: 'SIS' },
  { key: 'cv', label: 'CV' },
  { key: 'pd', label: 'PD' },
  { key: 'tfs', label: 'TFS' },
  { key: 'avg', label: 'Average' },
];

const cultivationRows = [
  {
    model: 'Qwen3',
    params: '8B',
    access: 'Weights',
    creator: 'Alibaba',
    tcs: 70.95,
    emh: 66.67,
    sis: 69.16,
    cv: 62.25,
    pd: 70.13,
    tfs: 77.2,
    avg: 68.62,
  },
  {
    model: 'Qwen3',
    params: '14B',
    access: 'Weights',
    creator: 'Alibaba',
    tcs: 67.79,
    emh: 60.77,
    sis: 63.72,
    cv: 56.2,
    pd: 64.31,
    tfs: 71.5,
    avg: 63.6,
  },
  {
    model: 'MuduoLLM',
    params: '14B',
    access: 'Weights',
    creator: 'BNU & TAL',
    tcs: 64.42,
    emh: 60.77,
    sis: 63.45,
    cv: 66.14,
    pd: 67.51,
    tfs: 64.77,
    avg: 63.96,
  },
  {
    model: 'QwQ',
    params: '32B',
    access: 'Weights',
    creator: 'Alibaba',
    tcs: 73.16,
    emh: 68.36,
    sis: 69.84,
    cv: 65.13,
    pd: 71.77,
    tfs: 72.02,
    avg: 70.27,
  },
  {
    model: 'Seed-OSS',
    params: '36B',
    access: 'Weights',
    creator: 'ByteDance',
    tcs: 70.74,
    emh: 65.3,
    sis: 66.03,
    cv: 62.82,
    pd: 67.12,
    tfs: 70.47,
    avg: 67.18,
  },
  {
    model: 'Qwen2.5',
    params: '72B',
    access: 'Weights',
    creator: 'Alibaba',
    tcs: 67.89,
    emh: 64.38,
    sis: 65.62,
    cv: 59.51,
    pd: 65.57,
    tfs: 67.88,
    avg: 65.34,
  },
  {
    model: 'Qwen3',
    params: '235B (22B active)',
    access: 'Weights',
    creator: 'Alibaba',
    tcs: 67.84,
    emh: 61.1,
    sis: 64.54,
    cv: 55.76,
    pd: 64.4,
    tfs: 70.47,
    avg: 63.74,
  },
  {
    model: 'DeepSeek-V3.1',
    params: '671B (37B active)',
    access: 'Weights',
    creator: 'DeepSeek',
    tcs: 71.58,
    emh: 65.41,
    sis: 69.02,
    cv: 61.96,
    pd: 71.0,
    tfs: 77.2,
    avg: 68.55,
  },
  {
    model: 'GPT-4o',
    params: 'Undisclosed',
    access: 'API',
    creator: 'OpenAI',
    tcs: 61.63,
    emh: 59.57,
    sis: 59.24,
    cv: 55.33,
    pd: 57.71,
    tfs: 65.8,
    avg: 59.57,
  },
  {
    model: 'Claude-4 Sonnet',
    params: 'Undisclosed',
    access: 'API',
    creator: 'Anthropic',
    tcs: 71.95,
    emh: 70.05,
    sis: 70.92,
    cv: 64.55,
    pd: 69.25,
    tfs: 71.5,
    avg: 70.03,
  },
  {
    model: 'Gemini-2.5 Pro',
    params: 'Undisclosed',
    access: 'API',
    creator: 'Google',
    tcs: 72.26,
    emh: 66.07,
    sis: 70.79,
    cv: 65.71,
    pd: 70.32,
    tfs: 67.36,
    avg: 69.14,
  },
];

const statsCards = [
  { label: 'Total Q&A Pairs', value: '24.6K', helper: '18.1K knowledge + 6.5K cultivation items.' },
  { label: 'Subjects & Competencies', value: '41 + 20', helper: 'Six knowledge domains and six cultivation themes.' },
  { label: 'Question Archetypes', value: '11', helper: 'Multiple choice, essays, case analysis, calculations, and more.' },
  { label: 'Raw Corpus Curated', value: '927K', helper: 'Filtered through cleaning, filtering, and expert verification.' },
  { label: 'Education Levels', value: '5', helper: 'Primary to professional certification coverage.' },
  { label: 'Models Evaluated', value: '11', helper: '8 open-source and 3 closed-source LLMs benchmarked.' },
];

const constructionSteps = [
  {
    title: 'Targeted Collection',
    detail:
      'Blend public exam repositories, authorized private papers, and expert-guided LLM synthesis to cover underrepresented subjects and cultivation scenarios.',
  },
  {
    title: 'Structured Cleaning',
    detail:
      'Normalize formats, deduplicate near-identical questions, and align metadata for grade, subject, competency, and difficulty.',
  },
  {
    title: 'Dual-Machine Filtering',
    detail:
      'Leverage cross-model agreement checks and automated validation to eliminate leakage, ambiguous wording, and low-quality generations.',
  },
  {
    title: 'Expert Verification',
    detail:
      'Education specialists audit question-answer pairs, refine distractors, and annotate pedagogical rationales for cultivation tasks.',
  },
];

const analysisInsights = [
  {
    title: 'Knowledge vs. Cultivation Gap',
    detail:
      'Only Gemini-2.5 Pro surpasses 60% accuracy on knowledge tasks, while cultivation scenarios expose consistent reasoning blind spots for most models.',
  },
  {
    title: 'Scenario-Aware Evaluation',
    detail:
      'Cultivation competencies such as emotional support and teaching feedback require context-sensitive judgement that remains difficult even for large models.',
  },
  {
    title: 'High-Difficulty Subset',
    detail:
      'The OmniEduBench HARD subset—dominated by advanced mathematics and competition-style questions—keeps all open-source models below 50% accuracy.',
  },
  {
    title: 'Data Quality Controls',
    detail:
      'Combining private data with expert-reviewed LLM synthesis reduces contamination and preserves realistic classroom discourse.',
  },
];

function computeLeaders(rows, columns) {
  const leaders = {};
  columns.forEach((column) => {
    const values = rows
      .map((row) => row[column.key])
      .filter((value) => typeof value === 'number' && !Number.isNaN(value));

    if (!values.length) {
      leaders[column.key] = { max: null, second: null };
      return;
    }

    const sorted = Array.from(new Set(values)).sort((a, b) => b - a);
    leaders[column.key] = { max: sorted[0] ?? null, second: sorted[1] ?? null };
  });
  return leaders;
}

function formatPercent(value) {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '—';
  }
  return `${value.toFixed(2)}%`;
}

function DataTable({ title, caption, columns, rows }) {
  const leaders = useMemo(() => computeLeaders(rows, columns), [rows, columns]);

  return (
    <div id="EvaluationResults">
      <h2 className="title is-3 has-text-centered">{title}</h2>
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            <th>Model</th>
            <th>Parameters</th>
            <th>Access</th>
            <th>Creator</th>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={`${row.model}-${row.params}`}>
              <td>{row.model}</td>
              <td>{row.params}</td>
              <td>{row.access}</td>
              <td>{row.creator}</td>
              {columns.map((column) => {
                const value = row[column.key];
                const leader = leaders[column.key];
                const className =
                  leader?.max === value
                    ? 'highest'
                    : leader?.second === value
                    ? 'second-highest'
                    : undefined;
                return (
                  <td key={column.key} className={className}>
                    {formatPercent(value)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function App() {
  const [analysisVisible, setAnalysisVisible] = useState(false);
  const analysisToggleLabel = analysisVisible ? 'Hide Analysis' : 'Show Analysis';

  return (
    <div className="mme-videoocr-page">
      <style>{inlineStyles}</style>

      <section className="section is-small-padding">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column has-text-centered">
                <h1 className="title is-1 publication-title">
                  OmniEduBench: A Comprehensive Chinese Benchmark for Evaluating Large Language Models in Education
                </h1>
                <p className="is-size-5">
                  Min Zhang<sup>1*</sup> · Hao Chen<sup>1</sup> · Hao Chen<sup>1</sup> · Wenqi Zhang<sup>2</sup> · Didi Zhu<sup>3</sup> · Xin Lin<sup>1</sup> · Bo Jiang<sup>1†</sup>
                </p>
                <p className="is-size-5">
                  Aimin Zhou<sup>1†</sup> · Fei Wu<sup>2</sup> · Kun Kuang<sup>2</sup>
                </p>
                <p className="is-size-6 has-text-grey">
                  <sup>1</sup>East China Normal University · <sup>2</sup>Zhejiang University · <sup>3</sup>Imperial College London
                </p>
                <p className="is-size-6">
                  <a href="mailto:mzhang@cs.ecnu.edu.cn">mzhang@cs.ecnu.edu.cn</a> ·{' '}
                  <a href="mailto:bjiang@deit.ecnu.edu.cn">bjiang@deit.ecnu.edu.cn</a> ·{' '}
                  <a href="mailto:amzhou@cs.ecnu.edu.cn">amzhou@cs.ecnu.edu.cn</a>
                </p>
                <p className="is-size-6">
                  * Project leader · † Corresponding authors{' '}
                </p>

                <div className="publication-links" style={{ marginTop: '2rem' }}>
                  <span className="link-block">
                    <a
                      href="https://arxiv.org/pdf/2510.26422"
                      target="_blank"
                      rel="noreferrer"
                      className="external-link button is-normal is-rounded is-dark"
                    >
                      <span className="icon">
                        <i className="ai ai-arxiv" aria-hidden="true" />
                      </span>
                      <span>arXiv</span>
                    </a>
                  </span>
                  <span className="link-block">
                    <a
                      href="https://github.com/remiMZ/OmniEduBench-code/tree/main"
                      target="_blank"
                      rel="noreferrer"
                      className="external-link button is-normal is-rounded is-dark"
                    >
                      <span className="icon">
                        <i className="fab fa-github" aria-hidden="true" />
                      </span>
                      <span>Code</span>
                    </a>
                  </span>
                  <span className="link-block">
                    <a
                      href="https://github.com/OmniEduBench/OmniEduBench/releases"
                      target="_blank"
                      rel="noreferrer"
                      className="external-link button is-normal is-rounded is-dark"
                    >
                      <span className="icon">
                        <i className="fas fa-database" aria-hidden="true" />
                      </span>
                      <span>Dataset</span>
                    </a>
                  </span>
                </div>

                {/* <div className="is-size-5 publication-authors" style={{ marginTop: '2.5rem' }}>
                  <h2 className="title is-4">Key Contributions</h2>
                  <ul style={{ listStyle: 'disc', marginLeft: '1.5rem', textAlign: 'left' }}>
                    {keyHighlights.map((highlight) => (
                      <li key={highlight} style={{ marginBottom: '0.5rem' }}>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section hero is-light">
        <div className="container is-max-desktop">
          <div className="columns is-centered has-text-centered">
            <div className="column is-four-fifths">
              <h2 className="title is-3">Abstract</h2>
              <div className="content has-text-justified">
                <p>
                  With the rapid development of large language models (LLMs), various LLM-based works have been widely applied in educational fields. 
                  However, most existing LLMs and their benchmarks focus primarily on the knowledge dimension, largely neglecting the evaluation 
                  of cultivation capabilities that are essential for real-world educational scenarios. Additionally, current benchmarks are often limited 
                  to a single subject or question type, lacking sufficient diversity. This issue is particularly prominent within the Chinese context. 
                  To address this gap, we introduce OmniEduBench, a comprehensive Chinese educational benchmark. OmniEduBench consists of 24.602K 
                  high-quality question-answer pairs. The data is meticulously divided into two core dimensions: the knowledge dimension and the 
                  cultivation dimension, which contain 18.121K and 6.481K entries, respectively. Each dimension is further subdivided into 6 fine-grained 
                  categories, covering a total of 61 different subjects (41 in the knowledge and 20 in the cultivation). Furthermore, the dataset features 
                  a rich variety of question formats, including 11 common exam question types, providing a solid foundation for comprehensively evaluating 
                  LLMs' capabilities in education. Extensive experiments on 11 mainstream open-source and closed-source LLMs reveal a clear performance gap. 
                  In the knowledge dimension, only Gemini-2.5 Pro surpassed 60% accuracy, while in the cultivation dimension, the best-performing model, QWQ, 
                  still trailed human intelligence by nearly 30%. These results highlight the substantial room for improvement and underscore the challenges 
                  of applying LLMs in education.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section is-small-padding">
        <div className="container is-max-desktop">
          <div className="columns is-centered has-text-centered">
            <div className="section is-80-percent">
              <h2 className="title is-3">Benchmark Statistics</h2>
              <figure className="is-tight-figure">
                <img
                  src="static/images/omniedu_teaser.jpg"
                  alt="Overview of OmniEduBench knowledge and cultivation axes"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </figure>
              <div className="tight-text" style={{ textAlign: 'left' }}>
                <p>
                  <strong>Overview of OmniEduBench statistics.</strong> The benchmark is structured along two complementary 
                  dimensions: knowledge and cultivation. The knowledge dimension encompasses 41 subjects 
                  distributed across six categories — foundational disciplines (FD), humanities and history
                  (HH), social science and economics (SSEM), law and politics (LP), medicine and health (MH), 
                  and interdisciplinary studies (IIS). The cultivation dimension covers 20 subjects across 
                  six categories — teaching cognition support (TCS), emotional and mental health (EMH), 
                  student interaction skills (SIS), civic values (CV), personalised development (PD), 
                  and teacher feedback skills (TFS).
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section is-small-padding">
        <div className="container is-max-desktop">
          <div className="columns is-centered has-text-centered">
            <div className="section is-80-percent">
              <h2 className="title is-3">Construction Pipeline</h2>
              <figure className="is-tight-figure">
                <img
                  src="static/images/omniedu_pipeline.png"
                  alt="Four-stage construction pipeline"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                </figure>
              <div className="tight-text" style={{ textAlign: 'left' }}>
                <p>
                  <strong>Overview of the OmniEduBench construction process.</strong>  Through rigorous data filtering and expert validation, we collected 18.121K high-quality question–answer pairs for the knowledge and 6.481K for the cultivation. As summarized in Table 1, the dataset spans 12 major categories, including K-12, higher school, university-level courses, and cultivation aspects such as emotion and reasoning, covering a total of 61 specific scenarios. Figures (a) and (b) present some representative examples in different dimensions and question types. The questions exhibit wide variability in type and difficulty and are sourced from diverse origins, primarily newly collected from public or private resources or manually constructed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
              
      <section className="section is-small-padding">
        <div className="container is-max-desktop">
          <div className="columns is-centered has-text-centered">
            <div className="section is-80-percent">
              <h2 className="title is-3">Data Coverage</h2>
              <figure className="is-tight-figure">
                <img
                  src="static/images/table_1.png"
                  alt="Distribution of OmniEduBench subjects and competencies"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                <img
                  src="static/images/omniedu_stats_A.jpg"
                  alt="Distribution of OmniEduBench subjects and competencies"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
                <img
                  src="static/images/omniedu_stats_B.png"
                  alt="Distribution of OmniEduBench subjects and competencies"
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              </figure>
              <p style={{ textAlign: 'left', whiteSpace: 'normal', maxWidth: '95%', margin: '0 auto' }}>
                The benchmark balances grade bands from primary through professional education, pairing knowledge items
                with cultivation scenarios rooted in classroom management, counselling, and value shaping. Each instance
                includes metadata for subject, competency, educational stage, difficulty, and source provenance, enabling
                fine-grained analysis and controlled evaluations.
              </p>
            </div>
          </div>
        </div>
      </section>

      

      <section className="section" id="EvaluationResults">
        <div className="container is-max-desktop content">
          <h2 className="title is-3 has-text-centered">Leaderboard</h2>
          <figure className="is-tight-figure">
            <img
              src="static/images/leaderboard1.png"
              alt="Leaderboard 1"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <img
              src="static/images/leaderboard2.png"
              alt="Leaderboard 2"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
            <img
              src="static/images/leaderboard3.png"
              alt="Leaderboard 3"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </figure>
        </div>
      </section>

      <section className="section is-small-padding">
        <div className="container is-max-desktop">
          <div className="columns is-centered has-text-centered">
            <div className="column is-12">
              <h2 className="title is-3">Benchmark Statistics</h2>
              <div className="columns is-multiline is-variable is-5" style={{ marginTop: '2.5rem' }}>
                {statsCards.map((card) => (
                  <div key={card.label} className="column is-one-third-desktop is-half-tablet">
                    <div className="stat-card">
                      <span className="stat-label">{card.label}</span>
                      <span className="stat-value">{card.value}</span>
                      <span className="stat-helper">{card.helper}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section is-small-padding">
        <div className="container is-max-desktop">
          <div className="columns is-centered has-text-centered">
            <div className="section is-80-percent">
              <h2 className="title is-3">Conclusion</h2>
              <ol style={{ textAlign: 'left', marginLeft: '1.5rem' }}>
                {constructionSteps.map((step) => (
                  <li key={step.title} style={{ marginBottom: '1rem' }}>
                    <strong>{step.title}.</strong> {step.detail}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>


      <section className="section" id="BibTeX">
        <div className="container is-max-desktop content">
          <h2 className="title">BibTeX</h2>
          <pre style={{ textAlign: 'left' }}>
            <code>{`@article{zhang2025omniedubench,
  title={OmniEduBench: A Comprehensive Chinese Benchmark for Evaluating Large Language Models in Education},
  author={Zhang, Min  and Chen, Hao and Chen, Hao and Zhang, Wenqi and  Zhu, Didi and Lin, Xin and Jiang, Bo and Zhou, Aimin and Wu, Fei and Kuang, Kun},
  journal={arXiv preprint arXiv:2510.26422},
  year={2025}
}`}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}

export default App;


