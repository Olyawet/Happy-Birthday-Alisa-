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
            question: "Сколько часов длилась наша самая долгая прогулка? (Вспоминай наши круги)",
            options: ["4 часа", "15 часов", "9 часов", "1 час"],
            correct: 2
        },
        {
            id: 3,
            question: "На какое самое дальнее расстояние мы доходили? (Пешком от моего дома)",
            options: ["Перекрёсток", 'Ст. метро "Международная"', "Ст. метро Купчино", "До Оливки"],
            correct: 2
        },
        {
            id: 4,
            question: "В какое время года мы долго ждали автобус? (Когда я тебя провожала). В какой автобус я тебя провожала часто? Выбери 2 варианта ответа для ответа на 2 вопроса в одном вопросе.",
            options: ["Весна", "Зима", "Лето", "Осень", "96", "159", "157", "56"],
            correct: [1, 6]
        },
        {
            id: 5,
            question: "Сколько примерно шагов мы нашагали на нашей самой долгой прогулке?",
            options: ["3000", "150000", "25000", "50000"],
            correct: 3
        }
    ]
};

// Состояние приложения
let currentQuestion = 0;
let selectedAnswer = null; // для одиночного выбора
let selectedAnswers = [];  // для множественного выбора (4-й вопрос)
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
    
    // Установить громкость аудио на 15% сразу при загрузке
    const audioElement = document.getElementById('birthday-track');
    if (audioElement) {
        audioElement.volume = 0.15;
    }
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
    if (Array.isArray(question.correct)) {
        selectedAnswers = [];
        answerBtn.disabled = true;
        answerBtn.style.opacity = '0.5';
    } else {
        selectedAnswer = null;
        answerBtn.disabled = true;
        answerBtn.style.opacity = '0.5';
    }
}

// Выбор варианта ответа
function selectOption(optionElement) {
    const question = questData.questions[currentQuestion];
    const options = questionContainer.querySelectorAll('.option');
    if (Array.isArray(question.correct)) {
        // Множественный выбор (4-й вопрос)
        const idx = parseInt(optionElement.dataset.index);
        if (optionElement.classList.contains('selected')) {
            // Снять выделение
            optionElement.classList.remove('selected');
            selectedAnswers = selectedAnswers.filter(i => i !== idx);
        } else {
            if (selectedAnswers.length < question.correct.length) {
                optionElement.classList.add('selected');
                selectedAnswers.push(idx);
            }
        }
        // Кнопка активна только если выбрано ровно столько, сколько правильных
        if (selectedAnswers.length === question.correct.length) {
            answerBtn.disabled = false;
            answerBtn.style.opacity = '1';
        } else {
            answerBtn.disabled = true;
            answerBtn.style.opacity = '0.5';
        }
    } else {
        // Одиночный выбор
        options.forEach(opt => {
            opt.classList.remove('selected');
        });
        optionElement.classList.add('selected');
        selectedAnswer = parseInt(optionElement.dataset.index);
        answerBtn.disabled = false;
        answerBtn.style.opacity = '1';
    }
}

// Проверить ответ
function checkAnswer() {
    const question = questData.questions[currentQuestion];
    const options = questionContainer.querySelectorAll('.option');
    if (Array.isArray(question.correct)) {
        // Множественный выбор
        if (selectedAnswers.length !== question.correct.length) return;
        // Подсветить правильные
        question.correct.forEach(idx => {
            options[idx].classList.add('correct');
        });
        // Подсветить неправильные выбранные
        selectedAnswers.forEach(idx => {
            if (!question.correct.includes(idx)) {
                options[idx].classList.add('incorrect');
            }
        });
        // Проверка правильности (без учёта порядка)
        const isCorrect = selectedAnswers.length === question.correct.length &&
            selectedAnswers.every(idx => question.correct.includes(idx));
        answers.push({
            questionId: question.id,
            selected: [...selectedAnswers],
            correct: isCorrect
        });
    } else {
        // Одиночный выбор
        if (selectedAnswer === null) return;
        options[question.correct].classList.add('correct');
        if (selectedAnswer !== question.correct) {
            options[selectedAnswer].classList.add('incorrect');
        }
        answers.push({
            questionId: question.id,
            selected: selectedAnswer,
            correct: selectedAnswer === question.correct
        });
    }
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
    const targetDate = new Date('2025-07-27'); // Пример даты
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
    // Установить громкость на 15%
    if (audioElement) {
        audioElement.volume = 0.15;
    }
    // Добавить контрол громкости
    setupVolumeControl();
    
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

        // Установить громкость на 20%
        // audioElement.volume = 0.2; // This line is now handled by setupVolumeControl
    }
}

// Глобальная функция для воспроизведения музыки
function playMusic(event) {
    event.preventDefault();
    
    const musicTrackLink = event.target;
    const audioElement = document.getElementById('birthday-track');
    // Установить громкость на 15%
    if (audioElement) {
        audioElement.volume = 0.15;
    }
    
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

    // Установить громкость на 20%
    // if (audioElement) { // This line is now handled by setupVolumeControl
    //     audioElement.volume = 0.2;
    // }
}

// Добавить контрол громкости для аудио
function setupVolumeControl() {
    const audioElement = document.getElementById('birthday-track');
    let volumeControl = document.getElementById('volume-control');
    if (!audioElement) return;
    // Если уже есть контрол — не добавлять второй
    if (volumeControl) return;
    // Найти секцию с музыкой
    const musicSection = document.querySelector('.entertainment-section');
    if (!musicSection) return;
    // Создать контейнер для ползунка
    const volumeContainer = document.createElement('div');
    volumeContainer.style.marginTop = '20px';
    volumeContainer.style.display = 'flex';
    volumeContainer.style.alignItems = 'center';
    volumeContainer.style.justifyContent = 'center';
    // Подпись
    const label = document.createElement('label');
    label.textContent = 'Громкость:';
    label.style.marginRight = '10px';
    // Ползунок
    volumeControl = document.createElement('input');
    volumeControl.type = 'range';
    volumeControl.id = 'volume-control';
    volumeControl.min = 0;
    volumeControl.max = 100;
    volumeControl.value = Math.round(audioElement.volume * 100);
    volumeControl.style.width = '120px';
    // Значение
    const valueSpan = document.createElement('span');
    valueSpan.textContent = volumeControl.value + '%';
    valueSpan.style.marginLeft = '10px';
    // Слушатель
    volumeControl.addEventListener('input', function() {
        audioElement.volume = volumeControl.value / 100;
        valueSpan.textContent = volumeControl.value + '%';
    });
    // Добавить элементы
    volumeContainer.appendChild(label);
    volumeContainer.appendChild(volumeControl);
    volumeContainer.appendChild(valueSpan);
    musicSection.appendChild(volumeContainer);
}
