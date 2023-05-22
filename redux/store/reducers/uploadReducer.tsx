import { UPLOAD_FILE, CLEAR_UPLOAD } from "../actions/types";

interface UploadState {
  acceptedFiles: File[];
}

const initialState: UploadState = {
  acceptedFiles: [],
};

export const uploadReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case UPLOAD_FILE:
      console.log('payload', action.payload);
      return {
        ...state,
        acceptedFiles: action.payload,
      };
    case CLEAR_UPLOAD:
      return {
        ...state,
        acceptedFiles: [],
      }
    default:
      return state;
  }
};