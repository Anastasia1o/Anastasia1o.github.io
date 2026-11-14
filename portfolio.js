const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Появление блоков при прокрутке; соседние блоки выходят с небольшим шагом
const reveals = document.querySelectorAll("[data-reveal]");
const showAll = () => reveals.forEach((el) => el.classList.add("in"));
if (!calm && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    let step = 0;
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      const delay = Math.min(step, 3) * 90;
      step += 1;
      setTimeout(() => el.classList.add("in"), delay);
      observer.unobserve(el);
    }
  }, { rootMargin: "0px 0px -6% 0px" });
  reveals.forEach((el) => observer.observe(el));
  window.addEventListener("beforeprint", showAll);
} else {
  showAll();
}

// Фильтр кейсов по направлениям
const filter = document.querySelector("[data-filter]");
if (filter) {
  const buttons = [...filter.querySelectorAll("button")];
  const cards = [...document.querySelectorAll("[data-tags]")];
  const count = filter.querySelector("[data-count]");
  const plural = (n) => {
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return "кейс";
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return "кейса";
    return "кейсов";
  };
  const apply = (tag) => {
    let shown = 0;
    cards.forEach((card) => {
      const match = tag === "all" || card.dataset.tags.split(" ").includes(tag);
      card.hidden = !match;
      if (match) {
        shown += 1;
        card.classList.add("in");
      }
    });
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.tag === tag)));
    if (count) count.textContent = `${shown} ${plural(shown)}`;
  };
  buttons.forEach((button) => button.addEventListener("click", () => apply(button.dataset.tag)));
  apply("all");
  // при первом показе карточки появляются сами по прокрутке
  cards.forEach((card) => card.classList.remove("in"));
  if (calm || !("IntersectionObserver" in window)) showAll();
}

// Обложка-веер лежит над ссылкой карточки, чтобы экраны реагировали на наведение;
// клик по обложке по-прежнему открывает кейс
document.querySelectorAll(".cover-stack, .card-cover.cover-scene").forEach((cover) => {
  const link = cover.closest(".card")?.querySelector("h3 a");
  if (link) cover.addEventListener("click", () => link.click());
});

// Нижняя панель связи уезжает, когда виден блок контактов
const dock = document.querySelector(".dock");
const contact = document.querySelector("#contact");
if (dock && contact) {
  const place = () => dock.classList.toggle("away", contact.getBoundingClientRect().top < window.innerHeight - 80);
  window.addEventListener("scroll", place, { passive: true });
  window.addEventListener("resize", place);
  place();
}
