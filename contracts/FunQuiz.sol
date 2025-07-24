// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title FunQuiz
 * @author L RMN
 */
contract FunQuiz is Ownable {
    uint256 public createQuizFee;
    uint256 public playQuizFee;
    uint256 public quizCounter;

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

    mapping(uint256 => Quiz) public quizzes;
    mapping(uint256 => mapping(address => bool)) public hasPaidToPlay;
    mapping(uint256 => mapping(address => uint256)) public playerScores;
    mapping(uint256 => address[]) public quizParticipants;
    mapping(uint256 => mapping(address => bool)) private isParticipant;

    event QuizCreated(uint256 indexed quizId, address indexed creator, string title);
    event ScoreUpdated(uint256 indexed quizId, address indexed player, uint256 newScore);
    event FeeUpdated(string feeType, uint256 newFee);
    event Withdrawn(address indexed to, uint256 amount);
    event PlayFeePaid(uint256 indexed quizId, address indexed player);

    constructor(uint256 _initialCreateFee, uint256 _initialPlayFee) Ownable(msg.sender) {
        createQuizFee = _initialCreateFee;
        playQuizFee = _initialPlayFee;
    }

    function payToPlay(uint256 _quizId) external payable {
        require(quizzes[_quizId].creator != address(0), "FunQuiz: Kuis tidak ditemukan.");
        require(msg.value == playQuizFee, "FunQuiz: Biaya bermain tidak sesuai.");
        if (!hasPaidToPlay[_quizId][msg.sender]) {
            hasPaidToPlay[_quizId][msg.sender] = true;
            emit PlayFeePaid(_quizId, msg.sender);
        }
    }

    function createQuiz(string memory _title, Question[10] memory _questions) external payable {
        require(msg.value == createQuizFee, "FunQuiz: Biaya pembuatan kuis tidak sesuai.");
        quizCounter++;
        uint256 newQuizId = quizCounter;

        Quiz storage newQuiz = quizzes[newQuizId];
        newQuiz.id = newQuizId;
        newQuiz.title = _title;
        newQuiz.creator = msg.sender;

        for (uint i = 0; i < _questions.length; i++) {
            newQuiz.questions[i] = _questions[i];
        }

        emit QuizCreated(newQuizId, msg.sender, _title);
    }

    function submitScore(uint256 _quizId, uint256 _score) external {
        require(quizzes[_quizId].creator != address(0), "FunQuiz: Kuis tidak ditemukan.");
        require(hasPaidToPlay[_quizId][msg.sender], "FunQuiz: Anda harus membayar untuk bermain kuis ini.");
        
        uint256 existingScore = playerScores[_quizId][msg.sender];
        
        if (_score > existingScore) {
            playerScores[_quizId][msg.sender] = _score;
            if (!isParticipant[_quizId][msg.sender]) {
                quizParticipants[_quizId].push(msg.sender);
                isParticipant[_quizId][msg.sender] = true;
            }
            emit ScoreUpdated(_quizId, msg.sender, _score);
        }
    }

    function getQuizById(uint256 _quizId) external view returns (Quiz memory) {
        return quizzes[_quizId];
    }

    function getQuestionsByQuizId(uint256 _quizId) external view returns (Question[10] memory) {
        require(quizzes[_quizId].creator != address(0), "FunQuiz: Kuis tidak ditemukan.");
        return quizzes[_quizId].questions;
    }

    function getLeaderboardData(uint256 _quizId) external view returns (address[] memory addresses, uint256[] memory scores) {
        address[] memory participants = quizParticipants[_quizId];
        scores = new uint256[](participants.length);

        for (uint i = 0; i < participants.length; i++) {
            scores[i] = playerScores[_quizId][participants[i]];
        }

        return (participants, scores);
    }

    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }

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
