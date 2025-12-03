import { Home, Package, ClipboardList } from 'lucide-react';
import { Campaign } from '../types';

interface VillageMainProps {
  campaigns: Campaign[];
  onOrganizationClick: (campaign: Campaign) => void;
  onMyHouseClick: () => void;
  onInventoryClick: () => void;
  onAdminClick?: () => void;
  isOrganization?: boolean;
}

export function VillageMain({
  campaigns,
  onOrganizationClick,
  onMyHouseClick,
  onInventoryClick,
  onAdminClick,
  isOrganization
}: VillageMainProps) {
  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, #7DD3FC, #BAE6FD, #86EFAC)'
      }}
    >
      {/* 마을 이름 배너 */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <div className="relative">
          {/* 배너 리본 */}
          <div 
            className="px-12 py-3 shadow-lg border-4 relative"
            style={{
              backgroundColor: 'var(--color-points)',
              borderColor: '#EAB308',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)',
            }}
          >
            <div className="absolute -left-4 top-0 w-0 h-0 border-t-[20px] border-t-yellow-600 border-r-[16px] border-r-transparent"></div>
            <div className="absolute -right-4 top-0 w-0 h-0 border-t-[20px] border-t-yellow-600 border-l-[16px] border-l-transparent"></div>
            <h1 
              className="text-center tracking-wider"
              style={{ 
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-2xl)',
                fontWeight: 'var(--font-weight-semibold)',
              }}
            >
              기부 마을
            </h1>
          </div>
        </div>
      </div>

      {/* 탑다운 마을 맵 */}
      <div className="relative min-h-screen flex items-center justify-center p-8 pt-32 pb-28">
        <div className="relative w-full max-w-4xl aspect-square">
          {/* 섬 배경 */}
          <div 
            className="absolute inset-0 border-8"
            style={{
              background: 'linear-gradient(135deg, #4ADE80, #22C55E)',
              borderRadius: '100px',
              borderColor: '#FDE047',
              boxShadow: 'var(--shadow-2xl)',
            }}
          >
            {/* 모래 해변 */}
            <div 
              className="absolute inset-0 border-[20px] opacity-60"
              style={{
                borderColor: '#FEF08A',
                borderRadius: '92px',
              }}
            />
          </div>

          {/* 물 효과 */}
          <div 
            className="absolute -inset-4 opacity-30 -z-10 blur-sm"
            style={{
              backgroundColor: '#60A5FA',
              borderRadius: '110px',
            }}
          />

          {/* 길 - 가로 */}
          <div className="absolute top-1/2 left-0 right-0 h-16 bg-yellow-600 opacity-40 -translate-y-1/2"></div>
          
          {/* 길 - 세로 */}
          <div className="absolute left-1/2 top-0 bottom-0 w-16 bg-yellow-600 opacity-40 -translate-x-1/2"></div>

          {/* 장식 - 나무들 */}
          <div className="absolute top-[15%] left-[10%] text-4xl animate-bounce" style={{ animationDuration: '3s' }}>🌳</div>
          <div className="absolute top-[20%] right-[12%] text-3xl animate-bounce" style={{ animationDuration: '4s' }}>🌲</div>
          <div className="absolute bottom-[15%] left-[15%] text-4xl animate-bounce" style={{ animationDuration: '3.5s' }}>🌳</div>
          <div className="absolute bottom-[20%] right-[10%] text-3xl animate-bounce" style={{ animationDuration: '4.5s' }}>🌲</div>

          {/* 장식 - 꽃들 */}
          <div className="absolute top-[30%] left-[20%] text-2xl">🌸</div>
          <div className="absolute top-[35%] right-[25%] text-2xl">🌼</div>
          <div className="absolute bottom-[30%] left-[25%] text-2xl">🌺</div>
          <div className="absolute bottom-[35%] right-[20%] text-2xl">🌻</div>

          {/* 내 집 - 중앙 상단 */}
          <button
            onClick={onMyHouseClick}
            className="absolute top-[18%] left-1/2 -translate-x-1/2 transform hover:scale-110 group"
            style={{ 
              zIndex: 10,
              transition: 'var(--transition-base)',
            }}
          >
            <div className="relative">
              {/* 그림자 */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/20 rounded-full blur-sm"></div>
              
              {/* 집 */}
              <div 
                className="relative border-4 px-8 py-6"
                style={{
                  backgroundColor: 'var(--color-points)',
                  borderColor: '#CA8A04',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: 'var(--shadow-xl)',
                }}
              >
                <div className="text-5xl mb-2">🏠</div>
                <div 
                  className="text-sm whitespace-nowrap"
                  style={{ 
                    color: '#78350F',
                    fontWeight: 'var(--font-weight-bold)',
                  }}
                >
                  내 집
                </div>
                
                {/* 호버 효과 */}
                <div 
                  className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 opacity-0 group-hover:opacity-100 whitespace-nowrap text-sm"
                  style={{
                    backgroundColor: '#FEF3C7',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-lg)',
                    transition: 'var(--transition-base)',
                  }}
                >
                  집 꾸미기 ✨
                </div>
              </div>
            </div>
          </button>

          {/* 단체 집들 - 3개를 삼각형 배치 */}
          {campaigns.map((campaign, index) => {
            // 위치 계산
            const positions = [
              { top: '45%', left: '25%' },  // 왼쪽
              { top: '45%', right: '25%' }, // 오른쪽
              { bottom: '18%', left: '50%', transform: '-50%' } // 하단 중앙
            ];

            const pos = positions[index] || positions[0];

            return (
              <button
                key={campaign.id}
                onClick={() => onOrganizationClick(campaign)}
                className="absolute transform hover:scale-110 group"
                style={{
                  top: pos.top,
                  left: pos.left,
                  right: pos.right,
                  bottom: pos.bottom,
                  transform: pos.transform ? `translateX(${pos.transform})` : undefined,
                  zIndex: 10,
                  transition: 'var(--transition-base)',
                }}
              >
                <div className="relative">
                  {/* 그림자 */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/20 rounded-full blur-sm"></div>
                  
                  {/* 집 */}
                  <div 
                    className="relative border-4 px-6 py-5"
                    style={{ 
                      backgroundColor: campaign.houseColor,
                      borderColor: campaign.houseColor,
                      filter: 'brightness(1.1)',
                      borderRadius: 'var(--radius-xl)',
                      boxShadow: 'var(--shadow-xl)',
                    }}
                  >
                    <div className="text-5xl mb-2">
                      {campaign.category === '동물' && '🐾'}
                      {campaign.category === '환경' && '🌳'}
                      {campaign.category === '교육' && '📚'}
                    </div>
                    <div 
                      className="text-xs text-center max-w-[100px] truncate"
                      style={{ 
                        color: 'white',
                        fontWeight: 'var(--font-weight-bold)',
                      }}
                    >
                      {campaign.organizationName}
                    </div>
                    
                    {/* 호버 정보 */}
                    <div 
                      className="absolute -top-20 left-1/2 -translate-x-1/2 px-4 py-3 opacity-0 group-hover:opacity-100 w-48 border-2 pointer-events-none"
                      style={{ 
                        backgroundColor: 'var(--color-bg-tertiary)',
                        borderColor: campaign.houseColor,
                        borderRadius: 'var(--radius-xl)',
                        boxShadow: 'var(--shadow-xl)',
                        transition: 'var(--transition-base)',
                      }}
                    >
                      <div 
                        className="text-sm mb-1 truncate"
                        style={{ fontWeight: 'var(--font-weight-bold)' }}
                      >
                        {campaign.title}
                      </div>
                      <div 
                        className="text-xs mb-2"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {campaign.category}
                      </div>
                      <div 
                        className="w-full h-1.5 rounded-full overflow-hidden"
                        style={{ backgroundColor: '#E5E7EB' }}
                      >
                        <div
                          className="h-full"
                          style={{ 
                            width: `${(campaign.currentAmount / campaign.goalAmount) * 100}%`,
                            backgroundColor: campaign.houseColor,
                            transition: 'var(--transition-base)',
                          }}
                        />
                      </div>
                      <div 
                        className="text-xs mt-1"
                        style={{ color: 'var(--color-text-tertiary)' }}
                      >
                        {Math.round((campaign.currentAmount / campaign.goalAmount) * 100)}% 달성
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}

          {/* 장식 - 벤치 */}
          <div className="absolute top-[60%] left-[50%] -translate-x-1/2 text-3xl">🪑</div>
          
          {/* 장식 - 우체통 */}
          <div className="absolute top-[25%] left-[45%] text-2xl">📮</div>
          
          {/* 장식 - 가로등 */}
          <div className="absolute bottom-[40%] left-[35%] text-3xl">💡</div>
          <div className="absolute bottom-[40%] right-[35%] text-3xl">💡</div>

          {/* 장식 - 작은 돌들 */}
          <div className="absolute top-[50%] left-[15%] w-3 h-3 bg-gray-400 rounded-full"></div>
          <div className="absolute top-[55%] right-[18%] w-2 h-2 bg-gray-400 rounded-full"></div>
          <div className="absolute bottom-[45%] left-[12%] w-4 h-4 bg-gray-500 rounded-full"></div>
        </div>
      </div>

      {/* 하단 안내 */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-md px-4">
        <div 
          className="backdrop-blur p-4 border-2"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: 'var(--color-brand-light)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: 'var(--shadow-lg)',
          }}
        >
          <p 
            className="text-center text-sm"
            style={{ color: 'var(--color-brand-secondary)' }}
          >
            💡 집을 클릭해서 방문하고 기부해보세요!
          </p>
        </div>
      </div>

      {/* Bottom navigation */}
      <div 
        className="fixed bottom-0 left-0 right-0 border-t-4 z-50"
        style={{
          backgroundColor: 'var(--color-bg-tertiary)',
          borderColor: 'var(--color-brand-light)',
          boxShadow: 'var(--shadow-2xl)',
        }}
      >
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              className="flex items-center justify-center gap-2 py-3"
              style={{
                backgroundColor: 'var(--color-brand-primary)',
                color: 'var(--color-text-inverse)',
                borderRadius: 'var(--radius-xl)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              <Home className="w-5 h-5" />
              마을
            </button>
            <button
              onClick={onMyHouseClick}
              className="flex items-center justify-center gap-2 py-3 hover:opacity-90"
              style={{
                backgroundColor: '#EAB308',
                color: 'var(--color-text-inverse)',
                borderRadius: 'var(--radius-xl)',
                fontWeight: 'var(--font-weight-medium)',
                transition: 'var(--transition-base)',
              }}
            >
              <Home className="w-5 h-5" />
              내 집
            </button>
            <button
              onClick={onInventoryClick}
              className="flex items-center justify-center gap-2 py-3 hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-info)',
                color: 'var(--color-text-inverse)',
                borderRadius: 'var(--radius-xl)',
                fontWeight: 'var(--font-weight-medium)',
                transition: 'var(--transition-base)',
              }}
            >
              <Package className="w-5 h-5" />
              가방
            </button>
            {isOrganization && onAdminClick && (
              <button
                onClick={onAdminClick}
                className="flex items-center justify-center gap-2 py-3 hover:opacity-90"
                style={{
                  backgroundColor: '#10B981',
                  color: 'var(--color-text-inverse)',
                  borderRadius: 'var(--radius-xl)',
                  fontWeight: 'var(--font-weight-medium)',
                  transition: 'var(--transition-base)',
                }}
              >
                <ClipboardList className="w-5 h-5" />
                관리자
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
