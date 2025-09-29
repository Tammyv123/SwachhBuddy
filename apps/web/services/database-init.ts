import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Initialize Firestore database with basic structure
export const initializeDatabase = async (userId: string, userEmail: string) => {
    console.log("Initializing database for user:", userId);

    try {
        // Create user document with initial data
        const userData = {
            uid: userId,
            email: userEmail,
            coins: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        console.log("Creating user document...");
        await setDoc(doc(db, "users", userId), userData);
        console.log("User document created successfully");

        // Create initial referral document for the user
        const referralData = {
            userId: userId,
            referralCode: generateSimpleCode(),
            totalReferrals: 0,
            totalEarnings: 0,
            pendingReferrals: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        console.log("Creating referral document...");
        await setDoc(doc(db, "referrals", userId), referralData);
        console.log("Referral document created successfully");

        return {
            success: true,
            referralCode: referralData.referralCode
        };

    } catch (error) {
        console.error("Error initializing database:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

// Generate a simple 6-character code
const generateSimpleCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// Check if database is initialized
export const checkDatabaseStatus = async () => {
    try {
        console.log("Checking database status...");

        // Check if users collection exists
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersCount = usersSnapshot.size;

        // Check if referrals collection exists
        const referralsSnapshot = await getDocs(collection(db, "referrals"));
        const referralsCount = referralsSnapshot.size;

        console.log(`Database status - Users: ${usersCount}, Referrals: ${referralsCount}`);

        return {
            users: usersCount,
            referrals: referralsCount,
            initialized: usersCount > 0 && referralsCount > 0
        };

    } catch (error) {
        console.error("Error checking database status:", error);
        return {
            users: 0,
            referrals: 0,
            initialized: false,
            error: error.message
        };
    }
};

// Create a test referral code manually
export const createTestReferralCode = async (userId: string, code: string = "TEST123") => {
    try {
        const referralData = {
            userId: userId,
            referralCode: code,
            totalReferrals: 0,
            totalEarnings: 0,
            pendingReferrals: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await setDoc(doc(db, "referrals", userId), referralData);
        console.log(`Test referral code ${code} created for user ${userId}`);

        return { success: true, code };
    } catch (error) {
        console.error("Error creating test referral code:", error);
        return { success: false, error: error.message };
    }
};