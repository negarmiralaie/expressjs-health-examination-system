const { Op } = require('sequelize');
const db = require('../../../db/models');
const response = require('../../../components/responseHandler');

const dashboardController = {
    list: async (req, res) =>{
        try {
            const { count: totalPersonnelsNo, rows: totalPersonnels } = await db.User.findAndCountAll({ where: { role : 'admin' } });
            console.log('totalPersonnelsNo', totalPersonnelsNo)
            const { count: totalFactoriesNo, rows: factories } = await db.Factory.findAndCountAll();
            const { count: totalHarmfulFormsNo, rows: harmfulForms } = await db.Harmfulfactor.findAndCountAll();
            const { count: totalOptometryFormsNo, rows: optometryForms } = await db.Optometryaudiometry.findAndCountAll();
            const { count: totalSpiroFormsNo, rows: spiroForms } = await db.SpirometryEcg.findAndCountAll();
            const { count: totalTestFormsNo, rows: testForms } = await db.TestExamination.findAndCountAll();
            const totalFormsNo = totalHarmfulFormsNo + totalOptometryFormsNo + totalSpiroFormsNo + totalTestFormsNo;
            const { count: totalUsersNo, rows: users } = await db.User.findAndCountAll();
            const total = { totalPersonnelsNo, totalFactoriesNo, totalFormsNo, totalUsersNo};
            // console.log('total', total)
            const TODAY_START = new Date().setHours(0, 0, 0, 0);
            const NOW = new Date();

            let todayPersonnelsNo = await db.User.sum('id', {
                where: {
                createdAt: { 
                    [Op.gt]: TODAY_START,
                    [Op.lt]: NOW
                },
                role: 'admin'
                },
            });

            todayPersonnelsNo = todayPersonnelsNo === null ? 0 : todayPersonnelsNo;

            const { count: activeFactoriesNo, rows: activeFactories } = await db.Factory.findAndCountAll({ where: { status : 'active' } });
        
            const todayHarmfulFormsNo = await db.Harmfulfactor.count('id', {
            where: {
                createdAt: { 
                [Op.gt]: TODAY_START,
                [Op.lt]: NOW
                },
            },
            });

            const todayOptometryFormsNo = await db.Optometryaudiometry.count('id', {
            where: {
                createdAt: { 
                [Op.gt]: TODAY_START,
                [Op.lt]: NOW
                },
            },
            });

            const todaySpiroFormsNo = await db.SpirometryEcg.count('id', {
            where: {
                createdAt: { 
                [Op.gt]: TODAY_START,
                [Op.lt]: NOW
                },
            },
            });

            const todayTestFormsNo = await db.TestExamination.count('id', {
            where: {
                createdAt: { 
                [Op.gt]: TODAY_START,
                [Op.lt]: NOW
                },
            },
            });

            const todayFilledFormsNo = todayHarmfulFormsNo + todayOptometryFormsNo + todaySpiroFormsNo + todayTestFormsNo;

            const { count: onlineUsersNo, rows: onlineUsers } = await db.User.findAndCountAll({ where: { role : 'admin' } });

            const today = { todayPersonnelsNo, activeFactoriesNo, todayFilledFormsNo, onlineUsersNo};

            return response.success(res, { total, today } , res.t('CRUD.Success'));
        } catch (error) {
            return response.catchError(res, error);
        }
    }
};

module.exports = dashboardController;
