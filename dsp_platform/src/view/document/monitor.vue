<template>
    <div class="page-main">
        

        <div :bordered="false" class="card">
            <Affix :offset-top="56">
                <div class="doc-nav-card">
                    <div class="doc-nav-center clearfix">
                        <div class="doc-nav fl">
                            <span :class="navType === 1 ? 'active' : ''" v-if="navType === 1">线索JS上报</span>
                            <span :class="navType === 2 ? 'active' : ''">应用API上报</span>
                        </div>
                        <div class="toggle-catalog fr">
                            <i class="iconfont icon-catalog" title="目录" @click="anchorFlag = !anchorFlag"></i>
                        </div>
                    </div>

                    <Anchor class="anchor" v-show="anchorFlag">
                        <AnchorLink href="#down" title="跟踪应用下载" />
                        <AnchorLink href="#direct" title="跟踪应用直达" />
                        <AnchorLink href="#transform" title="广告主匹配转化用户" />
                        <AnchorLink href="#send" title="监测链接发送服务">
                            <AnchorLink href="#infro" title="接口简介" />
                            <AnchorLink href="#monitor_link" title="监测链接格式" />
                            <AnchorLink href="#req_structure" title="请求结构" />
                        </AnchorLink>
                        <AnchorLink href="#callback" title="转化事件回调服务">
                            <AnchorLink href="#call_req_structure" title="请求结构" />
                            <AnchorLink href="#imp_params" title="重要参数" />
                            <AnchorLink href="#equipment" title="设备信息" />
                            <AnchorLink href="#parameter" title="参数列表" />
                        </AnchorLink>
                    </Anchor>
                </div>
            </Affix>
            
            <div class="doc-center">
                <div class="nav-table" v-if="navType === 1">
                    <div class="item">
                        <h4>场景</h4>
                        <p>广告主投放自有落地页，通过在落地页内添加网际星辰的JS代码来追踪页面内的转化事件。</p>
                        <p>采用该方式追踪时，您需要在落地页中添加平台提供的JS代码，代码检测无误后，即可上报转化事件，追踪落地页转化效果。</p>
                        <p class="red">推荐使用场景：用户转化行为是在广告主自有的落地页完成。</p>
                    </div>
                    <div class="item">
                        <h4>新建线索转化跟踪</h4>
                        <p>广告主平台-工具-转化跟踪-线索跟踪-新建转化</p>
                    </div>
                    <div class="item">
                        <h4>添加监测代码</h4>
                        <p>新建线索转化跟踪后，平台会给出您需要添加在落地页上的代码。代码分为两部分：</p>
                        <p>基础代码：添加在您落地页的<span v-text="'<head>'"></span>与<span v-text="'</head>'"></span>之间，用于收集与上报转化行为。注意：所有需要上报转化的页面中都需要添加基础代码。</p>
                        <p>转化代码：添加在用户触发转化行为之后。例如您将某个点击按钮定义为转化行为，那么用户在点击该按钮后，通过执行转化代码来通知基础代码，基础代码收到通知后记录本次转化行为，发送给平台，记录为一个转化。注意：不支持在iframe中使用转化代码</p>
                    </div>
                    <div class="item">
                        <h4>基础代码</h4>
                        <p>添加在您落地页的<span v-text="'<head>'"></span>与<span v-text="'</head>'"></span>之间，用于收集与上报转化行为。</p>
                        <p class="code" v-text="scriptTxt"></p>
                        <p>注意：所有需要上报转化的页面中都需要添加基础代码，否则会造成转化上报失败，每个广告单元的基础代码都不一样，同一个页面绑定多个广告单元，并且监测转化事件，需要添加多个基础代码</p>
                    </div>
                    <div class="item">
                        <h4>转化代码</h4>
                        <p>在广告主的代码中，添加在用户触发转化行为之后。例如广告主将某个点击按钮定义为转化行为，那么就把转化代码添加在点击按钮的位置。用户实际访问页面时，点击该按钮就会触发转化代码，转化代码会通知基础代码，基础代码收到通知后记录本次转化行为，发送给广告平台，记录为一个转化。</p>
                        <p class="code" v-text="code"></p>
                        <p>注意： 不支持iframe中使用转化代码</p>
                    </div>
                </div>
                <!-- 应用API上报 -->
                <div class="nav-table">
                    <p class="pre-read" id="down">通过移动应用API上报数据，可以实现广告平台和广告主端的信息互通，从而提高广告的优化效果，提高广告投放效率。</p>
                    <div class="item">
                        <h4>跟踪应用下载</h4>
                        <h5>1.为什么要做转化跟踪？</h5>
                        <p>对于应用下载类广告而言，用户点击广告后，会对应用采取“下载-安装-激活-注册/次留/付费等应用内行为”的由浅入深的操作。在应用的不同投放阶段，广告主希望能够获取不同深度的用户，那些广告主希望用户达成的操作就是“转化目标”（例如，倘若广告主希望获取到更多激活的用户，那么“激活”就是“转化目标”；倘若广告主希望获取到更多的注册用户，那么“注册”就是“转化目标”）。</p>
                        <p>广告平台会根据满足转化目标的用户的特征为广告主找到更多更可能实现转化目标的用户。</p>
                        <p>但是，广告平台只能监测到用户在广告端的广告展示和点击等行为，无法监测到用户的应用内行为；广告主可以监测到用户的应用内行为，无法监测到用户在广告端的广告展示和点击行为。因此，我们需要“转化跟踪”来实现信息的互通，从而提高广告的优化效果，提高广告投放效率。</p>
                        <h5>2.“应用下载API”与“转化跟踪”是什么关系？</h5>
                        <p>“应用下载API”是一种接口，是实现“转化跟踪的方式之一。</p>
                        <h5>3.“应用下载API”的基本步骤</h5>
                        <p>（1）用户点击广告，广告平台将收集到的、全部的广告展示点击等行为通过监测链接发送给客户。前述数据除必要的加密安全处理外，广告平台不会进行任何人为处理。</p>
                        <p>（2）广告主收到的信息与自己监测到的用户转化目标相关的信息进行匹配。</p>
                        <p id="direct">（3）将匹配成功的转化信息发送至广告平台的回调地址。</p>
                    </div>
                    <div class="item">
                        <h4>跟踪应用直达</h4>
                        <h5>1.调起类广告为什么要做转化跟踪</h5>
                        <p>对于调起类广告而言，使用移动API回传的方式有利于提高调起类广告转化率，降低转化成本，提高跑量速度。可以根据用户在第三方APP的关键行为调整投放群体，将广告投给最可能完成关键操作的用户。</p>
                        <h5>2.激活过程是否一定需要广告主的技术人员参与？</h5>
                        <p id="transform">是的。该对接过程需要广告主配合开发，在激活联调过程中，需确认广告主能够正常接收用户行为数据，成功匹配转化目标，并成功回传事件。</p>
                    </div>
                    <div class="item">
                        <h4>广告主匹配转化用户</h4>
                        <h5>1.说明</h5>
                        <p>广告主将自己统计到的达到转化目标的用户的信息与广告平台发给广告主的广告展示点击信息进行匹配。匹配基于二者的用户设备信息是否一致。</p>
                        <h5>2.匹配方式</h5>
                        <p>广告平台会提供给广告主广告展示点击用户的IMEI、IDFA、MAC、ANDROIDID、OPENUDID、IP、UA等设备信息，广告主将其与自己监测到的转化用户的相关信息进行匹配。例如，广告平台这边监测到imei号为123456789的用户在某媒体上点击了广告主的相关广告，广告平台会将该用户的相关信息通过监测链接发送给广告主。广告主监测到imei号分别为123456789和abcdefgh的两个新增转化用户，则广告主需要将这两个用户的设备信息与之前广告平台发送给广告主的用户信息进行匹配，imei号为123456789的用户成功匹配，则将该用户的信息通过回调地址回调给广告平台；imei号为abcdefgh的用户无法成功匹配，则无需将其回传给广告平台。</p>
                        <h5>3.注意事项</h5>
                        <p id="send">(1)、建议广告主基于多个设备信息进行匹配，以避免某项设备信息缺失造成的无法匹配（高版本安卓和IOS系统获取imei/idfa的成功率偏低）。例如：某些设备获取IMEI失败，但是成功获取了ANDROIDID且成功匹配上，那么依然可以算作有效的转化。</p>
                        <p id="infro">(2)、请匹配7天内的转化，例如，如果监测到的“激活”是在广告点击行为的7天以后，将不会作为有效的转化。</p>
                    </div>
                    <div class="item">
                        <h4>监测链接发送服务</h4>
                        <h5>1.接口简介</h5>
                        <p id="monitor_link">广告主在创建应用转化跟踪的时候，会填写“点击监测链接”和“展示监测链接”，用来接收广告平台发出的点击和展示事件。通过约定指定格式的字符串，用以代表将来将要替换的字段位置，这个格式我们统称为“宏”。</p>
                        <h5>2.监测链接格式</h5>
                        <p>监测链接主要由"https://XXXX.XXX.com?"+"参数"+"CALLBACK_URL或者CALLBACK_PARAM"+其他部分组成，且总大小不得超过10K。具体格式如下：</p>
                        <p>(1) 监测链接的前缀格式为：</p>
                        <p>https://XXX.XXX.com?</p>
                        <p>(2) 宏“参数”的格式为“__参数__”，其中：参数必须全部大写，头条支持宏参数请见下方; “__参数__”格式中参数两边为双下划线，即参数左右两边均为两个连续的英文字符'_' ; 广告主可以根据自己的需要选择具体填写哪些参数，支持参数详见参数列表; 监测链接支持大小写字母、数字以及下划线字符。</p>
                        <p>(3) 举例</p>
                        <p>a. 广告主填写的监测链接如下：</p>
                        <p class="code" v-text="scriptTxt2"></p>
                        <p>这里的 “__AID__ ”，就是一个宏，代表将来真实的 AID 字段会在这里填写。</p>
                        <p>当用户真实产生了广告点击的时候，我们会把相应的字段换成真实的广告信息，发送给广告主。</p>
                        <p>b. 广告主收到的真实请求</p>
                        <p id="req_structure" class="code" v-text="scriptTxt3"></p>
                        <p>其中下划线的部分，就是我们替换后的真实广告信息（非 ASC 字符，进行了 url encode）</p>
                        <h5>3.请求结构</h5>
                        <p>(1) 通信协议</p>
                        <p>为了获得更高的安全性，推荐您使用HTTPS进行请求通信。</p>
                        <p>(2) 请求方法</p>
                        <p>支持HTTP GET方法发送请求，这种方式下请求参数需要包含在请求的URL中。</p>
                        <p>(3) 字符编码</p>
                        <p>UTF-8</p>
                        <p>(4) 参数列表</p>
                        <Table stripe border :columns="columns1" :data="data1"></Table>
                        <p>(5) 示例</p>
                        <p>a. IOS 示例</p>
                        <p>方案一</p>
                        <p>https://xxxx.xxx.com?adid=__AID__&idfa=__IDFA__&mac=__MAC__&os=__OS__&TIMESTAMP=__TS__&callback_url=__CALLBACK_URL__</p>
                        <p>方案二</p>
                        <p>https://xxxx.xxx.com?adid=__AID__&idfa=__IDFA__&mac=__MAC__&os=__OS__&TIMESTAMP=__TS__&callback=__CALLBACK_PARAM__</p>
                        <br>
                        <p>b. Android 示例</p>
                        <p>方案一</p>
                        <p>https://xxxx.xxx.com?adid=__AID__&imei=__IMEI__&mac=__MAC__&oaid=__OAID__&androidid=__ANDROIDID__&os=__OS__&TIMESTAMP=__TS__&callback_url=__CALLBACK_URL__</p>
                        <p id="callback">方案二</p>
                        <p>https://xxxx.xxx.com?adid=__AID__&imei=__IMEI__&mac=__MAC__&oaid=__OAID__&androidid=__ANDROIDID__&os=__OS__&TIMESTAMP=__TS__&callback=__CALLBACK_PARAM__</p>
                    </div>
                    <div class="item">
                        <h4>转化事件回调服务</h4>
                        <p id="call_req_structure">广告主在收到广告平台下发的点击或者展示事件后（通过应用跟踪回调API），需要进行用户的归因。在完成归因后，广告主需要将相应的转化事件信息传递给广告平台，并以此计算一次转化。转化事件回传接口，就是用来接受广告主自己定义的转化事件的接口，通过调用应用跟踪回调API，可以将广告主的广告转化相关数据回传给广告平台。</p>
                        <h5>1.请求结构</h5>
                        <p>(1) 接口地址</p>
                        <p>(2) 通信协议</p>
                        <p>为了获得更高的安全性，推荐您使用HTTPS进行请求通信</p>
                        <p>(3) 请求方法</p>
                        <p>支持HTTP GET方法发送请求，这种方式下请求参数需要包含在请求的URL中。</p>
                        <p>(4) 字符编码</p>
                        <p>统一采用 UTF-8 的编码格式，url 中的参数如果包含非 ASC 字符，需要进行 url encode 传递</p>
                        <p>假如我们需要传入一个字段，props = {"aaa":"bbb"}，我们需要对 json 字符串进行 encode</p>
                        <p id="imp_params">https://xxx.xxx.xxxx/track/activate/?callback=xxxx&props=%7B%22aaa%22%3A%22bbb%22%7D</p>
                        <br>
                        <h5>2.重要参数</h5>
                        <p>点击事件</p>
                        <p>我们的点击事件，在下发给广告主的时候，会有一个callback字段，这个字段是一个加密字符串，用以标记我们对转化事件的匹配，不可或缺。在广告主调用我们接口的时候，需要把这个参数传递回来。</p>
                        <br>
                        <p>Event_type</p>
                        <p>event_type 代表的是事件类型，这个值是一个数字类型枚举值，如果回传的值既不在枚举范围内，也未曾与广告平台进行其他形式的确认，广告平台将无法识别具体事件类型。具体取值如下：</p>
                        <Table stripe border :columns="columns2" :data="data2"></Table>
                        <p id="equipment"></p>
                        <br>
                        <br>
                        <br>
                        <h5>3.设备信息</h5>
                        <p>设备信息包含：idfa、imei、oaid 、muid四种。设备信息为必传字段，支持两种传递的组合形式：</p>
                        <p>组合一： idfa / imei / oaid 组合</p>
                        <p>组合二： os / muid 组合</p>
                        <p>两种组合任选其一即可。</p>
                        <Table stripe border :columns="columns3" :data="data3"></Table>
                        <br>
                        <h5 id="parameter">4.参数列表</h5>
                        <Table stripe border :columns="columns4" :data="data4"></Table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { showTitle } from '@/libs/util'
export default {
    name: 'document-monitor',
    data() {
        return {
            anchorFlag: false, // 目录是否展开
            navType: 2,
            scriptTxt: '<script type="text/javascript" smum="si=10045&src=13" src="http://www.wjxcdn.com/tools/smum.js',
            scriptTxt2: 'https://mybest.custom.com/click/?aid=__AID__&callback_url=__CALLBACK_URL__',
            scriptTxt3: 'https://mybest.custom.com/click/?aid=123123123123&cid=321321321321&callback=EJiw267wvfQCGKf2g74ZIPD89vIATAMOAFCIjIwMTkxMTI3MTQxMTEzMDEwMDI2MDc3MjE1MTUwNTczNTBIAQ%3D%3D',
            code: '_SMUM_.f.r("view")',

            columns1: [
                {
                    title: '宏',
                    key: 'name',
                    width: 120
                },
                {
                    title: '含义',
                    key: 'mean'
                },
                {
                    title: '举例',
                    key: 'example'
                },
                {
                    title: '支持监测行为',
                    key: 'action',
                    width: 160
                }
            ],
            data1: [
                {
                    name: 'ADVERTISE_ID',
                    mean: '广告主ID',
                    example: '2341',
                    action: '点击'
                },
                {
                    name: 'AID',
                    mean: '广告单元ID',
                    example: '123',
                    action: '点击、展示均支持'
                },
                {
                    name: 'CONVERT_ID',
                    mean: '转化ID',
                    example: '243',
                    action: '点击、展示均支持'
                },
                {
                    name: 'REQUEST_ID',
                    mean: '请求下发的ID',
                    example: '',
                    action: '点击'
                },
                {
                    name: 'IMEI',
                    mean: '安卓的设备 ID 的 md5 摘要，32位',
                    example: '假设原始的 imei 是 868823031739689我们最终发送的是 imei 的 md5 摘要：0c2bd03c39f19845bf54ea0abafae70e，会存在部分无法获取imei的情况，则imei会回传空字符串或者0的md5摘要',
                    action: '点击、展示均支持'
                },
                {
                    name: 'IDFA',
                    mean: 'IOS 6+的设备id字段，32位',
                    example: '样例：4FCFEFA1-096D-4176-B352-1870ED6DB777注意，一些例外00000000-0000-0000-0000-000000000000如果用户关闭里读取idfa的权限，会导致idfa全部是0   ',
                    action: '点击、展示均支持'
                },
                {
                    name: 'ANDROIDID',
                    mean: '安卓id原值的md5，32位',
                    example: '样例，androidId的原值是： 7b5ca2d57178d2f1我们进行md5摘要，最终结果是：873541edf36da9170af47d5b69e82193',
                    action: '点击、展示均支持'
                },
                {
                    name: 'OAID',
                    mean: 'Android Q及更高版本的设备号，32位',
                    example: '样例：97e7ef3f-e5f2-d0b8-ccfc-f79bbeaf4841注意，一些例外如果无法获取oaid，oaid会传空字符串',
                    action: '点击'
                },
                {
                    name: 'OAID_MD5',
                    mean: 'Android Q及更高版本的设备号的md5摘要，32位',
                    example: '样例:87f8274c36eb73fabcbf143a10eca6a4，会存在部分无法获取oaid的情况，则该字段会回传空字符串',
                    action: '点击'
                },
                {
                    name: 'OS',
                    mean: '操作系统平台',
                    example: '安卓：0; IOS：1; 其他：3',
                    action: '点击、展示均支持'
                },
                {
                    name: 'MAC',
                    mean: '移动设备mac地址,转换成大写字母,去掉“:”，并且取md5摘要后的结果',
                    example: '假设原始的mac地址是34:d7:12:9b:3a:89去掉“：”后变成 34d7129b3a89变成大写字母34D7129B3A89取MD5摘要，最后变成如下结果:df97bc5021e14256e141b2f036df5a3c',
                    action: '点击、展示均支持'
                },
                {
                    name: 'MAC1',
                    mean: '移动设备 mac 地址,转换成大写字母,并且取md5摘要后的结果，32位',
                    example: '假设原始的mac地址是 34:d7:12:9b:3a:89变成大写字母： 34:D7:12:9B:3A:89进行MD5摘要，最后变成如下结果：4d0433eb614f5d5ad409a65395426cbe',
                    action: '点击'
                },
                {
                    name: 'IP',
                    mean: '媒体投放系统获取的用户终端的公共IP地址',
                    example: '样例：61.158.146.195或240e:398:1c90:9d00:5513:b9c9:650a:d9d2',
                    action: '点击、展示均支持'
                },
                {
                    name: 'UA',
                    mean: '用户代理(User Agent)，一个特殊字符串头，使得服务器能够识别客户使用的操作系统及版本、CPU类型、浏览器及版本、浏览器渲染引擎、浏览器语言、浏览器插件等',
                    example: '样例：News 7.4.5 rv:7.4.5.23\(iPhone; iOS 12.4.1; zh_CN\)Crone',
                    action: '点击、展示均支持'
                },
                {
                    name: 'GEO',
                    mean: '位置信息，包含三部分:latitude（纬度），longitude（经度）以及precise（确切信息,精度）',
                    example: '十进制保留1位小数，西经南纬保留负数，用字母 x 分 割纬度与精度 (先纬后经，最后精度），如：35.7x122.4x100.0',
                    action: '点击、展示均支持'
                },
                {
                    name: 'TS',
                    mean: '客户端发生广告点击事件的时间，以毫秒为单位时间戳',
                    example: '样例：1575194434000',
                    action: '点击、展示均支持'
                },
                {
                    name: 'CALLBACK_PARAM',
                    mean: '一些跟广告信息相关的回调参数，内容是一个加密字符串，在调用事件回传接口的时候会用到',
                    example: '样例：EJiw267wvfQCGKf2g74ZIPD89-vIATAMOAFCIjIwMTkxMTI3MTQxMTEzMDEwMDI2MDc3MjE1MTUwNTczNTBIAQ==',
                    action: '点击、展示均支持'
                },
                {
                    name: 'CALLBACK_URL',
                    mean: '直接把调用事件回传接口的url生成出来，广告主可以直接使用',
                    example: '样例：https://ad.toutiao.com/track/activate/?callback=EJiw267wvfQCGKf2g74ZIPD89-vIATAMOAFCIjIwMTkxMTI3MTQxMTEzMDEwMDI2MDc3MjE1MTUwNTczNTBIAQ==&os=0&muid=db94e6a60a9c6661e3e03a7d301c25b6',
                    action: '点击、展示均支持'
                },
            ],
            columns2: [
                {
                    title: '取值',
                    key: 'value',
                    width: 100,
                },
                {
                    title: '事件名称',
                    key: 'event',
                    width: 200
                },
                {
                    title: '定义',
                    key: 'define'
                }
            ],
            data2: [
                {
                    value: '0',
                    event: '激活',
                    define: '用户下载安装完毕应用之后，在联网环境下打开应用'
                },
                {
                    value: '1',
                    event: '注册',
                    define: '完成应用下载并且在联网环境打开应用后，完成个人账号/游戏角色注册信息提交'
                },
                {
                    value: '2',
                    event: '付费',
                    define: '完成应用下载并且在联网环境打开应用后，应用内完成一笔付款'
                },
                {
                    value: '3',
                    event: '表单',
                    define: '完成表单填写并提交'
                },
                {
                    value: '4',
                    event: '在线咨询',
                    define: '用户点击在线咨询按钮'
                },
                {
                    value: '5',
                    event: '有效咨询',
                    define: '用户在消息咨询页面内完成至少一句消息对话'
                },

                {
                    value: '6',
                    event: '次留',
                    define: '用户激活后次日联网环境下打开应用'
                },
                {
                    value: '7',
                    event: 'app内下单',
                    define: '在应用内完成一次订单提交，例如：点击“立即下单”'
                },
                {
                    value: '8',
                    event: 'app内访问',
                    define: '用户成功打开访问应用'
                },

                {
                    value: '9',
                    event: 'app内添加购物车',
                    define: '在应用内成功将商品加入购物车，例如：点击“加入购物车”'
                },
                {
                    value: '10',
                    event: 'app内付费',
                    define: '在应用内完成一次订单付费。目前主要是电商行业使用，常规建议使用付费事件'
                }
            ],
            columns3: [
                {
                    title: '组合',
                    key: 'value',
                    width: 100,
                },
                {
                    title: '参数名',
                    key: 'params',
                    width: 200
                },
                {
                    title: '释义',
                    key: 'define'
                },
                {
                    title: '举例',
                    key: 'example'
                }
            ],
            data3: [
                {
                    value: '组合一',
                    params: 'idfa',
                    define: 'ios系统idfa的原值',
                    example: 'FCD369C3-F622-43B8-AFDE-12012349F35B'
                },
                {
                    value: '组合二',
                    params: 'imei',
                    define: '安卓系统 imei 的md5摘要',
                    example: '0c2bd03c39f19845bf54ea0abafae70e'
                },
                {
                    value: '组合三',
                    params: 'os',
                    define: '操作系统',
                    example: 'ios'
                },
                {
                    value: '组合四',
                    params: 'muid',
                    define: '如果是安卓，就返回 imei 的md5摘要；如果是 IOS，就返回 idfa 原值',
                    example: 'b315ef2fefddfea2'
                }
            ],
            columns4: [
                {
                    title: '参数',
                    key: 'params',
                    width: 100,
                },
                {
                    title: '是否必须',
                    key: 'ismust',
                    width: 200
                },
                {
                    title: '含义',
                    key: 'define'
                },
                {
                    title: '举例',
                    key: 'example'
                }
            ],
            data4: [
                {
                    params: 'callback',
                    ismust: '是（点击事件）',
                    define: '点击检测下发的 callback',
                    example: 'EJiw267wvfQCGKf2g74ZIPD89-vIATAMOAFCIjIwMTkxMTI3MTQxMTEzMDEwMDI2MDc3MjE1MTUwNTczNTBIAQ=='
                },
                {
                    params: 'imei',
                    ismust: '是',
                    define: '安卓手机 imei 的 md5 摘要',
                    example: '0c2bd03c39f19845bf54ea0abafae70e'
                },
                {
                    params: 'Idfa',
                    ismust: '是',
                    define: 'ios 手机的 idfa 原值',
                    example: 'FCD369C3-F622-44B8-AFDE-12065659F34B'
                },
                {
                    params: 'muid',
                    ismust: '是',
                    define: '安卓手机 imei 的 md5 摘要,ios 手机的 idfa 原值',
                    example: 'FCD369C3-F622-44B8-AFDE-12065659F34B'
                },
                {
                    params: 'oaid',
                    ismust: '是',
                    define: 'Android Q 版本的 oaid 原值',
                    example: 'b305ee2fefddfea2'
                },
                {
                    params: 'oaid_md5',
                    ismust: '否',
                    define: 'Android Q 版本的 oaid 原值的md5摘要',
                    example: '8FCF82C6-47E7-2679-2F44-37405B982580'
                },

                {
                    params: 'os',
                    ismust: '是',
                    define: '客户端的操作系统类型',
                    example: '0:android ; 1: ios'
                },
                {
                    params: 'source',
                    ismust: '否',
                    define: '数据来源，广告主可自行定义',
                    example: 'conv_time'
                },
                {
                    params: 'conv_time',
                    ismust: '否',
                    define: '转化发生的时间，UTC 时间戳',
                    example: '1574758519'
                },
                {
                    params: 'event_type',
                    ismust: '是',
                    define: '事件类型',
                    example: '见列表'
                },
                {
                    params: 'match_type',
                    ismust: '否',
                    define: '归因方式',
                    example: '0:点击 1:展示 2:有效播放归因'
                }
            ]
        }
    },
    computed: {
        headTitle() {
            return showTitle(this.$route, this)
        }
    },
    created() {
        
    },
    methods: {
        
    }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.card
    background-color: #FFF
.page-main
    position: relative
    /deep/ .ivu-card-body
        padding-top: 0px
        padding-bottom: 0px
.doc-nav-card
    background-color: #FFF
    padding: 0 25px
    position: relative
    .doc-nav-center
        border-bottom: 1px solid #EBEBEB
    .doc-nav
        span
            line-height: 64px
            display: inline-block
            font-size: 18px
            margin-right: 20px
            position: relative
            cursor: pointer
            &.active
                color: #465CFE
                &:after
                    content: ''
                    position: absolute
                    left: 0px
                    width: 100%
                    height: 2px
                    background-color: #465CFE
                    bottom: -1px
.doc-center
    padding: 20px 25px
    .item
        margin-bottom: 20px
        h4
            font-size: 16px
            line-height: 2
            color: #465CFE
        h5
            font-size: 14px
            line-height: 2
            color: #333333
        p
            line-height: 2
            color: #666666
        .code
            margin: 4px 0
            padding: 0 10px
            background-color: #FAFAFA
            border: 1px solid #EBEBEB
        &:last-child
            margin-bottom: 0px
    .pre-read
        margin-bottom: 20px
.anchor
    position: absolute
    right: 0px
    top: 66px
    z-index: 1
    border-radius: 4px
    overflow: hidden
    box-shadow: 0px 0px 7px 0px rgba(49, 49, 49, 0.19);
    /deep/
        .ivu-anchor
            padding-left: 0px
            background-color: #FFF
        .ivu-anchor-ink
            display: none
        .ivu-anchor-link
            padding: 8px
.toggle-catalog
    line-height: 64px
    .icon-catalog
        display: inline-block
        width: 40px
        height: 40px
        vertical-align: middle
        font-size: 18px
        text-align: right
        line-height: 40px
        cursor: pointer
</style>
