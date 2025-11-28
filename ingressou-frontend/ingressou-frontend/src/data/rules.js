// src/data/rules.js
export const rules = {
  default: [
    "É proibido entrar com objetos cortantes, perfurantes ou contundentes.",
    "Somente camisa do time da casa ou sem escudo (camisa de time rival pode impedir a entrada).",
    "Documento oficial com foto é obrigatório.",
    "Garrafas, latas, fogos e bebidas alcoólicas não são permitidos."
  ],
  stadiums: {
    "neo-quimica-arena": [
      "Bolsas/mochilas acima de 10L não são permitidas.",
      "Bandeiras sem mastro são liberadas; com mastro apenas com autorização do clube."
    ],
    "maracana": [
      "Guarda-chuva não é permitido.",
      "Instrumentos musicais somente com credenciamento."
    ]
  }
};

// helper para unificar por estádio
export const slugify = (str = "") =>
  str
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
