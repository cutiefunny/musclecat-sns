import { For } from 'solid-js';
import { posts } from '../store';
import PostItem from './PostItem';
import styles from './Feed.module.css';

function Feed() {
  return (
    <main class={styles.feed}>
      <For each={posts()}>
        {(post) => <PostItem post={post} />}
      </For>
    </main>
  );
}

export default Feed;
