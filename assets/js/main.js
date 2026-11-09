/* Café Jardim — site behaviour. Business name: ONE swappable constant. */
const BUSINESS_NAME = "Café Jardim";
const BUSINESS_HANDLE = "@cafejardim.recife";
const BUSINESS_PHONE = "(81) 99055-7097";

document.documentElement.classList.add("js");

/* Keep every business-name occurrence in sync with the single constant. */
document.querySelectorAll("[data-biz]").forEach((el) => {
  el.textContent = BUSINESS_NAME;
});

/* Reveal-on-scroll: elements are visible by default; JS only enhances. */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("in"));
}

/* "Hoje" marker on the content calendar (Seg=1 … Dom=0 in JS getDay). */
const todayCard = document.querySelector('[data-weekday="' + new Date().getDay() + '"]');
if (todayCard) {
  todayCard.classList.add("day-card--today");
  const marker = document.createElement("span");
  marker.className = "today-marker";
  marker.textContent = "Hoje";
  todayCard.prepend(marker);
}

/* Gallery lightbox */
const lightbox = document.getElementById("lightbox");
if (lightbox) {
  const lbImg = lightbox.querySelector("img");
  const lbCap = lightbox.querySelector("figcaption");
  const tiles = Array.from(document.querySelectorAll(".bento-item"));
  let current = 0;

  function show(i) {
    current = (i + tiles.length) % tiles.length;
    const tile = tiles[current];
    const img = tile.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.innerHTML = tile.querySelector(".bento-cap").innerHTML;
    const tag = document.createElement("span");
    tag.className = "ai-tag";
    tag.textContent = "Imagem gerada por IA — amostra";
    lbCap.prepend(tag);
  }
  function open(i) { show(i); lightbox.setAttribute("open", ""); document.body.style.overflow = "hidden"; lightbox.querySelector(".lightbox-close").focus(); }
  function close() { lightbox.removeAttribute("open"); document.body.style.overflow = ""; }

  tiles.forEach((tile, i) => tile.addEventListener("click", () => open(i)));
  lightbox.querySelector(".lightbox-close").addEventListener("click", close);
  lightbox.querySelector(".lightbox-prev").addEventListener("click", (e) => { e.stopPropagation(); show(current - 1); });
  lightbox.querySelector(".lightbox-next").addEventListener("click", (e) => { e.stopPropagation(); show(current + 1); });
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.hasAttribute("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
}

/* Contact form: specific error message per field, LGPD consent required. */
const form = document.getElementById("contact-form");
if (form) {
  const fields = {
    nome: { el: form.querySelector("#nome"), msg: "Informe seu nome completo para podermos responder." },
    contato: { el: form.querySelector("#contato"), msg: "Informe um e-mail ou telefone válido para contato." },
    assunto: { el: form.querySelector("#assunto"), msg: "Escolha um assunto para a sua mensagem." },
    mensagem: { el: form.querySelector("#mensagem"), msg: "Escreva sua mensagem — conte o que você precisa." },
    consentimento: { el: form.querySelector("#consentimento"), msg: "É preciso concordar com o uso dos seus dados para respondermos, conforme a LGPD." }
  };
  function validateOne(key) {
    const f = fields[key];
    const err = form.querySelector('[data-error-for="' + key + '"]');
    let ok = true;
    if (key === "consentimento") ok = f.el.checked;
    else if (key === "assunto") ok = f.el.value !== "";
    else if (key === "contato") ok = f.el.value.trim().length >= 6;
    else ok = f.el.value.trim().length > 0;
    f.el.setAttribute("aria-invalid", ok ? "false" : "true");
    if (err) err.classList.toggle("show", !ok);
    return ok;
  }
  Object.keys(fields).forEach((key) => {
    const el = fields[key].el;
    el.addEventListener("blur", () => validateOne(key));
    el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true") validateOne(key); });
    el.addEventListener("change", () => { if (el.getAttribute("aria-invalid") === "true") validateOne(key); });
  });
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const results = Object.keys(fields).map(validateOne);
    if (results.every(Boolean)) {
      form.hidden = true;
      document.getElementById("form-success").classList.add("show");
      document.getElementById("form-success").focus();
    } else {
      const firstBad = Object.keys(fields).find((k) => fields[k].el.getAttribute("aria-invalid") === "true");
      if (firstBad) fields[firstBad].el.focus();
    }
  });
}
