import { useEffect, useMemo, useState } from "preact/hooks";
import type { Post, PostData } from "../types/reddit-types.d.ts";
import filterResponse from "../utils/filterResponse.ts";
import { extractPostData } from "../utils/extractPostData.ts";
import { ComponentChild } from "preact/src/index.js";

interface PostLayoutProps {
  children: ComponentChild;
  rest: {
    title: string;
    author: string;
    subreddit: string;
    url: string;
    likes: number;
  };
}

function PostLayout({ children, rest }: PostLayoutProps) {
  return (
    <div
      title={rest.title}
      class="bg-[#86efac] p-2 rounded-lg shadow-md mb-4 overflow-hidden"
    >
      {children}
      <div class="mt-4 text-sm">
        Created by{" "}
        <a href={`/user/${rest.author}`} class="text-white font-bold">
          {rest.author}
        </a>{" "}
        on{" "}
        <a
          class="text-yellow-500 font-bold"
          href={`/subreddit/${rest.subreddit}?path=hot`}
        >
          r/{rest.subreddit}
        </a>
      </div>
    </div>
  );
}

type PostRendererProps = {
  post: PostData;
};

function PostRenderer(props: PostRendererProps) {
  const { kind, ...rest } = extractPostData(props.post);

  switch (kind) {
    case "image":
      return (
        <PostLayout rest={rest}>
          <img
            src={rest.url}
            alt={rest.title}
            loading="lazy"
            className="rounded-md w-full max-h-[800px] bg-black"
          />
        </PostLayout>
      );
    case "video":
      return (
        <PostLayout rest={rest}>
          <video
            src={rest.url}
            controls
            loading="lazy"
            className="rounded-md w-full max-h-[800px] bg-black"
          />
        </PostLayout>
      );
    default:
      return null;
  }
}

type PostsProps = {
  posts: Post[];
};

function Posts(props: PostsProps) {
  return (
    <div class="w-full columns-1 lg:columns-2">
      {props.posts.map((post, index) => (
        <PostRenderer key={post.data.id} post={post.data} />
      ))}
    </div>
  );
}

type PostsIslandProps = {
  kind: string;
  name: string;
};

export default function PostsIsland(props: PostsIslandProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const url = useMemo(() => {
    return `https://www.reddit.com/${
      props.kind === "user" ? "user" : "r"
    }/${props.name}/${
      props.kind === "user" ? "submitted" : ""
    }.json?limit=100&include_over_18=true`;
  }, [props]);

  const searchUrl = useMemo(() =>
    `https://www.reddit.com/search.json?q=${
      props.name.replaceAll("+", " ")
    }&limit=100`
  );

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await fetch(url);
        const json = await response.json();

        let posts = filterResponse(json.data?.children || []);

        if (posts.length === 0) {
          const searchResponse = await fetch(searchUrl);
          const searchJson = await searchResponse.json();

          posts = filterResponse(searchJson.data?.children || []);
        }

        setPosts(posts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong!");
      } finally {
        setLoading(false);
      }
    }

    getPosts();
  }, [url, searchUrl]);

  return (
    <>
      {loading && <div>Loading ...</div>}
      {!loading && error.length > 0 && <div>{error}</div>}
      {!loading && posts.length > 0 && <Posts posts={posts} />}
      {!loading && !error && posts.length === 0 && (
        <div>No Posts Found for {props.name}</div>
      )}
    </>
  );
}
