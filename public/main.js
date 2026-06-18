/**
 * Portofolio SPA — Continuous Scroll with Smooth Anchor Navigation
 * Handles: Hamburger menu, theme toggle, scroll-spy active nav, smooth scroll
 */
(function () {
  'use strict';

  const body = document.body;
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const themeToggle = document.getElementById('themeToggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const header = document.getElementById('header');

  let isSidebarOpen = false;
  let isDarkMode = localStorage.getItem('theme') === 'dark';
  let scrollTimeout;

  // ─── Theme ────────────────────────────────────────────────────
  function applyTheme(dark) {
    body.classList.toggle('dark-mode', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    isDarkMode = dark;
  }
  applyTheme(isDarkMode);

  themeToggle.addEventListener('click', function () {
    applyTheme(!isDarkMode);
  });

  // ─── Sidebar ──────────────────────────────────────────────────
  function openSidebar() { body.classList.add('sidebar-open'); isSidebarOpen = true; }
  function closeSidebar() { body.classList.remove('sidebar-open'); isSidebarOpen = false; }
  function toggleSidebar() { isSidebarOpen ? closeSidebar() : openSidebar(); }

  hamburgerBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    toggleSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && isSidebarOpen) closeSidebar();
  });

  // ─── Smooth Scroll Navigation ────────────────────────────────
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      if (isSidebarOpen) closeSidebar();

      const targetId = this.getAttribute('data-target');
      if (!targetId) return;

      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;

      navLinks.forEach(function (l) { l.classList.remove('active'); });
      this.classList.add('active');

      const headerHeight = 68;
      const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight;

      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });

  // ─── Scroll Spy ──────────────────────────────────────────────
  const sections = document.querySelectorAll('.scroll-section');

  function updateActiveNavOnScroll() {
    const scrollPos = window.pageYOffset + 100;
    const headerHeight = 68;
    let currentId = 'home';

    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - headerHeight - 10;
      const sectionBottom = sectionTop + section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('data-target') === currentId);
    });
  }

  window.addEventListener('scroll', function () {
    if (scrollTimeout) window.cancelAnimationFrame(scrollTimeout);
    scrollTimeout = window.requestAnimationFrame(updateActiveNavOnScroll);
  }, { passive: true });

  // ─── Header Shadow ───────────────────────────────────────────
  window.addEventListener('scroll', function () {
    header.classList.toggle('header-scrolled', window.pageYOffset > 10);
  }, { passive: true });

  // ─── Init ────────────────────────────────────────────────────
  navLinks.forEach(function (link) {
    if (link.getAttribute('data-target') === 'home') link.classList.add('active');
  });

  console.log('✅ Portofolio siap! Gunakan menu navigasi untuk scroll ke section.');

})();
