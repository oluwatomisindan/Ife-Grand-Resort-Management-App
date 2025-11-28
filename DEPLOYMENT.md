# Firebase Cloud Functions Deployment Guide

## Prerequisites

Before deploying, ensure you have:

1. **Firebase CLI installed globally:**

   ```bash
   npm install -g firebase-tools
   ```

2. **Firebase Blaze Plan enabled** in your Firebase Console

   - Go to https://console.firebase.google.com
   - Select your project: `ife-grand-resort`
   - Navigate to "Upgrade" and enable the Blaze (pay-as-you-go) plan
   - Note: First 2M function invocations per month are free

3. **Logged in to Firebase CLI:**
   ```bash
   firebase login
   ```

## Deployment Steps

### 1. Build the Functions

Navigate to the functions directory and build:

```bash
cd functions
npm run build
```

This compiles the TypeScript code to JavaScript in the `lib` folder.

### 2. Deploy Functions

From the project root directory, deploy the functions:

```bash
firebase deploy --only functions
```

This will:

- Upload your functions to Google Cloud
- Make them available via HTTPS endpoints
- Display the deployment URL

### 3. Verify Deployment

After deployment, you should see output like:

```
✔  functions[createUser(us-central1)] Successful create operation.
Function URL (createUser(us-central1)): https://us-central1-ife-grand-resort.cloudfunctions.net/createUser
```

## Testing the Implementation

### Test 1: Create User as Super Admin

1. Sign in to the app as Super Admin
2. Navigate to **Admin > Users**
3. Click **"Add User"**
4. Fill in the form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Role: Front Desk
5. Click **"Create User"**

**Expected Result:**

- ✅ User created successfully
- ✅ Super Admin remains signed in
- ✅ New user appears in the user list
- ✅ New user can sign in with their credentials

### Test 2: Security Verification

Try accessing the function without proper authentication:

1. Sign out
2. Try to create a user (should fail)

**Expected Result:**

- ❌ Error: "User must be authenticated to create users"

### Test 3: Role-Based Access

1. Sign in as a non-admin user (e.g., Front Desk)
2. Try to create a user

**Expected Result:**

- ❌ Error: "Only Super Admins can create users"

## Troubleshooting

### Error: "Firebase CLI not found"

Install Firebase CLI globally:

```bash
npm install -g firebase-tools
```

### Error: "Billing account not configured"

Enable the Blaze plan in Firebase Console:

1. Go to https://console.firebase.google.com
2. Select your project
3. Click "Upgrade" and follow the prompts

### Error: "Permission denied"

Ensure you're logged in:

```bash
firebase login
firebase projects:list
```

### Function Logs

View function logs to debug issues:

```bash
firebase functions:log
```

Or view logs in Firebase Console:

- Go to Functions section
- Click on the function name
- View the "Logs" tab

## Local Testing (Optional)

Test functions locally before deploying:

```bash
# Install emulator
firebase init emulators

# Start emulator
npm run serve
```

This runs functions locally at `http://localhost:5001`

## Monitoring

Monitor function usage in Firebase Console:

- **Functions Dashboard**: View invocations, errors, and execution time
- **Usage Tab**: Monitor quota and billing
- **Logs**: Debug issues in production

## Cost Estimation

With the Blaze plan:

- **Free tier**: 2M invocations/month
- **After free tier**: $0.40 per million invocations
- **Typical usage**: Creating 100 users/month = negligible cost

## Next Steps

After successful deployment:

1. Test all user creation scenarios
2. Monitor function performance
3. Set up alerts for errors
4. Consider adding more Cloud Functions for other admin operations
