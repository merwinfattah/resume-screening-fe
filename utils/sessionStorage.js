export const registerSessionKeys = () => {
    const keys = ["formDataList"];
    keys.forEach((key) => {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, JSON.stringify([]));
      }
    });
  };


export const setItem = (key, value) => {
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  };
  
export const getItem = (key) => {
if (typeof sessionStorage !== "undefined") {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
}
return null;
};

export const removeItem = (key) => {
if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(key);
}
};