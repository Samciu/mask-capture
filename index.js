/*
 * @Author: dazhao 
 * @Date: 2020-02-23 21:51:20 
 * @Last Modified by: dazhao
 * @Last Modified time: 2020-02-28 14:48:32
 */

const schedule = require('node-schedule');
const api = require("./api/mask");
const config = require("./config");

const start = async () => {
    const { name, mobile, identity, idcard, address } = config;
    const list = await api.getMaskList(address);

    console.log('口罩类型列表：', list)

    // 默认拿第一个
    const [shopList] = list[0].shop_list
    const [classList] = shopList.class_list
    const [commodityList] = classList.commodity_list
    const baseAppointmentData = {
        zone: shopList.address,
        shop_id: shopList.id,
        commodity_id: commodityList.id,
        category: commodityList.name,
        number: commodityList.min_order_number || commodityList.pre_order_number,
        changeable: 'yes',
        time_code: '0',
        wxmsg: 1,
        mail_address: '',
        identityType: '身份证',
        name,
        mobile,
        identity,
        idcard,
    }

    console.log('发送数据', baseAppointmentData);

    const { data } = await api.preorderAdd(baseAppointmentData, address);

    console.log('结果 ' + new Date, data);

    return data;
}


const { scheduleRule } = config;
const job = schedule.scheduleJob(scheduleRule, async function () {
    const data = await start();
    if (data.errcode == 0) {
        job.cancel();
    }
});