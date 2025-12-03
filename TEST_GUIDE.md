# 🧪 블록체인 기부 테스트 가이드

## ✅ 수정 완료 사항
- [x] 스마트 컨트랙트 배포 (`0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1`)
- [x] ABI 업데이트 (DonationVillage 맞춤)
- [x] Campaign ID 타입 수정 (string → uint256)
- [x] Frontend 재배포

---

## 🚀 실제 기부 테스트하기

### Step 1: 사이트 접속
**새 배포 URL:** https://frontend-bvuqompoh-yenas-projects-4e17e81d.vercel.app

### Step 2: 이메일로 로그인
1. 화면에서 "이메일로 시작하기" 클릭
2. 아무 이메일 입력 (예: test@example.com)
3. 자동으로 Embedded Wallet 생성됨

### Step 3: 기부하기
1. 3개 캠페인 중 하나 선택:
   - 겨울나기 따뜻한 보금자리 만들기 (10 ETH 목표)
   - 사막화 방지 나무 심기 (20 ETH 목표)
   - 소외계층 아동 교육 지원 (15 ETH 목표)

2. "기부하기" 버튼 클릭

3. 기부 금액 입력 (예: 10,000원)
   - 자동으로 ETH로 변환됨
   - 1 ETH ≈ 3,000,000 KRW (테스트 환율)
   - 10,000원 = 0.0000033 ETH

4. (선택) 응원 메시지 입력

5. "기부하기" 버튼 클릭

### Step 4: 트랜잭션 확인
1. 트랜잭션 처리 중... (10-20초)
2. 성공 메시지와 트랜잭션 해시 표시
3. "Arbiscan에서 보기" 클릭

### Step 5: Arbiscan에서 검증
https://sepolia.arbiscan.io 에서:
- 트랜잭션 상세 정보 확인
- From: 당신의 지갑 주소
- To: 컨트랙트 주소 (0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1)
- Value: 기부 금액 (ETH)
- Status: Success ✅

---

## 🔍 예상되는 시나리오

### ✅ 성공 케이스
- 트랜잭션이 블록체인에 기록됨
- Arbiscan에서 확인 가능
- 캠페인 currentAmount가 증가함
- 기부 내역이 블록체인에 영구 저장

### ⚠️ 잠재적 오류
1. **"지갑 잔액 부족"**
   - Embedded Wallet에 ETH가 없음
   - 해결: MetaMask에서 Embedded Wallet 주소로 소량 ETH 전송

2. **"트랜잭션 실패"**
   - 가스비 부족
   - 해결: 가스 리밋 조정 (현재 300,000)

3. **"컨트랙트 호출 실패"**
   - Campaign ID 오류 또는 네트워크 문제
   - 콘솔 로그 확인

---

## 🎯 테스트 체크리스트

- [ ] 사이트 접속 완료
- [ ] 이메일로 로그인 완료
- [ ] Embedded Wallet 생성됨
- [ ] 캠페인 선택 완료
- [ ] 기부 금액 입력
- [ ] 트랜잭션 제출
- [ ] 트랜잭션 성공
- [ ] Arbiscan에서 확인
- [ ] 투명성 증명 완료! 🎉

---

## 📊 컨트랙트 정보

- **주소:** 0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1
- **네트워크:** Arbitrum Sepolia
- **Explorer:** https://sepolia.arbiscan.io/address/0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1

---

## 💡 발표 데모 팁

1. **투명성 강조**
   - "이메일만으로 쉽게 기부"
   - "모든 거래는 블록체인에 투명하게 기록"
   - "Arbiscan에서 누구나 검증 가능"

2. **실제 시연**
   - 10,000원 기부
   - 트랜잭션 제출
   - Arbiscan에서 실시간 확인

3. **차별점**
   - 일반 기부: 단체만 장부 관리 (조작 가능)
   - 블록체인 기부: 누구나 검증 (조작 불가능)

4. **하이브리드 접근**
   - Embedded Wallet: 일반 사용자
   - MetaMask: Web3 네이티브 사용자
   - 모두 같은 블록체인, 같은 투명성!
