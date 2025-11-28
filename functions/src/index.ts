import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
admin.initializeApp();

// Define UserRole enum to match client-side
enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  FRONT_DESK = 'Front Desk',
  HOUSEKEEPING = 'Housekeeping',
  MAINTENANCE = 'Maintenance',
  RESTAURANT = 'Restaurant',
  ACCOUNTING = 'Accounting'
}

interface CreateUserRequest {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

interface UserData {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  createdAt: string;
}

/**
 * Cloud Function to create a new user
 * Only callable by authenticated Super Admin users
 */
export const createUser = functions.https.onCall(async (data: CreateUserRequest, context) => {
  // Check if user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'User must be authenticated to create users'
    );
  }

  // Get the caller's user document to check their role
  const callerUid = context.auth.uid;
  const callerDoc = await admin.firestore().collection('users').doc(callerUid).get();
  
  if (!callerDoc.exists) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'User data not found'
    );
  }

  const callerData = callerDoc.data();
  
  // Check if caller is Super Admin
  if (callerData?.role !== UserRole.SUPER_ADMIN) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only Super Admins can create users'
    );
  }

  // Validate input data
  if (!data.email || !data.password || !data.name || !data.role) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Missing required fields: email, password, name, or role'
    );
  }

  if (data.password.length < 6) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Password must be at least 6 characters'
    );
  }

  // Validate role
  if (!Object.values(UserRole).includes(data.role)) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Invalid user role'
    );
  }

  try {
    // Create user in Firebase Auth using Admin SDK
    const userRecord = await admin.auth().createUser({
      email: data.email,
      password: data.password,
      displayName: data.name
    });

    // Create user document in Firestore
    const userData: UserData = {
      uid: userRecord.uid,
      email: data.email,
      name: data.name,
      role: data.role,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`,
      createdAt: new Date().toISOString()
    };

    await admin.firestore().collection('users').doc(userRecord.uid).set(userData);

    // Return success with user data
    return {
      success: true,
      user: userData
    };
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    // Handle specific Firebase Auth errors
    if (error.code === 'auth/email-already-exists') {
      throw new functions.https.HttpsError(
        'already-exists',
        'A user with this email already exists'
      );
    }
    
    if (error.code === 'auth/invalid-email') {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'Invalid email address'
      );
    }

    // Generic error
    throw new functions.https.HttpsError(
      'internal',
      `Failed to create user: ${error.message}`
    );
  }
});
