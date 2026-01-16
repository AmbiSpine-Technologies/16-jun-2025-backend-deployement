import express from "express";
import {
  createOrUpdateProfileController,
  getProfileController,
  getProfileByUsernameController,
  updatePersonalInfoController,
  updateProfileSummaryController,
  updateSocialLinksController,
  updateWorkExperienceController,
  addWorkExperienceController,
  updateWorkExperienceItemController,
  deleteWorkExperienceItemController,
  updateEducationController,
  addEducationController,
  updateEducationItemController,
  deleteEducationItemController,
  updateProjectsController,
  addProjectController,
  updateProjectItemController,
  deleteProjectItemController,
  updateSkillsController,
  updateInterestsController,
  updateLanguagesController,
  updateCertificatesController,
  addCertificateController,
  updateCertificateItemController,
  deleteCertificateItemController,
  updateLearningJourneyController,
  updateCareerExpectationsController,
  updateJobAlertPreferencesController,
  updateRecentExperienceController,
  updateInterestsAndPreferencesController,
  deleteProfileController,
} from "../controllers/profile.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/username/:username", getProfileByUsernameController);

router.use(authMiddleware);

router.get("/", getProfileController);
router.post("/", createOrUpdateProfileController);
router.put("/", createOrUpdateProfileController); 
router.delete("/", deleteProfileController);


router.put("/personal-info", updatePersonalInfoController);

router.put("/profile-summary", updateProfileSummaryController);

router.put("/social-links", updateSocialLinksController);

router.put("/work-experience", updateWorkExperienceController);
router.post("/work-experience", addWorkExperienceController);
router.put("/work-experience/:itemId", updateWorkExperienceItemController);
router.delete("/work-experience/:itemId", deleteWorkExperienceItemController);

router.put("/education", updateEducationController);
router.post("/education", addEducationController);
router.put("/education/:itemId", updateEducationItemController);
router.delete("/education/:itemId", deleteEducationItemController);

router.put("/projects", updateProjectsController);
router.post("/projects", addProjectController);
router.put("/projects/:itemId", updateProjectItemController);
router.delete("/projects/:itemId", deleteProjectItemController);

router.put("/skills", updateSkillsController);
router.put("/interests", updateInterestsController);
router.put("/languages", updateLanguagesController);

router.put("/certificates", updateCertificatesController);
router.post("/certificates", addCertificateController);
router.put("/certificates/:itemId", updateCertificateItemController);
router.delete("/certificates/:itemId", deleteCertificateItemController);

router.put("/learning-journey", updateLearningJourneyController);

router.put("/career-expectations", updateCareerExpectationsController);

router.put("/job-alert-preferences", updateJobAlertPreferencesController);

router.put("/recent-experience", updateRecentExperienceController);

router.put("/interests-preferences", updateInterestsAndPreferencesController);



export default router;

