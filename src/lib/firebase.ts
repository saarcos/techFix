import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const firebaseConfig = {
  apiKey: "AIzaSyC-TEknIwK6C5-ceT2JGmJdBpMJA4ohpKM",
  authDomain: "imagestechfix.firebaseapp.com",
  projectId: "imagestechfix",
  storageBucket: "imagestechfix.appspot.com",
  messagingSenderId: "67351534237",
  appId: "1:67351534237:web:45e1f8ff6e8f6a9334d274"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };

// Función para subir imagen
export async function uploadImage(file: File): Promise<string> {
  const storageRef = ref(storage, `images/${uuidv4()}`);
  const snapshot = await uploadBytes(storageRef, file);
  const url = await getDownloadURL(snapshot.ref);
  return url;
}