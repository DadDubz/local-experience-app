// Action to upgrade user to premium
export const upgradeToPremium = () => ({
  type: "UPGRADE_TO_PREMIUM",
});
// Action to set user data
export const setUser = (user: any) => ({
  type: "SET_USER",
  payload: user,
});
