// Данные квеста
const questData = {
    questions: [
        {
            id: 1,
            question: "Где мы познакомились?",
            options: ["Школа", "Лагерь", "Двор", "В интернете"],
            correct: 2
        },
        {
            id: 2,
            question: "Какой мой самый смешной провал на твоих глазах?",
            options: ["Упал(а) с велосипеда", "Пересолил(а) торт", "Забыл(а) слова песни на концерте", "Все вышеперечисленное 😅"],
            correct: 3
        },
        {
            id: 3,
            question: "Что ты больше всего любишь есть?",
            options: ["Пицца", "Суши", "Торт", "Все сладкое"],
            correct: 3
        },
        {
            id: 4,
            question: "Какой подарок ты НЕ хочешь получить? 😉",
            options: ["Носки", "Шампунь", "Учебник", "Все эти варианты"],
            correct: 3
        },
        {
            id: 5,
            question: "Сколько раз за этот год я говорил(а) тебе 'Спасибо'?",
            options: ["10", "16", "25", "Слишком много, чтобы сосчитать"],
            correct: 1
        }
    ]
};

// Состояние приложения
let currentQuestion = 0;
let selectedAnswer = null;
let answers = [];

// Элементы DOM
const welcomeScreen = document.getElementById('welcome-screen');
const questScreen = document.getElementById('quest-screen');
const finalScreen = document.getElementById('final-screen');
const startQuestBtn = document.getElementById('start-quest');
const questionContainer = document.getElementById('question-container');
const currentQuestionSpan = document.getElementById('current-question');
const answerBtn = document.getElementById('answer-btn');
const nextBtn = document.getElementById('next-btn');

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    startQuestBtn.addEventListener('click', startQuest);
    answerBtn.addEventListener('click', checkAnswer);
    nextBtn.addEventListener('click', nextQuestion);
    
    // Запуск анимации падающих сердечек
    createFallingHearts();
    
    // Защита от копирования
    preventCopying();
});

// Запуск квеста
function startQuest() {
    welcomeScreen.classList.remove('active');
    questScreen.classList.add('active');
    showQuestion();
}

// Показать текущий вопрос
function showQuestion() {
    const question = questData.questions[currentQuestion];
    currentQuestionSpan.textContent = currentQuestion + 1;
    
    questionContainer.innerHTML = `
        <div class="question">${question.question}</div>
        <div class="options">
            ${question.options.map((option, index) => `
                <div class="option" data-index="${index}">
                    ${String.fromCharCode(65 + index)}) ${option}
                </div>
            `).join('')}
        </div>
    `;
    
    // Добавить обработчики для вариантов ответов
    const options = questionContainer.querySelectorAll('.option');
    options.forEach(option => {
        option.addEventListener('click', () => selectOption(option));
    });
    
    // Сбросить состояние
    selectedAnswer = null;
    answerBtn.disabled = true;
    answerBtn.style.opacity = '0.5';
}

// Выбор варианта ответа
function selectOption(optionElement) {
    // Убрать выделение со всех вариантов
    questionContainer.querySelectorAll('.option').forEach(opt => {
        opt.classList.remove('selected');
    });
    
    // Выделить выбранный вариант
    optionElement.classList.add('selected');
    selectedAnswer = parseInt(optionElement.dataset.index);
    
    // Активировать кнопку "Ответить"
    answerBtn.disabled = false;
    answerBtn.style.opacity = '1';
}

// Проверить ответ
function checkAnswer() {
    if (selectedAnswer === null) return;
    
    const question = questData.questions[currentQuestion];
    const options = questionContainer.querySelectorAll('.option');
    
    // Показать правильный ответ
    options[question.correct].classList.add('correct');
    
    if (selectedAnswer !== question.correct) {
        options[selectedAnswer].classList.add('incorrect');
    }
    
    // Сохранить ответ
    answers.push({
        questionId: question.id,
        selected: selectedAnswer,
        correct: selectedAnswer === question.correct
    });
    
    // Показать кнопку "Дальше"
    answerBtn.style.display = 'none';
    nextBtn.style.display = 'inline-block';
    
    // Отключить выбор вариантов
    options.forEach(option => {
        option.style.pointerEvents = 'none';
    });
}

// Следующий вопрос
function nextQuestion() {
    currentQuestion++;
    
    if (currentQuestion < questData.questions.length) {
        // Показать следующий вопрос
        answerBtn.style.display = 'inline-block';
        nextBtn.style.display = 'none';
        showQuestion();
    } else {
        // Показать финальный экран
        showFinalScreen();
    }
}

// Показать финальный экран
function showFinalScreen() {
    questScreen.classList.remove('active');
    finalScreen.classList.add('active');
    
    // Запустить анимацию падающих сердечек на финальном экране
    createFallingHearts();
    
    // Настроить воспроизведение трека после показа финального экрана
    setTimeout(() => {
        setupMusicTrack();
    }, 100);
    
    // Показать статистику (опционально)
    const correctAnswers = answers.filter(answer => answer.correct).length;
    console.log(`Правильных ответов: ${correctAnswers} из ${questData.questions.length}`);
}

// Создание падающих сердечек
function createFallingHearts() {
    const hearts = ['❤️', '💖', '💕', '💗', '💓'];
    
    setInterval(() => {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.animationDuration = (Math.random() * 3 + 3) + 's';
        
        document.body.appendChild(heart);
        
        // Удалить сердечко после анимации
        setTimeout(() => {
            if (heart.parentNode) {
                heart.parentNode.removeChild(heart);
            }
        }, 6000);
    }, 500);
}

// Функция для обновления таймера (если нужно)
function updateTimer() {
    // Здесь можно добавить логику для реального таймера
    // Например, отсчет до определенной даты
    const targetDate = new Date('2025-07-22'); // Пример даты
    const now = new Date();
    const diffTime = targetDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const countdownNumber = document.querySelector('.countdown-number');
    if (countdownNumber) {
        countdownNumber.textContent = Math.max(0, diffDays);
    }
}

// Обновлять таймер каждый день
setInterval(updateTimer, 24 * 60 * 60 * 1000);
updateTimer(); // Первоначальное обновление

// Функция для защиты от копирования
function preventCopying() {
    // Запрет контекстного меню
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Запрет выделения текста
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Запрет перетаскивания элементов
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Запрет клавиш копирования
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) {
            e.preventDefault();
            return false;
        }
        
        // Запрет F12
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
    });
    
    // Запрет инспектирования элементов
    document.addEventListener('keyup', function(e) {
        if (e.key === 'F12') {
            e.preventDefault();
            return false;
        }
    });
}

// Функция для настройки воспроизведения трека
function setupMusicTrack() {
    const musicTrackLink = document.querySelector('.music-track');
    const audioElement = document.getElementById('birthday-track');
    
    console.log('Настройка трека:', { musicTrackLink, audioElement });
    
    if (!musicTrackLink) {
        console.error('Кнопка музыки не найдена!');
        return;
    }
    
    if (!audioElement) {
        console.error('Аудио элемент не найден!');
        return;
    }
    
    if (musicTrackLink && audioElement) {
        musicTrackLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Проверяем, играет ли уже музыка
            if (audioElement.paused) {
                // Начинаем воспроизведение с начала
                audioElement.currentTime = 0;
                audioElement.play().then(() => {
                    // Изменяем текст ссылки
                    musicTrackLink.textContent = '⏸️ Остановить трек';
                    musicTrackLink.classList.add('playing');
                }).catch(error => {
                    console.log('Ошибка воспроизведения:', error);
                    alert('Не удалось воспроизвести трек. Попробуй еще раз!');
                });
            } else {
                // Останавливаем воспроизведение
                audioElement.pause();
                musicTrackLink.textContent = '🎂 Прослушать трек "С днём рождения, Алиса!"';
                musicTrackLink.classList.remove('playing');
            }
        });
        
        // Обработчик окончания трека
        audioElement.addEventListener('ended', function() {
            musicTrackLink.textContent = '🎂 Прослушать трек "С днём рождения, Алиса!"';
            musicTrackLink.classList.remove('playing');
        });
    }
}

// Глобальная функция для воспроизведения музыки
function playMusic(event) {
    event.preventDefault();
    
    const musicTrackLink = event.target;
    const audioElement = document.getElementById('birthday-track');
    
    console.log('Воспроизведение музыки:', { musicTrackLink, audioElement });
    
    if (!audioElement) {
        console.error('Аудио элемент не найден!');
        alert('Ошибка: аудио элемент не найден');
        return;
    }
    
    // Проверяем, играет ли уже музыка
    if (audioElement.paused) {
        // Начинаем воспроизведение с начала
        audioElement.currentTime = 0;
        audioElement.play().then(() => {
            // Изменяем текст ссылки
            musicTrackLink.textContent = '⏸️ Остановить трек';
            musicTrackLink.classList.add('playing');
            console.log('Музыка начала играть');
        }).catch(error => {
            console.log('Ошибка воспроизведения:', error);
            alert('Не удалось воспроизвести трек. Попробуй еще раз!');
        });
    } else {
        // Останавливаем воспроизведение
        audioElement.pause();
        musicTrackLink.textContent = '🎂 Прослушать трек "С днём рождения, Алиса!"';
        musicTrackLink.classList.remove('playing');
        console.log('Музыка остановлена');
    }
}
