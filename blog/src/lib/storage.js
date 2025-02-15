import { storage } from "./firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 🔹 이미지 업로드 함수
export const uploadImage = async (file) => {
  if (!file) return null;

  try {
    const storageRef = ref(storage, `images/${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL; // ✅ 업로드 후 다운로드 URL 반환
  } catch (error) {
    console.error("🔥 이미지 업로드 실패:", error);
    return null;
  }
};
