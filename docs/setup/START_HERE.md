# 🎯 여기서 시작하세요!

## ✅ 3단계로 배포 완료

---

## 1️⃣ .env 파일 생성 (1분)

```bash
nano hardhat-setup/.env
```

다음 내용 입력:
```env
PRIVATE_KEY=0x여기에_MetaMask_Private_Key_붙여넣기
ALCHEMY_API_KEY=여기에_Alchemy_API_Key_붙여넣기
```

**저장:** `Ctrl+O` → `Enter` → `Ctrl+X`

---

## 2️⃣ 명령어 실행 (1분)

**다음을 복사해서 터미널에 붙여넣기:**

```bash
cd hardhat-setup && npm install && npx hardhat compile && npx hardhat run scripts/deploy.js --network arbitrumSepolia
```

---

## 3️⃣ 컨트랙트 주소 복사 (10초)

출력에서 이 부분을 찾아서 복사:

```
✅ DonationVillage deployed to: 0x1234567890abcdef...
```

---

## 🎉 완료!

---

## 🔑 Private Key 가져오는 법

### MetaMask:
1. MetaMask 열기
2. ⚙️ (설정) → "계정 상세정보"
3. "개인 키 내보내기"
4. 비밀번호 입력
5. **0x로 시작하는 66자** 복사

---

## 💧 Arbitrum Sepolia ETH 받기

```
https://www.alchemy.com/faucets/arbitrum-sepolia
```

1. 지갑 주소 입력
2. "Send Me ETH" 클릭
3. 약 0.1 ETH 받음 (무료)

---

## 🆘 에러가 나면?

에러 메시지를 보내주세요! 즉시 해결해드립니다.

---

## 📚 더 자세한 가이드

- `/DEPLOY_NOW.md` - 상세 배포 가이드
- `/hardhat-setup/SETUP_GUIDE.md` - 전체 설정
- `/QUICK_START.md` - 빠른 시작

---

**지금 바로 시작하세요!** 🚀
