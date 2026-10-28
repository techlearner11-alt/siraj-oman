'use strict';

const questions = [
  {
    question: 'ما عاصمة سلطنة عُمان؟',
    hint: 'تقع على ساحل بحر عُمان، وهي مركز الحكم والإدارة.',
    answers: ['صلالة', 'مسقط', 'نزوى', 'صحار'],
    correct: 1,
    explanation: 'مسقط هي عاصمة سلطنة عُمان.',
  },
  {
    question: 'في أي محافظة تقع مدينة صلالة؟',
    hint: 'تشتهر هذه المحافظة بموسم الخريف والطبيعة الخضراء.',
    answers: ['الداخلية', 'مسندم', 'ظفار', 'البريمي'],
    correct: 2,
    explanation: 'تقع صلالة في محافظة ظفار، التي تشتهر بموسم الخريف.',
  },
  {
    question: 'بماذا اشتهرت عُمان تاريخيًا في تجارة اللبان؟',
    hint: 'توجد مواقع أثرية مرتبطة بهذه التجارة في جنوب عُمان.',
    answers: ['اللبان العُماني', 'الحرير الصيني', 'القطن الهندي', 'الكاكاو'],
    correct: 0,
    explanation: 'كان اللبان العُماني سلعة مهمة في طرق التجارة القديمة.',
  },
  {
    question: 'ما اسم السلسلة الجبلية المعروفة في شمال عُمان؟',
    hint: 'تضم مناطق جبلية مرتفعة، منها جبل شمس.',
    answers: ['جبال الأطلس', 'جبال الحجر', 'جبال الألب', 'جبال طوروس'],
    correct: 1,
    explanation: 'جبال الحجر من أبرز السلاسل الجبلية في شمال عُمان.',
  },
  {
    question: 'أين تقع محافظة مسندم؟',
    hint: 'تقع في أقصى شمال عُمان وتطل على مضيق هرمز.',
    answers: ['جنوب عُمان', 'وسط عُمان', 'أقصى شمال عُمان', 'شرق ظفار'],
    correct: 2,
    explanation: 'تقع مسندم في أقصى شمال عُمان، وتتميز بموقعها البحري المهم.',
  },
];

const $ = (id) => document.getElementById(id);

const state = {
  character: 'explorer',
  index: 0,
  score: 0,
  answered: false,
  running: false,
};

const characterIcons = {
  explorer: '🧭',
  discoverer: '🔭',
  robot: '🤖',
};

const arabicNumber = (value) => Number(value).toLocaleString('ar-OM');

function updatePoints() {
  $('headerPoints').textContent = arabicNumber(state.score);
  $('gamePoints').textContent = arabicNumber(state.score);
}

function updateProgress() {
  const percent = (state.index / questions.length) * 100;

  $('progressBar').style.width = `${percent}%`;
  $('progressText').textContent = `${arabicNumber(Math.round(percent))}٪`;

  // يتحرك اللاعب من اليمين إلى اليسار مع تقدم السباق.
  $('racePlayer').style.right = `${percent}%`;
  $('racePlayer').style.transform = 'translateX(50%)';
  $('racePlayer').textContent = characterIcons[state.character];
}

function selectCharacter(character) {
  if (!characterIcons[character]) return;

  state.character = character;

  document.querySelectorAll('.character-card').forEach((card) => {
    const selected = card.dataset.character === character;

    card.classList.toggle('selected', selected);
    card.setAttribute('aria-pressed', String(selected));
  });

  $('racePlayer').textContent = characterIcons[character];
}

function renderQuestion() {
  const question = questions[state.index];

  state.answered = false;

  $('quizArea').hidden = false;
  $('resultArea').hidden = true;
  $('questionNumber').textContent = `السؤال ${arabicNumber(
    state.index + 1
  )} من ${arabicNumber(questions.length)}`;

  $('questionText').textContent = question.question;
  $('questionHint').textContent = question.hint;
  $('feedback').textContent = '';
  $('feedback').className = 'feedback';
  $('nextButton').hidden = true;

  const options = $('answerOptions');
  options.replaceChildren();

  question.answers.forEach((answer, index) => {
    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'answer-option';
    button.textContent = answer;
    button.addEventListener('click', () => chooseAnswer(index));

    options.appendChild(button);
  });

  updatePoints();
  updateProgress();
}

function chooseAnswer(selectedIndex) {
  if (!state.running || state.answered) return;

  state.answered = true;

  const question = questions[state.index];
  const buttons = [...$('answerOptions').querySelectorAll('button')];
  const feedback = $('feedback');

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === question.correct) {
      button.classList.add('correct');
    } else if (index === selectedIndex) {
      button.classList.add('incorrect');
    }
  });

  if (selectedIndex === question.correct) {
    state.score += 100;

    feedback.textContent = `إجابة صحيحة! +١٠٠ نقطة. ${question.explanation}`;
    feedback.className = 'feedback success';
  } else {
    feedback.textContent = `ليست الإجابة الصحيحة. ${question.explanation}`;
    feedback.className = 'feedback error';
  }

  updatePoints();

  $('nextButton').textContent =
    state.index === questions.length - 1 ? 'عرض النتيجة 🏆' : 'السؤال التالي ←';

  $('nextButton').hidden = false;
}

function nextQuestion() {
  if (!state.answered) return;

  if (state.index < questions.length - 1) {
    state.index += 1;
    renderQuestion();
  } else {
    finishGame();
  }
}

function finishGame() {
  state.running = false;

  $('quizArea').hidden = true;
  $('resultArea').hidden = false;
  $('progressBar').style.width = '100%';
  $('progressText').textContent = '١٠٠٪';
  $('racePlayer').style.right = '100%';

  const total = questions.length * 100;

  $('finalScore').textContent = arabicNumber(state.score);

  if (state.score === total) {
    $('resultTitle').textContent = 'إنجاز مذهل! 🌟';
    $('resultMessage').textContent =
      'أجبت عن جميع الأسئلة إجابة صحيحة. أنت بطل المعرفة!';
  } else if (state.score >= 300) {
    $('resultTitle').textContent = 'أحسنت يا مستكشف عُمان! 🏆';
    $('resultMessage').textContent =
      'لقد حققت نتيجة رائعة. واصل الاستكشاف وتعلم المزيد.';
  } else {
    $('resultTitle').textContent = 'انتهت الجولة! 🧭';
    $('resultMessage').textContent =
      'كل رحلة فرصة للتعلم. أعد السباق وحاول تحقيق نتيجة أفضل.';
  }

  try {
    const previousBest = Number(
      localStorage.getItem('sirajOmanBestScore') || 0
    );

    if (state.score > previousBest) {
      localStorage.setItem('sirajOmanBestScore', String(state.score));
    }
  } catch (error) {
    console.warn('تعذر حفظ أفضل نتيجة على هذا الجهاز.', error);
  }
}

function startGame() {
  state.index = 0;
  state.score = 0;
  state.answered = false;
  state.running = true;

  $('homeScreen').scrollIntoView({ behavior: 'smooth', block: 'start' });

  renderQuestion();
}

function replayGame() {
  startGame();
}

function showHelp() {
  const dialog = $('helpDialog');

  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    alert(
      'اختر شخصيتك، ثم ابدأ السباق. أجب عن الأسئلة واجمع النقاط حتى نهاية الجولة.'
    );
  }
}

document.querySelectorAll('.character-card').forEach((card) => {
  card.addEventListener('click', () => {
    selectCharacter(card.dataset.character);
  });
});

$('startButton').addEventListener('click', startGame);
$('exploreButton').addEventListener('click', () => {
  $('discoverySection').scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
});

$('nextButton').addEventListener('click', nextQuestion);
$('replayButton').addEventListener('click', replayGame);
$('helpButton').addEventListener('click', showHelp);

$('closeHelp').addEventListener('click', () => {
  $('helpDialog').close();
});

$('helpDialog').addEventListener('click', (event) => {
  if (event.target === $('helpDialog')) {
    $('helpDialog').close();
  }
});

selectCharacter('explorer');
updatePoints();
updateProgress();
