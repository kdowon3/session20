"use client";

import { useState } from "react";
import { auth, createUserProfile } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Firestore `users` 컬렉션에 저장
      await createUserProfile(user);

      alert("회원가입 성공! 로그인 페이지로 이동합니다.");
      router.push("/auth/login");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="container">
      <h1>회원가입</h1>
      <form onSubmit={handleSignUp} className="form">
        <input type="email" placeholder="이메일" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="비밀번호" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button type="submit" className="btn">가입하기</button>
      </form>
    </div>
  );
}
