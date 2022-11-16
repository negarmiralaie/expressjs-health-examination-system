const joi = require('joi');
const db = require('../../../db/models');
const response = require('../../../components/responseHandler');
const { t } = require('localizify');
const Sequelize = require('sequelize')

const base = db.User;
const reportController = {
    get: async (req, res) => {
        try {
            const schema = joi.object().keys({
                factoryName: joi.string(),
                examinationType: joi.string(),
                militaryStatus: joi.string(),
                serviceLine: joi.string(),
                healthExpertSuggestion: joi.array().items(joi.string()), //Array
                DiseaseBg: joi.string(),
                testDescription: joi.string(),
                testResults: joi.string(),
                rightEyeVisualAcuity: joi.string(),
                leftEyeVisualAcuity: joi.string(),
                colorVision: joi.string(),
                visualField: joi.string(),
                depthVision: joi.string(),
                rightEarCondition: joi.string(),
                leftEarCondition: joi.string(),
            });
            const updatedSchema = schema.optional("factoryName", "examinationType", "militaryStatus", "serviceLine", "healthExpertSuggestion", "DiseaseBg", "testDescription", "testResults", "rightEyeVisualAcuity", "leftEyeVisualAcuity", "colorVision", "visualField", "depthVision", "rightEarCondition", "leftEarCondition");

            const { error, value } = schema.validate(req.body, {
                abortEarly: true
            });
            if (error) return response.validation(res, error);

            // NOW START ......
            let where = {};
            if (value) {
                if (value.factoryName) where.factoryName = value.factoryName;
                if (value.examinationType) where.examinationType = value.examinationType;
                if (value.militaryStatus) where.militaryStatus = value.militaryStatus;
                if (value.serviceLine) where.serviceLine = value.serviceLine;
            };

            let sameIds = [];
            let userDbIds;
            console.log('where', where)
            if (Object.keys(where).length) {
                console.log('vvvvvvvvvv')
                // IF ANY CONDITION FOR USER DB WAS SPECIFIED, THEN SEARCG FOR THE USER WITH GIVEN CONDITIONS
                userDbIds = await base.findAll({
                    attributes: ['id'],
                    where
                });

                for (const id in userDbIds)
                userDbIds[id] = userDbIds[id].dataValues.id;

                sameIds = sameIds.length > 0 ? sameIds.filter(element => userDbIds.includes(element)) : userDbIds;
            }
            // STEP 2 *******************************
            // FIRST EMPTY 'WHERE' TO STORE NEW CONDITIONS
            for (const key in where)
                delete where[key];

            // THEN STORE NEW CONDITIONS IN 'WHERE'.... 
            if (value.testDescription) where.testDescription = value.testDescription;
            if (value.testResults) where.testResults = value.testResults;

            let testDbIds;
            if (Object.keys(where).length) {
                testDbIds = await db.TestExamination.findAll({
                    attributes: ['examiner_id'],
                    where
                });

                for (const id in testDbIds)
                testDbIds[id] = testDbIds[id].dataValues.examiner_id;

                sameIds = sameIds.length > 0 ? sameIds.filter(element => testDbIds.includes(element)) : testDbIds;
            }

            console.log('userDbIds***********', userDbIds)
            console.log('testDbIds', testDbIds)
            console.log('sameIdsssss', sameIds)
            // STEP 3 *******************************
            for (const key in where)
            delete where[key];

            if (value.DiseaseBg) where.DiseaseBg = value.DiseaseBg;
            if (value.healthExpertSuggestion) where.healthExpertSuggestion = value.healthExpertSuggestion;

            let harmfulDbIds;
            if (Object.keys(where).length) {
                harmfulDbIds = await db.Harmfulfactor.findAll({
                    attributes: ['examiner_id'],
                    where
                });

                for (const id in harmfulDbIds)
                    harmfulDbIds[id] = harmfulDbIds[id].dataValues.examiner_id;

                sameIds = sameIds.length > 0 ? sameIds.filter(element => harmfulDbIds.includes(element)) : harmfulDbIds;
            }

            console.log('sameIds***********', sameIds)
            console.log('harmfulDbIds', harmfulDbIds);
            console.log('sameIdsssss', sameIds);
            // /*************************************
            // STEP 4 *******************************
            for (const key in where)
            delete where[key];

            if (value.rightEyeVisualAcuity) where.rightEyeVisualAcuity = value.rightEyeVisualAcuity;
            if (value.leftEyeVisualAcuity) where.leftEyeVisualAcuity = value.leftEyeVisualAcuity;
            if (value.colorVision) where.colorVision = value.colorVision;
            if (value.visualField) where.visualField = value.visualField;
            if (value.depthVision) where.depthVision = value.depthVision;
            if (value.rightEarCondition) where.rightEarCondition = value.rightEarCondition;
            if (value.leftEarCondition) where.leftEarCondition = value.leftEarCondition;


            let optometryDbIds;
            if (Object.keys(where).length) {
                optometryDbIds = await db.Optometryaudiometry.findAll({
                    attributes: ['examiner_id'],
                    where
                });

                for (const id in optometryDbIds)
                    optometryDbIds[id] = optometryDbIds[id].dataValues.examiner_id;

                sameIds = sameIds.length > 0 ? sameIds.filter(element => optometryDbIds.includes(element)) : optometryDbIds;
            }

            console.log('sameIds***********', sameIds)
            console.log('optometryDbIds', optometryDbIds);
            console.log('sameIdsssss', sameIds);
            // /*************************************
            return response.success(res, sameIds, res.t('CRUD.Success'));
        } catch (error) {
            return response.catchError(res, error);
        }
    },
}

module.exports = reportController;