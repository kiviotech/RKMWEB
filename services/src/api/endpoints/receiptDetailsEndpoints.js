const receiptDetailsEndpoints = {
  getReceiptDetails: "/receipt-details?populate=*",
  getReceiptNumbers: "/receipt-details?fields=Receipt_number",
  getReceiptDetailById: (id) => `/receipt-details/${id}`,
  createReceiptDetail: "/receipt-details",
  updateReceiptDetail: (id) => `/receipt-details/${id}`,
  deleteReceiptDetail: (id) => `/receipt-details/${id}`,
};

export default receiptDetailsEndpoints;
