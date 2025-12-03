import { useState } from 'react';
import { ArrowLeft, Upload, FileCheck, ExternalLink, Send } from 'lucide-react';
import { Button, Card, Input } from '../../components/common';
import { Textarea } from '../../components/ui/textarea';
import type { Campaign } from '../../types';

interface AdminCertificateSubmissionProps {
  campaigns: Campaign[];
  onBack: () => void;
}

interface SelectedCampaign extends Campaign {
  isExpired: boolean;
}

export function AdminCertificateSubmission({ campaigns, onBack }: AdminCertificateSubmissionProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<SelectedCampaign | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ cid: string; url: string; txHash: string } | null>(null);

  // 만료된 캠페인 필터링 (목표 달성 100% 이상)
  const expiredCampaigns: SelectedCampaign[] = campaigns
    .filter((c) => (c.currentAmount / c.goalAmount) * 100 >= 100)
    .map((c) => ({ ...c, isExpired: true }));

  const handleCampaignSelect = (campaign: SelectedCampaign) => {
    setSelectedCampaign(campaign);
    setUploadResult(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCampaign || !certificateFile) {
      alert('캠페인과 증명서 파일을 모두 선택해주세요.');
      return;
    }

    setUploading(true);

    try {
      // IPFS 업로드 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const cid = `bafybei${Math.random().toString(36).slice(2, 15)}`;
      const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
      const txHash = `0x${Math.random().toString(16).slice(2, 66)}`;

      setUploadResult({ cid, url, txHash });
      alert('증명서가 성공적으로 제출되었습니다!');

      // 폼 초기화
      setCertificateFile(null);
      setDescription('');
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('증명서 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
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
            기부내역서 제출
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            만료된 기부 내역에 대한 증빙서를 IPFS에 제출합니다
          </p>
        </div>

        {/* 만료된 캠페인 목록 */}
        {expiredCampaigns.length === 0 ? (
          <Card padding="lg" className="text-center py-16">
            <p className="text-[var(--color-text-secondary)]">
              목표를 달성한 캠페인이 없습니다
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expiredCampaigns.map((campaign) => {
              const percentage = Math.min(
                Math.round((campaign.currentAmount / campaign.goalAmount) * 100),
                100
              );

              return (
                <Card
                  key={campaign.id}
                  padding="none"
                  className={`overflow-hidden shadow-lg cursor-pointer transition-all ${
                    selectedCampaign?.id === campaign.id
                      ? 'ring-4 ring-[var(--color-brand-primary)]'
                      : 'hover:shadow-xl'
                  }`}
                  onClick={() => handleCampaignSelect(campaign)}
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
                    <div className="absolute top-2 right-2">
                      <button
                        className="px-3 py-1 bg-green-500 text-white text-xs rounded-full shadow-lg"
                      >
                        목표 달성
                      </button>
                    </div>
                  </div>

                  {/* 내용 */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-lg font-bold text-[var(--color-text-primary)] line-clamp-2">
                      {campaign.title}
                    </h3>

                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2">
                      {campaign.description}
                    </p>

                    {/* 달성도 */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--color-text-secondary)]">달성도</span>
                        <span className="font-semibold text-green-600">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    {selectedCampaign?.id === campaign.id && (
                      <div className="pt-2">
                        <Button type="button" size="sm" className="w-full">
                          증명서 제출하기
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* 증명서 제출 폼 */}
        {selectedCampaign && (
          <Card padding="lg" className="shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-brand-light)]">
                <FileCheck className="w-6 h-6 text-[var(--color-brand-primary)]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                  {selectedCampaign.title}
                </h2>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  기부 사용 증명서 제출
                </p>
              </div>
            </div>

            {/* 캠페인 정보 */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-2">
              <div className="flex items-start gap-3">
                <img
                  src={selectedCampaign.imageUrl}
                  alt={selectedCampaign.title}
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-bold text-[var(--color-text-primary)]">
                    {selectedCampaign.title}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mt-1 line-clamp-3">
                    {selectedCampaign.description}
                  </p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 증명서 파일 업로드 */}
              <div>
                <label className="block text-[var(--color-text-primary)] mb-2">
                  증명서 파일 (PDF, 이미지, 영수증 등)
                </label>
                <label className="cursor-pointer block">
                  <div className="flex items-center gap-3 p-4 border-2 border-dashed border-[var(--color-border-light)] rounded-xl hover:border-[var(--color-brand-primary)] transition-colors">
                    <Upload className="w-6 h-6 text-[var(--color-text-secondary)]" />
                    <div className="flex-1">
                      <p className="text-sm text-[var(--color-text-primary)]">
                        {certificateFile ? certificateFile.name : '파일 선택 (클릭)'}
                      </p>
                      <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                        PDF, JPG, PNG 등 증빙 자료를 업로드하세요
                      </p>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* 상세 설명 */}
              <div>
                <label className="block text-[var(--color-text-primary)] mb-2">
                  사용 내역 설명 (선택)
                </label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="기부금이 어떻게 사용되었는지 간단히 설명해주세요. (예: 물품 구매, 서비스 제공 등)"
                  className="bg-white min-h-[120px]"
                />
              </div>

              {/* 제출 버튼 */}
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    setSelectedCampaign(null);
                    setCertificateFile(null);
                    setDescription('');
                    setUploadResult(null);
                  }}
                >
                  취소
                </Button>
                <Button type="submit" disabled={uploading || !certificateFile}>
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    {uploading ? 'IPFS에 업로드 중...' : '증명서 제출'}
                  </div>
                </Button>
              </div>
            </form>

            {/* 업로드 결과 */}
            {uploadResult && (
              <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-200 space-y-3">
                <div className="flex items-center gap-2 text-green-700">
                  <FileCheck className="w-5 h-5" />
                  <span className="font-semibold">제출 완료!</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-[var(--color-text-secondary)]">IPFS CID: </span>
                    <span className="font-mono text-[var(--color-text-primary)]">
                      {uploadResult.cid}
                    </span>
                  </div>
                  <div>
                    <span className="text-[var(--color-text-secondary)]">Transaction Hash: </span>
                    <span className="font-mono text-[var(--color-text-primary)]">
                      {uploadResult.txHash}
                    </span>
                  </div>
                  <a
                    href={uploadResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[var(--color-brand-primary)] hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    IPFS에서 보기
                  </a>
                </div>
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
