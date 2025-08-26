# 🔐 Security Setup Guide

## ⚠️ URGENT: API Key Security Issue Resolution

This guide addresses the **Google API Key security leak** detected by GitHub and provides steps to secure your Firebase configuration.

## 🚨 Immediate Actions Required

### 1. **Revoke the Exposed API Key**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Navigate to **APIs & Services** → **Credentials**
- Find the API key: `<REDACTED>`
- **DELETE** or **REVOKE** this key immediately

### 2. **Generate a New API Key**
- In Google Cloud Console, create a new Firebase API key
- Configure appropriate restrictions (HTTP referrers, API restrictions)
- Copy the new API key securely

### 3. **Update Environment Variables**
- Create a `.env` file in your project root (copy from `.env.example`)
- Fill in your new API key and related values
- **NEVER commit the `.env` file to version control**

```bash
# Example .env configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_actual_new_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=queue-radar.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=queue-radar
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=queue-radar.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=662611543773
EXPO_PUBLIC_FIREBASE_APP_ID=1:662611543773:web:4b5d838828de81cee17d34
```

## ✅ Security Measures Already Implemented

### 1. **Environment Variable Configuration**
- ✅ Firebase config now uses environment variables
- ✅ No hardcoded API keys in source code
- ✅ Runtime validation in development mode

### 2. **Git Ignore Protection**
- ✅ `.env` files are properly ignored in `.gitignore`
- ✅ Multiple patterns ensure comprehensive protection:
  ```gitignore
  .env
  .env.*
  *.env
  ```

### 3. **Code Structure**
- ✅ `services/firebaseConfig.ts` properly configured for env vars
- ✅ `services/firebase.ts` imports config securely
- ✅ Development warnings for missing configuration

## 🔍 Security Verification Checklist

- [ ] Old API key revoked in Google Cloud Console
- [ ] New API key generated with proper restrictions
- [ ] `.env` file updated with new API key
- [ ] `.env` file NOT committed to git
- [ ] Application tested with new configuration
- [ ] Security logs reviewed for potential breaches
- [ ] GitHub security alert marked as resolved

## 🚀 Development Workflow

### For New Developers:
1. Copy `.env.example` to `.env`
2. Request API keys from project maintainer
3. Fill in actual values in `.env`
4. Never commit `.env` file

### For Production Deployment:
- Use platform-specific environment variable configuration
- **Expo**: Set via `eas.json` or EAS dashboard
- **Vercel/Netlify**: Set via dashboard environment variables
- **Docker**: Use environment variable injection

## 🛡️ Best Practices

1. **Rotate API Keys Regularly**: Consider rotating Firebase API keys every 90 days
2. **Restrict API Keys**: Always configure API key restrictions in Google Cloud Console
3. **Monitor Usage**: Set up alerts for unusual API key usage
4. **Audit Access**: Regularly review who has access to production API keys
5. **Use Secrets Management**: For production, consider using services like:
   - AWS Secrets Manager
   - Azure Key Vault
   - Google Secret Manager

## 📞 Emergency Contacts

If you suspect a security breach:
1. Immediately revoke all API keys
2. Review Google Cloud Console audit logs
3. Check Firebase project activity logs
4. Notify team lead/security officer

---

**Remember**: Security is everyone's responsibility. When in doubt, ask for help rather than risk exposure.

