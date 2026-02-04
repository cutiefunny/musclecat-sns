import { For, createSignal } from 'solid-js';
import styles from './CommentSection.module.css';

function CommentSection(props) {
  const [content, setContent] = createSignal('');
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content().trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await props.onAddComment({
        author: '근육고양이',
        content: content().trim()
      });
      
      // 성공 시 입력 필드 초기화
      setContent('');
    } catch (error) {
      alert('댓글 작성 실패: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div class={styles.commentSection}>
      {/* 댓글 목록 */}
      <For each={props.comments}>
        {(comment) => (
          <div class={styles.comment}>
            <span class={styles.commentAuthor}>{comment.author}:</span>
            <p class={styles.commentContent}>{comment.content}</p>
          </div>
        )}
      </For>
      
      {/* 댓글 작성 폼 */}
      <form onsubmit={handleSubmit} style={{ "margin-top": "10px", "padding-top": "10px", "border-top": "1px solid #ccc" }}>
        <textarea
          placeholder="댓글을 입력하세요..."
          value={content()}
          oninput={(e) => setContent(e.target.value)}
          disabled={isSubmitting()}
          style={{
            width: "100%",
            padding: "8px",
            "margin-bottom": "8px",
            border: "1px solid black",
            "font-family": "monospace",
            "min-height": "60px",
            resize: "vertical"
          }}
        />
        <button
          type="submit"
          disabled={isSubmitting()}
          style={{
            padding: "8px 16px",
            border: "2px solid black",
            background: "white",
            "font-weight": "bold",
            cursor: isSubmitting() ? "not-allowed" : "pointer"
          }}
        >
          {isSubmitting() ? '작성 중...' : '댓글 작성'}
        </button>
      </form>
    </div>
  );
}

export default CommentSection;
