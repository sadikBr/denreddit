import { Post } from "../types/reddit-types.d.ts";

export default function filterResponse(posts: Post[]) {
  if (posts.length === 0) return [];

  return posts.filter((child: Post) =>
    child.data.post_hint === "image" ||
    (child.data.post_hint === "rich:video" &&
      child.data.preview.reddit_video_preview &&
      child.data.preview.reddit_video_preview.fallback_url) ||
    (child.data.post_hint === "hosted:video" &&
      (child.data.media.reddit_video.fallback_url ||
        child.data.secure_media?.reddit_video.fallback_url))
  );
}
