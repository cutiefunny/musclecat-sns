import { createSignal } from "solid-js";

const [posts, setPosts] = createSignal([]); // 최신 글이 위로 오도록 정렬

export { posts, setPosts };
