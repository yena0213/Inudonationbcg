const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("💸 Starting ETH transfer...");

  const [deployer] = await ethers.getSigners();
  console.log("👤 From:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Current balance:", ethers.formatEther(balance), "ETH");

  // Embedded Wallet 주소
  const recipient = "0x93517889cb1Acf36072b27268FEDe02c4814Fac4";
  console.log("📬 To:", recipient);

  // 0.01 ETH 전송
  const amount = ethers.parseEther("0.01");
  console.log("💵 Amount:", ethers.formatEther(amount), "ETH");

  console.log("\n🚀 Sending transaction...");

  const tx = await deployer.sendTransaction({
    to: recipient,
    value: amount
  });

  console.log("📊 Transaction hash:", tx.hash);
  console.log("⏳ Waiting for confirmation...");

  const receipt = await tx.wait();

  if (receipt.status === 1) {
    console.log("\n✅ Transfer successful!");
    console.log("🔗 View on Arbiscan:", `https://sepolia.arbiscan.io/tx/${tx.hash}`);

    // 수신자 잔액 확인
    const recipientBalance = await ethers.provider.getBalance(recipient);
    console.log("\n📊 Recipient balance:", ethers.formatEther(recipientBalance), "ETH");
  } else {
    console.log("\n❌ Transfer failed!");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
