document.addEventListener("DOMContentLoaded", () => {
  // DOM elements
  const welcomeScreen = document.getElementById("welcome-screen");
  const startBtn = document.getElementById("start-btn");
  const quizContainer = document.getElementById("quiz-container");
  const questionCounter = document.getElementById("question-counter");
  const questionText = document.getElementById("question-text");
  const answerBtns = document.querySelectorAll(".answer-btn");
  const nextBtn = document.getElementById("next-btn");
  const endScreen = document.getElementById("end-screen");
  const finalScore = document.getElementById("final-score");
  const homeBtn = document.getElementById("home-btn");
  const score = document.getElementById("score");

  // State variables
  let currentQuestionIndex = 0;
  let scoreTracker = 0;
  let questions = [];
  let answers = [];

  // Event listener for the start button
  startBtn.addEventListener("click", async () => {
    const selectedCategory = document.querySelector(
      'input[name="category"]:checked'
    );

    if (!selectedCategory) {
      alert("Please select a category!");
      return;
    }

    startBtn.textContent = "Loading...";

    const categoryId = selectedCategory.value;

    const url = `https://opentdb.com/api.php?amount=10&category=${categoryId}`;

    const data = await fetchAPI(url);

    questions = fetchQuestions(data);
    answers = fetchAnswers(data);

    // Start the quiz
    welcomeScreen.classList.add("hide");
    quizContainer.classList.remove("hide");

    setQuestion();
    setAnswers();

    nextBtn.classList.add("hide");
  });

  // Event listeners for answer buttons
  answerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.style.backgroundColor = "#5753e2";
      btn.style.color = "white";

      const selectedAnswer = btn.textContent;
      const correctAnswer = answers[currentQuestionIndex].answers[0];

      answerBtns.forEach((btn) => {
        if (btn.textContent === correctAnswer) {
          btn.style.backgroundColor = "#45a049";
          btn.style.color = "white";
          btn.style.borderColor = "#45a049";
        }
      });

      if (selectedAnswer === correctAnswer) {
        scoreTracker++;
        score.textContent = `Score: ${scoreTracker}`;
      }
      answerBtns.forEach((btn) => (btn.disabled = true));
      nextBtn.classList.remove("hide");

      if (currentQuestionIndex === 9) {
        nextBtn.textContent = "End Quiz";
      }
    });
  });

  // Event listener for the next button
  nextBtn.addEventListener("click", () => {
    if (currentQuestionIndex === 9) {
      endQuiz();
      return;
    }
    answerBtns.forEach((btn) => {
      btn.style.backgroundColor = "white";
      btn.style.color = "black";
      btn.style.borderColor = "none";
    });
    currentQuestionIndex++;
    setQuestion();
    setAnswers();
    answerBtns.forEach((btn) => {
      btn.disabled = false;
      btn.style.backgroundColor = "white";
      btn.style.color = "black";
      btn.style.borderColor = "#5753e2";
    });
    nextBtn.classList.add("hide");
    nextBtn.textContent = "Next Question";
  });

  // Fetch the quiz data from the API
  async function fetchAPI(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert(`Error fetching API: ${errorMessage}`);
      console.error(`Error fetching API: ${errorCode} ${errorMessage}`);
      return;
    }
  }

  // Extract questions from the fetched data
  function fetchQuestions(data) {
    return data.results.map((object) => ({
      question: decodeHTML(object.question),
    }));
  }

  // Extract answers from the fetched data
  function fetchAnswers(data) {
    return data.results.map((object) => ({
      answers: [
        decodeHTML(object.correct_answer),
        ...object.incorrect_answers.map((incorrectAnswer) =>
          decodeHTML(incorrectAnswer)
        ),
      ],
    }));
  }

  // Set the current question text and counter
  function setQuestion() {
    questionText.textContent = questions[currentQuestionIndex].question;
    questionCounter.textContent = `Question ${currentQuestionIndex + 1} of 10`;
  }

  // Set the answers for the current question
  function setAnswers() {
    const shuffledAnswers = [...answers[currentQuestionIndex].answers].sort(
      () => Math.random() - 0.5
    );

    answerBtns.forEach((btn, index) => {
      btn.classList.remove("hide");
      btn.textContent = shuffledAnswers[index] || "";
      if (!btn.textContent) {
        btn.classList.add("hide");
      }
    });
  }

  // Decode HTML entities
  function decodeHTML(html) {
    const text = document.createElement("textarea");
    text.innerHTML = html;
    return text.value;
  }

  // End the quiz and show the final score
  function endQuiz() {
    answerBtns.forEach((btn) => {
      btn.style.backgroundColor = "white";
      btn.style.color = "black";
      btn.style.borderColor = "#5753e2";
    });
    quizContainer.classList.add("hide");
    endScreen.classList.remove("hide");
    finalScore.textContent = `Final score: ${scoreTracker}/10 `;
    homeBtn.classList.remove("hide");
  }

  // Reset the quiz and go back to the welcome screen
  homeBtn.addEventListener("click", () => {
    resetQuiz();
    endScreen.classList.add("hide");
    welcomeScreen.classList.remove("hide");
  });

  // Reset quiz state
  function resetQuiz() {
    currentQuestionIndex = 0;
    scoreTracker = 0;
    score.textContent = "Score: 0";
    questionCounter.textContent = "Question 1 of 10";
    nextBtn.textContent = "Next Question";
    startBtn.textContent = "START ADVENTURE";
    nextBtn.classList.add("hide");
    answerBtns.forEach((btn) => (btn.disabled = false));
  }
});
