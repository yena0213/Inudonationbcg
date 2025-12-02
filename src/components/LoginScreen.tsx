import { useState } from 'react';
import { Leaf, Mail, Loader2 } from 'lucide-react';
import { useAuth } from '../lib/auth-context';

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
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-4">
            <Leaf className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-green-800 mb-2">기부 마을에 오신 것을 환영합니다</h1>
          <p className="text-green-600">투명한 기부, 즐거운 경험</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-green-300">
          <div className="mb-6">
            <p className="text-green-700 text-center mb-2">간편하게 시작하세요</p>
            <p className="text-green-600 text-center text-sm">로그인하면 자동으로 안전한 지갑이 생성됩니다</p>
          </div>

          {/* 이메일 로그인 폼 */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-green-700 text-sm mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-400 focus:outline-none"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-green-700 text-sm mb-2">
                이름 (선택사항)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="마을 주민"
                className="w-full px-4 py-3 border-2 border-green-200 rounded-xl focus:border-green-400 focus:outline-none"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={!ready || loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
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
            </button>
          </form>

          {/* 데모 로그인 */}
          <div className="mt-4">
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🎮 데모 계정으로 빠른 시작
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-green-100">
            <p className="text-green-600 text-center text-sm">
              💡 메타마스크나 지갑 설치 없이<br />
              바로 시작할 수 있어요!
            </p>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-2xl border-2 border-blue-200">
            <p className="text-blue-800 text-sm mb-2">🔗 블록체인 기술 적용</p>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Layer 2 (Arbitrum Sepolia)</li>
              <li>• 자동 지갑 생성 (ethers.js)</li>
              <li>• DID 기반 신원 관리</li>
              <li>• 이메일 기반 간편 로그인</li>
              <li>• 모든 기부는 블록체인에 기록</li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-200">
            <p className="text-green-800 text-xs text-center">
              ✅ 같은 이메일 = 같은 지갑 주소 (결정론적 생성)
            </p>
            <p className="text-green-600 text-xs text-center mt-1">
              💾 로그인 정보는 브라우저에 안전하게 저장됩니다
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-green-700 text-sm">
            🔒 모든 기부 내역은 블록체인에 안전하게 기록됩니다
          </p>
          <p className="text-green-600 text-xs">
            Arbiscan에서 언제든지 확인 가능
          </p>
        </div>
      </div>
    </div>
  );
}