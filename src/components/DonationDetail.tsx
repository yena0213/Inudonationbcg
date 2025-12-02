import { ArrowLeft, ExternalLink, AlertTriangle } from 'lucide-react';
import type { Donation } from '../App';

interface DonationDetailProps {
  donation: Donation;
  onBack: () => void;
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
  imageUrl?: string;
  status: 'completed' | 'pending' | 'upcoming';
}

// Arbitrum L2 블록체인 탐색기 URL
const ARBISCAN_URL = 'https://arbiscan.io/tx/';

// Mock 데이터 체크 (실제 트랜잭션 해시는 0x로 시작하고 66자)
const isMockTransaction = (txHash: string) => {
  return txHash.includes('...') || txHash.length < 66;
};

const openBlockExplorer = (txHash: string) => {
  if (isMockTransaction(txHash)) {
    alert('⚠️ 개발 모드: Mock 데이터입니다.\n\n실제 블록체인 연동을 위해서는:\n1. Hardhat으로 스마트 컨트랙트를 Arbitrum L2에 배포\n2. 환경 변수 설정\n3. /lib/api.ts에서 ENABLE_BACKEND = true로 변경\n\n그러면 실제 트랜잭션 해시가 생성되어 Arbiscan에서 확인 가능합니다.');
    return;
  }
  window.open(`${ARBISCAN_URL}${txHash}`, '_blank', 'noopener,noreferrer');
};

export function DonationDetail({ donation, onBack }: DonationDetailProps) {
  // Guard clause: donation이 없으면 에러 메시지 표시
  if (!donation) {
    return (
      <div className="min-h-screen p-4 pb-24 bg-gradient-to-b from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-700 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            돌아가기
          </button>
          <div className="bg-white rounded-3xl shadow-xl p-12 border-4 border-red-300 text-center">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-red-800 mb-2">기부 내역을 찾을 수 없어요</h2>
            <p className="text-red-600">잘못된 접근이거나 데이터가 삭제되었어요.</p>
          </div>
        </div>
      </div>
    );
  }

  // Mock flow data - 실제로는 백엔드에서 가져올 데이터
  const flowSteps: FlowStep[] = [
    {
      stage: '모금',
      amount: donation.amount,
      color: '#FFC0CB',
      icon: '💝',
      title: '기부금 전달',
      description: `[백패킹 기부] 아이에게 크리스마스 선물을 줄 수 있을까요?`,
      txHash: donation.txHash,
      timestamp: donation.timestamp,
      imageUrl: 'https://images.unsplash.com/photo-1607827448452-6fda561309ce?w=300&h=200&fit=crop',
      status: 'completed'
    },
    {
      stage: '단체',
      amount: donation.amount,
      color: '#FFB347',
      icon: '🏢',
      title: '모금액 전달',
      description: '모금액 전달 신민법인지미넥인터내셔널',
      txHash: '0x' + Math.random().toString(36).substring(2, 15),
      timestamp: new Date(new Date(donation.timestamp).getTime() + 86400000).toISOString(),
      status: 'completed'
    },
    {
      stage: '지출',
      amount: donation.amount,
      color: '#FFFACD',
      icon: '💳',
      title: '기부금 사용',
      description: '나눔터번역이 모금된 체육복으로 힘든 이웃들에게 겨울옷을 입혔습니다.',
      timestamp: new Date(new Date(donation.timestamp).getTime() + 172800000).toISOString(),
      status: 'completed'
    },
    {
      stage: '보고',
      amount: donation.amount,
      color: '#E6E6FA',
      icon: '📋',
      title: '결과 보고',
      description: '나눔터번역이 모금액 사용결과 사진을 남겼습니다.',
      status: 'completed'
    }
  ];

  return (
    <div className="min-h-screen p-4 pb-24 bg-gradient-to-b from-blue-50 to-purple-50">
      {/* Header */}
      <div className="max-w-3xl mx-auto mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-700 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          기부 내역으로 돌아가기
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-blue-300">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="text-blue-800 mb-2">기부일련번호</h1>
              <p className="text-blue-600 text-sm font-mono">#{donation.id.toUpperCase()}</p>
            </div>
            <button className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm hover:bg-blue-100 transition-colors">
              기부증서
            </button>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t-2 border-blue-100">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white">
              👤
            </div>
            <div>
              <p className="text-blue-800 font-semibold">익명의 기부자</p>
              <p className="text-blue-600 text-sm">{donation.organizationName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flow Timeline */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-blue-200">
          <h2 className="text-blue-800 mb-6">💸 기부금 흐름</h2>

          <div className="space-y-6">
            {flowSteps.map((step, index) => (
              <div key={index} className="relative">
                {/* Vertical line */}
                {index < flowSteps.length - 1 && (
                  <div 
                    className="absolute left-6 top-14 bottom-0 w-1 bg-gradient-to-b from-gray-300 to-transparent"
                    style={{ height: 'calc(100% + 1.5rem)' }}
                  ></div>
                )}

                <div className="flex gap-4">
                  {/* Stage badge */}
                  <div className="flex-shrink-0">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl shadow-lg border-4 border-white relative z-10"
                      style={{ backgroundColor: step.color }}
                    >
                      {step.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div 
                      className="rounded-2xl p-4 shadow-md border-2"
                      style={{ 
                        backgroundColor: `${step.color}33`,
                        borderColor: step.color
                      }}
                    >
                      {/* Stage and amount */}
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

                      {/* Description */}
                      {step.description && (
                        <p className="text-gray-700 text-sm mb-3">{step.description}</p>
                      )}

                      {/* Image if exists */}
                      {step.imageUrl && (
                        <div className="mb-3">
                          <img 
                            src={step.imageUrl} 
                            alt={step.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}

                      {/* Transaction details */}
                      {step.txHash && (
                        <div className="bg-white/60 rounded-lg p-3 mt-3">
                          <p className="text-gray-600 text-xs mb-1">트랜잭션 해시</p>
                          <div className="flex items-center gap-2">
                            <p className="text-blue-600 text-xs font-mono flex-1 truncate">
                              {step.txHash}
                            </p>
                            <button className="text-blue-600 hover:text-blue-700" onClick={() => openBlockExplorer(step.txHash!)}>
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                          {step.timestamp && (
                            <p className="text-gray-500 text-xs mt-1">
                              {new Date(step.timestamp).toLocaleString('ko-KR', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                              })}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Status indicator */}
                      {step.status === 'completed' && (
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-green-600 text-xs">✓ 완료</span>
                        </div>
                      )}
                      {step.status === 'pending' && (
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-orange-600 text-xs">⏳ 진행중</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info box */}
        <div className="mt-6 bg-white/90 backdrop-blur rounded-2xl shadow-lg p-4 border-2 border-green-200">
          <p className="text-green-800 text-sm mb-2">🔗 블록체인 투명성</p>
          <p className="text-green-700 text-sm">
            모든 기부 내역은 블록체인에 영구 기록되며, 공개 탐색기에서 누구나 확인할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
}