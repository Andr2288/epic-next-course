import {
  getUserMeService,
  loginUserService,
  registerUserService,
} from "@/data/services/auth";
import { fileDeleteService, fileUploadService } from "@/data/services/file";
import {
  updateProfileImageService,
  updateProfileService,
} from "@/data/services/profile";

export const services = {
  auth: {
    registerUserService,
    loginUserService,
    getUserMeService,
  },
  profile: {
    updateProfileService,
    updateProfileImageService,
  },
  file: {
    fileUploadService,
    fileDeleteService,
  },
};
