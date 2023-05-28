export const registerSessionKeys = () => {
    const keys = ["positionDataList"];
    keys.forEach((key) => {
      if (!sessionStorage.getItem(key)) {
        sessionStorage.setItem(key, JSON.stringify([]));
      }
    });
  };

export const registerCandidatesSessionKeys = () => {
  const keys = ["candidateDataList"];
  keys.forEach((key) => {
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, JSON.stringify([]));
    }
  });
};

export const registerTotalPositionKeys = () => {
  const keys = ["totalPosition"];
  keys.forEach((key) => {
    if (!sessionStorage.getItem(key)) {
      sessionStorage.setItem(key, JSON.stringify(0));
    }
  });
};




export const setItem = async (key, value) => {
  return new Promise((resolve, reject) => {
    if (typeof sessionStorage !== "undefined") {
      try {
        sessionStorage.setItem(key, JSON.stringify(value));
        resolve();
      } catch (error) {
        reject(error);
      }
    } else {
      reject(new Error("Session storage is not available."));
    }
  });
};

export const getItem = async (key) => {
  return new Promise((resolve, reject) => {
    if (typeof sessionStorage !== "undefined") {
      const item = sessionStorage.getItem(key);
      resolve(item ? JSON.parse(item) : null);
    } else {
      reject(new Error("Session storage is not available."));
    }
  });
};

export const removeItem = (key) => {
if (typeof sessionStorage !== "undefined") {
    sessionStorage.removeItem(key);
}
};