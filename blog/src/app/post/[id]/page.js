"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getPostById, getUserProfile } from "../../../lib/firebase";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function Post() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [post, setPost] = useState(null);
  const [authorEmail, setAuthorEmail] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🔹 게시글 데이터 가져오기
  useEffect(() => {
    async function fetchPost() {
      const fetchedPost = await getPostById(id);
      if (!fetchedPost) {
        alert("게시글이 존재하지 않습니다.");
        router.push("/");
        return;
      }
      setPost(fetchedPost);

      // 작성자 정보 가져오기
      if (fetchedPost.userId) {
        const userProfile = await getUserProfile(fetchedPost.userId);
        setAuthorEmail(userProfile?.email || "알 수 없음");
      }

      setLoading(false);
    }
    if (id) fetchPost();
  }, [id, router]);

  return (
    <div className="container">
      {loading ? (
        <p className="loading">🔥 불러오는 중...</p>
      ) : (
        <div className="post-view">
          <h1 className="title">{post.title}</h1>
          <p className="author-info">작성자: {authorEmail}</p>
          {post.imageUrl && <img src={post.imageUrl} alt="게시글 이미지" className="post-image" />}
          <p className="content">{post.content}</p>

          {/* 🔹 로그인한 사용자가 작성자라면 수정/삭제 버튼 표시 */}
          {user && user.uid === post.userId && (
            <div className="actions">
              <Link href={`/edit/${id}`} className="btn btn-primary">수정하기</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
