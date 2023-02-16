#1 在使用位置引入baseForm组件
    例：<base-form :readOnly="readOnly" ref="baseForm"></base-form>
    属性说明：
        readOnly：对应引**用**表单readOnly属性
        enterpriseShow: 企业模块显示状态
        operationShow: 经营场所模块显示状态

    方法说明：
        getEnterpriseId()：获取企业Id
        getOperationId()：getOperationId

#2 新增方法引入（handleAdd）（需要放在打开dialog后面）
###2.1 通过经营场所id获取
    this.$nextTick(function () {
        this.$refs.baseForm.initBaseForm(this.$store.getters.operationId)
    })
###2.2 通过企业id获取
    this.$nextTick(function () {
        this.$refs.baseForm.initBaseFormByEnterpriseId(this.$store.getters.enterpriseId)
    })

#3 修改与详情方法引入（handleUpdate、handleView）
    前提：详情方法返回的数据中含有enterpriseId字段
###3.1 enterpriseId为经营场所id
    this.$nextTick(function () {
        this.$refs.baseForm.initBaseForm(response.data.enterpriseId)
    })
###3.2 enterpriseId为企业id
    this.$nextTick(function () {
        this.$refs.baseForm.initBaseFormByEnterpriseId(this.$store.getters.enterpriseId)
    })



