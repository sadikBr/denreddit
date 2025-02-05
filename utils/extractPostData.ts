import type { PostData } from "../types/reddit-types.d.ts";

export interface ExtractedPostData {
  kind: string;
  title: string;
  author: string;
  subreddit: string;
  url: string;
  likes: number;
}

export function extractPostData(post: PostData) {
  const kind = post.post_hint;

  const postData: ExtractedPostData = {
    kind,
    title: post.title,
    author: post.author,
    subreddit: post.subreddit,
    likes: post.ups,
    url: "",
  };

  switch (kind) {
    case "image":
      postData.url = post.url;
      break;
    case "rich:video":
      postData.url = post.preview.reddit_video_preview!.fallback_url!;
      postData.kind = "video";
      break;
    case "hosted:video":
      postData.url = post.secure_media?.reddit_video.fallback_url ||
        post.media.reddit_video.fallback_url;
      postData.kind = "video";
      break;
  }

  return postData;
}
