/* =========================================================
   Portfolio · 配套交互脚本（适配原始 index.html，类名一一对应）
   纯原生 JS，无外部依赖，GitHub Pages 可直接运行
   ========================================================= */
(function () {
  "use strict";

  var doc = document;
  var html = doc.documentElement;

  /* ---------- 深浅色主题切换（moon <-> sun 图标） ---------- */
  var themeToggle = doc.getElementById("themeToggle");

  function applyTheme(theme) {
    html.setAttribute("data-theme", theme);
    if (themeToggle) {
      var icon = themeToggle.querySelector("i");
      if (icon) icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
  }

  var savedTheme = null;
  try { savedTheme = localStorage.getItem("portfolio-theme"); } catch (e) { /* 忽略隐私模式 */ }
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(savedTheme || (prefersDark ? "dark" : "light"));

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try { localStorage.setItem("portfolio-theme", next); } catch (e) { /* 忽略 */ }
    });
  }

  /* ---------- 导航栏：滚动阴影 ---------- */
  var navbar = doc.querySelector(".navbar");
  function onScrollNav() {
    if (navbar) navbar.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- 移动端菜单 ---------- */
  var hamburger = doc.querySelector(".hamburger");
  var navLinks = doc.querySelector(".nav-links");
  function closeMenu() {
    if (navLinks) navLinks.classList.remove("open");
  }
  if (hamburger && navLinks) {
    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("open");
    });
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
    doc.addEventListener("click", function (e) {
      if (navLinks.classList.contains("open") &&
          !navLinks.contains(e.target) &&
          !hamburger.contains(e.target)) {
        closeMenu();
      }
    });
  }

  /* ---------- 滚动监听：高亮当前区块 ---------- */
  var sections = doc.querySelectorAll("section[id]");
  var menuAnchors = doc.querySelectorAll('.nav-links a[href^="#"]');

  if ("IntersectionObserver" in window) {
    var spyObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        menuAnchors.forEach(function (a) {
          a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (sec) { spyObserver.observe(sec); });
  }

  /* ---------- 作品集筛选 ---------- */
  var filterBtns = doc.querySelectorAll(".filter-btn");
  var items = doc.querySelectorAll(".portfolio-item");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var filter = btn.getAttribute("data-filter") || "all";
      var visible = 0;
      items.forEach(function (item) {
        var show = filter === "all" || item.getAttribute("data-category") === filter;
        item.classList.toggle("hide", !show);
        if (show) {
          item.style.animation = "none";
          void item.offsetWidth; // 强制重排后重新播放入场动画
          item.style.animation = "";
          item.style.animationDelay = visible * 0.06 + "s";
          visible++;
        }
      });
    });
  });

  /* ---------- 联系表单（纯前端演示，不真正发信） ---------- */
  var form = doc.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.textContent = "已收到，我会尽快回复";
      form.reset();
      setTimeout(function () {
        if (submitBtn) submitBtn.textContent = "发送消息";
      }, 4000);
    });
  }

  /* ---------- 页脚年份自动更新 ---------- */
  var yearEl = doc.getElementById("year");
  if (!yearEl) {
    var cp = doc.querySelector(".copyright p");
    if (cp) {
      var m = cp.innerHTML.match(/&copy; \d{4}/);
      if (m) cp.innerHTML = cp.innerHTML.replace(m[0], "&copy; " + new Date().getFullYear());
    }
  } else {
    yearEl.textContent = new Date().getFullYear();
  }
})();
