const roleList = ['admin', 'examiner', 'generalManager', 'client', 'communications'];
//               ['پرسنل', 'ارتباطات', 'مشتری', 'مدیرکل', 'ثبات', 'ادمین']
const StatusList = ['active', 'inactive'];
const genderList = ['مرد', 'زن'];
const maritalStatusList = ['متاهل', 'مجرد'];
const militaryStatusList = ['سپاه', 'ارتش', 'نیروی انتظامی', 'وزارت دفاع', 'خدمت نکرده', 'معافیت پزشکی', 'معافیت غیر پزشکی']
const serviceLineList = ['زرهی', 'توپخانه', 'نیرو هوایی', 'نیرو زمینی', 'نیرو دریایی']; // ['زرهی', 'توپخانه', 'نیروهوایی', 'نیروزمینی', 'نیرودریایی']
const examinationTypeList = ['بدو استخدام', 'دوره ای', 'کارت سلامت رانندگان', 'موردی'];

module.exports = { 
    roleList,
    StatusList,
    genderList,
    maritalStatusList,
    militaryStatusList,
    serviceLineList,
    examinationTypeList,
}