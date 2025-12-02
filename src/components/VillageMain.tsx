import { Home, Package } from 'lucide-react';
import type { Campaign } from '../App';

interface VillageMainProps {
  campaigns: Campaign[];
  onOrganizationClick: (campaign: Campaign) => void;
  onMyHouseClick: () => void;
  onInventoryClick: () => void;
}

export function VillageMain({
  campaigns,
  onOrganizationClick,
  onMyHouseClick,
  onInventoryClick
}: VillageMainProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-300 via-sky-200 to-green-200 relative overflow-hidden">
      {/* 마을 이름 배너 */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <div className="relative">
          {/* 배너 리본 */}
          <div className="bg-yellow-400 px-12 py-3 rounded-lg shadow-lg border-4 border-yellow-500 relative">
            <div className="absolute -left-4 top-0 w-0 h-0 border-t-[20px] border-t-yellow-600 border-r-[16px] border-r-transparent"></div>
            <div className="absolute -right-4 top-0 w-0 h-0 border-t-[20px] border-t-yellow-600 border-l-[16px] border-l-transparent"></div>
            <h1 className="text-gray-600 text-center tracking-wider" style={{ fontSize: '24px', fontWeight: '600' }}>
              기부 마을
            </h1>
          </div>
        </div>
      </div>

      {/* 탑다운 마을 맵 */}
      <div className="relative min-h-screen flex items-center justify-center p-8 pt-32 pb-28">
        <div className="relative w-full max-w-4xl aspect-square">
          {/* 섬 배경 */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-500 rounded-[100px] shadow-2xl border-8 border-yellow-300">
            {/* 모래 해변 */}
            <div className="absolute inset-0 rounded-[92px] border-[20px] border-yellow-200 opacity-60"></div>
          </div>

          {/* 물 효과 */}
          <div className="absolute -inset-4 bg-blue-400 opacity-30 rounded-[110px] -z-10 blur-sm"></div>

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
            className="absolute top-[18%] left-1/2 -translate-x-1/2 transform hover:scale-110 transition-all group"
            style={{ zIndex: 10 }}
          >
            <div className="relative">
              {/* 그림자 */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-black/20 rounded-full blur-sm"></div>
              
              {/* 집 */}
              <div className="relative bg-yellow-400 border-4 border-yellow-600 rounded-2xl px-8 py-6 shadow-xl">
                <div className="text-5xl mb-2">🏠</div>
                <div className="text-yellow-900 font-bold text-sm whitespace-nowrap">내 집</div>
                
                {/* 호버 효과 */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-yellow-100 px-3 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap text-sm">
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
                className="absolute transform hover:scale-110 transition-all group"
                style={{
                  top: pos.top,
                  left: pos.left,
                  right: pos.right,
                  bottom: pos.bottom,
                  transform: pos.transform ? `translateX(${pos.transform})` : undefined,
                  zIndex: 10
                }}
              >
                <div className="relative">
                  {/* 그림자 */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-4 bg-black/20 rounded-full blur-sm"></div>
                  
                  {/* 집 */}
                  <div 
                    className="relative border-4 rounded-2xl px-6 py-5 shadow-xl"
                    style={{ 
                      backgroundColor: campaign.houseColor,
                      borderColor: campaign.houseColor,
                      filter: 'brightness(1.1)'
                    }}
                  >
                    <div className="text-5xl mb-2">
                      {campaign.category === '동물' && '🐾'}
                      {campaign.category === '환경' && '🌳'}
                      {campaign.category === '교육' && '📚'}
                    </div>
                    <div className="text-white font-bold text-xs text-center max-w-[100px] truncate">
                      {campaign.organizationName}
                    </div>
                    
                    {/* 호버 정보 */}
                    <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-white px-4 py-3 rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-opacity w-48 border-2 pointer-events-none" style={{ borderColor: campaign.houseColor }}>
                      <div className="font-bold text-sm mb-1 truncate">{campaign.title}</div>
                      <div className="text-xs text-gray-600 mb-2">{campaign.category}</div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all"
                          style={{ 
                            width: `${(campaign.currentAmount / campaign.goalAmount) * 100}%`,
                            backgroundColor: campaign.houseColor
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
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
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-4 border-2 border-green-300">
          <p className="text-green-700 text-center text-sm">
            💡 집을 클릭해서 방문하고 기부해보세요!
          </p>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-green-300 shadow-2xl z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-around gap-4">
            <button className="flex-1 flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl">
              <Home className="w-5 h-5" />
              마을
            </button>
            <button
              onClick={onMyHouseClick}
              className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white py-3 rounded-xl hover:bg-yellow-600 transition-colors"
            >
              <Home className="w-5 h-5" />
              내 집
            </button>
            <button
              onClick={onInventoryClick}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600 transition-colors"
            >
              <Package className="w-5 h-5" />
              가방
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}