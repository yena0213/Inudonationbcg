import { ArrowLeft, Heart, ExternalLink } from 'lucide-react';
import { Campaign } from '../types';
import { Button, Card, Container } from './common';

interface OrganizationHouseProps {
  campaign: Campaign;
  onBack: () => void;
  onDonate: () => void;
}

export function OrganizationHouse({ campaign, onBack, onDonate }: OrganizationHouseProps) {
  const progressPercent = Math.round((campaign.currentAmount / campaign.goalAmount) * 100);

  return (
    <div 
      className="min-h-screen p-4"
      style={{ background: 'linear-gradient(135deg, var(--color-bg-primary), var(--color-bg-secondary))' }}
    >
      {/* Header */}
      <Container maxWidth="lg" className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 hover:opacity-80"
          style={{
            color: 'var(--color-brand-secondary)',
            transition: 'var(--transition-base)',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          마을로 돌아가기
        </button>
      </Container>

      {/* House interior */}
      <Container maxWidth="lg">
        <Card 
          padding="lg" 
          className="overflow-hidden border-4 animate-fade-in"
          style={{ 
            borderColor: campaign.houseColor,
            boxShadow: 'var(--shadow-2xl)',
          }}
        >
          {/* Campaign image */}
          <div className="relative h-64 overflow-hidden -m-8 mb-8">
            <img
              src={campaign.imageUrl}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
            <div 
              className="absolute top-4 right-4 backdrop-blur px-4 py-2"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 'var(--radius-full)',
              }}
            >
              <span style={{ color: 'var(--color-brand-dark)' }}>
                #{campaign.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-16 h-16 flex items-center justify-center text-3xl shrink-0"
                style={{ 
                  backgroundColor: `${campaign.houseColor}33`,
                  borderRadius: 'var(--radius-xl)',
                }}
              >
                {campaign.category === '동물' && '🐾'}
                {campaign.category === '환경' && '🌳'}
                {campaign.category === '교육' && '📚'}
              </div>
              <div className="flex-1">
                <h2 
                  className="mb-1"
                  style={{ 
                    color: 'var(--color-brand-dark)',
                    fontSize: 'var(--font-size-lg)',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  {campaign.organizationName}
                </h2>
                <h1 
                  style={{ 
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-2xl)',
                    fontWeight: 'var(--font-weight-bold)',
                  }}
                >
                  {campaign.title}
                </h1>
              </div>
            </div>

            <p 
              className="mb-8"
              style={{ 
                color: 'var(--color-text-secondary)',
                lineHeight: 'var(--line-height-relaxed)',
              }}
            >
              {campaign.description}
            </p>

            {/* Progress */}
            <div 
              className="p-6 mb-6"
              style={{
                backgroundColor: '#F0FDF4',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <div className="flex justify-between items-end mb-3">
                <div>
                  <p 
                    className="text-sm mb-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    현재 모금액
                  </p>
                  <p 
                    style={{ 
                      color: 'var(--color-brand-dark)',
                      fontSize: 'var(--font-size-xl)',
                      fontWeight: 'var(--font-weight-bold)',
                    }}
                  >
                    {(campaign.currentAmount / 10000).toFixed(0)}만원
                  </p>
                </div>
                <div className="text-right">
                  <p 
                    className="text-sm mb-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    목표 금액
                  </p>
                  <p 
                    style={{ 
                      color: 'var(--color-brand-dark)',
                      fontSize: 'var(--font-size-xl)',
                      fontWeight: 'var(--font-weight-bold)',
                    }}
                  >
                    {(campaign.goalAmount / 10000).toFixed(0)}만원
                  </p>
                </div>
              </div>
              <div 
                className="w-full h-4 overflow-hidden mb-2"
                style={{
                  backgroundColor: 'white',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                <div
                  className="h-full transition-all"
                  style={{ 
                    width: `${progressPercent}%`,
                    backgroundColor: 'var(--color-brand-primary)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'var(--transition-base)',
                  }}
                />
              </div>
              <p 
                className="text-center"
                style={{ 
                  color: 'var(--color-brand-secondary)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                {progressPercent}% 달성
              </p>
            </div>

            {/* Donation button */}
            <Button
              onClick={onDonate}
              variant="primary"
              size="lg"
              fullWidth
              className="flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))',
              }}
            >
              <Heart className="w-5 h-5" />
              이 캠페인에 기부하기
            </Button>

            {/* Blockchain info */}
            <div 
              className="mt-6 p-4 border-2"
              style={{
                backgroundColor: '#EFF6FF',
                borderColor: '#BFDBFE',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <p 
                className="mb-2"
                style={{ 
                  color: '#1E40AF',
                  fontWeight: 'var(--font-weight-semibold)',
                }}
              >
                🔗 블록체인 투명성
              </p>
              <p 
                className="text-sm mb-3"
                style={{ color: '#1D4ED8' }}
              >
                모든 기부 내역은 Layer 2 블록체인에 영구 기록되며,
                누구나 공개 탐색기에서 확인할 수 있습니다.
              </p>
              <button 
                className="flex items-center gap-2 text-sm hover:opacity-80"
                style={{ 
                  color: '#2563EB',
                  transition: 'var(--transition-base)',
                }}
              >
                <ExternalLink className="w-4 h-4" />
                블록 탐색기에서 보기 (예시)
              </button>
            </div>

            {/* Benefits */}
            <div 
              className="mt-6 p-4 border-2"
              style={{
                backgroundColor: '#FFFBEB',
                borderColor: '#FDE68A',
                borderRadius: 'var(--radius-xl)',
              }}
            >
              <p 
                className="mb-2"
                style={{ 
                  color: '#92400E',
                  fontWeight: 'var(--font-weight-semibold)',
                }}
              >
                🎁 기부 혜택
              </p>
              <ul className="space-y-1 text-sm" style={{ color: '#B45309' }}>
                <li>✨ 기부 금액만큼 포인트를 즉시 받아요</li>
                <li>🎖️ 기부 횟수와 금액에 따라 뱃지를 획득해요</li>
                <li>🏠 포인트로 내 집을 꾸밀 수 있어요</li>
              </ul>
            </div>
          </div>
        </Card>
      </Container>
    </div>
  );
}
