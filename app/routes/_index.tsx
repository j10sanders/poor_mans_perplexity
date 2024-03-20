import { json } from '@remix-run/node';
import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node';
import { useLoaderData, useFetcher } from '@remix-run/react';
import { z } from 'zod';
import { zx } from 'zodix';
import type { CleanedSearchResult } from '~/services/openai';
import { summarizeSearchResults } from '~/services/openai';
import type { SearchResult } from '~/services/serpapi';
import { searchGoogle } from '~/services/serpapi';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { SearchForm } from '~/components/SearchForm';
import { Summary } from '~/components/Summary';
import { ResultCard } from '~/components/ResultCard';

export interface LoaderData {
  q: string | null;
  searchResults: SearchResult[];
  summary: string;
  error?: string;
}

export const meta: MetaFunction = () => {
  return [{ title: 'Dexa Coding Interview' }];
};

function cleanSearchResults(
  searchResults: SearchResult[]
): CleanedSearchResult[] {
  return searchResults.map(({ title, snippet, link }) => ({
    title,
    snippet,
    link,
  }));
}

export async function loader(args: LoaderFunctionArgs) {
  try {
    const { q } = zx.parseQuery(args.request, {
      q: z.string().optional(),
    });

    let searchResults: SearchResult[] = [];
    let summary = '';

    if (q) {
      searchResults = await searchGoogle(q);
      summary = await summarizeSearchResults({
        query: q,
        searchResults: cleanSearchResults(searchResults),
      });
    }

    return json({ q, searchResults, summary });
  } catch (error) {
    console.error('Loader error: ', error);
    return json(
      { error: 'An error occurred while fetching data.' },
      { status: 500 }
    );
  }
}

export default function Index() {
  const loaderData = useLoaderData<LoaderData>();
  const fetcher = useFetcher<LoaderData>();

  const data = fetcher.data ? fetcher.data : loaderData;
  if (data.error) {
    return <div>Error: {data.error}</div>;
  }
  const { q, searchResults, summary } = data;
  return (
    <div className="MainContainer">
      <SkeletonTheme baseColor="#202020" highlightColor="#444">
        <h1>poor man's perplexity</h1>
        <SearchForm<LoaderData> defaultValue={q || ''} fetcher={fetcher} />
        <Summary content={summary} loading={fetcher.state === 'loading'} />
        <div className="ResultsContainer">
          {fetcher.state === 'loading'
            ? Array(6)
                .fill(0)
                .map((e, i) => <ResultCard loading key={i} />)
            : searchResults
                .slice(0, 6)
                .map((result) => (
                  <ResultCard
                    result={result}
                    key={result.position}
                    loading={false}
                  />
                ))}
        </div>
      </SkeletonTheme>
    </div>
  );
}
