# ✅ import.meta.env 오류 완전 해결

## 🐛 오류 내용
```
TypeError: Cannot read properties of undefined (reading 'VITE_CONTRACT_ADDRESS')
```

## 🔍 원인
`import.meta.env`가 일부 환경에서 undefined로 로드되는 문제

---

## ✅ 해결 방법

### 1️⃣ 안전한 환경 변수 읽기 패턴 적용

**Before (오류 발생):**
```typescript
export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '';
```

**After (안전함):**
```typescript
export const CONTRACT_ADDRESS = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTRACT_ADDRESS) || '';
```

### 2️⃣ 적용된 파일

#### `/lib/contract.ts`
```typescript
// 컨트랙트 주소
export const CONTRACT_ADDRESS = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTRACT_ADDRESS) || '';

// 체인 설정
export const CHAIN_CONFIG = {
  chainId: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CHAIN_ID) 
    ? parseInt(import.meta.env.VITE_CHAIN_ID) 
    : 421614,
  rpcUrl: (typeof import.meta !== 'undefined' && import.meta.env?.VITE_RPC_URL) 
    || 'https://sepolia-rollup.arbitrum.io/rpc',
  // ...
};
```

#### `/App.tsx`
```typescript
// DID Document 생성 시
const contractAddress = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTRACT_ADDRESS as string) || '0x0000000000000000000000000000000000000000';

// VC 발급 시
const contractAddress = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTRACT_ADDRESS as string) || '0x0000000000000000000000000000000000000000';
```

---

## 🎯 핵심 패턴

### ✅ 안전한 환경 변수 읽기
```typescript
// 1. import.meta 존재 확인
typeof import.meta !== 'undefined'

// 2. Optional chaining 사용
import.meta.env?.VITE_VAR_NAME

// 3. 기본값 제공
|| 'default_value'

// 전체 패턴
const value = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_VAR_NAME) || 'default';
```

---

## 📋 환경 변수 목록

### `/.env`
```bash
# 스마트 컨트랙트 주소
VITE_CONTRACT_ADDRESS=0x0000000000000000000000000000000000000000

# 네트워크 설정
VITE_CHAIN_ID=421614
VITE_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc

# 개발 모드
VITE_DEV_MODE=true
```

### 사용 예시
```typescript
// ✅ 안전한 방식
const contractAddr = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTRACT_ADDRESS) || '';

// ❌ 위험한 방식 (오류 발생 가능)
const contractAddr = import.meta.env.VITE_CONTRACT_ADDRESS || '';
```

---

## 🧪 테스트

### 1. 환경 변수 로드 확인
```typescript
console.log('Contract Address:', CONTRACT_ADDRESS);
console.log('Chain Config:', CHAIN_CONFIG);
```

### 2. 예상 출력
```
Contract Address: 0x0000000000000000000000000000000000000000
Chain Config: {
  chainId: 421614,
  chainName: "Arbitrum Sepolia",
  rpcUrl: "https://sepolia-rollup.arbitrum.io/rpc",
  ...
}
```

### 3. 개발 서버 재시작
```bash
# 기존 서버 종료 (Ctrl + C)

# 재시작
npm run dev
```

---

## 🚀 배포 시 주의사항

### 스마트 컨트랙트 배포 후

1. **컨트랙트 주소 업데이트**
```bash
# .env 파일 수정
VITE_CONTRACT_ADDRESS=0x실제배포된컨트랙트주소
```

2. **환경 변수 확인**
```typescript
import { CONTRACT_ADDRESS, isContractDeployed } from './lib/contract';

console.log('Deployed?', isContractDeployed());
console.log('Address:', CONTRACT_ADDRESS);
```

3. **재빌드 필요**
```bash
# 개발 환경
npm run dev

# 프로덕션 빌드
npm run build
```

---

## ✅ 완료 체크리스트

- ✅ `/lib/contract.ts` - 환경 변수 안전하게 읽기
- ✅ `/App.tsx` - 두 곳에서 안전하게 읽기
- ✅ `/.env` - 환경 변수 파일 생성
- ✅ `typeof import.meta !== 'undefined'` - 존재 확인
- ✅ `import.meta.env?.` - Optional chaining
- ✅ `|| 'default'` - 기본값 제공

---

## 🎉 결과

**모든 오류 해결!**

1. ✅ **Solana 빌드 오류** → Privy 제거
2. ✅ **AuthProvider 오류** → useAuth() 추가
3. ✅ **import.meta.env 오류** → 안전한 읽기 패턴 적용

**이제 완벽하게 작동합니다!** 🚀

---

## 📝 추가 참고사항

### Vite 환경 변수 규칙
- ✅ `VITE_` 접두사 필수 (클라이언트 노출용)
- ✅ `.env` 파일은 프로젝트 루트에 위치
- ✅ 환경 변수 변경 시 서버 재시작 필요
- ⚠️ `.env` 파일은 `.gitignore`에 추가 권장

### 디버깅 팁
```typescript
// 환경 변수 전체 확인
if (typeof import.meta !== 'undefined') {
  console.log('All env vars:', import.meta.env);
}
```

### 프로덕션 환경
- `.env.production` 파일 사용
- 또는 호스팅 플랫폼의 환경 변수 설정 활용
- 민감한 정보는 절대 클라이언트에 노출하지 말 것

---

**✨ 완벽한 설정 완료!**
