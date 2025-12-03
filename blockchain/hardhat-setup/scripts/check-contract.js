const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking DonationVillage contract...");

  const contractAddress = "0x9e4C6825cbb7a13a0Eb56310239b7A06356E8cA1";
  console.log("📍 Contract:", contractAddress);

  // ABI 불러오기
  const DonationVillage = await ethers.getContractFactory("DonationVillage");
  const contract = DonationVillage.attach(contractAddress);

  // 캠페인 개수 확인
  console.log("\n📊 Checking campaigns...");
  const campaignCount = await contract.campaignCount();
  console.log("Campaign count:", campaignCount.toString());

  // 각 캠페인 정보 확인
  for (let i = 1; i <= campaignCount; i++) {
    console.log(`\n📌 Campaign ${i}:`);
    try {
      const campaign = await contract.campaigns(i);
      console.log("  Organization:", campaign.organizationName);
      console.log("  Title:", campaign.title);
      console.log("  Active:", campaign.active);
      console.log("  Goal:", ethers.formatEther(campaign.goalAmount), "ETH");
      console.log("  Current:", ethers.formatEther(campaign.currentAmount), "ETH");
      console.log("  Beneficiary:", campaign.beneficiary);
    } catch (error) {
      console.log("  ❌ Error:", error.message);
    }
  }

  // Paused 상태 확인
  console.log("\n🔐 Checking pause status...");
  const isPaused = await contract.paused();
  console.log("Contract paused:", isPaused);

  // Owner 확인
  console.log("\n👤 Checking owner...");
  const owner = await contract.owner();
  console.log("Owner:", owner);

  // 테스트 기부 시뮬레이션
  console.log("\n🧪 Simulating donation...");
  const [signer] = await ethers.getSigners();
  console.log("Donor address:", signer.address);

  try {
    // Campaign 1에 0.001 ETH 기부 시뮬레이션
    const value = ethers.parseEther("0.001");
    const gasEstimate = await contract.donate.estimateGas(1, "Test donation", { value });
    console.log("✅ Gas estimate:", gasEstimate.toString());
    console.log("✅ Donation would succeed!");
  } catch (error) {
    console.log("❌ Donation would fail:");
    console.log("   Reason:", error.message);
    if (error.data) {
      console.log("   Data:", error.data);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
