import { useState } from 'react';
import { X, Loader2, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { ethers } from 'ethers';
import type { Campaign } from '../App';
import { CONTRACT_ADDRESS, DONATION_LEDGER_ABI, krwToEth, getTxExplorerUrl, isContractDeployed } from '../lib/contract';
import { useAuth } from '../lib/auth-context';

interface DonationModalProps {
  campaign: Campaign;
  onClose: () => void;
  onConfirm: (amount: number, txHash: string) => void;
  userWallet: string;
}

export function DonationModal({ campaign, onClose, onConfirm, userWallet }: DonationModalProps) {
  const { getEthereumSigner } = useAuth();
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'input' | 'processing' | 'success' | 'error'>('input');
  const [txHash, setTxHash] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const presetAmounts = [10000, 30000, 50000, 100000];

  const handleDonate = async () => {
    const donationAmount = parseInt(amount);
    if (!donationAmount || donationAmount <= 0) return;

    const signer = getEthereumSigner();
    
    if (!signer) {
      setErrorMessage('지갑을 찾을 수 없습니다.');
      setStatus('error');
      return;
    }

    setStatus('processing');
    setErrorMessage('');

    try {
      // 컨트랙트가 배포되어 있지 않을 경우 Mock 트랜잭션
      if (!isContractDeployed()) {
        // Mock 트랜잭션 생성 (개발용)
        console.log('⚠️ Contract not deployed. Using mock transaction.');
        console.log(`Mock donation: ${donationAmount} KRW to ${campaign.organizationName}`);
        
        alert('⚠️ 데모 모드 알림\n\n스마트 컨트랙트가 배포되지 않아 Mock 트랜잭션을 생성합니다.\n\n✅ 실제 블록체인 연동 방법:\n1. Arbitrum Sepolia에 DonationLedger 컨트랙트 배포\n2. /lib/contract.ts 파일에서 CONTRACT_ADDRESS 입력\n3. 테스트넷 ETH 준비\n\n지금은 데모로 진행합니다! 💫');
        
        const mockTxHash = '0x' + Array.from({ length: 64 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        
        setTxHash(mockTxHash);
        
        // Mock 지연 (실제 블록체인 트랜잭션 시뮬레이션)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        setStatus('success');
        setTimeout(() => {
          onConfirm(donationAmount, mockTxHash);
        }, 1500);
        
        return;
      }
      
      // 실제 블록체인 트랜잭션
      const contract = new ethers.Contract(CONTRACT_ADDRESS, DONATION_LEDGER_ABI, signer);
      
      // KRW를 ETH로 변환
      const ethAmount = krwToEth(donationAmount);
      const valueInWei = ethers.parseEther(ethAmount);
      
      console.log(`Donating ${ethAmount} ETH (${donationAmount} KRW) to ${campaign.id}`);
      
      // 기부 트랜잭션 전송
      const tx = await contract.donate(campaign.id, message || '', {
        value: valueInWei,
        gasLimit: 300000
      });
      
      console.log('Transaction sent:', tx.hash);
      setTxHash(tx.hash);
      
      // 트랜잭션 완료 대기
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        setStatus('success');
        setTimeout(() => {
          onConfirm(donationAmount, tx.hash);
        }, 2000);
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: any) {
      console.error('Donation error:', error);
      setStatus('error');
      
      if (error.code === 'ACTION_REJECTED') {
        setErrorMessage('트랜잭션이 거부되었습니다.');
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        setErrorMessage('잔액이 부족합니다. (테스트넷 ETH가 필요합니다)');
      } else {
        setErrorMessage(error.message || '기부 처리 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-green-100 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-green-800">기부하기</h2>
          <button
            onClick={onClose}
            className="text-green-600 hover:text-green-800"
            disabled={status === 'processing'}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {status === 'input' && (
            <>
              {/* Campaign info */}
              <div className="mb-6 p-4 bg-green-50 rounded-2xl">
                <p className="text-green-600 text-sm mb-1">기부 대상</p>
                <p className="text-green-800">{campaign.title}</p>
                <p className="text-green-700 text-sm mt-1">{campaign.organizationName}</p>
              </div>

              {/* Amount input */}
              <div className="mb-4">
                <label className="block text-green-700 mb-2">
                  기부 금액 (원)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="금액을 입력하세요"
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-400 focus:outline-none"
                  min="1000"
                  step="1000"
                />
              </div>

              {/* Preset amounts */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset.toString())}
                    className="py-3 border-2 border-green-200 hover:border-green-400 rounded-xl text-green-700 hover:bg-green-50 transition-colors"
                  >
                    {(preset / 10000).toFixed(0)}만원
                  </button>
                ))}
              </div>

              {/* Message input */}
              <div className="mb-6">
                <label className="block text-green-700 mb-2">
                  응원 메시지 (선택)
                </label>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="따뜻한 메시지를 남겨보세요"
                  className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-400 focus:outline-none"
                  maxLength={100}
                />
              </div>

              {/* Points info */}
              {amount && parseInt(amount) > 0 && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                  <p className="text-yellow-800 mb-1">✨ 받을 포인트</p>
                  <p className="text-yellow-700">
                    {parseInt(amount).toLocaleString()} P
                  </p>
                  <p className="text-yellow-600 text-sm mt-2">
                    기부 금액 = 포인트로 1:1 전환돼요
                  </p>
                  <p className="text-yellow-600 text-sm mt-1">
                    💱 약 {krwToEth(parseInt(amount))} ETH (Arbitrum L2)
                  </p>
                </div>
              )}

              {/* Wallet info */}
              <div className="mb-6 p-4 bg-blue-50 rounded-2xl">
                <p className="text-blue-700 text-sm mb-1">지갑 주소</p>
                <p className="text-blue-600 text-xs font-mono break-all">
                  {userWallet}
                </p>
              </div>

              {/* Confirm button */}
              <button
                onClick={handleDonate}
                disabled={!amount || parseInt(amount) <= 0}
                className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-4 rounded-2xl transition-colors"
              >
                블록체인에 기부하기
              </button>

              <p className="text-green-600 text-center text-sm mt-4">
                🔒 Arbitrum Layer2에 영구 기록됩니다
              </p>
            </>
          )}

          {status === 'processing' && (
            <div className="text-center py-8">
              <Loader2 className="w-16 h-16 text-green-500 animate-spin mx-auto mb-4" />
              <p className="text-green-800 mb-2">블록체인에 기록 중...</p>
              <p className="text-green-600 text-sm">
                Arbitrum Layer 2에 트랜잭션을 전송하고 있어요
              </p>
              {txHash && (
                <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
                  <p className="text-blue-700 text-sm mb-2">트랜잭션 해시</p>
                  <p className="text-blue-600 text-xs font-mono break-all mb-2">
                    {txHash}
                  </p>
                  <a
                    href={getTxExplorerUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Arbiscan에서 보기
                  </a>
                </div>
              )}
              <div className="mt-6 p-4 bg-green-50 rounded-2xl">
                <p className="text-green-700 text-sm">
                  💡 트랜잭션이 처리되는 동안<br />
                  잠시만 기다려주세요
                </p>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-green-800 mb-2">기부가 완료되었습니다!</p>
              <p className="text-green-600 text-sm mb-6">
                {parseInt(amount).toLocaleString()}원을 기부해주셔서 감사합니다
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                  <p className="text-yellow-800 mb-1">✨ 획득한 포인트</p>
                  <p className="text-yellow-700">
                    {parseInt(amount).toLocaleString()} P
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl">
                  <p className="text-blue-700 text-sm mb-2">트랜잭션 해시</p>
                  <p className="text-blue-600 text-xs font-mono break-all mb-2">
                    {txHash}
                  </p>
                  <a
                    href={getTxExplorerUrl(txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Arbiscan에서 확인하기
                  </a>
                  <p className="text-blue-600 text-xs mt-2">
                    ✅ 블록체인에 영구 저장되었습니다
                  </p>
                </div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-red-800 mb-2">기부 처리 중 오류가 발생했습니다</p>
              <p className="text-red-600 text-sm mb-6">
                {errorMessage || '트랜잭션이 실패했습니다. 다시 시도해주세요.'}
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => setStatus('input')}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl"
                >
                  다시 시도하기
                </button>
                <button
                  onClick={onClose}
                  className="w-full border-2 border-green-300 hover:bg-green-50 text-green-700 py-3 rounded-2xl"
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}