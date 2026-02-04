import { For } from 'solid-js';
import styles from './CommentSection.module.css';

function CommentSection(props) {
  return (
    <div class={styles.commentSection}>
      <For each={props.comments}>
        {(comment) => (
          <div class={styles.comment}>
            <span class={styles.commentAuthor}>{comment.author}:</span>
            <p class={styles.commentContent}>{comment.content}</p>
          </div>
        )}
      </For>
    </div>
  );
}

export default CommentSection;
