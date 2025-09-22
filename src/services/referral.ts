import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  increment,
  writeBatch,
  enableNetwork,
  disableNetwork
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// Helper function to ensure Firestore is online
const ensureFirestoreOnline = async () => {
  try {
    await enableNetwork(db);
    console.log('Firestore network enabled');
  } catch (error) {
    console.warn('Network already enabled or failed to enable:', error);
  }
}; export interface ReferralData {
  userId: string;
  referralCode: string;
  totalReferrals: number;
  totalEarnings: number;
  pendingReferrals: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  refereeId: string;
  referralCode: string;
  status: 'pending' | 'completed';
  coinsAwarded: number;
  createdAt: Date;
  completedAt?: Date;
}

// Generate a unique referral code for a user
export const generateReferralCode = async (userId: string): Promise<string> => {
  console.log("generateReferralCode called with userId:", userId);
  try {
    // Ensure Firestore is online
    await ensureFirestoreOnline();

    // Check if user already has a referral code
    const userReferralRef = doc(db, "referrals", userId);
    console.log("Checking existing referral document...");
    const userReferralSnap = await getDoc(userReferralRef);

    if (userReferralSnap.exists()) {
      const existingCode = userReferralSnap.data().referralCode;
      console.log("Found existing referral code:", existingCode);
      return existingCode;
    }

    console.log("No existing code found, generating new one...");
    // Generate a new unique code
    let referralCode: string;
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      attempts++;
      // Generate a 6-character alphanumeric code
      referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      console.log(`Generated candidate code (attempt ${attempts}):`, referralCode);

      // Check if this code already exists
      const existingCodeQuery = query(
        collection(db, "referrals"),
        where("referralCode", "==", referralCode)
      );
      const existingCodeSnap = await getDocs(existingCodeQuery);

      if (existingCodeSnap.empty) {
        isUnique = true;
        console.log("Code is unique!");
      } else {
        console.log("Code already exists, trying again...");
      }
    }

    if (!isUnique) {
      throw new Error("Failed to generate unique referral code after maximum attempts");
    }

    // Create referral document for the user
    const referralData: ReferralData = {
      userId,
      referralCode: referralCode!,
      totalReferrals: 0,
      totalEarnings: 0,
      pendingReferrals: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log("Creating referral document:", referralData);
    await setDoc(userReferralRef, referralData);
    console.log("Referral document created successfully");
    return referralCode!;
  } catch (error) {
    console.error("Error generating referral code:", error);

    // If offline error, return a temporary code
    if (error.code === 'failed-precondition' || error.message.includes('offline')) {
      console.log("Firebase is offline, generating temporary code");
      const tempCode = `TEMP${userId.substring(0, 4).toUpperCase()}`;
      return tempCode;
    }

    throw new Error("Failed to generate referral code");
  }
};

// Get referral statistics for a user
export const getReferralStats = async (userId: string) => {
  try {
    await ensureFirestoreOnline();

    const userReferralRef = doc(db, "referrals", userId);
    const userReferralSnap = await getDoc(userReferralRef);

    if (userReferralSnap.exists()) {
      const data = userReferralSnap.data();
      return {
        totalReferrals: data.totalReferrals || 0,
        totalEarnings: data.totalEarnings || 0,
        pendingReferrals: data.pendingReferrals || 0
      };
    }

    return {
      totalReferrals: 0,
      totalEarnings: 0,
      pendingReferrals: 0
    };
  } catch (error) {
    console.error("Error getting referral stats:", error);

    // Return default stats if offline
    if (error.code === 'failed-precondition' || error.message.includes('offline')) {
      console.log("Firebase is offline, returning default stats");
      return {
        totalReferrals: 0,
        totalEarnings: 0,
        pendingReferrals: 0
      };
    }

    throw new Error("Failed to get referral statistics");
  }
};

// Validate and get referrer info by referral code
export const validateReferralCode = async (referralCode: string) => {
  console.log("validateReferralCode called with:", referralCode);
  try {
    await ensureFirestoreOnline();

    const upperCaseCode = referralCode.toUpperCase();
    console.log("Searching for referral code:", upperCaseCode);

    const referralQuery = query(
      collection(db, "referrals"),
      where("referralCode", "==", upperCaseCode)
    );
    const referralSnap = await getDocs(referralQuery);

    console.log("Query result - found documents:", referralSnap.size);

    if (!referralSnap.empty) {
      const referralDoc = referralSnap.docs[0];
      const data = referralDoc.data();
      console.log("Found matching referral document:", data);
      return {
        isValid: true,
        referrerId: data.userId,
        referralCode: data.referralCode
      };
    }

    console.log("No matching referral code found");
    return {
      isValid: false,
      referrerId: null,
      referralCode: null
    };
  } catch (error) {
    console.error("Error validating referral code:", error);
    return {
      isValid: false,
      referrerId: null,
      referralCode: null
    };
  }
};

// Process referral when new user signs up with referral code
export const processReferralSignup = async (
  newUserId: string,
  referralCode: string
): Promise<boolean> => {
  console.log("processReferralSignup called:", { newUserId, referralCode });
  try {
    await ensureFirestoreOnline();

    const validation = await validateReferralCode(referralCode);
    console.log("Referral code validation result:", validation);

    if (!validation.isValid || !validation.referrerId) {
      console.log("Invalid referral code or no referrer found");
      return false;
    }

    // Create referral record
    const referralRecordRef = doc(collection(db, "referralRecords"));
    const referralRecord: ReferralRecord = {
      id: referralRecordRef.id,
      referrerId: validation.referrerId,
      refereeId: newUserId,
      referralCode: validation.referralCode!,
      status: 'pending',
      coinsAwarded: 0,
      createdAt: new Date()
    };

    console.log("Creating referral record:", referralRecord);
    await setDoc(referralRecordRef, referralRecord);
    console.log("Referral record created successfully");

    // Update referrer's pending referrals
    const referrerRef = doc(db, "referrals", validation.referrerId);
    console.log("Updating referrer pending count for:", validation.referrerId);
    await updateDoc(referrerRef, {
      pendingReferrals: increment(1),
      updatedAt: new Date()
    });
    console.log("Referrer pending count updated");

    return true;
  } catch (error) {
    console.error("Error processing referral signup:", error);
    return false;
  }
};// Award coins when referred user completes their first action (QR scan)
export const completeReferralReward = async (userId: string): Promise<boolean> => {
  console.log("completeReferralReward called for userId:", userId);
  try {
    await ensureFirestoreOnline();

    // Find pending referral record for this user
    console.log("Searching for pending referral records...");
    const referralQuery = query(
      collection(db, "referralRecords"),
      where("refereeId", "==", userId),
      where("status", "==", "pending")
    );
    const referralSnap = await getDocs(referralQuery);

    console.log("Found referral records:", referralSnap.size);

    if (referralSnap.empty) {
      console.log("No pending referral found for user:", userId);
      return false; // No pending referral found
    }

    const referralDoc = referralSnap.docs[0];
    const referralData = referralDoc.data() as ReferralRecord;
    console.log("Processing referral reward for:", referralData);

    const batch = writeBatch(db);

    // Update referral record to completed
    batch.update(referralDoc.ref, {
      status: 'completed',
      coinsAwarded: 20, // 10 for each user
      completedAt: new Date()
    });

    // Update referrer's stats
    const referrerRef = doc(db, "referrals", referralData.referrerId);
    batch.update(referrerRef, {
      totalReferrals: increment(1),
      totalEarnings: increment(10),
      pendingReferrals: increment(-1),
      updatedAt: new Date()
    });

    // Award coins to both users
    const referrerUserRef = doc(db, "users", referralData.referrerId);
    const refereeUserRef = doc(db, "users", referralData.refereeId);

    console.log("Awarding 10 coins to referrer:", referralData.referrerId);
    console.log("Awarding 10 coins to referee:", referralData.refereeId);

    batch.update(referrerUserRef, {
      coins: increment(10)
    });

    batch.update(refereeUserRef, {
      coins: increment(10)
    });

    console.log("Committing batch update...");
    await batch.commit();
    console.log("Referral reward completed successfully!");

    return true;
  } catch (error) {
    console.error("Error completing referral reward:", error);
    return false;
  }
};

// Get user's coin balance
export const getUserCoins = async (userId: string): Promise<number> => {
  try {
    await ensureFirestoreOnline();

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().coins || 0;
    }

    return 0;
  } catch (error) {
    console.error("Error getting user coins:", error);

    // Return 0 if offline
    if (error.code === 'failed-precondition' || error.message.includes('offline')) {
      console.log("Firebase is offline, returning 0 coins");
      return 0;
    }

    return 0;
  }
};

// Update user's coin balance
export const updateUserCoins = async (userId: string, coinsToAdd: number): Promise<void> => {
  try {
    await ensureFirestoreOnline();

    const userRef = doc(db, "users", userId);
    // Try to increment coins. If the document doesn't exist, fall back to set with merge
    try {
      await updateDoc(userRef, {
        coins: increment(coinsToAdd)
      });
    } catch (innerErr: unknown) {
      console.warn('updateDoc failed, attempting setDoc with merge:', innerErr);
      // If the failure is because the document does not exist, create or merge the field
      await setDoc(userRef, { coins: increment(coinsToAdd) }, { merge: true });
    }
  } catch (error) {
    console.error("Error updating user coins:", error);

    // Don't throw error if offline, just log it
    const e = error as unknown;
    // Safely extract message and code from unknown error
    let message = String(e);
    let code: string | undefined = undefined;

    if (typeof e === 'object' && e !== null) {
      const obj = e as Record<string, unknown>;
      if (typeof obj.message === 'string') message = obj.message;
      if (typeof obj.code === 'string') code = obj.code;
    }

    if (code === 'failed-precondition' || message.toLowerCase().includes('offline')) {
      console.log("Firebase is offline, coin update will be synced when online");
      return;
    }

    // If we couldn't update for another reason, surface a descriptive error to caller
    throw new Error("Failed to update coins: " + message);
  }
};

// Get user's points balance
export const getUserPoints = async (userId: string): Promise<number> => {
  try {
    await ensureFirestoreOnline();

    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data().points || 0;
    }

    return 0;
  } catch (error: unknown) {
    console.error("Error getting user points:", error);

    // Return 0 if offline
    if (typeof error === 'object' && error !== null) {
      const e = error as Record<string, unknown>;
      const code = typeof e.code === 'string' ? e.code : undefined;
      const message = typeof e.message === 'string' ? e.message : '';
      if (code === 'failed-precondition' || message.includes('offline')) {
        console.log("Firebase is offline, returning 0 points");
        return 0;
      }
    }

    return 0;
  }
};

// Update user's points balance (increment). Similar pattern to updateUserCoins.
export const updateUserPoints = async (userId: string, pointsToAdd: number): Promise<void> => {
  try {
    await ensureFirestoreOnline();

    const userRef = doc(db, "users", userId);
    try {
      await updateDoc(userRef, {
        points: increment(pointsToAdd)
      });
    } catch (innerErr: unknown) {
      console.warn('updateDoc for points failed, attempting setDoc with merge:', innerErr);
      await setDoc(userRef, { points: increment(pointsToAdd) }, { merge: true });
    }
  } catch (error: unknown) {
    console.error("Error updating user points:", error);

    let message = String(error);
    let code: string | undefined = undefined;

    if (typeof error === 'object' && error !== null) {
      const obj = error as Record<string, unknown>;
      if (typeof obj.message === 'string') message = obj.message;
      if (typeof obj.code === 'string') code = obj.code;
    }

    if (code === 'failed-precondition' || message.toLowerCase().includes('offline')) {
      console.log("Firebase is offline, points update will be synced when online");
      return;
    }

    throw new Error("Failed to update points: " + message);
  }
};

// Convenience: update both coins and points by the same delta (useful when awarding points as coins)
export const updateUserCoinsAndPoints = async (userId: string, delta: number): Promise<void> => {
  // Perform both updates in parallel; each function already handles doc-not-exist by using set with merge
  await Promise.all([updateUserCoins(userId, delta), updateUserPoints(userId, delta)]);
};