import {
  getAuthTokenAction,
  loginUserAction,
  logoutUserAction,
  registerUserAction,
} from "@/data/actions/auth";
import {
  updateProfileAction,
  updateProfileImageAction,
} from "@/data/actions/profile";

export const actions = {
  auth: {
    registerUserAction,
    loginUserAction,
    logoutUserAction,
    getAuthTokenAction,
  },
  profile: {
    updateProfileAction,
    updateProfileImageAction,
  },
};
