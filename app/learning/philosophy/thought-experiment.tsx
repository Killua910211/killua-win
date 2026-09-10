import type { ThoughtExperiment as ThoughtExperimentData } from './thought-experiments';

/**
 * 思想实验。
 *
 * 结构就是这个方法本身：一个基准情境，然后逐次只改一个变量，最后说明
 * 不同判断分别在依据什么原则。
 *
 * 它停在「你的判断更看重 X」，不会走到「所以你是 X 主义者」。页面上没有
 * 提交、计分或结果，也没有任何状态——重读一遍应当得到同样的页面。
 */
export function ThoughtExperiment({ experiment }: { experiment: ThoughtExperimentData }) {
  const ownSources = experiment.sources ?? [];
  const scenes = [
    { ...experiment.base, changed: undefined as string | undefined, tests: undefined as string | undefined },
    ...experiment.variations,
  ];

  return (
    <div className="philosophy-experiment">
      <h3 className="philosophy-experiment-title">{experiment.title}</h3>
      <p className="philosophy-experiment-purpose">{experiment.purpose}</p>
      <p className="philosophy-experiment-origin">
        <span className="philosophy-content-kind">{experiment.origin}</span>
        {experiment.originNote}
      </p>

      <ol className="philosophy-experiment-scenes">
        {scenes.map((scene, index) => (
          <li key={`${index}-${scene.label}`}>
            <p className="philosophy-experiment-label">{scene.label}</p>
            {scene.changed && (
              <p className="philosophy-experiment-changed">
                <span className="philosophy-experiment-tag">改动的变量</span>
                {scene.changed}
              </p>
            )}
            <p className="philosophy-experiment-scenario">{scene.scenario}</p>
            <ul className="philosophy-experiment-questions">
              {scene.questions.map((question) => (
                <li key={question}>{question}</li>
              ))}
            </ul>
            {scene.tests && (
              <p className="philosophy-experiment-tests">
                <span className="philosophy-experiment-tag">这一改动在检验</span>
                {scene.tests}
              </p>
            )}
          </li>
        ))}
      </ol>

      <div className="philosophy-experiment-principles">
        <p className="philosophy-experiment-subhead">判断改变时，你实际上在依据什么</p>
        <dl>
          {experiment.principles.map((principle) => (
            <div key={principle.name}>
              <dt>{principle.name}</dt>
              <dd>{principle.note}</dd>
            </div>
          ))}
        </dl>
      </div>

      <p className="philosophy-experiment-closing">{experiment.closing}</p>

      {ownSources.length > 0 && (
        <p className="philosophy-experiment-sources">
          <span className="philosophy-experiment-tag">本案例的依据</span>
          {ownSources.map((source) => (
            <a href={source.url} key={source.id} rel="noreferrer" target="_blank">
              {source.title}
              <span className="sr-only">（在新标签页打开）</span>
            </a>
          ))}
        </p>
      )}
    </div>
  );
}
