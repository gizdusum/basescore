const BASE_CHAIN_ID_HEX = '0x2105';
const BASE_CHAIN_ID_DEC = 8453;

const personaBands = [
  { min: 88, name: 'Signal Captain', bias: 'Looks top-tier native' },
  { min: 76, name: 'Clean Optimizer', bias: 'Looks organic' },
  { min: 64, name: 'Underrated Local', bias: 'Quietly strong' },
  { min: 52, name: 'Mercenary In Recovery', bias: 'Too transactional' },
  { min: 0, name: 'Quest Spray User', bias: 'Looks noisy' }
];

const defaultSignals = [
  {
    title: 'Longevity',
    value: '78 / 100',
    flag: 'Healthy',
    description: 'Users who show up across time usually look stronger than wallets that appear only during hype weeks.'
  },
  {
    title: 'Diversity',
    value: '71 / 100',
    flag: 'Solid',
    description: 'A better blend of bridge, identity, apps, and transfers beats repetitive swap spam.'
  },
  {
    title: 'Base-native use',
    value: '82 / 100',
    flag: 'Promising',
    description: 'Signals tied to Basenames, Base-first apps, and social discovery can matter more than raw volume.'
  },
  {
    title: 'Sybil risk',
    value: '24 / 100',
    flag: 'Low-ish',
    description: 'The lower this is, the less your wallet behavior feels machine-made or mercenary.'
  }
];

const defaultMissions = [
  {
    tag: 'Identity move',
    title: 'Anchor one recognizable Base identity',
    description: 'A wallet that looks persistent usually scores better than one that only farms and disappears.',
    cta: 'Prioritize identity'
  },
  {
    tag: 'Behavior move',
    title: 'Spread meaningful usage over multiple days',
    description: 'Do fewer things, but do them in a believable rhythm. Time depth beats single-day frenzy.',
    cta: 'Improve rhythm'
  },
  {
    tag: 'Social move',
    title: 'Share your score with your squad',
    description: 'Competition is a feature. People save apps they can flex inside, not just read once.',
    cta: 'Share to X'
  }
];

const defaultLeaders = [
  { rank: '#01', name: 'Base Goblin', score: 93, copy: 'Bridge, buy, name, and actually come back.' },
  { rank: '#02', name: 'Mini App Maxxer', score: 89, copy: 'Lives inside Base App instead of pretending to.' },
  { rank: '#03', name: 'Organic Ape', score: 84, copy: 'Less noise. More receipts.' }
];

const state = {
  address: null,
  isBase: false,
  score: 74,
  persona: personaBands[1],
  signals: defaultSignals,
  missions: defaultMissions,
  leaders: defaultLeaders
};

const els = {
  connectButton: document.getElementById('connectButton'),
  heroConnectButton: document.getElementById('heroConnectButton'),
  shareButton: document.getElementById('shareButton'),
  scoreValue: document.getElementById('scoreValue'),
  personaValue: document.getElementById('personaValue'),
  biasValue: document.getElementById('biasValue'),
  walletChip: document.getElementById('walletChip'),
  connectionState: document.getElementById('connectionState'),
  signalGrid: document.getElementById('signalGrid'),
  missionDeck: document.getElementById('missionDeck'),
  leaderboard: document.getElementById('leaderboard')
};

function seededNumber(seed, min, max) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const ratio = Math.abs(hash % 1000) / 1000;
  return Math.round(min + ratio * (max - min));
}

function findPersona(score) {
  return personaBands.find((band) => score >= band.min) || personaBands[personaBands.length - 1];
}

function shortenAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

function buildSignals(address) {
  const longevity = seededNumber(`${address}:longevity`, 58, 94);
  const diversity = seededNumber(`${address}:diversity`, 49, 92);
  const nativeUse = seededNumber(`${address}:native`, 54, 95);
  const sybil = seededNumber(`${address}:sybil`, 8, 44);

  return [
    {
      title: 'Longevity',
      value: `${longevity} / 100`,
      flag: longevity > 80 ? 'High trust' : 'Building',
      description: 'Addresses that stay active over time usually feel more reward-worthy than fast in-and-out wallets.'
    },
    {
      title: 'Diversity',
      value: `${diversity} / 100`,
      flag: diversity > 75 ? 'Well-rounded' : 'Narrow',
      description: 'Breadth matters: bridge, hold, pay, and use apps instead of replaying the same loop.'
    },
    {
      title: 'Base-native use',
      value: `${nativeUse} / 100`,
      flag: nativeUse > 78 ? 'Aligned' : 'Needs depth',
      description: 'Base-specific behavior can signal stronger intent than generic EVM activity.'
    },
    {
      title: 'Sybil risk',
      value: `${sybil} / 100`,
      flag: sybil < 20 ? 'Clean' : 'Watchlist',
      description: 'Lower is better. Repetitive patterns, bursty usage, and weird symmetry can feel artificial.'
    }
  ];
}

function buildMissions(address) {
  const seed = seededNumber(`${address}:mission`, 1, 3);
  const templates = [
    {
      tag: 'Identity move',
      title: 'Make your Base presence legible',
      description: 'The best wallets feel lived-in. Identity and continuity help you look like a user, not a mercenary.',
      cta: 'Strengthen identity'
    },
    {
      tag: 'App move',
      title: 'Open one Base-native app twice this week',
      description: 'Frequency across days looks better than a single mega-session of random clicks.',
      cta: 'Act more naturally'
    },
    {
      tag: 'Social move',
      title: 'Share a score card with your squad',
      description: 'Social proof makes the app sticky. Public scores create recurring status loops.',
      cta: 'Post your score'
    }
  ];

  return [...templates.slice(seed - 1), ...templates.slice(0, seed - 1)].slice(0, 3);
}

function buildLeaders(score) {
  return [
    { rank: '#01', name: 'You', score, copy: 'Your current prototype score inside BaseScore.' },
    { rank: '#02', name: 'Quest Surgeon', score: Math.max(score - 4, 62), copy: 'Knows when not to transact.' },
    { rank: '#03', name: 'Receipt Enjoyer', score: Math.max(score - 9, 55), copy: 'Quiet habits, clean wallet energy.' }
  ];
}

function renderSignals() {
  els.signalGrid.innerHTML = state.signals.map((signal) => `
    <article class="signal-card">
      <div class="signal-meta">
        <span class="metric-label">${signal.title}</span>
        <span class="score-flag">${signal.flag}</span>
      </div>
      <strong>${signal.value}</strong>
      <p>${signal.description}</p>
    </article>
  `).join('');
}

function renderMissions() {
  els.missionDeck.innerHTML = state.missions.map((mission, index) => `
    <article class="mission-card">
      <span class="mission-tag">${mission.tag}</span>
      <strong>${mission.title}</strong>
      <p>${mission.description}</p>
      <button type="button" data-mission-index="${index}">${mission.cta}</button>
    </article>
  `).join('');
}

function renderLeaders() {
  els.leaderboard.innerHTML = state.leaders.map((leader) => `
    <article class="leaderboard-entry">
      <div>
        <strong>${leader.name}</strong>
        <p>${leader.copy}</p>
      </div>
      <div>
        <span class="rank-pill">${leader.rank}</span>
        <strong>${leader.score}</strong>
      </div>
    </article>
  `).join('');
}

function renderState() {
  els.scoreValue.textContent = state.score;
  els.personaValue.textContent = state.persona.name;
  els.biasValue.textContent = state.persona.bias;
  els.connectionState.textContent = state.address ? (state.isBase ? 'Base connected' : 'Wrong network') : 'Not connected';
  els.walletChip.textContent = state.address
    ? `${shortenAddress(state.address)} ${state.isBase ? 'is being scored on Base.' : 'connected, but not on Base mainnet yet.'}`
    : 'Connect a wallet to personalize your score.';
  els.connectButton.textContent = state.address ? shortenAddress(state.address) : 'Connect Base wallet';
  els.heroConnectButton.textContent = state.address ? 'Refresh my score' : 'Open my score';

  renderSignals();
  renderMissions();
  renderLeaders();
}

function resetState() {
  state.address = null;
  state.isBase = false;
  state.score = 74;
  state.persona = personaBands[1];
  state.signals = defaultSignals;
  state.missions = defaultMissions;
  state.leaders = defaultLeaders;
  renderState();
}

function applyWalletProfile(address, chainIdHex) {
  state.address = address;
  state.isBase = Number.parseInt(chainIdHex, 16) === BASE_CHAIN_ID_DEC;
  state.score = seededNumber(`${address}:score`, 56, 96);
  state.persona = findPersona(state.score);
  state.signals = buildSignals(address);
  state.missions = buildMissions(address);
  state.leaders = buildLeaders(state.score);
  renderState();
}

async function switchToBase() {
  if (!window.ethereum) return false;

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_CHAIN_ID_HEX }]
    });
    return true;
  } catch (error) {
    if (error && error.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: BASE_CHAIN_ID_HEX,
            chainName: 'Base',
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
            rpcUrls: ['https://mainnet.base.org'],
            blockExplorerUrls: ['https://basescan.org']
          }]
        });
        return true;
      } catch (addError) {
        console.error(addError);
        return false;
      }
    }

    console.error(error);
    return false;
  }
}

async function connectWallet() {
  if (!window.ethereum) {
    window.open('https://wallet.coinbase.com/', '_blank', 'noreferrer');
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    let chainIdToUse = currentChainId;

    if (Number.parseInt(currentChainId, 16) !== BASE_CHAIN_ID_DEC) {
      const switched = await switchToBase();
      if (switched) {
        chainIdToUse = await window.ethereum.request({ method: 'eth_chainId' });
      }
    }

    if (accounts && accounts[0]) {
      applyWalletProfile(accounts[0], chainIdToUse);
    }
  } catch (error) {
    console.error(error);
  }
}

function sharePreview() {
  const text = state.address
    ? `I just checked my BaseScore: ${state.score}. Still trying to look less like a mercenary and more like a real Base local.`
    : 'BaseScore is a mini app concept for Base users who want to measure real onchain reputation, not just farm harder.';
  const url = `${window.location.origin}${window.location.pathname}`;
  window.open(`https://x.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}&via=gizdusumandnode`, '_blank', 'noreferrer');
}

function bindEvents() {
  els.connectButton.addEventListener('click', connectWallet);
  els.heroConnectButton.addEventListener('click', connectWallet);
  els.shareButton.addEventListener('click', sharePreview);

  document.addEventListener('click', (event) => {
    const missionButton = event.target.closest('[data-mission-index]');
    if (!missionButton) return;

    if (Number(missionButton.dataset.missionIndex) === 2) {
      sharePreview();
      return;
    }

    missionButton.textContent = 'Marked';
    missionButton.disabled = true;
  });

  if (window.ethereum && window.ethereum.on) {
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts && accounts[0]) {
        window.ethereum.request({ method: 'eth_chainId' }).then((chainId) => applyWalletProfile(accounts[0], chainId));
      } else {
        resetState();
      }
    });

    window.ethereum.on('chainChanged', (chainId) => {
      if (state.address) {
        applyWalletProfile(state.address, chainId);
      }
    });
  }
}

async function bootstrapWallet() {
  if (!window.ethereum) {
    renderState();
    bindEvents();
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts && accounts[0]) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      applyWalletProfile(accounts[0], chainId);
    } else {
      renderState();
    }
  } catch (error) {
    console.error(error);
    renderState();
  }

  bindEvents();
}

bootstrapWallet();
