"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPostById, updatePost, deletePost, getUserProfile } from "../../../lib/firebase";
import { uploadImage } from "../../../lib/storage";

export default function Edit() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [authorEmail, setAuthorEmail] = useState("");
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      async function fetchPost() {
        const post = await getPostById(id);
        if (!post) {
          alert("해당 게시글이 존재하지 않습니다.");
          router.push("/");
          return;
        }
        setTitle(post.title);
        setContent(post.content);
        setImageUrl(post.imageUrl || "");

        // 작성자 정보 가져오기
        if (post.userId) {
          const userProfile = await getUserProfile(post.userId);
          setAuthorEmail(userProfile?.email || "알 수 없음");
        }
        setLoading(false);
      }
      if (id) fetchPost();
    }, [id, router]);
  
    const handleUpdate = async () => {
      if (!title.trim() || !content.trim()) {
        alert("제목과 내용을 입력하세요.");
        return;
      }
      let newImageUrl = imageUrl;
      if (image) {
        newImageUrl = await uploadImage(image);
      }
      await updatePost(id, title, content, newImageUrl);
      alert("게시글이 수정되었습니다.");
      router.push("/");
    };
  
    const handleDelete = async () => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        await deletePost(id);
        alert("게시글이 삭제되었습니다.");
        router.push("/");
      }
    };
  
    return (
      <div className="container">
        <h1 className="title">게시글 수정</h1>
        {loading ? (
          <p className="loading">🔥 불러오는 중...</p>
        ) : (
          <div className="form">
            <p className="author-info">작성자: {authorEmail}</p>
            <div className="form-group">
              <label className="form-label">제목</label>
              <input type="text" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">내용</label>
              <textarea className="form-textarea" value={content} onChange={(e) => setContent(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">이미지</label>
              {imageUrl && <img src={imageUrl} alt="게시글 이미지" className="post-image" style={{ width: "100px", height: "100px", objectFit: "cover" }} />}
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
            </div>
            <div className="actions">
              <button onClick={handleUpdate} className="btn btn-primary">수정하기</button>
              <button onClick={handleDelete} className="btn btn-danger">삭제하기</button>
            </div>
          </div>
        )}
      </div>
    );
}
