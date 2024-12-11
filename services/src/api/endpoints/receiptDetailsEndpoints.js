const receiptDetailsEndpoints = {
  getReceiptDetails: "/receipt-details?populate=*",
  getReceiptDetailById: (id) => `/receipt-details/${id}`,
  createReceiptDetail: "/receipt-details",
  updateReceiptDetail: (id) => `/receipt-details/${id}`,
  deleteReceiptDetail: (id) => `/receipt-details/${id}`,
  getUniqueNumbers:
    "/receipt-details?filters[unique_no][$notNull]=true&fields[0]=unique_no&fields[1]=Receipt_number",
};

export default receiptDetailsEndpoints;
