import { useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle, ClipboardList, ExternalLink, UploadCloud, FileCheck } from 'lucide-react';
import { Button, Card, Input } from '../components/common';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../lib/auth-context';
import type { AdminStory } from '../types';

interface AdminPageProps {
  entries: AdminStory[];
  onBack: () => void;
  onCreate: (entry: AdminStory) => void;
}

const initialForm = {
  centerName: '',
  title: '',
  organizationImage: '',
  contentImage: '',
  description: '',
  explorerLink: '',
  benefit: '',
};

export function AdminPage({ entries, onBack, onCreate }: AdminPageProps) {
  const { user } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [tab, setTab] = useState<'story' | 'certificate'>('story');
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [certificateTitle, setCertificateTitle] = useState('');
  const [certificateTx, setCertificateTx] = useState('');
  const [certificateDesc, setCertificateDesc] = useState('');
  const [uploadResult, setUploadResult] = useState<{ cid: string; url: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleChange = (key: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.centerName.trim() || !form.title.trim() || !form.description.trim()) {
      alert('센터 이름, 기부 제목, 기부 내용을 입력해주세요.');
      return;
    }

    const entry: AdminStory = {
      ...form,
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `story-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    onCreate(entry);
    setForm(initialForm);
    setStatus('success');
    setTimeout(() => setStatus('idle'), 2000);
  };

  const handleCertificateUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateFile) {
      alert('증명서 파일을 선택해주세요.');
      return;
    }
    setUploading(true);
    try {
      // 실제 IPFS 업로드 위치에 연결하기 전, 데모로 CID를 생성하여 미리보기
      const cid = `bafy${Math.random().toString(36).slice(2, 10)}`;
      const gateway = 'https://gateway.pinata.cloud/ipfs';
      const url = `${gateway}/${cid}`;
      setUploadResult({ cid, url });
      setStatus('success');
    } catch (err) {
      console.error('증명서 업로드 실패:', err);
      alert('증명서 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const latestEntry = useMemo(() => entries[0], [entries]);

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{
        background: 'linear-gradient(135deg, #E0F2FE, #DCFCE7)',
      }}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={onBack}
            className="px-3 py-2"
          >
            <div className="flex items-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" />
              돌아가기
            </div>
          </Button>
          <div className="text-sm text-[var(--color-text-secondary)]">
            {user?.email} / {user?.walletAddress?.slice(0, 6)}...{user?.walletAddress?.slice(-4)}
          </div>
        </div>

        <Card padding="lg" className="shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <button
              type="button"
              onClick={() => setTab('story')}
              className={`px-4 py-2 rounded-xl border ${tab === 'story' ? 'bg-[var(--color-brand-primary)] text-white' : 'bg-white text-[var(--color-text-primary)]'}`}
            >
              소개 페이지 작성
            </button>
            <button
              type="button"
              onClick={() => setTab('certificate')}
              className={`px-4 py-2 rounded-xl border ${tab === 'certificate' ? 'bg-[var(--color-brand-primary)] text-white' : 'bg-white text-[var(--color-text-primary)]'}`}
            >
              기부금 사용 증명서 업로드
            </button>
          </div>

          {tab === 'story' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-brand-light)]">
                  <ClipboardList className="w-5 h-5 text-[var(--color-brand-primary)]" />
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)] text-sm">기업/단체 관리자</p>
                  <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">기부 소개 페이지 작성</h2>
                </div>
                {status === 'success' && (
                  <div className="flex items-center gap-2 text-[var(--color-success)] ml-auto text-sm">
                    <CheckCircle className="w-4 h-4" />
                    저장됨
                  </div>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="센터 이름"
                    placeholder="예) 따뜻한손 재단"
                    value={form.centerName}
                    onChange={(e) => handleChange('centerName', e.target.value)}
                    required
                  />
                  <Input
                    label="기부 제목"
                    placeholder="겨울나기 지원 캠페인"
                    value={form.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="기부처 사진 URL"
                    placeholder="https://"
                    value={form.organizationImage}
                    onChange={(e) => handleChange('organizationImage', e.target.value)}
                  />
                  <Input
                    label="기부 내용 사진 URL"
                    placeholder="https://"
                    value={form.contentImage}
                    onChange={(e) => handleChange('contentImage', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="블록 탐색기 링크"
                    placeholder="https://sepolia-explorer.arbitrum.io/tx/..."
                    value={form.explorerLink}
                    onChange={(e) => handleChange('explorerLink', e.target.value)}
                  />
                  <Input
                    label="기부 혜택"
                    placeholder="예) 후원자 명패, 뉴스레터, NFT 증명 등"
                    value={form.benefit}
                    onChange={(e) => handleChange('benefit', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[var(--color-text-primary)] mb-2">
                    기부 내용
                  </label>
                  <Textarea
                    value={form.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="어떤 기부인지, 어디에 전달되는지, 필요한 금액 등을 설명해주세요."
                    className="bg-white"
                    required
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" size="lg">
                    소개 페이지 저장
                  </Button>
                </div>
              </form>
            </div>
          )}

          {tab === 'certificate' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-brand-light)]">
                  <UploadCloud className="w-5 h-5 text-[var(--color-brand-primary)]" />
                </div>
                <div>
                  <p className="text-[var(--color-text-secondary)] text-sm">블록체인 링크와 함께 증명서 업로드</p>
                  <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">기부금 사용 증명서</h2>
                </div>
              </div>

              <form onSubmit={handleCertificateUpload} className="space-y-4">
                <Input
                  label="증명서 제목"
                  placeholder="예) 2024년 겨울나기 사용 내역"
                  value={certificateTitle}
                  onChange={(e) => setCertificateTitle(e.target.value)}
                  required
                />
                <Input
                  label="연결된 트랜잭션 해시 / 스캔 링크"
                  placeholder="0x... 또는 https://.../tx/..."
                  value={certificateTx}
                  onChange={(e) => setCertificateTx(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-[var(--color-text-primary)] mb-2">
                    상세 설명 (선택)
                  </label>
                  <Textarea
                    value={certificateDesc}
                    onChange={(e) => setCertificateDesc(e.target.value)}
                    placeholder="어떤 항목에 사용되었는지 간단히 메모"
                    className="bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[var(--color-text-primary)] mb-2">
                    증명서 파일 (PDF, 이미지)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" size="lg" disabled={uploading}>
                    {uploading ? '업로드 중...' : 'IPFS에 업로드 (데모)'}
                  </Button>
                </div>
              </form>

              {uploadResult && (
                <div className="p-4 rounded-2xl bg-white border border-[var(--color-border-light)] flex items-start gap-3">
                  <FileCheck className="w-5 h-5 text-[var(--color-success)] mt-1" />
                  <div className="space-y-1 text-sm">
                    <p className="text-[var(--color-text-primary)] font-medium">{certificateTitle || '증명서'}</p>
                    <p className="text-[var(--color-text-secondary)]">CID: {uploadResult.cid}</p>
                    <a
                      href={uploadResult.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-brand-primary)] underline"
                    >
                      {uploadResult.url}
                    </a>
                    {certificateTx && (
                      <p className="text-[var(--color-text-secondary)]">
                        연결된 트랜잭션/링크: {certificateTx}
                      </p>
                    )}
                    {certificateDesc && (
                      <p className="text-[var(--color-text-secondary)] whitespace-pre-line">
                        {certificateDesc}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        {latestEntry && (
          <Card padding="lg" className="shadow-lg bg-white/70">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 space-y-3">
                <p className="text-sm text-[var(--color-text-secondary)]">미리보기</p>
                <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">{latestEntry.title}</h3>
                <p className="text-[var(--color-text-secondary)]">{latestEntry.centerName}</p>
                <p className="whitespace-pre-line text-[var(--color-text-primary)]">{latestEntry.description}</p>
                {latestEntry.benefit && (
                  <div className="p-3 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-light)] text-sm">
                    🎁 기부 혜택: {latestEntry.benefit}
                  </div>
                )}
                {latestEntry.explorerLink && (
                  <a
                    href={latestEntry.explorerLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-[var(--color-brand-primary)] text-sm hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    스캔 내역 페이지 열기
                  </a>
                )}
                <p className="text-xs text-[var(--color-text-tertiary)]">
                  {new Date(latestEntry.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex-1 grid grid-cols-1 gap-4">
                {latestEntry.organizationImage && (
                  <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-white">
                    <img
                      src={latestEntry.organizationImage}
                      alt="기부처"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm px-3 py-2">
                      기부처 사진
                    </div>
                  </div>
                )}
                {latestEntry.contentImage && (
                  <div className="relative overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-white">
                    <img
                      src={latestEntry.contentImage}
                      alt="기부 내용"
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-sm px-3 py-2">
                      기부 내용 사진
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
