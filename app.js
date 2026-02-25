// Job Notification Tracker — Route shell and navigation
// Premium app skeleton. No data, no backend, no business logic.

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
        routeView.innerHTML =
          '<div class="empty-state">' +
          '<h2 class="heading-lg">No jobs yet</h2>' +
          '<p class="subtext">In the next step, you will load a realistic dataset.</p>' +
          "</div>";
      } else if (isSaved) {
        routeView.innerHTML =
          '<div class="empty-state">' +
          '<h2 class="heading-lg">No saved jobs</h2>' +
          '<p class="subtext">Jobs you save will appear here for quick access.</p>' +
          "</div>";
      } else if (isDigest) {
        routeView.innerHTML =
          '<div class="empty-state">' +
          '<h2 class="heading-lg">Daily digest</h2>' +
          '<p class="subtext">Your daily summary of matched jobs will be delivered here at 9AM. This feature will be built in a later step.</p>' +
          "</div>";
      } else if (isProof) {
        routeView.innerHTML =
          '<div class="route-view__block">' +
          '<h2 class="heading-lg">Artifact collection</h2>' +
          '<p class="subtext">Proof and artifacts will be collected and shown here in a future step.</p>' +
          "</div>";
      } else if (isNotFound) {
        routeView.innerHTML = "";
      }
    }

    setActiveLink(normalized);
    currentPath = normalized;
  }

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
