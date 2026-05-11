const rowsEl = document.querySelector("#betRows");
const totalStakeEl = document.querySelector("#totalStake");
const totalPayoutEl = document.querySelector("#totalPayout");
const totalProfitEl = document.querySelector("#totalProfit");
const roiEl = document.querySelector("#roi");
const statusEl = document.querySelector("#statusText");
const addBetEl = document.querySelector("#addBet");
const resetEl = document.querySelector("#reset");
const calculateEl = document.querySelector("#calculate");
const toggleEl = document.querySelector("#toggleButton");
const toggleIconEl = document.querySelector("#toggleIcon");
const panelEl = document.querySelector(".calc-panel");

let betRows = [];
let stakeAnchor = null;
let updating = false;

function money(value) {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function readFloat(value) {
  const cleaned = String(value).trim().replaceAll(",", "").replaceAll("$", "");
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
}

function setInput(input, value) {
  input.value = value;
}

function addBetRow() {
  const index = betRows.length;
  const row = document.createElement("div");
  row.className = "bet-row";

  const label = document.createElement("div");
  label.className = "bet-label";
  label.textContent = `Bet ${index + 1}`;

  const oddsInput = document.createElement("input");
  oddsInput.className = "odds-input";
  oddsInput.inputMode = "decimal";
  oddsInput.autocomplete = "off";
  oddsInput.placeholder = "Odds";
  oddsInput.setAttribute("aria-label", `Bet ${index + 1} odds`);

  const stakeInput = document.createElement("input");
  stakeInput.className = "stake-input";
  stakeInput.inputMode = "decimal";
  stakeInput.autocomplete = "off";
  stakeInput.placeholder = "Stake";
  stakeInput.setAttribute("aria-label", `Bet ${index + 1} stake`);

  const payout = document.createElement("div");
  payout.className = "payout";
  payout.textContent = "0.00";

  row.append(label, oddsInput, stakeInput, payout);
  rowsEl.append(row);

  const record = { row, oddsInput, stakeInput, payout };
  betRows.push(record);

  oddsInput.addEventListener("input", calculateArbitrage);
  stakeInput.addEventListener("focus", () => {
    stakeAnchor = index;
  });
  stakeInput.addEventListener("input", () => {
    stakeAnchor = index;
    calculateArbitrage();
  });

  calculateArbitrage();
}

function clearOutputs() {
  for (const row of betRows) {
    row.payout.textContent = "0.00";
  }
  totalPayoutEl.textContent = "0.00";
  totalProfitEl.textContent = "0.00";
  roiEl.textContent = "0.00%";
  statusEl.textContent = "Enter at least 2 odds and a stake.";
  statusEl.className = "status-text";
}

function calculateArbitrage() {
  if (updating) return;

  updating = true;
  try {
    const odds = betRows.map((row) => {
      const odd = readFloat(row.oddsInput.value);
      return odd !== null && odd > 1 ? odd : null;
    });

    const validOdds = odds.filter((odd) => odd !== null);
    if (validOdds.length < 2) {
      clearOutputs();
      return;
    }

    const invSum = validOdds.reduce((sum, odd) => sum + 1 / odd, 0);
    let totalStake = null;

    if (stakeAnchor === "total") {
      totalStake = readFloat(totalStakeEl.value);
    } else if (Number.isInteger(stakeAnchor)) {
      const anchorOdd = odds[stakeAnchor] ?? null;
      const anchorStake = readFloat(betRows[stakeAnchor].stakeInput.value);
      if (anchorOdd !== null && anchorStake !== null && anchorStake > 0) {
        totalStake = anchorStake * invSum * anchorOdd;
      }
    }

    if (totalStake === null || totalStake <= 0) {
      clearOutputs();
      return;
    }

    const equalPayout = totalStake / invSum;
    const totalProfit = equalPayout - totalStake;
    const roi = (totalProfit / totalStake) * 100;

    betRows.forEach((row, index) => {
      const odd = odds[index];
      if (odd === null) {
        row.payout.textContent = "0.00";
        return;
      }

      const stake = totalStake * ((1 / odd) / invSum);
      const payout = stake * odd;

      if (stakeAnchor !== index) {
        setInput(row.stakeInput, money(stake));
      }
      row.payout.textContent = money(payout);
    });

    if (stakeAnchor !== "total") {
      setInput(totalStakeEl, money(totalStake));
    }

    totalPayoutEl.textContent = money(equalPayout);
    totalProfitEl.textContent = money(totalProfit);
    roiEl.textContent = `${roi.toFixed(2)}%`;

    if (totalProfit > 0) {
      statusEl.textContent = `Arbitrage found. Margin: ${roi.toFixed(2)}%`;
      statusEl.className = "status-text good";
    } else {
      statusEl.textContent = `No arbitrage. Margin: ${roi.toFixed(2)}%`;
      statusEl.className = "status-text warn";
    }
  } finally {
    updating = false;
  }
}

function resetCalculator() {
  rowsEl.replaceChildren();
  betRows = [];
  stakeAnchor = null;
  totalStakeEl.value = "";
  addBetRow();
  addBetRow();
  clearOutputs();
}

totalStakeEl.addEventListener("focus", () => {
  stakeAnchor = "total";
});

totalStakeEl.addEventListener("input", () => {
  stakeAnchor = "total";
  calculateArbitrage();
});

addBetEl.addEventListener("click", addBetRow);
resetEl.addEventListener("click", resetCalculator);
calculateEl.addEventListener("click", calculateArbitrage);

toggleEl.addEventListener("click", () => {
  const collapsed = panelEl.classList.toggle("collapsed");
  toggleIconEl.textContent = collapsed ? "▼" : "▲";
  toggleEl.setAttribute("aria-expanded", String(!collapsed));
});

resetCalculator();
