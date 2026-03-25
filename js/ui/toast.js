const CONTAINER_ID = "toast-container";

function ensureContainer() {
  let el = document.getElementById(CONTAINER_ID);
  if (el) return el;
  el = document.createElement("div");
  el.id = CONTAINER_ID;
  el.className = "toast-container";
  document.body.appendChild(el);
  return el;
}

export function showToast({
  title = "",
  message = "",
  tone = "default", // default | success | error | warning
  duration = 3500
} = {}) {
  const container = ensureContainer();

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.dataset.tone = tone;

  // Acessibilidade:
  // - status: mensagens informativas
  // - alert: erros e bloqueios críticos
  toast.setAttribute("role", tone === "error" ? "alert" : "status");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    ${title ? `<div class="toast__title">${title}</div>` : ""}
    ${message ? `<div class="toast__message">${message}</div>` : ""}
  `;

  container.appendChild(toast);

  // Evita layout thrashing e assegura transição fluida
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add("is-visible");
    });
  });

  const t = setTimeout(() => {
    toast.classList.remove("is-visible");
    setTimeout(() => toast.remove(), 250);
  }, Math.max(1200, duration));

  // Permite fechar via click
  toast.addEventListener("click", () => {
    clearTimeout(t);
    toast.classList.remove("is-visible");
    setTimeout(() => toast.remove(), 250);
  });
}
