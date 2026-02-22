const savedUser = JSON.parse(localStorage.getItem('aiQuestUser') || 'null');

const lessonBank = [
  { title: 'MCP Servers 101', topic: 'MCP servers', duration: '6 min', xp: 30, audience: 'executive' },
  { title: 'Openclaw Workflow Design', topic: 'Openclaw', duration: '8 min', xp: 35, audience: 'entrepreneur' },
  { title: 'AI Agents for Research', topic: 'AI agents', duration: '7 min', xp: 30, audience: 'all' },
  { title: 'Governance Playbook', topic: 'AI governance', duration: '6 min', xp: 25, audience: 'executive' },
  { title: 'Launch MVP with AI Copilots', topic: 'MVP execution', duration: '7 min', xp: 30, audience: 'entrepreneur' },
  { title: 'Prompt Engineering Updates', topic: 'prompting', duration: '5 min', xp: 20, audience: 'all' },
  { title: 'Realtime Multimodal Stack', topic: 'multimodal systems', duration: '9 min', xp: 40, audience: 'all' },
  { title: 'LLMOps and Monitoring', topic: 'LLMOps', duration: '6 min', xp: 25, audience: 'executive' },
];

const state = {
  xp: 0,
  streak: Number(localStorage.getItem('aiQuestStreak') || 0),
  hearts: 5,
  gems: 20,
  chestReady: false,
  lessonsCompleted: 0,
  streakDate: localStorage.getItem('aiQuestLastDate') || null,
  questsClaimedToday: false,
  user: savedUser,
  lessons: [],
};

const skills = [
  { name: 'Prompt Crafting', level: 3 },
  { name: 'Automation Ops', level: 2 },
  { name: 'AI Research', level: 4 },
  { name: 'Multimodal Creation', level: 1 },
];

const sources = [
  { name: 'OpenAI', type: 'Models & APIs', url: 'https://platform.openai.com/' },
  { name: 'Anthropic', type: 'Claude docs', url: 'https://docs.anthropic.com/' },
  { name: 'Google AI Studio', type: 'Gemini tooling', url: 'https://aistudio.google.com/' },
  { name: 'Hugging Face', type: 'Models & datasets', url: 'https://huggingface.co/' },
  { name: 'MCP Official', type: 'Model Context Protocol', url: 'https://modelcontextprotocol.io/' },
  { name: 'OpenClaw GitHub', type: 'Openclaw ecosystem', url: 'https://github.com/' },
];

const questConfig = [
  { id: 'one-lesson', label: 'Finish 1 lesson', reward: 10, check: () => state.lessonsCompleted >= 1 },
  { id: 'two-lessons', label: 'Finish 2 lessons', reward: 15, check: () => state.lessonsCompleted >= 2 },
  { id: 'earn-60xp', label: 'Earn 60 XP', reward: 20, check: () => state.xp >= 60 },
];

const els = {
  xp: document.getElementById('xp-count'),
  streak: document.getElementById('streak-count'),
  hearts: document.getElementById('hearts-count'),
  gems: document.getElementById('gems-count'),
  lessons: document.getElementById('lessons'),
  quests: document.getElementById('quests'),
  claimQuest: document.getElementById('claim-quest'),
  chestProgress: document.getElementById('chest-progress'),
  openChest: document.getElementById('open-chest'),
  chestLog: document.getElementById('chest-log'),
  skills: document.getElementById('skills'),
  sources: document.getElementById('sources'),
  loginForm: document.getElementById('login-form'),
  logoutBtn: document.getElementById('logout-btn'),
  greeting: document.getElementById('user-greeting'),
  loginHint: document.getElementById('login-hint'),
  tutorMessage: document.getElementById('tutor-message'),
  refreshLessons: document.getElementById('refresh-lessons'),
  lessonDate: document.getElementById('lesson-date'),
  focusRole: document.getElementById('focus-role'),
  nextMilestone: document.getElementById('next-milestone'),
  motivationLine: document.getElementById('motivation-line'),
};

const todayKey = new Date().toISOString().slice(0, 10);
if (state.streakDate !== todayKey) state.questsClaimedToday = false;

function seededIndex(seed, modulo) {
  let sum = 0;
  for (const char of seed) sum += char.charCodeAt(0);
  return sum % modulo;
}

function generateDailyLessons() {
  const role = state.user?.role || 'all';
  const candidates = lessonBank.filter((l) => l.audience === 'all' || l.audience === role);
  const pool = candidates.length >= 4 ? candidates : lessonBank;
  const key = `${todayKey}-${state.user?.username || 'guest'}-${role}`;
  const startIndex = seededIndex(key, pool.length);

  state.lessons = Array.from({ length: 4 }, (_, i) => pool[(startIndex + i) % pool.length]);
  els.lessonDate.textContent = `Updated: ${new Date().toLocaleDateString()}`;
}

function requireLogin() {
  if (state.user) return false;
  els.chestLog.textContent = 'Please log in first to use your personal AI tutor and start lessons.';
  return true;
}

function setTutorMessage() {
  if (!state.user) {
    els.tutorMessage.textContent = 'Log in and your tutor will generate a personalized focus plan.';
    return;
  }

  const focus = state.lessons[0]?.topic || 'AI fundamentals';
  els.tutorMessage.textContent = `Hi ${state.user.username}, your ${state.user.role} plan starts with ${focus}. Finish 2 lessons today for a strong win.`;
}

function setPersonalizationPanel() {
  els.focusRole.textContent = state.user ? state.user.role : 'Guest';
  const next = Math.ceil((state.xp + 1) / 50) * 50;
  els.nextMilestone.textContent = `${next} XP`;

  if (!state.user) {
    els.motivationLine.textContent = 'Log in to unlock tailored lesson paths.';
  } else if (state.lessonsCompleted >= 3) {
    els.motivationLine.textContent = 'Amazing pace! One more lesson earns bonus momentum.';
  } else if (state.streak >= 5) {
    els.motivationLine.textContent = `You are on a ${state.streak}-day streak. Keep it alive today.`;
  } else {
    els.motivationLine.textContent = 'Quick 5-minute lesson now keeps your progress compounding.';
  }
}

function setAuthUI() {
  const loggedIn = Boolean(state.user);
  els.loginForm.hidden = loggedIn;
  els.logoutBtn.hidden = !loggedIn;
  els.claimQuest.disabled = !loggedIn;
  els.openChest.disabled = !loggedIn || !state.chestReady;

  if (loggedIn) {
    els.greeting.textContent = `Welcome back, ${state.user.username}!`; 
    els.loginHint.textContent = 'You are logged in. Complete lessons now to continue your streak.';
  } else {
    els.greeting.textContent = 'Log in to save your daily progress and unlock rewards.';
    els.loginHint.textContent = 'Log in to start lessons and grow your streak.';
  }
}

function updateUI() {
  els.xp.textContent = state.xp;
  els.streak.textContent = state.streak;
  els.hearts.textContent = state.hearts;
  els.gems.textContent = state.gems;

  const progress = state.xp % 50;
  els.chestProgress.style.width = `${state.chestReady ? 100 : (progress / 50) * 100}%`;

  setAuthUI();
  setTutorMessage();
  setPersonalizationPanel();
  renderQuests();
}

function completeLesson(lesson, button) {
  if (requireLogin() || button.dataset.done === 'yes') return;

  button.dataset.done = 'yes';
  button.textContent = 'Completed';
  button.disabled = true;

  state.xp += lesson.xp;
  state.lessonsCompleted += 1;

  if (!state.streakDate || state.streakDate !== todayKey) {
    state.streak += 1;
    state.streakDate = todayKey;
    localStorage.setItem('aiQuestStreak', String(state.streak));
    localStorage.setItem('aiQuestLastDate', todayKey);
  }

  if (Math.floor(state.xp / 50) > Math.floor((state.xp - lesson.xp) / 50)) {
    state.chestReady = true;
    els.chestLog.textContent = '🎁 Chest unlocked! Open it for surprise rewards.';
  }

  if (state.lessonsCompleted % 2 === 0 && state.hearts < 5) state.hearts += 1;
  updateUI();
}

function renderLessons() {
  els.lessons.innerHTML = '';
  const template = document.getElementById('lesson-template');

  state.lessons.forEach((lesson) => {
    const clone = template.content.cloneNode(true);
    const title = clone.querySelector('h3');
    const detail = clone.querySelector('p');
    const tag = clone.querySelector('.tag');
    const button = clone.querySelector('button');

    title.textContent = lesson.title;
    detail.textContent = `${lesson.duration} on ${lesson.topic} (${lesson.audience} track).`;
    tag.textContent = `+${lesson.xp} XP`;
    button.addEventListener('click', () => completeLesson(lesson, button));

    els.lessons.appendChild(clone);
  });
}

function renderSkills() {
  skills.forEach((skill) => {
    const card = document.createElement('article');
    card.className = 'skill-card';
    card.innerHTML = `<h3>${skill.name}</h3><p class="muted">Keep practicing to level up and unlock elite drills.</p><span class="skill-level">Level ${skill.level}</span>`;
    els.skills.appendChild(card);
  });
}

function renderSources() {
  sources.forEach((source) => {
    const link = document.createElement('a');
    link.className = 'source-item';
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.innerHTML = `<strong>${source.name}</strong><span>${source.type}</span>`;
    els.sources.appendChild(link);
  });
}

function renderQuests() {
  els.quests.innerHTML = '';
  questConfig.forEach((quest) => {
    const item = document.createElement('li');
    const done = quest.check();
    item.className = `quest-item${done ? ' done' : ''}`;
    item.innerHTML = `<span>${done ? '✅' : '⬜'} ${quest.label}</span><strong>+${quest.reward} gems</strong>`;
    els.quests.appendChild(item);
  });
}

function claimQuests() {
  if (requireLogin()) return;
  if (state.questsClaimedToday) return void (els.chestLog.textContent = 'You already claimed your quest rewards today.');

  const reward = questConfig.filter((q) => q.check()).reduce((sum, q) => sum + q.reward, 0);
  if (!reward) return void (els.chestLog.textContent = 'Complete at least one quest first to claim rewards.');

  state.gems += reward;
  state.questsClaimedToday = true;
  els.chestLog.textContent = `Claimed ${reward} gems from daily quests. Keep your streak alive!`;
  updateUI();
}

function openChest() {
  if (requireLogin() || !state.chestReady) return;
  const gemReward = Math.floor(Math.random() * 25) + 10;
  const bonusXp = Math.floor(Math.random() * 16) + 5;
  state.gems += gemReward;
  state.xp += bonusXp;
  state.chestReady = false;
  els.chestLog.textContent = `Chest opened: +${gemReward} gems and +${bonusXp} bonus XP!`;
  updateUI();
}

function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(els.loginForm);
  const username = String(formData.get('username') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const role = String(formData.get('role') || '').trim();

  if (!username || !email || !role) {
    els.chestLog.textContent = 'Please provide username, email, and role to log in.';
    return;
  }

  state.user = { username, email, role };
  localStorage.setItem('aiQuestUser', JSON.stringify(state.user));
  els.loginForm.reset();
  generateDailyLessons();
  renderLessons();
  els.chestLog.textContent = `Logged in as ${username}. Personalized lessons are ready.`;
  updateUI();
}

function handleLogout() {
  localStorage.removeItem('aiQuestUser');
  state.user = null;
  generateDailyLessons();
  renderLessons();
  els.chestLog.textContent = 'You have logged out. Log in again to continue learning.';
  updateUI();
}

function handleRefreshLessons() {
  if (requireLogin()) return;
  generateDailyLessons();
  renderLessons();
  els.chestLog.textContent = 'Tutor refreshed your daily lessons based on your role focus.';
  updateUI();
}

els.loginForm.addEventListener('submit', handleLogin);
els.logoutBtn.addEventListener('click', handleLogout);
els.claimQuest.addEventListener('click', claimQuests);
els.openChest.addEventListener('click', openChest);
els.refreshLessons.addEventListener('click', handleRefreshLessons);

generateDailyLessons();
renderLessons();
renderSkills();
renderSources();
updateUI();
