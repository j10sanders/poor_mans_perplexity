import type { Prompt } from '@dexaai/dexter';
import { ChatModel, createOpenAIClient, Msg } from '@dexaai/dexter';
import { EnvVars } from './env-vars';
import type { SearchResult } from './serpapi';

// Just title, snippet, and link
export type CleanedSearchResult = Omit<
  SearchResult,
  | 'displayed_link'
  | 'favicon'
  | 'position'
  | 'redirect_link'
  | 'snippet_highlighted_words'
  | 'source'
>;
/**
 * Use this to make requests to the OpenAI API.
 * Docs: https://github.com/dexaai/dexter
 */

const openaiClient = createOpenAIClient({ apiKey: EnvVars.openAI() });

/** Use ChatModel to make requests to the chat completion endpoint. */
const chatModel = new ChatModel({
  client: openaiClient,
  debug: true,
  params: {
    model: 'gpt-3.5-turbo-1106',
  },
});

/** Summarize Google search results using the OpenAI API. */
export async function summarizeSearchResults(args: {
  query: string;
  searchResults: CleanedSearchResult[];
}): Promise<string> {
  const { query, searchResults } = args;
  const formattedResults = searchResults
    .map(
      (result, index) =>
        `${index + 1}. ${result.title}: ${result.snippet} from ${result.link}`
    )
    .join('\n');

  const messages: Prompt.Msg[] = [
    Msg.system(
      `You are an assistant that summarizes google results for a given query in Markdown syntax, along with a couple sources.
      Example: "Summarise the following search results for the query: "When is mother's day?":\n\n 1. Mother's Day 2024: When is Mother's Day This Year?: Get ready for Mother's Day (Sunday, May 12). It may surprise you to know that celebrations honoring mothers are ancient traditions, not a Hallmark invention ... from https://www.almanac.com/content/when-is-mothers-day
      2. Mother's Day 2024 in the United States: Mother's Day 2024 in the US is on the second Sunday in May. Things to do for Mother's Day and more about the origin of Mother's Day in the US. from https://www.timeanddate.com/holidays/us/mothers-day
      3. When Is Mother's Day 2024: The U.K. celebrates Mother's Day on Sunday, March 19, while Mexico celebrates a few days earlier on Wednesday, March 10. Thailand, however, ... from https://www.today.com/parents/moms/when-is-mothers-day-rcna17149
      \n
      Response:
      Mother's day in the US is the second Sunday in May, which is Sunday, March 19th. [source 1](https://www.almanac.com/content/when-is-mothers-day), [source 2](https://www.today.com/parents/moms/when-is-mothers-day-rcna17149)
      `
    ),
    Msg.user(
      `Summarize the following search results for the query "${query}":\n\n${formattedResults}.`
    ),
  ];
  const response = await chatModel.run({
    messages,
  });

  //TODO: add error handling
  return response.message.content || `There was an issue summarizing ${query}`;
}
