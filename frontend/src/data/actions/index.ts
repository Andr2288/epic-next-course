import {
  getAuthTokenAction,
  loginUserAction,
  logoutUserAction,
  registerUserAction,
} from "@/data/actions/auth";

export const actions = {
  auth: {
    registerUserAction,
    loginUserAction,
    logoutUserAction,
    getAuthTokenAction,
  },
};
