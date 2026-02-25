// Job Notification App — Route Shell and Navigation
// Client-side router for placeholder pages only. No data or business logic.

(function () {
  var routes = {
    "/": { pageName: "Dashboard" },
    "/dashboard": { pageName: "Dashboard" },
    "/saved": { pageName: "Saved" },
    "/digest": { pageName: "Digest" },
    "/settings": { pageName: "Settings" },
    "/proof": { pageName: "Proof" }
  };

  var notFound = {
    pageName: "Page Not Found",
    message: "The page you are looking for does not exist."
  };

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
    if (!pathname) {
      return "/";
    }
    return pathname;
  }

  var currentPath = normalizePath(window.location.pathname || "/");

  function setActiveLink(path) {
    var activeKey = null;
    if (path) {
      activeKey = path === "/" ? "/dashboard" : path;
    }

    allLinks.forEach(function (link) {
      var target = link.getAttribute("data-route");
      if (activeKey && target === activeKey) {
        link.classList.add("primary-nav__link--active");
      } else {
        link.classList.remove("primary-nav__link--active");
      }
    });
  }

  function render(path) {
    var normalized = normalizePath(path);
    var config = routes[normalized];
    var isNotFound = !config;

    var heading = isNotFound ? notFound.pageName : config.pageName;
    var subtext = isNotFound
      ? notFound.message
      : "This section will be built in the next step.";

    if (pageTitleEl) {
      pageTitleEl.textContent = heading;
    }
    if (pageSubtitleEl) {
      pageSubtitleEl.textContent = subtext;
    }

    if (routeView) {
      routeView.innerHTML = "";
    }

    setActiveLink(isNotFound ? null : normalized);
    currentPath = normalized;
  }

  function navigate(path, options) {
    var normalized = normalizePath(path);
    if (normalized === currentPath) {
      return;
    }

    var method = options && options.replace ? "replaceState" : "pushState";
    if (window.history && window.history[method]) {
      window.history[method]({ path: normalized }, "", normalized);
    }

    render(normalized);
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
    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
    }
    var mobileContainer = nav.querySelector(".primary-nav__links--mobile");
    if (mobileContainer && mobileContainer.hasAttribute("hidden")) {
      mobileContainer.removeAttribute("hidden");
    }
  }

  function closeMobileNav() {
    if (!nav) return;
    nav.classList.remove("primary-nav--open");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
    }
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
      toggle.addEventListener("click", function () {
        toggleMobileNav();
      });
    }
  }

  function initPopState() {
    window.addEventListener("popstate", function (event) {
      var path =
        event.state && event.state.path
          ? event.state.path
          : window.location.pathname;
      render(path);
    });
  }

  function init() {
    initNav();
    initPopState();
    // Initial render without causing a reload
    render(currentPath);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

