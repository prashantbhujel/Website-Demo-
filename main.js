/* ══════════════════════════════════════════════════════
   NepalApp — नेपाल कम्युनिटी एप
   Main JavaScript  |  main.js
   ══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ──────────────────────────────────────
     1. LIVE DATE IN TOPBAR
  ────────────────────────────────────── */
  const dateEl = document.getElementById('today-date');
  if (dateEl) {
    const now  = new Date();
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = now.toLocaleDateString('en-GB', opts);
  }


  /* ──────────────────────────────────────
     2. LANGUAGE TOGGLE (English / नेपाली)
  ────────────────────────────────────── */
  const langBtns = document.querySelectorAll('.topbar-lang span');
  langBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      langBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      // TODO: hook into i18n system when backend is ready
    });
  });


  /* ──────────────────────────────────────
     3. MAIN NAVIGATION — ACTIVE STATE
  ────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.main-nav > .nav-link');
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      link.classList.add('active');
      closeNewsDropdown();
    });
  });


  /* ──────────────────────────────────────
     3b. NEWS DROPDOWN
  ────────────────────────────────────── */
  var newsDropdown = document.querySelector('.nav-item-dropdown');
  var newsTrigger  = document.getElementById('news-nav-trigger');
  var newsItems    = document.querySelectorAll('.nav-dropdown-item');
  const catTabs    = document.querySelectorAll('.cat-tab');

  function closeNewsDropdown() {
    if (newsDropdown) newsDropdown.classList.remove('open');
    if (newsTrigger) newsTrigger.setAttribute('aria-expanded', 'false');
  }

  function openNewsDropdown() {
    if (newsDropdown) newsDropdown.classList.add('open');
    if (newsTrigger) newsTrigger.setAttribute('aria-expanded', 'true');
  }

  if (newsTrigger && newsDropdown) {
    newsTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = newsDropdown.classList.contains('open');
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      newsTrigger.classList.add('active');
      if (isOpen) {
        closeNewsDropdown();
      } else {
        openNewsDropdown();
      }
    });
  }

  newsItems.forEach(function (item) {
    item.addEventListener('click', function () {
      newsItems.forEach(function (i) { i.classList.remove('active'); });
      item.classList.add('active');
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      if (newsTrigger) newsTrigger.classList.add('active');

      var label = item.textContent.trim();
      catTabs.forEach(function (tab) {
        tab.classList.remove('active');
        if (tab.textContent.trim() === label) {
          tab.classList.add('active');
        }
      });

      closeNewsDropdown();
    });
  });

  document.addEventListener('click', function (e) {
    if (newsDropdown && !newsDropdown.contains(e.target)) {
      closeNewsDropdown();
    }
  });


  /* ──────────────────────────────────────
     4. CATEGORY TABS — ACTIVE STATE
  ────────────────────────────────────── */
  catTabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      catTabs.forEach(function (t) { t.classList.remove('active'); });
      tab.classList.add('active');

      var label = tab.textContent.trim();
      if (label !== 'All') {
        newsItems.forEach(function (item) {
          item.classList.remove('active');
          if (item.textContent.trim() === label) {
            item.classList.add('active');
          }
        });
        navLinks.forEach(function (l) { l.classList.remove('active'); });
        if (newsTrigger) newsTrigger.classList.add('active');
      } else {
        newsItems.forEach(function (item) { item.classList.remove('active'); });
      }
      // TODO: filter feed articles by selected category via API
    });
  });


  /* ──────────────────────────────────────
     5. SEARCH OVERLAY
  ────────────────────────────────────── */
  var overlay      = document.getElementById('search-overlay');
  var searchTrigger = document.getElementById('search-trigger');
  var searchClose  = document.getElementById('search-close');
  var searchInput  = overlay ? overlay.querySelector('.search-input') : null;

  // Open overlay
  if (searchTrigger && overlay) {
    searchTrigger.addEventListener('click', function () {
      overlay.classList.add('open');
      // Focus input after a brief delay (CSS transition)
      setTimeout(function () {
        if (searchInput) searchInput.focus();
      }, 50);
    });
  }

  // Close via X button
  if (searchClose && overlay) {
    searchClose.addEventListener('click', function () {
      overlay.classList.remove('open');
    });
  }

  // Close by clicking the backdrop
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        overlay.classList.remove('open');
      }
    });
  }

  // Close with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay) {
      overlay.classList.remove('open');
    }
  });

  // Trending search tag — fills input with tag text
  var searchTags = document.querySelectorAll('.search-tag');
  searchTags.forEach(function (tag) {
    tag.addEventListener('click', function () {
      if (searchInput) {
        searchInput.value = tag.textContent;
        searchInput.focus();
        // TODO: trigger search API call here
      }
    });
  });


  /* ──────────────────────────────────────
     6. LOAD MORE BUTTON
  ────────────────────────────────────── */
  var loadMoreBtn = document.querySelector('.load-more');
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      // Show spinner while loading
      loadMoreBtn.innerHTML =
        '<i class="ti ti-loader-2" style="animation: spin 0.8s linear infinite;"></i> Loading…';
      loadMoreBtn.disabled = true;

      // Simulate API delay — replace setTimeout with a real fetch() call
      setTimeout(function () {
        loadMoreBtn.innerHTML = '<i class="ti ti-refresh"></i> Load more stories';
        loadMoreBtn.disabled  = false;
        // TODO: append new article cards to .feed via API response
      }, 1500);
    });
  }


  /* ──────────────────────────────────────
     7. DISTRICT PILL — CLICK HANDLER
  ────────────────────────────────────── */
  var districtPill = document.querySelector('.district-pill');
  if (districtPill) {
    districtPill.addEventListener('click', function () {
      // TODO: open a district-selector dropdown or modal
      alert('District selector coming soon. You will be able to choose from all 77 districts of Nepal.');
    });
  }


  /* ──────────────────────────────────────
     8. ARTICLE CARDS — CLICK HANDLER
       (hero, grid, list)
  ────────────────────────────────────── */
  var articleCards = document.querySelectorAll('.hero-card, .news-card, .list-card');
  articleCards.forEach(function (card) {
    card.addEventListener('click', function (e) {
      // Don't trigger if user clicked an action button inside the card
      if (e.target.closest('.act-btn')) return;
      // TODO: navigate to article detail page  e.g. window.location.href = '/article/' + articleId;
      console.log('Article card clicked — navigate to article detail page');
    });
  });


  /* ──────────────────────────────────────
     9. SAVE / BOOKMARK BUTTON
  ────────────────────────────────────── */
  var saveBtn = document.querySelector('.act-btn.save');
  if (saveBtn) {
    saveBtn.addEventListener('click', function (e) {
      e.stopPropagation(); // prevent card click
      var icon = saveBtn.querySelector('i');
      var isBookmarked = icon.classList.contains('ti-bookmark-filled');

      if (isBookmarked) {
        icon.classList.replace('ti-bookmark-filled', 'ti-bookmark');
        saveBtn.style.color = '';
      } else {
        icon.classList.replace('ti-bookmark', 'ti-bookmark-filled');
        saveBtn.style.color = 'var(--red)';
      }
      // TODO: call save/unsave API endpoint for logged-in users
    });
  }


  /* ──────────────────────────────────────
     10. LIKE / UPVOTE BUTTON
  ────────────────────────────────────── */
  var likeBtn = document.querySelector('.act-btn:not(.save):not(.read-more)');
  if (likeBtn && likeBtn.querySelector('.ti-thumb-up')) {
    likeBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var icon  = likeBtn.querySelector('i');
      var parts = likeBtn.textContent.trim().split(' ');
      var count = parseInt(parts[parts.length - 1], 10) || 0;

      if (likeBtn.dataset.liked === 'true') {
        likeBtn.dataset.liked = 'false';
        likeBtn.style.color   = '';
        likeBtn.innerHTML     = '<i class="ti ti-thumb-up"></i> ' + (count - 1);
      } else {
        likeBtn.dataset.liked = 'true';
        likeBtn.style.color   = 'var(--red)';
        likeBtn.innerHTML     = '<i class="ti ti-thumb-up"></i> ' + (count + 1);
      }
      // TODO: call like/unlike API endpoint
    });
  }


  /* ──────────────────────────────────────
     11. WEATHER WIDGET — LOCATION CHANGE
  ────────────────────────────────────── */
  var wxCity = document.querySelector('.wx-city');
  if (wxCity) {
    wxCity.addEventListener('click', function () {
      // TODO: open district/city search for weather location
      console.log('Weather location selector clicked');
    });
  }


  /* ──────────────────────────────────────
     12. PREMIUM CTA BUTTON
  ────────────────────────────────────── */
  var premiumBtn = document.querySelector('.btn-gold');
  if (premiumBtn) {
    premiumBtn.addEventListener('click', function () {
      // TODO: navigate to /subscribe page
      console.log('Premium subscription CTA clicked');
    });
  }


  /* ──────────────────────────────────────
     13. WIDGET "MORE" LINKS
  ────────────────────────────────────── */
  var widgetMoreBtns = document.querySelectorAll('.widget-more');
  widgetMoreBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      // TODO: navigate to corresponding full page
      console.log('Widget more link clicked:', btn.textContent);
    });
  });


  /* ──────────────────────────────────────
     14. FOOTER LINKS
  ────────────────────────────────────── */
  var footerLinks = document.querySelectorAll('.footer-col ul li, .footer-bottom-links span');
  footerLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      // TODO: navigate to corresponding footer page
      console.log('Footer link clicked:', link.textContent);
    });
  });

}); // end DOMContentLoaded