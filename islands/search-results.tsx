import { useEffect, useMemo, useState } from "preact/hooks";

type SearchResultsProps = {
  kind: "user" | "subreddit";
  searchTerm: string;
  searchResults: any[];
};

function SearchResults(props: SearchResultsProps) {
  return (
    <div class="w-full flex items-center gap-4 pb-8 overflow-x-auto">
      {props.searchResults.map((item, index) => (
        <a
          href={
            `../${props.kind}/${item.data.display_name}` +
            `?searchTerm=${props.searchTerm}&&kind=${props.kind}&&path=hot&&period=all`
          }
          key={index}
          class="flex flex-col flex-shrink-0 items-center gap-2 border-green-300 border-[3px] rounded-full p-1"
          title={item.data.display_name}
        >
          <img
            src={
              item.data.community_icon.split("?width")[0] ||
              item.data.icon_img ||
              item.data.header_img
            }
            class="w-[90px] object-cover aspect-square bg-green-300 rounded-full"
          />
        </a>
      ))}
    </div>
  );
}

type SearchResultsIslandProps = {
  kind: "user" | "subreddit";
  searchTerm: string;
};

export default function SearchResultsIsland(props: SearchResultsIslandProps) {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchUrl = useMemo(() => {
    return `https://www.reddit.com/r/subreddit/search.json?type=${
      props.kind === "user" ? "user" : "sr"
    }&q=${props.searchTerm}&limit=20&include_over_18=true`;
  }, [props]);

  useEffect(() => {
    async function getSearchResults() {
      try {
        const response = await fetch(searchUrl);
        const json = await response.json();

        const results = json.data?.children;
        setSearchResults(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong!");
      } finally {
        setLoading(false);
      }
    }

    getSearchResults();
  }, [searchUrl]);

  return (
    <>
      {(loading || error.length > 0) && (
        <div class="mb-8">
          {loading && error.length === 0 && (
            <div class="font-bold uppercase text-sm text-center">
              Loading ...
            </div>
          )}
          {error.length > 0 && (
            <div class="text-red-500 font-bold uppercase text-sm text-center">
              {error}
            </div>
          )}
        </div>
      )}
      {!loading && error.length === 0 && (
        <SearchResults
          kind={props.kind}
          searchTerm={props.searchTerm}
          searchResults={searchResults}
        />
      )}
    </>
  );
}
