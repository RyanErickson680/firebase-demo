import { db } from "../firebase";
import { collection, addDoc, getDoc, getDocs } from "firebase/firestore";

export const createUser = async ({ email, name }) => {
  // Validate inputs
  if (!email || !name) {
    console.error("Missing required field");
    return Promise.reject(new Error("Missing required fields for createUser"));
  }

  try {
    // Adds new doc to "users" collection
    const docRef = await addDoc(collection(db, "users"), {
      email,
      first_name: name,
    });
    // docRef is a reference to the new document, contains info like the assigned ID
    return docRef;
  } catch (error) {
    console.error("Error adding document:", error);
    return Promise.reject(error);
  }
};

export const getUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'users')); // Use getDocs for collections
    const users = [];
    
    querySnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() }); // Add document data and ID to users array
    });
    return users;
  } catch (error) {
    console.error("Error getting users", error);
    return Promise.reject(error);
  }
};