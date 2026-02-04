import { createSignal } from 'solid-js';
import styles from './PostActions.module.css';

function PostActions(props) {
  const [isDeleting, setIsDeleting] = createSignal(false);

  const handleDelete = async () => {
    if (!confirm('정말 이 게시글을 삭제하시겠습니까?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await props.onDelete(props.postId);
    } catch (error) {
      alert('삭제 실패: ' + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div class={styles.actions}>
      <button 
        class={styles.actionButton}
        onClick={props.onToggleComments}
      >
        💬 {props.commentCount || 0}
      </button>
      
      <button 
        class={`${styles.actionButton} ${styles.deleteButton}`}
        onClick={handleDelete}
        disabled={isDeleting()}
      >
        {isDeleting() ? '삭제 중...' : '🗑 삭제'}
      </button>
    </div>
  );
}

export default PostActions;
