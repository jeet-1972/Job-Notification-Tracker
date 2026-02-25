// Job Notification Tracker — Routes, job data, filters, saved jobs.
// No backend. Premium UI only.

(function () {
  var routeView = document.getElementById("route-view");
  var pageTitleEl = document.getElementById("page-title");
  var pageSubtitleEl = document.getElementById("page-subtitle");
  var desktopLinks = Array.prototype.slice.call(
    document.querySelectorAll(".primary-nav__links--desktop .primary-nav__link")
  );
  var mobileLinks = Array.prototype.slice.call(
    document.querySelectorAll(".primary-nav__links--mobile .primary-nav__link")
  );
  var allLinks = desktopLinks.concat(mobileLinks);
  var nav = document.querySelector(".primary-nav");
  var toggle = document.querySelector(".primary-nav__toggle");

  var JOBS = window.JOB_DATA || [];
  var SAVED_KEY = "jobNotificationTracker_savedIds";

  function getSavedJobIds() {
    try {
      var raw = localStorage.getItem(SAVED_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) {
      return [];
    }
  }

  function setSavedJobIds(ids) {
    try {
      localStorage.setItem(SAVED_KEY, JSON.stringify(ids));
    } catch (e) {}
  }

  function escapeHtml(str) {
    if (!str) return "";
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function getFilterBarHtml() {
    return (
      '<div class="filter-bar">' +
      '<input type="search" id="filter-keyword" class="input" placeholder="Search title or company" aria-label="Keyword search">' +
      '<select id="filter-location" class="input select" aria-label="Location">' +
      '<option value="">Location</option>' +
      '<option value="Bangalore">Bangalore</option>' +
      '<option value="Chennai">Chennai</option>' +
      '<option value="Hyderabad">Hyderabad</option>' +
      '<option value="Mumbai">Mumbai</option>' +
      '<option value="Pune">Pune</option>' +
      '<option value="Noida">Noida</option>' +
      '<option value="Gurgaon">Gurgaon</option>' +
      '<option value="Remote">Remote</option>' +
      "</select>" +
      '<select id="filter-mode" class="input select" aria-label="Mode">' +
      '<option value="">Mode</option>' +
      '<option value="Remote">Remote</option>' +
      '<option value="Hybrid">Hybrid</option>' +
      '<option value="Onsite">Onsite</option>' +
      "</select>" +
      '<select id="filter-experience" class="input select" aria-label="Experience">' +
      '<option value="">Experience</option>' +
      '<option value="Fresher">Fresher</option>' +
      '<option value="0-1">0-1</option>' +
      '<option value="1-3">1-3</option>' +
      '<option value="3-5">3-5</option>' +
      "</select>" +
      '<select id="filter-source" class="input select" aria-label="Source">' +
      '<option value="">Source</option>' +
      '<option value="LinkedIn">LinkedIn</option>' +
      '<option value="Naukri">Naukri</option>' +
      '<option value="Indeed">Indeed</option>' +
      "</select>" +
      '<select id="filter-sort" class="input select" aria-label="Sort">' +
      '<option value="latest">Latest</option>' +
      '<option value="oldest">Oldest</option>' +
      "</select>" +
      "</div>"
    );
  }

  function getFilterValues() {
    var kw = document.getElementById("filter-keyword");
    var loc = document.getElementById("filter-location");
    var mode = document.getElementById("filter-mode");
    var exp = document.getElementById("filter-experience");
    var src = document.getElementById("filter-source");
    var sort = document.getElementById("filter-sort");
    return {
      keyword: kw ? kw.value.trim().toLowerCase() : "",
      location: loc ? loc.value : "",
      mode: mode ? mode.value : "",
      experience: exp ? exp.value : "",
      source: src ? src.value : "",
      sort: sort ? sort.value : "latest"
    };
  }

  function applyFiltersAndSort(jobs, filterValues) {
    var list = jobs.slice();
    var kw = filterValues.keyword;
    var loc = filterValues.location;
    var mode = filterValues.mode;
    var exp = filterValues.experience;
    var src = filterValues.source;

    if (kw) {
      list = list.filter(function (j) {
        var t = (j.title || "").toLowerCase();
        var c = (j.company || "").toLowerCase();
        return t.indexOf(kw) !== -1 || c.indexOf(kw) !== -1;
      });
    }
    if (loc) list = list.filter(function (j) { return (j.location || "") === loc; });
    if (mode) list = list.filter(function (j) { return (j.mode || "") === mode; });
    if (exp) list = list.filter(function (j) { return (j.experience || "") === exp; });
    if (src) list = list.filter(function (j) { return (j.source || "") === src; });

    list.sort(function (a, b) {
      var da = a.postedDaysAgo != null ? a.postedDaysAgo : 0;
      var db = b.postedDaysAgo != null ? b.postedDaysAgo : 0;
      return filterValues.sort === "oldest" ? da - db : db - da;
    });
    return list;
  }

  function postedLabel(days) {
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return days + " days ago";
  }

  function getJobCardHtml(job, isSaved) {
    var id = escapeHtml(job.id);
    var title = escapeHtml(job.title);
    var company = escapeHtml(job.company);
    var location = escapeHtml(job.location || "");
    var mode = escapeHtml(job.mode || "");
    var experience = escapeHtml(job.experience || "");
    var salary = escapeHtml(job.salaryRange || "");
    var source = escapeHtml(job.source || "");
    var posted = postedLabel(job.postedDaysAgo != null ? job.postedDaysAgo : 0);

    var saveBtn = isSaved
      ? '<span class="badge badge-success">Saved</span>'
      : '<button type="button" class="btn btn-secondary" data-action="save" data-job-id="' + id + '">Save</button>';

    return (
      '<div class="job-card card" data-job-id="' + id + '">' +
      '<h3 class="job-card__title">' + title + "</h3>" +
      '<p class="job-card__company">' + company + "</p>" +
      '<div class="job-card__meta">' +
      "<span>" + location + (mode ? " · " + mode : "") + "</span>" +
      "<span>" + experience + "</span>" +
      "</div>" +
      '<p class="job-card__salary">' + salary + "</p>" +
      '<div class="job-card__footer">' +
      '<span class="badge badge-neutral">' + source + "</span>" +
      "<span>" + posted + "</span>" +
      '<button type="button" class="btn btn-secondary" data-action="view" data-job-id="' + id + '">View</button>' +
      saveBtn +
      '<a href="' + escapeHtml(job.applyUrl || "#") + '" target="_blank" rel="noopener" class="btn btn-primary">Apply</a>' +
      "</div>" +
      "</div>"
    );
  }

  function getJobModalHtml(job) {
    var title = escapeHtml(job.title);
    var company = escapeHtml(job.company);
    var desc = escapeHtml(job.description || "");
    var skills = (job.skills || []).map(function (s) { return escapeHtml(s); });
    var skillsHtml = skills.map(function (s) { return "<span>" + s + "</span>"; }).join("");

    return (
      '<h2 class="modal__title">' + title + "</h2>" +
      '<p class="modal__company">' + company + "</p>" +
      '<p class="modal__section-title">Description</p>' +
      '<p class="modal__description">' + desc.replace(/\n/g, "<br>") + "</p>" +
      '<p class="modal__section-title">Skills</p>' +
      '<div class="modal__skills">' + skillsHtml + "</div>" +
      '<button type="button" class="btn btn-secondary modal__close" id="modal-close">Close</button>'
    );
  }

  function getJobsListHtml(jobs, savedIds) {
    if (!jobs.length) {
      return '<div class="no-results">No jobs match your search.</div>';
    }
    var html = '<div class="jobs-list">';
    for (var i = 0; i < jobs.length; i++) {
      html += getJobCardHtml(jobs[i], savedIds.indexOf(jobs[i].id) !== -1);
    }
    html += "</div>";
    return html;
  }

  function renderDashboard() {
    var filterValues = getFilterValues();
    var savedIds = getSavedJobIds();
    var filtered = applyFiltersAndSort(JOBS, filterValues);
    var listHtml = getJobsListHtml(filtered, savedIds);
    var container = document.getElementById("jobs-list-container");
    if (container) {
      container.innerHTML = listHtml;
    }
  }

  function openModal(job) {
    var overlay = document.getElementById("job-modal-overlay");
    var content = document.getElementById("job-modal-content");
    if (!overlay || !content) return;
    content.innerHTML = getJobModalHtml(job);
    overlay.classList.add("modal-overlay--open");
    var closeBtn = document.getElementById("modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    var overlay = document.getElementById("job-modal-overlay");
    if (overlay) overlay.classList.remove("modal-overlay--open");
  }

  function normalizePath(pathname) {
    if (!pathname || pathname === "/") return "/";
    var p = String(pathname).replace(/\\/g, "/");
    if (p === "index.html" || /\/index\.html$/i.test(p)) return "/";
    return pathname;
  }

  function getPathFromHash() {
    var hash = window.location.hash || "";
    var path = hash.slice(1).replace(/^\/?/, "") || "/";
    return path.charAt(0) === "/" ? path : "/" + path;
  }

  function setHashFromPath(path) {
    var normalized = normalizePath(path);
    var hash = normalized === "/" ? "#/" : "#" + normalized;
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  }

  var currentPath = getPathFromHash();

  function setActiveLink(path) {
    var activeKey = path && path !== "/" ? path : null;
    allLinks.forEach(function (link) {
      var target = link.getAttribute("data-route");
      link.classList.toggle("primary-nav__link--active", activeKey === target);
    });
  }

  function getSettingsFormHtml() {
    return (
      '<div class="settings-form">' +
      '<div class="form-group">' +
      '<label class="form-label" for="role-keywords">Role keywords</label>' +
      '<input type="text" id="role-keywords" class="input" placeholder="e.g. Product Manager, Engineer" aria-label="Role keywords">' +
      "</div>" +
      '<div class="form-group">' +
      '<label class="form-label" for="preferred-locations">Preferred locations</label>' +
      '<input type="text" id="preferred-locations" class="input" placeholder="e.g. San Francisco, Remote" aria-label="Preferred locations">' +
      "</div>" +
      '<div class="form-group">' +
      '<label class="form-label" for="work-mode">Mode</label>' +
      '<select id="work-mode" class="input select" aria-label="Work mode">' +
      '<option value="">Select...</option>' +
      '<option value="remote">Remote</option>' +
      '<option value="hybrid">Hybrid</option>' +
      '<option value="onsite">Onsite</option>' +
      "</select>" +
      "</div>" +
      '<div class="form-group">' +
      '<label class="form-label" for="experience-level">Experience level</label>' +
      '<select id="experience-level" class="input select" aria-label="Experience level">' +
      '<option value="">Select...</option>' +
      '<option value="entry">Entry</option>' +
      '<option value="mid">Mid</option>' +
      '<option value="senior">Senior</option>' +
      '<option value="lead">Lead</option>' +
      "</select>" +
      "</div>" +
      "</div>"
    );
  }

  function getLandingHtml() {
    return (
      '<p class="route-view__subtext">Precision-matched job discovery delivered daily at 9AM.</p>' +
      '<button type="button" class="btn btn-primary" id="cta-start-tracking">Start Tracking</button>'
    );
  }

  function render(path) {
    var normalized = normalizePath(path);
    var isLanding = normalized === "/";
    var isSettings = normalized === "/settings";
    var isDashboard = normalized === "/dashboard";
    var isSaved = normalized === "/saved";
    var isDigest = normalized === "/digest";
    var isProof = normalized === "/proof";
    var isNotFound =
      !isLanding &&
      !isSettings &&
      !isDashboard &&
      !isSaved &&
      !isDigest &&
      !isProof;

    if (pageTitleEl) {
      if (isNotFound) {
        pageTitleEl.textContent = "Page Not Found";
      } else if (isLanding) {
        pageTitleEl.textContent = "Stop Missing The Right Jobs.";
      } else if (isSettings) {
        pageTitleEl.textContent = "Settings";
      } else if (isDashboard) {
        pageTitleEl.textContent = "Dashboard";
      } else if (isSaved) {
        pageTitleEl.textContent = "Saved";
      } else if (isDigest) {
        pageTitleEl.textContent = "Digest";
      } else if (isProof) {
        pageTitleEl.textContent = "Proof";
      }
    }

    if (pageSubtitleEl) {
      if (isNotFound) {
        pageSubtitleEl.textContent =
          "The page you are looking for does not exist.";
      } else if (isLanding) {
        pageSubtitleEl.textContent = "";
      } else if (isSettings) {
        pageSubtitleEl.textContent =
          "Set your preferences. Saving will be added in a later step.";
      } else if (isDashboard) {
        pageSubtitleEl.textContent = "";
      } else if (isSaved) {
        pageSubtitleEl.textContent = "";
      } else if (isDigest) {
        pageSubtitleEl.textContent = "";
      } else if (isProof) {
        pageSubtitleEl.textContent =
          "Artifact collection and proof of work will appear here.";
      }
    }

    if (routeView) {
      routeView.classList.remove("route-view--full");
      if (isLanding) {
        routeView.innerHTML = getLandingHtml();
        var cta = document.getElementById("cta-start-tracking");
        if (cta) {
          cta.addEventListener("click", function () {
            navigate("/settings");
          });
        }
      } else if (isSettings) {
        routeView.innerHTML = getSettingsFormHtml();
      } else if (isDashboard) {
        routeView.classList.add("route-view--full");
        routeView.innerHTML = getFilterBarHtml() + '<div id="jobs-list-container"></div>';
        renderDashboard();
        attachDashboardListeners();
      } else if (isSaved) {
        routeView.classList.add("route-view--full");
        var savedIds = getSavedJobIds();
        if (!savedIds.length) {
          routeView.innerHTML =
            '<div class="empty-state">' +
            '<h2 class="heading-lg">No saved jobs</h2>' +
            '<p class="subtext">Jobs you save from the Dashboard will appear here for quick access.</p>' +
            "</div>";
        } else {
          var savedJobs = JOBS.filter(function (j) { return savedIds.indexOf(j.id) !== -1; });
          routeView.innerHTML = getJobsListHtml(savedJobs, savedIds);
        }
      } else if (isDigest) {
        routeView.innerHTML =
          '<div class="empty-state">' +
          '<h2 class="heading-lg">Daily digest</h2>' +
          '<p class="subtext">Your daily summary of matched jobs will be delivered here at 9AM. This feature will be built in a later step.</p>' +
          "</div>";
      } else if (isProof) {
        routeView.classList.remove("route-view--full");
        routeView.innerHTML =
          '<div class="route-view__block">' +
          '<h2 class="heading-lg">Artifact collection</h2>' +
          '<p class="subtext">Proof and artifacts will be collected and shown here in a future step.</p>' +
          "</div>";
      } else if (isNotFound) {
        routeView.classList.remove("route-view--full");
        routeView.innerHTML = "";
      } else {
        routeView.classList.remove("route-view--full");
      }
    }

    setActiveLink(normalized);
    currentPath = normalized;
  }

  function attachDashboardListeners() {
    var keyword = document.getElementById("filter-keyword");
    var location = document.getElementById("filter-location");
    var mode = document.getElementById("filter-mode");
    var experience = document.getElementById("filter-experience");
    var source = document.getElementById("filter-source");
    var sort = document.getElementById("filter-sort");

    function onFilterChange() {
      renderDashboard();
    }

    if (keyword) keyword.addEventListener("input", onFilterChange);
    if (location) location.addEventListener("change", onFilterChange);
    if (mode) mode.addEventListener("change", onFilterChange);
    if (experience) experience.addEventListener("change", onFilterChange);
    if (source) source.addEventListener("change", onFilterChange);
    if (sort) sort.addEventListener("change", onFilterChange);
  }

  function onRouteViewClick(e) {
    var btn = e.target.closest("[data-action]");
    if (!btn) return;
    var action = btn.getAttribute("data-action");
    var jobId = btn.getAttribute("data-job-id");
    if (!jobId) return;
    var job = JOBS.filter(function (j) { return j.id === jobId; })[0];
    if (!job) return;
    if (action === "view") {
      openModal(job);
    } else if (action === "save") {
      var ids = getSavedJobIds();
      if (ids.indexOf(jobId) === -1) {
        ids.push(jobId);
        setSavedJobIds(ids);
        renderDashboard();
      }
    }
  }

  function ensureModalInDom() {
    if (document.getElementById("job-modal-overlay")) return;
    var overlay = document.createElement("div");
    overlay.id = "job-modal-overlay";
    overlay.className = "modal-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML = '<div id="job-modal-content" class="modal"></div>';
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
    document.body.appendChild(overlay);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeModal();
    });
  }

  document.addEventListener("click", function (e) {
    if (e.target.id === "modal-close") closeModal();
  });

  function navigate(path) {
    var normalized = path.charAt(0) === "/" ? path : "/" + path;
    if (!normalized || normalized === "/") normalized = "/";
    if (normalized === currentPath) return;
    setHashFromPath(normalized);
  }

  function handleLinkClick(event) {
    var link = event.currentTarget;
    var target = link.getAttribute("data-route");
    if (!target) return;
    event.preventDefault();
    closeMobileNav();
    navigate(target);
  }

  function openMobileNav() {
    if (!nav) return;
    nav.classList.add("primary-nav--open");
    if (toggle) toggle.setAttribute("aria-expanded", "true");
    var mobileContainer = nav.querySelector(".primary-nav__links--mobile");
    if (mobileContainer && mobileContainer.hasAttribute("hidden")) {
      mobileContainer.removeAttribute("hidden");
    }
  }

  function closeMobileNav() {
    if (!nav) return;
    nav.classList.remove("primary-nav--open");
    if (toggle) toggle.setAttribute("aria-expanded", "false");
    var mobileContainer = nav.querySelector(".primary-nav__links--mobile");
    if (mobileContainer && !mobileContainer.hasAttribute("hidden")) {
      mobileContainer.setAttribute("hidden", "hidden");
    }
  }

  function toggleMobileNav() {
    if (!nav) return;
    if (nav.classList.contains("primary-nav--open")) {
      closeMobileNav();
    } else {
      openMobileNav();
    }
  }

  function initNav() {
    allLinks.forEach(function (link) {
      link.addEventListener("click", handleLinkClick);
    });
    if (toggle) {
      toggle.addEventListener("click", toggleMobileNav);
    }
    var brandLink = document.getElementById("brand-link");
    if (brandLink) {
      brandLink.addEventListener("click", function (event) {
        event.preventDefault();
        closeMobileNav();
        navigate("/");
      });
    }
  }

  function initHashChange() {
    window.addEventListener("hashchange", function () {
      var path = getPathFromHash();
      currentPath = path;
      render(path);
    });
  }

  function init() {
    ensureModalInDom();
    if (routeView) routeView.addEventListener("click", onRouteViewClick);
    initNav();
    initHashChange();
    render(currentPath);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
