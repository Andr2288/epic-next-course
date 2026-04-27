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
import {
  generateSummary,
  generateTranscript,
  saveSummaryService,
} from "@/data/services/summary";

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
  summarize: {
    generateTranscript,
    generateSummary,
    saveSummaryService,
  },
};
