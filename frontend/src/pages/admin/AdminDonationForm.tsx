import { useState } from 'react';
import { ArrowLeft, CheckCircle, Upload, FileText } from 'lucide-react';
import { Button, Card, Input } from '../../components/common';
import { Textarea } from '../../components/ui/textarea';
import type { Campaign } from '../../types';

interface AdminDonationFormProps {
  onBack: () => void;
  onCreate: (campaign: Campaign) => void;
}

const initialForm = {
  organizationName: '',
  title: '',
  description: '',
  category: '동물' as const,
  goalAmount: '',
  imageUrl: '',
  houseColor: '#FFB6C1',
  deadline: '',
};

export function AdminDonationForm({ onBack, onCreate }: AdminDonationFormProps) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleChange = (key: keyof typeof initialForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setForm((prev) => ({ ...prev, imageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.organizationName.trim() || !form.title.trim() || !form.description.trim()) {
      alert('기관명, 제목, 설명을 모두 입력해주세요.');
      return;
    }

    const goalAmount = parseFloat(form.goalAmount);
    if (isNaN(goalAmount) || goalAmount <= 0) {
      alert('목표 금액을 올바르게 입력해주세요.');
      return;
    }

    const campaign: Campaign = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `campaign-${Date.now()}`,
      organizationName: form.organizationName,
      title: form.title,
      description: form.description,
      category: form.category,
      goalAmount,
      currentAmount: 0,
      imageUrl: form.imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400',
      houseColor: form.houseColor,
      deadline: form.deadline || undefined,
    };

    onCreate(campaign);
    setForm(initialForm);
    setImageFile(null);
    setImagePreview('');
    setStatus('success');
    setTimeout(() => setStatus('idle'), 2000);
  };

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{
        background: 'linear-gradient(135deg, #E0F2FE, #DCFCE7)',
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
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
          {status === 'success' && (
            <div className="flex items-center gap-2 text-[var(--color-success)] text-sm">
              <CheckCircle className="w-4 h-4" />
              저장됨
            </div>
          )}
        </div>

        <Card padding="lg" className="shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-brand-light)]">
              <FileText className="w-6 h-6 text-[var(--color-brand-primary)]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)]">
                기부 폼 작성
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                새로운 기부 캠페인을 작성합니다
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="기관명"
                placeholder="예) 따뜻한 손길 재단"
                value={form.organizationName}
                onChange={(e) => handleChange('organizationName', e.target.value)}
                required
              />
              <Input
                label="캠페인 제목"
                placeholder="예) 겨울나기 지원 캠페인"
                value={form.title}
                onChange={(e) => handleChange('title', e.target.value)}
                required
              />
            </div>

            {/* 카테고리와 목표 금액 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[var(--color-text-primary)] mb-2">
                  카테고리
                </label>
                <select
                  value={form.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-[var(--color-border-light)] focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary)]"
                >
                  <option value="동물">동물</option>
                  <option value="환경">환경</option>
                  <option value="교육">교육</option>
                </select>
              </div>
              <Input
                label="목표 금액 (ETH)"
                type="number"
                step="0.001"
                placeholder="예) 1.5"
                value={form.goalAmount}
                onChange={(e) => handleChange('goalAmount', e.target.value)}
                required
              />
            </div>

            {/* 마감일 */}
            <div>
              <label className="block text-[var(--color-text-primary)] mb-2">
                마감일
              </label>
              <Input
                type="date"
                value={form.deadline}
                onChange={(e) => handleChange('deadline', e.target.value)}
                placeholder="마감일 선택"
              />
              {form.deadline && (
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                  마감일: {new Date(form.deadline).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>

            {/* 이미지 업로드 */}
            <div>
              <label className="block text-[var(--color-text-primary)] mb-2">
                캠페인 이미지
              </label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-[var(--color-border-light)] rounded-xl hover:border-[var(--color-brand-primary)] transition-colors">
                      <Upload className="w-5 h-5 text-[var(--color-text-secondary)]" />
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {imageFile ? imageFile.name : '이미지 파일 선택 (클릭)'}
                      </span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />
                  </label>
                </div>

                <Input
                  label="또는 이미지 URL 입력"
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl}
                  onChange={(e) => {
                    handleChange('imageUrl', e.target.value);
                    setImagePreview(e.target.value);
                  }}
                />

                {(imagePreview || form.imageUrl) && (
                  <div className="mt-3">
                    <p className="text-sm text-[var(--color-text-secondary)] mb-2">미리보기:</p>
                    <img
                      src={imagePreview || form.imageUrl}
                      alt="미리보기"
                      className="w-full max-w-md h-48 object-cover rounded-xl border border-[var(--color-border-light)]"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 집 색상 */}
            <div>
              <label className="block text-[var(--color-text-primary)] mb-2">
                집 색상
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={form.houseColor}
                  onChange={(e) => handleChange('houseColor', e.target.value)}
                  className="w-16 h-10 rounded border border-[var(--color-border-light)] cursor-pointer"
                />
                <span className="text-sm text-[var(--color-text-secondary)]">
                  {form.houseColor}
                </span>
              </div>
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-[var(--color-text-primary)] mb-2">
                캠페인 설명
              </label>
              <Textarea
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="어떤 기부인지, 어디에 사용되는지, 왜 필요한지 설명해주세요."
                className="bg-white min-h-[150px]"
                required
              />
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end">
              <Button type="submit" size="lg">
                캠페인 생성
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
