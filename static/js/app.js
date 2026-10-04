/**
 * FreelanceGuard - Client-Side JavaScript (app.js)
 * Clean, lightweight Vanilla JavaScript for:
 * 1. Calling Gemini AI requirement extraction asynchronously via fetch()
 * 2. Dynamically updating requirements and milestone rows
 * 3. Auto-dismissing flash alerts
 */

// ========================================================
// SINGLE PAGE WORKSPACE TAB SWITCHER (PERSISTENT ACROSS REFRESHES)
// ========================================================
function switchTab(tabName) {
  if (!tabName) tabName = "client";
  const tabs = ["client", "freelancer", "escrow", "admin"];

  tabs.forEach((t) => {
    const sec = document.getElementById("tabSection-" + t);
    const btn = document.getElementById("tabBtn" + t.charAt(0).toUpperCase() + t.slice(1));
    if (sec) {
      sec.style.display = (t === tabName) ? "block" : "none";
    }
    if (btn) {
      if (t === tabName) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    }
  });

  // 1. Persist to localStorage and sessionStorage so hard/double refreshes preserve view
  try {
    localStorage.setItem("freelanceguard_saved_tab", tabName);
    sessionStorage.setItem("freelanceguard_saved_tab", tabName);
  } catch (e) {}

  // 2. Set browser cookie so Flask backend receives the active tab on raw reloads
  try {
    document.cookie = "fg_active_tab=" + encodeURIComponent(tabName) + "; path=/; max-age=2592000; SameSite=Lax";
  } catch (e) {}

  // 3. Keep URL search parameter in sync without reloading page
  try {
    const url = new URL(window.location);
    url.searchParams.set("tab", tabName);
    window.history.replaceState({}, "", url);
  } catch (e) {}
}
window.switchTab = switchTab;

// ========================================================
// POST PROJECT TOGGLER & DIRECT ACTION
// ========================================================
function openPostProjectAction() {
  const clientTab = document.getElementById("tabSection-client");
  if (clientTab) {
    if (typeof switchTab === "function") {
      switchTab("client");
    }
    const card = document.getElementById("createProjectCard");
    if (card) {
      card.style.display = "block";
      setTimeout(() => {
        card.scrollIntoView({ behavior: "smooth", block: "start" });
        const titleInput = document.getElementById("projectTitle");
        if (titleInput) titleInput.focus();
      }, 60);
    }
  } else {
    window.location.href = "/?tab=client&action=post";
  }
}
window.openPostProjectAction = openPostProjectAction;

function toggleProjectForm() {
  if (typeof switchTab === "function") {
    switchTab("client");
  }
  const card = document.getElementById("createProjectCard");
  if (card) {
    const isHidden = card.style.display === "none" || !card.style.display;
    card.style.display = isHidden ? "block" : "none";
    if (isHidden) {
      setTimeout(() => {
        card.scrollIntoView({ behavior: "smooth", block: "start" });
        const titleInput = document.getElementById("projectTitle");
        if (titleInput) titleInput.focus();
      }, 60);
    }
  }
}
window.toggleProjectForm = toggleProjectForm;

// ========================================================
// NOTIFICATIONS TOGGLE & BADGE CLEAR (REAL-TIME SYNC)
// ========================================================
function toggleNotifications() {
  const dropdown = document.getElementById("notifDropdown");
  const badge = document.getElementById("notifBadge");
  const dropdownCount = document.getElementById("notifDropdownCount");

  if (!dropdown) return;

  const isHidden = dropdown.style.display === "none" || !dropdown.style.display;

  if (isHidden) {
    dropdown.style.display = "block";

    // Smoothly clear unread visual indicators
    if (badge) {
      badge.style.display = "none";
      badge.textContent = "0";
    }
    if (dropdownCount) {
      dropdownCount.textContent = "0 unread";
    }

    // Remove unread dots and background highlights
    document.querySelectorAll(".unread-dot").forEach(dot => dot.style.display = "none");
    document.querySelectorAll(".notif-item").forEach(item => {
      item.style.background = "#ffffff";
      item.classList.remove("notif-unread");
    });

    // Mark as read in database
    try {
      fetch("/api/notifications/mark-read", { method: "POST" });
    } catch (e) {
      console.warn("Could not mark notifications read on server:", e);
    }
  } else {
    dropdown.style.display = "none";
  }
}
window.toggleNotifications = toggleNotifications;

function clearAllNotifications(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const badge = document.getElementById("notifBadge");
  const dropdownCount = document.getElementById("notifDropdownCount");

  if (badge) {
    badge.style.display = "none";
    badge.textContent = "0";
  }
  if (dropdownCount) {
    dropdownCount.textContent = "0 unread";
  }

  document.querySelectorAll(".unread-dot").forEach(dot => dot.style.display = "none");
  document.querySelectorAll(".notif-item").forEach(item => {
    item.style.background = "#ffffff";
    item.classList.remove("notif-unread");
  });

  try {
    fetch("/api/notifications/mark-read", { method: "POST" });
  } catch (e) {
    console.warn("Could not mark notifications read on server:", e);
  }
}
window.clearAllNotifications = clearAllNotifications;

function initNotificationState() {
  const badge = document.getElementById("notifBadge");
  if (badge) {
    const count = parseInt(badge.textContent.trim(), 10) || 0;
    if (count <= 0) {
      badge.style.display = "none";
    } else {
      badge.style.display = "flex";
    }
  }
}

// Close notification dropdown when clicking anywhere outside
document.addEventListener("click", function(event) {
  const container = document.getElementById("notifContainer");
  const dropdown = document.getElementById("notifDropdown");
  if (container && dropdown && !container.contains(event.target)) {
    dropdown.style.display = "none";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("FreelanceGuard Single-Page UI initialized.");

  // 1. Initialize notification badge count (maintains 0 if previously opened)
  initNotificationState();

  // 2. Restore active workspace tab with strict fallback chain:
  //    (a) URL ?tab= query parameter
  //    (b) localStorage saved tab
  //    (c) sessionStorage saved tab
  //    (d) fallback to 'client'
  const urlParams = new URLSearchParams(window.location.search);
  const paramTab = urlParams.get("tab");
  const actionParam = urlParams.get("action");
  const localTab = localStorage.getItem("freelanceguard_saved_tab");
  const sessionTab = sessionStorage.getItem("freelanceguard_saved_tab");
  const activeTab = (actionParam === "post") ? "client" : (paramTab || localTab || sessionTab || "client");
  switchTab(activeTab);

  if (actionParam === "post") {
    setTimeout(() => {
      openPostProjectAction();
    }, 100);
  }

  // Auto-dismiss alert boxes after 5 seconds
  const alerts = document.querySelectorAll(".alert");
  alerts.forEach((alert) => {
    setTimeout(() => {
      alert.style.transition = "opacity 0.5s ease";
      alert.style.opacity = "0";
      setTimeout(() => alert.remove(), 500);
    }, 5000);
  });

  // ========================================================
  // GEMINI AI REQUIREMENT ANALYSIS INTERACTION
  // ========================================================
  // ========================================================
  // GEMINI AI REQUIREMENT ANALYSIS INTERACTION
  // ========================================================
  const aiButtons = document.querySelectorAll("#btnAnalyzeAI");

  aiButtons.forEach((btnAnalyzeAI) => {
    btnAnalyzeAI.addEventListener("click", async () => {
      const form = btnAnalyzeAI.closest("form") || document;
      const titleInput = form.querySelector("#projectTitle") || document.getElementById("projectTitle");
      const descInput = form.querySelector("#projectDescription") || document.getElementById("projectDescription");
      const budgetInput = form.querySelector("#projectBudget") || document.getElementById("projectBudget");
      const aiStatusMessage = form.querySelector("#aiStatusMessage") || document.getElementById("aiStatusMessage");

      const title = titleInput ? titleInput.value.trim() : "";
      const description = descInput ? descInput.value.trim() : "";
      const budget = budgetInput && parseFloat(budgetInput.value) > 0 ? parseFloat(budgetInput.value) : 5000;

      if (!description) {
        alert("Please enter a project description first so Gemini AI can extract requirements & milestones.");
        if (descInput) descInput.focus();
        return;
      }

      // 1. Show loading state
      const originalBtnText = btnAnalyzeAI.innerHTML;
      btnAnalyzeAI.disabled = true;
      btnAnalyzeAI.innerHTML = `<span>⏳ Gemini AI is analyzing...</span>`;

      if (aiStatusMessage) {
        aiStatusMessage.style.display = "block";
        aiStatusMessage.style.color = "var(--primary)";
        aiStatusMessage.innerText = "Extracting structured deliverables and sequential milestones with Gemini AI...";
      }

      try {
        // 2. Asynchronous API call to Flask backend
        const response = await fetch("/api/analyze-requirements", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            title: title || "",
            description: description,
            budget: budget
          })
        });

        const data = await response.json();

        if (data.success) {
          // If title was empty and AI generated one, populate it!
          if (data.title && titleInput && (!titleInput.value || titleInput.value.trim() === "")) {
            titleInput.value = data.title;
          }
          if (budgetInput && (!budgetInput.value || parseFloat(budgetInput.value) <= 0)) {
            budgetInput.value = budget;
          }

          // Auto-set deadline if empty
          const dlInput = form.querySelector("input[name='deadline']") || document.getElementById("projectDeadline");
          if (dlInput && !dlInput.value) {
            const dlDate = new Date();
            dlDate.setDate(dlDate.getDate() + 14);
            dlInput.value = dlDate.toISOString().split("T")[0];
          }

          // 3. Populate Requirements
          const reqContainer = form.querySelector("#requirementsContainer") || document.getElementById("requirementsContainer");
          if (reqContainer && data.requirements && data.requirements.length > 0) {
            reqContainer.innerHTML = "";
            data.requirements.forEach((reqText) => {
              addRequirementRow(reqText, reqContainer);
            });
          }

          // 4. Populate Milestones
          const milestoneContainer = form.querySelector("#milestonesContainer") || document.getElementById("milestonesContainer");
          if (milestoneContainer && data.milestones && data.milestones.length > 0) {
            milestoneContainer.innerHTML = "";
            const today = new Date();

            data.milestones.forEach((m, idx) => {
              const days = m.deadline_days || (idx + 1) * 5;
              const d = new Date();
              d.setDate(today.getDate() + days);
              const deadlineStr = d.toISOString().split("T")[0];

              addMilestoneRow(m.title, m.amount, deadlineStr, m.description || "", milestoneContainer);
            });
          }

          if (aiStatusMessage) {
            aiStatusMessage.style.color = "var(--success)";
            aiStatusMessage.innerText = `✓ Gemini AI successfully generated ${data.requirements ? data.requirements.length : 0} deliverables & ${data.milestones ? data.milestones.length : 0} milestones! Review and edit below.`;
          }
        } else {
          alert("AI Analysis error: " + (data.error || "Unable to extract requirements."));
          if (aiStatusMessage) aiStatusMessage.style.display = "none";
        }
      } catch (err) {
        console.error("AI Analysis Fetch Error:", err);
        alert("Failed to connect to AI analysis service: " + err.message);
        if (aiStatusMessage) aiStatusMessage.style.display = "none";
      } finally {
        btnAnalyzeAI.disabled = false;
        btnAnalyzeAI.innerHTML = originalBtnText;
      }
    });
  });

  // ========================================================
  // DYNAMIC REQUIREMENT ROW MANAGEMENT
  // ========================================================
  const reqButtons = document.querySelectorAll("#btnAddRequirement");
  reqButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const form = btn.closest("form") || document;
      const container = form.querySelector("#requirementsContainer") || document.getElementById("requirementsContainer");
      addRequirementRow("", container);
    });
  });

  function addRequirementRow(value, targetContainer) {
    const container = targetContainer || document.getElementById("requirementsContainer");
    if (!container) return;

    const row = document.createElement("div");
    row.className = "req-row";
    row.style.cssText = "display: flex; gap: 0.5rem; align-items: center;";
    row.innerHTML = `
      <input type="text" name="requirements[]" placeholder="Enter deliverable..." value="${escapeHtml(value)}" style="flex: 1; padding: 0.65rem 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.9rem; font-family: inherit;">
      <button type="button" class="btn-remove-row" style="background: none; border: none; color: var(--danger); font-size: 1.1rem; cursor: pointer; padding: 0 0.5rem;" title="Remove deliverable">&times;</button>
    `;

    row.querySelector(".btn-remove-row").addEventListener("click", () => {
      row.remove();
    });

    container.appendChild(row);
  }

  // ========================================================
  // DYNAMIC MILESTONE BOX MANAGEMENT
  // ========================================================
  const msButtons = document.querySelectorAll("#btnAddMilestone");
  msButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const form = btn.closest("form") || document;
      const container = form.querySelector("#milestonesContainer") || document.getElementById("milestonesContainer");
      const today = new Date();
      today.setDate(today.getDate() + 7);
      const dl = today.toISOString().split("T")[0];
      addMilestoneRow("", "", dl, "", container);
    });
  });

  function addMilestoneRow(title, amount, deadline, desc, targetContainer) {
    const container = targetContainer || document.getElementById("milestonesContainer");
    if (!container) return;

    const box = document.createElement("div");
    box.className = "milestone-box";
    box.style.cssText = "padding: 1.1rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: var(--bg-card-subtle); margin-bottom: 0.75rem;";
    box.innerHTML = `
      <div style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 0.75rem; align-items: center; margin-bottom: 0.5rem;">
        <div>
          <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Milestone Title</label>
          <input type="text" name="milestone_title[]" required placeholder="e.g. Phase 1: Setup" value="${escapeHtml(title)}" style="width: 100%; padding: 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.9rem;">
        </div>
        <div>
          <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Amount (₹)</label>
          <input type="number" name="milestone_amount[]" required placeholder="Amount (₹)" value="${amount || ''}" step="50" style="width: 100%; padding: 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.9rem;">
        </div>
        <div>
          <label style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Deadline</label>
          <input type="date" name="milestone_deadline[]" value="${deadline || ''}" style="width: 100%; padding: 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.9rem;">
        </div>
        <div style="padding-top: 1rem;">
          <button type="button" class="btn-remove-milestone" style="background: none; border: none; color: var(--danger); font-size: 1.2rem; cursor: pointer;" title="Remove milestone">&times;</button>
        </div>
      </div>
      <div>
        <input type="text" name="milestone_description[]" placeholder="Deliverable details (optional)" value="${escapeHtml(desc)}" style="width: 100%; padding: 0.55rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); font-size: 0.85rem;">
      </div>
    `;

    box.querySelector(".btn-remove-milestone").addEventListener("click", () => {
      box.remove();
    });

    container.appendChild(box);
  }

  // Bind existing remove buttons
  document.querySelectorAll(".btn-remove-row").forEach(btn => {
    btn.addEventListener("click", (e) => e.target.closest(".req-row").remove());
  });

  document.querySelectorAll(".btn-remove-milestone").forEach(btn => {
    btn.addEventListener("click", (e) => e.target.closest(".milestone-box").remove());
  });

  function escapeHtml(text) {
    if (!text) return "";
    return String(text)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
