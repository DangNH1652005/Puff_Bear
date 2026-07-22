let adminInitialized = false;

export const shouldInitAdmin = () => {
  if (adminInitialized) {
    return false;
  }

  adminInitialized = true;
  return true;
};