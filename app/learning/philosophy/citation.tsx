import type { LedgerSource } from './content-ledger';

/**
 * 正文里的来源角标。
 *
 * 来源核验记录被收进了二级的研究层，但角标必须留在正文：读者应当能在
 * 看到某个论断的当下就跳到它依据的那一节，而不是先展开一个折叠区。
 */
export function Citations({
  ids,
  sources,
}: {
  ids?: string[];
  sources: LedgerSource[];
}) {
  if (!ids?.length) return null;

  const resolved = ids
    .map((id) => sources.find((source) => source.id === id))
    .filter((source): source is LedgerSource => Boolean(source));

  if (resolved.length === 0) return null;

  return (
    <>
      {resolved.map((source) => (
        <a
          aria-label={`来源 ${source.id}：${source.title}（在新标签页打开）`}
          className="philosophy-citation"
          href={source.url}
          key={source.id}
          rel="noreferrer"
          target="_blank"
        >
          [{source.id}]
        </a>
      ))}
    </>
  );
}

/** 「核对来源 [X-1][X-2]」这种带前缀的写法，用在立场、人物卡这类块里。 */
export function ClaimSources({ ids, sources }: { ids?: string[]; sources: LedgerSource[] }) {
  if (!ids?.length) return null;
  const known = ids.filter((id) => sources.some((source) => source.id === id));
  if (known.length === 0) return null;

  return (
    <span className="philosophy-claim-sources">
      核对来源 <Citations ids={known} sources={sources} />
    </span>
  );
}
