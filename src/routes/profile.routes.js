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
  addAwardController,
  deleteAwardController,
updateProfileMediaController,
  updateLearningJourneyController,
  updateCareerExpectationsController,
  updateJobAlertPreferencesController,
  updateRecentExperienceController,
  updateInterestsAndPreferencesController,
  deleteProfileController,
  addPublicationController,
  updatePublicationItemController,
  deletePublicationItemController,
  updateAwardController,
  updateContactInfo,
} from "../controllers/profile.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/upload.js"
const router = express.Router();

router.get("/username/:username", getProfileByUsernameController);
router.put("/contact", authMiddleware, updateContactInfo);

router.use(authMiddleware);

router.get("/", getProfileController);
router.post("/", createOrUpdateProfileController);
router.put("/", createOrUpdateProfileController); 
router.delete("/", deleteProfileController);


router.put("/personal-info", updatePersonalInfoController);

router.put("/profile-summary", updateProfileSummaryController);

router.put("/social-links", updateSocialLinksController);

router.put("/media", authMiddleware, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'profileCover', maxCount: 1 }
]), updateProfileMediaController);

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

router.put("/certificates", upload.single('certificateImage'), updateCertificatesController);
router.post("/certificates", upload.single('certificateImage'), addCertificateController);
router.put("/certificates/:itemId", updateCertificateItemController);
router.delete("/certificates/:itemId", deleteCertificateItemController);

// award 
router.post("/awards", upload.single('media'), addAwardController);
router.delete("/awards/:itemId", deleteAwardController);
router.put("/awards/:itemId", upload.single('media'), updateAwardController);

router.post("/publications", authMiddleware, addPublicationController);
router.put("/publications/:itemId", authMiddleware, updatePublicationItemController);
router.delete("/publications/:itemId", authMiddleware, deletePublicationItemController);



router.put("/learning-journey", updateLearningJourneyController);

router.put("/career-expectations", updateCareerExpectationsController);

router.put("/job-alert-preferences", updateJobAlertPreferencesController);

router.put("/recent-experience", updateRecentExperienceController);

router.put("/interests-preferences", updateInterestsAndPreferencesController);



export default router;

