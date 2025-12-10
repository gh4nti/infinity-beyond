// Initialize Lucide Icons
document.addEventListener("DOMContentLoaded", () => {
	if (window.lucide) {
		window.lucide.createIcons();
	}
});

// Helper to refresh icons dynamically (used by your mobile menu)
const refreshIcons = () => {
	if (window.lucide) {
		window.lucide.createIcons();
	}
};

// Navbar Scroll Effect (Performance Optimized)
const navbar = document.getElementById("navbar");
if (navbar) {
	let ticking = false;
	window.addEventListener("scroll", () => {
		if (!ticking) {
			window.requestAnimationFrame(() => {
				if (window.scrollY > 20) {
					// Trigger slightly earlier for smoother feel
					navbar.classList.add("shadow-md");
					navbar.classList.replace("h-20", "h-16");
					navbar.classList.replace("bg-white/90", "bg-white/95"); // Slightly more opaque on scroll
				} else {
					navbar.classList.remove("shadow-md");
					navbar.classList.replace("h-16", "h-20");
					navbar.classList.replace("bg-white/95", "bg-white/90");
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
			document.body.style.overflow = "hidden"; // Prevent background scrolling
		} else {
			mobileMenu.classList.add("hidden");
			mobileBtn.setAttribute("aria-expanded", "false");
			document.body.style.overflow = ""; // Restore scrolling
		}

		// Swap Icon
		const icon = mobileBtn.querySelector("[data-lucide]");
		if (icon && window.lucide) {
			icon.setAttribute("data-lucide", shouldShow ? "x" : "menu");
			window.lucide.replace();
		}
	};

	mobileBtn.addEventListener("click", () => toggleMenu());

	// Close on link click
	mobileMenu.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => toggleMenu(false));
	});

	// Close on resize (if user switches to desktop view while menu is open)
	window.addEventListener("resize", () => {
		if (window.innerWidth >= 768) toggleMenu(false);
	});
}
