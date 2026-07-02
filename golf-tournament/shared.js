/**
 * shared.js — Navigation, table sorting, and utilities for Penn Nat Championship site.
 */
(function () {
  'use strict';

  // ── Page detection ──────────────────────────────────────────────────────────
  var path = window.location.pathname;
  var page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
  var isHome = (page === 'index.html' || page === '');

  function isActive(filename) {
    return page === filename ? ' active' : '';
  }

  function isYearActive() {
    return /^\d{4}\.html$/.test(page) ? ' active' : '';
  }

  // ── SVG flag icon ───────────────────────────────────────────────────────────
  var flagSVG =
    '<svg class="nav-brand-flag" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">' +
      '<line x1="9" y1="4" x2="9" y2="29" stroke="#e8dcc8" stroke-width="2" stroke-linecap="round"/>' +
      '<polygon points="9,4 27,10 9,16" fill="#e8dcc8"/>' +
      '<ellipse cx="12" cy="29" rx="6" ry="2" fill="#060606"/>' +
      '<circle cx="18" cy="27.5" r="2" fill="#e8e0d4"/>' +
    '</svg>';

  // ── Build nav HTML ──────────────────────────────────────────────────────────
  var years = [2025, 2024, 2023, 2022, 2021, 2020, 2019];
  var yearLinksHTML = '';
  years.forEach(function (y) {
    yearLinksHTML += '<a href="' + y + '.html"' + isActive(y + '.html') + '>' + y + '</a>';
  });

  var navHTML =
    '<header id="site-header">' +
      '<div class="nav-inner">' +
        '<a href="index.html" class="nav-brand">' + flagSVG + ' Penn Nat</a>' +
        '<button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-label="Toggle navigation">&#9776;</button>' +
        '<nav class="nav-links" id="nav-links">' +
          '<a href="index.html"' + isActive('index.html') + '>Home</a>' +
          '<a href="record-books.html"' + isActive('record-books.html') + '>Record Books</a>' +
          '<div class="nav-dropdown" id="year-dropdown">' +
            '<button class="nav-dropdown-btn" type="button" aria-expanded="false">' +
              'Years <span class="nav-dropdown-arrow">&#9660;</span>' +
            '</button>' +
            '<div class="nav-dropdown-menu">' + yearLinksHTML + '</div>' +
          '</div>' +
          '<a href="gallery.html"' + isActive('gallery.html') + '>Gallery</a>' +
          '<a href="players.html"' + isActive('players.html') + '>Player Profiles</a>' +
        '</nav>' +
      '</div>' +
    '</header>';

  // ── Footer ──────────────────────────────────────────────────────────────────
  var footerHTML =
    '<footer id="site-footer">' +
      '<div class="container">' +
        '<p>&copy; ' + new Date().getFullYear() +
        ' Penn Nat Championship &mdash; Fayetteville, PA</p>' +
      '</div>' +
    '</footer>';

  // ── Inject nav ──────────────────────────────────────────────────────────────
  var navPlaceholder = document.getElementById('nav-placeholder');
  if (navPlaceholder) {
    navPlaceholder.innerHTML = navHTML;

    // Hamburger toggle
    var toggle = document.getElementById('nav-toggle');
    var navLinks = document.getElementById('nav-links');
    if (toggle && navLinks) {
      toggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        toggle.innerHTML = isOpen ? '&times;' : '&#9776;';
      });
    }

    // Year dropdown
    var dropdown = document.getElementById('year-dropdown');
    if (dropdown) {
      var ddBtn = dropdown.querySelector('.nav-dropdown-btn');
      ddBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        dropdown.classList.toggle('open');
        ddBtn.setAttribute('aria-expanded', dropdown.classList.contains('open') ? 'true' : 'false');
      });
      document.addEventListener('click', function () {
        dropdown.classList.remove('open');
        ddBtn.setAttribute('aria-expanded', 'false');
      });
    }
  }

  // ── Inject footer ──────────────────────────────────────────────────────────
  var footerPlaceholder = document.getElementById('footer-placeholder');
  if (footerPlaceholder) {
    footerPlaceholder.innerHTML = footerHTML;
  }

  // ── IntersectionObserver for animations ─────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    var els = document.querySelectorAll('.animate-on-scroll');
    if (!els.length) return;
    if (!window.IntersectionObserver) {
      els.forEach(function (el) { el.classList.add('visible'); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    els.forEach(function (el) { observer.observe(el); });
  });

  // ── Table Sorting ──────────────────────────────────────────────────────────
  window.PennNat = window.PennNat || {};

  // ── 5-Year Veteran Badge ──────────────────────────────────────────────────
  window.PennNat.fiveYearPlayers = [
    'Tommy Farrell', 'Bret Custer', 'Seth Kaas', 'Gavin Vetrano',
    'Eric Upchurch', 'Petey Lytle', 'Mike Furman', 'Mark Graner', 'Tim Boykin'
  ];

  window.PennNat.badge5yr = '<span class="badge-5yr" title="5+ Year Veteran">5</span>';

  // ── Champion Badge (YETI mug) ────────────────────────────────────────────
  window.PennNat.champions = [
    'Kevin Flanagan',   // 2019
    'Seth Kaas',        // 2020
    // 2021 TBD
    'Tommy Farrell',    // 2022
    'Josh Moss',        // 2023
    'Tom Farrell Sr',   // 2024
    'Bret Custer'       // 2025
  ];

  window.PennNat.badgeChamp = '<span class="badge-champ" title="Past Champion"><img src="yeti-no-background.png" alt="Champion"></span>';

  /**
   * Returns name + all applicable badge HTML (5yr + champion).
   */
  window.PennNat.badgedName = function (name) {
    var html = PennNat.escapeHTML(name);
    if (PennNat.fiveYearPlayers.indexOf(name) !== -1) {
      html += ' ' + PennNat.badge5yr;
    }
    if (PennNat.champions.indexOf(name) !== -1) {
      html += ' ' + PennNat.badgeChamp;
    }
    return html;
  };

  /**
   * Inject all badges into a raw HTML string wherever a player name appears.
   */
  window.PennNat.injectBadges = function (html) {
    var badge5 = PennNat.badge5yr;
    var badgeC = PennNat.badgeChamp;
    // Process champions first (some may also be 5yr players)
    PennNat.champions.forEach(function (name) {
      if (html.indexOf(name) !== -1) {
        var full = name;
        if (PennNat.fiveYearPlayers.indexOf(name) !== -1) {
          full = name + ' ' + badge5 + ' ' + badgeC;
        } else {
          full = name + ' ' + badgeC;
        }
        html = html.split(name).join(full);
      }
    });
    // Process remaining 5yr players who aren't champions
    PennNat.fiveYearPlayers.forEach(function (name) {
      if (PennNat.champions.indexOf(name) !== -1) return; // already handled
      if (html.indexOf(name) !== -1) {
        html = html.split(name).join(name + ' ' + badge5);
      }
    });
    return html;
  };

  // ── Auto-badge for year pages (hardcoded HTML tables) ─────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    // Only run on year pages (handles both /2025.html and /2025 paths)
    if (!/^\d{4}(\.html)?$/.test(page)) return;

    function injectAllBadges(el) {
      var html = el.innerHTML;
      var result = PennNat.injectBadges(html);
      if (result !== html) el.innerHTML = result;
    }

    // Badge player names in table cells
    var cells = document.querySelectorAll('.data-table td');
    cells.forEach(function (td) {
      if (td.querySelector('.rank-badge') || td.classList.contains('col-num')) return;
      injectAllBadges(td);
    });

    // Badge player names in award cards
    var winners = document.querySelectorAll('.award-card-winner');
    winners.forEach(function (el) { injectAllBadges(el); });
  });

  /**
   * Make a table sortable. Call PennNat.makeSortable(tableElement).
   * Columns with class "sortable" on <th> will be sortable.
   */
  window.PennNat.makeSortable = function (table) {
    if (!table) return;
    var headers = table.querySelectorAll('th.sortable');
    headers.forEach(function (th, colIndex) {
      // Find actual column index
      var idx = Array.prototype.indexOf.call(th.parentNode.children, th);
      var arrow = document.createElement('span');
      arrow.className = 'sort-arrow';
      arrow.textContent = ' \u25B2';
      th.appendChild(arrow);

      th.addEventListener('click', function () {
        var tbody = table.querySelector('tbody');
        if (!tbody) return;
        var rows = Array.from(tbody.querySelectorAll('tr'));
        var isAsc = th.classList.contains('sort-asc');

        // Clear other headers
        headers.forEach(function (h) {
          h.classList.remove('sort-asc', 'sort-desc');
          var a = h.querySelector('.sort-arrow');
          if (a) a.textContent = ' \u25B2';
        });

        if (isAsc) {
          th.classList.add('sort-desc');
          arrow.textContent = ' \u25BC';
        } else {
          th.classList.add('sort-asc');
          arrow.textContent = ' \u25B2';
        }

        rows.sort(function (a, b) {
          var cellA = a.children[idx];
          var cellB = b.children[idx];
          if (!cellA || !cellB) return 0;
          var valA = (cellA.getAttribute('data-sort') || cellA.textContent).trim();
          var valB = (cellB.getAttribute('data-sort') || cellB.textContent).trim();
          var numA = parseFloat(valA);
          var numB = parseFloat(valB);

          // Handle special values
          if (valA === '-' || valA === 'DNP' || valA === 'WD' || valA === 'ESC') numA = Infinity;
          if (valB === '-' || valB === 'DNP' || valB === 'WD' || valB === 'ESC') numB = Infinity;

          var result;
          if (!isNaN(numA) && !isNaN(numB)) {
            result = numA - numB;
          } else {
            result = valA.localeCompare(valB);
          }
          return isAsc ? -result : result;
        });

        rows.forEach(function (row) { tbody.appendChild(row); });
      });
    });
  };

  /**
   * Tab switching utility.
   * PennNat.initTabs(containerSelector, tabBtnSelector, panelSelector)
   */
  window.PennNat.initTabs = function (containerSel, btnSel, panelSel) {
    var container = document.querySelector(containerSel);
    if (!container) return;
    var btns = container.querySelectorAll(btnSel);
    // Search panels from document, not container — panels are siblings, not children
    var panels = document.querySelectorAll(panelSel);

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-tab');
        btns.forEach(function (b) { b.classList.toggle('active', b === btn); });
        panels.forEach(function (p) {
          p.classList.toggle('active', p.id === target);
        });
      });
    });
  };

  /**
   * Round tab switching for year pages.
   */
  window.PennNat.initRoundTabs = function () {
    var btns = document.querySelectorAll('.round-tab-btn');
    var panels = document.querySelectorAll('.round-panel');

    btns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-round');
        btns.forEach(function (b) { b.classList.toggle('active', b === btn); });
        panels.forEach(function (p) {
          p.classList.toggle('active', p.id === target);
        });
      });
    });
  };

  /**
   * Escape HTML for safe rendering
   */
  window.PennNat.escapeHTML = function (str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  };

})();
