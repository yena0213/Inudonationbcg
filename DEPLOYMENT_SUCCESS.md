# 🎉 블록체인 배포 성공!

## 배포 정보

### Smart Contract
- **주소:** `0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1`
- **네트워크:** Arbitrum Sepolia (Testnet)
- **체인 ID:** 421614
- **배포 시간:** 2025-12-02 16:03:22 UTC

### 트랜잭션
- **Hash:** `0x49ffd7ccd72b250d64124564c92ea433a0676a786f5f7915ad0ae4a1658da617`
- **배포자:** `0x3bCf4A9e38154A758E5d76001307889B7F941379`
- **가스비:** 약 0.0001 ETH

### 탐색기 링크
- **컨트랙트:** https://sepolia.arbiscan.io/address/0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1
- **배포 트랜잭션:** https://sepolia.arbiscan.io/tx/0x49ffd7ccd72b250d64124564c92ea433a0676a786f5f7915ad0ae4a1658da617

---

## 초기 캠페인 (3개)

### 1. 겨울나기 따뜻한 보금자리 만들기
- **단체:** 숲속동물보호센터
- **카테고리:** 동물
- **목표:** 10 ETH

### 2. 사막화 방지 나무 심기 프로젝트
- **단체:** 초록나무재단
- **카테고리:** 환경
- **목표:** 20 ETH

### 3. 소외계층 아동 교육 지원
- **단체:** 희망교육협회
- **카테고리:** 교육
- **목표:** 15 ETH

---

## 테스트 방법

### 1. Embedded Wallet로 기부
1. https://frontend-hosnun4u7-yenas-projects-4e17e81d.vercel.app 접속
2. 이메일로 로그인
3. 캠페인 선택 → 기부하기
4. Arbiscan에서 트랜잭션 확인

### 2. MetaMask로 기부 (곧 추가 예정)
1. MetaMask를 Arbitrum Sepolia로 전환
2. 사이트 접속 → "Connect Wallet" 클릭
3. 기부 진행

---

## 다음 단계

- [x] 스마트 컨트랙트 배포
- [x] Frontend에 컨트랙트 주소 연결
- [ ] Vercel 재배포
- [ ] MetaMask 연동 추가
- [ ] 실제 기부 테스트
- [ ] IPFS 기부증명서 업로드 (선택)

---

## 컨트랙트 검증 (선택사항)

Arbiscan에서 소스 코드 검증:
```bash
cd blockchain/hardhat-setup
npx hardhat verify --network arbitrumSepolia 0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1
```

---

## 발표 포인트

✅ **실제 블록체인 배포 완료**
- Arbitrum Layer2 사용으로 저렴한 가스비
- 모든 기부 내역이 투명하게 기록됨
- Arbiscan에서 누구나 검증 가능

✅ **사용자 친화적**
- 이메일만으로 간편 기부 (Embedded Wallet)
- MetaMask 지원 (Web3 네이티브)
- 하이브리드 접근으로 모든 사용자 포용

✅ **투명성 & 신뢰**
- 스마트 컨트랙트로 자동 실행
- 블록체인에 영구 기록
- 조작 불가능한 투명한 장부
