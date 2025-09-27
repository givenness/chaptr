export function formatCurrency(amount: number, token: "WLD" | "USDC" = "WLD"): string {
  if (token === "USDC") {
    return `$${amount.toFixed(2)}`
  }
  // For WLD, show amount without dollar sign
  return `${amount} WLD`
}

export function formatCurrencyShort(amount: number, token: "WLD" | "USDC" = "WLD"): string {
  if (token === "USDC") {
    return `$${amount}`
  }
  // For WLD, show amount without dollar sign
  return `${amount} WLD`
}
