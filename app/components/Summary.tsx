import Markdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import Skeleton from 'react-loading-skeleton';

interface SummaryProps {
  content: string;
  loading: boolean;
}

export const Summary = ({ content, loading }: SummaryProps) => (
  <div className="Summary">
    {loading ? (
      Array(5)
        .fill(0)
        .map((e, i) => (
          <Skeleton width={Math.floor(Math.random() * 100) + 300} key={i} />
        ))
    ) : (
      <Markdown rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}>
        {content}
      </Markdown>
    )}
  </div>
);
