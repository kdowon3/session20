import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth"
import { collection, getDocs, query, orderBy, addDoc, doc, getDoc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);


// 🔹 게시글 목록 가져오기 (Read)
export const getPosts = async () => {
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("🔥 Firestore에서 게시글 불러오기 오류:", error);
    return [];
  }
};

// 🔹 특정 게시글 가져오기 (Read)
export const getPostById = async (id) => {
  try {
    const postRef = doc(db, "posts", id);
    const postSnap = await getDoc(postRef);

    if (postSnap.exists()) {
      return { id: postSnap.id, ...postSnap.data() };
    } else {
      return null; // 문서가 존재하지 않음
    }
  } catch (error) {
    console.error("🔥 Firestore에서 게시글 가져오기 오류:", error);
    return null;
  }
};

// 🔹 게시글 추가 (이미지 포함)
export const addPost = async (title, content, imageUrl = "") => {
  try {
    const user = auth.currentUser; // ✅ 현재 로그인한 사용자 가져오기
    if (!user) {
      throw new Error("로그인이 필요합니다.");
    }

    const docRef = await addDoc(collection(db, "posts"), {
      title,
      content,
      imageUrl, // ✅ Firestore에 imageUrl 저장 추가
      createdAt: new Date(),
      userId: user.uid,
    });
    console.log("📌 Firestore에 저장된 게시글:", { id: docRef.id, title, content, imageUrl, userId: user.uid });
    return docRef.id;
  } catch (error) {
    console.error("🔥 Firestore에 게시글 추가 중 오류 발생:", error);
  }
};

/// 🔹 게시글 수정 (Update)
export const updatePost = async (id, title, content, imageUrl = null) => {
  try {
    const postRef = doc(db, "posts", id);
    
    // 업데이트할 데이터 객체 생성
    const updatedData = {
      title,
      content,
    };

    // 새로운 이미지가 있을 경우 imageUrl도 추가
    if (imageUrl !== null) {
      updatedData.imageUrl = imageUrl;
    }

    await updateDoc(postRef, updatedData);
    console.log(`✅ Firestore에서 게시글 업데이트 완료 (ID: ${id})`);
  } catch (error) {
    console.error("🔥 Firestore에서 게시글 업데이트 오류:", error);
  }
};
// 🔹 게시글 삭제 (Delete)
export const deletePost = async (id) => {
  try {
    const postRef = doc(db, "posts", id);
    await deleteDoc(postRef);
    console.log(`✅ Firestore에서 게시글 삭제 완료 (ID: ${id})`);
  } catch (error) {
    console.error("🔥 Firestore에서 게시글 삭제 오류:", error);
  }
};

// 🔹 Firestore `users` 컬렉션에 사용자 정보 저장
export const createUserProfile = async (user) => {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    const { email, displayName } = user;
    const createdAt = new Date();

    try {
      await setDoc(userRef, { email, displayName, createdAt });
      console.log("✅ Firestore에 유저 정보 저장 완료");
    } catch (error) {
      console.error("🔥 Firestore 유저 정보 저장 오류:", error);
    }
  }
};


// 🔹 Firestore에서 유저 정보 가져오기
export const getUserProfile = async (uid) => {
  if (!uid) return null;

  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    return null;
  }
};


// 🔹 Google 로그인 함수
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    console.log("✅ Google 로그인 성공:", result.user);
    return result.user;
  } catch (error) {
    console.error("🔥 Google 로그인 오류:", error);
  }
};


// 🔹 로그아웃 함수
export const logout = async () => {
  try {
    await signOut(auth);
    console.log("✅ 로그아웃 성공");
  } catch (error) {
    console.error("🔥 로그아웃 오류:", error);
  }
};