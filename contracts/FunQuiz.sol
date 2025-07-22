// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FunQuiz
 * @author Partner Coding
 * @notice Versi 2: Menambahkan biaya untuk bermain kuis.
 */
contract FunQuiz is Ownable {
    // --- State Variables ---

    uint256 public createQuizFee;
    uint256 public playQuizFee; // BIAYA BARU UNTUK BERMAIN
    uint256 public quizCounter;

    // --- Structs ---

    struct Question {
        string questionText;
        string[4] options;
        uint8 correctAnswerIndex;
        uint32 timeLimit;
        uint32 points;
    }

    struct Quiz {
        uint256 id;
        string title;
        address creator;
        Question[10] questions;
    }

    struct PlayerScore {
        address player;
        uint256 score;
    }

    // --- Mappings ---

    mapping(uint256 => Quiz) public quizzes;
    mapping(uint256 => PlayerScore[]) public leaderboards;
    mapping(uint256 => mapping(address => bool)) public hasPlayed;
    
    // MAPPING BARU: Untuk melacak siapa yang sudah bayar untuk bermain kuis tertentu
    mapping(uint256 => mapping(address => bool)) public hasPaidToPlay;

    // --- Events ---

    event QuizCreated(uint256 indexed quizId, address indexed creator, string title);
    event ScoreSubmitted(uint256 indexed quizId, address indexed player, uint256 score);
    event FeeUpdated(string feeType, uint256 newFee);
    event Withdrawn(address indexed to, uint256 amount);
    event PlayFeePaid(uint256 indexed quizId, address indexed player); // EVENT BARU

    // --- Constructor ---

    constructor(uint256 _initialCreateFee, uint256 _initialPlayFee) Ownable(msg.sender) {
        createQuizFee = _initialCreateFee;
        playQuizFee = _initialPlayFee;
        emit FeeUpdated("create", _initialCreateFee);
        emit FeeUpdated("play", _initialPlayFee);
    }

    // --- Functions ---
    
    /**
     * @notice FUNGSI BARU: Pengguna membayar untuk mendapatkan akses bermain kuis.
     * @param _quizId ID kuis yang ingin dimainkan.
     */
    function payToPlay(uint256 _quizId) external payable {
        require(quizzes[_quizId].creator != address(0), "FunQuiz: Kuis tidak ditemukan.");
        require(msg.value == playQuizFee, "FunQuiz: Biaya bermain tidak sesuai.");
        require(!hasPaidToPlay[_quizId][msg.sender], "FunQuiz: Anda sudah membayar untuk kuis ini.");

        hasPaidToPlay[_quizId][msg.sender] = true;
        emit PlayFeePaid(_quizId, msg.sender);
    }

    function createQuiz(
        string memory _title,
        Question[10] memory _questions
    ) external payable {
        require(msg.value == createQuizFee, "FunQuiz: Biaya pembuatan kuis tidak sesuai.");
        quizCounter++;
        uint256 newQuizId = quizCounter;
        quizzes[newQuizId] = Quiz({
            id: newQuizId,
            title: _title,
            creator: msg.sender,
            questions: _questions
        });
        emit QuizCreated(newQuizId, msg.sender, _title);
    }

    /**
     * @notice DIMODIFIKASI: Sekarang memeriksa apakah pengguna sudah bayar.
     */
    function submitScore(uint256 _quizId, uint256 _score) external {
        require(quizzes[_quizId].creator != address(0), "FunQuiz: Kuis tidak ditemukan.");
        require(hasPaidToPlay[_quizId][msg.sender], "FunQuiz: Anda harus membayar untuk bermain kuis ini."); // PENGECEKAN BARU
        require(!hasPlayed[_quizId][msg.sender], "FunQuiz: Anda sudah submit skor untuk kuis ini.");

        hasPlayed[_quizId][msg.sender] = true;
        leaderboards[_quizId].push(PlayerScore({
            player: msg.sender,
            score: _score
        }));
        emit ScoreSubmitted(_quizId, msg.sender, _score);
    }

    // --- View Functions ---
    // (Tidak ada perubahan pada view functions: getQuizById, getLeaderboard, getContractBalance)

    function getQuizById(uint256 _quizId) external view returns (Quiz memory) {
        return quizzes[_quizId];
    }

    function getLeaderboard(uint256 _quizId) external view returns (PlayerScore[] memory) {
        return leaderboards[_quizId];
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // --- Admin Functions ---

    /**
     * @notice FUNGSI BARU: Mengatur biaya untuk bermain kuis.
     * @param _newFee Biaya baru dalam wei.
     */
    function setPlayQuizFee(uint256 _newFee) external onlyOwner {
        playQuizFee = _newFee;
        emit FeeUpdated("play", _newFee);
    }

    function setCreateQuizFee(uint256 _newFee) external onlyOwner {
        createQuizFee = _newFee;
        emit FeeUpdated("create", _newFee);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "FunQuiz: Tidak ada saldo untuk ditarik.");
        (bool success, ) = owner().call{value: balance}("");
        require(success, "FunQuiz: Penarikan gagal.");
        emit Withdrawn(owner(), balance);
    }
}