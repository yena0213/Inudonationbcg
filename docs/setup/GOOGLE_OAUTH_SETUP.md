# 🔑 Google OAuth 설정 가이드

## ⚠️ 현재 상태

현재 **간편 로그인 시뮬레이션** 방식으로 구현되어 있습니다:
- 구글 버튼 클릭 → 이메일 입력 프롬프트 → 자동 지갑 생성
- 실제 Google OAuth가 아닌 **데모/MVP용 간단 구현**

---

## 📋 실제 Google OAuth 구현하려면

### 1️⃣ Supabase Dashboard 설정

```
1. Supabase Dashboard 접속
   https://supabase.com/dashboard/project/dnhuzjztsujeuiykvlya

2. Authentication → Providers → Google 활성화

3. Google Cloud Console에서:
   - OAuth 2.0 클라이언트 ID 생성
   - Authorized redirect URIs 추가:
     https://dnhuzjztsujeuiykvlya.supabase.co/auth/v1/callback
   
4. Client ID와 Client Secret을 Supabase에 입력
```

### 2️⃣ Google Cloud Console 설정

```bash
1. https://console.cloud.google.com 접속

2. 새 프로젝트 생성 또는 기존 프로젝트 선택

3. API 및 서비스 → OAuth 동의 화면
   - 앱 이름: "기부 마을"
   - 지원 이메일: your@email.com
   - 승인된 도메인: localhost, supabase.co

4. API 및 서비스 → 사용자 인증 정보
   - OAuth 2.0 클라이언트 ID 만들기
   - 애플리케이션 유형: 웹 애플리케이션
   - 승인된 리디렉션 URI:
     * https://dnhuzjztsujeuiykvlya.supabase.co/auth/v1/callback
     * http://localhost:5173 (개발용)

5. 클라이언트 ID와 클라이언트 보안 비밀번호 복사
```

### 3️⃣ Supabase 설정 완료

```
Supabase Dashboard → Authentication → Providers → Google

✅ Enable Google provider
✅ Client ID (Google Cloud에서 복사)
✅ Client Secret (Google Cloud에서 복사)
✅ Save
```

---

## 🚀 코드에서 사용

이미 코드는 준비되어 있습니다!

### auth-context.tsx
```typescript
// Google OAuth 로그인
const loginWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  
  if (error) throw error;
  
  // 자동으로 리디렉션되어 Google 로그인 페이지로 이동
  // 로그인 후 자동으로 앱으로 돌아옴
};
```

### LoginScreen.tsx
```typescript
// OAuth 콜백 자동 처리
useEffect(() => {
  const handleOAuthCallback = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const email = session.user.email;
      const name = session.user.user_metadata.full_name;
      
      // 자동 지갑 생성 + DID 발급
      await login(email, name);
      onLogin(email, walletAddress);
    }
  };
  
  handleOAuthCallback();
}, []);
```

---

## ✅ 설정 완료 후

1. **구글 버튼 클릭**
   - Google 로그인 페이지로 리디렉션

2. **구글 계정 선택**
   - 이메일 자동 입력됨

3. **자동 처리**
   - 앱으로 돌아옴
   - 지갑 자동 생성
   - DID 자동 발급
   - 마을 화면 진입

---

## 🎯 MVP/데모용 현재 방식

**현재는 간단하게 이메일만 입력받는 방식으로 충분합니다!**

```
장점:
✅ 설정 없이 바로 작동
✅ Google OAuth 없이도 테스트 가능
✅ MVP 데모에 적합
✅ 실제 지갑 생성 + DID 발급은 동일하게 작동

단점:
❌ 실제 Google 인증 없음
❌ 이메일 검증 없음
```

---

## 🔄 전환 가이드

**나중에 실제 OAuth로 전환하려면:**

1. **위의 설정 완료** (Supabase + Google Cloud)

2. **LoginScreen.tsx 수정**
```typescript
const handleGoogleLogin = async () => {
  // 이 부분 제거:
  // const googleEmail = prompt('...');
  
  // 이것으로 교체:
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  
  if (error) {
    alert('Google 로그인 실패');
  }
  
  // useEffect의 OAuth 콜백이 자동 처리
};
```

3. **테스트**
```bash
npm run dev

# 구글 버튼 클릭
# → Google 로그인 페이지로 리디렉션
# → 계정 선택
# → 앱으로 돌아옴
# → 자동 로그인 완료!
```

---

## 📝 요약

### 현재 (MVP/데모)
```
✅ 구글 버튼 → 이메일 입력 → 지갑 생성 → DID 발급
✅ 바로 작동, 설정 불필요
✅ 데모에 충분
```

### 프로덕션 (실제 OAuth)
```
⚙️ Supabase + Google Cloud 설정 필요
✅ 실제 Google 인증
✅ 자동 리디렉션
✅ 보안 강화
```

---

**💡 지금은 간단 방식으로 충분합니다!**
**실제 배포 시 위 가이드대로 Google OAuth 설정하면 됩니다.**
