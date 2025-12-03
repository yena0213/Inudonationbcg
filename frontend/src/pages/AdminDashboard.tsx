import { useState } from 'react';
import { ArrowLeft, ClipboardList, FileText, FileCheck, DollarSign } from 'lucide-react';
import { Button, Card } from '../components/common';
import { useAuth } from '../lib/auth-context';
import { AdminDonationList } from './admin/AdminDonationList';
import { AdminDonationForm } from './admin/AdminDonationForm';
import { AdminCertificateSubmission } from './admin/AdminCertificateSubmission';
import { AdminWithdrawal } from './admin/AdminWithdrawal';
import type { Campaign } from '../types';

interface AdminDashboardProps {
  onBack: () => void;
  campaigns: Campaign[];
  onCampaignCreate: (campaign: Campaign) => void;
  onCampaignDelete: (campaignId: string) => void;
  onCampaignUpdate: (campaignId: string, updates: Partial<Campaign>) => void;
}

type AdminView = 'main' | 'list' | 'form' | 'certificate' | 'withdrawal';

export function AdminDashboard({ onBack, campaigns, onCampaignCreate, onCampaignDelete, onCampaignUpdate }: AdminDashboardProps) {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<AdminView>('main');

  const handleBackToMain = () => setCurrentView('main');

  if (currentView === 'list') {
    return (
      <AdminDonationList
        campaigns={campaigns}
        onBack={handleBackToMain}
        onDelete={onCampaignDelete}
        onUpdate={onCampaignUpdate}
      />
    );
  }

  if (currentView === 'form') {
    return (
      <AdminDonationForm
        onBack={handleBackToMain}
        onCreate={onCampaignCreate}
      />
    );
  }

  if (currentView === 'certificate') {
    return (
      <AdminCertificateSubmission
        campaigns={campaigns}
        onBack={handleBackToMain}
      />
    );
  }

  if (currentView === 'withdrawal') {
    return (
      <AdminWithdrawal
        onBack={handleBackToMain}
      />
    );
  }

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{
        background: 'linear-gradient(135deg, #E0F2FE, #DCFCE7)',
      }}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={onBack}
              className="px-3 py-2"
            >
              <div className="flex items-center gap-2 text-sm">
                <ArrowLeft className="w-4 h-4" />
                마을로 돌아가기
              </div>
            </Button>
          </div>
          <div className="text-sm text-[var(--color-text-secondary)]">
            {user?.email} / {user?.walletAddress?.slice(0, 6)}...{user?.walletAddress?.slice(-4)}
          </div>
        </div>

        {/* 타이틀 */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
            관리자 대시보드
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            기부 캠페인 관리, 폼 작성, 증명서 제출, 기부금 수령을 할 수 있습니다
          </p>
        </div>

        {/* 메인 버튼 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* 기부 리스트 관리 */}
          <button
            onClick={() => setCurrentView('list')}
            className="bg-white border-2 border-green-200 hover:border-green-400 hover:bg-green-50 rounded-2xl p-8 transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100">
                <ClipboardList className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-green-800">
                  기부 리스트 관리
                </h3>
                <p className="text-green-600 text-sm">
                  작성한 기부 폼 내역을 관리하고 삭제할 수 있습니다
                </p>
              </div>
            </div>
          </button>

          {/* 기부 폼 작성 */}
          <button
            onClick={() => setCurrentView('form')}
            className="bg-white border-2 border-green-200 hover:border-green-400 hover:bg-green-50 rounded-2xl p-8 transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-green-800">
                  기부 폼 작성
                </h3>
                <p className="text-green-600 text-sm">
                  새로운 기부 캠페인을 작성하고 사진을 업로드합니다
                </p>
              </div>
            </div>
          </button>

          {/* 기부내역서 제출 */}
          <button
            onClick={() => setCurrentView('certificate')}
            className="bg-white border-2 border-green-200 hover:border-green-400 hover:bg-green-50 rounded-2xl p-8 transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100">
                <FileCheck className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-green-800">
                  기부내역서 제출
                </h3>
                <p className="text-green-600 text-sm">
                  만료된 기부 내역에 대한 증빙서를 IPFS에 제출합니다
                </p>
              </div>
            </div>
          </button>

          {/* 기부금 받기 */}
          <button
            onClick={() => setCurrentView('withdrawal')}
            className="bg-white border-2 border-green-200 hover:border-green-400 hover:bg-green-50 rounded-2xl p-8 transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center bg-green-100">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-green-800">
                  기부금 받기
                </h3>
                <p className="text-green-600 text-sm">
                  받은 기부금을 원화로 환전하여 수령합니다
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
