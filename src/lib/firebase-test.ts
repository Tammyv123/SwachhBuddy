import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const testFirebaseConnection = async () => {
    try {
        console.log("Testing Firebase connection...");

        // Try to read from a test document
        const testRef = doc(db, "test", "connection");
        const testSnap = await getDoc(testRef);

        console.log("Test document exists:", testSnap.exists());

        // Try to write a test document
        await setDoc(testRef, {
            timestamp: new Date(),
            test: "Firebase connection test"
        });

        console.log("Firebase connection test successful!");
        return true;
    } catch (error) {
        console.error("Firebase connection test failed:", error);
        return false;
    }
};