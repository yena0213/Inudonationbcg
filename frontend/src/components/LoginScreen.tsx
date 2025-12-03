import { useState } from 'react';
import { Leaf, Mail, Loader2, Chrome, Wallet } from 'lucide-react';
import { useAuth } from '../lib/auth-context';
import { Button, Card, Input } from './common';

export function LoginScreen() {
  const { ready, login, loginWithGoogle, loginWithMetamask } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'metamask' | null>(null);
  const [isOrganization, setIsOrganization] = useState(false);

  // 이메일 로그인
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      alert('이메일을 입력해주세요');
      return;
    }

    setLoading(true);
    try {
      await login(email, name || undefined, isOrganization);
      
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

  const handleGoogleLogin = async () => {
    setSocialLoading('google');
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Google 로그인 실패:', err);
      alert('Google 로그인에 실패했습니다.');
    } finally {
      setSocialLoading(null);
    }
  };

  const handleMetamaskLogin = async () => {
    setSocialLoading('metamask');
    try {
      await loginWithMetamask();
      alert('✅ MetaMask 지갑과 DID가 연결되었습니다!');
    } catch (err: any) {
      console.error('MetaMask 로그인 실패:', err);
      alert(err?.message || 'MetaMask 로그인에 실패했습니다.');
    } finally {
      setSocialLoading(null);
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

            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isOrganization}
                onChange={(e) => setIsOrganization(e.target.checked)}
                disabled={loading}
                className="h-4 w-4 accent-[var(--color-brand-primary)]"
              />
              <span style={{ color: 'var(--color-text-primary)' }}>
                기업/단체로 로그인 (관리자 페이지 활성화)
              </span>
            </label>

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

          {/* 소셜/하이브리드 로그인 */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              type="button"
              variant="secondary"
              disabled={!ready || socialLoading !== null}
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2"
              style={{ backgroundColor: '#F8FBFF' }}
            >
              {socialLoading === 'google' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Chrome className="w-4 h-4 text-red-500" />
              )}
              <span>Google OAuth로 시작</span>
            </Button>

            <Button
              type="button"
              variant="secondary"
              disabled={!ready || socialLoading !== null}
              onClick={handleMetamaskLogin}
              className="flex items-center justify-center gap-2"
              style={{ backgroundColor: '#F7FEE7' }}
            >
              {socialLoading === 'metamask' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wallet className="w-4 h-4 text-amber-600" />
              )}
              <span>MetaMask 지갑 연결</span>
            </Button>
          </div>

          <div 
            className="mt-6 pt-6"
            style={{ borderTop: '1px solid var(--color-border-light)' }}
          >
            <p 
              className="text-center text-sm"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              💡 메타마스크나 지갑 설치 없이 바로 시작할 수 있어요!
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
