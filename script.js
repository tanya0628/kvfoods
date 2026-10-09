const $ = (s, p=document) => p.querySelector(s);
const $$ = (s, p=document) => [...p.querySelectorAll(s)];

window.addEventListener("load", () => {
  setTimeout(() => $(".preloader")?.classList.add("hide"), 500);
});

const header = $(".site-header");
const backTop = $("#backTop");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 35);
  backTop.classList.toggle("show", window.scrollY > 600);
}, {passive:true});

backTop.addEventListener("click", () => window.scrollTo({top:0, behavior:"smooth"}));

const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");
menuBtn.addEventListener("click", () => mobileMenu.classList.toggle("open"));
$$(".mobile-menu a").forEach(a => a.addEventListener("click", () => mobileMenu.classList.remove("open")));

const searchToggle = $("#searchToggle"), searchPanel = $("#searchPanel"), searchInput = $("#searchInput");
searchToggle.addEventListener("click", () => {
  searchPanel.classList.toggle("open");
  if(searchPanel.classList.contains("open")) setTimeout(()=>searchInput.focus(), 250);
});
$("#searchClose").addEventListener("click", () => searchPanel.classList.remove("open"));

const products = $$(".product-card");
function doSearch(value){
  const q = value.trim().toLowerCase();
  const results = $("#searchResults");
  if(!q){ results.innerHTML = ""; products.forEach(p=>p.style.display=""); return; }
  const matches = products.filter(p => (p.dataset.search || "").includes(q) || p.innerText.toLowerCase().includes(q));
  products.forEach(p => p.style.display = matches.includes(p) ? "" : "none");
  results.innerHTML = matches.length
    ? matches.slice(0,5).map(p => `<div class="search-result"><b>↗</b>${p.querySelector("h3").innerText.replace(/\n/g," ")}</div>`).join("")
    : `<div class="search-empty">No products matched “${value}”. Try atta, wheat, dal or snacks.</div>`;
}
searchInput.addEventListener("input", e => doSearch(e.target.value));

$$(".filter").forEach(btn => btn.addEventListener("click", () => {
  $$(".filter").forEach(b=>b.classList.remove("active")); btn.classList.add("active");
  const filter = btn.dataset.filter;
  products.forEach(p => {
    p.style.display = filter === "all" || p.dataset.category === filter ? "" : "none";
  });
  $("#emptyState").classList.toggle("show", !products.some(p=>p.style.display !== "none"));
  searchInput.value = "";
  $("#searchResults").innerHTML = "";
}));

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ entry.target.classList.add("visible"); observer.unobserve(entry.target); }
  });
}, {threshold:.12});
$$(".reveal").forEach(el=>observer.observe(el));

const counters = $$(".counter");
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    const el = entry.target, target = Number(el.dataset.target), duration = 1300;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now-start)/duration,1);
      const eased = 1-Math.pow(1-progress,3);
      el.textContent = Math.floor(target*eased).toLocaleString("en-IN");
      if(progress<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
},{threshold:.5});
counters.forEach(c=>counterObserver.observe(c));

const modal = $("#productModal");
const modalTitle = $("#modalTitle"), modalText = $("#modalText");
const productDescriptions = {
  "Gluten Free Multigrain Atta":"A premium multigrain atta presented in the supplied Shahi Pariwar material as wheat, maize & soya free. Contact the team for current pack sizes, availability and commercial details.",
  "Rajasthani Wheat":"Shahi Gharana Rajasthani Wheat is presented as graded wheat selected for soft dough and tasty chapatti. Varieties shown in the supplied material include Raj 1482, Raj 3077, C-306 and Lok-1.",
  "Chana Dal & Besan":"Chana Dal and Besan are highlighted as part of the brand's everyday food range. Contact the team for product specifications and bulk-order information.",
  "Traditional Snacks":"The supplied brand story highlights Namkeen, Papri, Mathri, Kachori, Samosa and Frozen Foods among its traditional favourites.",
  "Chakki Atta & Multigrain Atta":"The brand story includes Chakki Atta and Multigrain Atta within its everyday staples collection."
};
$$(".product-link").forEach(link => link.addEventListener("click", e => {
  e.preventDefault();
  const name = link.dataset.product;
  modalTitle.textContent = name;
  modalText.textContent = productDescriptions[name] || "Please contact Shahi Pariwar for current product details.";
  modal.classList.add("open"); modal.setAttribute("aria-hidden","false");
}));
function closeModal(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); }
$("#modalClose").addEventListener("click", closeModal);
$(".modal-backdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", e => { if(e.key==="Escape") closeModal(); });

$("#contactForm").addEventListener("submit", e => {
  e.preventDefault();
  $("#formSuccess").classList.add("show");
  e.target.reset();
});

$$('a[href^="#"]').forEach(a => a.addEventListener("click", e => {
  const target = $(a.getAttribute("href"));
  if(target){ e.preventDefault(); target.scrollIntoView({behavior:"smooth", block:"start"}); }
}));

const navLinks = $$(".desktop-nav a");
const sections = ["home","about","products","quality","contact"].map(id=>$("#"+id));
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(a=>a.classList.toggle("active", a.getAttribute("href")==="#"+entry.target.id));
    }
  });
},{rootMargin:"-40% 0px -50% 0px"});
sections.forEach(s=>navObserver.observe(s));
