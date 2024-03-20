import { getJson } from 'serpapi';
import { EnvVars } from './env-vars';

/**
 * Use this to get the Google search results for a query.
 * Docs: https://github.com/serpapi/serpapi-javascript
 */

export interface SearchResult {
  displayed_link: string;
  favicon: string;
  link: string;
  position: number;
  redirect_link: string;
  snippet: string;
  snippet_highlighted_words: string[];
  source: string;
  title: string;
}

export interface GoogleInlineImage {
  source: string;
  thumbnail: string;
  original: string;
  title: string;
  source_name: string;
}

export interface FullResult {
  organic_results: SearchResult[];
  knowledge_graph?: {
    title: string;
    type: string;
    description: string;
  };
  // Lots of other types here can be added to make this comprehensive
}

/** Search Google for the given query using the SerpApi service. */
export const searchGoogle = async (query: string): Promise<SearchResult[]> => {
  const response = (await getJson({
    engine: 'google',
    api_key: EnvVars.serpapi(),
    q: query,
  })) as FullResult;

  return response.organic_results;
};
