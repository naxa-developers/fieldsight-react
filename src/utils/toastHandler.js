import { toast } from "react-toastify";

export const successToast = (title, action) =>
  toast.success(`${title} was successfully ${action}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true
  });

export const errorToast = error =>
  toast.error(!!error ? error : "Oops, something went wrong", {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true
  });

export const warnToast = warn =>
  toast.warn(`${warn}`, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true
  });
