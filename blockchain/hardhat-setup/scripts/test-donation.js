const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🧪 Testing donation with Embedded Wallet...");

  const contractAddress = "0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1";
  const embeddedWalletPK = "0x3c3ae714019bc39c9214e9fa2c4b13217cbdc01c48bea12a96f2d89ad5938561";

  // Embedded Wallet으로 Signer 생성
  const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
  const embeddedWallet = new ethers.Wallet(embeddedWalletPK, provider);

  console.log("👤 Embedded Wallet:", embeddedWallet.address);

  const balance = await provider.getBalance(embeddedWallet.address);
  console.log("💰 Balance:", ethers.formatEther(balance), "ETH");

  // Contract 연결
  const DonationVillage = await ethers.getContractFactory("DonationVillage");
  const contract = DonationVillage.attach(contractAddress).connect(embeddedWallet);

  // Campaign 1에 기부
  const campaignId = 1;
  const message = "Test donation from Embedded Wallet!";
  const value = ethers.parseEther("0.001"); // 0.001 ETH

  console.log(`\n💝 Donating to Campaign ${campaignId}...`);
  console.log("Amount:", ethers.formatEther(value), "ETH");
  console.log("Message:", message);

  try {
    const tx = await contract.donate(campaignId, message, {
      value: value,
      gasLimit: 350000
    });

    console.log("\n📊 Transaction sent:", tx.hash);
    console.log("⏳ Waiting for confirmation...");

    const receipt = await tx.wait();

    if (receipt.status === 1) {
      console.log("\n✅ Donation successful!");
      console.log("🔗 View on Arbiscan:", `https://sepolia.arbiscan.io/tx/${tx.hash}`);

      // 기부 내역 확인
      const donationCount = await contract.donationCount();
      console.log("\n📊 Total donations:", donationCount.toString());

      // 최신 기부 확인
      const donation = await contract.donations(donationCount);
      console.log("\n📋 Latest donation:");
      console.log("  Donor:", donation.donor);
      console.log("  Campaign ID:", donation.campaignId.toString());
      console.log("  Amount:", ethers.formatEther(donation.amount), "ETH");
      console.log("  Message:", donation.message);
    } else {
      console.log("\n❌ Transaction failed!");
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.data) {
      console.error("Data:", error.data);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
