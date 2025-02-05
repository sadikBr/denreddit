import { Handlers, PageProps } from "$fresh/server.ts";
import PostsIsland from "../../islands/posts.tsx";
import SearchResultsIsland from "../../islands/search-results.tsx";
import { TopSection } from "../index.tsx";

export const handler: Handlers = {
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
        searchTerm: "",
        kind: "user",
        sort: {
          path: "hot",
          period: "all",
        },
      });
    }

    let urlSuffix = "";

    if (kind === "subreddit") {
      const sortUrlString =
        sort.path === "hot" || sort.path === "new"
          ? `path=${sort.path}&&period=all`
          : `path=${sort.path}&&period=${sort.period}`;
      urlSuffix = `?searchTerm=${searchTerm}&&kind=${kind}&&${sortUrlString}`;
    }

    // Redirect the user.
    const headers = new Headers();
    headers.set(
      "location",
      `/${kind}/${searchTerm.replaceAll(" ", "")}${
        urlSuffix.length > 0 ? `/${urlSuffix}` : ""
      }`
    );

    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

export default function SubredditPage(props: PageProps) {
  const user = props.params?.user;
  const { data } = props;
  const message = data?.message;

  return (
    <>
      <TopSection
        display={`u/${user}`}
        searchTerm={user}
        message={message}
        kind="user"
        sort={{ path: "hot", period: "all" }}
      />
      <div class="px-4 py-8 max-w-7xl mx-auto">
        <SearchResultsIsland kind="user" searchTerm={user} />
        <PostsIsland
          kind="user"
          name={user}
          sort={{ path: "hot", period: "all" }}
        />
      </div>
    </>
  );
}
