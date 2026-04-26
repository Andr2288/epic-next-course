import {
  getUserMeService,
  loginUserService,
  registerUserService,
} from "@/data/services/auth";

export const services = {
  auth: {
    registerUserService,
    loginUserService,
    getUserMeService,
  },
};
