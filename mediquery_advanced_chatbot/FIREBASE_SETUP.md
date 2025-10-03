# Firebase Integration for MediQuery

This document describes the Firebase integration for the MediQuery advanced chatbot application.

## Firebase Services Used

### 1. Firestore Database
- **Chat History**: Stores user chat conversations
- **User Profiles**: Stores user profile information and preferences
- **Medical Reports**: Stores generated medical reports and summaries
- **User Analytics**: Tracks user activity and usage patterns

### 2. Firebase Authentication
- User authentication and session management
- Integration with existing JWT token system

### 3. Firebase Storage
- Ready for file uploads (medical images, documents, etc.)

## Database Collections

### `chatHistory`
```javascript
{
  userId: string,
  message: string,
  response: string,
  timestamp: Timestamp,
  createdAt: Timestamp
}
```

### `userProfiles`
```javascript
{
  userId: string,
  name: string,
  email: string,
  preferences: object,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `medicalReports`
```javascript
{
  userId: string,
  title: string,
  content: string,
  type: string,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### `userAnalytics`
```javascript
{
  userId: string,
  activityType: string,
  data: object,
  timestamp: Timestamp
}
```

## Security Rules

The Firebase security rules ensure that:
- Users can only access their own data
- All operations require authentication
- Data is properly isolated by user ID

## Usage Examples

### Saving Chat Messages
```javascript
import { chatService } from './firebase/services';

// Save a chat message
await chatService.saveMessage(userId, userMessage, aiResponse);
```

### Loading Chat History
```javascript
// Get user's chat history
const history = await chatService.getChatHistory(userId, 50);
```

### User Profile Management
```javascript
import { userService } from './firebase/services';

// Save user profile
await userService.saveUserProfile(userId, {
  name: 'John Doe',
  email: 'john@example.com',
  preferences: { theme: 'dark' }
});
```

### Analytics Tracking
```javascript
import { analyticsService } from './firebase/services';

// Track user activity
await analyticsService.trackActivity(userId, 'chat_message_sent', {
  messageLength: 50
});
```

## Setup Instructions

1. **Install Firebase CLI** (if not already installed):
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**:
   ```bash
   firebase login
   ```

3. **Initialize Firebase in your project**:
   ```bash
   firebase init firestore
   ```

4. **Deploy Security Rules**:
   ```bash
   firebase deploy --only firestore:rules
   ```

5. **Configure Firestore Database**:
   - Go to Firebase Console
   - Create a Firestore database
   - Set up the collections as needed
   - Deploy the security rules

## Environment Configuration

The Firebase configuration is already set up in `src/firebase/config.js` with your project credentials. Make sure to:

1. Enable Firestore in your Firebase Console
2. Enable Authentication if you plan to use Firebase Auth
3. Set up proper security rules

## Features Implemented

✅ **Chat History Storage**: All chat messages are automatically saved to Firestore
✅ **User Profile Management**: User data and preferences storage
✅ **Analytics Tracking**: User activity and usage analytics
✅ **Real-time Data**: Firestore provides real-time updates
✅ **Security**: Proper security rules to protect user data
✅ **Error Handling**: Comprehensive error handling for all operations

## Future Enhancements

- **File Upload**: Medical image and document storage
- **Real-time Chat**: Live chat functionality with real-time updates
- **Push Notifications**: Firebase Cloud Messaging for notifications
- **Advanced Analytics**: Detailed usage analytics and reporting
- **Data Export**: Export user data functionality

## Troubleshooting

### Common Issues

1. **Permission Denied**: Check Firebase security rules
2. **Network Errors**: Verify Firebase configuration
3. **Authentication Issues**: Ensure user is properly authenticated

### Debug Mode

Enable debug logging by adding to your browser console:
```javascript
localStorage.setItem('firebase:debug', '*');
```

## Support

For Firebase-related issues, refer to:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
