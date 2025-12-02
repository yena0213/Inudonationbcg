import { Campaign } from '../types';

/**
 * 더미 캠페인 데이터
 */
export const CAMPAIGNS: Campaign[] = [
  {
    id: '1',
    organizationName: '유기견 보호센터',
    title: '유기견들에게 따뜻한 겨울을',
    description: '추운 겨울을 나기 위한 난방비와 사료가 필요합니다. 여러분의 도움이 절실합니다.',
    category: '동물',
    goalAmount: 5000000,
    currentAmount: 3200000,
    imageUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=400&fit=crop',
    houseColor: '#FF6B6B',
    organizationAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1',
  },
  {
    id: '2',
    organizationName: '숲 살리기 재단',
    title: '미세먼지 잡는 도심 숲 조성',
    description: '도심 속 녹지 공간을 만들어 시민들에게 쾌적한 환경을 제공하고자 합니다.',
    category: '환경',
    goalAmount: 10000000,
    currentAmount: 7500000,
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
    houseColor: '#51CF66',
    organizationAddress: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
  },
  {
    id: '3',
    organizationName: '희망 장학재단',
    title: '꿈을 키우는 교육 후원',
    description: '경제적 어려움을 겪는 학생들에게 교육의 기회를 제공합니다.',
    category: '교육',
    goalAmount: 8000000,
    currentAmount: 4200000,
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=400&fit=crop',
    houseColor: '#4DABF7',
    organizationAddress: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
  },
];
