// src/pages/Feed.jsx
import { createSignal, onMount, For } from "solid-js";
import { request } from "../utils/api";
import PostForm from "../components/PostForm";
import PostActions from "../components/PostActions";
import CommentSection from "../components/CommentSection";

function Feed() {
  const [posts, setPosts] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [expandedComments, setExpandedComments] = createSignal(new Set());
  const [commentsData, setCommentsData] = createSignal({}); // postId를 키로 하는 댓글 데이터

  // 게시글 불러오기
  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await request("/sns/getPosts", {
        method: "POST",
        body: { limit: 20 }
      });
      if (res.result === "success") {
        setPosts(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 게시글 작성
  const handleCreatePost = async (postData) => {
    const res = await request("/sns/createPost", {
      method: "POST",
      body: postData
    });
    
    if (res.result === "success") {
      await fetchPosts(); // 목록 새로고침
    } else {
      throw new Error(res.message || '게시글 작성 실패');
    }
  };

  // 게시글 삭제
  const handleDeletePost = async (postId) => {
    const res = await request("/sns/deletePost", {
      method: "POST",
      body: { postId }
    });
    
    if (res.result === "success") {
      await fetchPosts(); // 목록 새로고침
    } else {
      throw new Error(res.message || '게시글 삭제 실패');
    }
  };

  // 댓글 추가
  const handleAddComment = async (postId, commentData) => {
    const res = await request("/sns/addComment", {
      method: "POST",
      body: {
        postId,
        author: commentData.author,
        content: commentData.content
      }
    });
    
    if (res.result === "success") {
      // 댓글 목록 다시 불러오기
      const commentsRes = await request("/sns/getComments", {
        method: "POST",
        body: { postId }
      });
      
      if (commentsRes.result === "success") {
        setCommentsData({
          ...commentsData(),
          [postId]: commentsRes.data || []
        });
      }
      
      // 게시글 목록도 새로고침 (commentCount 업데이트)
      await fetchPosts();
    } else {
      throw new Error(res.message || '댓글 작성 실패');
    }
  };

  // 댓글 토글
  const toggleComments = async (postId) => {
    const newExpanded = new Set(expandedComments());
    if (newExpanded.has(postId)) {
      newExpanded.delete(postId);
    } else {
      newExpanded.add(postId);
      
      // 댓글이 아직 로드되지 않았으면 가져오기
      if (!commentsData()[postId]) {
        try {
          const res = await request("/sns/getComments", {
            method: "POST",
            body: { postId }
          });
          
          if (res.result === "success") {
            setCommentsData({
              ...commentsData(),
              [postId]: res.data || []
            });
          }
        } catch (err) {
          console.error("댓글 로드 실패:", err);
        }
      }
    }
    setExpandedComments(newExpanded);
  };

  onMount(() => {
    fetchPosts();
  });

  return (
    <div style={{ "max-width": "600px", margin: "0 auto", padding: "10px" }}>
      {/* 헤더 */}
      <header style={{ 
        "border-bottom": "3px solid black", 
        "padding-bottom": "10px",
        "margin-bottom": "20px",
        "display": "flex",
        "justify-content": "space-between",
        "align-items": "center"
      }}>
        <h1 style={{ margin: 0, "font-size": "24px", "font-weight": "900" }}>MUSCLE.SNS</h1>
        <button 
          onClick={fetchPosts}
          style={{
            "border": "2px solid black",
            "background": "white",
            "font-weight": "bold",
            "cursor": "pointer",
            "padding": "5px 10px"
          }}
        >
          REFRESH
        </button>
      </header>

      {/* 게시글 작성 폼 */}
      <PostForm onSubmit={handleCreatePost} />

      {/* 로딩 상태 */}
      {loading() && (
        <div style={{ "text-align": "center", padding: "20px", border: "1px dashed black" }}>
          Loading...
        </div>
      )}

      {/* 게시글 리스트 */}
      <div style={{ display: "flex", "flex-direction": "column", gap: "15px" }}>
        <For each={posts()}>
          {(post) => (
            <article style={{ 
              border: "2px solid black", 
              padding: "15px",
              "background-color": "white"
            }}>
              <div style={{ 
                "border-bottom": "1px solid black", 
                "padding-bottom": "8px", 
                "margin-bottom": "10px",
                display: "flex",
                "justify-content": "space-between",
                "font-family": "monospace"
              }}>
                <span style={{ "font-weight": "bold", "font-size": "1.1em" }}>@{post.author}</span>
                <span>{post.time}</span>
              </div>
              
              <div style={{ "line-height": "1.5", "font-size": "16px", "margin-bottom": "15px" }}>
                {post.content}
              </div>

              <PostActions 
                postId={post.id}
                commentCount={post.commentCount}
                onDelete={handleDeletePost}
                onToggleComments={() => toggleComments(post.id)}
              />

              {/* 댓글 섹션 */}
              {expandedComments().has(post.id) && commentsData()[post.id] && (
                <div style={{ "margin-top": "15px", "padding-top": "15px", "border-top": "1px dashed black" }}>
                  <CommentSection 
                    comments={commentsData()[post.id]} 
                    onAddComment={(commentData) => handleAddComment(post.id, commentData)}
                  />
                </div>
              )}
            </article>
          )}
        </For>
      </div>
      
      {/* 데이터가 없을 때 안내 */}
      {!loading() && posts().length === 0 && (
        <div style={{ "text-align": "center", "margin-top": "30px" }}>
          <p>게시글이 없습니다. 위에서 게시글을 작성해보세요!</p>
        </div>
      )}
    </div>
  );
}

export default Feed;