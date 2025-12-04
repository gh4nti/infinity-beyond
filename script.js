// Initialize Lucide Icons
lucide.createIcons();

// Navbar Scroll Effect (Toggles Tailwind Classes)
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
	if (window.scrollY > 50) {
		navbar.classList.add("shadow-md");
		navbar.classList.replace("h-20", "h-16");
	} else {
		navbar.classList.remove("shadow-md");
		navbar.classList.replace("h-16", "h-20");
	}
});

// Mobile Menu Toggle (Toggles Tailwind Class)
const btn = document.getElementById("mobile-menu-btn");
const menu = document.getElementById("mobile-menu");

btn.addEventListener("click", () => {
	menu.classList.toggle("hidden");
});

// Close Mobile Menu on Link Click
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", () => {
		menu.classList.add("hidden");
	});
});
