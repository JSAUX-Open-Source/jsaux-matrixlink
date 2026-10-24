(function () {
    'use strict';

    const manifest = {"name":"JSAUX PIXEL"};
    const API_VERSION = 2;
    const internalAPIConnection = window.__DECKY_SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED_deckyLoaderAPIInit;
    if (!internalAPIConnection) {
        throw new Error('[@decky/api]: Failed to connect to the loader as as the loader API was not initialized. This is likely a bug in Decky Loader.');
    }
    let api;
    try {
        api = internalAPIConnection.connect(API_VERSION, manifest.name);
    }
    catch {
        api = internalAPIConnection.connect(1, manifest.name);
        console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version 1. Some features may not work.`);
    }
    if (api._version != API_VERSION) {
        console.warn(`[@decky/api] Requested API version ${API_VERSION} but the running loader only supports version ${api._version}. Some features may not work.`);
    }
    const callable = api.callable;
    const toaster = api.toaster;
    const openFilePicker = api.openFilePicker;
    const definePlugin = (fn) => {
        return (...args) => {
            return fn(...args);
        };
    };

    var DefaultContext = {
      color: undefined,
      size: undefined,
      className: undefined,
      style: undefined,
      attr: undefined
    };
    var IconContext = SP_REACT.createContext && /*#__PURE__*/SP_REACT.createContext(DefaultContext);

    var _excluded = ["attr", "size", "title"];
    function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }
    function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } } return target; }
    function _extends() { _extends = Object.assign ? Object.assign.bind() : function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
    function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
    function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), true).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
    function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
    function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
    function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
    function Tree2Element(tree) {
      return tree && tree.map((node, i) => /*#__PURE__*/SP_REACT.createElement(node.tag, _objectSpread({
        key: i
      }, node.attr), Tree2Element(node.child)));
    }
    function GenIcon(data) {
      return props => /*#__PURE__*/SP_REACT.createElement(IconBase, _extends({
        attr: _objectSpread({}, data.attr)
      }, props), Tree2Element(data.child));
    }
    function IconBase(props) {
      var elem = conf => {
        var {
            attr,
            size,
            title
          } = props,
          svgProps = _objectWithoutProperties(props, _excluded);
        var computedSize = size || conf.size || "1em";
        var className;
        if (conf.className) className = conf.className;
        if (props.className) className = (className ? className + " " : "") + props.className;
        return /*#__PURE__*/SP_REACT.createElement("svg", _extends({
          stroke: "currentColor",
          fill: "currentColor",
          strokeWidth: "0"
        }, conf.attr, attr, svgProps, {
          className: className,
          style: _objectSpread(_objectSpread({
            color: props.color || conf.color
          }, conf.style), props.style),
          height: computedSize,
          width: computedSize,
          xmlns: "http://www.w3.org/2000/svg"
        }), title && /*#__PURE__*/SP_REACT.createElement("title", null, title), props.children);
      };
      return IconContext !== undefined ? /*#__PURE__*/SP_REACT.createElement(IconContext.Consumer, null, conf => elem(conf)) : elem(DefaultContext);
    }

    // THIS FILE IS AUTO GENERATED
    function FaTh (props) {
      return GenIcon({"attr":{"viewBox":"0 0 512 512"},"child":[{"tag":"path","attr":{"d":"M149.333 56v80c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V56c0-13.255 10.745-24 24-24h101.333c13.255 0 24 10.745 24 24zm181.334 240v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm32-240v80c0 13.255 10.745 24 24 24H488c13.255 0 24-10.745 24-24V56c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24zm-32 80V56c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.256 0 24.001-10.745 24.001-24zm-205.334 56H24c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24zM0 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H24c-13.255 0-24 10.745-24 24zm386.667-56H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zm0 160H488c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H386.667c-13.255 0-24 10.745-24 24v80c0 13.255 10.745 24 24 24zM181.333 376v80c0 13.255 10.745 24 24 24h101.333c13.255 0 24-10.745 24-24v-80c0-13.255-10.745-24-24-24H205.333c-13.255 0-24 10.745-24 24z"},"child":[]}]})(props);
    }

    const writeSerialHex = callable("write_serial_hex");
    const getStatus = callable("get_status");
    const getDisplaySettings = callable("get_display_settings");
    const getRefreshSettings = callable("get_refresh_settings");
    const getWeatherCities = callable("get_weather_cities");
    const getCountdown = callable("get_countdown");
    const getChronograph = callable("get_chronograph");
    const getAiAgentStatus = callable("get_ai_agent_status");
    const aiAgentLoginStart = async () => ({ ok: false, error: "ai_agent_login_removed" });
    const aiAgentLoginStatusRpc = async () => ({ ok: false, error: "ai_agent_login_removed" });
    const aiAgentLogoutRpc = async () => ({ ok: false, error: "ai_agent_login_removed" });
    
    
    
    const setPower = callable("set_power");
    const setBrightnessRpc = callable("set_brightness");
    const updateDisplaySettings = callable("update_display_settings");
    const sendDashboardMonitor = callable("send_dashboard_monitor");
    const sendHardwareMonitor = callable("send_hardware_monitor");
    const sendClockMonitor = callable("send_clock_monitor");
    const sendWeatherForecast = callable("send_weather_forecast");
    const sendPlaytimeMonitor = callable("send_playtime_monitor");
    const sendCountdownMonitor = callable("send_countdown_monitor");
    const sendChronographMonitor = callable("send_chronograph_monitor");     const sendAiAgentMonitor = callable("send_ai_agent_monitor");
    const getCustomAssets = callable("get_custom_assets");
    const selectCustomAsset = callable("select_custom_asset");
    const MAX_CUSTOM_ASSET_SOURCE_BYTES = 100 * 1024 * 1024;
    const uploadCustomAsset = callable("upload_custom_asset");
    const uploadCustomAssetFromPath = callable("upload_custom_asset_from_path");
    const deleteCustomAsset = callable("delete_custom_asset");
    const syncDisplay = callable("sync_display");
    function modeFromDaemonId(moduleId) {
        const mapping = {
            dashboard: "dashboard",
            system_performance: "hardware",
            weather: "timeline",
            productivity: "clock",
            playtime: "playtime",
            countdown: "countdown",
            chronograph: "chronograph",
            custom: "gif",
            ai_agent: "ai_agent",
        };
        return mapping[moduleId] ?? "dashboard";
    }
    function timeFromSeconds(value, fallback) {
        const total = Math.max(0, Math.min(359999, Number(value) || 0));
        if (total < 1) {
            return fallback;
        }
        return {
            hours: Math.floor(total / 3600),
            minutes: Math.floor(total / 60) % 60,
            seconds: total % 60,
        };
    }
    function customAssetNames(custom) {
        const assets = custom?.assets ?? custom ?? {};
        if (Array.isArray(assets.gallery)) {
            return assets.gallery;
        }
        return [...(Array.isArray(assets.builtin) ? assets.builtin : []), ...(Array.isArray(assets.uploaded) ? assets.uploaded : [])];
    }
    function customAssetPreviews(custom) {
        const assets = custom?.assets ?? custom ?? {};
        const previews = assets.previews;
        if (!previews || typeof previews !== "object" || Array.isArray(previews)) {
            return {};
        }
        return Object.fromEntries(Object.entries(previews).filter(([name, preview]) => name && typeof preview === "string" && preview));
    }
    function customAssetDeletable(custom) {
        const assets = custom?.assets ?? custom ?? {};
        return Array.isArray(assets.deletable) ? assets.deletable.filter((name) => typeof name === "string" && name) : [];
    }
    function customAssetUploadAllowed(custom) {
        const assets = custom?.assets ?? custom ?? {};
        const names = customAssetNames(custom);
        const reportedMax = Number(assets.max_assets);
        const maxAssets = Number.isFinite(reportedMax) ? Math.max(0, Math.min(6, Math.floor(reportedMax))) : 6;
        return assets.upload_allowed !== false && names.length < maxAssets;
    }
    function parseFirmwareVersion(value) {
        const normalized = String(value ?? "").trim().replace(/^v/i, "");
        if (!/^\d+(?:\.\d+)*$/.test(normalized)) {
            return null;
        }
        const segments = normalized.split(".").map(Number);
        return segments.every((segment) => Number.isSafeInteger(segment)) ? segments : null;
    }
    function isFirmwareUpdateAvailable(currentVersion, latestVersion) {
        const current = parseFirmwareVersion(currentVersion);
        const latest = parseFirmwareVersion(latestVersion);
        if (!current || !latest) {
            return false;
        }
        const segmentCount = Math.max(current.length, latest.length);
        for (let index = 0; index < segmentCount; index += 1) {
            const currentSegment = current[index] ?? 0;
            const latestSegment = latest[index] ?? 0;
            if (latestSegment !== currentSegment) {
                return latestSegment > currentSegment;
            }
        }
        return false;
    }
    const translations = {
        en: {
            appSubtitle: "64x54 Matrix Display",
            hardwareStatus: "Hardware Status",
            connectedDevice: "Connected",
            connected: "Connected",
            noDeviceConnected: "No device connected",
            fileReadFailed: "Unable to read the selected file",
            powerOnShort: "ON",
            powerOffShort: "OFF",
            matrixTitle: "Matrix Display",
            screenPower: "Screen Power",
            screenBrightness: "Screen Brightness",
            temperatureUnit: "Temperature",
            temperatureCelsius: "Celsius",
            temperatureFahrenheit: "Fahrenheit",
            timeFormat: "Time format",
            timeFormat12: "12-hour",
            timeFormat24: "24-hour",
            firmwareLatest: "Latest version",
            firmwareUnknown: "Version unknown", firmwareUnsupportedShort: "Unavailable", customReplacementOnly: "The gallery is full. Choose a file with the same name as an existing image to replace it.", customReplaceLocal: "Replace same-name image",
            firmwareUpdateAction: "Update now",
            firmwareUpdateUnsupported: "Firmware updates are not supported yet",
            powerOffDisplay: "Power Off Display",
            powerOnDisplay: "Power On Display",
            brightness: "Brightness",
            otherSettings: "Other",
            displayMode: "Display Mode",
            adaptiveModeConfig: "Adaptive Mode Config",
            collapse: "Collapse",
            expand: "Expand",
            serialReady: "Serial link ready",
            serialIncomplete: "Serial write returned an incomplete byte count",
            serialFallback: "serial",
            serialWroteBytes: "wrote",
            serialBytes: "bytes",
            modeDashboard: "Dashboard Monitor",
            modeDashboardDesc: "Date, time, weather pattern, and basic status in one quiet layout.",
            modeHardware: "Hardware Performance",
            modeHardwareDesc: "Steam Machine real-time thermal, CPU, GPU, and load monitoring.",
            modeTimeline: "Weather",
            modeTimelineDesc: "Detailed forecast, large weather icon, and temperature, humidity, wind data.",
            modeClock: "Clock",
            modeClockDesc: "Date, weather, 12-hour time, and seconds progress.",
            modePlaytime: "Playtime",
            modePlaytimeDesc: "Game title, session runtime, progress, and total play hours.",
            modeCountdown: "Countdown Timer",
            modeCountdownDesc: "Preset countdown actions for focused play or charging windows.",
            modeChronograph: "Chronograph Timer",
            modeChronographDesc: "Forward count-up timer with a restrained 30 minute scale.",
            modeGif: "Custom GIF Matrix",
            modeGifDesc: "64x54 custom image and GIF transfer mode.",
            modeAiAgent: "AI Agent",
            modeAiAgentDesc: "Local Codex session name and running state.",
            aiAgentSubtitle: "Local Codex session and running state",
            aiAgentRunningSessions: "Running sessions",
            aiAgentFiveHourRemaining: "5-hour remaining",
            aiAgentFiveHourReset: "5-hour reset",
            aiAgentSevenDayRemaining: "7-day remaining",
            aiAgentSevenDayReset: "7-day reset",
            aiAgentTokenUsage: "Token usage",
            aiAgentRefresh: "Refresh now",
            aiAgentNoCredentials: "No local Codex session activity found.",
            aiAgentLoadFailed: "AI Agent status refresh failed",
            aiAgentLogin: "",
            aiAgentLoginWaiting: "",
            aiAgentLoginHint: "",
            aiAgentLogout: "",
            dashboardReady: "Integrated date, time, weather pattern, and status layout is ready.",
            dashboardTest: "Push Dashboard Test",
            subtleSeconds: "Subtle seconds indicator",
            gpuCpuMonitor: "GPU load and CPU thread monitoring",
            hardwareTest: "Push Hardware Test",
            thermalAlerts: "Thermal and high-load alerts",
            refreshCadence: "Refresh cadence",
            carouselInterval: "Carousel interval",
            nextScheduledCard: "Next scheduled card",
            weather: "Weather",
            timelineHint: "64x54 weather forecast layout is ready.",
            clockHint: "64x54 clock layout is ready.",
            compactStatusLine: "Show compact system status line",
            currentGameRuntime: "Current game runtime",
            steamAchievements: "Steam community achievements",
            countdownHourUnit: "h",
            countdownMinuteUnit: "min",
            countdownSecondUnit: "s",
            countdownDuration: "Select Countdown Duration (Minutes)",
            startCountdown: "Start Countdown",
            reset: "Reset",
            chronographHint: "Forward count-up timer with a restrained 30 MIN scale.",
            startTimer: "Start Timer",
            uploadGif: "Upload Local GIF / Image Data",
            customAssetsTitle: "Local assets",
            customNoAssets: "No local assets",
            customUploadLocal: "Upload local asset",
            customUploadHint: "Up to 100 MB source; compressed to 64×54 GIF ≤32 KB for direct screen display. Bright/white assets are auto-dimmed; use a dedicated 5V2A/5V3A supply.",
            customFileTooLarge: "The selected image exceeds 100 MB. Choose a file of 100 MB or less.",
            customThumbnail: "GIF / Image\nThumbnail",
            customAssetReady: "Custom asset ready",
            customSelect: "Select",
            customDelete: "Delete",
            customFolderBack: "Back to imported assets",
            customFolderEmpty: "No supported images in this folder",
            customAssetDeleted: "Asset deleted",
            firmwareTitle: "Firmware",
            firmwareVersion: "Version",
            firmwareUpdateStatus: "Update Status",
            firmwareUpToDate: "Up to date",
            firmwareChecking: "Checking...",
            firmwareCheckAction: "Check",
            settingsTitle: "Settings",
            settingsOpen: "Settings",
            settingsBack: "Back",
            settingsTimeZone: "Time zone",
            settingsFollowSystem: "Follow system",
            settingsAutoDaylightSaving: "Auto daylight saving",
            settingsDoNotDisturb: "Do Not Disturb",
            settingsYes: "On",
            settingsNo: "Off",
            settingsWeatherLocation: "Weather location",
            settingsLocalWeather: "Local",
            settingsWeatherSearch: "Search cities",
            settingsWeatherHint: "Choose Local (IP) or search a city",
            settingsMeasurementSystem: "Unit system",
            settingsMetric: "Metric",
            settingsUs: "US",
            settingsUk: "UK",
            settingsOnlineUpdate: "Online update",
            settingsVersion: "Version",
        },
        zh: {
            appSubtitle: "64x54 点阵屏",
            hardwareStatus: "硬件状态",
            connectedDevice: "已连接",
            connected: "已连接",
            noDeviceConnected: "无设备连接",
            fileReadFailed: "无法读取所选文件",
            powerOnShort: "开",
            powerOffShort: "关",
            matrixTitle: "点阵屏",
            screenPower: "屏幕开关",
            screenBrightness: "屏幕亮度",
            temperatureUnit: "温度",
            temperatureCelsius: "摄氏度",
            temperatureFahrenheit: "华氏度",
            timeFormat: "时间制式",
            timeFormat12: "12小时制",
            timeFormat24: "24小时制",
            firmwareLatest: "最新版本",
            firmwareUnknown: "版本未知", firmwareUnsupportedShort: "暂不支持升级", customReplacementOnly: "图片库已满，请选择与现有图片同名的文件进行替换。", customReplaceLocal: "替换同名图片",
            firmwareUpdateAction: "立即更新",
            firmwareUpdateUnsupported: "固件更新暂不支持",
            powerOffDisplay: "关闭屏幕",
            powerOnDisplay: "开启屏幕",
            brightness: "亮度",
            otherSettings: "其他",
            displayMode: "显示模式",
            adaptiveModeConfig: "模式自适应配置",
            collapse: "收起",
            expand: "展开",
            serialReady: "串口已就绪",
            serialIncomplete: "串口写入字节数不完整",
            serialFallback: "串口",
            serialWroteBytes: "写入",
            serialBytes: "字节",
            modeDashboard: "仪表盘监控",
            modeDashboardDesc: "整合日期、时间、天气纹理与基础状态。",
            modeHardware: "硬件性能",
            modeHardwareDesc: "Steam Machine 实时温度、CPU、GPU 与负载监控。",
            modeTimeline: "天气",
            modeTimelineDesc: "详细预报、大型天气图标、温度、湿度与风速。",
            modeClock: "时钟",
            modeClockDesc: "日期、天气、12 小时时间与秒进度。",
            modePlaytime: "游戏时长",
            modePlaytimeDesc: "游戏名称、本次时间、进度条与累计时长。",
            modeCountdown: "倒计时",
            modeCountdownDesc: "用于专注游玩或充电窗口的预设倒计时。",
            modeChronograph: "正计时",
            modeChronographDesc: "克制的 30 分钟刻度正向计时器。",
            modeGif: "个性自定义",
            modeGifDesc: "64x54 自定义图片与 GIF 传输模式。",
            modeAiAgent: "AI Agent",
            modeAiAgentDesc: "本机 Codex 会话名与运行状态。",
            aiAgentSubtitle: "本机 Codex 会话与运行状态",
            aiAgentRunningSessions: "运行中的会话",
            aiAgentFiveHourRemaining: "5小时剩余",
            aiAgentFiveHourReset: "5小时重置",
            aiAgentSevenDayRemaining: "7天剩余",
            aiAgentSevenDayReset: "7天重置",
            aiAgentTokenUsage: "Token 用量",
            aiAgentRefresh: "立即刷新",
            aiAgentNoCredentials: "未发现本机 Codex 会话活动。",
            aiAgentLoadFailed: "AI Agent 状态刷新失败",
            aiAgentLogin: "",
            aiAgentLoginWaiting: "",
            aiAgentLoginHint: "",
            aiAgentLogout: "",
            dashboardReady: "日期、时间、天气纹理与状态布局已就绪。",
            dashboardTest: "推送仪表盘测试",
            subtleSeconds: "低调秒点指示",
            gpuCpuMonitor: "GPU 负载与 CPU 线程监测",
            hardwareTest: "推送硬件性能测试",
            thermalAlerts: "温度与高负载提醒",
            refreshCadence: "刷新频率",
            carouselInterval: "轮播间隔",
            nextScheduledCard: "下一张卡片",
            weather: "天气",
            timelineHint: "64x54 天气预报布局已就绪。",
            clockHint: "64x54 时钟布局已就绪。",
            compactStatusLine: "显示紧凑系统状态行",
            currentGameRuntime: "当前游戏时长",
            steamAchievements: "Steam 社区成就",
            countdownHourUnit: "小时",
            countdownMinuteUnit: "分钟",
            countdownSecondUnit: "秒",
            countdownDuration: "选择倒计时时长（分钟）",
            startCountdown: "开始倒计时",
            reset: "重置",
            chronographHint: "克制的 30 分钟刻度正向计时器。",
            startTimer: "开始计时",
            uploadGif: "上传本地 GIF / 图片数据",
            customAssetsTitle: "本地素材",
            customNoAssets: "暂无素材",
            customUploadLocal: "上传本地 GIF/图片",
            customUploadHint: "原图最大 100 MB；压缩为 64×54、≤32KB 的 GIF 后可直接上屏。高亮/大面积白色会自动压暗；请使用独立 5V2A/5V3A 供电。",
            customFileTooLarge: "所选图片超过 100 MB，请选择不超过 100 MB 的文件。",
            customThumbnail: "GIF/图片\n缩略图",
            customAssetReady: "素材已就绪",
            customSelect: "选择",
            customDelete: "删除",
            customFolderBack: "返回已导入素材",
            customFolderEmpty: "此文件夹中没有支持的图片",
            customAssetDeleted: "素材已删除",
            firmwareTitle: "固件",
            firmwareVersion: "版本",
            firmwareUpdateStatus: "更新状态",
            firmwareUpToDate: "已是最新",
            firmwareChecking: "检查中...",
            firmwareCheckAction: "检查",
            settingsTitle: "设置",
            settingsOpen: "设置",
            settingsBack: "返回",
            settingsTimeZone: "时区",
            settingsFollowSystem: "跟随系统",
            settingsAutoDaylightSaving: "自动夏令时",
            settingsDoNotDisturb: "勿扰模式",
            settingsYes: "开",
            settingsNo: "关",
            settingsWeatherLocation: "天气位置",
            settingsLocalWeather: "本地",
            settingsWeatherSearch: "搜索城市",
            settingsWeatherHint: "可选本地 IP，或搜索指定城市",
            settingsMeasurementSystem: "度量制",
            settingsMetric: "公制",
            settingsUs: "美制",
            settingsUk: "英制",
            settingsOnlineUpdate: "在线升级",
            settingsVersion: "版本",
        },
        ja: {
            appSubtitle: "64x54 マトリクスディスプレイ",
            hardwareStatus: "ハードウェア状態",
            connectedDevice: "接続済み",
            connected: "接続済み",
            noDeviceConnected: "デバイスが接続されていません",
            fileReadFailed: "選択したファイルを読み取れません",
            powerOnShort: "オン",
            powerOffShort: "オフ",
            matrixTitle: "マトリクス表示",
            screenPower: "画面電源",
            screenBrightness: "画面の明るさ",
            temperatureUnit: "温度",
            temperatureCelsius: "摂氏",
            temperatureFahrenheit: "華氏",
            timeFormat: "時刻形式",
            timeFormat12: "12時間制",
            timeFormat24: "24時間制",
            firmwareLatest: "最新版",
            firmwareUnknown: "バージョン不明", firmwareUnsupportedShort: "更新非対応", customReplacementOnly: "ギャラリーが満杯です。既存の画像と同じ名前のファイルを選んで置き換えてください。", customReplaceLocal: "同名画像を置換",
            firmwareUpdateAction: "今すぐ更新",
            firmwareUpdateUnsupported: "ファームウェア更新はまだサポートされていません",
            powerOffDisplay: "ディスプレイをオフ",
            powerOnDisplay: "ディスプレイをオン",
            brightness: "明るさ",
            otherSettings: "その他",
            displayMode: "表示モード",
            adaptiveModeConfig: "モード自動設定",
            collapse: "折りたたむ",
            expand: "展開",
            serialReady: "シリアル接続準備完了",
            serialIncomplete: "シリアル書き込みのバイト数が不完全です",
            serialFallback: "シリアル",
            serialWroteBytes: "書き込み",
            serialBytes: "バイト",
            modeDashboard: "ダッシュボード監視",
            modeDashboardDesc: "日付、時刻、天気パターン、基本状態をまとめて表示します。",
            modeHardware: "ハードウェア性能",
            modeHardwareDesc: "Steam Machine の温度、CPU、GPU、負荷をリアルタイム監視します。",
            modeTimeline: "天気",
            modeTimelineDesc: "詳細予報、大きな天気アイコン、気温、湿度、風速を表示します。",
            modeClock: "時計",
            modeClockDesc: "日付、天気、12 時間表示、秒進行を表示します。",
            modePlaytime: "プレイ時間",
            modePlaytimeDesc: "ゲーム名、今回の時間、進行バー、累計時間を表示します。",
            modeCountdown: "カウントダウンタイマー",
            modeCountdownDesc: "集中プレイや充電時間向けのプリセットタイマーです。",
            modeChronograph: "ストップウォッチ",
            modeChronographDesc: "30 分スケールのシンプルなカウントアップタイマーです。",
            modeGif: "カスタム GIF マトリクス",
            modeGifDesc: "64x54 のカスタム画像と GIF 転送モードです。",
            modeAiAgent: "AI Agent",
            modeAiAgentDesc: "ローカル Codex セッション名と実行状態。",
            aiAgentSubtitle: "ローカル Codex セッションと実行状態",
            aiAgentRunningSessions: "実行中のセッション",
            aiAgentFiveHourRemaining: "5時間残り",
            aiAgentFiveHourReset: "5時間リセット",
            aiAgentSevenDayRemaining: "7日間残り",
            aiAgentSevenDayReset: "7日間リセット",
            aiAgentTokenUsage: "Token 使用量",
            aiAgentRefresh: "今すぐ更新",
            aiAgentNoCredentials: "ローカル Codex セッション活動が見つかりません。",
            aiAgentLoadFailed: "AI Agent 状態の更新に失敗しました",
            aiAgentLogin: "",
            aiAgentLoginWaiting: "",
            aiAgentLoginHint: "",
            aiAgentLogout: "",
            dashboardReady: "日付、時刻、天気パターン、状態レイアウトの準備ができています。",
            dashboardTest: "ダッシュボードを送信",
            subtleSeconds: "控えめな秒インジケーター",
            gpuCpuMonitor: "GPU 負荷と CPU スレッド監視",
            hardwareTest: "ハードウェアを送信",
            thermalAlerts: "温度と高負荷の通知",
            refreshCadence: "更新間隔",
            carouselInterval: "カルーセル間隔",
            nextScheduledCard: "次のカード",
            weather: "天気",
            timelineHint: "64x54 天気予報レイアウトの準備ができています。",
            clockHint: "64x54 時計レイアウトの準備ができています。",
            compactStatusLine: "コンパクトなシステム状態行を表示",
            currentGameRuntime: "現在のゲーム時間",
            steamAchievements: "Steam コミュニティ実績",
            countdownHourUnit: "時",
            countdownMinuteUnit: "分",
            countdownSecondUnit: "秒",
            countdownDuration: "カウントダウン時間を選択（分）",
            startCountdown: "カウントダウン開始",
            reset: "リセット",
            chronographHint: "30 分スケールのシンプルなカウントアップタイマーです。",
            startTimer: "タイマー開始",
            uploadGif: "ローカル GIF / 画像データをアップロード",
            customAssetsTitle: "ローカル素材",
            customNoAssets: "素材がありません",
            customUploadLocal: "ローカル素材をアップロード",
            customUploadHint: "元画像は最大 100 MB。64×54・≤32KB の GIF に圧縮して直接表示。高輝度/白が多い素材は自動減光。専用 5V2A/5V3A 電源を推奨。",
            customFileTooLarge: "選択した画像は 100 MB を超えています。100 MB 以下のファイルを選択してください。",
            customThumbnail: "GIF / 画像\nサムネイル",
            customAssetReady: "素材準備完了",
            customSelect: "選択",
            customDelete: "削除",
            customFolderBack: "インポート済み素材に戻る",
            customFolderEmpty: "対応画像がありません",
            customAssetDeleted: "素材を削除しました",
            firmwareTitle: "ファームウェア",
            firmwareVersion: "バージョン",
            firmwareUpdateStatus: "更新状態",
            firmwareUpToDate: "最新です",
            firmwareChecking: "確認中...",
            firmwareCheckAction: "確認",
            settingsTitle: "設定",
            settingsOpen: "設定",
            settingsBack: "戻る",
            settingsTimeZone: "タイムゾーン",
            settingsFollowSystem: "システム設定",
            settingsAutoDaylightSaving: "夏時間の自動調整",
            settingsDoNotDisturb: "おやすみモード",
            settingsYes: "オン",
            settingsNo: "オフ",
            settingsWeatherLocation: "天気の場所",
            settingsLocalWeather: "ローカル",
            settingsWeatherSearch: "都市を検索",
            settingsWeatherHint: "ローカル IP、または都市を検索して選択",
            settingsMeasurementSystem: "単位系",
            settingsMetric: "メートル法",
            settingsUs: "米国",
            settingsUk: "英国",
            settingsOnlineUpdate: "オンライン更新",
            settingsVersion: "バージョン",
        },
    };
    function normalizeLanguage(value) {
        return typeof value === "string" ? value.trim().toLowerCase() : "";
    }
    function languageFromCandidate(value) {
        const candidate = normalizeLanguage(value);
        if (candidate.startsWith("ja") || candidate.includes("japanese")) {
            return "ja";
        }
        if (candidate.startsWith("zh") ||
            candidate.includes("schinese") ||
            candidate.includes("tchinese") ||
            candidate.includes("chinese")) {
            return "zh";
        }
        return candidate ? "en" : "";
    }
    function languageRealms(globalValue) {
        const realms = [];
        const addRealm = (realm) => {
            if (realm && !realms.includes(realm)) {
                realms.push(realm);
            }
        };
        addRealm(globalValue);
        for (const key of ["opener", "parent", "top"]) {
            try {
                addRealm(globalValue?.[key]);
            }
            catch {
                // Ignore inaccessible window realms.
            }
        }
        return realms;
    }
    function createLatestOnlyAsyncScheduler(send, onError) {
        let running = false;
        let hasPending = false;
        let pendingValue;
        const flush = async () => {
            if (running) {
                return;
            }
            running = true;
            try {
                while (hasPending) {
                    const value = pendingValue;
                    hasPending = false;
                    try {
                        await send(value);
                    }
                    catch (error) {
                        onError(error);
                    }
                }
            }
            finally {
                running = false;
                if (hasPending) {
                    void flush();
                }
            }
        };
        return (value) => {
            pendingValue = value;
            hasPending = true;
            void flush();
        };
    }
    function createRealtimeBrightnessTransport(createSocket, requestFrame, cancelFrame, sendFallback) {
        const socketUrl = "ws://" + ["127", "0", "0", "1"].join(".") + ":39053";
        let socket = null;
        let detachSocketListeners = () => undefined;
        let frameId = null;
        let disposed = false;
        let sentFirstValue = false;
        let hasLatestValue = false;
        let latestValue = 0;
        const fallbackLatest = () => {
            if (!disposed && hasLatestValue) {
                sendFallback(latestValue);
            }
        };
        const cancelScheduledFrame = () => {
            if (frameId !== null) {
                cancelFrame(frameId);
                frameId = null;
            }
        };
        const failSocket = (candidate) => {
            if (disposed || socket !== candidate) {
                return;
            }
            socket = null;
            detachSocketListeners();
            detachSocketListeners = () => undefined;
            cancelScheduledFrame();
            try {
                candidate.close();
            }
            catch {
                // The RPC fallback below still applies the latest position.
            }
            fallbackLatest();
        };
        const sendLatest = () => {
            frameId = null;
            if (disposed || !hasLatestValue) {
                return;
            }
            const candidate = socket;
            if (!candidate || candidate.readyState !== 1) {
                if (!candidate || candidate.readyState >= 2) {
                    fallbackLatest();
                }
                return;
            }
            try {
                candidate.send(JSON.stringify({ type: "brightness", brightness: latestValue }));
                sentFirstValue = true;
            }
            catch {
                failSocket(candidate);
            }
        };
        const scheduleFrame = () => {
            if (frameId === null) {
                frameId = requestFrame(sendLatest);
            }
        };
        try {
            const candidate = createSocket(socketUrl);
            socket = candidate;
            const handleOpen = () => {
                if (disposed || socket !== candidate || !hasLatestValue) {
                    return;
                }
                if (!sentFirstValue) {
                    sendLatest();
                }
                else {
                    scheduleFrame();
                }
            };
            const handleFailure = () => failSocket(candidate);
            candidate.addEventListener("open", handleOpen);
            candidate.addEventListener("error", handleFailure);
            candidate.addEventListener("close", handleFailure);
            detachSocketListeners = () => {
                candidate.removeEventListener("open", handleOpen);
                candidate.removeEventListener("error", handleFailure);
                candidate.removeEventListener("close", handleFailure);
            };
        }
        catch {
            socket = null;
        }
        return {
            schedule(value) {
                const numericValue = Number(value);
                if (disposed || !Number.isFinite(numericValue)) {
                    return;
                }
                latestValue = Math.max(0, Math.min(100, Math.round(numericValue)));
                hasLatestValue = true;
                if (socket && socket.readyState === 1) {
                    if (!sentFirstValue) {
                        sendLatest();
                    }
                    else {
                        scheduleFrame();
                    }
                }
                else if (!socket || socket.readyState >= 2) {
                    fallbackLatest();
                }
            },
            dispose() {
                if (disposed) {
                    return;
                }
                const candidate = socket;
                const flushPendingValue = frameId !== null || (candidate && candidate.readyState === 0);
                cancelScheduledFrame();
                if (flushPendingValue && hasLatestValue) {
                    if (candidate && candidate.readyState === 1) {
                        try {
                            candidate.send(JSON.stringify({ type: "brightness", brightness: latestValue }));
                        }
                        catch {
                            sendFallback(latestValue);
                        }
                    }
                    else {
                        sendFallback(latestValue);
                    }
                }
                disposed = true;
                socket = null;
                detachSocketListeners();
                detachSocketListeners = () => undefined;
                if (candidate) {
                    try {
                        candidate.close();
                    }
                    catch {
                        // The component is already being removed.
                    }
                }
            },
        };
    }
    function languageFromLocation(realm) {
        try {
            const href = String(realm?.location?.href ?? "");
            const match = href.match(/[?&]language=([^&#]+)/i);
            return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : "";
        }
        catch {
            return "";
        }
    }
    function resolveLanguage(globalValue = globalThis) {
        const realms = languageRealms(globalValue);
        const locationCandidates = [];
        const localizationCandidates = [];
        const navigatorCandidates = [];
        const appStoreCandidates = [];
        for (const realm of realms) {
            locationCandidates.push(languageFromLocation(realm));
            try {
                localizationCandidates.push(realm.LocalizationManager?.m_strLanguage);
                localizationCandidates.push(...Array.from(realm.LocalizationManager?.m_rgLocalesToUse ?? []));
            }
            catch {
                localizationCandidates.push("");
            }
            try {
                navigatorCandidates.push(...Array.from(realm.navigator?.languages ?? []));
                navigatorCandidates.push(realm.navigator?.language);
            }
            catch {
                navigatorCandidates.push("");
            }
            try {
                appStoreCandidates.push(realm.appStore?.m_strLanguage);
            }
            catch {
                appStoreCandidates.push("");
            }
        }
        for (const group of [locationCandidates, localizationCandidates, navigatorCandidates, appStoreCandidates]) {
            for (const candidate of group) {
                const language = languageFromCandidate(candidate);
                if (language) {
                    return language;
                }
            }
        }
        return "en";
    }
    async function resolveSteamLanguage(globalValue = globalThis) {
        const realms = languageRealms(globalValue);
        for (const realm of realms) {
            try {
                const settings = realm.SteamClient?.Settings;
                const getCurrentLanguage = settings?.GetCurrentLanguage;
                if (typeof getCurrentLanguage !== "function") {
                    continue;
                }
                const language = languageFromCandidate(await getCurrentLanguage.call(settings));
                if (language) {
                    return language;
                }
            }
            catch {
                // Fall through to the remaining Steam realms and synchronous sources.
            }
        }
        return resolveLanguage(globalValue);
    }
    function useDeckLanguage() {
        const [language, setLanguage] = SP_REACT.useState(() => resolveLanguage());
        SP_REACT.useEffect(() => {
            let stopped = false;
            let requestId = 0;
            const cleanupCallbacks = [];
            const updateLanguage = () => {
                if (stopped) {
                    return;
                }
                setLanguage(resolveLanguage());
                const currentRequest = ++requestId;
                resolveSteamLanguage().then((nextLanguage) => {
                    if (!stopped && currentRequest === requestId) {
                        setLanguage(nextLanguage);
                    }
                });
            };
            const addListener = (target, eventName) => {
                try {
                    if (typeof target?.addEventListener !== "function") {
                        return;
                    }
                    target.addEventListener(eventName, updateLanguage);
                    cleanupCallbacks.push(() => {
                        try {
                            target.removeEventListener(eventName, updateLanguage);
                        }
                        catch {
                            // Ignore realms that became inaccessible during cleanup.
                        }
                    });
                }
                catch {
                    // Ignore inaccessible window realms.
                }
            };
            for (const realm of languageRealms(globalThis)) {
                for (const eventName of ["languagechange", "focus", "pageshow"]) {
                    addListener(realm, eventName);
                }
                try {
                    addListener(realm.document, "visibilitychange");
                }
                catch {
                    // Ignore inaccessible documents.
                }
                try {
                    const settings = realm.SteamClient?.Settings;
                    const registerForSettingsChanges = settings?.RegisterForSettingsChanges;
                    if (typeof registerForSettingsChanges === "function") {
                        const registration = registerForSettingsChanges.call(settings, updateLanguage);
                        if (typeof registration?.unregister === "function") {
                            cleanupCallbacks.push(() => {
                                try {
                                    registration.unregister();
                                }
                                catch {
                                    // Ignore registrations invalidated by a Steam UI reload.
                                }
                            });
                        }
                    }
                }
                catch {
                    // Settings subscriptions are unavailable on some Decky builds.
                }
            }
            const timer = window.setInterval(updateLanguage, 5000);
            updateLanguage();
            return () => {
                stopped = true;
                requestId += 1;
                for (const cleanup of cleanupCallbacks) {
                    cleanup();
                }
                window.clearInterval(timer);
            };
        }, []);
        return language;
    }
    function useTranslator(language) {
        return SP_REACT.useMemo(() => {
            const strings = translations[language];
            return (key) => strings[key] ?? translations.en[key];
        }, [language]);
    }
    const colors = {
        panel: "#080D14",
        section: "#101720",
        selectedSection: "#7B00FF",
        border: "#27303B",
        focus: "#7B00FF",
        text: "#ffffff",
        muted: "#96A0AD",
        dim: "#56606D",
        hover: "#1B2430",
        inactive: "#3A414B",
        danger: "#ff5555",
        success: "#44d07b",
        black: "#000000",
    };
    const modeOptions = [
        {
            value: "dashboard",
            labelKey: "modeDashboard",
            modeHex: 0x01,
            descriptionKey: "modeDashboardDesc",
        },
        {
            value: "hardware",
            labelKey: "modeHardware",
            modeHex: 0x02,
            descriptionKey: "modeHardwareDesc",
        },
        {
            value: "timeline",
            labelKey: "modeTimeline",
            modeHex: 0x03,
            descriptionKey: "modeTimelineDesc",
        },
        {
            value: "clock",
            labelKey: "modeClock",
            modeHex: 0x04,
            descriptionKey: "modeClockDesc",
        },
        {
            value: "playtime",
            labelKey: "modePlaytime",
            modeHex: 0x05,
            descriptionKey: "modePlaytimeDesc",
        },
        {
            value: "countdown",
            labelKey: "modeCountdown",
            modeHex: 0x06,
            descriptionKey: "modeCountdownDesc",
        },
        {
            value: "chronograph",
            labelKey: "modeChronograph",
            modeHex: 0x07,
            descriptionKey: "modeChronographDesc",
        },
        {
            value: "gif",
            labelKey: "modeGif",
            modeHex: 0x08,
            descriptionKey: "modeGifDesc",
        },
        {
            value: "ai_agent",
            labelKey: "modeAiAgent",
            modeHex: 0x09,
            descriptionKey: "modeAiAgentDesc",
        },
    ];
    const countdownPresets = [
        { label: "5 MIN", minutes: 5, hex: 0x05 },
        { label: "10 MIN", minutes: 10, hex: 0x0a },
        { label: "20 MIN", minutes: 20, hex: 0x14 },
        { label: "30 MIN", minutes: 30, hex: 0x1e },
    ];
    const panelStyle = {
        boxSizing: "border-box",
        width: "100%",
        maxWidth: 330,
        border: `1px solid ${colors.border}`,
        borderRadius: 0,
        background: colors.panel,
        color: colors.text,
        fontFamily: "inherit",
        fontWeight: 400,
        letterSpacing: 0,
        lineHeight: 1.25,
        overflow: "hidden",
        padding: 0,
    };
    const headerStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        borderBottom: `1px solid ${colors.border}`,
        minHeight: 60,
        padding: "0 24px",
        minWidth: 0,
    };
    const cardStyle = {
        boxSizing: "border-box",
        width: "100%",
        border: `1px solid ${colors.border}`,
        borderRadius: 6,
        background: colors.panel,
    };
    const rowStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 8,
        minWidth: 0,
    };
    const transitionStyle = {
        transition: "all 150ms ease",
    };
    const buttonBaseStyle = {
        appearance: "none",
        border: `1px solid ${colors.hover}`,
        borderRadius: 3,
        color: colors.text,
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: 500,
        letterSpacing: 0,
        lineHeight: 1.25,
        minWidth: 0,
        overflow: "hidden",
        overflowWrap: "anywhere",
        padding: "8px 10px",
        textAlign: "center",
        minHeight: 36,
        ...transitionStyle,
    };
    function byteHex(value) {
        return Math.max(0, Math.min(255, value))
            .toString(16)
            .toUpperCase()
            .padStart(2, "0");
    }
    // CRC-16/KERMIT (poly 0x8408) — same as protocols/usb/dy_frame.crc16_kermit
    function crc16Ibm(bytes) {
        let crc = 0x0000;
        for (const byte of bytes) {
            crc ^= byte;
            for (let index = 0; index < 8; index += 1) {
                crc = crc & 0x0001 ? (crc >> 1) ^ 0x8408 : crc >> 1;
            }
        }
        return crc & 0xffff;
    }
    function spacedHex(bytes) {
        return bytes.map(byteHex).join(" ");
    }
    // Host DY USB frame builder (opensource connection protocol).
    function buildFrame(dataType, command, data) {
        const frameWithoutCrc = [0x44, 0x59, dataType, command, (data.length >> 8) & 0xff, data.length & 0xff, ...data];
        const crc = crc16Ibm(frameWithoutCrc);
        return spacedHex([...frameWithoutCrc, (crc >> 8) & 0xff, crc & 0xff]);
    }
    function HoverButton({ children, active = false, danger = false, muted = false, style, onClick, ...buttonProps }) {
        const [hovered, setHovered] = SP_REACT.useState(false);
        const baseBackground = danger ? colors.danger : active ? colors.focus : colors.panel;
        return (SP_JSX.jsx("button", { ...buttonProps, type: "button", onClick: onClick, onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), onFocus: () => setHovered(true), onBlur: () => setHovered(false), style: {
                ...buttonBaseStyle,
                background: hovered ? colors.hover : baseBackground,
                color: muted && !active && !danger ? colors.muted : colors.text,
                maxWidth: "100%",
                ...style,
            }, children: children }));
    }
    function HoverCard({ children, style }) {
        const [hovered, setHovered] = SP_REACT.useState(false);
        return (SP_JSX.jsx("div", { onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), style: {
                ...cardStyle,
                ...transitionStyle,
                background: hovered ? colors.hover : colors.panel,
                ...style,
            }, children: children }));
    }
    function SteamToggle({ checked, label, onChange, }) {
        const [hovered, setHovered] = SP_REACT.useState(false);
        return (SP_JSX.jsxs("button", { type: "button", onClick: () => onChange(!checked), onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), onFocus: () => setHovered(true), onBlur: () => setHovered(false), style: {
                ...rowStyle,
                ...transitionStyle,
                appearance: "none",
                width: "100%",
                border: 0,
                borderRadius: 6,
                background: hovered ? colors.hover : colors.panel,
                color: colors.text,
                cursor: "pointer",
                padding: "9px 10px",
                textAlign: "left",
            }, children: [SP_JSX.jsx("span", { style: {
                        flex: "1 1 auto",
                        minWidth: 0,
                        overflowWrap: "anywhere",
                        fontSize: 13,
                        fontWeight: 400,
                        lineHeight: 1.25,
                    }, children: label }), SP_JSX.jsx("span", { style: {
                        position: "relative",
                        width: 38,
                        height: 20,
                        borderRadius: 999,
                        border: `1px solid ${checked ? colors.focus : colors.inactive}`,
                        background: checked ? colors.focus : colors.panel,
                        flex: "0 0 auto",
                        ...transitionStyle,
                    }, children: SP_JSX.jsx("span", { style: {
                            position: "absolute",
                            top: 2,
                            left: checked ? 19 : 2,
                            width: 14,
                            height: 14,
                            borderRadius: 999,
                            background: colors.text,
                            ...transitionStyle,
                        } }) })] }));
    }
    function SectionLabel({ children }) {
        return (SP_JSX.jsx("div", { style: {
                color: colors.muted,
                fontSize: 11,
                fontWeight: 500,
                letterSpacing: 0,
                textTransform: "uppercase",
                marginBottom: 8,
            }, children: children }));
    }
    function MessageBlock({ children }) {
        return (SP_JSX.jsx("div", { style: {
                borderRadius: 6,
                background: "#202228",
                color: colors.muted,
                fontSize: 12,
                fontWeight: 400,
                lineHeight: 1.35,
                overflowWrap: "anywhere",
                padding: "9px 10px",
            }, children: children }));
    }
    function StatRow({ label, value, accent = false }) {
        return (SP_JSX.jsxs("div", { style: { ...rowStyle, background: "#202228", borderRadius: 6, padding: "9px 10px" }, children: [SP_JSX.jsx("span", { style: {
                        color: colors.muted,
                        flex: "1 1 auto",
                        fontSize: 12,
                        fontWeight: 400,
                        lineHeight: 1.25,
                        minWidth: 0,
                        overflowWrap: "anywhere",
                    }, children: label }), SP_JSX.jsx("span", { style: {
                        color: accent ? colors.focus : colors.text,
                        flex: "0 0 auto",
                        fontFamily: "inherit",
                        fontSize: 12,
                        fontWeight: 500,
                    }, children: value })] }));
    }
    function MicroLedPreview() {
        return (SP_JSX.jsx("div", { style: {
                width: 64,
                height: 64,
                borderRadius: 3,
                border: `1px solid ${colors.hover}`,
                background: colors.black,
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)",
                gap: 3,
                padding: 8,
                boxSizing: "border-box",
                flex: "0 0 auto",
            }, children: Array.from({ length: 32 }).map((_, index) => (SP_JSX.jsx("span", { style: {
                    width: 3,
                    height: 3,
                    borderRadius: 999,
                    alignSelf: "center",
                    justifySelf: "center",
                    background: index % 7 === 0 ? colors.focus : index % 5 === 0 ? "#7dd3fc" : colors.hover,
                } }, index))) }));
    }
    function AdvancedPanel({ displayMode, selectedCountdown, onCountdownSelect, onDashboardTest, onHardwareTest, onGifUpload, t, }) {
        if (displayMode === "dashboard") {
            return (SP_JSX.jsxs("div", { style: { display: "grid", gap: 8, minWidth: 0 }, children: [SP_JSX.jsx(MessageBlock, { children: t("dashboardReady") }), SP_JSX.jsx(SteamToggle, { label: t("subtleSeconds"), checked: true, onChange: () => undefined }), SP_JSX.jsx(HoverButton, { onClick: onDashboardTest, children: t("dashboardTest") })] }));
        }
        if (displayMode === "hardware") {
            return (SP_JSX.jsxs("div", { style: { display: "grid", gap: 7, minWidth: 0 }, children: [SP_JSX.jsx(SteamToggle, { label: t("gpuCpuMonitor"), checked: true, onChange: () => undefined }), SP_JSX.jsx(SteamToggle, { label: t("thermalAlerts"), checked: false, onChange: () => undefined }), SP_JSX.jsx(StatRow, { label: t("refreshCadence"), value: "1s", accent: true }), SP_JSX.jsx(HoverButton, { onClick: onHardwareTest, children: t("hardwareTest") })] }));
        }
        if (displayMode === "timeline") {
            return (SP_JSX.jsxs("div", { style: { display: "grid", gap: 8, minWidth: 0 }, children: [SP_JSX.jsx(StatRow, { label: t("carouselInterval"), value: "30s", accent: true }), SP_JSX.jsx(StatRow, { label: t("nextScheduledCard"), value: t("weather") }), SP_JSX.jsx(MessageBlock, { children: t("timelineHint") })] }));
        }
        if (displayMode === "clock") {
            return (SP_JSX.jsxs("div", { style: { display: "grid", gap: 8, minWidth: 0 }, children: [SP_JSX.jsx(MessageBlock, { children: t("clockHint") }), SP_JSX.jsx(SteamToggle, { label: t("compactStatusLine"), checked: true, onChange: () => undefined })] }));
        }
        if (displayMode === "playtime") {
            return (SP_JSX.jsxs("div", { style: { display: "grid", gap: 8, minWidth: 0 }, children: [SP_JSX.jsx(StatRow, { label: t("currentGameRuntime"), value: "02h 45m" }), SP_JSX.jsxs("div", { style: { ...rowStyle, background: "#202228", borderRadius: 6, padding: "9px 10px" }, children: [SP_JSX.jsx("span", { style: {
                                    color: colors.muted,
                                    flex: "1 1 auto",
                                    fontSize: 12,
                                    lineHeight: 1.25,
                                    minWidth: 0,
                                    overflowWrap: "anywhere",
                                }, children: t("steamAchievements") }), SP_JSX.jsxs("span", { style: { ...rowStyle, flex: "0 0 auto", justifyContent: "flex-start", color: colors.success, fontSize: 12 }, children: [SP_JSX.jsx("span", { style: { width: 7, height: 7, borderRadius: 999, background: colors.success } }), t("connected")] })] })] }));
        }
        if (displayMode === "countdown") {
            return (SP_JSX.jsxs("div", { style: { display: "grid", gap: 9, minWidth: 0 }, children: [SP_JSX.jsx(SectionLabel, { children: t("countdownDuration") }), SP_JSX.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 6, minWidth: 0 }, children: countdownPresets.map((preset) => {
                            const active = preset.minutes === selectedCountdown;
                            return (SP_JSX.jsx(HoverButton, { active: active, muted: !active, onClick: () => onCountdownSelect(preset), style: {
                                    minHeight: 32,
                                    padding: "7px 4px",
                                    borderRadius: 999,
                                    borderColor: active ? colors.focus : colors.inactive,
                                    fontSize: 11,
                                }, children: preset.label }, preset.minutes));
                        }) }), SP_JSX.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 7, minWidth: 0 }, children: [SP_JSX.jsx(HoverButton, { danger: true, children: t("startCountdown") }), SP_JSX.jsx(HoverButton, { muted: true, children: t("reset") })] })] }));
        }
        if (displayMode === "chronograph") {
            return (SP_JSX.jsxs("div", { style: { display: "grid", gap: 8, minWidth: 0 }, children: [SP_JSX.jsx(MessageBlock, { children: t("chronographHint") }), SP_JSX.jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 7, minWidth: 0 }, children: [SP_JSX.jsx(HoverButton, { active: true, children: t("startTimer") }), SP_JSX.jsx(HoverButton, { muted: true, children: t("reset") })] })] }));
        }
        return (SP_JSX.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 10, minWidth: 0 }, children: [SP_JSX.jsx(MicroLedPreview, {}), SP_JSX.jsx(HoverButton, { onClick: onGifUpload, style: {
                        flex: "1 1 auto",
                        minHeight: 44,
                        minWidth: 0,
                        whiteSpace: "normal",
                        lineHeight: 1.25,
                    }, children: t("uploadGif") })] }));
    }
    function aiAgentPercentRemaining(window) {
        if (!window || typeof window.used_percent !== "number") {
            return "--";
        }
        return Math.max(0, Math.min(100, 100 - Math.round(window.used_percent))) + "%";
    }
    function aiAgentResetLabel(window) {
        let seconds = window && typeof window.reset_after_seconds === "number" ? window.reset_after_seconds : null;
        let at = window && typeof window.reset_at === "number" ? window.reset_at : null;
        if (at == null && seconds != null) {
            at = Math.round(Date.now() / 1000) + seconds;
        }
        if (at == null) {
            return "--";
        }
        const date = new Date(at * 1000);
        const pad = (value) => String(value).padStart(2, "0");
        const time = pad(date.getHours()) + ":" + pad(date.getMinutes());
        if (seconds != null && seconds < 48 * 3600) {
            return time;
        }
        return (date.getMonth() + 1) + "/" + date.getDate() + " " + time;
    }
    function AiAgentPanel() {
        // 插件模式只负责把屏幕切到 AI Agent 模块；登录/退出/刷新仅在桌面模式提供。
        // 面板刻意不渲染任何提示，避免挤占设置页 UI。
        return null;
    }

    function MatrixLogo({ size = 5, color = colors.focus }) {
        return (SP_JSX.jsx("span", { style: {
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: Math.max(2, Math.round(size * 0.45)),
                width: size * 3 + Math.max(2, Math.round(size * 0.45)) * 2,
                height: size * 3 + Math.max(2, Math.round(size * 0.45)) * 2,
                flex: "0 0 auto",
            }, children: Array.from({ length: 9 }, (_, index) => (SP_JSX.jsx("span", { style: { width: size, height: size, borderRadius: 1, background: color } }, index))) }));
    }
    function ModeGlyph({ value }) {
        const glyphs = {
            dashboard: "▦",
            clock: "◷",
            timeline: "☁",
            hardware: "◎",
            playtime: "▧",
            gif: "▣",
        };
        let glyph = glyphs[value] ?? "□";
        if (value === "countdown") {
            glyph = SP_JSX.jsxs("svg", { "data-mode-glyph": "countdown", "aria-hidden": "true", viewBox: "0 0 24 24", width: 26, height: 26, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", style: { display: "block", flex: "0 0 auto" }, children: [SP_JSX.jsx("path", { d: "M5 3.5H19" }), SP_JSX.jsx("path", { d: "M5 20.5H19" }), SP_JSX.jsx("path", { d: "M7 4.5L17 19.5" }), SP_JSX.jsx("path", { d: "M17 4.5L7 19.5" }), SP_JSX.jsx("path", { d: "M8.5 8H15.5" }), SP_JSX.jsx("path", { d: "M9.5 17H14.5" })] });
        }
        else if (value === "chronograph") {
            glyph = SP_JSX.jsxs("svg", { "data-mode-glyph": "chronograph", "aria-hidden": "true", viewBox: "0 0 24 24", width: 26, height: 26, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", style: { display: "block", flex: "0 0 auto" }, children: [SP_JSX.jsx("circle", { cx: 12, cy: 14, r: 7.5 }), SP_JSX.jsx("path", { d: "M9 3H15" }), SP_JSX.jsx("path", { d: "M12 3V6.5" }), SP_JSX.jsx("path", { d: "M7.2 8.5L5.2 6.5" }), SP_JSX.jsx("path", { d: "M12 14L15.2 10.8" }), SP_JSX.jsx("circle", { cx: 12, cy: 14, r: 1, fill: "currentColor", stroke: "none" })] });
        }
        else if (value === "ai_agent") {
            glyph = SP_JSX.jsxs("svg", { "data-mode-glyph": "ai_agent", "aria-hidden": "true", viewBox: "0 0 24 24", width: 26, height: 26, fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round", style: { display: "block", flex: "0 0 auto" }, children: [SP_JSX.jsx("path", { d: "M12 3.5V6" }), SP_JSX.jsx("circle", { cx: 12, cy: 3, r: 1 }), SP_JSX.jsx("rect", { x: 5, y: 6, width: 14, height: 12, rx: 3 }), SP_JSX.jsx("circle", { cx: 9.5, cy: 11.5, r: 1.4 }), SP_JSX.jsx("circle", { cx: 14.5, cy: 11.5, r: 1.4 }), SP_JSX.jsx("path", { d: "M9.5 15H14.5" })] });
        }
        return (SP_JSX.jsx("span", { style: {
                alignItems: "center",
                color: "inherit",
                display: "inline-flex",
                flex: "0 0 auto",
                fontSize: 24,
                fontWeight: 400,
                justifyContent: "center",
                lineHeight: 1,
                textAlign: "center",
                width: 34,
            }, children: glyph }));
    }
    function MatrixModeTile({ option, active, onClick, t }) {
        const [hovered, setHovered] = SP_REACT.useState(false);
        return (SP_JSX.jsxs("button", { type: "button", role: "option", "aria-selected": active, "data-mode-value": option.value, onClick: onClick, onMouseEnter: () => setHovered(true), onMouseLeave: () => setHovered(false), onFocus: () => setHovered(true), onBlur: () => setHovered(false), style: {
                ...transitionStyle,
                appearance: "none",
                alignItems: "center",
                background: hovered ? colors.hover : colors.panel,
                border: `1px solid ${colors.border}`,
                borderRadius: 8,
                boxSizing: "border-box",
                color: colors.muted,
                cursor: "pointer",
                display: "flex",
                gap: 9,
                justifyContent: "flex-start",
                minHeight: 58,
                minWidth: 0,
                outline: "none",
                padding: "10px 12px",
                textAlign: "left",
                width: "100%",
            }, children: [SP_JSX.jsx(ModeGlyph, { value: option.value }), SP_JSX.jsx("span", { style: {
                        flex: "1 1 auto",
                        fontSize: 13,
                        fontWeight: 500,
                        lineHeight: 1.2,
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }, children: t(option.labelKey) })] }, option.value));
    }
    function TimerControlGroup({ pickerKind, children }) {
        return (SP_JSX.jsx("div", { "data-timer-control-group": pickerKind, style: { display: "contents" }, children: children }));
    }
    function CountdownTimePicker({ time, activeField, onFieldChange, onAdjust, t, pickerKind = "countdown" }) {
        const fields = [
            { key: "hours", unit: t("countdownHourUnit"), max: 99 },
            { key: "minutes", unit: t("countdownMinuteUnit"), max: 59 },
            { key: "seconds", unit: t("countdownSecondUnit"), max: 59 },
        ];
        const dragRef = SP_REACT.useRef(null);
        const beginCountdownDrag = (event, field) => {
            dragRef.current = { field, pointerId: event.pointerId, startY: event.clientY, steps: 0 };
            event.currentTarget.setPointerCapture?.(event.pointerId);
            onFieldChange(field);
        };
        const moveCountdownDrag = (event, field) => {
            const drag = dragRef.current;
            if (!drag || drag.field !== field || drag.pointerId !== event.pointerId) {
                return;
            }
            const steps = Math.trunc((drag.startY - event.clientY) / 24);
            const delta = steps - drag.steps;
            if (delta) {
                drag.steps = steps;
                onAdjust(field, delta);
            }
            event.preventDefault();
        };
        const endCountdownDrag = (event) => {
            if (dragRef.current?.pointerId === event.pointerId) {
                dragRef.current = null;
            }
        };
        const formatValue = (value) => String(value).padStart(1, "0");
        const clampValue = (value, max) => Math.max(0, Math.min(max, value));
        const surrounding = (field, direction) => {
            const value = time[field.key] ?? 0;
            return [1, 2, 3].map((step) => {
                const next = direction < 0 ? value - (4 - step) : value + step;
                return next < 0 || next > field.max ? "" : formatValue(clampValue(next, field.max));
            });
        };
        return (SP_JSX.jsx("div", { "data-time-picker": pickerKind, style: {
                borderTop: `1px solid ${colors.border}`,
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 10,
                marginTop: 16,
                minHeight: 198,
                minWidth: 0,
                paddingTop: 12,
            }, children: fields.map((field) => {
                const active = activeField === field.key;
                const value = time[field.key] ?? 0;
                return (SP_JSX.jsxs("div", { style: {
                        alignItems: "center",
                        display: "grid",
                        gap: 5,
                        justifyItems: "center",
                        minWidth: 0,
                    }, children: [SP_JSX.jsx("button", { type: "button", onClick: () => onAdjust(field.key, 1), style: {
                                ...transitionStyle,
                                appearance: "none",
                                background: "transparent",
                                border: 0,
                                color: colors.dim,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                fontSize: 13,
                                height: 18,
                                lineHeight: 1,
                                padding: 0,
                            }, children: "+" }), SP_JSX.jsx("div", { style: {
                                display: "grid",
                                gap: 3,
                                minHeight: 46,
                                placeItems: "center",
                            }, children: surrounding(field, -1).map((item, index) => (SP_JSX.jsx("span", { style: {
                                        color: colors.dim,
                                        fontSize: 13,
                                        lineHeight: 1,
                                        minHeight: 13,
                                        opacity: item ? 0.5 + index * 0.14 : 0,
                                    }, children: item || "0" }, `${field.key}-top-${index}`))) }), SP_JSX.jsxs("button", { type: "button", onClick: () => onFieldChange(field.key), style: {
                                ...transitionStyle,
                                alignItems: "baseline",
                                appearance: "none",
                                background: active ? colors.focus : colors.inactive,
                                border: 0,
                                borderRadius: 8,
                                color: colors.text,
                                cursor: "pointer",
                                display: "flex",
                                fontFamily: "inherit",
                                gap: 5,
                                height: 34,
                                justifyContent: "center",
                                minWidth: 76,
                                outline: "none",
                                padding: "5px 8px",
                                touchAction: "none",
                            }, "data-time-picker-field": field.key, "data-time-picker-active": active ? "true" : "false", onPointerDown: (event) => beginCountdownDrag(event, field.key), onPointerMove: (event) => moveCountdownDrag(event, field.key), onPointerUp: endCountdownDrag, onPointerCancel: endCountdownDrag, children: [SP_JSX.jsx("span", { style: { fontSize: 24, fontWeight: 500, lineHeight: 1 }, children: formatValue(value) }), SP_JSX.jsx("span", { style: { fontSize: 12, fontWeight: 500, lineHeight: 1 }, children: field.unit })] }), SP_JSX.jsx("div", { style: {
                                display: "grid",
                                gap: 3,
                                minHeight: 46,
                                placeItems: "center",
                            }, children: surrounding(field, 1).map((item, index) => (SP_JSX.jsx("span", { style: {
                                        color: colors.dim,
                                        fontSize: 13,
                                        lineHeight: 1,
                                        minHeight: 13,
                                        opacity: item ? 0.72 - index * 0.14 : 0,
                                    }, children: item || "0" }, `${field.key}-bottom-${index}`))) }), SP_JSX.jsx("button", { type: "button", onClick: () => onAdjust(field.key, -1), style: {
                                ...transitionStyle,
                                appearance: "none",
                                background: "transparent",
                                border: 0,
                                color: colors.dim,
                                cursor: "pointer",
                                fontFamily: "inherit",
                                fontSize: 13,
                                height: 18,
                                lineHeight: 1,
                                padding: 0,
                            }, children: "-" })] }, field.key));
            }) }));
    }
    function CustomAssetPanel({ assets, previews, selectedAsset, deletableAssets, uploadAllowed = Array.isArray(assets) && assets.length < 6, actionTarget, actionBusy, status, fileInputRef, onUploadClick, onFileChange, onAssetLock, onAssetSelect, onDelete, t }) {
        const visibleAssets = Array.isArray(assets) ? assets.slice(0, 6) : [];
        const deletableSet = new Set(Array.isArray(deletableAssets) ? deletableAssets : []);
        const hasAssets = visibleAssets.length > 0;
        const selectEnabled = Boolean(actionTarget);
        const deleteEnabled = Boolean(actionTarget && deletableSet.has(actionTarget));
        const replacementOnly = !uploadAllowed && visibleAssets.length === 6;
        const uploadEnabled = uploadAllowed || replacementOnly;
        const hiddenStatusStyle = {
            border: 0,
            clip: "rect(0 0 0 0)",
            height: 1,
            margin: -1,
            overflow: "hidden",
            padding: 0,
            position: "absolute",
            whiteSpace: "nowrap",
            width: 1,
        };
        const assetCardStyle = {
            alignItems: "center",
            aspectRatio: "195 / 164",
            background: colors.panel,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            boxSizing: "border-box",
            color: colors.dim,
            display: "flex",
            fontFamily: "inherit",
            fontSize: 12,
            fontWeight: 600,
            justifyContent: "center",
            lineHeight: 1.35,
            minWidth: 0,
            padding: 10,
            textAlign: "center",
            whiteSpace: "pre-line",
        };
        return (SP_JSX.jsxs("aside", { "data-jsaux-custom-panel": "true", style: {
                background: colors.panel,
                border: `1px solid ${colors.border}`,
                boxSizing: "border-box",
                color: colors.text,
                display: "flex",
                flexDirection: "column",
                fontFamily: "inherit",
                justifyContent: hasAssets ? "flex-start" : "center",
                maxWidth: 330,
                minHeight: 480,
                minWidth: 0,
                overflowY: "auto",
                padding: hasAssets ? "18px 24px 24px" : "24px",
                position: "relative",
                width: "100%",
            }, children: [SP_JSX.jsx("input", { ref: fileInputRef, type: "file", accept: ".png,.jpg,.jpeg,.bmp,.gif,.svg", multiple: false, directory: false, webkitdirectory: false, onChange: onFileChange, style: { display: "none" } }), hasAssets ? SP_JSX.jsx("div", { "data-custom-asset-grid": "true", style: {
                                display: "grid",
                                gap: 10,
                                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                minWidth: 0,
                            }, children: visibleAssets.map((asset) => {
                                const name = typeof asset === "string" ? asset : asset?.name ?? asset?.filename ?? String(asset);
                                const preview = typeof previews?.[name] === "string" ? previews[name] : "";
                                return (SP_JSX.jsx("button", { type: "button", "data-custom-asset": name, "data-custom-action-selected": name === actionTarget ? "true" : undefined, "data-custom-action-busy": actionBusy ? "true" : "false", "data-custom-deletable": deletableSet.has(name) ? "true" : "false", "aria-label": name, "aria-pressed": name === selectedAsset, disabled: actionBusy, title: name, onClick: () => onAssetLock(name), style: {
                                        ...transitionStyle,
                                        ...assetCardStyle,
                                        appearance: "none",
                                        cursor: actionBusy ? "default" : "pointer",
                                        outline: "none",
                                        overflow: "hidden",
                                        padding: preview ? 0 : assetCardStyle.padding,
                                        position: "relative",
                                    }, children: preview ? SP_JSX.jsx("img", { src: preview, alt: "", style: {
                                            display: "block",
                                            height: "100%",
                                            imageRendering: "pixelated",
                                            objectFit: "fill",
                                            pointerEvents: "none",
                                            width: "100%",
                                        } }) : t("customThumbnail") }, name));
                            }) }) : null, actionTarget ? SP_JSX.jsxs("div", { "data-custom-actions": "true", style: {
                        alignSelf: "center",
                        display: "grid",
                        gap: 10,
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        marginTop: hasAssets ? 24 : 0,
                        width: hasAssets ? "100%" : "83%",
                    }, children: [SP_JSX.jsx("button", { type: "button", "data-custom-select": "true", "data-custom-action-target": actionTarget, "data-custom-action-busy": actionBusy ? "true" : "false", disabled: !selectEnabled || actionBusy, onClick: () => onAssetSelect(actionTarget), style: {
                                ...transitionStyle,
                                appearance: "none",
                                background: colors.inactive,
                                border: 0,
                                borderRadius: 12,
                                color: colors.muted,
                                cursor: selectEnabled && !actionBusy ? "pointer" : "default",
                                fontFamily: "inherit",
                                fontSize: 13,
                                fontWeight: 600,
                                minHeight: 40,
                                outline: "none",
                                padding: "9px 16px",
                                width: "100%",
                            }, children: t("customSelect") }), SP_JSX.jsx("button", { type: "button", "data-custom-delete": "true", "data-custom-action-target": actionTarget, "data-custom-action-busy": actionBusy ? "true" : "false", "data-custom-delete-target": actionTarget, disabled: !deleteEnabled || actionBusy, onClick: () => onDelete(actionTarget), style: {
                                ...transitionStyle,
                                appearance: "none",
                                background: colors.inactive,
                                border: 0,
                                borderRadius: 12,
                                color: deleteEnabled ? colors.text : colors.muted,
                                cursor: deleteEnabled && !actionBusy ? "pointer" : "default",
                                fontFamily: "inherit",
                                fontSize: 13,
                                fontWeight: 600,
                                minHeight: 40,
                                outline: "none",
                                padding: "9px 16px",
                                width: "100%",
                            }, children: t("customDelete") })] }) : null, uploadEnabled ? SP_JSX.jsx("button", { type: "button", "data-custom-upload": "true", "data-custom-empty": hasAssets ? undefined : "true", "data-custom-action-busy": actionBusy ? "true" : "false", disabled: actionBusy, onClick: onUploadClick, style: {
                        ...transitionStyle,
                        alignSelf: "center",
                        appearance: "none",
                        background: colors.inactive,
                        border: 0,
                        borderRadius: 12,
                        color: colors.muted,
                        cursor: uploadEnabled && !actionBusy ? "pointer" : "default",
                        fontFamily: "inherit",
                        fontSize: 13,
                        fontWeight: 600,
                        marginTop: 10,
                        minHeight: 40,
                        outline: "none",
                        padding: "9px 16px",
                        width: hasAssets ? "100%" : "83%",
                    }, children: t(replacementOnly ? "customReplaceLocal" : "customUploadLocal") }) : null, status ? SP_JSX.jsx("span", { role: "status", "aria-live": "polite", style: hiddenStatusStyle, children: status }) : null] }));
    }
    function Content() {
        const language = useDeckLanguage();
        const t = useTranslator(language);
        const [screenOn, setScreenOn] = SP_REACT.useState(true);
        const [brightness, setBrightness] = SP_REACT.useState(80);
        const [temperatureUnit, setTemperatureUnit] = SP_REACT.useState("celsius");
        const [timeFormat, setTimeFormat] = SP_REACT.useState("12h");
        const [displayMode, setDisplayMode] = SP_REACT.useState("dashboard");
        const [activeTimePicker, setActiveTimePicker] = SP_REACT.useState(null);
        const [modeMenuOpen, setModeMenuOpen] = SP_REACT.useState(false);
        const [selectedCountdown, setSelectedCountdown] = SP_REACT.useState(30);
        const [countdownTime, setCountdownTime] = SP_REACT.useState({ hours: 0, minutes: 30, seconds: 0 });
        const [countdownCommittedTime, setCountdownCommittedTime] = SP_REACT.useState({ hours: 0, minutes: 30, seconds: 0 });
        const [activeCountdownField, setActiveCountdownField] = SP_REACT.useState("minutes");
        const [chronographTime, setChronographTime] = SP_REACT.useState({ hours: 0, minutes: 30, seconds: 0 });
        const [chronographCommittedTime, setChronographCommittedTime] = SP_REACT.useState({ hours: 0, minutes: 30, seconds: 0 });
        const [activeChronographField, setActiveChronographField] = SP_REACT.useState("minutes");
        const [aiAgentStatus, setAiAgentStatus] = SP_REACT.useState(null);
        const [aiAgentError, setAiAgentError] = SP_REACT.useState("");
        const [aiAgentLoading, setAiAgentLoading] = SP_REACT.useState(false);
        const aiAgentRequestRef = SP_REACT.useRef(0);
        const [aiAgentLogin, setAiAgentLogin] = SP_REACT.useState(null);
        const aiAgentLoginPollRef = SP_REACT.useRef(false);
        const [customAssets, setCustomAssets] = SP_REACT.useState([]);
        const [customPreviews, setCustomPreviews] = SP_REACT.useState({});
        const [customDeletable, setCustomDeletable] = SP_REACT.useState([]);
        const [selectedCustomAsset, setSelectedCustomAsset] = SP_REACT.useState("");
        const [customUploadAllowedState, setCustomUploadAllowedState] = SP_REACT.useState(false);
        const [customActionTarget, setCustomActionTarget] = SP_REACT.useState("");
        const [customActionPending, setCustomActionPending] = SP_REACT.useState(false);
        const customActionPendingRef = SP_REACT.useRef(false);
        const brightnessFallbackSchedulerRef = SP_REACT.useRef(null);
        const brightnessTransportRef = SP_REACT.useRef(null);
        const brightnessActiveRef = SP_REACT.useRef(true);
        const [customAssetStatus, setCustomAssetStatus] = SP_REACT.useState("");
        const fileInputRef = SP_REACT.useRef(null);
        const [serialStatus, setSerialStatus] = SP_REACT.useState(() => translations[resolveLanguage()].serialReady);
        const latestFirmwareVersion = ""; // No verified firmware catalogue is available.
        const displayVersion = "V1.2";
        const [firmwareVersion, setFirmwareVersion] = SP_REACT.useState("--");
        const [settingsOpen, setSettingsOpen] = SP_REACT.useState(false);
        const [timeZoneId, setTimeZoneId] = SP_REACT.useState("");
        const [autoDaylightSaving, setAutoDaylightSaving] = SP_REACT.useState(true);
        const [doNotDisturb, setDoNotDisturb] = SP_REACT.useState(false);
        const doNotDisturbPendingRef = SP_REACT.useRef(false);
        const [weatherResolvedLocation, setWeatherResolvedLocation] = SP_REACT.useState("");
        const [weatherLocation, setWeatherLocation] = SP_REACT.useState("Local");
        const [weatherLocalLabel, setWeatherLocalLabel] = SP_REACT.useState("");
        const [weatherCityQuery, setWeatherCityQuery] = SP_REACT.useState("");
        const [weatherCityOptions, setWeatherCityOptions] = SP_REACT.useState([]);
        const [settingsPicker, setSettingsPicker] = SP_REACT.useState(null);
        const [measurementSystem, setMeasurementSystem] = SP_REACT.useState("metric");
        const [timeZoneOffsetOptions, setTimeZoneOffsetOptions] = SP_REACT.useState([]);
        const firmwareUpdateAvailable = isFirmwareUpdateAvailable(firmwareVersion, latestFirmwareVersion);
        const firmwareActionText = parseFirmwareVersion(firmwareVersion) ? t("firmwareUnsupportedShort") : t("firmwareUnknown");
        const buildFallbackUtcOffsetOptions = () => {
            const offsets = new Set();
            for (let hour = -12; hour <= 14; hour += 1) {
                offsets.add(hour * 3600);
            }
            for (const minutes of [-570, -210, 210, 270, 330, 345, 390, 525, 570, 630, 765]) {
                offsets.add(minutes * 60);
            }
            return Array.from(offsets).sort((left, right) => left - right).map((offset) => {
                const sign = offset < 0 ? "-" : "+";
                const absolute = Math.abs(offset);
                const label = `UTC${sign}${String(Math.floor(absolute / 3600)).padStart(2, "0")}:${String((absolute % 3600) / 60).padStart(2, "0")}`;
                return { value: label, label };
            });
        };
        const timeZoneOptions = SP_REACT.useMemo(() => {
            const offsets = timeZoneOffsetOptions.length > 0 ? timeZoneOffsetOptions : buildFallbackUtcOffsetOptions();
            const options = [{ value: "", label: t("settingsFollowSystem") }, ...offsets];
            if (timeZoneId && !options.some((option) => option.value === timeZoneId)) {
                options.push({ value: timeZoneId, label: timeZoneId === "UTC" ? "UTC+00:00" : timeZoneId });
            }
            return options;
        }, [t, timeZoneId, timeZoneOffsetOptions]);
        const timeFormatOptions = [
            { value: "12h", label: t("timeFormat12") },
            { value: "24h", label: t("timeFormat24") },
        ];
        const daylightSavingOptions = [
            { value: "on", label: t("settingsYes") },
            { value: "off", label: t("settingsNo") },
        ];
        const temperatureUnitOptions = [
            { value: "celsius", label: t("temperatureCelsius") },
            { value: "fahrenheit", label: t("temperatureFahrenheit") },
        ];
        const measurementSystemOptions = [
            { value: "metric", label: t("settingsMetric") },
            { value: "us", label: t("settingsUs") },
            { value: "uk", label: t("settingsUk") },
        ];
        const brightnessFill = SP_REACT.useMemo(() => Math.max(0, Math.min(100, brightness)), [brightness]);
        const activeMode = modeOptions.find((option) => option.value === displayMode) ?? modeOptions[0];
        if (brightnessFallbackSchedulerRef.current === null) {
            brightnessFallbackSchedulerRef.current = createLatestOnlyAsyncScheduler(async (value) => {
                ensureActionResult(await setBrightnessRpc(value));
            }, (error) => {
                if (brightnessActiveRef.current) {
                    showActionError(error);
                }
            });
        }
        SP_REACT.useEffect(() => {
            brightnessActiveRef.current = true;
            const brightnessTransport = createRealtimeBrightnessTransport((url) => new window.WebSocket(url), (callback) => window.requestAnimationFrame(callback), (id) => window.cancelAnimationFrame(id), (value) => brightnessFallbackSchedulerRef.current(value));
            brightnessTransportRef.current = brightnessTransport;
            return () => {
                brightnessActiveRef.current = false;
                if (brightnessTransportRef.current === brightnessTransport) {
                    brightnessTransportRef.current = null;
                }
                brightnessTransport.dispose();
            };
        }, []);
        SP_REACT.useEffect(() => {
            setSerialStatus((currentStatus) => {
                if (Object.values(translations).some((strings) => currentStatus === strings.serialReady)) {
                    return t("serialReady");
                }
                return currentStatus;
            });
        }, [t]);
        SP_REACT.useEffect(() => {
            let cancelled = false;
            void (async () => {
                try {
                    const [device, settingsResult, countdown, chronograph, custom] = await Promise.all([getStatus(), getDisplaySettings(), getCountdown(), getChronograph(), getCustomAssets()]);
                    if (cancelled) {
                        return;
                    }
                    const settings = settingsResult?.displaySettings ?? settingsResult ?? {};
                    const activeModuleId = settings.activeModuleId ?? device?.activeModuleId ?? "dashboard";
                    const restoredCountdown = timeFromSeconds(countdown?.totalSeconds, countdownTime);
                    const restoredChronograph = timeFromSeconds(chronograph?.totalSeconds, chronographTime);
                    const visibleAssets = customAssetNames(custom);
                    setScreenOn(device?.screenEnabled !== false);
                    const restoredBrightness = Number(device?.brightness);
                    setBrightness(Number.isFinite(restoredBrightness) ? Math.max(0, Math.min(100, restoredBrightness)) : 80);
                    const restoredTemperatureUnit = String(settings.temperatureUnit || "").toLowerCase() === "fahrenheit"
                        ? "fahrenheit"
                        : "celsius";
                    const restoredTimeFormat = String(settings.timeFormat || "").toLowerCase() === "24h"
                        ? "24h"
                        : "12h";
                    setTemperatureUnit(restoredTemperatureUnit);
                    setTimeFormat(restoredTimeFormat);
                    const restoredZone = String(settings.timeZoneId || "");
                    setTimeZoneId(restoredZone === "UTC" ? "UTC+00:00" : restoredZone);
                    setAutoDaylightSaving(settings.autoDaylightSaving !== false);
                    setDoNotDisturb(settings.doNotDisturb === true);
                    setWeatherResolvedLocation(String(settings.weatherResolvedLocation || "").trim());
                    setWeatherLocation(String(settings.weatherLocation || "Local").trim() || "Local");
                    setWeatherLocalLabel(String(settings.weatherLocalLabel || "").trim());
                    const restoredMeasurement = String(settings.measurementSystem || "metric").toLowerCase();
                    setMeasurementSystem(["metric", "us", "uk"].includes(restoredMeasurement)
                        ? restoredMeasurement
                        : "metric");
                    const zoneOptions = Array.isArray(settings.timeZoneOptions) ? settings.timeZoneOptions : [];
                    const normalizedZoneOptions = zoneOptions
                        .map((option) => {
                            const value = String(option?.value ?? option?.label ?? "").trim();
                            if (!value || value === "UTC") {
                                return value === "UTC" ? { value: "UTC+00:00", label: "UTC+00:00" } : null;
                            }
                            return { value, label: String(option?.label || value) };
                        })
                        .filter(Boolean);
                    if (normalizedZoneOptions.length > 0) {
                        setTimeZoneOffsetOptions(normalizedZoneOptions);
                    }
                    setDisplayMode(modeFromDaemonId(activeModuleId));
                    setCountdownTime(restoredCountdown);
                    setCountdownCommittedTime(restoredCountdown);
                    setSelectedCountdown(Math.max(1, Math.ceil(countdownSecondsFromTime(restoredCountdown) / 60)));
                    setChronographTime(restoredChronograph);
                    setChronographCommittedTime(restoredChronograph);
                    setCustomAssets(visibleAssets);
                    setCustomPreviews(customAssetPreviews(custom));
                    setCustomDeletable(customAssetDeletable(custom));
                    setCustomUploadAllowedState(customAssetUploadAllowed(custom));
                    setSelectedCustomAsset(custom?.current_asset ?? custom?.currentAsset ?? "");
                    setFirmwareVersion(device?.firmwareVersion || "--");
                }
                catch (error) {
                    if (!cancelled) {
                        showActionError(error);
                    }
                }
            })();
            return () => {
                cancelled = true;
            };
        }, []);
        SP_REACT.useEffect(() => {
            if (!settingsOpen) return undefined;
            let cancelled = false;
            let reading = false;
            const refresh = async () => {
                if (reading || doNotDisturbPendingRef.current) return;
                reading = true;
                try {
                    const settings = await getRefreshSettings();
                    if (!cancelled && !doNotDisturbPendingRef.current && settings?.ok !== false)
                        setDoNotDisturb(settings?.doNotDisturb === true);
                } catch { /* Keep the last confirmed setting during a reconnect. */ }
                finally { reading = false; }
            };
            void refresh();
            const timer = window.setInterval(() => void refresh(), 1000);
            return () => { cancelled = true; window.clearInterval(timer); };
        }, [settingsOpen]);
        SP_REACT.useEffect(() => {
            if (!settingsOpen) {
                return undefined;
            }
            let cancelled = false;
            const refreshWeatherSettings = async () => {
                try {
                    const settingsResult = await getDisplaySettings();
                    if (cancelled) {
                        return;
                    }
                    const settings = settingsResult?.displaySettings ?? settingsResult ?? {};
                    setWeatherResolvedLocation(String(settings.weatherResolvedLocation || "").trim());
                    setWeatherLocation(String(settings.weatherLocation || "Local").trim() || "Local");
                    setWeatherLocalLabel(String(settings.weatherLocalLabel || "").trim());
                }
                catch {
                    // 设置页城市展示失败时保持上次结果，避免打断手柄导航。
                }
            };
            const refreshWeatherCities = async (query) => {
                try {
                    const payload = await getWeatherCities(query || "", language || "en", query ? 80 : 120);
                    if (cancelled) {
                        return;
                    }
                    const local = payload?.local || {};
                    if (local.label) {
                        setWeatherLocalLabel(String(local.label));
                    }
                    const cities = Array.isArray(payload?.cities) ? payload.cities : [];
                    setWeatherCityOptions(cities
                        .map((city) => ({
                        value: String(city?.id || "").trim(),
                        label: String(city?.displayName || city?.id || "").trim(),
                    }))
                        .filter((city) => city.value && city.label));
                }
                catch {
                    // 城市列表拉取失败时保留上次选项。
                }
            };
            void refreshWeatherSettings();
            void refreshWeatherCities(weatherCityQuery);
            const timer = window.setInterval(() => {
                void refreshWeatherSettings();
            }, 15000);
            return () => {
                cancelled = true;
                window.clearInterval(timer);
            };
        }, [settingsOpen, weatherCityQuery, language]);
        SP_REACT.useEffect(() => {
            if (displayMode !== "gif" || customActionPendingRef.current) {
                return;
            }
            let cancelled = false;
            void (async () => {
                try {
                    const result = await getCustomAssets();
                    const assets = customAssetNames(result);
                    if (!cancelled) {
                        setCustomAssets(Array.isArray(assets) ? assets : []);
                        setCustomPreviews(customAssetPreviews(result));
                        setCustomDeletable(customAssetDeletable(result));
                        setCustomUploadAllowedState(customAssetUploadAllowed(result));
                        setSelectedCustomAsset(result?.current_asset ?? result?.currentAsset ?? "");
                    }
                }
                catch (error) {
                    if (!cancelled) {
                        setCustomAssetStatus(String(error));
                    }
                }
            })();
            return () => {
                cancelled = true;
            };
        }, [displayMode]);
        function normalizeActionError(error) {
            const message = error && error.message ? String(error.message) : String(error);
            if (message.includes("display_unavailable") ||
                message.includes("Device disconnected") ||
                message.includes("No device connected") ||
                message.includes("无设备连接")) {
                return t("noDeviceConnected");
            }
            return message;
        }
        function ensureActionResult(result) {
            if (result && result.ok === false) {
                throw new Error(result.error || t("noDeviceConnected"));
            }
            return result;
        }
        function showActionError(error) {
            const message = normalizeActionError(error);
            setSerialStatus(message);
            toaster.toast({ title: "JSAUX PIXEL", body: message });
        }
        async function writeToSerial(hexString) {
            console.log("[Serial TX]: " + hexString);
            setSerialStatus(`TX ${hexString}`);
            try {
                const result = ensureActionResult(await writeSerialHex(hexString));
                const rxText = result.rxHex ? ` RX ${result.rxHex}` : "";
                setSerialStatus(`${result.port ?? t("serialFallback")} ${t("serialWroteBytes")} ${result.written ?? 0} ${t("serialBytes")}.${rxText}`);
            }
            catch (error) {
                showActionError(error);
            }
        }
        async function pushDashboardMonitor() {
            setSerialStatus("Dashboard Monitor TX");
            try {
                const result = ensureActionResult(await sendDashboardMonitor());
                setSerialStatus(`${result.port ?? t("serialFallback")} ${t("serialWroteBytes")} ${result.written ?? 0} ${t("serialBytes")}.`);
            }
            catch (error) {
                showActionError(error);
            }
        }
        async function pushHardwareMonitor() {
            setSerialStatus("Hardware Monitor TX");
            try {
                const result = ensureActionResult(await sendHardwareMonitor());
                setSerialStatus(`${result.port ?? t("serialFallback")} ${t("serialWroteBytes")} ${result.written ?? 0} ${t("serialBytes")}.`);
            }
            catch (error) {
                showActionError(error);
            }
        }
        async function pushClockMonitor() {
            setSerialStatus("Clock TX");
            try {
                const result = ensureActionResult(await sendClockMonitor());
                setSerialStatus(`${result.port ?? t("serialFallback")} ${t("serialWroteBytes")} ${result.written ?? 0} ${t("serialBytes")}.`);
            }
            catch (error) {
                showActionError(error);
            }
        }
        async function pushWeatherForecast() {
            setSerialStatus("Weather TX");
            try {
                const result = ensureActionResult(await sendWeatherForecast());
                setSerialStatus(`${result.port ?? t("serialFallback")} ${t("serialWroteBytes")} ${result.written ?? 0} ${t("serialBytes")}.`);
            }
            catch (error) {
                showActionError(error);
            }
        }
        async function pushPlaytimeMonitor() {
            setSerialStatus("Playtime TX");
            try {
                const result = ensureActionResult(await sendPlaytimeMonitor());
                setSerialStatus(`${result.port ?? t("serialFallback")} ${t("serialWroteBytes")} ${result.written ?? 0} ${t("serialBytes")}.`);
            }
            catch (error) {
                showActionError(error);
            }
        }
        async function pushCountdownMonitor(minutes, seconds) {
            setSerialStatus("Countdown TX");
            try {
                const result = ensureActionResult(typeof seconds === "number" ? await sendCountdownMonitor(minutes, seconds) : await sendCountdownMonitor(minutes));
                setSerialStatus(`${result.port ?? t("serialFallback")} ${t("serialWroteBytes")} ${result.written ?? 0} ${t("serialBytes")}.`);
            }
            catch (error) {
                showActionError(error);
            }
        }
        async function pushChronographMonitor(seconds = 30) {
            setSerialStatus("Chronograph TX");
            try {
                const result = ensureActionResult(await sendChronographMonitor(seconds));
                setSerialStatus(`${result.port ?? t("serialFallback")} ${t("serialWroteBytes")} ${result.written ?? 0} ${t("serialBytes")}.`);
            }
            catch (error) {
                showActionError(error);
            }
        }
        async function activateCustomDisplay() {
            await updateDisplaySettings({
                activeModuleId: "custom",
                autoSyncEnabled: true,
                timeline: { enabled: false },
            });
        }
        async function handlePowerClick() {
            const nextEnabled = !screenOn;
            try {
                ensureActionResult(await setPower(nextEnabled));
                setScreenOn(nextEnabled);
            }
            catch (error) {
                showActionError(error);
            }
        }
        async function handleTemperatureUnitChange(nextUnit) {
            const normalized = nextUnit === "fahrenheit" ? "fahrenheit" : "celsius";
            if (normalized === temperatureUnit) {
                return;
            }
            const previous = temperatureUnit;
            setTemperatureUnit(normalized);
            try {
                ensureActionResult(await updateDisplaySettings({ temperatureUnit: normalized }));
            }
            catch (error) {
                setTemperatureUnit(previous);
                showActionError(error);
            }
        }
        async function handleTimeFormatChange(nextFormat) {
            const normalized = nextFormat === "24h" ? "24h" : "12h";
            if (normalized === timeFormat) {
                return;
            }
            const previous = timeFormat;
            setTimeFormat(normalized);
            try {
                ensureActionResult(await updateDisplaySettings({ timeFormat: normalized }));
            }
            catch (error) {
                setTimeFormat(previous);
                showActionError(error);
            }
        }
        async function patchDisplaySetting(key, value, applyLocal, revertLocal) {
            applyLocal(value);
            try {
                ensureActionResult(await updateDisplaySettings({ [key]: value }));
            }
            catch (error) {
                revertLocal();
                showActionError(error);
            }
        }
        async function handleTimeZoneChange(nextZone) {
            let normalized = String(nextZone || "");
            if (normalized === "UTC") {
                normalized = "UTC+00:00";
            }
            if (normalized === timeZoneId) {
                return;
            }
            const previous = timeZoneId;
            await patchDisplaySetting("timeZoneId", normalized, setTimeZoneId, () => setTimeZoneId(previous));
        }
        async function handleDoNotDisturbChange(enabled) {
            const next = Boolean(enabled);
            if (doNotDisturbPendingRef.current || next === doNotDisturb) return;
            const previous = doNotDisturb;
            doNotDisturbPendingRef.current = true;
            try {
                await patchDisplaySetting("doNotDisturb", next, setDoNotDisturb, () => setDoNotDisturb(previous));
            } finally { doNotDisturbPendingRef.current = false; }
        }
        async function handleAutoDaylightSavingChange(nextEnabled) {
            const normalized = Boolean(nextEnabled);
            if (normalized === autoDaylightSaving) {
                return;
            }
            const previous = autoDaylightSaving;
            await patchDisplaySetting("autoDaylightSaving", normalized, setAutoDaylightSaving, () => setAutoDaylightSaving(previous));
        }
        async function handleWeatherLocationChange(nextLocation) {
            const normalized = String(nextLocation || "Local").trim() || "Local";
            if (normalized === weatherLocation) {
                return;
            }
            const previous = weatherLocation;
            await patchDisplaySetting("weatherLocation", normalized, setWeatherLocation, () => setWeatherLocation(previous));
            try {
                const settingsResult = await getDisplaySettings();
                const settings = settingsResult?.displaySettings ?? settingsResult ?? {};
                setWeatherResolvedLocation(String(settings.weatherResolvedLocation || "").trim());
                setWeatherLocalLabel(String(settings.weatherLocalLabel || "").trim());
            }
            catch {
                // ignore refresh failure after save
            }
        }
        async function handleMeasurementSystemChange(nextSystem) {
            const normalized = ["metric", "us", "uk"].includes(nextSystem) ? nextSystem : "metric";
            if (normalized === measurementSystem) {
                return;
            }
            const previous = measurementSystem;
            await patchDisplaySetting("measurementSystem", normalized, setMeasurementSystem, () => setMeasurementSystem(previous));
        }
        function handleBrightnessChange(value) {
            const numericValue = Number(value);
            if (!Number.isFinite(numericValue)) {
                return;
            }
            const safeValue = Math.max(0, Math.min(100, Math.round(numericValue)));
            setBrightness(safeValue);
            if (brightnessTransportRef.current) {
                brightnessTransportRef.current.schedule(safeValue);
            }
            else {
                brightnessFallbackSchedulerRef.current(safeValue);
            }
        }
        function countdownSecondsFromTime(nextTime) {
            return Math.max(1, (Number(nextTime.hours) || 0) * 3600 + (Number(nextTime.minutes) || 0) * 60 + (Number(nextTime.seconds) || 0));
        }
        function applyCountdownTime(nextTime) {
            const totalSeconds = countdownSecondsFromTime(nextTime);
            const totalMinutes = Math.max(1, Math.ceil(totalSeconds / 60));
            setCountdownTime(nextTime);
            setSelectedCountdown(totalMinutes);
            void pushCountdownMonitor(totalMinutes, totalSeconds);
        }
        function startCountdown() {
            const totalSeconds = countdownSecondsFromTime(countdownTime);
            const totalMinutes = Math.max(1, Math.ceil(totalSeconds / 60));
            setSelectedCountdown(totalMinutes);
            setCountdownCommittedTime(countdownTime);
            void pushCountdownMonitor(totalMinutes, totalSeconds);
        }
        function handleCountdownFieldChange(field) {
            setActiveCountdownField(field);
        }
        function handleCountdownAdjust(field, delta) {
            const limits = { hours: 99, minutes: 59, seconds: 59 };
            const current = countdownTime[field] ?? 0;
            const nextValue = Math.max(0, Math.min(limits[field] ?? 59, current + delta));
            const nextTime = { ...countdownTime, [field]: nextValue };
            setActiveCountdownField(field);
            setCountdownTime(nextTime);
            setSelectedCountdown(Math.max(1, Math.ceil(countdownSecondsFromTime(nextTime) / 60)));
        }
        window.__JSAUX_MATRIX_START_COUNTDOWN__ = startCountdown;
        function handleChronographFieldChange(field) {
            setActiveChronographField(field);
        }
        function handleChronographAdjust(field, delta) {
            const limits = { hours: 99, minutes: 59, seconds: 59 };
            const current = chronographTime[field] ?? 0;
            const nextValue = Math.max(0, Math.min(limits[field] ?? 59, current + delta));
            const nextTime = { ...chronographTime, [field]: nextValue };
            setActiveChronographField(field);
            setChronographTime(nextTime);
        }
        function startChronograph() {
            const totalSeconds = countdownSecondsFromTime(chronographTime);
            setChronographCommittedTime(chronographTime);
            void pushChronographMonitor(totalSeconds);
        }
        window.__JSAUX_MATRIX_START_CHRONOGRAPH__ = startChronograph;
        function cancelTimePicker(pickerKind, event) {
            if (event && event.preventDefault) {
                event.preventDefault();
            }
            if (event && event.stopPropagation) {
                event.stopPropagation();
            }
            if (event && event.stopImmediatePropagation) {
                event.stopImmediatePropagation();
            }
            if (pickerKind === "countdown") {
                setCountdownTime(countdownCommittedTime);
                setSelectedCountdown(Math.max(1, Math.ceil(countdownSecondsFromTime(countdownCommittedTime) / 60)));
                setActiveTimePicker(null);
                return;
            }
            if (pickerKind === "chronograph") {
                setChronographTime(chronographCommittedTime);
                setActiveTimePicker(null);
            }
        }
        window.__JSAUX_MATRIX_CANCEL_TIME_PICKER__ = cancelTimePicker;
        async function loadAiAgentStatus(force) {
            const requestId = ++aiAgentRequestRef.current;
            setAiAgentLoading(true);
            try {
                const status = await getAiAgentStatus(Boolean(force));
                if (status && status.ok === false) {
                    throw new Error(status.error || t("aiAgentLoadFailed"));
                }
                if (aiAgentRequestRef.current === requestId) {
                    setAiAgentStatus(status);
                    setAiAgentError("");
                }
            } catch (error) {
                if (aiAgentRequestRef.current === requestId) {
                    setAiAgentStatus(null);
                    setAiAgentError(String(error?.message ?? error));
                }
            } finally {
                if (aiAgentRequestRef.current === requestId) {
                    setAiAgentLoading(false);
                }
            }
        }
        // 插件模式不再加载/轮询 AI Agent 面板状态：屏幕数据由 main.py 的后台轮询负责。
        async function handleAiAgentLogin() {
            try {
                const result = await aiAgentLoginStart();
                if (result && result.ok === false) {
                    throw new Error(result.error || t("aiAgentLoadFailed"));
                }
                void pollAiAgentLogin();
            } catch (error) {
                setAiAgentError(String(error?.message ?? error));
            }
        }
        async function pollAiAgentLogin() {
            if (aiAgentLoginPollRef.current) {
                return;
            }
            aiAgentLoginPollRef.current = true;
            try {
                for (let attempt = 0; attempt < 600; attempt++) {
                    const status = await aiAgentLoginStatusRpc();
                    if (!status || status.ok === false) {
                        break;
                    }
                    setAiAgentLogin(status);
                    if (status.changed) {
                        setAiAgentLogin(null);
                        void loadAiAgentStatus(true);
                        break;
                    }
                    if (status.finished) {
                        break;
                    }
                    await new Promise((resolve) => window.setTimeout(resolve, 2000));
                }
            } catch (error) {
                setAiAgentLogin(null);
            } finally {
                aiAgentLoginPollRef.current = false;
            }
        }
        async function handleAiAgentLogout() {
            try {
                const result = await aiAgentLogoutRpc();
                if (result && result.ok === false) {
                    throw new Error(result.error || t("aiAgentLoadFailed"));
                }
                setAiAgentLogin(null);
                void loadAiAgentStatus(true);
            } catch (error) {
                setAiAgentError(String(error?.message ?? error));
            }
        }

        function handleModeChange(nextMode) {
            if (nextMode !== "gif") {
                setCustomActionTarget("");
            }
            setDisplayMode(nextMode);
            setModeMenuOpen(false);
            if (nextMode === "countdown" || nextMode === "chronograph") {
                setActiveTimePicker(nextMode);
            } else {
                setActiveTimePicker(null);
            }
            if (nextMode === "dashboard") {
                void pushDashboardMonitor();
                return;
            }
            if (nextMode === "hardware") {
                void pushHardwareMonitor();
                return;
            }
            if (nextMode === "clock") {
                void pushClockMonitor();
                return;
            }
            if (nextMode === "timeline") {
                void pushWeatherForecast();
                return;
            }
            if (nextMode === "playtime") {
                void pushPlaytimeMonitor();
                return;
            }
            if (nextMode === "countdown") {
                return;
            }
            if (nextMode === "chronograph") {
                return;
            }
            if (nextMode === "gif") {
                return;
            }
            if (nextMode === "ai_agent") {
                void sendAiAgentMonitor().then(ensureActionResult).catch(showActionError);
                return;
            }
            const nextOption = modeOptions.find((option) => option.value === nextMode);
            if (nextOption) {
                void writeToSerial(buildFrame(0x01, 0x21, [nextOption.modeHex]));
            }
        }
        function handleCountdownSelect(preset) {
            setSelectedCountdown(preset.minutes);
            setCountdownTime({ hours: 0, minutes: preset.minutes, seconds: 0 });
            void pushCountdownMonitor(preset.minutes);
        }
        async function handleCustomUploadClick() {
            if (customActionPendingRef.current) {
                return;
            }
            setCustomActionTarget("");
            if (typeof openFilePicker !== "function") {
                fileInputRef.current?.click?.();
                return;
            }
            customActionPendingRef.current = true;
            setCustomActionPending(true);
            let focusAsset = "";
            try {
                const picked = await openFilePicker(0, "/home/deck/Pictures", true, false, undefined, ["jpg", "jpeg", "png", "bmp", "gif", "svg"], false, false, 1);
                const sourcePath = picked?.realpath || picked?.path || "";
                if (!sourcePath) {
                    return;
                }
                const candidate = sourcePath.split(/[\\/]/).pop() ?? "";
                if (!customUploadAllowedState && !customAssets.includes(candidate)) throw new Error(t("customReplacementOnly"));
                const uploadResult = ensureActionResult(await uploadCustomAssetFromPath(sourcePath));
                await activateCustomDisplay();
                const refreshed = await getCustomAssets();
                const custom = refreshed?.assets ? refreshed : uploadResult?.custom ?? uploadResult;
                const uploadedAssets = customAssetNames(custom);
                const fileName = sourcePath.split(/[\\/]/).pop() ?? "";
                const currentAsset = custom?.current_asset ?? custom?.currentAsset ?? fileName;
                setCustomAssets(uploadedAssets);
                setCustomPreviews(customAssetPreviews(custom));
                setCustomDeletable(customAssetDeletable(custom));
                setCustomUploadAllowedState(customAssetUploadAllowed(custom));
                setSelectedCustomAsset(currentAsset);
                setCustomActionTarget("");
                setCustomAssetStatus(t("customAssetReady"));
                focusAsset = uploadedAssets.includes(currentAsset) ? currentAsset : uploadedAssets[0] ?? "";
            }
            catch (error) {
                const message = String(error).includes("custom_asset_too_large")
                    ? t("customFileTooLarge") : String(error);
                setCustomAssetStatus(message);
                toaster.toast({ title: "JSAUX PIXEL", body: message });
                try {
                    const recovered = await getCustomAssets();
                    const recoveredAssets = customAssetNames(recovered);
                    const uploadAllowed = customAssetUploadAllowed(recovered);
                    setCustomAssets(recoveredAssets);
                    setCustomPreviews(customAssetPreviews(recovered));
                    setCustomDeletable(customAssetDeletable(recovered));
                    setCustomUploadAllowedState(uploadAllowed);
                    setSelectedCustomAsset(recovered?.current_asset ?? recovered?.currentAsset ?? "");
                    focusAsset = uploadAllowed ? "" : recoveredAssets[0] ?? "";
                }
                catch {
                    // Preserve the original upload failure and restore the Upload action.
                }
            }
            finally {
                customActionPendingRef.current = false;
                setCustomActionPending(false);
                focusCustomActionAfterDelete(focusAsset);
            }
        }
        function focusCustomActionAfterDelete(asset) {
            const callback = typeof window.__JSAUX_MATRIX_FOCUS_CUSTOM_AFTER_DELETE__ === "function"
                ? window.__JSAUX_MATRIX_FOCUS_CUSTOM_AFTER_DELETE__
                : typeof window.opener?.__JSAUX_MATRIX_FOCUS_CUSTOM_AFTER_DELETE__ === "function"
                    ? window.opener.__JSAUX_MATRIX_FOCUS_CUSTOM_AFTER_DELETE__
                    : null;
            if (callback) {
                callback(asset);
            }
        }
        function focusCustomSelectAfterLock(asset) {
            const callback = typeof window.__JSAUX_MATRIX_FOCUS_CUSTOM_SELECT__ === "function"
                ? window.__JSAUX_MATRIX_FOCUS_CUSTOM_SELECT__
                : typeof window.opener?.__JSAUX_MATRIX_FOCUS_CUSTOM_SELECT__ === "function"
                    ? window.opener.__JSAUX_MATRIX_FOCUS_CUSTOM_SELECT__
                    : null;
            if (callback) {
                callback(asset);
            }
        }
        function focusCustomDeleteAfterFailure(asset) {
            const callback = typeof window.__JSAUX_MATRIX_FOCUS_CUSTOM_DELETE__ === "function"
                ? window.__JSAUX_MATRIX_FOCUS_CUSTOM_DELETE__
                : typeof window.opener?.__JSAUX_MATRIX_FOCUS_CUSTOM_DELETE__ === "function"
                    ? window.opener.__JSAUX_MATRIX_FOCUS_CUSTOM_DELETE__
                    : null;
            if (callback) {
                callback(asset);
            }
        }
        function handleCustomAssetLock(asset) {
            if (customActionPendingRef.current) {
                return;
            }
            setCustomActionTarget(asset);
            focusCustomSelectAfterLock(asset);
        }
        window.__JSAUX_MATRIX_CANCEL_CUSTOM_ACTION__ = () => {
            if (customActionPendingRef.current) {
                return;
            }
            setCustomActionTarget("");
        };
        async function handleCustomAssetSelect(asset) {
            if (!asset || asset !== customActionTarget || customActionPendingRef.current) {
                return;
            }
            customActionPendingRef.current = true;
            setCustomActionPending(true);
            let selectSucceeded = false;
            setCustomAssetStatus(asset);
            try {
                await selectCustomAsset(asset);
                setSelectedCustomAsset(asset);
                setCustomActionTarget("");
                setCustomAssetStatus(t("customAssetReady"));
                selectSucceeded = true;
            }
            catch (error) {
                const message = String(error);
                setCustomAssetStatus(message);
                toaster.toast({ title: "JSAUX PIXEL", body: message });
            }
            customActionPendingRef.current = false;
            setCustomActionPending(false);
            if (selectSucceeded) {
                focusCustomActionAfterDelete(asset);
            }
            else {
                focusCustomSelectAfterLock(asset);
            }
        }
        async function handleCustomAssetDelete(asset) {
            if (!asset || asset !== customActionTarget || !customDeletable.includes(asset) || customActionPendingRef.current) {
                return;
            }
            const deletedIndex = customAssets.slice(0, 6).indexOf(asset);
            customActionPendingRef.current = true;
            setCustomActionPending(true);
            let deleteSucceeded = false;
            try {
                ensureActionResult(await deleteCustomAsset(asset));
                deleteSucceeded = true;
                const refreshed = await getCustomAssets();
                const refreshedAssets = customAssetNames(refreshed);
                const refreshedDeletable = customAssetDeletable(refreshed);
                const visibleRefreshedAssets = refreshedAssets.slice(0, 6);
                const fallbackIndex = visibleRefreshedAssets.length > 0
                    ? Math.min(Math.max(deletedIndex, 0), visibleRefreshedAssets.length - 1)
                    : -1;
                const fallbackAsset = fallbackIndex >= 0 ? visibleRefreshedAssets[fallbackIndex] : "";
                setCustomAssets(refreshedAssets);
                setCustomPreviews(customAssetPreviews(refreshed));
                setCustomDeletable(refreshedDeletable);
                setCustomUploadAllowedState(customAssetUploadAllowed(refreshed));
                setSelectedCustomAsset(refreshed?.current_asset ?? refreshed?.currentAsset ?? "");
                customActionPendingRef.current = false;
                setCustomActionPending(false);
                setCustomActionTarget("");
                setCustomAssetStatus(t("customAssetDeleted"));
                focusCustomActionAfterDelete(fallbackAsset);
            }
            catch (error) {
                const message = String(error);
                customActionPendingRef.current = false;
                setCustomActionPending(false);
                setCustomAssetStatus(message);
                toaster.toast({ title: "JSAUX PIXEL", body: message });
                if (deleteSucceeded) {
                    const localAssets = customAssets.filter((name) => name !== asset);
                    const visibleLocalAssets = localAssets.slice(0, 6);
                    const fallbackIndex = visibleLocalAssets.length > 0
                        ? Math.min(Math.max(deletedIndex, 0), visibleLocalAssets.length - 1)
                        : -1;
                    const fallbackAsset = fallbackIndex >= 0 ? visibleLocalAssets[fallbackIndex] : "";
                    setCustomAssets(localAssets);
                    setCustomUploadAllowedState(localAssets.length < 6);
                    setCustomPreviews((previews) => {
                        const nextPreviews = { ...previews };
                        delete nextPreviews[asset];
                        return nextPreviews;
                    });
                    setCustomDeletable((assets) => assets.filter((name) => name !== asset));
                    setSelectedCustomAsset((current) => current === asset ? "" : current);
                    setCustomActionTarget("");
                    focusCustomActionAfterDelete(fallbackAsset);
                }
                else {
                    focusCustomDeleteAfterFailure(asset);
                }
            }
        }
        function handleCustomFileChange(event) {
            const input = event.currentTarget;
            const file = input.files?.[0];
            if (!file || customActionPendingRef.current) {
                input.value = "";
                return;
            }
            if (!customUploadAllowedState && !customAssets.includes(file.name)) {
                toaster.toast({ title: "JSAUX PIXEL", body: t("customReplacementOnly") });
                input.value = ""; return;
            }
            if (file.size > MAX_CUSTOM_ASSET_SOURCE_BYTES) {
                const message = t("customFileTooLarge");
                setCustomAssetStatus(message);
                toaster.toast({ title: "JSAUX PIXEL", body: message });
                input.value = "";
                return;
            }
            customActionPendingRef.current = true;
            setCustomActionPending(true);
            let finished = false;
            const finishUpload = (asset) => {
                if (finished) {
                    return;
                }
                finished = true;
                customActionPendingRef.current = false;
                setCustomActionPending(false);
                input.value = "";
                focusCustomActionAfterDelete(asset);
            };
            try {
                const reader = new FileReader();
                reader.onload = async () => {
                    let uploadedAsset = "";
                    let uploadSucceeded = false;
                    let uploadedPreviews = {};
                    let selectSucceeded = false;
                    let uploadName = file.name;
                    try {
                        let contentBase64 = "";
                        const looksLikeGif = String(file.type || "").toLowerCase().includes("gif")
                            || /\.gif$/i.test(String(file.name || ""));
                        // 静态图上传前直接压到点阵物理分辨率 64×54；GIF 交给 daemon 逐帧归一化。
                        if (!looksLikeGif
                            && typeof createImageBitmap === "function"
                            && typeof document !== "undefined"
                            && typeof document.createElement === "function") {
                            try {
                                const bitmap = await createImageBitmap(file);
                                try {
                                    const canvas = document.createElement("canvas");
                                    canvas.width = 64;
                                    canvas.height = 54;
                                    const ctx = canvas.getContext("2d");
                                    if (ctx) {
                                        ctx.imageSmoothingEnabled = false;
                                        ctx.drawImage(bitmap, 0, 0, 64, 54);
                                        const blob = await new Promise((resolve, reject) => {
                                            canvas.toBlob((value) => {
                                                if (value) {
                                                    resolve(value);
                                                }
                                                else {
                                                    reject(new Error("custom_asset_compression_failed"));
                                                }
                                            }, "image/png");
                                        });
                                        const bytes = new Uint8Array(await blob.arrayBuffer());
                                        let binary = "";
                                        for (let offset = 0; offset < bytes.length; offset += 0x8000) {
                                            binary += String.fromCharCode.apply(null, bytes.subarray(offset, offset + 0x8000));
                                        }
                                        contentBase64 = btoa(binary);
                                        uploadName = `${String(file.name || "custom").replace(/\.[^.]+$/, "") || "custom"}.png`;
                                    }
                                }
                                finally {
                                    if (typeof bitmap.close === "function") {
                                        bitmap.close();
                                    }
                                }
                            }
                            catch {
                                contentBase64 = "";
                            }
                        }
                        if (!contentBase64) {
                            const dataUrl = String(reader.result ?? "");
                            contentBase64 = dataUrl.includes(",") ? dataUrl.split(",").pop() : dataUrl;
                            uploadName = file.name;
                        }
                        const uploadResult = ensureActionResult(await uploadCustomAsset(uploadName, contentBase64));
                        uploadedPreviews = customAssetPreviews(uploadResult?.custom ?? uploadResult);
                        uploadSucceeded = true;
                        setCustomPreviews((items) => ({ ...items, ...uploadedPreviews }));
                        ensureActionResult(await selectCustomAsset(uploadName));
                        selectSucceeded = true;
                        await activateCustomDisplay();
                        const refreshed = await getCustomAssets();
                        const refreshedAssets = customAssetNames(refreshed);
                        const currentAsset = refreshed?.current_asset ?? refreshed?.currentAsset ?? uploadName;
                        setCustomAssets(refreshedAssets);
                        setCustomPreviews(customAssetPreviews(refreshed));
                        setCustomDeletable(customAssetDeletable(refreshed));
                        setCustomUploadAllowedState(customAssetUploadAllowed(refreshed));
                        setCustomActionTarget("");
                        setSelectedCustomAsset(currentAsset);
                        setCustomAssetStatus(t("customAssetReady"));
                        uploadedAsset = refreshedAssets.includes(uploadName)
                            ? uploadName
                            : refreshedAssets.includes(currentAsset) ? currentAsset : refreshedAssets[0] ?? "";
                    }
                    catch (error) {
                        const message = String(error).includes("custom_asset_too_large")
                            ? t("customFileTooLarge") : String(error);
                        setCustomAssetStatus(message);
                        toaster.toast({ title: "JSAUX PIXEL", body: message });
                        try {
                            const recovered = await getCustomAssets();
                            const recoveredAssets = customAssetNames(recovered);
                            const recoveredCurrentAsset = recovered?.current_asset ?? recovered?.currentAsset ?? "";
                            const uploadAllowed = customAssetUploadAllowed(recovered);
                            setCustomAssets(recoveredAssets);
                            setCustomPreviews(customAssetPreviews(recovered));
                            setCustomDeletable(customAssetDeletable(recovered));
                            setCustomUploadAllowedState(uploadAllowed);
                            setSelectedCustomAsset(recoveredCurrentAsset);
                            setCustomActionTarget("");
                            uploadedAsset = recoveredAssets.includes(uploadName)
                                ? uploadName
                                : uploadAllowed ? "" : recoveredAssets.includes(recoveredCurrentAsset) ? recoveredCurrentAsset : recoveredAssets[0] ?? "";
                        }
                        catch {
                            if (uploadSucceeded) {
                                const localAssets = [...customAssets.filter((asset) => asset !== uploadName), uploadName];
                                setCustomAssets(localAssets);
                                setCustomUploadAllowedState(localAssets.length < 6);
                                setCustomPreviews((items) => ({ ...items, ...uploadedPreviews }));
                                setCustomDeletable((assets) => assets.includes(uploadName) ? assets : [...assets, uploadName]);
                                if (selectSucceeded) {
                                    setSelectedCustomAsset(uploadName);
                                }
                                setCustomActionTarget("");
                                uploadedAsset = uploadName;
                            }
                        }
                    }
                    finally {
                        finishUpload(uploadedAsset);
                    }
                };
                reader.onerror = () => {
                    const message = reader.error?.message || t("fileReadFailed");
                    setCustomAssetStatus(message);
                    toaster.toast({ title: "JSAUX PIXEL", body: message });
                    finishUpload("");
                };
                reader.readAsDataURL(file);
            }
            catch (error) {
                const message = String(error).includes("custom_asset_too_large")
                            ? t("customFileTooLarge") : String(error);
                setCustomAssetStatus(message);
                toaster.toast({ title: "JSAUX PIXEL", body: message });
                finishUpload("");
            }
        }
        function handleGifUpload() {
            void writeToSerial("44 59 01 04 00 08 00 00 04 A4 6C EA A0 64 2C F6");
        }
        function handleFirmwareAction() {
            toaster.toast({ title: "JSAUX PIXEL", body: t("firmwareUpdateUnsupported") });
        }
        const titleText = t("matrixTitle");
        const screenPowerLabel = t("screenPower");
        const brightnessLabel = t("screenBrightness");
        const latestText = "";
        const settingsControlStyle = {
            ...transitionStyle,
            appearance: "none",
            background: colors.inactive,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            color: colors.text,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            minHeight: 34,
            outline: "none",
            padding: "8px 12px",
            textAlign: "left",
            width: "100%",
        };
        const weatherLocationOptions = (() => {
            const options = [
                {
                    value: "Local",
                    label: weatherLocalLabel
                        || ((weatherResolvedLocation && weatherResolvedLocation !== "Local")
                            ? `${t("settingsLocalWeather")} · ${weatherResolvedLocation}`
                            : t("settingsLocalWeather")),
                },
                ...weatherCityOptions.filter((option) => option.value !== "Local"),
            ];
            if (weatherLocation && weatherLocation !== "Local"
                && !options.some((option) => option.value === weatherLocation)) {
                options.splice(1, 0, { value: weatherLocation, label: weatherLocation });
            }
            return options;
        })();
        const closeSettingsPicker = () => {
            setSettingsPicker(null);
            setWeatherCityQuery("");
        };
        const applySettingsPickerValue = (nextValue) => {
            const fieldKey = settingsPicker?.fieldKey;
            closeSettingsPicker();
            if (fieldKey === "timezone") {
                void handleTimeZoneChange(nextValue);
            }
            else if (fieldKey === "weatherLocation") {
                void handleWeatherLocationChange(nextValue);
            }
            else if (fieldKey === "timeFormat") {
                void handleTimeFormatChange(nextValue);
            }
            else if (fieldKey === "dst") {
                void handleAutoDaylightSavingChange(nextValue === "on");
            }
            else if (fieldKey === "temp") {
                void handleTemperatureUnitChange(nextValue);
            }
            else if (fieldKey === "measure") {
                void handleMeasurementSystemChange(nextValue);
            }
        };
        const openSettingsPicker = (fieldKey, title, value, options) => {
            setWeatherCityQuery("");
            setSettingsPicker({ fieldKey, title, value, options });
        };
        // 游戏模式：不用原生 select（按 A 会弹系统下拉），改为按钮；长列表进插件内选项页。
        const settingsCycleControl = (value, options, onChange, fieldKey, pickerTitle) => {
            const current = options.find((option) => option.value === value) || options[0];
            const valuesKey = options.map((option) => String(option.value)).join("\u0001");
            const usePicker = Boolean(pickerTitle);
            return SP_JSX.jsx("button", {
                type: "button",
                "data-settings-field": fieldKey,
                ...(fieldKey === "dnd" ? { role: "switch", "aria-checked": value === "on" } : {}),
                "data-settings-cycle": "true",
                "data-settings-values": valuesKey,
                ...(usePicker ? { "data-settings-picker-open": fieldKey } : {}),
                "data-display-pref": "true",
                onClick: (event) => {
                    const target = event.currentTarget;
                    const deltaAttr = target.getAttribute("data-settings-adjust-delta");
                    if (deltaAttr != null) {
                        const delta = Number(deltaAttr) || 1;
                        target.removeAttribute("data-settings-adjust-delta");
                        if (!options.length) {
                            return;
                        }
                        const index = Math.max(0, options.findIndex((option) => option.value === value));
                        const next = options[(index + delta % options.length + options.length) % options.length];
                        if (next && next.value !== value) {
                            onChange(next.value);
                        }
                        return;
                    }
                    if (usePicker) {
                        openSettingsPicker(fieldKey, pickerTitle, value, options);
                        return;
                    }
                    if (!options.length) {
                        return;
                    }
                    const index = Math.max(0, options.findIndex((option) => option.value === value));
                    const next = options[(index + 1) % options.length];
                    if (next) {
                        onChange(next.value);
                    }
                },
                style: settingsControlStyle,
                children: current?.label ?? String(value ?? ""),
            });
        };
        const settingsRow = (label, children) => SP_JSX.jsxs("section", {
            style: {
                borderBottom: `1px solid ${colors.border}`,
                display: "grid",
                gap: 8,
                minHeight: 58,
                padding: "12px 24px",
            },
            children: [
                SP_JSX.jsx("span", { style: { color: colors.text, fontSize: 13, fontWeight: 500 }, children: label }),
                SP_JSX.jsx("div", { style: { display: "grid", minWidth: 0 }, children }),
            ],
        });
        const settingsPickerOptions = settingsPicker
            ? (settingsPicker.fieldKey === "weatherLocation" ? weatherLocationOptions : settingsPicker.options)
            : [];
        const settingsPickerPanel = settingsPicker ? SP_JSX.jsxs("main", {
            "data-jsaux-settings-picker": "true",
            "data-settings-picker-field": settingsPicker.fieldKey,
            style: { display: "grid", gap: 0, minWidth: 0, paddingTop: 8 },
            children: [
                SP_JSX.jsxs("section", {
                    style: { ...rowStyle, minHeight: 48, padding: "0 24px 8px" },
                    children: [
                        SP_JSX.jsx("button", {
                            type: "button",
                            "data-settings-picker-back": "true",
                            onClick: closeSettingsPicker,
                            style: {
                                ...transitionStyle,
                                appearance: "none",
                                background: colors.inactive,
                                border: 0,
                                borderRadius: 999,
                                color: colors.text,
                                cursor: "pointer",
                                fontSize: 13,
                                fontWeight: 600,
                                minHeight: 28,
                                outline: "none",
                                padding: "6px 14px",
                            },
                            children: t("settingsBack"),
                        }),
                        SP_JSX.jsx("span", {
                            style: { color: colors.text, fontSize: 16, fontWeight: 700 },
                            children: settingsPicker.title,
                        }),
                    ],
                }),
                settingsPicker.fieldKey === "weatherLocation" ? SP_JSX.jsx("section", {
                    style: { borderBottom: `1px solid ${colors.border}`, padding: "8px 24px 12px" },
                    children: SP_JSX.jsx("input", {
                        type: "search",
                        "data-settings-picker-search": "true",
                        value: weatherCityQuery,
                        placeholder: t("settingsWeatherSearch"),
                        onChange: (event) => setWeatherCityQuery(String(event.target.value || "")),
                        style: {
                            ...transitionStyle,
                            background: colors.inactive,
                            border: `1px solid ${colors.border}`,
                            borderRadius: 8,
                            color: colors.text,
                            fontSize: 13,
                            fontWeight: 600,
                            minHeight: 34,
                            outline: "none",
                            padding: "8px 12px",
                            width: "100%",
                            boxSizing: "border-box",
                        },
                    }),
                }) : null,
                SP_JSX.jsx("section", {
                    style: { display: "grid", gap: 0, maxHeight: "60vh", overflowY: "auto" },
                    children: settingsPickerOptions.map((option) => SP_JSX.jsx("button", {
                        type: "button",
                        "data-settings-option": option.value,
                        "data-settings-option-selected": option.value === settingsPicker.value ? "true" : "false",
                        onClick: () => applySettingsPickerValue(option.value),
                        style: {
                            ...transitionStyle,
                            appearance: "none",
                            background: option.value === settingsPicker.value ? colors.focus : "transparent",
                            border: 0,
                            borderBottom: `1px solid ${colors.border}`,
                            color: colors.text,
                            cursor: "pointer",
                            fontSize: 13,
                            fontWeight: 600,
                            minHeight: 44,
                            outline: "none",
                            padding: "12px 24px",
                            textAlign: "left",
                            width: "100%",
                        },
                        children: option.label,
                    }, `${settingsPicker.fieldKey}:${option.value}`)),
                }),
            ],
        }) : null;
        const settingsPanel = SP_JSX.jsxs("main", {
            "data-jsaux-settings-panel": "true",
            style: { display: "grid", gap: 0, minWidth: 0, paddingTop: 8 },
            children: [
                SP_JSX.jsxs("section", {
                    style: { ...rowStyle, minHeight: 48, padding: "0 24px 8px" },
                    children: [
                        SP_JSX.jsx("button", {
                            type: "button",
                            "data-settings-back": "true",
                            onClick: () => {
                                closeSettingsPicker();
                                setSettingsOpen(false);
                            },
                            style: {
                                ...transitionStyle,
                                appearance: "none",
                                background: colors.inactive,
                                border: 0,
                                borderRadius: 999,
                                color: colors.text,
                                cursor: "pointer",
                                fontSize: 13,
                                fontWeight: 600,
                                minHeight: 28,
                                outline: "none",
                                padding: "6px 14px",
                            },
                            children: t("settingsBack"),
                        }),
                        SP_JSX.jsx("span", {
                            style: { color: colors.text, fontSize: 16, fontWeight: 700 },
                            children: t("settingsTitle"),
                        }),
                    ],
                }),
                settingsRow(t("settingsTimeZone"), settingsCycleControl(timeZoneId === "UTC" ? "UTC+00:00" : timeZoneId, timeZoneOptions, (next) => void handleTimeZoneChange(next), "timezone", t("settingsTimeZone"))),
                settingsRow(t("timeFormat"), settingsCycleControl(timeFormat, timeFormatOptions, (next) => void handleTimeFormatChange(next), "timeFormat", t("timeFormat"))),
                settingsRow(t("settingsAutoDaylightSaving"), settingsCycleControl(autoDaylightSaving ? "on" : "off", daylightSavingOptions, (next) => void handleAutoDaylightSavingChange(next === "on"), "dst", t("settingsAutoDaylightSaving"))),
                settingsRow(t("settingsDoNotDisturb"), settingsCycleControl(doNotDisturb ? "on" : "off", daylightSavingOptions, (next) => void handleDoNotDisturbChange(next === "on"), "dnd")),
                settingsRow(t("settingsWeatherLocation"), SP_JSX.jsxs("div", {
                    style: { display: "grid", gap: 8, minWidth: 0 },
                    children: [
                        settingsCycleControl(weatherLocation, weatherLocationOptions, (next) => void handleWeatherLocationChange(next), "weatherLocation", t("settingsWeatherLocation")),
                        SP_JSX.jsx("span", {
                            style: { color: colors.dim, fontSize: 11, lineHeight: 1.2 },
                            children: t("settingsWeatherHint"),
                        }),
                    ],
                })),
                settingsRow(t("temperatureUnit"), settingsCycleControl(temperatureUnit, temperatureUnitOptions, (next) => void handleTemperatureUnitChange(next), "temp", t("temperatureUnit"))),
                settingsRow(t("settingsMeasurementSystem"), settingsCycleControl(measurementSystem, measurementSystemOptions, (next) => void handleMeasurementSystemChange(next), "measure", t("settingsMeasurementSystem"))),
                SP_JSX.jsxs("section", {
                    style: { ...rowStyle, minHeight: 58, padding: "12px 24px" },
                    children: [
                        SP_JSX.jsxs("div", {
                            style: { display: "grid", gap: 5, minWidth: 0 },
                            children: [
                                SP_JSX.jsx("span", { style: { color: colors.text, fontSize: 13, fontWeight: 500 }, children: t("settingsOnlineUpdate") }),
                                SP_JSX.jsxs("span", {
                                    style: { color: colors.dim, fontSize: 11, lineHeight: 1.1 },
                                    children: [t("settingsVersion"), " ", displayVersion, " · ", firmwareVersion, " ", latestText],
                                }),
                            ],
                        }),
                        SP_JSX.jsx("button", {
                            type: "button",
                            "data-firmware-action": "true",
                            onClick: handleFirmwareAction,
                            style: {
                                ...transitionStyle,
                                appearance: "none",
                                background: colors.inactive,
                                border: 0,
                                borderRadius: 999,
                                color: colors.muted,
                                cursor: "pointer",
                                flex: "0 0 auto",
                                fontSize: 13,
                                fontWeight: 500,
                                minHeight: 28,
                                minWidth: 74,
                                outline: "none",
                                padding: "6px 16px",
                            },
                            children: firmwareActionText,
                        }),
                    ],
                }),
            ],
        });
        const customPanel = displayMode === "gif"
            ? SP_JSX.jsx(CustomAssetPanel, {
                assets: customAssets,
                previews: customPreviews,
                selectedAsset: selectedCustomAsset,
                deletableAssets: customDeletable,
                uploadAllowed: customUploadAllowedState,
                actionTarget: customActionTarget,
                actionBusy: customActionPending,
                status: customAssetStatus,
                fileInputRef,
                onUploadClick: handleCustomUploadClick,
                onFileChange: handleCustomFileChange,
                onAssetLock: handleCustomAssetLock,
                onAssetSelect: handleCustomAssetSelect,
                onDelete: handleCustomAssetDelete,
                t,
            })
            : null;
        const mainPanel = SP_JSX.jsxs("main", { style: { display: "grid", gap: 8, minWidth: 0, paddingTop: 8 }, children: [SP_JSX.jsxs("section", { "data-screen-control-section": "power", style: {
                                ...rowStyle,
                                background: colors.panel,
                                borderBottom: `1px solid ${colors.border}`,
                                minHeight: 58,
                                padding: "0 24px",
                            }, children: [SP_JSX.jsx("span", { style: { fontSize: 13, fontWeight: 500, minWidth: 0 }, children: screenPowerLabel }), SP_JSX.jsxs("button", { type: "button", "data-screen-power-action": "true", onClick: handlePowerClick, style: {
                                        ...transitionStyle,
                                        appearance: "none",
                                        alignItems: "center",
                                        background: screenOn ? colors.focus : colors.inactive,
                                        border: 0,
                                        borderRadius: 999,
                                        boxSizing: "border-box",
                                        color: colors.text,
                                        cursor: "pointer",
                                        display: "flex",
                                        flex: "0 0 auto",
                                        fontSize: 10,
                                        fontWeight: 700,
                                        gap: 3,
                                        height: 24,
                                        justifyContent: screenOn ? "flex-end" : "flex-start",
                                        minWidth: 52,
                                        outline: "none",
                                        padding: "2px 3px",
                            }, children: [screenOn ? SP_JSX.jsx("span", { style: { paddingLeft: 6 }, children: t("powerOnShort") }) : null, SP_JSX.jsx("span", { style: { width: 20, height: 20, borderRadius: 999, background: colors.text, display: "block", flex: "0 0 auto" } }), screenOn ? null : SP_JSX.jsx("span", { style: { color: colors.panel, paddingRight: 6 }, children: t("powerOffShort") })] })] }), SP_JSX.jsxs("section", { "data-screen-control-section": "brightness", style: {
                                background: colors.panel,
                                borderBottom: `1px solid ${colors.border}`,
                                display: "grid",
                                gap: 8,
                                minHeight: 58,
                                padding: "10px 24px 9px",
                            }, children: [SP_JSX.jsxs("div", { style: rowStyle, children: [SP_JSX.jsx("label", { style: { fontSize: 13, fontWeight: 500 }, children: brightnessLabel }), SP_JSX.jsxs("span", { style: { color: colors.text, fontSize: 13, fontWeight: 500 }, children: [brightness, "%"] })] }), SP_JSX.jsx("input", { className: "jsaux-matrix-range", min: 0, max: 100, step: 1, type: "range", value: brightness, onChange: (event) => handleBrightnessChange(Number(event.currentTarget.value)), style: {
                                            background: `linear-gradient(to right, ${colors.focus} 0%, ${colors.focus} ${brightnessFill}%, ${colors.inactive} ${brightnessFill}%, ${colors.inactive} 100%)`,
                                        } })] }), SP_JSX.jsxs("section", { style: {
                                borderBottom: `1px solid ${colors.border}`,
                                padding: "18px 24px",
                            }, children: [SP_JSX.jsx("div", { role: "listbox", "aria-label": t("displayMode"), style: {
                                    display: "grid",
                                    gap: 10,
                                    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                                    minWidth: 0,
                                }, children: modeOptions.map((option) => (SP_JSX.jsx(MatrixModeTile, { option: option, active: option.value === displayMode, onClick: () => handleModeChange(option.value), t: t }, option.value))) }), displayMode === "countdown" && activeTimePicker === "countdown" ? SP_JSX.jsx(TimerControlGroup, { pickerKind: "countdown", children: SP_JSX.jsxs(SP_REACT.Fragment, { children: [SP_JSX.jsx(CountdownTimePicker, { time: countdownTime, activeField: activeCountdownField, onFieldChange: handleCountdownFieldChange, onAdjust: handleCountdownAdjust, t: t, pickerKind: "countdown" }), SP_JSX.jsx(HoverButton, { "data-time-picker-start": "countdown", onClick: startCountdown, style: { marginTop: 10, width: "100%" }, children: t("startCountdown") })] }) }) : null, displayMode === "chronograph" && activeTimePicker === "chronograph" ? SP_JSX.jsx(TimerControlGroup, { pickerKind: "chronograph", children: SP_JSX.jsxs(SP_REACT.Fragment, { children: [SP_JSX.jsx(CountdownTimePicker, { time: chronographTime, activeField: activeChronographField, onFieldChange: handleChronographFieldChange, onAdjust: handleChronographAdjust, t: t, pickerKind: "chronograph" }), SP_JSX.jsx(HoverButton, { "data-time-picker-start": "chronograph", onClick: startChronograph, style: { marginTop: 10, width: "100%" }, children: t("startTimer") })] }) }) : null, displayMode === "ai_agent" ? SP_JSX.jsx(AiAgentPanel, { status: aiAgentStatus, error: aiAgentError, loading: aiAgentLoading, onRefresh: () => void loadAiAgentStatus(true), login: aiAgentLogin, authenticated: Boolean(aiAgentStatus?.authenticated), onLogin: () => void handleAiAgentLogin(), onLogout: () => void handleAiAgentLogout(), t: t }) : null] }), customPanel, SP_JSX.jsxs("section", { style: {
                                ...rowStyle,
                                minHeight: 58,
                                padding: "0 24px",
                            }, children: [SP_JSX.jsx("span", { style: { color: colors.text, fontSize: 13, fontWeight: 500 }, children: t("settingsTitle") }), SP_JSX.jsx("button", { type: "button", "data-settings-open": "true", onClick: () => setSettingsOpen(true), style: {
                                        ...transitionStyle,
                                        appearance: "none",
                                        background: colors.inactive,
                                        border: 0,
                                        borderRadius: 999,
                                        color: colors.text,
                                        cursor: "pointer",
                                        flex: "0 0 auto",
                                        fontSize: 13,
                                        fontWeight: 600,
                                        minHeight: 28,
                                        minWidth: 74,
                                        outline: "none",
                                        padding: "6px 16px",
                                    }, children: t("settingsOpen") })] })] });
        return (SP_JSX.jsxs("div", { "data-jsaux-matrix-panel": "true", style: panelStyle, children: [SP_JSX.jsx("style", { children: `
          @keyframes jsaux-pulse {
            0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(123, 0, 255, 0.45); }
            50% { opacity: 0.6; box-shadow: 0 0 0 4px rgba(123, 0, 255, 0); }
          }

          .jsaux-matrix-range {
            appearance: none;
            -webkit-appearance: none;
            width: 100%;
            height: 5px;
            border-radius: 999px;
            outline: none;
            cursor: pointer;
            transition: all 150ms ease;
          }

          [data-screen-control-section]:focus-within {
            background: #1B2430 !important;
          }

          .jsaux-matrix-range::-webkit-slider-thumb {
            appearance: none;
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border-radius: 999px;
            border: 0;
            background: #ffffff;
            box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
          }

          .jsaux-matrix-range::-moz-range-thumb {
            width: 18px;
            height: 18px;
            border-radius: 999px;
            border: 0;
            background: #ffffff;
            box-shadow: 0 1px 8px rgba(0, 0, 0, 0.5);
          }
        ` }), SP_JSX.jsxs("header", { style: headerStyle, children: [SP_JSX.jsxs("div", { style: { ...rowStyle, justifyContent: "flex-start", flex: "1 1 auto", minWidth: 0 }, children: [SP_JSX.jsx(MatrixLogo, { size: 5 }), SP_JSX.jsx("h1", { style: {
                                    color: colors.text,
                                    fontSize: 24,
                                    fontWeight: 700,
                                    lineHeight: 1,
                                    margin: 0,
                                    minWidth: 0,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }, children: titleText })] }), SP_JSX.jsx("span", { style: {
                                border: `1px solid ${colors.border}`,
                                borderRadius: 999,
                                color: colors.dim,
                                flex: "0 0 auto",
                                fontFamily: "inherit",
                                fontSize: 13,
                                lineHeight: 1,
                                padding: "5px 13px",
                                }, children: displayVersion })] }), settingsOpen ? (settingsPicker ? settingsPickerPanel : settingsPanel) : mainPanel] }));
    }
    function MatrixTitleView() {
        var titleRef = SP_REACT.useRef(null);
        SP_REACT.useLayoutEffect(function () {
            var title = titleRef.current;
            var backButton = title && title.previousElementSibling;
            if (!backButton || typeof backButton.click !== "function") {
                return undefined;
            }
            var previousDisplay = backButton.style.display;
            backButton.style.display = "none";
            return function () {
                backButton.style.display = previousDisplay;
            };
        }, []);
        return SP_JSX.jsx("div", { ref: titleRef, "data-jsaux-matrix-title": "true", children: "JSAUX PIXEL" });
    }
    var index = definePlugin(() => ({
        name: "JSAUX PIXEL",
        titleView: SP_JSX.jsx(MatrixTitleView, {}),
        content: SP_JSX.jsx(Content, {}),
        icon: SP_JSX.jsx(FaTh, {}),
    }));
(function () {
    window.__JSAUX_MATRIX_GAMEPAD_NAV_WRAPPED__ = true;

    var originalIndex = index;
    var selectedClass = "jsaux-matrix-nav-selected";
    var repeatDelayMs = 350;
    var repeatIntervalMs = 120;
    var deadzoneEnter = 0.62;
    var deadzoneExit = 0.38;
    var activateCooldownMs = 300;

    function MatrixGamepadNavWrapper(props) {
        var rootRef = SP_REACT.useRef(null);
        var selectedItemRef = SP_REACT.useRef(null);
        var selectedNavigationKeyRef = SP_REACT.useRef(null);
        var selectedIndexRef = SP_REACT.useRef(0);
        var repeatAtRef = SP_REACT.useRef({});
        var heldActionRef = SP_REACT.useRef({});
        var pressedARef = SP_REACT.useRef(false);
        var pressedBRef = SP_REACT.useRef(false);
        var pressedKeysRef = SP_REACT.useRef({});
        var pressedSteamButtonsRef = SP_REACT.useRef({});
        var consumedVgpButtonsRef = SP_REACT.useRef({});
        var lastActivateAtRef = SP_REACT.useRef(0);
        var panelWasVisibleRef = SP_REACT.useRef(false);
        var customPanelEnteredRef = SP_REACT.useRef(false);
        var customActionTargetRef = SP_REACT.useRef("");
        var customActionActivatePendingRef = SP_REACT.useRef(false);
        var activationArmedRef = SP_REACT.useRef(false);
        var activationReadyAtRef = SP_REACT.useRef(0);

        SP_REACT.useLayoutEffect(function () {
            var root = rootRef.current;
            var hostContent = root && root.parentElement;
            if (!hostContent || hostContent.style.height !== "100%") {
                return undefined;
            }
            var previousHostHeight = hostContent.style.height;
            hostContent.style.height = "auto";
            return function () {
                hostContent.style.height = previousHostHeight;
            };
        }, []);

        SP_REACT.useEffect(function () {
            var root = rootRef.current;
            if (!root) {
                return undefined;
            }
            var ownerWindow = root.ownerDocument && root.ownerDocument.defaultView ? root.ownerDocument.defaultView : window;
            var sharedWindow = ownerWindow.opener || window;
            var stop = false;
            var frame = 0;
            var unregisterable = null;
            var hasSteamInputBridge = false;
            var steamButtonActions = { 0: "activate", 4: "up", 5: "right", 6: "down", 7: "left", 20: "up", 21: "down", 22: "left", 23: "right" };
            var steamDirectionButtons = ["4", "5", "6", "7", "20", "21", "22", "23"];

            function isVisible(element) {
                var rect = element.getBoundingClientRect();
                var view = element.ownerDocument && element.ownerDocument.defaultView ? element.ownerDocument.defaultView : ownerWindow;
                var style = view.getComputedStyle(element);
                return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
            }

            function getCustomPanel() {
                return ownerWindow.document.querySelector('[data-jsaux-custom-panel="true"]');
            }

            function isPanelVisible() {
                return Array.from(root.querySelectorAll("button,input[type='range']")).some(function (item) {
                    return isVisible(item);
                });
            }

            function syncPanelVisibility() {
                var visible = isPanelVisible();
                if (visible && !panelWasVisibleRef.current) {
                    pressedARef.current = true;
                    activationArmedRef.current = false;
                    activationReadyAtRef.current = ownerWindow.performance.now() + 500;
                } else if (!visible) {
                    activationArmedRef.current = false;
                    customPanelEnteredRef.current = false;
                    customActionTargetRef.current = "";
                    customActionActivatePendingRef.current = false;
                }
                panelWasVisibleRef.current = visible;
                return visible;
            }

            function clearActivationCooldown() {
                lastActivateAtRef.current = ownerWindow.performance.now() - activateCooldownMs;
            }

            function armActivationAfterNavigation() {
                pressedARef.current = false;
                activationArmedRef.current = true;
                activationReadyAtRef.current = 0;
                clearActivationCooldown();
            }

            function isEnabled(element) {
                return !element.disabled && isVisible(element);
            }

            function getTimerCallback(name) {
                if (typeof ownerWindow[name] === "function") {
                    return ownerWindow[name];
                }
                return typeof sharedWindow[name] === "function" ? sharedWindow[name] : null;
            }

            function findHostBackButton() {
                var title = ownerWindow.document.querySelector('[data-jsaux-matrix-title="true"]');
                var button = title && title.previousElementSibling;
                return button && typeof button.click === "function" ? button : null;
            }

            function triggerHostBack() {
                customPanelEnteredRef.current = false;
                customActionTargetRef.current = "";
                customActionActivatePendingRef.current = false;
                var backButton = findHostBackButton();
                if (backButton) {
                    backButton.click();
                }
            }

            function getCountdownPickerControls(item) {
                var column = item && item.parentElement;
                if (!column) {
                    return null;
                }
                var buttons = Array.from(column.children).filter(function (child) {
                    return child.tagName === "BUTTON";
                });
                if (buttons.length !== 3 || buttons[0].textContent.trim() !== "+" || buttons[2].textContent.trim() !== "-") {
                    return null;
                }
                return { increase: buttons[0], value: buttons[1], decrease: buttons[2] };
            }

            function isCountdownPickerAdjustButton(item) {
                var controls = getCountdownPickerControls(item);
                return Boolean(controls && controls.value !== item);
            }

            function getSettingsPicker() {
                return root.querySelector('[data-jsaux-settings-picker="true"]');
            }

            function isSettingsPickerVisible() {
                var panel = getSettingsPicker();
                return Boolean(panel && isVisible(panel));
            }

            function getItems() {
                if (isSettingsPickerVisible()) {
                    return Array.from(root.querySelectorAll(
                        "[data-settings-picker-back],input[data-settings-picker-search],button[data-settings-option]"
                    )).filter(function (item) {
                        return isEnabled(item) && isVisible(item);
                    });
                }
                // 设置项已改为 button，避免原生 select 在游戏模式按 A 弹出系统下拉。
                return Array.from(root.querySelectorAll(
                    "button,input[type='range']"
                )).filter(function (item) {
                    return isEnabled(item)
                        && !isCountdownPickerAdjustButton(item)
                        && item.getAttribute("data-settings-readonly") !== "true";
                });
            }

            function getSettingsPanel() {
                return root.querySelector('[data-jsaux-settings-panel="true"]');
            }

            function isSettingsPanelVisible() {
                var panel = getSettingsPanel();
                return Boolean(panel && isVisible(panel));
            }

            function focusBySelector(selector) {
                var target = root.querySelector(selector);
                var items = getItems();
                if (!target || !items.includes(target)) {
                    return false;
                }
                select(items.indexOf(target));
                return true;
            }

            function moveDirectionalInList(action, firstUpSelector, firstDownSelector) {
                var goingUp = action === "up" || action === "left";
                var goingDown = action === "down" || action === "right";
                if (!goingUp && !goingDown) {
                    return false;
                }
                var items = getItems();
                if (!items.length) {
                    return false;
                }
                var currentIndex = selectedItemRef.current ? items.indexOf(selectedItemRef.current) : -1;
                // 首次方向键：跳到约定入口；之后同一方向逐项移动。
                if (currentIndex < 0) {
                    return focusBySelector(goingUp ? firstUpSelector : firstDownSelector);
                }
                var nextIndex = goingUp ? currentIndex - 1 : currentIndex + 1;
                if (nextIndex < 0 || nextIndex >= items.length) {
                    return true;
                }
                select(nextIndex);
                armActivationAfterNavigation();
                return true;
            }

            function focusSettingsDirection(action) {
                // 上下在设置项间移动；左右留给当前项循环取值（不再打开原生下拉）。
                if (action === "left" || action === "right") {
                    return false;
                }
                // 设置页：上首次→度量制，继续往上到返回；下首次→时区，继续往下到「已是最新版本」。
                return moveDirectionalInList(
                    action,
                    'button[data-settings-field="measure"]',
                    'button[data-settings-field="timezone"]'
                );
            }

            function focusSettingsPickerDirection(action) {
                return moveDirectionalInList(
                    action,
                    "[data-settings-picker-back]",
                    "button[data-settings-option],input[data-settings-picker-search]"
                );
            }

            // 进入 AI Agent 前记住左右列，便于按上回到 正计时 / 个性自定义。
            var lastAiAgentColumnRef = { current: "chronograph" };

            function focusModeTile(modeValue) {
                if (modeValue === "chronograph" || modeValue === "gif") {
                    lastAiAgentColumnRef.current = modeValue;
                }
                if (focusBySelector('[data-mode-value="' + modeValue + '"]')) {
                    armActivationAfterNavigation();
                    return true;
                }
                return false;
            }

            function focusMainDirection(action) {
                // 仅无焦点时：上/左→设置，下/右→开关；已有焦点后走模块网格图。
                var items = getItems();
                var currentIndex = selectedItemRef.current ? items.indexOf(selectedItemRef.current) : -1;
                if (currentIndex >= 0) {
                    return false;
                }
                var goingUp = action === "up" || action === "left";
                return focusBySelector(goingUp ? "[data-settings-open]" : "[data-screen-power-action]");
            }

            function moveMainModuleGraph(action) {
                var item = selectedItemRef.current;
                if (!item || !isEnabled(item)) {
                    return false;
                }

                if (item.hasAttribute("data-screen-power-action")) {
                    if (action === "down") {
                        return focusBySelector("input[type='range']") && (armActivationAfterNavigation(), true);
                    }
                    return action === "up" || action === "left" || action === "right";
                }

                if (item.matches("input[type='range']")) {
                    // 亮度：下→仪表盘，右→硬件性能，上→开关；左仍微调亮度（见 handle）。
                    if (action === "up") {
                        return focusBySelector("[data-screen-power-action]") && (armActivationAfterNavigation(), true);
                    }
                    if (action === "down") {
                        return focusModeTile("dashboard");
                    }
                    if (action === "right") {
                        return focusModeTile("hardware");
                    }
                    return false;
                }

                if (item.hasAttribute("data-settings-open")) {
                    if (action === "up") {
                        return focusModeTile("ai_agent");
                    }
                    return action === "down" || action === "left" || action === "right";
                }

                var mode = item.getAttribute("data-mode-value");
                if (!mode) {
                    return false;
                }

                // 2 列模块网格（与 UI grid 一致）：
                // 仪表盘|硬件性能 / 天气|时钟 / 游戏时长|倒计时 / 正计时|个性自定义 / AI Agent / 设置
                var graph = {
                    dashboard: { up: "brightness", down: "timeline", left: "hardware", right: "hardware" },
                    hardware: { up: "brightness", down: "clock", left: "dashboard", right: "dashboard" },
                    timeline: { up: "dashboard", down: "playtime", left: "clock", right: "clock" },
                    clock: { up: "hardware", down: "countdown", left: "timeline", right: "timeline" },
                    playtime: { up: "timeline", down: "chronograph", left: "countdown", right: "countdown" },
                    countdown: { up: "clock", down: "gif", left: "playtime", right: "playtime" },
                    chronograph: { up: "playtime", down: "ai_agent", left: "gif", right: "gif" },
                    gif: { up: "countdown", down: "ai_agent", left: "chronograph", right: "chronograph" },
                    ai_agent: { up: "ai_column", down: "settings", left: null, right: null },
                };
                var edges = graph[mode];
                if (!edges) {
                    return false;
                }
                var target = edges[action];
                if (!target) {
                    return true;
                }
                if (target === "brightness") {
                    return focusBySelector("input[type='range']") && (armActivationAfterNavigation(), true);
                }
                if (target === "settings") {
                    return focusBySelector("[data-settings-open]") && (armActivationAfterNavigation(), true);
                }
                if (target === "ai_column") {
                    return focusModeTile(lastAiAgentColumnRef.current === "gif" ? "gif" : "chronograph");
                }
                if (mode === "chronograph" && action === "down") {
                    lastAiAgentColumnRef.current = "chronograph";
                }
                if (mode === "gif" && action === "down") {
                    lastAiAgentColumnRef.current = "gif";
                }
                return focusModeTile(target);
            }

            function getNavigationKey(item) {
                if (!item || !item.getAttribute) {
                    return null;
                }
                if (item.hasAttribute("data-custom-select")) {
                    return "custom-select";
                }
                if (item.hasAttribute("data-custom-delete")) {
                    return "custom-delete";
                }
                if (item.hasAttribute("data-custom-upload")) {
                    return "custom-upload";
                }
                if (item.hasAttribute("data-firmware-action")) {
                    return "firmware-action";
                }
                if (item.hasAttribute("data-settings-open")) {
                    return "settings-open";
                }
                if (item.hasAttribute("data-settings-back")) {
                    return "settings-back";
                }
                if (item.hasAttribute("data-settings-picker-back")) {
                    return "settings-picker-back";
                }
                var settingsOption = item.getAttribute("data-settings-option");
                if (settingsOption != null) {
                    return "settings-option:" + settingsOption;
                }
                if (item.hasAttribute("data-settings-picker-search")) {
                    return "settings-picker-search";
                }
                var settingsField = item.getAttribute("data-settings-field");
                if (settingsField) {
                    return "settings-field:" + settingsField;
                }
                var customAsset = item.getAttribute("data-custom-asset");
                if (customAsset) {
                    return "custom:" + customAsset;
                }
                var picker = item.closest && item.closest("[data-time-picker]");
                var pickerKind = picker && picker.getAttribute("data-time-picker");
                var field = item.getAttribute("data-time-picker-field");
                if (pickerKind && field) {
                    return "field:" + pickerKind + ":" + field;
                }
                var startKind = item.getAttribute("data-time-picker-start");
                if (startKind) {
                    return "start:" + startKind;
                }
                var modeKind = item.getAttribute("data-mode-value");
                return modeKind ? "mode:" + modeKind : null;
            }

            function findItemByNavigationKey(key) {
                if (!key) {
                    return null;
                }
                var parts = key.split(":");
                var customPanel = getCustomPanel();
                if (key === "custom-select") {
                    return customPanel && customPanel.querySelector("[data-custom-select]");
                }
                if (key === "custom-delete") {
                    return customPanel && customPanel.querySelector("[data-custom-delete]");
                }
                if (key === "custom-upload") {
                    return customPanel && customPanel.querySelector("[data-custom-upload]");
                }
                if (key === "firmware-action") {
                    return root.querySelector("[data-firmware-action]");
                }
                if (key === "settings-open") {
                    return root.querySelector("[data-settings-open]");
                }
                if (key === "settings-back") {
                    return root.querySelector("[data-settings-back]");
                }
                if (key === "settings-picker-back") {
                    return root.querySelector("[data-settings-picker-back]");
                }
                if (key === "settings-picker-search") {
                    return root.querySelector("[data-settings-picker-search]");
                }
                if (key.indexOf("settings-option:") === 0) {
                    var optionValue = key.slice("settings-option:".length);
                    return root.querySelector('[data-settings-option="' + optionValue + '"]');
                }
                if (key.indexOf("settings-field:") === 0) {
                    var fieldName = key.slice("settings-field:".length);
                    return root.querySelector('[data-settings-field="' + fieldName + '"]');
                }
                if (key.indexOf("custom:") === 0) {
                    var customName = key.slice("custom:".length);
                    return customPanel && Array.from(customPanel.querySelectorAll("[data-custom-asset]")).find(function (item) {
                        return item.getAttribute("data-custom-asset") === customName;
                    });
                }
                if (parts[0] === "field") {
                    return root.querySelector('[data-time-picker="' + parts[1] + '"] [data-time-picker-field="' + parts[2] + '"]');
                }
                if (parts[0] === "start") {
                    return root.querySelector('[data-time-picker-start="' + parts[1] + '"]');
                }
                if (parts[0] === "mode") {
                    return root.querySelector('[data-mode-value="' + parts[1] + '"]');
                }
                return null;
            }

            function restoreSelectedAfterRender() {
                ownerWindow.requestAnimationFrame(function () {
                    var target = findItemByNavigationKey(selectedNavigationKeyRef.current);
                    var items = getItems();
                    if (target && items.includes(target)) {
                        select(items.indexOf(target));
                    }
                });
            }

            function focusCustomActionAfterRender(assetName) {
                var navigationKey = assetName ? "custom:" + assetName : "custom-upload";
                customActionTargetRef.current = "";
                customActionActivatePendingRef.current = false;
                selectedNavigationKeyRef.current = navigationKey;
                var attempts = 0;
                function focusRequestedAction() {
                    var target = findItemByNavigationKey(navigationKey);
                    var items = getItems();
                    if (target && items.includes(target)) {
                        select(items.indexOf(target));
                        return;
                    }
                    attempts += 1;
                    if (attempts < 4) {
                        ownerWindow.requestAnimationFrame(focusRequestedAction);
                    }
                }
                ownerWindow.requestAnimationFrame(focusRequestedAction);
            }

            function focusCustomSelectAfterRender(assetName) {
                customActionTargetRef.current = assetName;
                selectedNavigationKeyRef.current = "custom-select";
                var attempts = 0;
                function focusRequestedSelect() {
                    if (customActionTargetRef.current !== assetName || selectedNavigationKeyRef.current !== "custom-select") {
                        return;
                    }
                    var target = findItemByNavigationKey("custom-select");
                    var items = getItems();
                    if (target && target.getAttribute("data-custom-action-target") === assetName && items.includes(target)) {
                        select(items.indexOf(target));
                        if (customActionActivatePendingRef.current) {
                            customActionActivatePendingRef.current = false;
                            target.click();
                        }
                        return;
                    }
                    attempts += 1;
                    if (attempts < 30) {
                        ownerWindow.requestAnimationFrame(focusRequestedSelect);
                    }
                }
                ownerWindow.requestAnimationFrame(focusRequestedSelect);
            }

            function focusCustomDeleteAfterRender(assetName) {
                customActionTargetRef.current = assetName;
                selectedNavigationKeyRef.current = "custom-delete";
                var attempts = 0;
                function focusRequestedDelete() {
                    if (customActionTargetRef.current !== assetName || selectedNavigationKeyRef.current !== "custom-delete") {
                        return;
                    }
                    var target = findItemByNavigationKey("custom-delete");
                    var items = getItems();
                    if (target && target.getAttribute("data-custom-action-target") === assetName && items.includes(target)) {
                        select(items.indexOf(target));
                        if (customActionActivatePendingRef.current) {
                            customActionActivatePendingRef.current = false;
                            target.click();
                        }
                        return;
                    }
                    attempts += 1;
                    if (attempts < 30) {
                        ownerWindow.requestAnimationFrame(focusRequestedDelete);
                    }
                }
                ownerWindow.requestAnimationFrame(focusRequestedDelete);
            }

            function isTimerControlVisible() {
                return Boolean(root.querySelector("[data-timer-control-group]"));
            }

            function scrollPanelToTop() {
                var panelTop = root.querySelector('[data-jsaux-matrix-panel="true"]');
                if (!panelTop) {
                    return false;
                }
                var scrollParent = panelTop.parentElement;
                while (scrollParent) {
                    var computedStyle = typeof ownerWindow.getComputedStyle === "function"
                        ? ownerWindow.getComputedStyle(scrollParent)
                        : scrollParent.style;
                    var overflowY = computedStyle && computedStyle.overflowY ? computedStyle.overflowY : "";
                    if (/(auto|scroll|overlay)/.test(overflowY) && scrollParent.scrollHeight > scrollParent.clientHeight) {
                        scrollParent.scrollTop = 0;
                        return true;
                    }
                    scrollParent = scrollParent.parentElement;
                }
                panelTop.scrollIntoView({ block: "start", inline: "nearest" });
                return true;
            }

            function select(index) {
                var items = getItems();
                if (!items.length) {
                    selectedItemRef.current = null;
                    return null;
                }
                if (selectedItemRef.current) {
                    selectedItemRef.current.classList.remove(selectedClass);
                }
                selectedIndexRef.current = ((index % items.length) + items.length) % items.length;
                selectedItemRef.current = items[selectedIndexRef.current];
                selectedNavigationKeyRef.current = getNavigationKey(selectedItemRef.current);
                var customPanel = getCustomPanel();
                customPanelEnteredRef.current = Boolean(customPanel && customPanel.contains(selectedItemRef.current));
                selectedItemRef.current.classList.add(selectedClass);
                selectedItemRef.current.focus({ preventScroll: true });
                if (selectedItemRef.current.hasAttribute("data-screen-power-action")) {
                    scrollPanelToTop();
                } else {
                    selectedItemRef.current.scrollIntoView({ block: "nearest" });
                }
                return selectedItemRef.current;
            }

            function isCustomActionButton(item) {
                return Boolean(item && (item.hasAttribute("data-custom-select") || item.hasAttribute("data-custom-delete")));
            }

            function isCustomOperationBusy(item) {
                if (item && item.getAttribute?.("data-custom-action-busy") === "true") {
                    return true;
                }
                var customPanel = getCustomPanel();
                return Boolean(customPanel && customPanel.querySelector("[data-custom-action-busy='true']"));
            }

            function moveCustomAction(item, action) {
                var assetName = customActionTargetRef.current || (isCustomActionButton(item) ? item.getAttribute("data-custom-action-target") : "");
                if (!assetName) {
                    return false;
                }
                var navigationKey = action === "left" ? "custom-select" : "custom-delete";
                selectedNavigationKeyRef.current = navigationKey;
                var customPanel = getCustomPanel();
                var target = customPanel && customPanel.querySelector(action === "left" ? "[data-custom-select]" : "[data-custom-delete]");
                if (target && target.getAttribute("data-custom-action-target") === assetName && !target.disabled) {
                    var items = getItems();
                    var targetIndex = items.indexOf(target);
                    if (targetIndex >= 0) {
                        select(targetIndex);
                        return true;
                    }
                }
                if (navigationKey === "custom-delete") {
                    focusCustomDeleteAfterRender(assetName);
                } else {
                    focusCustomSelectAfterRender(assetName);
                }
                return true;
            }

            function activateCustomAction(item) {
                var assetName = customActionTargetRef.current || (isCustomActionButton(item) ? item.getAttribute("data-custom-action-target") : "");
                if (!assetName) {
                    return false;
                }
                var navigationKey = selectedNavigationKeyRef.current === "custom-delete" || (item && item.hasAttribute("data-custom-delete"))
                    ? "custom-delete"
                    : "custom-select";
                selectedNavigationKeyRef.current = navigationKey;
                var target = findItemByNavigationKey(navigationKey);
                var items = getItems();
                if (target && target.getAttribute("data-custom-action-target") === assetName && items.includes(target)) {
                    customActionActivatePendingRef.current = false;
                    select(items.indexOf(target));
                    target.click();
                    return true;
                }
                customActionActivatePendingRef.current = true;
                if (navigationKey === "custom-delete") {
                    focusCustomDeleteAfterRender(assetName);
                } else {
                    focusCustomSelectAfterRender(assetName);
                }
                return true;
            }

            function moveSpatial(action) {
                var items = getItems();
                var item = ensureSelected();
                if (!item) {
                    return;
                }
                // 屏幕控制保持固定纵向顺序：电源 → 亮度 → 温度/时间 → 模式。
                if (item.hasAttribute("data-screen-power-action") && action === "down") {
                    var brightness = root.querySelector("input[type='range']");
                    if (brightness && items.includes(brightness)) {
                        select(items.indexOf(brightness));
                        return;
                    }
                }
                if (item.matches("input[type='range']")) {
                    if (action === "up") {
                        var power = root.querySelector("[data-screen-power-action]");
                        if (power && items.includes(power)) {
                            select(items.indexOf(power));
                            return;
                        }
                    }
                    if (action === "down") {
                        var firstPref = root.querySelector("[data-display-pref]");
                        if (firstPref && items.includes(firstPref)) {
                            select(items.indexOf(firstPref));
                            return;
                        }
                    }
                }
                if (item.hasAttribute("data-display-pref")) {
                    if (action === "up") {
                        var brightnessUp = root.querySelector("input[type='range']");
                        if (brightnessUp && items.includes(brightnessUp)) {
                            select(items.indexOf(brightnessUp));
                            return;
                        }
                    }
                    if (action === "left" || action === "right") {
                        var group = item.getAttribute("data-display-pref");
                        var siblings = items.filter(function (candidate) {
                            return candidate.getAttribute("data-display-pref") === group;
                        });
                        var siblingIndex = siblings.indexOf(item);
                        if (siblingIndex >= 0) {
                            var nextIndex = action === "left" ? siblingIndex - 1 : siblingIndex + 1;
                            if (nextIndex >= 0 && nextIndex < siblings.length) {
                                select(items.indexOf(siblings[nextIndex]));
                                return;
                            }
                        }
                    }
                    if (action === "down") {
                        var modeTile = root.querySelector("[data-mode-value]");
                        if (modeTile && items.includes(modeTile)) {
                            select(items.indexOf(modeTile));
                            return;
                        }
                    }
                }
                var currentRect = item.getBoundingClientRect();
                var currentX = currentRect.left + currentRect.width / 2;
                var currentY = currentRect.top + currentRect.height / 2;
                var best = null;
                var bestScore = Infinity;
                items.forEach(function (candidate) {
                    if (candidate === item) {
                        return;
                    }
                    var rect = candidate.getBoundingClientRect();
                    var x = rect.left + rect.width / 2;
                    var y = rect.top + rect.height / 2;
                    var dx = x - currentX;
                    var dy = y - currentY;
                    var primaryDistance = action === "left" || action === "right" ? Math.abs(dx) : Math.abs(dy);
                    var crossDistance = action === "left" || action === "right" ? Math.abs(dy) : Math.abs(dx);
                    var forward = action === "left" ? dx < -4 : action === "right" ? dx > 4 : action === "up" ? dy < -4 : dy > 4;
                    if (!forward) {
                        return;
                    }
                    var score = primaryDistance + crossDistance * 2.5;
                    if (score < bestScore) {
                        best = candidate;
                        bestScore = score;
                    }
                });
                if (best) {
                    select(items.indexOf(best));
                }
            }

            function ensureSelected() {
                if (isCustomOperationBusy(selectedItemRef.current)) {
                    return selectedItemRef.current;
                }
                var items = getItems();
                if (!items.length) {
                    return null;
                }
                var currentIndex = selectedItemRef.current ? items.indexOf(selectedItemRef.current) : -1;
                if (currentIndex >= 0) {
                    selectedIndexRef.current = currentIndex;
                    return selectedItemRef.current;
                }
                return select(Math.min(selectedIndexRef.current, items.length - 1));
            }

            function setRangeValue(input, value) {
                var setter = Object.getOwnPropertyDescriptor(ownerWindow.HTMLInputElement.prototype, "value");
                if (setter && setter.set) {
                    setter.set.call(input, String(value));
                } else {
                    input.value = String(value);
                }
                input.dispatchEvent(new ownerWindow.Event("input", { bubbles: true }));
                input.dispatchEvent(new ownerWindow.Event("change", { bubbles: true }));
            }

            function adjustRange(input, direction) {
                var min = Number(input.min || 0);
                var max = Number(input.max || 100);
                var step = Number(input.step || 1);
                var delta = Number.isFinite(step) && step > 0 ? step : 1;
                var next = Math.min(max, Math.max(min, Number(input.value || min) + (direction === "right" ? delta : -delta)));
                setRangeValue(input, next);
            }

            function adjustCountdownPicker(item, action) {
                var controls = getCountdownPickerControls(item);
                if (!controls || controls.value !== item) {
                    return false;
                }
                var control = action === "up" ? controls.increase : controls.decrease;
                control.click();
                restoreSelectedAfterRender();
                return true;
            }

            function moveCountdownField(item, action) {
                var controls = getCountdownPickerControls(item);
                if (!controls || controls.value !== item) {
                    return false;
                }
                var column = item.parentElement;
                var picker = column && column.parentElement;
                if (!picker) {
                    return false;
                }
                var valueButtons = Array.from(picker.children).map(function (child) {
                    var buttons = Array.from(child.children).filter(function (entry) {
                        return entry.tagName === "BUTTON";
                    });
                    return buttons.length === 3 && buttons[0].textContent.trim() === "+" && buttons[2].textContent.trim() === "-" ? buttons[1] : null;
                }).filter(Boolean);
                var current = valueButtons.indexOf(item);
                if (current < 0) {
                    return false;
                }
                var target = valueButtons[current + (action === "right" ? 1 : -1)];
                if (!target) {
                    if (action === "right") {
                        var pickerKind = picker.getAttribute("data-time-picker");
                        var startButton = root.querySelector('[data-time-picker-start="' + pickerKind + '"]');
                        if (startButton) {
                            var items = getItems();
                            select(items.indexOf(startButton));
                        }
                    }
                    return true;
                }
                var items = getItems();
                select(items.indexOf(target));
                return true;
            }

            function moveFromTimePickerStart(item, action) {
                var pickerKind = item && item.getAttribute ? item.getAttribute("data-time-picker-start") : "";
                if (!pickerKind || action !== "left") {
                    return false;
                }
                var picker = root.querySelector('[data-time-picker="' + pickerKind + '"]');
                var valueButtons = picker ? Array.from(picker.querySelectorAll("button")).filter(function (button) {
                    var controls = getCountdownPickerControls(button);
                    return controls && controls.value === button;
                }) : [];
                var target = valueButtons[valueButtons.length - 1];
                if (target) {
                    var items = getItems();
                    select(items.indexOf(target));
                }
                return true;
            }

            function confirmTimePicker(item) {
                var controls = getCountdownPickerControls(item);
                if (!controls || controls.value !== item) {
                    return false;
                }
                var picker = item.closest("[data-time-picker]");
                var pickerKind = picker && picker.getAttribute("data-time-picker");
                var startChronograph = getTimerCallback("__JSAUX_MATRIX_START_CHRONOGRAPH__");
                if (pickerKind === "chronograph" && startChronograph) {
                    startChronograph();
                    return true;
                }
                var startCountdown = getTimerCallback("__JSAUX_MATRIX_START_COUNTDOWN__");
                if (pickerKind === "countdown" && startCountdown) {
                    startCountdown();
                    return true;
                }
                return false;
            }

            function cancelTimePicker(item) {
                var picker = item && item.closest ? item.closest("[data-time-picker]") : null;
                return cancelVisibleTimePicker(picker);
            }

            function cancelVisibleTimePicker(picker) {
                var pickerKind = picker && picker.getAttribute("data-time-picker");
                var cancelTimer = getTimerCallback("__JSAUX_MATRIX_CANCEL_TIME_PICKER__");
                if (!pickerKind || !cancelTimer) {
                    return false;
                }
                customPanelEnteredRef.current = false;
                selectedNavigationKeyRef.current = "mode:" + pickerKind;
                cancelTimer(pickerKind);
                ownerWindow.requestAnimationFrame(function () {
                    var modeTile = root.querySelector('[data-mode-value="' + pickerKind + '"]');
                    if (modeTile) {
                        var items = getItems();
                        select(items.indexOf(modeTile));
                    }
                });
                return true;
            }

            ownerWindow.__JSAUX_MATRIX_CANCEL_VISIBLE_TIME_PICKER__ = function (pickerKind, event) {
                var picker = root.querySelector('[data-time-picker="' + pickerKind + '"]');
                if (!picker || !cancelVisibleTimePicker(picker)) {
                    return false;
                }
                if (event && event.preventDefault) {
                    event.preventDefault();
                }
                if (event && event.stopPropagation) {
                    event.stopPropagation();
                }
                if (event && event.stopImmediatePropagation) {
                    event.stopImmediatePropagation();
                }
                return true;
            };

            function enterTimePicker(item) {
                var pickerKind = item && item.getAttribute ? item.getAttribute("data-mode-value") : "";
                if (pickerKind !== "countdown" && pickerKind !== "chronograph") {
                    return false;
                }
                customPanelEnteredRef.current = false;
                item.click();
                ownerWindow.setTimeout(function () {
                    var picker = root.querySelector('[data-time-picker="' + pickerKind + '"]');
                    var valueButton = picker && picker.querySelector('[data-time-picker-active="true"][data-time-picker-field]');
                    if (!valueButton && picker) {
                        valueButton = picker.querySelector("[data-time-picker-field]");
                    }
                    if (valueButton) {
                        var items = getItems();
                        select(items.indexOf(valueButton));
                    }
                }, 0);
                return true;
            }

            function enterCustomPanel(item) {
                var mode = item && item.getAttribute ? item.getAttribute("data-mode-value") : "";
                if (mode !== "gif") {
                    return false;
                }
                customPanelEnteredRef.current = true;
                customActionTargetRef.current = "";
                customActionActivatePendingRef.current = false;
                item.click();
                var attempts = 0;
                function focusFirstCustomAction() {
                    var customPanel = getCustomPanel();
                    var target = customPanel && (customPanel.querySelector("[data-custom-asset]") || customPanel.querySelector("[data-custom-upload]"));
                    if (target) {
                        var items = getItems();
                        select(items.indexOf(target));
                        return;
                    }
                    attempts += 1;
                    if (attempts < 4) {
                        ownerWindow.requestAnimationFrame(focusFirstCustomAction);
                    }
                }
                ownerWindow.requestAnimationFrame(focusFirstCustomAction);
                return true;
            }

            function returnFromCustomPanel(item) {
                var customPanel = getCustomPanel();
                var activeElement = ownerWindow.document.activeElement;
                var focusInsidePanel = customPanel && ((item && customPanel.contains(item)) || (activeElement && customPanel.contains(activeElement)));
                if (!customPanelEnteredRef.current && !focusInsidePanel) {
                    return false;
                }
                customPanelEnteredRef.current = false;
                customActionTargetRef.current = "";
                customActionActivatePendingRef.current = false;
                var modeTile = root.querySelector('[data-mode-value="gif"]');
                if (!modeTile) {
                    selectedNavigationKeyRef.current = "mode:gif";
                    restoreSelectedAfterRender();
                    return true;
                }
                var items = getItems();
                var modeIndex = items.indexOf(modeTile);
                if (modeIndex < 0) {
                    selectedNavigationKeyRef.current = "mode:gif";
                    restoreSelectedAfterRender();
                    return true;
                }
                select(modeIndex);
                return true;
            }

            function onRootClick(event) {
                var target = event.target && event.target.closest ? event.target : null;
                if (!target) {
                    customPanelEnteredRef.current = false;
                    return;
                }
                var modeTile = target.closest("[data-mode-value]");
                var customPanel = getCustomPanel();
                var clickedControl = target.closest(
                    "button,input[type='range'],input[data-settings-picker-search]"
                );
                var pickerControls = getCountdownPickerControls(clickedControl);
                if (pickerControls && pickerControls.value !== clickedControl) {
                    clickedControl = pickerControls.value;
                }
                if (clickedControl) {
                    var items = getItems();
                    var clickedIndex = items.indexOf(clickedControl);
                    if (clickedIndex >= 0) {
                        select(clickedIndex);
                    }
                }
                customPanelEnteredRef.current = Boolean((modeTile && modeTile.getAttribute("data-mode-value") === "gif") || (customPanel && customPanel.contains(target)));
                if (modeTile || (clickedControl && clickedControl.hasAttribute("data-custom-upload")) || !customPanelEnteredRef.current) {
                    customActionTargetRef.current = "";
                    customActionActivatePendingRef.current = false;
                }
            }

            function cancelCustomAction(item) {
                var assetName = customActionTargetRef.current || (isCustomActionButton(item) ? item.getAttribute("data-custom-action-target") : "");
                if (!assetName) {
                    return false;
                }
                getTimerCallback("__JSAUX_MATRIX_CANCEL_CUSTOM_ACTION__")?.();
                focusCustomActionAfterRender(assetName);
                return true;
            }

            function handleCancel() {
                var activePicker = root.querySelector("[data-time-picker]");
                if (activePicker && cancelVisibleTimePicker(activePicker)) {
                    return;
                }
                var item = selectedItemRef.current;
                if (isCustomOperationBusy(item)) {
                    return;
                }
                if (item && cancelTimePicker(item)) {
                    return;
                }
                if (item && cancelCustomAction(item)) {
                    return;
                }
                if (returnFromCustomPanel(item)) {
                    return;
                }
                var settingsPickerPanel = getSettingsPicker();
                var settingsPickerBack = root.querySelector("[data-settings-picker-back]");
                if (settingsPickerPanel && settingsPickerBack && isVisible(settingsPickerBack)) {
                    var pickerFieldKey = settingsPickerPanel.getAttribute("data-settings-picker-field");
                    selectedNavigationKeyRef.current = pickerFieldKey
                        ? ("settings-field:" + pickerFieldKey)
                        : "settings-back";
                    settingsPickerBack.click();
                    restoreSelectedAfterRender();
                    return;
                }
                var settingsBack = root.querySelector("[data-settings-back]");
                if (settingsBack && isVisible(settingsBack)) {
                    selectedNavigationKeyRef.current = "settings-open";
                    settingsBack.click();
                    restoreSelectedAfterRender();
                    return;
                }
                item = ensureSelected();
                if (item && cancelTimePicker(item)) {
                    return;
                }
                triggerHostBack();
            }

            function focusSettingsPickerAfterOpen() {
                var attempts = 0;
                function focusPickerItem() {
                    var selectedOption = root.querySelector('[data-settings-option-selected="true"]')
                        || root.querySelector("button[data-settings-option]")
                        || root.querySelector("[data-settings-picker-search]")
                        || root.querySelector("[data-settings-picker-back]");
                    var items = getItems();
                    if (selectedOption && items.includes(selectedOption)) {
                        select(items.indexOf(selectedOption));
                        return;
                    }
                    attempts += 1;
                    if (attempts < 6) {
                        ownerWindow.requestAnimationFrame(focusPickerItem);
                    }
                }
                ownerWindow.requestAnimationFrame(focusPickerItem);
            }

            function adjustSettingsSelect(item, direction) {
                if (!item || item.getAttribute("data-settings-cycle") !== "true"
                    || item.getAttribute("data-settings-readonly") === "true") {
                    return false;
                }
                // 时区/天气：按 A 进入插件内选项页，不弹系统下拉。
                if (direction === "activate" && item.hasAttribute("data-settings-picker-open")) {
                    item.click();
                    focusSettingsPickerAfterOpen();
                    return true;
                }
                var values = (item.getAttribute("data-settings-values") || "").split("\u0001").filter(Boolean);
                if (!values.length) {
                    return false;
                }
                var delta = direction === "left" ? -1 : 1;
                item.setAttribute("data-settings-adjust-delta", String(delta));
                item.click();
                return true;
            }

            function consumeVgpEvent(event) {
                event.preventDefault?.();
                event.stopPropagation?.();
                event.stopImmediatePropagation?.();
            }

            function onVgpButtonDown(event) {
                if (!syncPanelVisibility()) {
                    return;
                }
                var picker = root.querySelector("[data-time-picker]");
                var button = event.detail?.button;
                if (button >= 9 && button <= 12) {
                    consumedVgpButtonsRef.current[button] = true;
                    consumeVgpEvent(event);
                    return;
                }
                if (!picker) {
                    if (button !== 1 && button !== 2) {
                        return;
                    }
                    consumedVgpButtonsRef.current[button] = true;
                    consumeVgpEvent(event);
                    if (button === 2) {
                        handleCancel();
                        return;
                    }
                    if (pressedARef.current) {
                        return;
                    }
                    pressedARef.current = true;
                    ensureSelected();
                    activateOnce();
                    return;
                }
                if (button !== 1 && button !== 2) {
                    return;
                }
                consumedVgpButtonsRef.current[button] = true;
                consumeVgpEvent(event);
                if (button === 1) {
                    var pickerKind = picker.getAttribute("data-time-picker");
                    if (pickerKind === "countdown") {
                        getTimerCallback("__JSAUX_MATRIX_START_COUNTDOWN__")?.();
                    } else if (pickerKind === "chronograph") {
                        getTimerCallback("__JSAUX_MATRIX_START_CHRONOGRAPH__")?.();
                    }
                    return;
                }
                if (button === 2) {
                    cancelVisibleTimePicker(picker);
                }
            }

            function onVgpButtonUp(event) {
                var button = event.detail?.button;
                if (button === 1 && syncPanelVisibility()) {
                    pressedARef.current = false;
                    activationArmedRef.current = true;
                    clearActivationCooldown();
                }
                if (!consumedVgpButtonsRef.current[button]) {
                    return;
                }
                consumedVgpButtonsRef.current[button] = false;
                consumeVgpEvent(event);
            }

            function handle(action) {
                if (isCustomOperationBusy(selectedItemRef.current)) {
                    return;
                }
                var items = getItems();
                var currentIndex = selectedItemRef.current ? items.indexOf(selectedItemRef.current) : -1;
                if (!items.length) {
                    return;
                }
                var inSettings = isSettingsPanelVisible();
                var inSettingsPicker = isSettingsPickerVisible();
                var inTimePicker = Boolean(root.querySelector("[data-time-picker]"));
                // 设置/主面板首次方向键不要 ensureSelected，否则会抢走「入口极点」焦点。
                if (!inTimePicker
                    && (action === "up" || action === "down" || action === "left" || action === "right")) {
                    if (inSettingsPicker) {
                        if (focusSettingsPickerDirection(action)) {
                            return;
                        }
                    } else if (inSettings) {
                        if (focusSettingsDirection(action)) {
                            return;
                        }
                    } else {
                        var rangeSelected = currentIndex >= 0
                            && selectedItemRef.current
                            && selectedItemRef.current.matches("input[type='range']");
                        var inCustomEarly = Boolean(getCustomPanel() && (customPanelEnteredRef.current
                            || (selectedItemRef.current && getCustomPanel().contains(selectedItemRef.current))));
                        if (!inCustomEarly && !(rangeSelected && (action === "left" || action === "right"))) {
                            if (focusMainDirection(action)) {
                                return;
                            }
                        }
                    }
                }
                var currentItem = currentIndex >= 0 ? selectedItemRef.current : ensureSelected();
                var inCustom = Boolean(getCustomPanel() && (customPanelEnteredRef.current
                    || (currentItem && getCustomPanel().contains(currentItem))));

                if (action === "up" || action === "down") {
                    if (customActionTargetRef.current || isCustomActionButton(currentItem)) {
                        return;
                    }
                    if (currentItem && adjustCountdownPicker(currentItem, action)) {
                        return;
                    }
                    if (!inCustom && !inTimePicker && moveMainModuleGraph(action)) {
                        return;
                    }
                    moveSpatial(action);
                    return;
                }
                var item = currentItem;
                if (!item) {
                    return;
                }
                if (action === "left" || action === "right") {
                    if (moveCustomAction(item, action)) {
                        return;
                    }
                    // 亮度：左微调；右按网格跳到硬件性能。
                    if (item.matches("input[type='range']")) {
                        if (action === "left") {
                            adjustRange(item, action);
                            return;
                        }
                        if (moveMainModuleGraph(action)) {
                            return;
                        }
                        adjustRange(item, action);
                        return;
                    }
                    if (adjustSettingsSelect(item, action)) {
                        return;
                    }
                    if (moveCountdownField(item, action)) {
                        return;
                    }
                    if (moveFromTimePickerStart(item, action)) {
                        return;
                    }
                    if (!inCustom && !inTimePicker && moveMainModuleGraph(action)) {
                        return;
                    }
                    moveSpatial(action);
                    return;
                }
                if (action === "activate" && confirmTimePicker(item)) {
                    return;
                }
                if (action === "activate" && activateCustomAction(item)) {
                    return;
                }
                if (action === "activate" && enterTimePicker(item)) {
                    return;
                }
                if (action === "activate" && enterCustomPanel(item)) {
                    return;
                }
                if (action === "activate" && item.hasAttribute("data-settings-open")) {
                    // 进入设置不预选控件，等第一次方向键落到度量制/时区入口。
                    selectedNavigationKeyRef.current = null;
                    selectedItemRef.current = null;
                    item.click();
                    return;
                }
                if (action === "activate" && adjustSettingsSelect(item, "activate")) {
                    return;
                }
                item.click();
            }

            function activateOnce() {
                var now = ownerWindow.performance.now();
                if (!syncPanelVisibility() || !activationArmedRef.current || now < activationReadyAtRef.current) {
                    return;
                }
                if (now - lastActivateAtRef.current < activateCooldownMs) {
                    return;
                }
                lastActivateAtRef.current = now;
                handle("activate");
            }

            function repeat(key, action, pressed) {
                var now = ownerWindow.performance.now();
                if (!pressed) {
                    heldActionRef.current[key] = false;
                    repeatAtRef.current[key] = 0;
                    return;
                }
                if (!heldActionRef.current[key]) {
                    heldActionRef.current[key] = true;
                    repeatAtRef.current[key] = now + repeatDelayMs - repeatIntervalMs;
                    armActivationAfterNavigation();
                    handle(action);
                    return;
                }
                if (now - (repeatAtRef.current[key] || 0) < repeatIntervalMs) {
                    return;
                }
                repeatAtRef.current[key] = now;
                handle(action);
            }

            function onKeyDown(event) {
                if (!syncPanelVisibility()) {
                    return;
                }
                var action = {
                    ArrowUp: "up",
                    ArrowDown: "down",
                    ArrowLeft: "left",
                    ArrowRight: "right",
                    Enter: "activate",
                    " ": "activate",
                }[event.key];
                if (!action) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                if (event.stopImmediatePropagation) {
                    event.stopImmediatePropagation();
                }
                if (action === "activate") {
                    if (isTimerControlVisible()) {
                        return;
                    }
                    if (event.repeat || pressedKeysRef.current[event.key]) {
                        return;
                    }
                    pressedKeysRef.current[event.key] = true;
                    ensureSelected();
                    activateOnce();
                    return;
                }
                if (action === "cancel") {
                    handleCancel();
                    return;
                }
                handle(action);
            }

            function onKeyUp(event) {
                if (event.key === "Enter" || event.key === " " || event.key === "Escape") {
                    pressedKeysRef.current[event.key] = false;
                }
                if (event.key === "Enter" || event.key === " ") {
                    activationArmedRef.current = true;
                    clearActivationCooldown();
                }
            }

            function pollGamepad() {
                if (stop) {
                    return;
                }
                var panelVisible = syncPanelVisibility();
                if (panelVisible && hasSteamInputBridge) {
                    steamDirectionButtons.forEach(function (button) {
                        if (pressedSteamButtonsRef.current[button]) {
                            repeat("steam-" + button, steamButtonActions[button], true);
                        }
                    });
                }
                var pads = panelVisible && ownerWindow.navigator.getGamepads ? ownerWindow.navigator.getGamepads() : [];
                for (var i = 0; i < pads.length; i += 1) {
                    var pad = pads[i];
                    if (!pad) {
                        continue;
                    }
                    var x = pad.axes[0] || 0;
                    var y = pad.axes[1] || 0;
                    if (!hasSteamInputBridge) {
                        var upPressed = Boolean(pad.buttons[12] && pad.buttons[12].pressed) || (heldActionRef.current["pad-up"] ? y < -deadzoneExit : y < -deadzoneEnter);
                        var downPressed = Boolean(pad.buttons[13] && pad.buttons[13].pressed) || (heldActionRef.current["pad-down"] ? y > deadzoneExit : y > deadzoneEnter);
                        var leftPressed = Boolean(pad.buttons[14] && pad.buttons[14].pressed) || (heldActionRef.current["pad-left"] ? x < -deadzoneExit : x < -deadzoneEnter);
                        var rightPressed = Boolean(pad.buttons[15] && pad.buttons[15].pressed) || (heldActionRef.current["pad-right"] ? x > deadzoneExit : x > deadzoneEnter);
                        repeat("pad-up", "up", upPressed);
                        repeat("pad-down", "down", downPressed);
                        repeat("pad-left", "left", leftPressed);
                        repeat("pad-right", "right", rightPressed);
                        var a = Boolean(pad.buttons[0] && pad.buttons[0].pressed);
                        if (a && !pressedARef.current) {
                            ensureSelected();
                            activateOnce();
                        }
                        if (!a && pressedARef.current) {
                            activationArmedRef.current = true;
                            clearActivationCooldown();
                        }
                        pressedARef.current = a;
                        var b = Boolean(pad.buttons[1] && pad.buttons[1].pressed);
                        if (b && !pressedBRef.current) {
                            handleCancel();
                        }
                        pressedBRef.current = b;
                    }
                }
                frame = ownerWindow.requestAnimationFrame(pollGamepad);
            }

            ownerWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_AFTER_DELETE__ = focusCustomActionAfterRender;
            ownerWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_SELECT__ = focusCustomSelectAfterRender;
            ownerWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_DELETE__ = focusCustomDeleteAfterRender;
            if (sharedWindow !== ownerWindow) {
                sharedWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_AFTER_DELETE__ = focusCustomActionAfterRender;
                sharedWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_SELECT__ = focusCustomSelectAfterRender;
                sharedWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_DELETE__ = focusCustomDeleteAfterRender;
            }
            root.addEventListener("click", onRootClick, true);
            ownerWindow.addEventListener("keydown", onKeyDown, true);
            ownerWindow.addEventListener("keyup", onKeyUp, true);
            ownerWindow.addEventListener("vgp_onbuttondown", onVgpButtonDown, true);
            ownerWindow.addEventListener("vgp_onbuttonup", onVgpButtonUp, true);
            frame = ownerWindow.requestAnimationFrame(pollGamepad);

            var steamClient = ownerWindow.SteamClient || window.SteamClient;
            if (steamClient && steamClient.Input && steamClient.Input.RegisterForControllerInputMessages) {
                hasSteamInputBridge = true;
                unregisterable = steamClient.Input.RegisterForControllerInputMessages(function (_controllerIndex, button, pressed) {
                    if (button === 0) {
                        if (!pressed) {
                            if (syncPanelVisibility()) {
                                pressedARef.current = false;
                                activationArmedRef.current = true;
                                clearActivationCooldown();
                            }
                            return;
                        }
                        if (!syncPanelVisibility() || isTimerControlVisible() || pressedARef.current) {
                            return;
                        }
                        pressedARef.current = true;
                        ensureSelected();
                        activateOnce();
                        return;
                    }
                    if (!pressed) {
                        pressedSteamButtonsRef.current[button] = false;
                        var releasedAction = steamButtonActions[button];
                        if (releasedAction) {
                            repeat("steam-" + button, releasedAction, false);
                        }
                        return;
                    }
                    if (!syncPanelVisibility()) {
                        return;
                    }
                    var action = steamButtonActions[button];
                    if (!action) {
                        return;
                    }
                    if (action === "activate") {
                        if (isTimerControlVisible()) {
                            return;
                        }
                        if (pressedSteamButtonsRef.current[button]) {
                            return;
                        }
                        pressedSteamButtonsRef.current[button] = true;
                        ensureSelected();
                        activateOnce();
                        return;
                    }
                    pressedSteamButtonsRef.current[button] = true;
                    repeat("steam-" + button, action, true);
                });
            }

            return function () {
                stop = true;
                customPanelEnteredRef.current = false;
                customActionTargetRef.current = "";
                customActionActivatePendingRef.current = false;
                delete ownerWindow.__JSAUX_MATRIX_CANCEL_VISIBLE_TIME_PICKER__;
                delete ownerWindow.__JSAUX_MATRIX_GAMEPAD_NAV_WRAPPED__;
                if (ownerWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_AFTER_DELETE__ === focusCustomActionAfterRender) {
                    delete ownerWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_AFTER_DELETE__;
                }
                if (sharedWindow !== ownerWindow && sharedWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_AFTER_DELETE__ === focusCustomActionAfterRender) {
                    delete sharedWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_AFTER_DELETE__;
                }
                if (ownerWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_SELECT__ === focusCustomSelectAfterRender) {
                    delete ownerWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_SELECT__;
                }
                if (sharedWindow !== ownerWindow && sharedWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_SELECT__ === focusCustomSelectAfterRender) {
                    delete sharedWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_SELECT__;
                }
                if (ownerWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_DELETE__ === focusCustomDeleteAfterRender) {
                    delete ownerWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_DELETE__;
                }
                if (sharedWindow !== ownerWindow && sharedWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_DELETE__ === focusCustomDeleteAfterRender) {
                    delete sharedWindow.__JSAUX_MATRIX_FOCUS_CUSTOM_DELETE__;
                }
                root.removeEventListener("click", onRootClick, true);
                ownerWindow.removeEventListener("keydown", onKeyDown, true);
                ownerWindow.removeEventListener("keyup", onKeyUp, true);
                ownerWindow.removeEventListener("vgp_onbuttondown", onVgpButtonDown, true);
                ownerWindow.removeEventListener("vgp_onbuttonup", onVgpButtonUp, true);
                ownerWindow.cancelAnimationFrame(frame);
                if (selectedItemRef.current) {
                    selectedItemRef.current.classList.remove(selectedClass);
                }
                if (typeof unregisterable === "function") {
                    unregisterable();
                } else if (unregisterable && unregisterable.unregister) {
                    unregisterable.unregister();
                }
            };
        }, []);

        return SP_JSX.jsxs("div", {
            ref: rootRef,
            style: { display: "contents" },
            children: [
                props.children,
                SP_JSX.jsx("style", {
                    children: "." + selectedClass + "{outline:3px solid #7B00FF!important;outline-offset:3px!important;box-shadow:0 0 0 3px #7B00FF,0 0 18px rgba(123,0,255,.95)!important;}" +
                        "button[data-screen-power-action]." + selectedClass + "{outline:none!important;outline-offset:0!important;box-shadow:none!important;}" +
                        "button[data-display-pref]." + selectedClass + ",button[data-display-pref]:focus{outline:none!important;outline-offset:0!important;box-shadow:0 0 0 2px #7B00FF inset!important;}" +
                        "button[data-mode-value]." + selectedClass + ",button[data-mode-value]:focus{outline:none!important;outline-offset:0!important;background:#7B00FF!important;border-color:#7B00FF!important;color:#fff!important;box-shadow:none!important;}" +
                        "button[data-mode-value]." + selectedClass + " span,button[data-mode-value]:focus span{color:#fff!important;}" +
                        "button[data-firmware-action]." + selectedClass + ",button[data-firmware-action]:focus{outline:none!important;outline-offset:0!important;background:#7B00FF!important;color:#fff!important;box-shadow:none!important;}" +
                        "button[data-settings-open]." + selectedClass + ",button[data-settings-open]:focus,button[data-settings-back]." + selectedClass + ",button[data-settings-back]:focus{outline:none!important;outline-offset:0!important;background:#7B00FF!important;color:#fff!important;box-shadow:none!important;}" +
                        "button[data-settings-field]." + selectedClass + ",button[data-settings-field]:focus{outline:none!important;outline-offset:0!important;background:#7B00FF!important;border-color:#7B00FF!important;color:#fff!important;box-shadow:none!important;}" +
                        "button[data-settings-option]." + selectedClass + ",button[data-settings-option]:focus,button[data-settings-picker-back]." + selectedClass + ",button[data-settings-picker-back]:focus{outline:none!important;outline-offset:0!important;background:#7B00FF!important;color:#fff!important;box-shadow:none!important;}" +
                        "input[data-settings-picker-search]." + selectedClass + ",input[data-settings-picker-search]:focus{outline:none!important;outline-offset:0!important;border-color:#7B00FF!important;box-shadow:0 0 0 2px #7B00FF inset!important;}" +
                        "input[type='range']." + selectedClass + "{outline:none!important;outline-offset:0!important;box-shadow:none!important;}" +
                        "input[type='range']." + selectedClass + "::-webkit-slider-thumb{box-shadow:0 0 0 3px #7B00FF,0 0 12px 4px rgba(123,0,255,.55),0 1px 8px rgba(0,0,0,.5)!important;}" +
                        "input[type='range']." + selectedClass + "::-moz-range-thumb{box-shadow:0 0 0 3px #7B00FF,0 0 12px 4px rgba(123,0,255,.55),0 1px 8px rgba(0,0,0,.5)!important;}" +
                        "button[data-custom-asset][aria-pressed='true']{border:4px solid #35D07F!important;box-shadow:0 0 0 1px #0A1118 inset,0 0 10px rgba(53,208,127,.65)!important;}" +
                        "button[data-custom-asset][data-custom-action-selected='true']{border-color:#7B00FF!important;box-shadow:0 0 0 2px #7B00FF inset!important;}" +
                        "button[data-custom-asset]." + selectedClass + ",button[data-custom-asset]:focus{outline:none!important;outline-offset:0!important;border-color:#7B00FF!important;box-shadow:0 0 0 1px #7B00FF inset!important;}" +
                        "button[data-custom-upload]." + selectedClass + ",button[data-custom-upload]:focus{outline:none!important;outline-offset:0!important;background:#7B00FF!important;color:#fff!important;box-shadow:none!important;}" +
                        "button[data-custom-select]." + selectedClass + ",button[data-custom-select]:focus{outline:none!important;outline-offset:0!important;background:#7B00FF!important;color:#fff!important;box-shadow:none!important;}" +
                        "button[data-custom-delete]." + selectedClass + ",button[data-custom-delete]:focus{outline:none!important;outline-offset:0!important;background:#ff5555!important;color:#fff!important;box-shadow:none!important;}",
                }),
            ],
        });
    }

    index = function () {
        var plugin = originalIndex.apply(null, arguments);
        return {
            ...plugin,
            content: SP_JSX.jsx(MatrixGamepadNavWrapper, { children: plugin.content }),
        };
    };
})();

    return index;

})();
