// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title DonationLedger
 * @dev 블록체인 기반 기부 기록 스마트 컨트랙트
 * @notice Layer2(Arbitrum)에 배포하여 투명한 기부 기록 관리
 */
contract DonationLedger {
    
    // 캠페인 구조체
    struct Campaign {
        string campaignId;      // 오프체인 캠페인 ID
        address organization;   // 단체 주소
        string name;           // 캠페인 이름
        bool active;           // 활성 상태
        uint256 totalDonated;  // 총 기부액
        uint256 createdAt;     // 생성 시간
    }
    
    // 기부 기록 구조체
    struct Donation {
        address donor;         // 기부자 주소 (DID로 활용)
        string campaignId;     // 캠페인 ID
        uint256 amount;        // 기부 금액
        uint256 timestamp;     // 기부 시간
        string message;        // 기부 메시지 (선택)
    }
    
    // 컨트랙트 소유자
    address public owner;
    
    // 캠페인 매핑 (campaignId => Campaign)
    mapping(string => Campaign) public campaigns;
    
    // 전체 기부 기록 배열
    Donation[] public donations;
    
    // 사용자별 기부 기록 (address => donation indices)
    mapping(address => uint256[]) public donorDonations;
    
    // 캠페인별 기부 기록 (campaignId => donation indices)
    mapping(string => uint256[]) public campaignDonations;
    
    // 사용자별 총 기부액
    mapping(address => uint256) public totalDonatedByUser;
    
    // 이벤트
    event CampaignCreated(
        string indexed campaignId,
        address indexed organization,
        string name,
        uint256 timestamp
    );
    
    event DonationMade(
        address indexed donor,
        string indexed campaignId,
        uint256 amount,
        uint256 timestamp,
        uint256 donationIndex
    );
    
    event CampaignStatusChanged(
        string indexed campaignId,
        bool active
    );
    
    // 수정자
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier campaignExists(string memory _campaignId) {
        require(bytes(campaigns[_campaignId].campaignId).length > 0, "Campaign does not exist");
        _;
    }
    
    modifier campaignActive(string memory _campaignId) {
        require(campaigns[_campaignId].active, "Campaign is not active");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * @dev 새 캠페인 생성
     * @param _campaignId 캠페인 ID
     * @param _organization 단체 주소
     * @param _name 캠페인 이름
     */
    function createCampaign(
        string memory _campaignId,
        address _organization,
        string memory _name
    ) external onlyOwner {
        require(bytes(campaigns[_campaignId].campaignId).length == 0, "Campaign already exists");
        require(_organization != address(0), "Invalid organization address");
        
        campaigns[_campaignId] = Campaign({
            campaignId: _campaignId,
            organization: _organization,
            name: _name,
            active: true,
            totalDonated: 0,
            createdAt: block.timestamp
        });
        
        emit CampaignCreated(_campaignId, _organization, _name, block.timestamp);
    }
    
    /**
     * @dev 기부하기 (핵심 함수)
     * @param _campaignId 캠페인 ID
     * @param _message 기부 메시지 (선택)
     */
    function donate(
        string memory _campaignId,
        string memory _message
    ) external payable campaignExists(_campaignId) campaignActive(_campaignId) {
        require(msg.value > 0, "Donation amount must be greater than 0");
        
        // 기부 기록 생성
        Donation memory newDonation = Donation({
            donor: msg.sender,
            campaignId: _campaignId,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message
        });
        
        uint256 donationIndex = donations.length;
        donations.push(newDonation);
        
        // 인덱스 매핑 업데이트
        donorDonations[msg.sender].push(donationIndex);
        campaignDonations[_campaignId].push(donationIndex);
        
        // 총액 업데이트
        campaigns[_campaignId].totalDonated += msg.value;
        totalDonatedByUser[msg.sender] += msg.value;
        
        // 단체에 기부금 전송
        (bool success, ) = campaigns[_campaignId].organization.call{value: msg.value}("");
        require(success, "Transfer to organization failed");
        
        emit DonationMade(msg.sender, _campaignId, msg.value, block.timestamp, donationIndex);
    }
    
    /**
     * @dev 캠페인 활성 상태 변경
     */
    function setCampaignActive(string memory _campaignId, bool _active) 
        external 
        onlyOwner 
        campaignExists(_campaignId) 
    {
        campaigns[_campaignId].active = _active;
        emit CampaignStatusChanged(_campaignId, _active);
    }
    
    /**
     * @dev 특정 사용자의 기부 기록 조회
     * @param _donor 기부자 주소 (DID)
     * @return 기부 인덱스 배열
     */
    function getDonationsByDonor(address _donor) external view returns (uint256[] memory) {
        return donorDonations[_donor];
    }
    
    /**
     * @dev 특정 캠페인의 기부 기록 조회
     */
    function getDonationsByCampaign(string memory _campaignId) 
        external 
        view 
        returns (uint256[] memory) 
    {
        return campaignDonations[_campaignId];
    }
    
    /**
     * @dev 특정 기부 상세 정보 조회
     */
    function getDonation(uint256 _index) external view returns (Donation memory) {
        require(_index < donations.length, "Invalid donation index");
        return donations[_index];
    }
    
    /**
     * @dev 전체 기부 개수 조회
     */
    function getTotalDonations() external view returns (uint256) {
        return donations.length;
    }
    
    /**
     * @dev 캠페인 정보 조회
     */
    function getCampaign(string memory _campaignId) 
        external 
        view 
        campaignExists(_campaignId)
        returns (Campaign memory) 
    {
        return campaigns[_campaignId];
    }
    
    /**
     * @dev 사용자의 DID 검증용 - 특정 주소가 기부 이력이 있는지 확인
     * @param _address 확인할 주소
     * @return 기부 이력 존재 여부
     */
    function hasDonationHistory(address _address) external view returns (bool) {
        return donorDonations[_address].length > 0;
    }
    
    /**
     * @dev 사용자의 기부 통계 (DID 크레덴셜용)
     * @param _donor 기부자 주소
     * @return totalAmount 총 기부액
     * @return donationCount 기부 횟수
     */
    function getDonorStats(address _donor) 
        external 
        view 
        returns (uint256 totalAmount, uint256 donationCount) 
    {
        return (totalDonatedByUser[_donor], donorDonations[_donor].length);
    }
}
