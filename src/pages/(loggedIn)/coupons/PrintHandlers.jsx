import {
  separateCouponsTemplate,
  combinedCouponTemplate,
} from "./PrintTemplates";
import { createNewCouponUser } from "../../../../services/src/services/couponUserService";
import { updateCouponAmountCollected } from "../../../../services/src/services/couponService";
import { toast } from "react-toastify";

export const handlePrintSeparate = async (
  formData,
  selectedCoupons,
  setRefreshTrigger,
  clearForm
) => {
  try {
    await validateAndCreateCoupon(formData, selectedCoupons);

    const printFrame = createPrintFrame();
    const formattedDate = formatDate();

    printFrame.contentDocument.write(
      separateCouponsTemplate(formData, selectedCoupons, formattedDate)
    );
    printFrame.contentDocument.close();

    await printAndCleanup(printFrame, setRefreshTrigger);
  } catch (error) {
    handlePrintError(error);
  }
};

export const handlePrintAll = async (
  formData,
  selectedCoupons,
  setRefreshTrigger,
  clearForm
) => {
  try {
    await validateAndCreateCoupon(formData, selectedCoupons);

    const printFrame = createPrintFrame();
    const formattedDate = formatDate();

    printFrame.contentDocument.write(
      combinedCouponTemplate(formData, selectedCoupons, formattedDate)
    );
    printFrame.contentDocument.close();

    await printAndCleanup(printFrame, setRefreshTrigger);
  } catch (error) {
    handlePrintError(error);
  }
};

// Helper functions
const validateAndCreateCoupon = async (formData, selectedCoupons) => {
  const currentDate = new Date().toISOString();
  const couponData = {
    date: currentDate,
    name: formData.name,
    address: `${formData.address} - ${formData.pincode}`,
    no_of_coupon: selectedCoupons,
    paid: parseFloat(formData.paid),
  };

  await createNewCouponUser(couponData);
  await updateCouponAmountCollected(
    currentDate,
    formData.paid,
    selectedCoupons
  );
  toast.success("Coupon created successfully!");
};

const createPrintFrame = () => {
  const printFrame = document.createElement("iframe");
  printFrame.style.display = "none";
  document.body.appendChild(printFrame);
  return printFrame;
};

const formatDate = () => {
  return new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const printAndCleanup = async (printFrame, setRefreshTrigger) => {
  printFrame.contentWindow.print();
  printFrame.contentWindow.onafterprint = () => {
    document.body.removeChild(printFrame);
    setRefreshTrigger((prev) => prev + 1);
  };
};

const handlePrintError = (error) => {
  // console.error("Error saving coupon data:", error);
  toast.error("Error saving coupon data. Please try again.");
};
