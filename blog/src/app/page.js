"use client";

import { useEffect, useState } from "react";
import { getPosts, getUserProfile } from "@/lib/firebase";
import { auth } from "@/lib/firebase";
import Link from "next/link";
import { onAuthStateChanged } from "firebase/auth";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchUserData(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchUserData = async (uid) => {
    const data = await getUserProfile(uid);
    setUserInfo(data);
  };

  useEffect(() => {
    async function fetchPosts() {
      const data = await getPosts();
      setPosts(data);
    }
    fetchPosts();
  }, []);

  return (
    <div className="container">
      <h1 className="title">블로그</h1>
      {user && userInfo && <p className="user-email">환영합니다, {userInfo.email}님!</p>}
      <ul className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id} className="post-item">
              <Link href={`/edit/${post.id}`} className="post-link">
                <div className="post-content">
                  <strong>{post.title}</strong>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p className="empty">게시글이 없습니다. 새 글을 작성해보세요!</p>
        )}
      </ul>
      <Link href="/create" className="btn">새 글 작성</Link>
    </div>
  );
}
