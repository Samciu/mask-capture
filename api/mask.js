/*
 * @Author: dazhao 
 * @Date: 2020-02-23 22:27:26 
 * @Last Modified by: dazhao
 * @Last Modified time: 2020-02-24 16:45:04
 */

const axios = require('axios');
const config = require('../config');

const request = axios.create({
    headers: { "sessionid": config.sessionid }
});

const url = {
    guangzhou: {
        maskList: 'https://imgcache.gzonline.gov.cn/cloudsa3/wyj/ypgg_data_prd2020013101.json', // 穗康口罩list
        maskInfo: 'https://imgcache.gzonline.gov.cn/cloudsa3/wyj/wll_mp_prod_config.json', // 穗康口罩info
        preorderAdd: 'https://skyy.gzonline.gov.cn/preorder/add', // 穗康口罩预约
    },
    jiangmen: {
        maskList: 'https://wyj-1301191558.file.myqcloud.com/cloudsa3/uc/ypgg_data_prd20200206.json', // 江门口罩list
        maskInfo: 'https://wyj-1301191558.file.myqcloud.com/cloudsa3/uc/wll_mp_dev_config.json', // 江门口罩info
        preorderAdd: 'https://jkjm.jiangmen.cn/preorder/add', // 江门口罩预约
    },
    shanwei: {
        maskList: 'https://wyj-1301196457.file.myqcloud.com/cloud/wyj/ypgg_data_prd.json', // 汕尾口罩list
        maskInfo: 'https://wyj-1301196457.file.myqcloud.com/cloud/wyj/wll_mp_pro_config.json', // 汕尾口罩info
        preorderAdd: 'https://swgd-yy.tgovcloud.com/preorder/add', // 汕尾口罩预约
    }
}

const maskApi = {

    async getMaskList(address) {
        console.log('请求口罩类型列表', address)
        let { data: list } = await request({
            url: url[address].maskList,
            // params: { ...data }
        })

        // 汕尾的接口居然返回个字符串，真是日了狗
        if (typeof list === 'string') {
            console.log('居然是string类型!!!!')
            list = JSON.parse(list.replace(/\r\n|\s/g, ''))
        }

        return list
    },

    preorderAdd(data, address) {
        console.log('请求预约', address)

        return request({
            method: 'post',
            url: url[address].preorderAdd,
            data
        })
    }

}

module.exports = maskApi