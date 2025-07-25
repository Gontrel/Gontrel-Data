/**
 * Utility functions for table operations
 */

/**
 * Toggles a value in a Set and returns a new Set
 * @param set - The original Set
 * @param value - The value to toggle
 * @returns A new Set with the value toggled
 */
export const toggleSetValue = <T>(set: Set<T>, value: T): Set<T> => {
  const newSet = new Set(set);
  if (newSet.has(value)) {
    newSet.delete(value);
  } else {
    newSet.add(value);
  }
  return newSet;
};

/**
 * Adds or removes a value from a Set based on a condition
 * @param set - The original Set
 * @param value - The value to add or remove
 * @param shouldAdd - Whether to add (true) or remove (false) the value
 * @returns A new Set with the value updated
 */
export const updateSetValue = <T>(set: Set<T>, value: T, shouldAdd: boolean): Set<T> => {
  const newSet = new Set(set);
  if (shouldAdd) {
    newSet.add(value);
  } else {
    newSet.delete(value);
  }
  return newSet;
};

/**
 * Creates a new Set with a single value added
 * @param set - The original Set
 * @param value - The value to add
 * @returns A new Set with the value added
 */
export const addToSet = <T>(set: Set<T>, value: T): Set<T> => {
  const newSet = new Set(set);
  newSet.add(value);
  return newSet;
};

/**
 * Creates a new Set with a value removed
 * @param set - The original Set
 * @param value - The value to remove
 * @returns A new Set with the value removed
 */
export const removeFromSet = <T>(set: Set<T>, value: T): Set<T> => {
  const newSet = new Set(set);
  newSet.delete(value);
  return newSet;
};