import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./config";

// Chat History Services
export const chatService = {
  // Save a chat message
  async saveMessage(userId, message, response, timestamp = null) {
    try {
      const docRef = await addDoc(collection(db, "chatHistory"), {
        userId,
        message,
        response,
        timestamp: timestamp || serverTimestamp(),
        createdAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error saving message:", error);
      throw error;
    }
  },

  // Get chat history for a user
  async getChatHistory(userId, limitCount = 50) {
    try {
      const q = query(
        collection(db, "chatHistory"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting chat history:", error);
      throw error;
    }
  },

  // Delete a specific chat message
  async deleteMessage(messageId) {
    try {
      await deleteDoc(doc(db, "chatHistory", messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  },

  // Clear all chat history for a user
  async clearChatHistory(userId) {
    try {
      const q = query(
        collection(db, "chatHistory"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error clearing chat history:", error);
      throw error;
    }
  }
};

// User Profile Services
export const userService = {
  // Save or update user profile
  async saveUserProfile(userId, profileData) {
    try {
      const userRef = doc(db, "userProfiles", userId);
      await updateDoc(userRef, {
        ...profileData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      // If document doesn't exist, create it
      if (error.code === 'not-found') {
        await addDoc(collection(db, "userProfiles"), {
          userId,
          ...profileData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        console.error("Error saving user profile:", error);
        throw error;
      }
    }
  },

  // Get user profile
  async getUserProfile(userId) {
    try {
      const q = query(
        collection(db, "userProfiles"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error getting user profile:", error);
      throw error;
    }
  },

  // Update user preferences
  async updateUserPreferences(userId, preferences) {
    try {
      const q = query(
        collection(db, "userProfiles"),
        where("userId", "==", userId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userRef = doc(db, "userProfiles", querySnapshot.docs[0].id);
        await updateDoc(userRef, {
          preferences,
          updatedAt: serverTimestamp()
        });
      }
    } catch (error) {
      console.error("Error updating user preferences:", error);
      throw error;
    }
  }
};

// Medical Reports Services
export const reportService = {
  // Save a medical report
  async saveReport(userId, reportData) {
    try {
      const docRef = await addDoc(collection(db, "medicalReports"), {
        userId,
        ...reportData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error("Error saving report:", error);
      throw error;
    }
  },

  // Get reports for a user
  async getUserReports(userId, limitCount = 20) {
    try {
      const q = query(
        collection(db, "medicalReports"),
        where("userId", "==", userId),
        orderBy("createdAt", "desc"),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting user reports:", error);
      throw error;
    }
  },

  // Get a specific report
  async getReport(reportId) {
    try {
      const docRef = doc(db, "medicalReports", reportId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error("Error getting report:", error);
      throw error;
    }
  },

  // Update a report
  async updateReport(reportId, updateData) {
    try {
      const reportRef = doc(db, "medicalReports", reportId);
      await updateDoc(reportRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error updating report:", error);
      throw error;
    }
  },

  // Delete a report
  async deleteReport(reportId) {
    try {
      await deleteDoc(doc(db, "medicalReports", reportId));
    } catch (error) {
      console.error("Error deleting report:", error);
      throw error;
    }
  }
};

// Analytics Services
export const analyticsService = {
  // Track user activity
  async trackActivity(userId, activityType, data = {}) {
    try {
      await addDoc(collection(db, "userAnalytics"), {
        userId,
        activityType,
        data,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Error tracking activity:", error);
      // Don't throw error for analytics failures
    }
  },

  // Get user analytics
  async getUserAnalytics(userId, days = 30) {
    try {
      const q = query(
        collection(db, "userAnalytics"),
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
        limit(100)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error("Error getting user analytics:", error);
      throw error;
    }
  }
};
