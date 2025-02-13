export const separateCouponsTemplate = (
  formData,
  selectedCoupons,
  formattedDate
) => `
  <div class="print-container">
    ${Array.from({ length: selectedCoupons })
      .map(
        (_, index) => `
      <div class="prasada-coupon">
        <div class="prasada-coupon__header">
          <div class="prasada-coupon__header-content">
            <img src="https://kamarpukur.rkmm.org/Logo%201-2.png" alt="Logo" class="prasada-coupon__logo" />
            <h2 class="prasada-coupon__title">
              Ramakrishna Math & Ramakrishna Mission, Kamarpukur
            </h2>
          </div>
        </div>
        
        <h1 class="prasada-coupon__main-title">PRASADA COUPON</h1>
        
        <div class="prasada-coupon__details">
          <div class="prasada-coupon__row">
            <span class="prasada-coupon__label">Date:</span>
            <span class="prasada-coupon__value">${formattedDate}</span>
          </div>
          <div class="prasada-coupon__row">
            <span class="prasada-coupon__label">Name:</span>
            <span class="prasada-coupon__value">${formData.name}</span>
          </div>
          <div class="prasada-coupon__row">
            <span class="prasada-coupon__label">No. Of Devotees:</span>
          </div>
          <div class="prasada-coupon__number">
            1
          </div>
          <div class="prasada-coupon__page-number">
            ${index + 1}/${selectedCoupons}
          </div>
        </div>
      </div>
    `
      )
      .join("")}
  </div>
  ${printStyles}
`;

export const combinedCouponTemplate = (
  formData,
  selectedCoupons,
  formattedDate
) => `
  <div class="print-container">
    <div class="prasada-coupon">
      <div class="prasada-coupon__header">
        <div class="prasada-coupon__header-content">
          <img src="https://kamarpukur.rkmm.org/Logo%201-2.png" alt="Logo" class="prasada-coupon__logo" />
          <h2 class="prasada-coupon__title">
            Ramakrishna Math & Ramakrishna Mission, Kamarpukur
          </h2>
        </div>
      </div>
      
      <h1 class="prasada-coupon__main-title">PRASADA COUPON</h1>
      
      <div class="prasada-coupon__details">
        <div class="prasada-coupon__row">
          <span class="prasada-coupon__label">Date:</span>
          <span class="prasada-coupon__value">${formattedDate}</span>
        </div>
        <div class="prasada-coupon__row">
          <span class="prasada-coupon__label">Name:</span>
          <span class="prasada-coupon__value">${formData.name}</span>
        </div>
        <div class="prasada-coupon__row">
          <span class="prasada-coupon__label">No. Of Devotees:</span>
        </div>
        <div class="prasada-coupon__number">
          ${selectedCoupons}
        </div>
      </div>
    </div>
  </div>
  ${printStyles}
`;

const printStyles = `
<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
  
  * {
    font-family: 'Poppins', sans-serif;
  }
  .print-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  .prasada-coupon {
    width: 300px;
    padding: 20px;
    border: 1px solid #000;
    margin: 20px;
    position: relative;
  }
  .prasada-coupon__header {
    margin-bottom: 20px;
  }
  .prasada-coupon__header-content {
    display: flex;
    align-items: center;
    gap: 15px;
  }
  .prasada-coupon__logo {
    width: 60px;
    height: 60px;
    flex-shrink: 0;
  }
  .prasada-coupon__title {
    font-size: 16px;
    font-weight: bold;
    margin: 0;
  }
  .prasada-coupon__main-title {
    text-align: center;
    font-size: 20px;
    margin: 20px 0;
    border-top: 1px solid #000;
    border-bottom: 1px solid #000;
    padding: 10px 0;
  }
  .prasada-coupon__details {
    margin-top: 20px;
  }
  .prasada-coupon__row {
    margin: 10px 0;
    display: flex;
    gap: 10px;
  }
  .prasada-coupon__label {
    font-weight: 500;
    color: #666;
  }
  .prasada-coupon__value {
    font-weight: bold;
  }
  .prasada-coupon__number {
    font-size: 72px;
    font-weight: bold;
    text-align: center;
    border: 1px solid #666;
    border-radius: 8px;
    margin: 20px auto;
    width: 100%;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .prasada-coupon__page-number {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 12px;
    color: #666;
    font-weight: 500;
  }
  @media print {
    @page { margin: 1cm; }
  }
</style>
`;
