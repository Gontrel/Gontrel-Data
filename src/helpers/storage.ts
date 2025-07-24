export const asyncLocalStorage = {
  //Set local storage item with a delay to simulate async behavior
  setItem: <T>(key: string, value: T): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          if (value === undefined) {
            localStorage.removeItem(key);
          } else {
            localStorage.setItem(key, JSON.stringify(value));
          }
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  },

  //Get local storage item with a delay to simulate async behavior
  getItem: <T>(key: string): Promise<T | null> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            resolve(JSON.parse(value) as T);
          } catch (error) {
            // If parsing fails, return null and log the error
            console.error("Error parsing JSON from localStorage:", error);
            resolve(null);
          }
        } else {
          resolve(null);
        }
      }, 0);
    });
  },

  //Remove local storage item with a delay to simulate async behavior
  removeItem: (key: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          localStorage.removeItem(key);
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  },

  //Clear local storage item with a delay to simulate async behavior
  clear: (key: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          localStorage.clear();
          resolve();
        } catch (error) {
          reject(error);
        }
      }, 0);
    });
  },
};
