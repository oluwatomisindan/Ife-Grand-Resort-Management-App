import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { auth, db, functions } from '../firebase';
import { UserRole } from '../types';

export interface UserData {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
}

/**
 * Sign up a new user (Super Admin only via sign-up page)
 */
export const signUp = async (
  email: string, 
  password: string, 
  name: string,
  role: UserRole = UserRole.SUPER_ADMIN
): Promise<UserData> => {
  try {
    // Create Firebase Auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      name,
      role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
      createdAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', user.uid), userData);

    return userData;
  } catch (error: any) {
    console.error('Sign up error:', error);
    throw new Error(error.message || 'Failed to create account');
  }
};

/**
 * Sign in existing user
 */
export const signIn = async (email: string, password: string): Promise<UserData> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    return userDoc.data() as UserData;
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw new Error(error.message || 'Failed to sign in');
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error('Sign out error:', error);
    throw new Error(error.message || 'Failed to sign out');
  }
};

/**
 * Create a new user via Cloud Function (for User Management - Admin only)
 * This preserves the current admin's session by using Firebase Admin SDK server-side
 */
export const createUser = async (
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<UserData> => {
  try {
    // Call the Cloud Function
    const createUserFunction = httpsCallable(functions, 'createUser');
    
    const result = await createUserFunction({
      email,
      password,
      name,
      role
    });

    const data = result.data as { success: boolean; user: UserData };
    
    if (!data.success) {
      throw new Error('Failed to create user');
    }

    return data.user;
  } catch (error: any) {
    console.error('Create user error:', error);
    
    // Handle Firebase Functions errors
    if (error.code === 'functions/unauthenticated') {
      throw new Error('You must be signed in to create users');
    }
    
    if (error.code === 'functions/permission-denied') {
      throw new Error('Only Super Admins can create users');
    }
    
    if (error.code === 'functions/already-exists') {
      throw new Error('A user with this email already exists');
    }
    
    if (error.code === 'functions/invalid-argument') {
      throw new Error(error.message || 'Invalid user data');
    }

    throw new Error(error.message || 'Failed to create user');
  }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      return null;
    }

    return userDoc.data() as UserData;
  } catch (error: any) {
    console.error('Get user data error:', error);
    return null;
  }
};
