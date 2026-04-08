export function calculateLoyaltyTier(loyaltyPoint: number): 'NORMAL' | 'SILVER' | 'GOLD' | 'PLATINUM' {
  if (loyaltyPoint >= 1500) return 'PLATINUM';
  if (loyaltyPoint >= 1000) return 'GOLD';
  if (loyaltyPoint >= 100) return 'SILVER';
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
