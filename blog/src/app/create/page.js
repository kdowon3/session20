"use client";

import { useState } from "react";
import { addPost } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export default function Create() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }
    await addPost(title, content);
    router.push("/");
  };

  return (
    <div className="container">
      <h1 className="title">새 글 작성</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label className="form-label">제목</label>
          <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">내용</label>
          <textarea className="form-textarea" value={content} onChange={(e) => setContent(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">등록하기</button>
      </form>
    </div>
  );
}
