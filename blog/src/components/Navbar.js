"use client";

import Link from "next/link";
import { auth, logout } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">My Blog</Link>
        <div className="navbar-links">
          {user ? (
            <>
              <span className="user-email">{user.email} 님 환영합니다</span>
              <button className="btn btn-danger" onClick={logout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn btn-primary">로그인</Link>
              <Link href="/auth/signup" className="btn btn-secondary">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
