// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title DonationVillage
 * @dev 투명한 기부 기록을 블록체인에 저장하는 스마트 컨트랙트
 * @notice 동물의 숲 스타일 게임화 기부 플랫폼
 */
contract DonationVillage is Ownable, ReentrancyGuard, Pausable {
    
    // ============ 구조체 정의 ============
    
    struct Campaign {
        string organizationName;
        string title;
        string description;
        string category;
        uint256 goalAmount;
        uint256 currentAmount;
        address payable beneficiary;
        bool active;
        uint256 createdAt;
    }
    
    struct Donation {
        address donor;
        uint256 campaignId;
        uint256 amount;
        uint256 timestamp;
        string message;
    }
    
    // ============ 상태 변수 ============
    
    mapping(uint256 => Campaign) public campaigns;
    uint256 public campaignCount;
    
    mapping(uint256 => Donation) public donations;
    uint256 public donationCount;
    
    mapping(address => uint256[]) public userDonations;
    mapping(uint256 => uint256[]) public campaignDonations;
    
    mapping(address => uint256) public totalDonatedByUser;
    
    // ============ 이벤트 ============
    
    event CampaignCreated(
        uint256 indexed campaignId,
        string organizationName,
        string title,
        address beneficiary
    );
    
    event DonationMade(
        uint256 indexed donationId,
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount,
        uint256 timestamp
    );
    
    event FundsWithdrawn(
        uint256 indexed campaignId,
        address indexed beneficiary,
        uint256 amount
    );
    
    event CampaignStatusChanged(
        uint256 indexed campaignId,
        bool active
    );
    
    // ============ 생성자 ============
    
    constructor() Ownable(msg.sender) {
        // 초기 Mock 캠페인 생성
        _createInitialCampaigns();
    }
    
    // ============ 외부 함수 ============
    
    /**
     * @dev 새로운 캠페인 생성 (관리자만)
     */
    function createCampaign(
        string memory _organizationName,
        string memory _title,
        string memory _description,
        string memory _category,
        uint256 _goalAmount,
        address payable _beneficiary
    ) external onlyOwner returns (uint256) {
        require(_goalAmount > 0, "Goal amount must be greater than 0");
        require(_beneficiary != address(0), "Invalid beneficiary address");
        
        campaignCount++;
        
        campaigns[campaignCount] = Campaign({
            organizationName: _organizationName,
            title: _title,
            description: _description,
            category: _category,
            goalAmount: _goalAmount,
            currentAmount: 0,
            beneficiary: _beneficiary,
            active: true,
            createdAt: block.timestamp
        });
        
        emit CampaignCreated(campaignCount, _organizationName, _title, _beneficiary);
        
        return campaignCount;
    }
    
    /**
     * @dev 기부하기 (누구나 가능)
     */
    function donate(uint256 _campaignId, string memory _message) 
        external 
        payable 
        nonReentrant 
        whenNotPaused 
    {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.active, "Campaign is not active");
        
        // 기부 기록 저장
        donationCount++;
        
        donations[donationCount] = Donation({
            donor: msg.sender,
            campaignId: _campaignId,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        });
        
        // 캠페인 금액 업데이트
        campaign.currentAmount += msg.value;
        
        // 사용자 기부 내역 저장
        userDonations[msg.sender].push(donationCount);
        campaignDonations[_campaignId].push(donationCount);
        totalDonatedByUser[msg.sender] += msg.value;
        
        emit DonationMade(donationCount, _campaignId, msg.sender, msg.value, block.timestamp);
    }
    
    /**
     * @dev 기부금 인출 (수혜자만)
     */
    function withdrawFunds(uint256 _campaignId) 
        external 
        nonReentrant 
    {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
        
        Campaign storage campaign = campaigns[_campaignId];
        require(msg.sender == campaign.beneficiary, "Only beneficiary can withdraw");
        require(campaign.currentAmount > 0, "No funds to withdraw");
        
        uint256 amount = campaign.currentAmount;
        campaign.currentAmount = 0;
        
        (bool success, ) = campaign.beneficiary.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit FundsWithdrawn(_campaignId, campaign.beneficiary, amount);
    }
    
    /**
     * @dev 캠페인 활성화/비활성화 (관리자만)
     */
    function setCampaignStatus(uint256 _campaignId, bool _active) 
        external 
        onlyOwner 
    {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Invalid campaign ID");
        
        campaigns[_campaignId].active = _active;
        
        emit CampaignStatusChanged(_campaignId, _active);
    }
    
    /**
     * @dev 긴급 중지 (관리자만)
     */
    function pause() external onlyOwner {
        _pause();
    }
    
    /**
     * @dev 긴급 중지 해제 (관리자만)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
    
    // ============ 조회 함수 ============
    
    /**
     * @dev 사용자의 기부 내역 조회
     */
    function getUserDonations(address _user) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return userDonations[_user];
    }
    
    /**
     * @dev 캠페인의 기부 내역 조회
     */
    function getCampaignDonations(uint256 _campaignId) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return campaignDonations[_campaignId];
    }
    
    /**
     * @dev 기부 상세 정보 조회
     */
    function getDonation(uint256 _donationId) 
        external 
        view 
        returns (
            address donor,
            uint256 campaignId,
            uint256 amount,
            uint256 timestamp,
            string memory message
        ) 
    {
        Donation memory d = donations[_donationId];
        return (d.donor, d.campaignId, d.amount, d.timestamp, d.message);
    }
    
    /**
     * @dev 캠페인 상세 정보 조회
     */
    function getCampaign(uint256 _campaignId) 
        external 
        view 
        returns (
            string memory organizationName,
            string memory title,
            string memory description,
            string memory category,
            uint256 goalAmount,
            uint256 currentAmount,
            address beneficiary,
            bool active
        ) 
    {
        Campaign memory c = campaigns[_campaignId];
        return (
            c.organizationName,
            c.title,
            c.description,
            c.category,
            c.goalAmount,
            c.currentAmount,
            c.beneficiary,
            c.active
        );
    }
    
    /**
     * @dev 사용자의 총 기부 금액 조회
     */
    function getTotalDonated(address _user) 
        external 
        view 
        returns (uint256) 
    {
        return totalDonatedByUser[_user];
    }
    
    // ============ 내부 함수 ============
    
    /**
     * @dev 초기 Mock 캠페인 생성
     */
    function _createInitialCampaigns() private {
        // 캠페인 1: 숲속동물보호센터
        campaignCount++;
        campaigns[campaignCount] = Campaign({
            organizationName: unicode"숲속동물보호센터",
            title: unicode"겨울나기 따뜻한 보금자리 만들기",
            description: unicode"추운 겨울을 나는 유기동물들에게 따뜻한 보금자리를 만들어주세요",
            category: unicode"동물",
            goalAmount: 10 ether,
            currentAmount: 0,
            beneficiary: payable(owner()),
            active: true,
            createdAt: block.timestamp
        });
        
        // 캠페인 2: 초록나무재단
        campaignCount++;
        campaigns[campaignCount] = Campaign({
            organizationName: unicode"초록나무재단",
            title: unicode"사막화 방지 나무 심기 프로젝트",
            description: unicode"사막화를 막고 지구를 지키는 나무 심기에 동참해주세요",
            category: unicode"환경",
            goalAmount: 20 ether,
            currentAmount: 0,
            beneficiary: payable(owner()),
            active: true,
            createdAt: block.timestamp
        });
        
        // 캠페인 3: 희망교육협회
        campaignCount++;
        campaigns[campaignCount] = Campaign({
            organizationName: unicode"희망교육협회",
            title: unicode"소외계층 아동 교육 지원",
            description: unicode"교육의 기회를 놓친 아이들에게 희망을 선물해주세요",
            category: unicode"교육",
            goalAmount: 15 ether,
            currentAmount: 0,
            beneficiary: payable(owner()),
            active: true,
            createdAt: block.timestamp
        });
    }
    
    // ============ Fallback ============
    
    receive() external payable {
        revert("Please use the donate function");
    }
}