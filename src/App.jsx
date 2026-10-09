import { useEffect, useState } from "react";

import "./App.css";
import "./MoneyMitraFeatures.css";



const defaultData = {

  budget: 2000,

  goalName: "Emergency savings",

  goalAmount: 5000,

  savedAmount: 1200,

  completedMissions: [],
  expenses: [],

};



const missions = [

  {

    id: 1,

    title: "Track your spending",

    description: "Write down every expense you make today.",

    reward: "Build awareness",

    icon: "📝",

  },

  {

    id: 2,

    title: "Try a no-spend day",

    description: "Avoid non-essential purchases for one day.",

    reward: "Practice self-control",

    icon: "🌱",

  },

  {

    id: 3,

    title: "Save before spending",

    description: "Decide how much to save before planning purchases.",

    reward: "Build a habit",

    icon: "🎯",

  },

];



function readSavedData() {

  try {

    const saved = localStorage.getItem("moneymitra-data");

    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;

  } catch {

    return defaultData;

  }

}



function formatMoney(amount) {

  return new Intl.NumberFormat("en-IN", {

    style: "currency",

    currency: "INR",

    maximumFractionDigits: 0,

  }).format(Number(amount) || 0);

}



function App() {

  const [data, setData] = useState(readSavedData);

  const [budgetInput, setBudgetInput] = useState(String(data.budget));

  const [goalInput, setGoalInput] = useState(data.goalName);

  const [goalAmountInput, setGoalAmountInput] = useState(

    String(data.goalAmount)

  );

  const [savedInput, setSavedInput] = useState(String(data.savedAmount));

  const [expense, setExpense] = useState("150");

  const [message, setMessage] = useState("");

  const [simulatedExpense, setSimulatedExpense] = useState(0);
  const [expenseAmountInput, setExpenseAmountInput] = useState("100");
  const [expenseCategoryInput, setExpenseCategoryInput] = useState("Food");
  const [expenseNoteInput, setExpenseNoteInput] = useState("");
  const [expenseDateInput, setExpenseDateInput] = useState(new Date().toISOString().slice(0, 10));
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7));



  useEffect(() => {

    localStorage.setItem("moneymitra-data", JSON.stringify(data));

  }, [data]);



  const budget = Math.max(0, Number(data.budget) || 0);

  const needs = Math.round(budget * 0.5);

  const wants = Math.round(budget * 0.3);

  const savings = budget - needs - wants;

  const goalAmount = Math.max(1, Number(data.goalAmount) || 1);

  const savedAmount = Math.max(0, Number(data.savedAmount) || 0);

  const progress = Math.min(100, (savedAmount / goalAmount) * 100);

  const completedCount = data.completedMissions.length;
  const expenseRecords = Array.isArray(data.expenses) ? data.expenses : [];
  const monthExpenses = expenseRecords.filter((item) => item.date && item.date.slice(0, 7) === reportMonth);
  const monthSpend = monthExpenses.reduce((total, item) => total + (Number(item.amount) || 0), 0);
  const monthRemaining = budget - monthSpend;
  const categoryTotals = monthExpenses.reduce((totals, item) => {
    const category = item.category || "Other";
    totals[category] = (totals[category] || 0) + (Number(item.amount) || 0);
    return totals;
  }, {});
  const achievementList = [
    { title: "First Steps", description: "Complete your first money mission.", icon: "🌱", unlocked: completedCount >= 1 },
    { title: "Budget Builder", description: "Create a monthly budget and give your money a plan.", icon: "🧮", unlocked: budget > 0 },
    { title: "Goal Setter", description: "Name a savings goal and set a target.", icon: "🎯", unlocked: Boolean(data.goalName && Number(data.goalAmount) > 0) },
    { title: "Expense Tracker", description: "Record your first real or demo expense.", icon: "🧾", unlocked: expenseRecords.length >= 1 },
    { title: "Mission Master", description: "Complete all three money missions.", icon: "🏆", unlocked: completedCount === missions.length },
    { title: "Savings Starter", description: "Record progress toward a savings goal.", icon: "🐷", unlocked: savedAmount > 0 },
  ];
  const unlockedAchievements = achievementList.filter((item) => item.unlocked).length;



  function updateBudget(event) {

    event.preventDefault();

    const value = Number(budgetInput);



    if (!Number.isFinite(value) || value < 0 || value > 10000000) {

      setMessage("Enter a valid budget between ₹0 and ₹1 crore.");

      return;

    }



    setData((current) => ({ ...current, budget: value }));

    setMessage("Your budget has been updated.");

  }



  function updateGoal(event) {

    event.preventDefault();

    const amount = Number(goalAmountInput);

    const saved = Number(savedInput);



    if (

      !goalInput.trim() ||

      !Number.isFinite(amount) ||

      amount <= 0 ||

      !Number.isFinite(saved) ||

      saved < 0

    ) {

      setMessage("Enter a goal name, a positive target, and valid savings.");

      return;

    }



    setData((current) => ({

      ...current,

      goalName: goalInput.trim(),

      goalAmount: amount,

      savedAmount: saved,

    }));

    setMessage("Your savings goal has been saved.");

  }



  function toggleMission(id) {

    setData((current) => {

      const alreadyCompleted = current.completedMissions.includes(id);

      const completedMissions = alreadyCompleted

        ? current.completedMissions.filter((missionId) => missionId !== id)

        : [...current.completedMissions, id];



      return { ...current, completedMissions };

    });

  }



  function runSimulation(event) {

    event.preventDefault();

    const cost = Number(expense);



    if (!Number.isFinite(cost) || cost <= 0) {

      setMessage("Enter a purchase amount greater than ₹0.");

      return;

    }



    if (cost > 10000000) {

      setMessage("Enter a smaller purchase amount for this simulation.");

      return;

    }



    setSimulatedExpense(cost);

    setMessage(

      cost <= savings

        ? "This purchase fits within the suggested savings-free spending plan. Think about your priorities before deciding."

        : "This purchase is larger than your suggested savings allocation. Check whether it could delay your goal."

    );

  }



  function addExpense(event) {
    event.preventDefault();
    const amount = Number(expenseAmountInput);
    if (!Number.isFinite(amount) || amount <= 0 || amount > 10000000) {
      setMessage("Enter an expense amount greater than ₹0 and no more than ₹1 crore.");
      return;
    }
    if (!expenseDateInput) {
      setMessage("Choose the date of this expense.");
      return;
    }
    const newExpense = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      amount,
      category: expenseCategoryInput,
      note: expenseNoteInput.trim() || expenseCategoryInput,
      date: expenseDateInput,
    };
    setData((current) => ({ ...current, expenses: [...(Array.isArray(current.expenses) ? current.expenses : []), newExpense] }));
    setExpenseNoteInput("");
    setMessage("Expense added to your month-end review.");
  }

  function deleteExpense(id) {
    setData((current) => ({ ...current, expenses: (Array.isArray(current.expenses) ? current.expenses : []).filter((item) => item.id !== id) }));
    setMessage("Expense removed.");
  }

  function resetDemo() {

    setData(defaultData);

    setBudgetInput(String(defaultData.budget));

    setGoalInput(defaultData.goalName);

    setGoalAmountInput(String(defaultData.goalAmount));

    setSavedInput(String(defaultData.savedAmount));

    setExpense("150");

    setSimulatedExpense(0);
    setExpenseAmountInput("100");
    setExpenseCategoryInput("Food");
    setExpenseNoteInput("");
    setExpenseDateInput(new Date().toISOString().slice(0, 10));
    setReportMonth(new Date().toISOString().slice(0, 7));

    setMessage("Demo data has been reset.");

  }



  return (

    <div className="app-shell">

      <aside className="sidebar">

        <a className="brand" href="#home" aria-label="MoneyMitra home">

          <span className="brand-icon">₹</span>

          <span>

            <strong>MoneyMitra</strong>

            <small>Student money coach</small>

          </span>

        </a>



        <div className="nav-label">YOUR SPACE</div>

        <nav className="navigation">

          <a className="nav-link active" href="#home">

            <span>▦</span> Overview

          </a>

          <a className="nav-link" href="#planner">

            <span>◷</span> Budget planner

          </a>

          <a className="nav-link" href="#goals">

            <span>◎</span> Savings goals

          </a>

          <a className="nav-link" href="#missions">

            <span>✳</span> Money missions

          </a>

          <a className="nav-link" href="#simulator">

            <span>↗</span> Spending simulator

          </a>

          <a className="nav-link" href="#month-end"><span>▣</span> Month-end check</a>
          <a className="nav-link" href="#achievements"><span>🏆</span> Achievements</a>
        </nav>



        <div className="sidebar-bottom">

          <div className="mini-sparkle">✦</div>

          <h3>Small habits.<br />Stronger future.</h3>

          <p>Learn money skills one decision at a time.</p>

          <div className="sidebar-tag">LEARN · PRACTICE · GROW</div>

        </div>

      </aside>



      <main className="main-content" id="home">

        <header className="topbar">

          <div>

            <div className="eyebrow">YOUR PERSONAL FINANCE SPACE</div>

            <h1>Hey, future money pro! <span>✦</span></h1>

            <p className="subtitle">

              Your money journey starts with one small decision.

            </p>

          </div>

          <div className="demo-pill">

            <span className="live-dot" />

            Student demo

          </div>

        </header>



        {message && (

          <div className="notice" role="status">

            <span>{message}</span>

            <button onClick={() => setMessage("")} aria-label="Dismiss message">

              ×

            </button>

          </div>

        )}



        <section className="hero-card">

          <div className="hero-copy">

            <div className="hero-label">YOUR MONEY, YOUR RULES</div>

            <h2>Make your money<br />work for <em>your future.</em></h2>

            <p>

              Plan your pocket money, build better habits, and make confident

              spending decisions — without risking real money.

            </p>

            <a className="primary-button" href="#planner">

              Plan my budget <span>↗</span>

            </a>

          </div>

          <div className="hero-art" aria-hidden="true">

            <div className="art-orbit orbit-one" />

            <div className="art-orbit orbit-two" />

            <div className="coin coin-back">₹</div>

            <div className="plant-pot">🌱</div>

            <div className="coin coin-front">₹</div>

            <div className="art-note">SAVE A LITTLE<br />DREAM A LOT</div>

            <div className="art-star star-one">✦</div>

            <div className="art-star star-two">✳</div>

          </div>

        </section>



        <section className="stats-grid" aria-label="Your money summary">

          <article className="stat-card">

            <div className="stat-top">

              <span className="stat-icon mint">₹</span>

              <span className="stat-label">Monthly budget</span>

            </div>

            <div className="stat-value">{formatMoney(budget)}</div>

            <div className="stat-foot">Your planned pocket money</div>

          </article>

          <article className="stat-card">

            <div className="stat-top">

              <span className="stat-icon peach">♧</span>

              <span className="stat-label">Savings target</span>

            </div>

            <div className="stat-value">{formatMoney(goalAmount)}</div>

            <div className="stat-foot">A goal worth working toward</div>

          </article>

          <article className="stat-card">

            <div className="stat-top">

              <span className="stat-icon lilac">◎</span>

              <span className="stat-label">Saved so far</span>

            </div>

            <div className="stat-value">{formatMoney(savedAmount)}</div>

            <div className="stat-foot">{Math.round(progress)}% of your goal</div>

          </article>

          <article className="stat-card">

            <div className="stat-top">

              <span className="stat-icon yellow">✳</span>

              <span className="stat-label">Missions done</span>

            </div>

            <div className="stat-value">{completedCount}<span className="stat-total"> / {missions.length}</span></div>

            <div className="stat-foot">Little actions, better habits</div>

          </article>

        </section>



        <div className="section-heading" id="planner">

          <div>

            <div className="eyebrow">PLAN WITH PURPOSE</div>

            <h2>Your pocket money planner</h2>

            <p>Give every rupee a job before it disappears.</p>

          </div>

          <span className="section-emoji">🧮</span>

        </div>



        <section className="content-grid">

          <article className="panel budget-panel">

            <div className="panel-heading">

              <div>

                <h3>Build your budget</h3>

                <p>Start with the amount you receive.</p>

              </div>

              <span className="panel-icon">₹</span>

            </div>



            <form onSubmit={updateBudget}>

              <label htmlFor="budget">Your monthly budget (₹)</label>

              <div className="money-input">

                <span>₹</span>

                <input

                  id="budget"

                  type="number"

                  min="0"

                  max="10000000"

                  value={budgetInput}

                  onChange={(event) => setBudgetInput(event.target.value)}

                  required

                />

              </div>

              <div className="quick-amounts">

                {[1000, 2000, 3000, 5000].map((amount) => (

                  <button

                    className={Number(budgetInput) === amount ? "quick active" : "quick"}

                    key={amount}

                    type="button"

                    onClick={() => setBudgetInput(String(amount))}

                  >

                    ₹{amount.toLocaleString("en-IN")}

                  </button>

                ))}

              </div>

              <button className="primary-button full-button" type="submit">

                Update my budget <span>→</span>

              </button>

            </form>



            <div className="tip-box">

              <span>💡</span>

              <p><strong>Money tip</strong> — plan first, spend second. Your budget is a guide, not a rule that fits everyone.</p>

            </div>

          </article>



          <article className="panel allocation-panel">

            <div className="panel-heading">

              <div>

                <h3>Your suggested split</h3>

                <p>A starting point you can adapt to your needs.</p>

              </div>

              <span className="soft-badge">50 / 30 / 20</span>

            </div>



            <div className="allocation-total">

              <span>Planned monthly money</span>

              <strong>{formatMoney(budget)}</strong>

            </div>



            <div className="allocation-row">

              <div className="allocation-label">

                <span className="allocation-dot needs-dot" />

                <span>Needs <small>Travel, food, college essentials</small></span>

                <strong>{formatMoney(needs)}</strong>

              </div>

              <div className="progress-track"><div className="progress-fill needs-fill" style={{ width: budget ? `${(needs / budget) * 100}%` : "0%" }} /></div>

            </div>



            <div className="allocation-row">

              <div className="allocation-label">

                <span className="allocation-dot wants-dot" />

                <span>Wants <small>Outings, entertainment, extras</small></span>

                <strong>{formatMoney(wants)}</strong>

              </div>

              <div className="progress-track"><div className="progress-fill wants-fill" style={{ width: budget ? `${(wants / budget) * 100}%` : "0%" }} /></div>

            </div>



            <div className="allocation-row">

              <div className="allocation-label">

                <span className="allocation-dot savings-dot" />

                <span>Savings <small>Future plans and emergencies</small></span>

                <strong>{formatMoney(savings)}</strong>

              </div>

              <div className="progress-track"><div className="progress-fill savings-fill" style={{ width: budget ? `${(savings / budget) * 100}%` : "0%" }} /></div>

            </div>



            <div className="allocation-note">

              <span>✦</span>

              This is a learning example. Adjust the percentages to match your real expenses and priorities.

            </div>

          </article>

        </section>



        <div className="section-heading" id="goals">

          <div>

            <div className="eyebrow">THINK BEYOND TODAY</div>

            <h2>A goal gives saving a reason</h2>

            <p>Choose something meaningful and take it one step at a time.</p>

          </div>

          <span className="section-emoji">🌟</span>

        </div>



        <section className="content-grid goal-grid">

          <article className="panel goal-panel">

            <div className="goal-intro">

              <div className="goal-badge">🎯</div>

              <div>

                <div className="eyebrow">CURRENT GOAL</div>

                <h3>{data.goalName}</h3>

                <p>Every small contribution counts.</p>

              </div>

            </div>



            <div className="goal-numbers">

              <div><span>Already saved</span><strong>{formatMoney(savedAmount)}</strong></div>

              <div><span>Target amount</span><strong>{formatMoney(goalAmount)}</strong></div>

            </div>



            <div className="goal-progress-track">

              <div className="goal-progress-fill" style={{ width: `${progress}%` }} />

            </div>

            <div className="goal-progress-caption">

              <span>{Math.round(progress)}% complete</span>

              <span>{formatMoney(Math.max(0, goalAmount - savedAmount))} to go</span>

            </div>



            {progress >= 100 && (

              <div className="success-message">🎉 Goal reached! You can set a new target anytime.</div>

            )}

          </article>



          <article className="panel goal-form-panel">

            <div className="panel-heading">

              <div>

                <h3>Set your savings goal</h3>

                <p>Keep your goal clear and realistic.</p>

              </div>

            </div>

            <form onSubmit={updateGoal}>

              <label htmlFor="goal-name">What are you saving for?</label>

              <input id="goal-name" className="text-input" value={goalInput} onChange={(event) => setGoalInput(event.target.value)} maxLength="70" required />



              <div className="form-two-columns">

                <div>

                  <label htmlFor="goal-amount">Goal amount (₹)</label>

                  <input id="goal-amount" className="text-input" type="number" min="1" value={goalAmountInput} onChange={(event) => setGoalAmountInput(event.target.value)} required />

                </div>

                <div>

                  <label htmlFor="saved-amount">Saved so far (₹)</label>

                  <input id="saved-amount" className="text-input" type="number" min="0" value={savedInput} onChange={(event) => setSavedInput(event.target.value)} required />

                </div>

              </div>

              <button className="primary-button full-button" type="submit">Save my goal <span>→</span></button>

            </form>

          </article>

        </section>



        <div className="section-heading" id="missions">

          <div>

            <div className="eyebrow">LEARN BY DOING</div>

            <h2>Your money missions</h2>

            <p>Small challenges to help turn knowledge into habits.</p>

          </div>

          <span className="section-emoji">⚡</span>

        </div>



        <section className="missions-grid">

          {missions.map((mission, index) => {

            const completed = data.completedMissions.includes(mission.id);

            return (

              <article className={`mission-card ${completed ? "mission-complete" : ""}`} key={mission.id}>

                <div className={`mission-icon mission-icon-${index + 1}`}>{mission.icon}</div>

                <div className="mission-number">MISSION 0{mission.id}</div>

                <h3>{mission.title}</h3>

                <p>{mission.description}</p>

                <div className="mission-reward"><span>✦</span> {mission.reward}</div>

                <button className={completed ? "mission-button completed-button" : "mission-button"} onClick={() => toggleMission(mission.id)}>

                  {completed ? "✓ Completed — undo" : "Mark as complete"}&#x20;

                </button>

              </article>

            );

          })}

        </section>



        <div className="section-heading" id="simulator">

          <div>

            <div className="eyebrow">PAUSE BEFORE YOU PURCHASE</div>

            <h2>Try the spending simulator</h2>

            <p>Explore how a purchase might affect your plans — with pretend money.</p>

          </div>

          <span className="section-emoji">🛍️</span>

        </div>



        <section className="simulator-panel">

          <div className="simulator-copy">

            <div className="simulator-icon">🪙</div>

            <h3>Is it worth buying right now?</h3>

            <p>Enter the cost of something you want. Compare it with your suggested savings allocation and think about your priorities.</p>

            <form className="simulator-form" onSubmit={runSimulation}>

              <label htmlFor="expense">Purchase cost (₹)</label>

              <div className="simulator-input-row">

                <div className="money-input">

                  <span>₹</span>

                  <input id="expense" type="number" min="1" value={expense} onChange={(event) => setExpense(event.target.value)} required />

                </div>

                <button className="primary-button" type="submit">Compare decision <span>→</span></button>

              </div>

            </form>

          </div>



          <div className="simulator-result">

            {simulatedExpense > 0 ? (

              <>

                <div className="result-eyebrow">YOUR WHAT-IF SCENARIO</div>

                <div className="result-cost">{formatMoney(simulatedExpense)}</div>

                <div className="result-divider" />

                <div className="result-row"><span>Suggested savings allocation</span><strong>{formatMoney(savings)}</strong></div>

                <div className="result-row"><span>Cost compared with savings</span><strong>{simulatedExpense <= savings ? "Within allocation" : "Above allocation"}</strong></div>

                <p className="result-advice">

                  {simulatedExpense <= savings

                    ? "It fits within this example's savings-free allocation, but consider your needs and goal before deciding."

                    : "Consider waiting, comparing alternatives, or adjusting your plan before making the purchase."}

                </p>

              </>

            ) : (

              <div className="simulator-placeholder">

                <span className="placeholder-icon">↗</span>

                <h3>Your decision, made clearer.</h3>

                <p>Run a simulation to see a simple comparison here.</p>

                <div className="placeholder-chips"><span>Think</span><span>Compare</span><span>Choose</span></div>

              </div>

            )}

          </div>

        </section>



        <div className="section-heading" id="month-end">
          <div>
            <div className="eyebrow">LOOK BACK, LEARN, RESET</div>
            <h2>Month-End Reality Check</h2>
            <p>See where your money went and choose one small improvement for next month.</p>
          </div>
          <span className="section-emoji">📅</span>
        </div>

        <section className="reality-layout">
          <article className="panel reality-entry-panel">
            <div className="panel-heading">
              <div>
                <h3>Log an expense</h3>
                <p>Add expenses to make this report reflect your entries.</p>
              </div>
              <span className="panel-icon">₹</span>
            </div>
            <form className="feature-form" onSubmit={addExpense}>
              <label htmlFor="expense-amount">Amount (₹)</label>
              <input className="text-input" id="expense-amount" type="number" min="1" max="10000000" value={expenseAmountInput} onChange={(event) => setExpenseAmountInput(event.target.value)} required />
              <label htmlFor="expense-category">Category</label>
              <select className="text-input" id="expense-category" value={expenseCategoryInput} onChange={(event) => setExpenseCategoryInput(event.target.value)}>
                <option>Food</option>
                <option>Travel</option>
                <option>College</option>
                <option>Shopping</option>
                <option>Entertainment</option>
                <option>Health</option>
                <option>Other</option>
              </select>
              <label htmlFor="expense-note">What was it for?</label>
              <input className="text-input" id="expense-note" value={expenseNoteInput} onChange={(event) => setExpenseNoteInput(event.target.value)} maxLength="80" placeholder="e.g. bus fare or lunch" />
              <label htmlFor="expense-date">Date</label>
              <input className="text-input" id="expense-date" type="date" value={expenseDateInput} onChange={(event) => setExpenseDateInput(event.target.value)} required />
              <button className="primary-button full-button" type="submit">Add expense <span>→</span></button>
            </form>
            <p className="feature-footnote">Only expenses you enter are included. The report does not connect to your bank or UPI account.</p>
          </article>

          <article className="panel reality-report-panel">
            <div className="reality-report-head">
              <div>
                <h3>Your month at a glance</h3>
                <p>Choose a month to review your recorded expenses.</p>
              </div>
              <input className="month-picker" aria-label="Choose report month" type="month" value={reportMonth} onChange={(event) => setReportMonth(event.target.value)} />
            </div>
            <div className="reality-metrics">
              <div className="reality-metric"><span>Planned budget</span><strong>{formatMoney(budget)}</strong></div>
              <div className="reality-metric"><span>Recorded spending</span><strong>{formatMoney(monthSpend)}</strong></div>
              <div className={`reality-metric ${monthRemaining < 0 ? "metric-over" : "metric-under"}`}><span>{monthRemaining < 0 ? "Over budget by" : "Budget remaining"}</span><strong>{formatMoney(Math.abs(monthRemaining))}</strong></div>
            </div>
            <div className="reality-progress-label"><span>Budget used</span><strong>{budget > 0 ? Math.round((monthSpend / budget) * 100) : 0}%</strong></div>
            <div className="reality-progress-track"><div className={`reality-progress-fill ${monthRemaining < 0 ? "over-fill" : ""}`} style={{ width: `${Math.min(100, budget > 0 ? (monthSpend / budget) * 100 : 0)}%` }} /></div>
            <div className="reality-insight">
              <span className="insight-icon">💡</span>
              <div><strong>Your reality check</strong><p>{monthExpenses.length === 0 ? "No expenses recorded for this month yet. Add a few entries to get a meaningful review." : monthRemaining < 0 ? "Your recorded spending is above the planned budget. Review the category totals and choose one flexible expense to plan differently next month." : monthSpend === 0 ? "You have not recorded spending yet. Add expenses to make this review useful." : "Your recorded spending is within the planned budget. Check your categories and decide whether you can set aside a little more for your goal."}</p></div>
            </div>
            <div className="category-breakdown">
              <h4>Spending by category</h4>
              {Object.keys(categoryTotals).length === 0 ? <p className="empty-feature">Category totals will appear after you add expenses for this month.</p> : Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]).map(([category, total]) => (
                <div className="category-total-row" key={category}><span>{category}</span><strong>{formatMoney(total)}</strong><span className="category-percent">{monthSpend > 0 ? Math.round((total / monthSpend) * 100) : 0}%</span></div>
              ))}
            </div>
            <div className="expense-list-head"><h4>Recorded expenses</h4><span>{monthExpenses.length} entries</span></div>
            {monthExpenses.length === 0 ? <p className="empty-feature">No entries for this month.</p> : (
              <div className="expense-record-list">
                {[...monthExpenses].sort((a, b) => b.date.localeCompare(a.date)).map((item) => (
                  <div className="expense-record" key={item.id}><div><strong>{item.note || item.category}</strong><span>{item.date} · {item.category}</span></div><strong>{formatMoney(item.amount)}</strong><button type="button" className="remove-expense" onClick={() => deleteExpense(item.id)} aria-label={`Delete ${item.note || item.category}`}>×</button></div>
                ))}
              </div>
            )}
          </article>
        </section>

        <div className="section-heading" id="achievements">
          <div>
            <div className="eyebrow">EVERY STEP COUNTS</div>
            <h2>Your achievements</h2>
            <p>Build confidence through small, practical money habits.</p>
          </div>
          <span className="section-emoji">🏆</span>
        </div>
        <section className="achievement-summary panel">
          <div className="achievement-summary-copy"><span className="achievement-trophy">🏆</span><div><strong>{unlockedAchievements} of {achievementList.length} achievements unlocked</strong><p>Keep learning, tracking, and planning to unlock more badges.</p></div></div>
          <div className="achievement-progress-track"><div className="achievement-progress-fill" style={{ width: `${(unlockedAchievements / achievementList.length) * 100}%` }} /></div>
        </section>
        <section className="achievement-grid" aria-label="Achievement badges">
          {achievementList.map((achievement) => (
            <article className={`achievement-card ${achievement.unlocked ? "achievement-unlocked" : "achievement-locked"}`} key={achievement.title}>
              <div className="achievement-icon">{achievement.unlocked ? achievement.icon : "🔒"}</div>
              <div className="achievement-status">{achievement.unlocked ? "UNLOCKED" : "NOT YET"}</div>
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
            </article>
          ))}
        </section>

        <footer className="footer">

          <a className="footer-brand" href="#home">₹ MoneyMitra</a>

          <span>Learn today. Make wiser money choices tomorrow.</span>

          <button className="reset-button" onClick={resetDemo}>Reset demo data</button>

        </footer>

        <p className="disclaimer">

          MoneyMitra is an educational prototype for students. It uses sample data and is not professional financial advice.

        </p>

      </main>

    </div>

  );

}



export default App;