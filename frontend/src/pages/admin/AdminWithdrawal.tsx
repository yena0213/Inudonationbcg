import { useState } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, Send, CheckCircle } from 'lucide-react';
import { Button, Card, Input } from '../../components/common';

interface AdminWithdrawalProps {
  onBack: () => void;
}

export function AdminWithdrawal({ onBack }: AdminWithdrawalProps) {
  const [amount, setAmount] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountHolder, setAccountHolder] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  // 가상의 잔액 (실제로는 스마트 컨트랙트에서 조회)
  const availableBalance = 5.47; // ETH
  const exchangeRate = 2500000; // 1 ETH = 2,500,000 KRW (예시)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert('출금 금액을 올바르게 입력해주세요.');
      return;
    }

    if (withdrawAmount > availableBalance) {
      alert('출금 가능 금액을 초과했습니다.');
      return;
    }

    if (!bankAccount.trim() || !bankName.trim() || !accountHolder.trim()) {
      alert('모든 계좌 정보를 입력해주세요.');
      return;
    }

    setProcessing(true);

    try {
      // 환전 및 송금 처리 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 2000));

      setSuccess(true);
      alert('환전 및 송금 요청이 완료되었습니다!');

      // 폼 초기화
      setAmount('');
      setBankAccount('');
      setBankName('');
      setAccountHolder('');

      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('환전 실패:', error);
      alert('환전 처리 중 오류가 발생했습니다.');
    } finally {
      setProcessing(false);
    }
  };

  const estimatedKRW = parseFloat(amount || '0') * exchangeRate;

  return (
    <div
      className="min-h-screen p-6 md:p-10"
      style={{
        background: 'linear-gradient(135deg, #E0F2FE, #DCFCE7)',
      }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
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
            기부금 받기
          </h1>
          <p className="text-[var(--color-text-secondary)]">
            받은 기부금을 원화로 환전하여 계좌로 수령합니다
          </p>
        </div>

        {/* 잔액 카드 */}
        <Card padding="lg" className="shadow-xl bg-gradient-to-br from-blue-50 to-green-50">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-[var(--color-brand-primary)] text-white">
              <TrendingUp className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-[var(--color-text-secondary)]">출금 가능 잔액</p>
              <p className="text-3xl font-bold text-[var(--color-text-primary)] mt-1">
                {availableBalance.toFixed(4)} ETH
              </p>
              <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                ≈ {(availableBalance * exchangeRate).toLocaleString()} 원
              </p>
            </div>
          </div>
        </Card>

        {/* 환전 폼 */}
        <Card padding="lg" className="shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[var(--color-brand-light)]">
              <DollarSign className="w-6 h-6 text-[var(--color-brand-primary)]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--color-text-primary)]">
                환전 및 송금
              </h2>
              <p className="text-sm text-[var(--color-text-secondary)]">
                ETH를 원화로 환전하여 계좌로 송금합니다
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 출금 금액 */}
            <div>
              <Input
                label="출금 금액 (ETH)"
                type="number"
                step="0.0001"
                placeholder="0.0000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
              {amount && parseFloat(amount) > 0 && (
                <p className="text-sm text-[var(--color-text-secondary)] mt-2">
                  예상 수령액: <span className="font-semibold text-[var(--color-brand-primary)]">
                    {estimatedKRW.toLocaleString()} 원
                  </span>
                </p>
              )}
              {amount && parseFloat(amount) > availableBalance && (
                <p className="text-sm text-red-500 mt-2">
                  출금 가능 금액을 초과했습니다
                </p>
              )}
            </div>

            {/* 환율 정보 */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-[var(--color-text-secondary)]">
                현재 환율: 1 ETH = {exchangeRate.toLocaleString()} 원
              </p>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-1">
                환율은 실시간으로 변동될 수 있습니다
              </p>
            </div>

            {/* 계좌 정보 */}
            <div className="space-y-4">
              <h3 className="font-semibold text-[var(--color-text-primary)]">
                입금 계좌 정보
              </h3>

              <Input
                label="은행명"
                placeholder="예) 국민은행"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />

              <Input
                label="계좌번호"
                placeholder="예) 123456-78-901234"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                required
              />

              <Input
                label="예금주"
                placeholder="예) 홍길동"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                required
              />
            </div>

            {/* 안내 사항 */}
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">
                <strong>안내사항:</strong>
              </p>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1 list-disc list-inside">
                <li>환전 및 송금 처리는 영업일 기준 1-3일 소요됩니다</li>
                <li>환율 변동에 따라 실제 수령액이 달라질 수 있습니다</li>
                <li>송금 수수료가 발생할 수 있습니다</li>
              </ul>
            </div>

            {/* 제출 버튼 */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setAmount('');
                  setBankAccount('');
                  setBankName('');
                  setAccountHolder('');
                }}
              >
                초기화
              </Button>
              <Button type="submit" disabled={processing || success}>
                <div className="flex items-center gap-2">
                  {success ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      송금 완료
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {processing ? '처리 중...' : '환전 및 송금 요청'}
                    </>
                  )}
                </div>
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
