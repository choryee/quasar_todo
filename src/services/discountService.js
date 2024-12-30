function calculateDiscountedFeeWithPeriod(originalFee, startDate, endDate, discountRate) {
  const today = new Date();
  const discountPeriodStart = new Date(startDate);
  const discountPeriodEnd = new Date(endDate);

  if (today >= discountPeriodStart && today <= discountPeriodEnd) {
    return originalFee * (1 - discountRate / 100);
  }

  return originalFee;
}

function TenPercentDiscount(){

}

export {
  calculateDiscountedFeeWithPeriod,
  TenPercentDiscount,
}
