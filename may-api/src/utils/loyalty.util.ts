export function calculateLoyaltyTier(
  totalSpent: number,
): 'NORMAL' | 'SILVER' | 'GOLD' | 'PLATINUM' {
  if (totalSpent >= 3500000) return 'PLATINUM';
  if (totalSpent >= 2000000) return 'GOLD';
  if (totalSpent >= 100000) return 'SILVER';
  return 'NORMAL';
}

export function calculateEarnedPoints(total: number): number {
  // 10% giá hóa đơn thành điểm
  return Math.floor(total * 0.1);
}

export function getMonthlyResetDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0);
}
