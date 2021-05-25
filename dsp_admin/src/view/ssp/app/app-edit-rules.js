export const formRules = {
    data() {
        const appOneTwoCheck = (rule, value, callback) => {
            let _form = this.formBase;

            if (!_form.app_type_one) {
                callback(new Error('请选择应用类型'));
            } else if (!_form.app_type_two) {
                callback(new Error('请选择应用类别'));
            } else {
                callback();
            }
        };
        return {
            ruleBase: { // 正则
                ssp_id: [{required: true, message:'请选择媒体名称'}],
                os_type: [{required: true, message:'请选择应用平台'}],
                app_store_id: [{required: true, message:'请选择应用商店'}],
                app_type_one: [{ required: true, message:'请选择应用类型'}],
                app_type_two: [{ required: true, message:'请选择应用类别'}],
                app_name: [{ required: true, message: '请填写应用名称', trigger: 'blur' }],
                alias: [{ required: true, message: '请填写别名', trigger: 'blur' }],
                package_name: [{ required: true, message: '请输入应用包名', trigger: 'blur' }]
            }
        }
    }
}