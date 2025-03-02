const questions = [
  { question: "Ваш пол", options: ["Мужчина", "Женщина"] },
  { question: "Укажите ваш возраст:", options: ["До 18", "От 18 до 28", "От 29 до 35", "От 36"] },
  { question: "Выберите лишнее:", options: ["Дом", "Шалаш", "Бунгало", "Скамейка", "Хижина"] },
  { question: "Продолжите числовой ряд: 18 20 24 32", options: ["62", "48", "74", "57", "60", "77"] },
  {
    question: "Выберите цвет, который сейчас наиболее Вам приятен:",
    type: "color-grid",
    colors: ["#A8A8A8", "#0000A9", "#00A701", "#F60100", "#FDFF19", "#A95403", "#000000", "#850068", "#46B3AC"]
  },
  {
    question: "Отдохните пару секунд, еще раз Выберите цвет, который сейчас наиболее Вам приятен:",
    type: "color-grid",
    colors: ["#A8A8A8", "#46B2AC", "#A95403", "#00A701", "#000000", "#F60100", "#850068", "#FDFF19", "#0000A9"]
  },
  { question: "Какой из городов лишний?", options: ["Вашингтон", "Лондон", "Париж", "Нью-Йорк", "Москва", "Оттава"] },
  {
    question: "Выберите правильную фигуру из четырёх пронумерованных.",
    options: ["1", "2", "3", "4"],
    img: ["img/image2.svg"],
    useSquares: true
  },
  {
    question: "Вам привычнее и важнее:",
    options: [
      "Наслаждаться каждой минутой проведенного времени",
      "Быть устремленными мыслями в будущее",
      "Учитывать в ежедневной практике прошлый опыт"
    ]
  },
  {
    question: "Какое определение, по-Вашему, больше подходит к этому геометрическому изображению:",
    options: ["Оно остроконечное", "Оно устойчиво", "Оно находится в состоянии равновесия"],
    img: ["img/image1.svg"]
  },
  {
    question: "Вставьте подходящее число",
    options: ["34", "36", "53", "44", "66", "42"],
    img: ["img/image3.svg"],
    useSquares: true
  }
];

let currentQuestionIndex = 0;

const startQuizButtons = document.querySelectorAll(".startQuizButton");
const quizContainer = document.querySelector(".quizContainer");
const questionElement = document.querySelector(".question");
const optionsElement = document.querySelector(".options");
const nextButton = document.querySelector(".nextButton");
const headerDropdown = document.querySelector('.header__dropdown-button');
const headerDropdownContent = document.querySelector('.header__dropdown-content');
const headerDropdownContentButton = document.querySelector('.header__dropdown-content-button');
const headerDropdownInfo = document.querySelector('.header__dropdown-info');
const headerDropdownInfoImg = document.querySelector('.header__dropdown-info-img');
const headerDropdownInfoText = document.querySelector('.header__dropdown-info-text');
const headerDropdownInfoComplite = document.querySelector('.header__dropdown-info-complite');
const optionsImg = document.querySelector('.options__img');
const infoQuestion = document.querySelector('.info__question');
const resultsProcessing = document.querySelector('.results__processing');
const body = document.body;
const progress = document.querySelector(".progress");
const progressBar = document.querySelector(".progress-bar");

headerDropdown.addEventListener('click', () => {
  headerDropdownContent.style.display = headerDropdownContent.style.display === "block" ? "none" : "block";
});

headerDropdownContentButton.addEventListener('click', () => {
  headerDropdownContent.style.display = "none";
});

const updateProgressBar = () => {
  const loading = ((currentQuestionIndex + 1) / questions.length) * 100;
  progress.style.width = `${loading}%`;
};

const showQuestion = () => {
  const { question, options, img, type, colors, useSquares } = questions[currentQuestionIndex];
  questionElement.textContent = question;
  optionsElement.innerHTML = "";
  const squareOptionsElement = document.querySelector(".square-options");
  squareOptionsElement.innerHTML = "";

  optionsImg.style.display = "none";
  optionsImg.src = "";

  if (img && img.length > 0) {
    optionsImg.src = img[0];
    optionsImg.style.display = "block";
  }

  if (useSquares || type === "color-grid") {
    squareOptionsElement.style.display = type === "color-grid" ? "grid" : "flex";
    squareOptionsElement.classList.toggle("color-grid", type === "color-grid");
    optionsElement.style.display = "none";

    const items = type === "color-grid" ? colors : options;
    items.forEach((item, index) => {
      const square = document.createElement("div");
      square.classList.add(type === "color-grid" ? "color-square" : "square-option");
      if (type === "color-grid") {
        square.style.backgroundColor = item;
      } else {
        square.textContent = item;
      }
      square.dataset.index = index;

      square.addEventListener("click", () => {
        document.querySelectorAll(`.${type === "color-grid" ? "color-square" : "square-option"}`).forEach(sq => sq.classList.remove("selected"));
        square.classList.add("selected");
        nextButton.disabled = false;
        nextButton.classList.remove("hidden");
      });

      squareOptionsElement.appendChild(square);
    });
  } else if (options) {
    squareOptionsElement.style.display = "none";
    optionsElement.style.display = "flex";

    options.forEach((option, index) => {
      const wrapper = document.createElement("div");
      wrapper.classList.add("radio-wrapper");

      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "option";
      radio.value = option;
      radio.id = `option${index}`;

      const label = document.createElement("label");
      label.classList.add("options__label");
      label.htmlFor = `option${index}`;
      label.textContent = option;

      wrapper.appendChild(radio);
      wrapper.appendChild(label);
      optionsElement.appendChild(wrapper);
    });
  }

  nextButton.disabled = true;
  nextButton.classList.add("hidden");
  optionsElement.addEventListener("change", () => {
    nextButton.disabled = false;
    nextButton.classList.remove("hidden");
  });

  updateProgressBar();
};

const nextQuestion = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
};

const endQuiz = () => {
  optionsImg.src = "";
  questionElement.textContent = "";
  optionsElement.innerHTML = "";
  document.querySelector(".square-options").innerHTML = "";
  nextButton.style.display = "none";
  infoQuestion.style.display = "none";
  resultsProcessing.style.display = "block";

  setTimeout(() => {
    let timeLeft = 600;
    const timerInterval = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      document.getElementById('time').textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      timeLeft--;
      if (timeLeft < 0) {
        clearInterval(timerInterval);
        document.getElementById('time').textContent = "Время вышло!";
      }
    }, 1000);

    resultsProcessing.style.display = "none";
    headerDropdownInfoText.style.display = "none";
    headerDropdownInfoComplite.style.display = "flex";
    document.querySelector(".quiz__end").style.display = "flex";
    progressBar.style.display = "none";
  }, 1000);

};

startQuizButtons.forEach(button => {
  button.addEventListener("click", () => {
    headerDropdownInfo.style.display = "flex";
    quizContainer.classList.remove("hidden");
    quizContainer.classList.add("visible");
    startQuizButtons.forEach(btn => btn.style.display = "none");
    showQuestion();
    body.classList.add("no-scroll");
    progress.style.width = "5%";
  });
});

nextButton.addEventListener("click", nextQuestion);

document.querySelector('.quiz__end-button').addEventListener('click', () => {
  const quizEndElements = document.querySelectorAll('.quiz__end-title-top, .quiz__end-text, .quiz__end-title, .quiz__end-info, .quiz__end-timer, .quiz__end-button, .quiz__end-info-botton');
  quizEndElements.forEach(el => el.style.display = 'none');
  

  fetch('https://swapi.dev/api/people/1/')
    .then(response => response.json())
    .then(data => {
      const formattedData = `
        <div id="api-response">
          <h2 class="api-response__title">${data.name}</h2>
          <div class="api-response__grid">
            <div class="api-response__item">
              <p class="api-response__label">Рост:</p>
              <p class="api-response__value">${data.height} см</p>
            </div>
            <div class="api-response__item">
              <p class="api-response__label">Вес:</p>
              <p class="api-response__value">${data.mass} кг</p>
            </div>
            <div class="api-response__item">
              <p class="api-response__label">Цвет волос:</p>
              <p class="api-response__value">${data.hair_color}</p>
            </div>
            <div class="api-response__item">
              <p class="api-response__label">Цвет кожи:</p>
              <p class="api-response__value">${data.skin_color}</p>
            </div>
            <div class="api-response__item">
              <p class="api-response__label">Цвет глаз:</p>
              <p class="api-response__value">${data.eye_color}</p>
            </div>
            <div class="api-response__item">
              <p class="api-response__label">Год рождения:</p>
              <p class="api-response__value">${data.birth_year}</p>
            </div>
            <div class="api-response__item">
              <p class="api-response__label">Пол:</p>
              <p class="api-response__value">${data.gender}</p>
            </div>
            <div class="api-response__item">
              <p class="api-response__label">Родная планета:</p>
              <p class="api-response__value"><a href="${data.homeworld}" target="_blank" class="api-response__link">${data.homeworld}</a></p>
            </div>
          </div>
          <div class="api-response__section">
            <p class="api-response__subtitle">Фильмы:</p>
            <ul class="api-response__list">
              ${data.films.map(film => `<li class="api-response__list-item"><a href="${film}" target="_blank" class="api-response__link">${film}</a></li>`).join('')}
            </ul>
          </div>
          <div class="api-response__section">
            <p class="api-response__subtitle">Транспортные средства:</p>
            <ul class="api-response__list">
              ${data.vehicles.map(vehicle => `<li class="api-response__list-item"><a href="${vehicle}" target="_blank" class="api-response__link">${vehicle}</a></li>`).join('')}
            </ul>
          </div>
          <div class="api-response__section">
            <p class="api-response__subtitle">Звездные корабли:</p>
            <ul class="api-response__list">
              ${data.starships.map(starship => `<li class="api-response__list-item"><a href="${starship}" target="_blank" class="api-response__link">${starship}</a></li>`).join('')}
            </ul>
          </div>
          <div class="api-response__grid">
            <div class="api-response__item">
              <p class="api-response__label">Дата создания:</p>
              <p class="api-response__value">${new Date(data.created).toLocaleString()}</p>
            </div>
            <div class="api-response__item">
              <p class="api-response__label">Дата изменения:</p>
              <p class="api-response__value">${new Date(data.edited).toLocaleString()}</p>
            </div>
          </div>
        </div>
      `;
      const apiResponse = document.querySelector('.api__response');
      apiResponse.innerHTML = formattedData;
      apiResponse.style.display = 'flex';
    })
    .catch(error => {
      const apiResponse = document.querySelector('.api__response');
      apiResponse.innerHTML = `<p style="color: red;">Ошибка: ${error.message}</p>`;
      apiResponse.style.display = 'flex';
    });
});