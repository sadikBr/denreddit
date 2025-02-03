import SearchResultsIsland from "../islands/search-results.tsx";
import PostsIsland from "../islands/posts.tsx";
import type { Handlers } from "$fresh/server.ts";

type TopSectionProps = {
  display: string;
  message?: string;
  kind: "user" | "subreddit";
  searchTerm: string;
  sort: {
    path: "hot" | "new" | "top";
    period: "all" | "day" | "week";
  };
};

export function TopSection(props: TopSectionProps) {
  return (
    <div class="px-4 py-8 mx-auto bg-[#86efac]">
      <div class="max-w-screen-md mx-auto flex flex-col items-center justify-center">
        <a href="/">
          <img
            class="my-6"
            src="/logo.svg"
            width="128"
            height="128"
            alt="the Fresh logo: a sliced lemon dripping with juice"
          />
        </a>
        <h1 class="text-4xl font-bold text-center">
          Den<span class="text-yellow-500">Reddit</span> - {props.display}
        </h1>
        <form
          method="POST"
          class="w-[75vw] flex flex-col gap-1 lg:flex-row mt-8 bg-white rounded-md overflow-hidden p-1"
        >
          <div class="flex items-center gap-4 flex-[2]">
            <select
              value={props.kind}
              name="kind"
              class="px-1 py-2 uppercase bg-transparent"
            >
              <option value="user">user</option>
              <option value="subreddit">subreddit</option>
            </select>
            <input
              type="text"
              value={props.searchTerm}
              name="searchTerm"
              placeholder="Search Input"
              class="flex-1 px-1 py-2 rounded-md"
            />
          </div>
          <div class="flex items-center gap-4 flex-1">
            <select
              value={props.sort.path}
              name="sortPath"
              class="px-1 py-2 uppercase bg-transparent"
            >
              <option value="hot">hot</option>
              <option value="new">new</option>
              <option value="top">top</option>
            </select>
            <select
              value={props.sort.period}
              name="sortPeriod"
              class="px-1 py-2 uppercase bg-transparent"
            >
              <option value="all">all</option>
              <option value="week">week</option>
              <option value="day">day</option>
            </select>
            <input
              type="submit"
              value="Search"
              class="px-1 py-2 bg-yellow-500 flex-1 rounded-md cursor-pointer text-white font-extrabold uppercase"
            />
          </div>
        </form>
        {props.message && (
          <p class="text-red-400 text-sm mt-8">{props.message}</p>
        )}
      </div>
    </div>
  );
}

export const handler: Handlers = {
  GET(_req, context) {
    return context.render({
      searchTerm: "awww",
      kind: "subreddit",
      sort: {
        path: "hot",
        period: "all",
      },
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
        searchTerm: "awww",
        kind: "subreddit",
        sort: {
          path: "hot",
          period: "all",
        },
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
      `/subreddit/${searchTerm.replaceAll(" ", "")}/${urlSuffix}`,
    );

    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default function Home(
  { data }: {
    data: { searchTerm: string; kind: "user" | "subreddit"; message?: string };
  },
) {
  const searchTerm = data?.searchTerm;
  const kind = data?.kind;
  const message = data?.message;

  return (
    <>
      <TopSection
        display="Reddit Clone"
        searchTerm={searchTerm}
        message={message}
        kind={kind}
        sort={{ path: "hot", period: "all" }}
      />
      <div class="px-4 py-8 max-w-7xl mx-auto">
        <SearchResultsIsland kind={kind} searchTerm={searchTerm} />
        <PostsIsland
          kind={kind}
          name={searchTerm}
          sort={{ path: "hot", period: "all" }}
        />
      </div>
    </>
  );
}
