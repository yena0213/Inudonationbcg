import { useState } from 'react';
import { Leaf, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { Button, Card, Input } from './common';

export function LoginScreen() {
  const { ready, login } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  // 이메일 로그인
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      alert('이메일을 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      await login(email, name || undefined);
      
      alert(
        `🎉 로그인 성공!\n\n` +
        `📧 이메일: ${email}\n` +
        `✅ 지갑이 자동으로 생성되었습니다!\n` +
        `✅ DID가 자동으로 발급되었습니다!\n\n` +
        `마이하우스에서 확인하세요!`
      );
    } catch (err) {
      console.error('로그인 실패:', err);
      alert('로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 데모 로그인
  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await login('demo@donation-village.org', '데모 사용자');
      alert('🎮 데모 계정으로 로그인되었습니다!');
    } catch (err) {
      console.error('데모 로그인 실패:', err);
      alert('데모 로그인에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, var(--color-bg-primary), var(--color-bg-secondary))'
      }}
    >
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div 
            className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <Leaf className="w-10 h-10" style={{ color: 'var(--color-brand-primary)' }} />
          </div>
          <h1 
            className="mb-2"
            style={{ 
              color: 'var(--color-brand-dark)',
              fontSize: 'var(--font-size-2xl)',
              fontWeight: 'var(--font-weight-bold)',
            }}
          >
            기부 마을에 오신 것을 환영합니다
          </h1>
          <p style={{ color: 'var(--color-brand-secondary)' }}>
            투명한 기부, 즐거운 경험
          </p>
        </div>

        {/* Login Card */}
        <Card padding="lg" className="border-4 animate-slide-up" style={{ borderColor: 'var(--color-brand-light)' }}>
          <div className="mb-6">
            <p 
              className="text-center mb-2"
              style={{ 
                color: 'var(--color-brand-secondary)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              간편하게 시작하세요
            </p>
            <p 
              className="text-center text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              로그인하면 자동으로 안전한 지갑이 생성됩니다
            </p>
          </div>

          {/* 이메일 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label 
                className="block text-sm mb-2"
                style={{ 
                  color: 'var(--color-text-primary)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                이메일 <span style={{ color: 'var(--color-error)' }}>*</span>
              </label>
              <div className="relative">
                <Mail 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" 
                  style={{ color: 'var(--color-brand-light)' }}
                />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label 
                className="block text-sm mb-2"
                style={{ 
                  color: 'var(--color-text-primary)',
                  fontWeight: 'var(--font-weight-medium)',
                }}
              >
                이름 (선택사항)
              </label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="마을 주민"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              disabled={!ready || loading}
              className="flex items-center justify-center gap-2"
              style={{
                background: loading ? undefined : 'linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-secondary))',
                boxShadow: 'var(--shadow-md)',
              }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>로그인 중...</span>
                </>
              ) : !ready ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>초기화 중...</span>
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5" />
                  <span>이메일로 시작하기</span>
                </>
              )}
            </Button>
          </form>

          {/* 데모 로그인 */}
          <div className="mt-4">
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full py-3 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: '#F3E8FF',
                color: '#7C3AED',
                borderRadius: 'var(--radius-xl)',
                fontWeight: 'var(--font-weight-medium)',
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.backgroundColor = '#E9D5FF')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F3E8FF')}
            >
              🎮 데모 계정으로 빠른 시작
            </button>
          </div>

          <div 
            className="mt-6 pt-6"
            style={{ borderTop: '1px solid var(--color-border-light)' }}
          >
            <p 
              className="text-center text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              💡 메타마스크나 지갑 설치 없이<br />
              바로 시작할 수 있어요!
            </p>
          </div>

          <div 
            className="mt-4 p-4 border-2"
            style={{
              backgroundColor: '#EFF6FF',
              borderColor: '#BFDBFE',
              borderRadius: 'var(--radius-xl)',
            }}
          >
            <p 
              className="text-sm mb-2"
              style={{ 
                color: '#1E40AF',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              🔗 블록체인 기술 적용
            </p>
            <ul className="text-sm space-y-1" style={{ color: '#1D4ED8' }}>
              <li>• Layer 2 (Arbitrum Sepolia)</li>
              <li>• 자동 지갑 생성 (ethers.js)</li>
              <li>• DID 기반 신원 관리</li>
              <li>• 이메일 기반 간편 로그인</li>
              <li>• 모든 기부는 블록체인에 기록</li>
            </ul>
          </div>

          <div 
            className="mt-4 p-3 border"
            style={{
              backgroundColor: '#F0FDF4',
              borderColor: 'var(--color-brand-light)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <p 
              className="text-xs text-center"
              style={{ color: 'var(--color-brand-dark)' }}
            >
              ✅ 같은 이메일 = 같은 지갑 주소 (결정론적 생성)
            </p>
            <p 
              className="text-xs text-center mt-1"
              style={{ color: 'var(--color-brand-secondary)' }}
            >
              💾 로그인 정보는 브라우저에 안전하게 저장됩니다
            </p>
          </div>
        </Card>

        {/* Info */}
        <div className="mt-8 text-center space-y-2">
          <p 
            className="text-sm"
            style={{ color: 'var(--color-brand-secondary)' }}
          >
            🔒 모든 기부 내역은 블록체인에 안전하게 기록됩니다
          </p>
          <p 
            className="text-xs"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Arbiscan에서 언제든지 확인 가능
          </p>
        </div>
      </div>
    </div>
  );
}