import { createSignal } from 'solid-js';
import styles from './PostItem.module.css';
import CommentSection from './CommentSection';

function PostItem(props) {
  const [showComments, setShowComments] = createSignal(true);

  const toggleComments = () => {
    setShowComments(!showComments());
  };

  return (
    <article class={styles.post}>
      <header class={styles.postHeader}>
        <span class={styles.author}>{props.post.author}</span>
        <span class={styles.timestamp}>{props.post.timestamp}</span>
      </header>
      <p class={styles.content}>{props.post.content}</p>
      <footer class={styles.postFooter}>
        <span onclick={toggleComments} style={{ cursor: 'pointer' }}>
          Comments ({props.post.comments.length}) {showComments() ? '[-]' : '[+]'}
        </span>
      </footer>
      {showComments() && <CommentSection comments={props.post.comments} />}
    </article>
  );
}

export default PostItem;
