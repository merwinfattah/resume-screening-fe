// store/actions/uploadActions.ts

import { UPLOAD_FILE, CLEAR_UPLOAD } from "./types";

export const uploadFile = (files: File[]) => {
  return {
    type: UPLOAD_FILE,
    payload: files,
  };
};

export const clearUpload = () => {
  return {
    type: CLEAR_UPLOAD,
  };
};