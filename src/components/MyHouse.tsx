import { useState } from 'react';
import { ArrowLeft, ShoppingBag, Package, Trash2, FileKey, Award } from 'lucide-react';
import type { User, FurnitureItem } from '../App';
import { getCredentials } from '../lib/did';

interface MyHouseProps {
  user: User | null;
  onBack: () => void;
}

interface PlacedFurniture {
  id: string;
  furnitureId: string;
  x: number;
  y: number;
}

export function MyHouse({ user, onBack }: MyHouseProps) {
  const [activeTab, setActiveTab] = useState<'room' | 'shop' | 'did'>('room');
  
  // Mock furniture data
  const mockFurniture: FurnitureItem[] = [
    { id: 'f1', name: '나무 의자', type: 'furniture', imageUrl: '🪑', price: 5000, owned: false },
    { id: 'f2', name: '꽃무늬 소파', type: 'furniture', imageUrl: '🛋️', price: 15000, owned: false },
    { id: 'f3', name: '책장', type: 'furniture', imageUrl: '📚', price: 12000, owned: false },
    { id: 'f4', name: '화분', type: 'decoration', imageUrl: '🪴', price: 3000, owned: false },
    { id: 'f5', name: '테이블 램프', type: 'decoration', imageUrl: '💡', price: 6000, owned: false },
    { id: 'f6', name: '액자', type: 'decoration', imageUrl: '🖼️', price: 8000, owned: false },
    { id: 'f7', name: '러그', type: 'flooring', imageUrl: '🟫', price: 10000, owned: false },
    { id: 'f8', name: '벽시계', type: 'decoration', imageUrl: '🕐', price: 10000, owned: false },
    { id: 'f9', name: '침대', type: 'furniture', imageUrl: '🛏️', price: 20000, owned: false },
    { id: 'f10', name: '책상', type: 'furniture', imageUrl: '🪵', price: 18000, owned: false },
    { id: 'f11', name: '선인장', type: 'decoration', imageUrl: '🌵', price: 4000, owned: false },
    { id: 'f12', name: '기타', type: 'decoration', imageUrl: '🎸', price: 12000, owned: false },
  ];

  const [furniture, setFurniture] = useState<FurnitureItem[]>(mockFurniture);
  const [placedItems, setPlacedItems] = useState<PlacedFurniture[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleBuyItem = (item: FurnitureItem) => {
    if (!user || user.points < item.price) return;
    
    // In real app, this would update backend
    setFurniture(furniture.map(f => 
      f.id === item.id ? { ...f, owned: true } : f
    ));
    
    alert(`${item.name}을(를) 구매했습니다! (${item.price} P)`);
  };

  const handleDragStart = (e: React.DragEvent, furnitureId: string, isPlaced: boolean, placedId?: string) => {
    if (isPlaced && placedId) {
      e.dataTransfer.setData('placedId', placedId);
      e.dataTransfer.setData('type', 'placed');
    } else {
      e.dataTransfer.setData('furnitureId', furnitureId);
      e.dataTransfer.setData('type', 'new');
    }
    setDraggedItem(furnitureId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const type = e.dataTransfer.getData('type');
    
    if (type === 'placed') {
      // Move existing item
      const placedId = e.dataTransfer.getData('placedId');
      setPlacedItems(items =>
        items.map(item =>
          item.id === placedId ? { ...item, x, y } : item
        )
      );
    } else {
      // Place new item
      const furnitureId = e.dataTransfer.getData('furnitureId');
      const newPlacedItem: PlacedFurniture = {
        id: `placed_${Date.now()}`,
        furnitureId,
        x,
        y,
      };
      setPlacedItems([...placedItems, newPlacedItem]);
    }
    
    setDraggedItem(null);
  };

  const handleRemoveItem = (placedId: string) => {
    setPlacedItems(items => items.filter(item => item.id !== placedId));
  };

  const ownedItems = furniture.filter(f => f.owned);
  const shopItems = furniture.filter(f => !f.owned);

  return (
    <div className="min-h-screen p-4 pb-24 bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-green-700 hover:text-green-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          마을로 돌아가기
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-yellow-300">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-yellow-800 mb-1">🏠 내 집</h1>
              <p className="text-yellow-600">포인트로 가구를 사고 꾸며보세요</p>
            </div>
            <div className="text-right">
              <p className="text-yellow-600 text-sm">보유 포인트</p>
              <p className="text-yellow-800">
                {(user?.points ?? 0).toLocaleString()} P
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-2 border-2 border-yellow-200 flex gap-2">
          <button
            onClick={() => setActiveTab('room')}
            className={`flex-1 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'room'
                ? 'bg-yellow-400 text-white'
                : 'text-yellow-700 hover:bg-yellow-50'
            }`}
          >
            <Package className="w-5 h-5" />
            내 방
          </button>
          <button
            onClick={() => setActiveTab('shop')}
            className={`flex-1 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'shop'
                ? 'bg-yellow-400 text-white'
                : 'text-yellow-700 hover:bg-yellow-50'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            가구 상점
          </button>
          <button
            onClick={() => setActiveTab('did')}
            className={`flex-1 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'did'
                ? 'bg-purple-400 text-white'
                : 'text-purple-700 hover:bg-purple-50'
            }`}
          >
            <FileKey className="w-5 h-5" />
            DID & 증명서
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto">
        {activeTab === 'room' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Room view - 2/3 width */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-yellow-300">
                <h3 className="text-yellow-800 mb-4">🎨 방 꾸미기</h3>
                
                {/* Room canvas */}
                <div
                  className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-inner"
                  style={{
                    background: 'linear-gradient(135deg, #d4a574 0%, #c9955a 50%, #d4a574 100%)',
                    backgroundImage: `
                      repeating-linear-gradient(
                        0deg,
                        rgba(139, 90, 43, 0.1) 0px,
                        rgba(139, 90, 43, 0.1) 2px,
                        transparent 2px,
                        transparent 20px
                      ),
                      repeating-linear-gradient(
                        90deg,
                        rgba(139, 90, 43, 0.05) 0px,
                        rgba(139, 90, 43, 0.05) 2px,
                        transparent 2px,
                        transparent 8px
                      )
                    `,
                  }}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {/* Floor gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10"></div>

                  {/* Baseboard */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-amber-700 to-amber-800 opacity-60"></div>

                  {/* Placed items */}
                  {placedItems.map((placed) => {
                    const furnitureData = furniture.find(f => f.id === placed.furnitureId);
                    if (!furnitureData) return null;

                    return (
                      <div
                        key={placed.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, placed.furnitureId, true, placed.id)}
                        className="absolute cursor-move group"
                        style={{
                          left: `${placed.x}px`,
                          top: `${placed.y}px`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <div className="relative">
                          {/* Shadow */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-12 h-3 bg-black/20 rounded-full blur-sm"></div>
                          
                          {/* Item */}
                          <div className="text-6xl filter drop-shadow-lg hover:scale-110 transition-transform">
                            {furnitureData.imageUrl}
                          </div>

                          {/* Remove button */}
                          <button
                            onClick={() => handleRemoveItem(placed.id)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty state */}
                  {placedItems.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center bg-white/80 backdrop-blur rounded-2xl p-6 border-2 border-yellow-300">
                        <p className="text-yellow-800 mb-2">텅 빈 방이에요 ✨</p>
                        <p className="text-yellow-600 text-sm">
                          오른쪽에서 가구를 드래그해서<br />
                          방에 배치해���세요!
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 bg-yellow-50 rounded-xl p-3 border-2 border-yellow-200">
                  <p className="text-yellow-800 text-sm">
                    💡 <strong>사용법:</strong> 보유한 가구를 드래그해서 방에 놓고, 다시 드래그해서 위치를 조정하세요!
                  </p>
                </div>
              </div>
            </div>

            {/* Owned items sidebar - 1/3 width */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-yellow-200 sticky top-4">
                <h3 className="text-yellow-800 mb-4">📦 보유한 가구</h3>
                
                {ownedItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-yellow-600 text-sm mb-2">
                      아직 가구가 없어요
                    </p>
                    <p className="text-yellow-500 text-xs">
                      가구 상점에서 구매해보세요!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[600px] overflow-y-auto">
                    {ownedItems.map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item.id, false)}
                        className="bg-yellow-50 rounded-xl p-3 border-2 border-yellow-200 hover:border-yellow-400 cursor-move transition-all hover:shadow-md"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{item.imageUrl}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-yellow-800 text-sm truncate">{item.name}</p>
                            <p className="text-yellow-600 text-xs">
                              {item.type === 'furniture' && '가구'}
                              {item.type === 'decoration' && '장식'}
                              {item.type === 'wallpaper' && '벽지'}
                              {item.type === 'flooring' && '바닥재'}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-yellow-200">
            <h3 className="text-yellow-800 mb-4">가구 상점</h3>
            
            {shopItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-yellow-700 mb-2">모든 아이템을 구매했어요! 🎉</p>
                <p className="text-yellow-600 text-sm">더 많은 아이템이 곧 추가될 예정이에요</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shopItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-yellow-50 rounded-2xl p-4 border-2 border-yellow-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-5xl">{item.imageUrl}</div>
                      <div className="flex-1">
                        <p className="text-yellow-800 mb-1">{item.name}</p>
                        <p className="text-yellow-600 text-sm mb-2">
                          {item.type === 'furniture' && '가구'}
                          {item.type === 'decoration' && '장식'}
                          {item.type === 'wallpaper' && '벽지'}
                          {item.type === 'flooring' && '바닥재'}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-yellow-700">
                            {item.price.toLocaleString()} P
                          </p>
                          <button
                            onClick={() => handleBuyItem(item)}
                            disabled={!user || user.points < item.price}
                            className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 text-white px-4 py-2 rounded-xl text-sm transition-colors"
                          >
                            구매
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'did' && user && (
          <div className="space-y-6">
            {/* DID 정보 */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-purple-300">
              <div className="flex items-center gap-3 mb-4">
                <FileKey className="w-6 h-6 text-purple-600" />
                <h3 className="text-purple-800">내 DID (Decentralized Identifier)</h3>
              </div>
              
              <div className="bg-purple-50 rounded-2xl p-6 border-2 border-purple-200">
                <p className="text-purple-700 text-sm mb-3">블록체인 기반 탈중앙화 신원</p>
                <div className="bg-white rounded-xl p-4 border border-purple-200 font-mono text-sm break-all text-purple-900">
                  {user.did || '로딩 중...'}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-3 border border-purple-200">
                    <p className="text-purple-600 text-xs mb-1">지갑 주소</p>
                    <p className="font-mono text-xs text-purple-900 truncate">{user.walletAddress}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl p-3 border border-purple-200">
                    <p className="text-purple-600 text-xs mb-1">네트워크</p>
                    <p className="text-purple-900 text-xs">Arbitrum Sepolia</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Verifiable Credentials */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border-4 border-green-300">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6 text-green-600" />
                <h3 className="text-green-800">기부 증명서 (Verifiable Credentials)</h3>
              </div>

              {(() => {
                const credentials = user.did ? getCredentials(user.did) : [];
                
                if (credentials.length === 0) {
                  return (
                    <div className="text-center py-12 bg-green-50 rounded-2xl border-2 border-green-200">
                      <p className="text-green-700 mb-2">아직 기부 증명서가 없어요</p>
                      <p className="text-green-600 text-sm">기부하면 블록체인 기반 증명서를 받을 수 있어요!</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {credentials.map((credential: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border-2 border-green-200 hover:border-green-400 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="text-green-900 mb-1">기부 증명서 #{index + 1}</p>
                            <p className="text-green-600 text-xs">
                              발급일: {new Date(credential.issuanceDate).toLocaleDateString('ko-KR')}
                            </p>
                          </div>
                          <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs">
                            검증됨 ✓
                          </div>
                        </div>

                        <div className="space-y-2">
                          {credential.credentialSubject && (
                            <>
                              {credential.credentialSubject.donationAmount && (
                                <div className="flex justify-between items-center bg-white rounded-lg p-3 border border-green-200">
                                  <span className="text-green-700 text-sm">기부 금액</span>
                                  <span className="text-green-900">{credential.credentialSubject.donationAmount} ETH</span>
                                </div>
                              )}
                              {credential.credentialSubject.txHash && (
                                <div className="bg-white rounded-lg p-3 border border-green-200">
                                  <p className="text-green-700 text-sm mb-1">트랜잭션</p>
                                  <p className="font-mono text-xs text-green-900 truncate">
                                    {credential.credentialSubject.txHash}
                                  </p>
                                </div>
                              )}
                              {credential.credentialSubject.badge && (
                                <div className="flex justify-between items-center bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg p-3 border border-yellow-300">
                                  <span className="text-yellow-800 text-sm">뱃지</span>
                                  <span className="text-yellow-900">{credential.credentialSubject.badge.name} {credential.credentialSubject.badge.tier}</span>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    
                    <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200 mt-4">
                      <p className="text-blue-800 text-sm mb-2">💡 Verifiable Credential이란?</p>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• 블록체인에 기록된 기부 내역을 검증 가능한 형태로 발급</li>
                        <li>• W3C 표준 기반으로 다른 플랫폼에서도 사용 가능</li>
                        <li>• 위변조가 불가능하며 언제든 검증 가능</li>
                      </ul>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-white/80 backdrop-blur rounded-2xl shadow-lg p-4 border-2 border-blue-200">
          <p className="text-blue-800 text-sm mb-2">💡 집 꾸미기 팁</p>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• 기부하면 포인트를 받을 수 있어요</li>
            <li>• 포인트로 다양한 가구를 구매하세요</li>
            <li>• 나만의 개성있는 공간을 만들어보세요</li>
          </ul>
        </div>
      </div>
    </div>
  );
}