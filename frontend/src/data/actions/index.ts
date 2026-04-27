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
import { createSummaryAction } from "@/data/actions/summary";

export { createSummaryAction } from "@/data/actions/summary";

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
  summary: {
    createSummaryAction,
  },
};
