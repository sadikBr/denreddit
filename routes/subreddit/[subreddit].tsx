import SearchResultsIsland from "../../islands/search-results.tsx";
import PostsIsland from "../../islands/posts.tsx";
import TopSection from "../../routes/index.tsx";
import type { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(req, context) {
    const url = new URL(req.url);
    const searchParams = url.searchParams;

    console.log(searchParams);

    //return context.render({
    //  searchTerm: "awww",
    //  kind: "subreddit",
    //  sort: {
    //    path: "hot",
    //    period: "all",
    //  },
    //});
  },
};

export default function Subreddit(props: PageProps) {
  console.log(props);

  return (
    <>
      <TopSection
        message={""}
        kind={"subreddit"}
        sort={{ path: "hot", period: "all" }}
      />
      <div class="px-4 py-8 max-w-7xl mx-auto">
        <SearchResultsIsland kind={"subreddit"} searchTerm={"awww"} />
        <PostsIsland kind="subreddit" name="awww" />
      </div>
    </>
  );
}
