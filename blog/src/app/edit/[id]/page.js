"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPostById, updatePost, deletePost } from "../../../lib/firebase";

export default function Edit() {
  const { id } = useParams(); // ✅ useParams()로 ID 가져오기
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      if (!id) return;
      const post = await getPostById(id);
      if (!post) {
        alert("해당 게시글이 존재하지 않습니다.");
        router.push("/");
        return;
      }
      setTitle(post.title);
      setContent(post.content);
      setLoading(false);
    }
    fetchPost();
  }, [id, router]);

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }
    await updatePost(id, title, content);
    router.push("/");
  };

  const handleDelete = async () => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      await deletePost(id);
      router.push("/");
    }
  };

  return loading ? (
    <p className="loading">🔥 불러오는 중...</p>
  ) : (
    <div className="container">
      <h1 className="title">게시글 수정</h1>
      <div className="form">
        <label>제목</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        <label>내용</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} />
        <button onClick={handleUpdate} className="btn">수정하기</button>
        <button onClick={handleDelete} className="btn btn-danger">삭제하기</button>
      </div>
    </div>
  );
}
