# 🔑 Firebase Credentials for Render

## From Your JSON File

Extract these values and add to Render Environment Variables:

---

## 1. FIREBASE_PRIVATE_KEY

**Value:**
```
"-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCRbLeoSdRwm3Tx\n5lMZPysCGU6kzomisIJj5Q0iJhxZDTH/Pf8FZh6ZzS8yV9+WcbWbm7fhoi8hUUf6\n30ilt//RYlLKiTqZwgBRnljQnMQ0MPUNjG+xfEMIWrYhYOl5kh5OyM0V96LaVD4C\ncVMwzsNujxeHHphW78TIxZc1wqKU+1TxT38VHNJ38CKJBpfkwsZPXJwVpFTaoowo\nEHJvLTQdo+ZTcKT6VAN3sFfkLQwVAXcK4saMyCHA50VNt/UyPBzdTnIjcXYWSM9e\n2L1+IF8+T9DxRMT9JP+3PzmSBKexuzMZJfG4diuNFNRoS6ih0k4zsQmXuzuv8458\neBzRn92pAgMBAAECgf9rgTND9VBW7pVFPj+wKkJhCtRYgVa+Lj42Gt3aoNHUAy0y\nw2IDW7rDeCury8o+LVFT94m4A21T9AKCMw5BdARphYYus8PeZsxVifmePkXNT2PY\n4DixvGrRgj2h70Kp3JsLIuZ5lteNDznIFH6rVi6jTKTX/oYfvqB6y5c85uXJu+VF\nzHkfv/VYlQmPwsF0Tm2GmlCTsVUTT9LbyCC9XhYJFfOP8HqXVDRPYc5qLAs5Gf37\n8B43i0QmtC2J9QaeXkiYm8hPWll/5fChKKcoJ1zJxJKoXzXs1xpfAPuc2lWRqM9C\nag4048HMZWVk7hpN8nr+RVUQ2t8WMRBBun2+G4ECgYEAyWWcdQMpZsifkDitKVEU\nzyjuTjnZcITnsikheWuQ7dohZdBD6BLwpJ2dCoNzIuDXyiGs5o26aGzNaYOuNHxy\nVN6Cokc+PS9Hticzr0gj0WqJ+VZYQjoGKBqv2ltG/1/MuE5KYrQ0WlKRvn8dtK51\nUTTcJwGRl4OjCgVEmY/TgekCgYEAuNo7VJLVNh+I3d7+taQqkvBH97fvia3Mkr+N\nQggDUODeKmpMIfo/dlYRysc5Hx2lfs2TEtn5Hi3tc01oBD43e52MD4w1CRSpQRWx\nhizHbyG3JoBIVbiRcjXyp8OlCtXURB4VoyTL17zXXeNT1TKI527ENlZVA0efHAnp\nyv1aZcECgYAh3vL3QvbdkHQ1fzKwNjC3vnyFr3kAUXneHsjAcPTI69yeEO66wySx\nqshUklL01Le2CP/ZLpDhKxtI2ZqcvSlFWL7DqBOxmpgG7ITmv802VSKrSnhBexy5\n9fMJWDySinwVqyUbgI8leamFTj+iuYyFgcxcywi/YKY08zncUbISsQKBgQCpx37Q\nyd/cSxBpP+RPrs2PkfN3uU/f82o+qoKyUCvDgBVtfZ4ZYwAgzyKeTWbQhmk3Utcv\nbFZberFpwoGzy/Unq2c17H/VrE1cQvF/G+e80YmnahGF8fRcouIRZidTEVxZiAw1\ngJlct8xTJnUcDsMhVWIPyjFgxsqDdTNvRk1dwQKBgQCbIYukDffuiyInLoXPKDQu\n6Dd+Fv1z3KqWTq/4kMzx+vGrp0jmNmFAXNojgw37Xjt0+qKeyanu5ERPgQWj2deD\nVD8bkoYXmNF31hjrrZE5mbFQiOog0GL95uE6h2MBORjA8O/WaA0hHXWdX62QNzh2\n87JIcHoHR2/7dhzaYWE8Vg==\n-----END PRIVATE KEY-----\n"
```

**⚠️ Important:** 
- Keep the quotes `"`
- Keep all `\n` characters
- Copy the ENTIRE value

---

## 2. FIREBASE_CLIENT_EMAIL

**Value:**
```
firebase-adminsdk-fbsvc@lovemeet-1200b.iam.gserviceaccount.com
```

---

## 3. Other Required Variables

**FIREBASE_PROJECT_ID:**
```
lovemeet-1200b
```

---

## 📋 How to Add in Render

1. Go to Render Dashboard → Your Service
2. Click **"Environment"** tab
3. Click **"Add Environment Variable"**
4. Add each variable:
   - **Key**: `FIREBASE_PRIVATE_KEY`
   - **Value**: Paste the entire private key (with quotes)
5. Repeat for `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PROJECT_ID`

---

## ✅ Verification

After adding, check Render logs should show:
```
✅ Firebase Admin SDK Initialized
```

If you see errors, check:
- Private key format (quotes and `\n` preserved)
- Client email matches JSON file
- Project ID is correct

---

**Never share these credentials publicly!**

