import { createSignal } from 'solid-js';
import styles from './PostForm.module.css';

function PostForm(props) {
  const [content, setContent] = createSignal('');
  const [isSubmitting, setIsSubmitting] = createSignal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content().trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await props.onSubmit({
        author: '근육고양이',
        content: content().trim()
      });
      
      // 성공 시 초기화
      setContent('');
    } catch (error) {
      alert('게시글 작성 실패: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form class={styles.postForm} onSubmit={handleSubmit}>
      <div class={styles.formGroup}>
        <label class={styles.label}>내용</label>
        <textarea
          class={styles.textarea}
          value={content()}
          onInput={(e) => setContent(e.target.value)}
          placeholder="무슨 생각을 하고 계신가요?"
          rows={4}
          disabled={isSubmitting()}
        />
      </div>
      
      <button 
        type="submit" 
        class={styles.submitButton}
        disabled={isSubmitting()}
      >
        {isSubmitting() ? '등록 중...' : '등록'}
      </button>
    </form>
  );
}

export default PostForm;
