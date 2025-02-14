import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, getDocs, query, orderBy, addDoc, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";


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

// 🔹 게시글 추가 (Create)
export const addPost = async (title, content) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      title,
      content,
      createdAt: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("🔥 Firestore에 게시글 추가 중 오류 발생:", error);
  }
};

// 🔹 게시글 수정 (Update)
export const updatePost = async (id, title, content) => {
  try {
    const postRef = doc(db, "posts", id);
    await updateDoc(postRef, {
      title,
      content,
    });
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