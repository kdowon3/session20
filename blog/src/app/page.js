"use client";

import { useEffect, useState } from "react";
import { getPosts } from "../lib/firebase";
import Link from "next/link";

export default function Home() {
  const [posts, setPosts] = useState([]);

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
      <ul className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id} className="post-item">
              <Link href={`/edit/${post.id}`}>
                <strong>{post.title}</strong>
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
