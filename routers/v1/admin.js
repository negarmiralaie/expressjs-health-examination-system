const express = require('express');
const router = express.Router();
const {
    casesController,
    factoriesController,
    usersController,
    harmfulFactorsController,
    optometryAndAudiometryController,
    spirometryAndEcgController,
    suggestionController,
    testsAndExaminationsController,
    roleController,
    settingsController,
    dashboardControlller,
    reportController,
    personnelsController,
} = require('../../controllers/v1/admin/index');
const auth = require('../../middlewares/adminAuther');
const authMiddleware = require('../../middlewares/authMiddlewares');
const {upload} = require('./upload');
const  uploadFileController = require('../../controllers/v1/admin/fileUploadController');
router.use(authMiddleware.user);
// -------------------------------> END OF IMPORTS <-------------------------------

/* GET home page. */
router.get('/', (req, res) => {
    res.send('Admin home routes');
});

/** Cases */
router.get('/cases', auth(), casesController.list); //?
router.get('/cases/myCases', auth(), casesController.myCases); //! NOT CHECKED YET..
router.get('/cases/byFactoryName', auth(), casesController.getByFactoryName); //?
// router.post('/cases', casesController.create);
router.delete('/cases/:id', auth(), casesController.delete);

/** Factories */
router.get('/factories', auth(), factoriesController.list); //?
router.post('/factories', auth(), upload.array('files'),factoriesController.create); //?
router.delete('/factories/:id', auth(), factoriesController.delete); //?
router.get('/factories/:id', auth(), factoriesController.get); //?
router.put('/factories/:id', auth(), factoriesController.update); //?


/** Personnel */
router.post('/personnels', auth(), upload.single('photo'), personnelsController.createPersonnel); //?
router.get('/personnels', auth(), personnelsController.listPersonnels); //?
router.delete('/personnels/:id', auth(), personnelsController.deletePersonnel); //?
router.get('/personnels/:id', auth(), personnelsController.getPersonnelById); //?
router.put('/personnels/:id', auth(), personnelsController.updatePersonnel); //?

router.get('/my-personnels', auth(), personnelsController.getMyPersonnels); //!


/** User */
router.post('/users', auth(), usersController.createUser); //?
router.get('/users', usersController.listUsers); //?
router.delete('/users/:id', auth(), usersController.deleteUser); //?
router.get('/users/:id', auth(), usersController.getUserById); //?
router.put('/users/:id', auth(), usersController.updateUser); //?

/** Settings */
router.get('/settings', auth(), settingsController.get);
router.put('/settings', auth(), upload.array('files'), settingsController.create);
router.post('/settings', auth(), upload.array('files'), settingsController.create);

/** HarmfulFactors */
router.get('/harmfulFactors', harmfulFactorsController.list);
router.post('/harmfulFactors', harmfulFactorsController.create);
router.delete('/harmfulFactors/:id', harmfulFactorsController.delete);
router.put('/harmfulFactors/:id', harmfulFactorsController.update);
router.get('/harmfulFactors/:id', harmfulFactorsController.get);

/** Optometryandaudiometry */
router.get('/optometryandaudiometry', optometryAndAudiometryController.list);
router.post('/optometryandaudiometry', optometryAndAudiometryController.create);
router.get('/optometryandaudiometry/:id', optometryAndAudiometryController.get);
router.delete('/optometryandaudiometry/:id', optometryAndAudiometryController.delete);
router.put('/optometryandaudiometry/:id', optometryAndAudiometryController.update);

/** Spirometryandecg */
router.get('/spirometryandecg', spirometryAndEcgController.list);
router.post('/spirometryandecg', spirometryAndEcgController.create);
router.get('/spirometryandecg/:id', spirometryAndEcgController.get);
router.delete('/spirometryandecg/:id', spirometryAndEcgController.delete);
router.put('/spirometryandecg/:id', spirometryAndEcgController.update);

/** Testsandexaminations */
router.get('/testsandexaminations', testsAndExaminationsController.list);
router.post('/testsandexaminations', testsAndExaminationsController.create);
router.get('/testsandexaminations/:id', testsAndExaminationsController.get);
router.delete('/testsandexaminations/:id', testsAndExaminationsController.delete);
router.put('/testsandexaminations/:id', testsAndExaminationsController.update);

router.post('/report', auth(), reportController.get);

/** Suggestion */
router.get('/suggestions', auth(), suggestionController.list);
router.post('/suggestions', auth(), suggestionController.create);
router.delete('/suggestions/:id', auth(), suggestionController.delete);
router.get('/suggestions/:id', auth(), suggestionController.get);
router.put('/suggestions/:id', auth(), suggestionController.update);

/* Permissions */
router.get('/permissions', roleController.ListAllPermissions);
// router.get('/permissions/my', auth(), roleController.ListMyPermissions);
// router.get('/permissions/:id', roleController.ListUserPermissions);
router.get('/roles', roleController.ListAllRoles);
router.get('/roles/my', roleController.ListMyRoles);
router.get(
  '/roles/:name',
  auth('read_other_perms'),
  roleController.ListRolePermissions
);
router.post('/roles', roleController.CreateRole);
router.put('/roles', roleController.UpdateRole);
router.post('/roles/add', auth('assign_role'), roleController.AddRoleToUser);
router.delete('/roles/:title',roleController.DeleteRole);
// upload.array('files'),
/** Settings */
// router.post('/settings', settingsController.create);
// router.put('/settings', settingsController.update);
// router.get('/settings', settingsController.get);

/** Dashboard */
router.get('/dashboard', auth(), dashboardControlller.list);

// router.post('/singleFile', upload.single('file'), uploadFileController.singleFileUpload);
// router.post('/multipleFile', upload.array('files'), uploadFileController.multipleFileUpload);

module.exports = router;
