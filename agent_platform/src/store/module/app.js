import {
    getBreadCrumbList,
    setTagNavListInLocalstorage,
    getTagNavListFromLocalstorage,
    getHomeRoute,
    routeHasExist,
    getRouteTitleHandled,
    localSave,
    localRead
} from '@/libs/util'

import config from '@/config'

const {homeName} = config

export default {
    state: {
        breadCrumbList: [],
        tagNavList: [],
        homeRoute: {},
        local: localRead('local'),
        errorList: [],
        hasReadErrorPage: false,
        osTypeArr: [ // 应用终端
            {
                id: 1,
                name: 'Andorid'
            },
            {
                id: 2,
                name: 'IOS'
            }
        ],
        putPlatform: [ // 投放平台
            {
                id: 1,
                label: 'H5'
            },
            {
                id: 2,
                label: 'Webview-H5'
            },
            {
                id: 3,
                label: 'INAPP'
            }
        ],
        adSceneData: [ //  选择广告场景
            {
                id: 1,
                icon: 'yuanshengAd',
                title: '原生信息流广告',
                intro: 'APP列表页/文章详情页的原生图文/视频广告',
                moban: 1,
                zxr: 1
            },
            {
                id: 2,
                icon: 'bannerAd',
                title: 'Banner广告',
                intro: 'APP页面顶部/中部/底部固定或悬浮的可关闭广告',
                moban: 0,
                zxr: 0
            },
            {
                id: 3,
                icon: 'kaipinAd',
                title: '开屏广告',
                intro: 'APP开启后展示的优质图片或视频广告',
                moban: 0,
                zxr: 0
            },
            {
                id: 4,
                icon: 'chapinAd',
                title: '插屏广告',
                intro: 'APP弹出窗口里的广告，同时支持全屏视频插屏广告',
                moban: 0,
                zxr: 0
            },
            {
                id: 5,
                icon: 'jiliAd',
                title: '激励视频广告',
                intro: '用户可以通过观看完整的视频广告获得奖励',
                moban: 0,
                zxr: 0
            },
            {
                id: 6,
                icon: 'changshipinAd',
                title: '长视频广告',
                intro: '竖版视频信息流，与视频产品高度融合',
                moban: 0,
                zxr: 0
            }
            // {
            //     id: 7,
            //     icon: 'hudongAd',
            //     title: 'VR',
            //     intro: '有趣的交互体验，用户参与度高'
            // },
            // {
            //     id: 8,
            //     icon: 'hudongAd',
            //     title: '交互广告',
            //     intro: '有趣的交互体验，用户参与度高',
            //     moban: 0,
            //     zxr: 0
            // }
        ],
        adStyleData: [ // 广告样式
            // 1. 创建创意包时，判断是否支持视频，使用的是sdkAttr里的video
            {
                id: 160,
                parentId: 1,
                icon: 'u-tu-d-wen',
                title: '上图下文',
                intro: '宽高比16：9  |  支持视频',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 1,
                    zxr: 1,
                    photo: 1,
                    video: 1
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 1
                },
                size: [ // 物料尺寸
                    {
                        ratio: '16:9',
                        minSize: {
                            w: 640,
                            h: 360
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img', 'title', 'dp'], // 1图+1标题+1ldp
                        video: ['cImg', 'title', 'video', 'dp'] // 1封面图+1标题+1视频+1dp
                    },
                    download: {
                        img: ['img', 'title', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1图+1标题+下载链接+包名+应用icon+应用名称
                        video: ['cImg', 'video', 'downlink', 'appPackageName', 'appIcon', 'appName'] // 1封面图+1视频+下载链接+包名+应用icon+应用名称
                    }
                }
            },
            {
                id: 170,
                parentId: 1,
                icon: 'u-wen-d-tu',
                title: '上文下图',
                intro: '宽高比16：9  |  支持视频',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 1,
                    zxr: 1,
                    photo: 1,
                    video: 1
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 1
                },
                size: [
                    {
                        ratio: '16:9',
                        minSize: {
                            w: 640,
                            h: 360
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img', 'title', 'dp'], // 1图+1标题+1ldp
                        video: ['cImg', 'title', 'video', 'dp'] // 1封面图+1标题+1视频+1dp
                    },
                    download: {
                        img: ['img', 'title', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1图+1标题+下载链接+包名+应用icon+应用名称
                        video: ['cImg', 'video', 'downlink', 'appPackageName', 'appIcon', 'appName'] // 1封面图+1视频+下载链接+包名+应用icon+应用名称
                    }
                }
            },
            {
                id: 180,
                parentId: 1,
                icon: 'l-tu-r-wen',
                title: '左图右文',
                intro: '宽高比3：2',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 1,
                    zxr: 1,
                    photo: 1,
                    video: 0
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 0
                },
                size: [
                    {
                        ratio: '3:2',
                        minSize: {
                            w: 360,
                            h: 240
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img', 'title', 'dp'], // 1图+1标题+1ldp
                        video: []
                    },
                    download: {
                        img: ['img', 'title', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1图+1标题+下载链接+包名+应用icon+应用名称
                        video: []
                    }
                }
            },
            {
                id: 190,
                parentId: 1,
                icon: 'l-wen-r-tu',
                title: '左文右图',
                intro: '宽高比3：2',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 1,
                    zxr: 1,
                    photo: 1,
                    video: 0
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 0
                },
                size: [
                    {
                        ratio: '3:2',
                        minSize: {
                            w: 360,
                            h: 240
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img', 'title', 'dp'], // 1图+1标题+1ldp
                        video: []
                    },
                    download: {
                        img: ['img', 'title', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1图+1标题+下载链接+包名+应用icon+应用名称
                        video: []
                    }
                }
            },
            {
                id: 200,
                parentId: 1,
                icon: 's-wen-s-tu',
                title: '双图双文',
                intro: '宽高比16：9  |  支持视频',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 1,
                    zxr: 1,
                    photo: 1,
                    video: 1
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 1
                },
                size: [
                    {
                        ratio: '16:9',
                        minSize: {
                            w: 640,
                            h: 360
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['logo', 'img', 'title', 'describe', 'dp'], // 1logo+1图+1标题+1描述+1ldp
                        video: ['logo', 'cImg', 'title', 'video', 'describe'] // 1logo+封面图+1标题+1视频+1dp+1描述
                    },
                    download: {
                        img: ['logo', 'img', 'title', 'describe', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1logo+1图+1标题+1描述+下载链接+包名
                        video: ['logo', 'title', 'describe', 'cImg', 'video', 'downlink', 'appPackageName', 'appIcon', 'appName'] // 1logo+1标题+1描述+1封面图+1视频+下载链接+包名+应用icon+应用名称
                    }
                }
            },
            {
                id: 210,
                parentId: 1,
                icon: 'tu-row',
                title: '纯图片(横)',
                intro: '宽高比16：9  |  支持视频',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 1,
                    zxr: 1,
                    photo: 1,
                    video: 1
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 1
                },
                size: [
                    {
                        ratio: '16:9',
                        minSize: {
                            w: 640,
                            h: 360
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img', 'dp'], // 1图+1ldp
                        video: ['cImg', 'video', 'dp'] // 1封面图+1视频+1dp
                    },
                    download: {
                        img: ['img', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1图+下载链接+包名
                        video: ['cImg', 'video', 'downlink', 'appPackageName', 'appIcon', 'appName'] // 1封面图+1视频+下载链接+包名+应用icon+应用名称
                    }
                }
            },
            {
                id: 220,
                parentId: 1,
                icon: 'three-tu',
                title: '三图',
                intro: '宽高比3：2',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 1,
                    zxr: 1,
                    photo: 1,
                    video: 0
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 0
                },
                size: [
                    {
                        ratio: '3:2',
                        minSize: {
                            w: 300,
                            h: 200
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img*3', 'title', 'dp'], // 3图+1标题+1ld
                        video: []
                    },
                    download: {
                        img: ['img*3', 'title', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 3图+1标题+下载链接+包名
                        video: []
                    }
                }
            },
            {
                id: 225,
                parentId: 1,
                icon: 'two-tu',
                title: '二图',
                intro: '宽高比2：1',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 1,
                    zxr: 1,
                    photo: 1,
                    video: 0
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 0
                },
                size: [
                    {
                        ratio: '2:1',
                        minSize: {
                            w: 300,
                            h: 150
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img*2', 'title', 'dp'], // 2图+1标题+1ldp
                        video: []
                    },
                    download: {
                        img: ['img*2', 'title', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 2图+1标题+下载链接+包名
                        video: []
                    }
                }
            },
            {
                id: 230,
                parentId: 1,
                icon: 'wen-u-wen-d-tu',
                title: '文字浮层-上文下图',
                intro: '宽高比16：9',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 1,
                    zxr: 1,
                    photo: 1,
                    video: 0
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 0
                },
                size: [
                    {
                        ratio: '16:9',
                        minSize: {
                            w: 640,
                            h: 360
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img', 'title', 'describe', 'dp'], // 1图+1标题+1描述+1ldp
                        video: []
                    },
                    download: {
                        img: ['img', 'title', 'describe', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1图+1标题+1描述+下载链接+包名
                        video: []
                    }
                }
            },
            {
                id: 240,
                parentId: 1,
                icon: 'wen-u-tu-d-wen',
                title: '文字浮层-上图下文',
                intro: '宽高比16：9',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 1,
                    zxr: 1,
                    photo: 1,
                    video: 0
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 0
                },
                size: [
                    {
                        ratio: '16:9',
                        minSize: {
                            w: 640,
                            h: 360
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img', 'title', 'describe', 'dp'], // 1图+1标题+1描述+1ldp
                        video: []
                    },
                    download: {
                        img: ['img', 'title', 'describe', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1图+1标题+1描述+下载链接+包名
                        video: []
                    }
                }
            },
            {
                id: 250,
                parentId: 1,
                icon: 'wen-single',
                title: '文字浮层-单图',
                intro: '宽高比16：9',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 1,
                    zxr: 1,
                    photo: 1,
                    video: 0
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 0
                },
                size: [
                    {
                        ratio: '16:9',
                        minSize: {
                            w: 640,
                            h: 360
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img', 'describe', 'dp'], // 1图+1描述+1ldp
                        video: []
                    },
                    download: {
                        img: ['img', 'describe', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1图+1描述+下载链接+包名
                        video: []
                    }
                }
            },
            {
                id: 255,
                parentId: 1,
                icon: 'graph-brief',
                title: '图文摘要',
                intro: '宽高比1：1',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 1,
                    zxr: 1,
                    photo: 1,
                    video: 0
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 0
                },
                size: [
                    {
                        ratio: '1:1',
                        minSize: {
                            w: 100,
                            h: 100
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img', 'title', 'describe', 'dp'], // 1图+1标题+1描述+1ldp
                        video: []
                    },
                    download: {
                        img: ['img', 'describe', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1图+1描述+下载链接+包名
                        video: []
                    }
                }
            },
            {
                id: 260,
                parentId: 1,
                icon: 'tu-colmn',
                title: '纯图片(竖)',
                intro: '宽高比9：16',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 1,
                    zxr: 1,
                    photo: 1,
                    video: 0
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 0
                },
                size: [
                    {
                        ratio: '9:16',
                        minSize: {
                            w: 720,
                            h: 1280
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img', 'dp'], // 1图+1ldp
                        video: []
                    },
                    download: {
                        img: ['img', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1图+下载链接+包名
                        video: []
                    }
                }
            },
            {
                id: 270,
                parentId: 2,
                icon: 'banner-banner',
                title: 'Banner',
                intro: '宽高比32：5',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 0,
                    zxr: 0,
                    photo: 1,
                    video: 0
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 0
                },
                size: [
                    {
                        ratio: '6.4:1',
                        minSize: {
                            w: 640,
                            h: 100
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img', 'dp'], // 1图+1ldp
                        video: []
                    },
                    download: {
                        img: ['img', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1图+下载链接+包名
                        video: []
                    }
                }
            },
            {
                id: 290,
                parentId: 3,
                icon: 'kaipin',
                title: '开屏',
                intro: '宽高比9：16  |  支持视频',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 0,
                    zxr: 0,
                    photo: 1,
                    video: 1
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 1
                },
                size: [
                    {
                        ratio: '9:16',
                        minSize: {
                            w: 1080,
                            h: 1920
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img', 'dp'], // 1图+1ldp
                        video: ['cImg', 'video', 'dp'] // 1封面图+视频+1dp
                    },
                    download: {
                        img: ['img', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1图+下载链接+包名
                        video: ['cImg', 'video', 'downlink', 'appPackageName', 'appIcon', 'appName'] // 1封面图+1视频+下载链接+包名+应用icon+应用名称
                    }
                }
            },
            {
                id: 300,
                parentId: 4,
                icon: 'chapin-row',
                title: '横版',
                intro: '宽高比1：1  |  支持视频',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 0,
                    zxr: 0,
                    photo: 1,
                    video: 1
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 1
                },
                size: [
                    {
                        ratio: '1:1',
                        minSize: {
                            w: 300,
                            h: 300
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img', 'dp'], // 1图+1ldp
                        video: ['cImg', 'video', 'dp'] // 1封面图+1视频+1dp
                    },
                    download: {
                        img: ['img', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1图+下载链接+包名
                        video: ['cImg', 'video', 'downlink', 'appPackageName', 'appIcon', 'appName'] // 1封面图+1视频+下载链接+包名+应用icon+应用名称
                    }
                }
            },
            {
                id: 301,
                parentId: 4,
                icon: 'cha-row-column',
                title: '横/竖版',
                intro: '宽高比1：1 / 2：3  |  支持视频',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 0,
                    zxr: 0,
                    photo: 1,
                    video: 1
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 1,
                    video: 1
                },
                size: [
                    {
                        ratio: '2:3',
                        minSize: {
                            w: 200,
                            h: 300
                        }
                    },
                    {
                        ratio: '1:1',
                        minSize: {
                            w: 300,
                            h: 300
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: ['img', 'dp'], // 1图+1ldp
                        video: ['cImg', 'video', 'dp'] // 1封面图+1视频+1dp
                    },
                    download: {
                        img: ['img', 'downlink', 'appPackageName', 'appIcon', 'appName'], // 1图+下载链接+包名
                        video: ['cImg', 'video', 'downlink', 'appPackageName', 'appIcon', 'appName'] // 1封面图+1视频+下载链接+包名+应用icon+应用名称
                    }
                }
            },
            {
                id: 302,
                parentId: 4,
                icon: 'full-video',
                title: '全屏插屏-视频',
                intro: '宽高比9：16 / 16：9',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 0,
                    zxr: 0,
                    photo: 0,
                    video: 1
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 0,
                    video: 1
                },
                size: [
                    {
                        ratio: '9:16',
                        minSize: {
                            w: 720,
                            h: 1280
                        }
                    },
                    {
                        ratio: '16:9',
                        minSize: {
                            w: 1280,
                            h: 720
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: [],
                        video: ['video', 'dp', 'logo', 'cImg', 'describe', 'title'] // 1视频+1ldp+1logo+1封面+1描述+标题
                    },
                    download: {
                        img: [],
                        video: ['video', 'logo', 'cImg', 'downlink', 'appPackageName', 'appIcon', 'describe', 'appName', 'title'] // 1视频+1logo+1封面+下载链接+包名+1描述+应用名称+标题
                    }
                }
            },
            {
                id: 310,
                parentId: 5,
                icon: 'jili',
                title: '激励视频',
                intro: '宽高比9：16',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 0,
                    zxr: 0,
                    photo: 0,
                    video: 1
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 0,
                    video: 1
                },
                size: [
                    {
                        ratio: '9:16',
                        minSize: {
                            w: 720,
                            h: 1280
                        }
                    },
                    {
                        ratio: '16:9',
                        minSize: {
                            w: 1280,
                            h: 720
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: [],
                        video: ['video', 'dp', 'logo', 'cImg', 'describe', 'title'] // 1视频+1ldp+1logo+1封面+1描述+标题
                    },
                    download: {
                        img: [],
                        video: ['video', 'logo', 'cImg', 'downlink', 'appIcon', 'appPackageName', 'describe', 'appName', 'title'] // 1视频+1logo+1封面+下载链接+包名+1描述+应用名称+标题
                    }
                }
            },
            {
                id: 320,
                parentId: 6,
                icon: 'long-video',
                title: '长视频广告',
                intro: '宽高比9：16',
                sdkAttr: {
                    isSupportSdk: 1,
                    moban: 0,
                    zxr: 0,
                    photo: 0,
                    video: 1
                },
                apiAttr: {
                    isSupportApi: 1,
                    photo: 0,
                    video: 1
                },
                size: [
                    {
                        ratio: '9:16',
                        minSize: {
                            w: 720,
                            h: 1280
                        }
                    }
                ],
                adConcat: { // 广告组成
                    dp: {
                        img: [],
                        video: ['video', 'dp', 'logo', 'cImg', 'describe', 'title'] // 1视频+1ldp+1logo+1封面+1描述+标题
                    },
                    download: {
                        img: [],
                        video: ['video', 'logo', 'cImg', 'downlink', 'appPackageName', 'appIcon', 'describe', 'appName', 'title'] // 1视频+1logo+1封面+下载链接+包名+1描述+应用名称+标题
                    }
                }
            },
            {
                id: 340,
                parentId: 8,
                icon: 'hudong',
                demoIcon: 'hudong.gif',
                title: '交互广告',
                intro: '宽高比1：1',
                sdkAttr: {
                    isSupportSdk: 0,
                    moban: 0,
                    zxr: 0,
                    photo: 0,
                    video: 0
                },
                apiAttr: {
                    isSupportApi: 0,
                    photo: 0,
                    video: 0
                },
                adConcat: { // 广告组成
                    dp: {
                        img: [],
                        video: []
                    },
                    download: {
                        img: [],
                        video: []
                    }
                }
            }
        ]
    },
    getters: {
        errorCount: state => state.errorList.length,
        osType: state => state.osTypeArr
    },
    mutations: {
        setBreadCrumb(state, route) {
            state.breadCrumbList = getBreadCrumbList(route, state.homeRoute)
        },
        setHomeRoute(state, routes) {
            state.homeRoute = getHomeRoute(routes, homeName)
        },
        setTagNavList(state, list) {
            let tagList = []
            if (list) {
                tagList = [...list]
            } else tagList = getTagNavListFromLocalstorage() || []
            if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
            let homeTagIndex = tagList.findIndex(item => item.name === homeName)
            if (homeTagIndex > 0) {
                let homeTag = tagList.splice(homeTagIndex, 1)[0]
                tagList.unshift(homeTag)
            }
            state.tagNavList = tagList
            setTagNavListInLocalstorage([...tagList])
        },

        addTag(state, {
            route,
            type = 'unshift'
        }) {
            let router = getRouteTitleHandled(route)
            if (!routeHasExist(state.tagNavList, router)) {
                if (type === 'push') state.tagNavList.push(router)
                else {
                    if (router.name === homeName) state.tagNavList.unshift(router)
                    else state.tagNavList.splice(1, 0, router)
                }
                setTagNavListInLocalstorage([...state.tagNavList])
            }
        },
        setLocal(state, lang) {
            localSave('local', lang)
            state.local = lang
        },
        addError(state, error) {
            state.errorList.push(error)
        },
        setHasReadErrorLoggerStatus(state, status = true) {
            state.hasReadErrorPage = status
        }
    },
    actions: {

    }
}