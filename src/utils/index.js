export * from './callbacks';
export * from './history';
export const assign = Object.assign;
export const isObject = (value) => {
  return typeof value === 'object' && value !== null;
};
