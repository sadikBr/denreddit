import { TopSection } from "../index.tsx";

import { Handlers, PageProps } from "$fresh/server.ts";
import SearchResultsIsland from "../../islands/search-results.tsx";
import PostsIsland from "../../islands/posts.tsx";

export const handler: Handlers = {
  GET(req, context) {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    const searchTerm = searchParams.get("searchTerm");
    const kind = searchParams.get("kind");
    const sort = {
      path: searchParams.get("path"),
      period: searchParams.get("period"),
    };

    return context.render({
      searchTerm,
      kind,
      sort,
    });
  },
  async POST(req, context) {
    const form = await req.formData();
    const searchTerm = form.get("searchTerm")?.toString();
    const kind = form.get("kind")?.toString();
    const sort = {
      path: form.get("sortPath")?.toString(),
      period: form.get("sortPeriod")?.toString(),
    };

    if (!searchTerm) {
      return context.render({
        message: "Please provide a search term before submitting the form.",
        searchTerm,
        kind,
        sort,
      });
    }

    const sortUrlString = sort.path === "hot" || sort.path === "new"
      ? `path=${sort.path}&&period=all`
      : `path=${sort.path}&&period=${sort.period}`;
    const urlSuffix =
      `?searchTerm=${searchTerm}&&kind=${kind}&&${sortUrlString}`;

    // Redirect the user.
    const headers = new Headers();
    headers.set(
      "location",
      `../subreddit/${searchTerm.replaceAll(" ", "")}/${urlSuffix}`,
    );

    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default function SubredditPage(props: PageProps) {
  const subreddit = props.params?.subreddit;
  const { data } = props;

  return (
    <>
      <TopSection
        display={`r/${subreddit}`}
        searchTerm={subreddit}
        message=""
        kind={data.kind}
        sort={{ path: data.sort.path, period: data.sort.period }}
      />
      <div class="px-4 py-8 max-w-7xl mx-auto">
        <SearchResultsIsland kind={data.kind} searchTerm={data.searchTerm} />
        <PostsIsland kind={data.kind} name={subreddit} sort={data.sort} />
      </div>
    </>
  );
}
