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
      const filesCopy = action.payload.map((file: File) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        lastModifiedDate: new Date(file.lastModified.toString()),
      }));
      return {
        ...state,
        acceptedFiles: filesCopy,
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