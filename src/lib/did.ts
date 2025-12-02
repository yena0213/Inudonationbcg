import { ethers } from 'ethers';

/**
 * DID (Decentralized Identifier) 유틸리티
 * 사용자의 지갑 주소를 DID로 활용하고, 기부 이력을 Verifiable Credential로 관리
 */

// DID 형식: did:ethr:arbitrum-sepolia:{address}
export function createDID(address: string, chainId: number = 421614): string {
  const network = chainId === 421614 ? 'arbitrum-sepolia' : 'arbitrum';
  return `did:ethr:${network}:${address.toLowerCase()}`;
}

/**
 * DID에서 주소 추출
 */
export function parseDID(did: string): string | null {
  const match = did.match(/^did:ethr:(arbitrum|arbitrum-sepolia):0x[a-fA-F0-9]{40}$/);
  if (!match) return null;
  
  const parts = did.split(':');
  return parts[parts.length - 1];
}

/**
 * Verifiable Credential (VC) 생성
 * 기부 기록을 검증 가능한 자격증명으로 변환
 */
export interface DonationCredential {
  '@context': string[];
  type: string[];
  issuer: string; // 컨트랙트 주소 (DID 형식)
  issuanceDate: string;
  credentialSubject: {
    id: string; // 기부자 DID
    donationAmount: string;
    donationCount: number;
    campaignId: string;
    txHash: string;
    timestamp: string;
  };
  proof?: {
    type: string;
    created: string;
    proofPurpose: string;
    verificationMethod: string;
    signature: string;
  };
}

/**
 * 기부 VC 생성
 */
export async function createDonationCredential(
  donorAddress: string,
  contractAddress: string,
  donationAmount: string,
  donationCount: number,
  campaignId: string,
  txHash: string,
  chainId: number = 421614
): Promise<DonationCredential> {
  const donorDID = createDID(donorAddress, chainId);
  const issuerDID = createDID(contractAddress, chainId);
  
  const credential: DonationCredential = {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://www.donation-village.org/credentials/v1'
    ],
    type: ['VerifiableCredential', 'DonationCredential'],
    issuer: issuerDID,
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: donorDID,
      donationAmount,
      donationCount,
      campaignId,
      txHash,
      timestamp: new Date().toISOString()
    }
  };
  
  return credential;
}

/**
 * VC에 서명 추가 (지갑으로 서명)
 */
export async function signCredential(
  credential: DonationCredential,
  signer: ethers.Signer
): Promise<DonationCredential> {
  const message = JSON.stringify(credential);
  const signature = await signer.signMessage(message);
  
  credential.proof = {
    type: 'EthereumEip712Signature2021',
    created: new Date().toISOString(),
    proofPurpose: 'assertionMethod',
    verificationMethod: await signer.getAddress(),
    signature
  };
  
  return credential;
}

/**
 * VC 검증
 */
export async function verifyCredential(
  credential: DonationCredential
): Promise<boolean> {
  if (!credential.proof) return false;
  
  try {
    const message = JSON.stringify({
      '@context': credential['@context'],
      type: credential.type,
      issuer: credential.issuer,
      issuanceDate: credential.issuanceDate,
      credentialSubject: credential.credentialSubject
    });
    
    const recoveredAddress = ethers.verifyMessage(
      message,
      credential.proof.signature
    );
    
    return recoveredAddress.toLowerCase() === credential.proof.verificationMethod.toLowerCase();
  } catch (error) {
    console.error('Credential verification failed:', error);
    return false;
  }
}

/**
 * DID Document 생성 (간소화 버전)
 */
export interface DIDDocument {
  '@context': string;
  id: string;
  verificationMethod: Array<{
    id: string;
    type: string;
    controller: string;
    blockchainAccountId: string;
  }>;
  authentication: string[];
  service?: Array<{
    id: string;
    type: string;
    serviceEndpoint: string;
  }>;
}

export function createDIDDocument(
  address: string,
  contractAddress: string,
  chainId: number = 421614
): DIDDocument {
  const did = createDID(address, chainId);
  
  return {
    '@context': 'https://www.w3.org/ns/did/v1',
    id: did,
    verificationMethod: [
      {
        id: `${did}#controller`,
        type: 'EcdsaSecp256k1RecoveryMethod2020',
        controller: did,
        blockchainAccountId: `eip155:${chainId}:${address}`
      }
    ],
    authentication: [`${did}#controller`],
    service: [
      {
        id: `${did}#donation-ledger`,
        type: 'DonationLedger',
        serviceEndpoint: contractAddress
      }
    ]
  };
}

/**
 * 뱃지를 VC로 생성 (Soul Bound Token 개념)
 */
export interface BadgeCredential {
  '@context': string[];
  type: string[];
  issuer: string;
  issuanceDate: string;
  credentialSubject: {
    id: string; // 소유자 DID
    badge: {
      name: string;
      tier: string;
      description: string;
      criteria: string;
      imageUrl: string;
    };
  };
}

export function createBadgeCredential(
  ownerAddress: string,
  contractAddress: string,
  badgeName: string,
  badgeTier: string,
  description: string,
  criteria: string,
  imageUrl: string,
  chainId: number = 421614
): BadgeCredential {
  return {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://www.donation-village.org/credentials/badge/v1'
    ],
    type: ['VerifiableCredential', 'BadgeCredential'],
    issuer: createDID(contractAddress, chainId),
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: createDID(ownerAddress, chainId),
      badge: {
        name: badgeName,
        tier: badgeTier,
        description,
        criteria,
        imageUrl
      }
    }
  };
}

/**
 * localStorage에 VC 저장
 */
export function saveCredential(did: string, credential: DonationCredential | BadgeCredential) {
  const key = `vc_${did}`;
  const existing = localStorage.getItem(key);
  const credentials = existing ? JSON.parse(existing) : [];
  credentials.push(credential);
  localStorage.setItem(key, JSON.stringify(credentials));
}

/**
 * localStorage에서 VC 조회
 */
export function getCredentials(did: string): Array<DonationCredential | BadgeCredential> {
  const key = `vc_${did}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}
