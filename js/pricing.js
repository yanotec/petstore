// Regra de precificação de serviço — ver design_handoff_pethub/docs/05-regras-de-negocio.md
export function quoteService(service, { size, animals, days, sendBy, returnBy }) {
  const sizeAdd = size ? service.sizeAdd[size] : 0;
  const perAnimal = service.basePrice + sizeAdd;
  const units = service.chargeType === "POR_DIARIA" ? Math.max(days, 1) : 1;
  const subtotal = perAnimal * Math.max(animals, 1) * units;
  const freight =
    (sendBy === "LOJA" ? service.tripFee : 0) + (returnBy === "LOJA" ? service.tripFee : 0);

  return { perAnimal, units, subtotal, freight, total: subtotal + freight };
}
