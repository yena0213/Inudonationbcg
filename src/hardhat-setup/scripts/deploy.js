const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");
  console.log("📍 Network:", hre.network.name);
  
  // 배포자 계정 정보
  const [deployer] = await ethers.getSigners();
  console.log("👤 Deploying contracts with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
  
  if (balance < ethers.parseEther("0.01")) {
    console.warn("⚠️  Warning: Balance is low. You might need more ETH for deployment.");
  }
  
  // 컨트랙트 배포
  console.log("\n📝 Deploying DonationVillage contract...");
  
  const DonationVillage = await ethers.getContractFactory("DonationVillage");
  const donationVillage = await DonationVillage.deploy();
  
  await donationVillage.waitForDeployment();
  
  const contractAddress = await donationVillage.getAddress();
  console.log("✅ DonationVillage deployed to:", contractAddress);
  
  // 트랜잭션 정보
  const deployTx = donationVillage.deploymentTransaction();
  console.log("📊 Deployment transaction hash:", deployTx.hash);
  
  // 배포 후 초기 캠페인 확인
  console.log("\n🔍 Verifying initial campaigns...");
  const campaignCount = await donationVillage.campaignCount();
  console.log("📋 Initial campaign count:", campaignCount.toString());
  
  // 각 캠페인 정보 출력
  for (let i = 1; i <= campaignCount; i++) {
    const campaign = await donationVillage.getCampaign(i);
    console.log(`\n📌 Campaign ${i}:`);
    console.log("   Organization:", campaign.organizationName);
    console.log("   Title:", campaign.title);
    console.log("   Category:", campaign.category);
    console.log("   Goal:", ethers.formatEther(campaign.goalAmount), "ETH");
    console.log("   Active:", campaign.active);
  }
  
  // 배포 정보 저장
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    transactionHash: deployTx.hash,
    campaignCount: campaignCount.toString()
  };
  
  console.log("\n📄 Deployment Info:");
  console.log(JSON.stringify(deploymentInfo, null, 2));
  
  // 검증 가이드
  if (hre.network.name === "arbitrumSepolia") {
    console.log("\n🔐 To verify the contract on Arbiscan, run:");
    console.log(`npx hardhat verify --network arbitrumSepolia ${contractAddress}`);
  }
  
  // 환경 변수 가이드
  console.log("\n📝 Add these to your .env file:");
  console.log(`VITE_CONTRACT_ADDRESS=${contractAddress}`);
  console.log(`VITE_CHAIN_ID=421614`);
  console.log(`VITE_CHAIN_NAME="Arbitrum Sepolia"`);
  
  console.log("\n✨ Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
