import { rejects } from "assert";

const isBrowser = typeof window !== "undefined";

export const asyncLocalStorage = {
  //Set local storage item with a delay to simulate async behavior
  setItem: <T>(key: string, value: T): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isBrowser) {
        return resolve();
      }
      setTimeout(() => {
        try {
          if (value === undefined) {
            console.warn(
              `Attempted to set undefined value for key "${key}". Removing item.`
            );
            localStorage.removeItem(key);
          } else {
            const valueToStore =
              typeof value === "string" ? value : JSON.stringify(value);
            localStorage.setItem(key, valueToStore);
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
      if (!isBrowser) {
        return resolve(null);
      }
      setTimeout(() => {
        const value = localStorage.getItem(key);
        if (value) {
          try {
            // Try to parse it as JSON
            resolve(JSON.parse(value) as T);
          } catch (error) {
            // If it fails, it's likely a raw string, so return it as is
            resolve(value as T);
            reject(error)
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
      if (!isBrowser) {
        return resolve();
      }
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
  clear: (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isBrowser) {
        return resolve();
      }
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
