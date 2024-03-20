import type { FetcherWithComponents } from '@remix-run/react';

export const SearchForm = <T,>({
  defaultValue,
  fetcher,
}: {
  defaultValue: string;
  fetcher: FetcherWithComponents<T>;
}) => {
  return (
    <fetcher.Form method="get" className="FormRoot">
      <div className="FormField">
        <label htmlFor="search" className="FormLabel">
          Search
        </label>
        <input
          type="search"
          name="q"
          id="search"
          defaultValue={defaultValue}
          placeholder="Search the web"
          className="Input"
        />
      </div>
      <button type="submit" className="Button">
        Search
      </button>
    </fetcher.Form>
  );
};
