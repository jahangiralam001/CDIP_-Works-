const quizData = {
    math: [
        { question: "What is 2 + 2?", options: ["3", "4", "5", "6"], answer: "4" },
        { question: "What is 5 * 6?", options: ["30", "28", "35", "32"], answer: "30" },
        { question: "What is 10 / 2?", options: ["3", "4", "5", "6"], answer: "5" }
    ],
    english: [
        { question: "What is the antonym of 'happy'?", options: ["sad", "joyful", "content", "pleased"], answer: "sad" },
        { question: "Which of the following is a verb?", options: ["quickly", "beautiful", "run", "happiness"], answer: "run" },
        { question: "What is the plural of 'mouse'?", options: ["mice", "mouses", "mouse", "mices"], answer: "mice" }
    ],
    general: [
        { question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Lisbon"], answer: "Paris" },
        { question: "Which language is used for web development?", options: ["Python", "Java", "C++", "JavaScript"], answer: "JavaScript" },
        { question: "What is the largest planet in our solar system?", options: ["Earth", "Mars", "Jupiter", "Saturn"], answer: "Jupiter" }
    ]
};

let timer;
let timeLeft = 5;
let currentSubject = 'math';
let currentQuestionIndex = 0;
let completedSubjects = new Set();
let isQuizActive = false;
let answeredQuestions = new Set();

function startTimer() {
    clearInterval(timer);
    timeLeft = 5;
    document.getElementById('time').textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

function loadQuiz(subject) {
    if (completedSubjects.has(subject)) {
        alert("You have already completed this subject.");
        return;
    }

    if (isQuizActive) {
        alert("You must complete the current quiz before switching subjects.");
        return;
    }

    isQuizActive = true;
    currentSubject = subject;
    currentQuestionIndex = 0;
    answeredQuestions.clear();
    startTimer();

    showQuestion();
}

function showQuestion() {
    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = '';
    const questionData = quizData[currentSubject][currentQuestionIndex];

    const questionDiv = document.createElement('div');
    questionDiv.className = 'question mb-4';

    const questionTitle = document.createElement('h4');
    questionTitle.textContent = `${currentQuestionIndex + 1}. ${questionData.question}`;
    questionDiv.appendChild(questionTitle);

    const optionsList = document.createElement('ul');
    optionsList.className = 'list-unstyled';

    questionData.options.forEach(option => {
        const optionItem = document.createElement('li');

        const optionLabel = document.createElement('label');
        optionLabel.textContent = option;
        optionLabel.className = 'd-block';

        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = `question-${currentQuestionIndex}`;
        optionInput.value = option;
        optionInput.className = 'mr-2';

        optionLabel.prepend(optionInput);
        optionItem.appendChild(optionLabel);
        optionsList.appendChild(optionItem);
    });

    questionDiv.appendChild(optionsList);
    quizContainer.appendChild(questionDiv);
}

function nextQuestion() {
    const selectedOption = document.querySelector(`input[name="question-${currentQuestionIndex}"]:checked`);
    // if (!selectedOption) {
    //     alert("You must answer the current question before proceeding to the next one.");
    //     return;
    // }

    answeredQuestions.add(currentQuestionIndex);

    if (currentQuestionIndex < quizData[currentSubject].length - 1) {
        currentQuestionIndex++;
        startTimer();
        showQuestion();
    } else {
        alert("You have reached the end of the quiz. Submitting the quiz now.");
        submitQuiz();
    }
}


function prevQuestion() {
    if (answeredQuestions.has(currentQuestionIndex)) {
        alert("You cannot go back to a question that has already been answered or if time has ended.");
        document.getElementById('prev-question').disabled = true;
        return;
    }

    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        startTimer();
        showQuestion();
    }
}

function completeQuiz() {
    completedSubjects.add(currentSubject);
    const options = document.querySelectorAll(`#quiz-container input[type="radio"]`);
    options.forEach(option => {
        option.disabled = true;
    });
    alert(`Time's up for ${currentSubject}! Please select another subject.`);
    isQuizActive = false;
}

function submitQuiz() {
    if (timeLeft <= 0) {
        alert("Time is up! You cannot submit this quiz.");
        return;
    }

    const resultDiv = document.getElementById('result');
    let score = 0;
    const quizContainer = document.getElementById('quiz-container');
    const currentSubject = quizContainer.getAttribute('data-subject');

    quizData[currentSubject].forEach((questionData, index) => {
        const selectedOption = document.querySelector(`input[name="question-${index}"]:checked`);
        if (selectedOption && selectedOption.value === questionData.answer) {
            score++;
            selectedOption.parentElement.classList.add('correct');
        } else if (selectedOption) {
            selectedOption.parentElement.classList.add('incorrect');
        }
    });

    resultDiv.textContent = `Your score is ${score} out of ${quizData[currentSubject].length}`;
    completedSubjects.add(currentSubject);
    clearInterval(timer);
    isQuizActive = false;
}

document.getElementById('submit-quiz').addEventListener('click', submitQuiz);

loadQuiz('math');
