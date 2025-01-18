// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_404 from "./routes/_404.tsx";
import * as $_app from "./routes/_app.tsx";
import * as $index from "./routes/index.tsx";
import * as $subreddit_subreddit_ from "./routes/subreddit/[subreddit].tsx";
import * as $user_user_ from "./routes/user/[user].tsx";
import * as $posts from "./islands/posts.tsx";
import * as $search_results from "./islands/search-results.tsx";
import type { Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_404.tsx": $_404,
    "./routes/_app.tsx": $_app,
    "./routes/index.tsx": $index,
    "./routes/subreddit/[subreddit].tsx": $subreddit_subreddit_,
    "./routes/user/[user].tsx": $user_user_,
  },
  islands: {
    "./islands/posts.tsx": $posts,
    "./islands/search-results.tsx": $search_results,
  },
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
