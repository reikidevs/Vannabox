// Enhanced Theme Toggle Functionality
(function () {
  "use strict";

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeToggle);
  } else {
    initThemeToggle();
  }

  function initThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");
    const themeToggleMobile = document.getElementById("theme-toggle-mobile");
    const html = document.documentElement;

    console.log("Theme toggle initialized", {
      desktop: !!themeToggle,
      mobile: !!themeToggleMobile,
    });

    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem("theme") || "light";
    console.log("Current theme:", currentTheme);

    // Apply initial theme
    if (currentTheme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    function toggleTheme() {
      console.log("Toggle theme clicked");
      html.classList.toggle("dark");
      const newTheme = html.classList.contains("dark") ? "dark" : "light";
      localStorage.setItem("theme", newTheme);
      console.log("New theme:", newTheme);

      // Update icons visibility immediately
      updateThemeIcons();

      // Add smooth transition effect
      document.body.style.transition =
        "background-color 0.3s ease, color 0.3s ease";
      setTimeout(() => {
        document.body.style.transition = "";
      }, 300);
    }

    function updateThemeIcons() {
      const isDark = html.classList.contains("dark");
      console.log("Updating theme icons, isDark:", isDark);

      // Update desktop toggle icons
      if (themeToggle) {
        const desktopSunIcon = themeToggle.querySelector(".fa-sun");
        const desktopMoonIcon = themeToggle.querySelector(".fa-moon");

        console.log("Desktop icons found:", {
          sun: !!desktopSunIcon,
          moon: !!desktopMoonIcon,
        });

        if (desktopSunIcon && desktopMoonIcon) {
          if (isDark) {
            desktopSunIcon.classList.add("hidden");
            desktopMoonIcon.classList.remove("hidden");
            themeToggle.setAttribute("title", "Switch to Light Mode");
          } else {
            desktopSunIcon.classList.remove("hidden");
            desktopMoonIcon.classList.add("hidden");
            themeToggle.setAttribute("title", "Switch to Dark Mode");
          }
        }
      }

      // Update mobile toggle icons
      if (themeToggleMobile) {
        const mobileSunIcon = themeToggleMobile.querySelector(".fa-sun");
        const mobileMoonIcon = themeToggleMobile.querySelector(".fa-moon");

        console.log("Mobile icons found:", {
          sun: !!mobileSunIcon,
          moon: !!mobileMoonIcon,
        });

        if (mobileSunIcon && mobileMoonIcon) {
          if (isDark) {
            mobileSunIcon.classList.add("hidden");
            mobileMoonIcon.classList.remove("hidden");
            themeToggleMobile.setAttribute("title", "Switch to Light Mode");
          } else {
            mobileSunIcon.classList.remove("hidden");
            mobileMoonIcon.classList.add("hidden");
            themeToggleMobile.setAttribute("title", "Switch to Dark Mode");
          }
        }
      }
    }

    // Initialize icons on page load
    setTimeout(updateThemeIcons, 100);

    // Add event listeners
    if (themeToggle) {
      themeToggle.addEventListener("click", function (e) {
        e.preventDefault();
        toggleTheme();
      });
      console.log("Desktop theme toggle event listener added");
    }

    if (themeToggleMobile) {
      themeToggleMobile.addEventListener("click", function (e) {
        e.preventDefault();
        toggleTheme();
      });
      console.log("Mobile theme toggle event listener added");
    }

    // Listen for system theme changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", function (e) {
        if (!localStorage.getItem("theme")) {
          if (e.matches) {
            html.classList.add("dark");
          } else {
            html.classList.remove("dark");
          }
          updateThemeIcons();
        }
      });
    }
  }
})();
