const rooms = [
  { id: 'ceo', name: 'CEO soba', purpose: 'Strategija i odluke' },
  { id: 'dev', name: 'Dev Room', purpose: 'Kod, testovi i deploy' },
  { id: 'research', name: 'Research', purpose: 'Istraživanje i analiza' },
  { id: 'marketing', name: 'Marketing', purpose: 'Content, SEO i kampanje' },
  { id: 'finance', name: 'Finance', purpose: 'Troškovi i KPI' },
  { id: 'ops', name: 'Operations', purpose: 'Automacije i alati' },
];

const defaultAgents = [
  { id: 'alpha', name: 'Alpha', role: 'CEO Agent', room: 'ceo', avatar: '🧠', cpu: 34, ram: 46, focus: 82, task: 'Razrađuje plan za AI Sims OS', memory: ['Vlasnik želi Sims-style UI', 'Prioritet: launch bez ZIP-a'], chat: [] },
  { id: 'coder', name: 'Coder', role: 'Developer Agent', room: 'dev', avatar: '👨‍💻', cpu: 58, ram: 64, focus: 71, task: 'Gradi frontend simulaciju', memory: ['Stack: HTML/CSS/JS sada, React kasnije', 'Treba dodati Ollama bridge'], chat: [] },
  { id: 'researcher', name: 'Researcher', role: 'Research Agent', room: 'research', avatar: '🔎', cpu: 24, ram: 38, focus: 88, task: 'Prikuplja ideje za agente i sobe', memory: ['Agenti trebaju delegirati posao', 'Vizual: Sims + RimWorld'], chat: [] },
  { id: 'writer', name: 'Writer', role: 'Marketing Agent', room: 'marketing', avatar: '✍️', cpu: 41, ram: 35, focus: 77, task: 'Piše opis projekta za GitHub', memory: ['Ton: startup/open-source', 'Objasniti lokalni AI'], chat: [] },
  { id: 'cfo', name: 'CFO', role: 'Finance Agent', room: 'finance', avatar: '💰', cpu: 19, ram: 28, focus: 65, task: 'Procjenjuje trošak lokalnog i cloud rada', memory: ['Lokalni modeli smanjuju API trošak'], chat: [] },
  { id: 'opsbot', name: 'OpsBot', role: 'Automation Agent', room: 'ops', avatar: '⚙️', cpu: 52, ram: 49, focus: 73, task: 'Planira integracije: GitHub, Gmail, Telegram', memory: ['Plugin sustav je faza 2'], chat: [] },
];

const defaultTasks = [
  'Napravi GitHub Pages demo',
  'Dodaj lokalni Ollama bridge',
  'Nacrtaj bolju izometrijsku kuću',
  'Dodaj task board i delegaciju',
  'Pretvori MVP u React aplikaciju'
];

let state = JSON.parse(localStorage.getItem('aiSimsState') || 'null') || {
  day: 1,
  minutes: 9 * 60,
  running: false,
  selectedAgentId: 'alpha',
  agents: defaultAgents,
  tasks: defaultTasks,
};

let timer = null;
const $ = (id) => document.getElementById(id);

function saveState() {
  localStorage.setItem('aiSimsState', JSON.stringify(state));
}

function clamp(n, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

function timeLabel() {
  const h = Math.floor(state.minutes / 60) % 24;
  const m = state.minutes % 60;
  return `Dan ${state.day} · ${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function roomAgents(roomId) {
  return state.agents.filter((a) => a.room === roomId);
}

function agentPosition(index) {
  const positions = [[28, 82], [128, 96], [72, 152], [176, 144], [220, 82], [30, 154]];
  return positions[index % positions.length];
}

function selectedAgent() {
  return state.agents.find((a) => a.id === state.selectedAgentId);
}

function render() {
  $('worldTime').textContent = timeLabel();
  $('taskCount').textContent = `${state.tasks.length} zadataka`;
  $('tickBtn').textContent = state.running ? '⏸ Pauziraj simulaciju' : '▶ Pokreni simulaciju';
  renderHouse();
  renderAgentList();
  renderInspector();
}

function renderHouse() {
  const house = $('house');
  house.innerHTML = '';

  rooms.forEach((room) => {
    const el = document.createElement('div');
    el.className = 'room';
    el.dataset.roomId = room.id;
    el.innerHTML = `
      <div class="roomHeader">
        <div>
          <div class="roomTitle">${room.name}</div>
          <div class="roomPurpose">${room.purpose}</div>
        </div>
        <div>${roomAgents(room.id).length} 🤖</div>
      </div>
    `;

    el.addEventListener('dragover', (e) => e.preventDefault());
    el.addEventListener('drop', (e) => {
      e.preventDefault();
      const agentId = e.dataTransfer.getData('text/plain');
      moveAgent(agentId, room.id);
    });

    roomAgents(room.id).forEach((agent, i) => {
      const [left, top] = agentPosition(i);
      const node = document.createElement('div');
      node.className = 'agent';
      node.draggable = true;
      node.style.left = `${left}px`;
      node.style.top = `${top}px`;
      node.innerHTML = `
        <div class="avatar">${agent.avatar}</div>
        <div class="agentNameSmall">${agent.name}</div>
        <div class="bubble">${bubbleText(agent)}</div>
      `;
      node.addEventListener('click', () => selectAgent(agent.id));
      node.addEventListener('dragstart', (e) => e.dataTransfer.setData('text/plain', agent.id));
      el.appendChild(node);
    });

    house.appendChild(el);
  });
}

function renderAgentList() {
  const list = $('agentList');
  list.innerHTML = '';
  state.agents.forEach((agent) => {
    const item = document.createElement('div');
    item.className = 'agentListItem';
    item.innerHTML = `
      <div class="avatar">${agent.avatar}</div>
      <div>
        <strong>${agent.name}</strong>
        <p>${agent.role}</p>
      </div>
    `;
    item.addEventListener('click', () => selectAgent(agent.id));
    list.appendChild(item);
  });
}

function renderInspector() {
  const agent = selectedAgent();
  $('emptyInspector').classList.toggle('hidden', Boolean(agent));
  $('agentInspector').classList.toggle('hidden', !agent);
  if (!agent) return;

  $('avatarBig').textContent = agent.avatar;
  $('agentName').textContent = agent.name;
  $('agentRole').textContent = `${agent.role} · ${rooms.find((r) => r.id === agent.room)?.name || agent.room}`;
  $('cpu').value = agent.cpu;
  $('ram').value = agent.ram;
  $('focus').value = agent.focus;
  $('currentTask').textContent = agent.task;
  $('memoryList').innerHTML = agent.memory.slice(0, 8).map((m) => `<li>${m}</li>`).join('');

  $('chatLog').innerHTML = agent.chat.length
    ? agent.chat.slice(-14).map((m) => `<div class="message"><strong>${m.from}:</strong> ${m.text}</div>`).join('')
    : '<p>Još nema poruka. Pošalji agentu prvu uputu.</p>';
  $('chatLog').scrollTop = $('chatLog').scrollHeight;
}

function selectAgent(agentId) {
  state.selectedAgentId = agentId;
  saveState();
  render();
}

function moveAgent(agentId, roomId) {
  const agent = state.agents.find((a) => a.id === agentId);
  const room = rooms.find((r) => r.id === roomId);
  if (!agent || !room) return;
  agent.room = roomId;
  agent.memory.unshift(`Premješten u ${room.name}`);
  agent.chat.push({ from: agent.name, text: `Preuzimam kontekst sobe: ${room.purpose}.` });
  state.selectedAgentId = agentId;
  saveState();
  render();
}

function bubbleText(agent) {
  if (agent.focus > 80) return 'Duboki fokus...';
  if (agent.cpu > 70) return 'Opterećen sam!';
  if (agent.chat.length) return agent.chat[agent.chat.length - 1].text.slice(0, 34) + '...';
  return agent.task.slice(0, 32) + '...';
}

function simulationStep() {
  state.minutes += 15;
  if (state.minutes >= 24 * 60) {
    state.minutes = 8 * 60;
    state.day += 1;
  }

  state.agents.forEach((agent) => {
    agent.cpu = clamp(agent.cpu + Math.round(Math.random() * 18 - 8));
    agent.ram = clamp(agent.ram + Math.round(Math.random() * 12 - 5));
    agent.focus = clamp(agent.focus + Math.round(Math.random() * 14 - 6));

    if (Math.random() > 0.66 && state.tasks.length) {
      const task = state.tasks[Math.floor(Math.random() * state.tasks.length)];
      agent.task = task;
      agent.chat.push({ from: agent.name, text: `Radim na: ${task}` });
    }

    if (Math.random() > 0.82) {
      const targetRoom = rooms[Math.floor(Math.random() * rooms.length)];
      agent.room = targetRoom.id;
      agent.memory.unshift(`Samostalno otišao u ${targetRoom.name}`);
    }

    agent.memory = agent.memory.slice(0, 8);
    agent.chat = agent.chat.slice(-12);
  });

  saveState();
  render();
}

function toggleSimulation() {
  state.running = !state.running;
  if (state.running) timer = setInterval(simulationStep, 1800);
  else clearInterval(timer);
  saveState();
  render();
}

function addTask() {
  const task = prompt('Upiši novi zadatak za AI tim:');
  if (!task) return;
  state.tasks.unshift(task);
  const agent = selectedAgent() || state.agents[0];
  agent.task = task;
  agent.chat.push({ from: agent.name, text: `Preuzimam novi zadatak: ${task}` });
  agent.memory.unshift(`Dobio novi zadatak: ${task}`);
  saveState();
  render();
}

function sendChat() {
  const input = $('chatText');
  const text = input.value.trim();
  const agent = selectedAgent();
  if (!text || !agent) return;

  agent.chat.push({ from: 'Ti', text });
  agent.memory.unshift(`Uputa korisnika: ${text}`);
  agent.task = text;
  agent.chat.push({ from: agent.name, text: localReply(agent, text) });
  input.value = '';
  saveState();
  render();
}

function localReply(agent, text) {
  const lower = text.toLowerCase();
  if (lower.includes('github')) return 'Mogu pripremiti commit plan i raspodijeliti posao developer agentu.';
  if (lower.includes('ollama') || lower.includes('lokal')) return 'Za lokalni AI trebamo mali backend bridge koji šalje prompt na Ollama API.';
  if (lower.includes('marketing')) return 'Prebacujem kontekst u marketing: landing page, demo video i open-source priča.';
  return `Primljeno. Pretvaram u zadatak i pamtim kao dio konteksta sobe ${rooms.find((r) => r.id === agent.room)?.name}.`;
}

$('tickBtn').addEventListener('click', toggleSimulation);
$('addTaskBtn').addEventListener('click', addTask);
$('saveBtn').addEventListener('click', () => { saveState(); alert('Svijet je spremljen u browser localStorage.'); });
$('resetBtn').addEventListener('click', () => { if (confirm('Resetirati AI Sims svijet?')) { localStorage.removeItem('aiSimsState'); location.reload(); } });
$('sendChat').addEventListener('click', sendChat);
$('chatText').addEventListener('keydown', (e) => { if (e.key === 'Enter') sendChat(); });

render();
