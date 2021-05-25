import { regNum2Precision, inputMaxNumber } from '@/libs/util'

export const formRules = {
    data() {
        const validatePrice = (rule, value, callback) => {
            if (value === null) {
                callback(new Error('请填写底价'));
            } else if (!regNum2Precision.test(value) || value < 0 || value > inputMaxNumber) {
                callback(new Error('大于等于0的任意实数，最多可填两位小数'))
            } else {
                callback()
            }
        };
        return {
            ruleBase: { // 正则
                ssp_id: [{required: true, message:'请选择媒体名称'}],
                app_id: [{required: true, message:'请选择应用名称'}],
                slot_scene: [{required: true, message:'请选择广告场景'}],
                slot_type: [{required: true, message:'请选择广告样式'}],
                slot_name: [{required: true, message:'请填写广告位名称'}],
                alias: [{ required: true, message: '请填写别名'}],
                material_size: [{ required: true, message: '请选择素材尺寸'}],
                material_type: [{ required: true, message: '请选择素材类型'}],
                slot_price_type: [{ required: true, message: '请选择结算方式'}],
                bidfloor: [{required: true, validator: validatePrice}],
                bidfloor_cpc: [{required: true, validator: validatePrice}],
                is_test_slot: [{ required: true, message: '是否是测试广告位'}],
                is_rta: [{ required: true, message: '请选择是否是RTA类型'}],
                rta_id: [{ required: true, message: '请选择RTA合作方'}],
                need_callback: [{ required: true, message: '请选择激励发放设置'}],
                callback_url: [{ required: true, message: '请填写回调URL'}]
            }
        }
    }
}