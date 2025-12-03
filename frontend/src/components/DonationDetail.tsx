import { ArrowLeft, ExternalLink } from 'lucide-react';
import { getTxExplorerUrl } from '../lib/contract';

interface DonationDetailProps {
  campaignName: string;
  organizationName: string;
  amount: number;
  txHash: string;
  certificateUrl?: string;
  onClose: () => void;
}

interface FlowStep {
  stage: string;
  amount: number;
  color: string;
  icon: string;
  title: string;
  description?: string;
  txHash?: string;
  timestamp?: string;
  status: 'completed' | 'pending' | 'upcoming';
}

const isMockTransaction = (txHash: string) => {
  return txHash.includes('...') || txHash.length < 66;
};

const openBlockExplorer = (txHash: string) => {
  if (isMockTransaction(txHash)) {
    alert('⚠️ 개발 모드: Mock 데이터입니다.\n\n실제 블록체인 연동을 위해서는:\n1. Hardhat으로 스마트 컨트랙트를 Arbitrum L2에 배포\n2. 환경 변수 설정\n3. /lib/api.ts에서 ENABLE_BACKEND = true로 변경\n\n그러면 실제 트랜잭션 해시가 생성되어 Arbiscan(Arbitrum)에서 확인 가능합니다.');
    return;
  }
  window.open(getTxExplorerUrl(txHash), '_blank', 'noopener,noreferrer');
};

export function DonationDetail({
  campaignName,
  organizationName,
  amount,
  txHash,
  certificateUrl,
  onClose,
}: DonationDetailProps) {
  const nowIso = new Date().toISOString();
  const displayHash =
    txHash.length > 16 ? `${txHash.slice(0, 10)}...${txHash.slice(-6)}` : txHash;

  const flowSteps: FlowStep[] = [
    {
      stage: '모금',
      amount,
      color: '#FFC0CB',
      icon: '💝',
      title: '기부 완료',
      description: `${campaignName}에 기부되었습니다.`,
      txHash,
      timestamp: nowIso,
      status: 'completed',
    },
    {
      stage: '원장',
      amount,
      color: '#B5E8E0',
      icon: '🧾',
      title: '블록체인 기록',
      description: 'Arbitrum Sepolia 원장에 기록되었습니다.',
      txHash,
      timestamp: nowIso,
      status: 'completed',
    },
    {
      stage: '증명서',
      amount,
      color: '#E6E6FA',
      icon: '📜',
      title: '기부 증명서',
      description: certificateUrl
        ? 'IPFS에 업로드된 증명서를 통해 검증 가능합니다.'
        : '증명서 발급을 준비 중입니다.',
      txHash: certificateUrl,
      timestamp: nowIso,
      status: certificateUrl ? 'completed' : 'pending',
    },
  ];

  return (
    <div className="min-h-screen p-4 pb-24 bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="max-w-3xl mx-auto mb-6">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          기부 내역으로 돌아가기
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-blue-300">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-blue-800 mb-2">기부 트랜잭션</h1>
              <p className="text-blue-600 text-sm font-mono break-all">#{displayHash}</p>
            </div>
            {certificateUrl && (
              <a
                href={certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm hover:bg-blue-100 transition-colors inline-flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                증명서(IPFS)
              </a>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t-2 border-blue-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white">
              👤
            </div>
            <div>
              <p className="text-blue-800 font-semibold">{organizationName}</p>
              <p className="text-blue-600 text-sm">{campaignName}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-blue-200">
          <h2 className="text-blue-800 mb-6">💸 기부금 흐름</h2>

          <div className="space-y-6">
            {flowSteps.map((step, index) => (
              <div key={index} className="relative">
                {index < flowSteps.length - 1 && (
                  <div
                    className="absolute left-6 top-14 bottom-0 w-1 bg-gradient-to-b from-gray-300 to-transparent"
                    style={{ height: 'calc(100% + 1.5rem)' }}
                  ></div>
                )}

                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-white relative z-10"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.icon}
                    </div>
                  </div>

                  <div className="flex-1">
                    <div
                      className="rounded-2xl p-4 shadow-md border-2"
                      style={{
                        backgroundColor: `${step.color}33`,
                        borderColor: step.color,
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span
                            className="inline-block px-3 py-1 rounded-lg text-sm font-semibold mb-2"
                            style={{ backgroundColor: step.color, color: '#333' }}
                          >
                            {step.stage}
                          </span>
                          <p className="text-gray-800 font-semibold">{step.title}</p>
                        </div>
                        <p
                          className="font-bold text-lg"
                          style={{ color: step.color === '#FFFACD' ? '#DAA520' : '#666' }}
                        >
                          {step.amount.toLocaleString()}원
                        </p>
                      </div>

                      {step.description && (
                        <p className="text-gray-700 text-sm mb-3">{step.description}</p>
                      )}

                      {step.txHash && (
                        <div className="flex items-center gap-2 text-blue-700 text-xs">
                          <span className="font-mono break-all">{step.txHash}</span>
                          <button
                            className="inline-flex items-center gap-1 underline"
                            onClick={() => openBlockExplorer(step.txHash!)}
                          >
                            <ExternalLink className="w-3 h-3" />
                            블록체인에서 보기
                          </button>
                        </div>
                      )}

                      {step.timestamp && (
                        <p className="text-gray-500 text-xs mt-2">
                          {new Date(step.timestamp).toLocaleString('ko-KR')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
