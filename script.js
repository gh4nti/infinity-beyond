// script.js — improved version

// Safe Lucide init
if (window.lucide && typeof window.lucide.createIcons === "function") {
	try {
		// createIcons is fine, but replace() is more common if icons already exist in DOM
		if (typeof window.lucide.replace === "function")
			window.lucide.replace();
		else window.lucide.createIcons();
	} catch (e) {
		/* fail silently — icons won't break page */
		console.warn("Lucide init failed", e);
	}
}

// Helper: guard getElement
const $ = (id) => document.getElementById(id);

// Navbar scroll effect (debounced)
const navbar = $("navbar");
if (navbar) {
	let lastY = window.scrollY;
	let ticking = false;

	const updateNavbar = () => {
		const y = window.scrollY;
		if (y > 50) {
			navbar.classList.add("shadow-md");
			navbar.classList.replace("h-20", "h-16");
		} else {
			navbar.classList.remove("shadow-md");
			navbar.classList.replace("h-16", "h-20");
		}
		ticking = false;
		lastY = y;
	};

	window.addEventListener("scroll", () => {
		if (!ticking) {
			window.requestAnimationFrame(updateNavbar);
			ticking = true;
		}
	});
}

// Mobile menu toggle with ARIA + keyboard support
const btn = $("mobile-menu-btn");
const menu = $("mobile-menu");

if (btn && menu) {
	// Accessibility attrs
	btn.setAttribute("aria-controls", "mobile-menu");
	btn.setAttribute("aria-expanded", "false");
	menu.setAttribute("aria-hidden", "true");

	const setOpen = (open) => {
		if (open) {
			menu.classList.remove("hidden");
			btn.setAttribute("aria-expanded", "true");
			menu.setAttribute("aria-hidden", "false");
		} else {
			menu.classList.add("hidden");
			btn.setAttribute("aria-expanded", "false");
			menu.setAttribute("aria-hidden", "true");
		}

		// swap lucide icon if available
		const icon = btn.querySelector("[data-lucide], i");
		if (icon) {
			const name = open ? "x" : "menu";
			try {
				if (icon.tagName.toLowerCase() === "i")
					icon.setAttribute("data-lucide", name);
				else icon.setAttribute("data-lucide", name);
				if (
					window.lucide &&
					typeof window.lucide.replace === "function"
				)
					window.lucide.replace();
			} catch (e) {
				/* no-op */
			}
		}
	};

	btn.addEventListener("click", () =>
		setOpen(menu.classList.contains("hidden"))
	);
	// allow Enter / Space to toggle when focused
	btn.addEventListener("keydown", (ev) => {
		if (ev.key === "Enter" || ev.key === " ") {
			ev.preventDefault();
			setOpen(menu.classList.contains("hidden"));
		}
	});

	// Close mobile menu when clicking outside it (optional but nice)
	document.addEventListener("click", (e) => {
		if (
			!menu.classList.contains("hidden") &&
			!menu.contains(e.target) &&
			!btn.contains(e.target)
		) {
			setOpen(false);
		}
	});
}

// Close mobile menu when internal anchor is clicked (only if menu exists & visible)
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", (e) => {
		// if link is same-page and menu is open, close it
		if (menu && !menu.classList.contains("hidden")) {
			// small delay to allow the browser to start scrolling
			setTimeout(() => {
				if (menu) {
					menu.classList.add("hidden");
					btn && btn.setAttribute("aria-expanded", "false");
					menu.setAttribute("aria-hidden", "true");
					// reset icon
					const icon = btn && btn.querySelector("[data-lucide], i");
					if (icon) {
						try {
							icon.setAttribute("data-lucide", "menu");
							if (
								window.lucide &&
								typeof window.lucide.replace === "function"
							)
								window.lucide.replace();
						} catch (err) {}
					}
				}
			}, 50);
		}
	});
});

// Optional: close mobile menu on Escape
document.addEventListener("keydown", (e) => {
	if (e.key === "Escape" && menu && !menu.classList.contains("hidden")) {
		menu.classList.add("hidden");
		btn && btn.setAttribute("aria-expanded", "false");
		menu.setAttribute("aria-hidden", "true");
		if (window.lucide && typeof window.lucide.replace === "function")
			window.lucide.replace();
	}
});
