import { useState } from 'react';
import { ArrowLeft, Trash2, Calendar, TrendingUp, X, Edit } from 'lucide-react';
import { Button, Card, Input } from '../../components/common';
import { Textarea } from '../../components/ui/textarea';
import type { Campaign } from '../../types';

interface AdminDonationListProps {
  campaigns: Campaign[];
  onBack: () => void;
  onDelete: (campaignId: string) => void;
  onUpdate: (campaignId: string, updates: Partial<Campaign>) => void;
}

export function AdminDonationList({ campaigns, onBack, onDelete, onUpdate }: AdminDonationListProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Campaign | null>(null);

  const handleCardClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setEditForm(campaign);
    setEditMode(false);
  };

  const handleCloseModal = () => {
    setSelectedCampaign(null);
    setEditMode(false);
    setEditForm(null);
  };

  const handleDelete = (campaignId: string, campaignTitle: string) => {
    if (window.confirm(`"${campaignTitle}" 캠페인을 삭제하시겠습니까?`)) {
      onDelete(campaignId);
      handleCloseModal();
    }
  };

  const handleEditChange = (key: keyof Campaign, value: string | number) => {
    if (editForm) {
      setEditForm({ ...editForm, [key]: value });
    }
  };

  const handleSaveEdit = () => {
    if (editForm) {
      onUpdate(editForm.id, editForm);
      setEditMode(false);
      setSelectedCampaign(editForm);
    }
  };

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{
        background: 'linear-gradient(135deg, #E0F2FE, #DCFCE7)',
      }}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            className="px-3 py-2"
          >
            <div className="flex items-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" />
              대시보드로
            </div>
          </Button>
        </div>

        {/* 타이틀 */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            기부 리스트 관리
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            작성한 기부 폼 내역을 확인하고 관리할 수 있습니다
          </p>
        </div>

        {/* 캠페인 목록 */}
        {campaigns.length === 0 ? (
          <Card padding="lg" className="text-center py-16">
            <p className="text-[var(--color-text-secondary)]">
              아직 작성한 기부 캠페인이 없습니다
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => {
              const percentage = Math.min(
                Math.round((campaign.currentAmount / campaign.goalAmount) * 100),
                100
              );

              // 마감날짜 계산
              let daysLeft = 0;
              if (campaign.deadline) {
                const deadlineDate = new Date(campaign.deadline);
                daysLeft = Math.ceil((deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              }

              return (
                <Card
                  key={campaign.id}
                  padding="none"
                  className="overflow-hidden shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
                  onClick={() => handleCardClick(campaign)}
                >
                  {/* 이미지 */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={campaign.imageUrl}
                      alt={campaign.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400';
                      }}
                    />
                  </div>

                  {/* 내용 */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] line-clamp-2">
                      {campaign.title}
                    </h3>

                    {/* 마감날짜 */}
                    <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {campaign.deadline
                          ? (daysLeft > 0 ? `D-${daysLeft}` : '마감됨')
                          : '기한 없음'}
                      </span>
                    </div>

                    {/* 달성도 */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-[var(--color-text-secondary)]">
                          <TrendingUp className="w-4 h-4" />
                          <span>달성도</span>
                        </div>
                        <span className="font-semibold text-[var(--color-brand-primary)]">
                          {percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-[var(--color-brand-primary)] transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-[var(--color-text-tertiary)]">
                        <span>{campaign.currentAmount.toLocaleString()} ETH</span>
                        <span>{campaign.goalAmount.toLocaleString()} ETH</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {selectedCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b border-green-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-green-800">
                {editMode ? '캠페인 수정' : '캠페인 상세'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {!editMode ? (
                // 보기 모드
                <div className="space-y-6">
                  {/* 이미지 */}
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={selectedCampaign.imageUrl}
                      alt={selectedCampaign.title}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400';
                      }}
                    />
                  </div>

                  {/* 정보 */}
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-2xl">
                      <p className="text-green-600 text-sm mb-1">기관명</p>
                      <p className="text-green-800 font-semibold">{selectedCampaign.organizationName}</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-2xl">
                      <p className="text-green-600 text-sm mb-1">캠페인 제목</p>
                      <p className="text-green-800 font-semibold">{selectedCampaign.title}</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-2xl">
                      <p className="text-green-600 text-sm mb-1">카테고리</p>
                      <p className="text-green-800">{selectedCampaign.category}</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-2xl">
                      <p className="text-green-600 text-sm mb-1">목표 금액</p>
                      <p className="text-green-800 font-semibold">{selectedCampaign.goalAmount} ETH</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-2xl">
                      <p className="text-green-600 text-sm mb-1">현재 금액</p>
                      <p className="text-green-800 font-semibold">{selectedCampaign.currentAmount} ETH</p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-2xl">
                      <p className="text-green-600 text-sm mb-1">마감일</p>
                      <p className="text-green-800 font-semibold">
                        {selectedCampaign.deadline
                          ? new Date(selectedCampaign.deadline).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          : '설정 안 됨'}
                      </p>
                    </div>

                    <div className="p-4 bg-green-50 rounded-2xl">
                      <p className="text-green-600 text-sm mb-1">캠페인 설명</p>
                      <p className="text-green-800 whitespace-pre-line">{selectedCampaign.description}</p>
                    </div>
                  </div>

                  {/* 버튼들 */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      수정하기
                    </button>
                    <button
                      onClick={() => handleDelete(selectedCampaign.id, selectedCampaign.title)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제하기
                    </button>
                  </div>
                </div>
              ) : (
                // 수정 모드
                editForm && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-green-700 mb-2">기관명</label>
                      <Input
                        value={editForm.organizationName}
                        onChange={(e) => handleEditChange('organizationName', e.target.value)}
                        placeholder="기관명 입력"
                      />
                    </div>

                    <div>
                      <label className="block text-green-700 mb-2">캠페인 제목</label>
                      <Input
                        value={editForm.title}
                        onChange={(e) => handleEditChange('title', e.target.value)}
                        placeholder="제목 입력"
                      />
                    </div>

                    <div>
                      <label className="block text-green-700 mb-2">카테고리</label>
                      <select
                        value={editForm.category}
                        onChange={(e) => handleEditChange('category', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-400 focus:outline-none"
                      >
                        <option value="동물">동물</option>
                        <option value="환경">환경</option>
                        <option value="교육">교육</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-green-700 mb-2">목표 금액 (ETH)</label>
                      <Input
                        type="number"
                        step="0.001"
                        value={editForm.goalAmount}
                        onChange={(e) => handleEditChange('goalAmount', parseFloat(e.target.value))}
                        placeholder="목표 금액 입력"
                      />
                    </div>

                    <div>
                      <label className="block text-green-700 mb-2">마감일</label>
                      <Input
                        type="date"
                        value={editForm.deadline || ''}
                        onChange={(e) => handleEditChange('deadline', e.target.value)}
                        placeholder="마감일 선택"
                      />
                      {editForm.deadline && (
                        <p className="text-sm text-green-600 mt-2">
                          마감일: {new Date(editForm.deadline).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-green-700 mb-2">이미지 URL</label>
                      <Input
                        value={editForm.imageUrl}
                        onChange={(e) => handleEditChange('imageUrl', e.target.value)}
                        placeholder="이미지 URL 입력"
                      />
                    </div>

                    <div>
                      <label className="block text-green-700 mb-2">캠페인 설명</label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => handleEditChange('description', e.target.value)}
                        placeholder="캠페인 설명 입력"
                        className="bg-white min-h-[150px]"
                      />
                    </div>

                    {/* 미리보기 */}
                    {editForm.imageUrl && (
                      <div>
                        <p className="text-green-700 text-sm mb-2">이미지 미리보기</p>
                        <img
                          src={editForm.imageUrl}
                          alt="미리보기"
                          className="w-full h-48 object-cover rounded-2xl"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400';
                          }}
                        />
                      </div>
                    )}

                    {/* 버튼들 */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setEditMode(false)}
                        className="flex-1 border-2 border-green-300 hover:bg-green-50 text-green-700 py-3 rounded-2xl transition-colors"
                      >
                        취소
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl transition-colors"
                      >
                        저장하기
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
