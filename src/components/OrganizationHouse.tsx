import { ArrowLeft, Heart, ExternalLink } from 'lucide-react';
import type { Campaign } from '../App';

interface OrganizationHouseProps {
  campaign: Campaign;
  onBack: () => void;
  onDonate: () => void;
}

export function OrganizationHouse({ campaign, onBack, onDonate }: OrganizationHouseProps) {
  const progressPercent = Math.round((campaign.currentAmount / campaign.goalAmount) * 100);

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-green-700 hover:text-green-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          마을로 돌아가기
        </button>
      </div>

      {/* House interior */}
      <div className="max-w-4xl mx-auto">
        <div
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4"
          style={{ borderColor: campaign.houseColor }}
        >
          {/* Campaign image */}
          <div className="relative h-64 overflow-hidden">
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full">
              <span className="text-green-800">#{campaign.category}</span>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shrink-0"
                style={{ backgroundColor: `${campaign.houseColor}33` }}
              >
                {campaign.category === '동물' && '🐾'}
                {campaign.category === '환경' && '🌳'}
                {campaign.category === '교육' && '📚'}
              </div>
              <div className="flex-1">
                <h2 className="text-green-800 mb-1">{campaign.organizationName}</h2>
                <h1 className="text-green-900">{campaign.title}</h1>
              </div>
            </div>

            <p className="text-green-700 mb-8 leading-relaxed">
              {campaign.description}
            </p>

            {/* Progress */}
            <div className="bg-green-50 rounded-2xl p-6 mb-6">
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p className="text-green-600 text-sm mb-1">현재 모금액</p>
                  <p className="text-green-800">
                    {(campaign.currentAmount / 10000).toFixed(0)}만원
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-green-600 text-sm mb-1">목표 금액</p>
                  <p className="text-green-800">
                    {(campaign.goalAmount / 10000).toFixed(0)}만원
                  </p>
                </div>
              </div>
              <div className="w-full h-4 bg-white rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-green-400 transition-all rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-green-600 text-center">{progressPercent}% 달성</p>
            </div>

            {/* Donation button */}
            <button
              onClick={onDonate}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-2xl transition-colors flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              이 캠페인에 기부하기
            </button>

            {/* Blockchain info */}
            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
              <p className="text-blue-800 mb-2">🔗 블록체인 투명성</p>
              <p className="text-blue-700 text-sm mb-3">
                모든 기부 내역은 Layer 2 블록체인에 영구 기록되며,
                누구나 공개 탐색기에서 확인할 수 있습니다.
              </p>
              <button className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                <ExternalLink className="w-4 h-4" />
                블록 탐색기에서 보기 (예시)
              </button>
            </div>

            {/* Benefits */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
              <p className="text-yellow-800 mb-2">🎁 기부 혜택</p>
              <ul className="space-y-1 text-yellow-700 text-sm">
                <li>✨ 기부 금액만큼 포인트를 즉시 받아요</li>
                <li>🎖️ 기부 횟수와 금액에 따라 뱃지를 획득해요</li>
                <li>🏠 포인트로 내 집을 꾸밀 수 있어요</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
