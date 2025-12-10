// Initialize Lucide Icons & Theme
document.addEventListener("DOMContentLoaded", () => {
	// 1. Initialize Theme
	applyTheme(getStoredTheme());

	// 2. Initialize Icons
	if (window.lucide) {
		window.lucide.createIcons();
	}
});

// Helper to refresh icons dynamically
const refreshIcons = () => {
	if (window.lucide) {
		window.lucide.createIcons();
	}
};

// --- 3-STATE THEME LOGIC ---
// Possible states: 'light', 'dark', 'system'
const themeToggleBtn = document.getElementById("theme-toggle");
const mobileThemeToggleBtn = document.getElementById("mobile-theme-toggle");

function getStoredTheme() {
	if ("theme" in localStorage) {
		return localStorage.theme; // returns 'light' or 'dark'
	}
	return "system"; // Default if nothing saved
}

function applyTheme(state) {
	const html = document.documentElement;

	// 1. Handle Visual Class (Dark vs Light)
	if (state === "dark") {
		html.classList.add("dark");
		localStorage.theme = "dark";
	} else if (state === "light") {
		html.classList.remove("dark");
		localStorage.theme = "light";
	} else {
		// System Mode
		localStorage.removeItem("theme");
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			html.classList.add("dark");
		} else {
			html.classList.remove("dark");
		}
	}

	// 2. Update Buttons (Icon Feedback)
	updateThemeIcons(state);
}

function updateThemeIcons(currentState) {
	const iconMap = {
		light: "sun",
		dark: "moon",
		system: "monitor", // Requires Lucide 'monitor' icon
	};

	[themeToggleBtn, mobileThemeToggleBtn].forEach((btn) => {
		if (btn) {
			const icon = btn.querySelector("[data-lucide]");
			if (icon) {
				icon.setAttribute("data-lucide", iconMap[currentState]);
			}
		}
	});
	refreshIcons();
}

function cycleTheme() {
	const current = getStoredTheme();
	let nextState = "system";

	// Cycle: System -> Light -> Dark -> System
	if (current === "system") nextState = "light";
	else if (current === "light") nextState = "dark";
	else if (current === "dark") nextState = "system";

	applyTheme(nextState);
}

// Add Click Listeners
if (themeToggleBtn) themeToggleBtn.addEventListener("click", cycleTheme);
if (mobileThemeToggleBtn)
	mobileThemeToggleBtn.addEventListener("click", cycleTheme);

// Add System Change Listener (Real-time update)
window
	.matchMedia("(prefers-color-scheme: dark)")
	.addEventListener("change", (e) => {
		if (!("theme" in localStorage)) {
			// Only update automatically if user is in 'System' mode
			if (e.matches) document.documentElement.classList.add("dark");
			else document.documentElement.classList.remove("dark");
		}
	});

// --- END THEME LOGIC ---

// Navbar Scroll Effect
const navbar = document.getElementById("navbar");
if (navbar) {
	let ticking = false;
	window.addEventListener("scroll", () => {
		if (!ticking) {
			window.requestAnimationFrame(() => {
				if (window.scrollY > 20) {
					navbar.classList.add("shadow-md");
					navbar.classList.replace("h-20", "h-16");
					navbar.classList.remove(
						"bg-white/90",
						"dark:bg-stone-950/90"
					);
					navbar.classList.add("bg-white/95", "dark:bg-stone-950/95");
				} else {
					navbar.classList.remove("shadow-md");
					navbar.classList.replace("h-16", "h-20");
					navbar.classList.remove(
						"bg-white/95",
						"dark:bg-stone-950/95"
					);
					navbar.classList.add("bg-white/90", "dark:bg-stone-950/90");
				}
				ticking = false;
			});
			ticking = true;
		}
	});
}

// Mobile Menu Handling
const mobileBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (mobileBtn && mobileMenu) {
	const toggleMenu = (forceState = null) => {
		const isHidden = mobileMenu.classList.contains("hidden");
		const shouldShow = forceState !== null ? forceState : isHidden;

		if (shouldShow) {
			mobileMenu.classList.remove("hidden");
			mobileBtn.setAttribute("aria-expanded", "true");
			document.body.style.overflow = "hidden";
		} else {
			mobileMenu.classList.add("hidden");
			mobileBtn.setAttribute("aria-expanded", "false");
			document.body.style.overflow = "";
		}

		const icon = mobileBtn.querySelector("[data-lucide]");
		// Only toggle menu icon if it's not the theme button (safety check)
		if (
			icon &&
			icon.getAttribute("data-lucide") !== "sun" &&
			icon.getAttribute("data-lucide") !== "moon"
		) {
			icon.setAttribute("data-lucide", shouldShow ? "x" : "menu");
			refreshIcons();
		}
	};

	mobileBtn.addEventListener("click", () => toggleMenu());
	mobileMenu.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => toggleMenu(false));
	});
	window.addEventListener("resize", () => {
		if (window.innerWidth >= 768) toggleMenu(false);
	});
}
