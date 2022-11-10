(() => {
    "use strict";
    var __webpack_modules__ = {
            "./node_modules/@billjs/event-emitter/lib/index.js": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                var r = (s.prototype.isValidType = function(e) {
                    return "string" == typeof e
                }, s.prototype.isValidHandler = function(e) {
                    return "function" == typeof e
                }, s.prototype.on = function(e, t) {
                    if (!e || !t) return !1;
                    if (!this.isValidType(e)) return !1;
                    if (!this.isValidHandler(t)) return !1;
                    var r = this._eventHandlers[e];
                    return !(0 <= (r = r || (this._eventHandlers[e] = [])).indexOf(t)) && (t._once = !1, r.push(t), !0)
                }, s.prototype.once = function(e, t) {
                    if (!e || !t) return !1;
                    if (!this.isValidType(e)) return !1;
                    if (!this.isValidHandler(t)) return !1;
                    e = this.on(e, t);
                    return e && (t._once = !0), e
                }, s.prototype.off = function(e, t) {
                    if (!e) return this.offAll();
                    if (t) {
                        if (this.isValidType(e) && this.isValidHandler(t)) {
                            var r = this._eventHandlers[e];
                            if (r && r.length)
                                for (var s = 0; s < r.length; s++)
                                    if (r[s] === t) {
                                        r.splice(s, 1);
                                        break
                                    }
                        }
                    } else this._eventHandlers[e] = []
                }, s.prototype.offAll = function() {
                    this._eventHandlers = {}
                }, s.prototype.fire = function(e, t) {
                    if (e && this.isValidType(e)) {
                        var r = this._eventHandlers[e];
                        if (r && r.length)
                            for (var s = this.createEvent(e, t), a = 0, n = r; a < n.length; a++) {
                                var i = n[a];
                                this.isValidHandler(i) && (i._once && (s.once = !0), i(s), s.once && this.off(e, i))
                            }
                    }
                }, s.prototype.has = function(e, t) {
                    if (!e || !this.isValidType(e)) return !1;
                    e = this._eventHandlers[e];
                    return !(!e || !e.length) && (!t || !this.isValidHandler(t) || 0 <= e.indexOf(t))
                }, s.prototype.getHandlers = function(e) {
                    return e && this.isValidType(e) && this._eventHandlers[e] || []
                }, s.prototype.createEvent = function(e, t, r) {
                    return void 0 === r && (r = !1), {
                        type: e,
                        data: t,
                        timestamp: Date.now(),
                        once: r
                    }
                }, s);

                function s() {
                    this._eventHandlers = {}
                }
                t.EventEmitter = r, t.globalEvent = new r
            },
            "./src/Wrapper.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const a = r("./node_modules/@billjs/event-emitter/lib/index.js"),
                    n = r("./src/constants/InterfaceType.ts"),
                    i = s(r("./src/constants/style/UIStyle.ts")),
                    o = r("./src/events/InterfaceEvent.ts"),
                    d = s(r("./src/events/WrapperEvent.ts")),
                    l = s(r("./src/interface/FBInstant/FBInstantInterface.ts")),
                    c = s(r("./src/interface/GCBXPromo.ts/GCBXPromoInterface.ts")),
                    u = s(r("./src/interface/SGHooks/SGHooksInterface.ts")),
                    f = s(r("./src/interface/SGSDK/SGSDKInterface.ts")),
                    p = s(r("./src/ui/CountdownTag.ts")),
                    g = s(r("./src/ui/loading/ADPreloader.ts")),
                    _ = s(r("./src/ui/options/FoldReloader.ts")),
                    m = s(r("./src/ui/SupportPopup.ts"));
                class h extends a.EventEmitter {
                    constructor() {
                        super(), this.isReady = !1, this.gameStarted = !1, this["interface"] = new a.EventEmitter, i["default"].setupUIStyle()
                    }
                    static get instance() {
                        return h._instance === undefined ? h._instance = new h : h._instance
                    }
                    static isPlatformSupported() {
                        return h.commsManager.isPlatformSupported
                    }
                    static getPlayerID() {
                        return h.commsManager.playerID
                    }
                    async init(e) {
                        this.config = e, this.logBuild(e), this.applyWrapperOptions();
                        var t = (await this.commsManager.initialize())["err"];
                        return h.commsManager.checkPlatformSupport(t), await this.storageManager.initialize(this.config), this.createInterface(e["interface"]), await this.initAds(), this.config.inAppPurchase && await this.initIAP(), (window.sgWrapper = this).createUI(e), this.initOnceAllReady(), Promise.resolve()
                    }
                    initOnceAllReady() {
                        let e = !1;
                        const t = () => {
                            e || (e = !0, window.onWrapperReady && (this.isReady = !0, window.onWrapperReady(), this.fire(d["default"].READY)))
                        };
                        "complete" === document.readyState ? setTimeout(() => {
                            t()
                        }, 200) : window.addEventListener("load", () => {
                            t()
                        })
                    }
                    onStart() {
                        this.SGPreloader && this.SGPreloader.show()
                    }
                    showSupportPopup() {
                        m["default"].show()
                    }
                    createUI(t) {
                        document.addEventListener("DOMContentLoaded", function(e) {
                            document.head.title = t.gameTitle
                        }), this.countdownTag = new p["default"], this.adLoadBg = new g["default"]
                    }
                    async initAds() {
                        return this.adManager.initialize()
                    }
                    async initIAP() {
                        await this.iapManager.initialize()
                    }
                    hookUpInterface() {
                        this["interface"].once(o.InterfaceEvent.LOADED, () => {}), this["interface"].once(o.InterfaceEvent.LOADED, () => {
                            this.onStartGame()
                        }), this["interface"].on(o.InterfaceEvent.LOAD_PROGRESS, e => {
                            this.commsManager.setLoadingProgress(e.data.progress)
                        })
                    }
                    async onStartGame() {
                        this.gameStarted = !0, this.fire(d["default"].GAME_START);
                        var e = (await this.commsManager.startGame())["err"];
                        e && (console.log(e), this.commsManager.checkPlatformSupport(e))
                    }
                    createInterface(e) {
                        switch (e) {
                            case n.InterfaceType.SGSDK:
                                new f["default"](this["interface"]);
                                break;
                            case n.InterfaceType.SG_HOOKS:
                                new u["default"](this["interface"]);
                                break;
                            case n.InterfaceType.FBInstant:
                                new l["default"](this["interface"]), new c["default"](this["interface"]);
                                break;
                            default:
                                console.warn("Interface not initialized: type not recognized.")
                        }
                        this.hookUpInterface()
                    }
                    applyWrapperOptions() {
                        var e;
                        this.config.options !== undefined && (e = window.navigator.userAgent.includes("Android"), this.config.options.reloadOnFold && e && new _["default"])
                    }
                    logBuild(e) {
                        console.log("*******************************"), console.log(e.gameTitle + " v" + e.gameBuild), console.log(e), console.log("*******************************")
                    }
                    static get placementIDs() {
                        return h.instance.placementIDs
                    }
                    static get commsManager() {
                        return h.instance.commsManager
                    }
                    static get adManager() {
                        return h.instance.adManager
                    }
                    static get iapManager() {
                        return h.instance.iapManager
                    }
                    static get "interface" () {
                        return h.instance["interface"]
                    }
                    static get config() {
                        return h.instance.config
                    }
                    static get storageManager() {
                        return h.instance.storageManager
                    }
                    static get leaderboards() {
                        return h.instance.leaderboards
                    }
                    static get sdkHandler() {
                        return h.instance.sdkHandler
                    }
                    static set sdkHandler(e) {
                        h.instance.sdkHandler = e
                    }
                }
                t["default"] = h
            },
            "./src/constants/Default.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.Default = void 0;
                class r {}(t.Default = r).LANG = "en"
            },
            "./src/constants/InterfaceType.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.InterfaceType = void 0, (t = t.InterfaceType || (t.InterfaceType = {})).SG_HOOKS = "SG_Hooks", t.SGSDK = "sgSdk", t.FBInstant = "FBInstant"
            },
            "./src/constants/Paths.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                class r {}(t["default"] = r).platformConfig = "platform-config.json", r.ratingImage = "lib/assets/grac_kr_rating_all.png", r.softgamesLogo = "lib/assets/softgames_logo.png", r.supportPopupBG = "lib/assets/support_popup.png", r.supportPopupTextFrame = "lib/assets/support_text_frame.png", r.supportPopupCloseBtn = "lib/assets/support_close_button.png", r.firebaseConfig = "firebaseConfig.json"
            },
            "./src/constants/PlatformType.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.PlatformType = void 0, (t = t.PlatformType || (t.PlatformType = {})).SAMSUNG_INSTANT = "samsung", t.AZERION = "azerion", t.WEB = "web"
            },
            "./src/constants/links.ts": (e, t) => {
                var r;
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.LinksKR = t.Links = void 0, (r = t.Links || (t.Links = {})).TOS = "https://www.softgames.com/terms-of-use/", r.PRIVACYPOLICY = "https://www.softgames.de/privacy/", (t = t.LinksKR || (t.LinksKR = {})).TOS = "https://www.softgames.com/terms-of-use-kr/", t.PRIVACYPOLICY = "https://www.softgames.com/privacy-kr/"
            },
            "./src/constants/style/UIStyle.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                s = s(r("./src/constants/style/UIStyleDefault.ts"));
                class a {
                    static setupUIStyle() {
                        const e = document.createElement("style");
                        e.setAttribute("id", a.UI_STYLES_ELEMENT_ID), e.innerHTML = a.UI_STYLE, document.body.appendChild(e)
                    }
                }(t["default"] = a).UI_STYLES_ELEMENT_ID = "ui-styles", a.UI_STYLE = `

    a:link { text-decoration: none; color: inherit; }
    a:visited { text-decoration: none; color: inherit; }
    a:hover { text-decoration: none; color: inherit;}
    a:active { text-decoration: none; color: inherit;}

    .wrapper-ui {
      color: white;
      font-family: sans-serif;
      text-align: center;
      z-index: ${s["default"].UI_ELEMENT_Z_INDEX};
    }
  
    #${s["default"].RATING_CONTAINER_ID}{
      position: absolute;
      right: 0;
      top: 10px;
      width: 20%;
      max-width: 80px; 
      z-index: ${s["default"].RATING_CONTAINER_Z_INDEX}
    }
  
    .loading-screen {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-color: black;
      z-index: inherit;
    }
  
    .splash-screen {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      background-color: white;
      align-items: center;
      justify-content: space-around;
      z-index: 9999;
    }
  
    .game-logo {
      position: absolute;
      top: calc(25vh - 30px);
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      max-height: 20%;
      width: auto;
      border-radius: 16%;
    }

    .supportPopupContainer {
      position: absolute;
      width:330px;
      height:251px;
      left:0;
      right:0;
      top:0;
      bottom:0;
      margin:auto;
    }

    .supportPopup {
      display:block;
      background-size: contain;
      background-repeat: norepeat;
      width:-webkit-fill-available;
      height:-webkit-fill-available;  
    }

    .fullBG {
      background-color:black;
      width:100vw;
      height:100vh;
      margin:0;
      padding:0;
      position:absolute;
      opacity:0.5;
    }

    .supportPopupCloseBtn {
      position:absolute;
      top:20px;
      right:20px;
      width:35px;
      height:35px;
    }

    .termsAndConditionsBg {
      position:absolute;
      width:290px;
      height:53px;
      top:75px;
      right:15px;
      right:0;
      left:0;
      margin:auto;
    }

    .privacyPolicyBg {
      position:absolute;
      width:290px;
      height:53px;
      top:130px;
      right:15px;
      right:0;
      left:0;
      margin:auto;
    }

    .termsAndConditionsLinkText {
      position:absolute;
      top:85px;
      right:0;
      left:0;
      margin:auto;
      font-weight:200;
      font-size:24px;
      user-select:none;
    }

    .privacyPolicyLinkText {
      position:absolute;
      top:140px;
      font-weight:200;
      font-size:24px;
      right:0;
      left:0;
      margin:auto;
      user-select:none;
    }

    .playerIdText {
      position:absolute;
      top:195px;
      right:0;
      left:0;
      margin:auto;
      color:black;
      font-family: "Marker Felt;
      font-weight:bold;
      font-size:23px;
      user-select:none;
    }

    .play-button {
      position: absolute;
      font-style: bold;
      font-family: Arial;
      top: calc(60vh);
      max-height: 20%;
      padding: 10px;
      padding-left: 20px;
      padding-right: 20px;
      text-align:center;
      font-size: 28px;
      color: #FFFFFF;
      background-color: #ff8c00;
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }

    .play-button-bg {
      position:relative;
      display:block;
      top:20px;
    }

    .play-text {
      font-size: 24px;
      font-color: white;
      user-select: none;
    }

    .game-logo-azerion {
      position: absolute;
      top: calc(25vh - 30px);
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      max-height: 20%;
      width: auto;
      border-radius: 16%;
    }

    .background-image {
        width:100vw;
        height:100vh;
        filter: blur(40px);
    }

    .progressringaz {
      position: absolute;
      top: calc(45vh);
      width: ${2*s["default"].SPLASH_SPINNER_SIZE_AZ}px;
      height: ${2*s["default"].SPLASH_SPINNER_SIZE_AZ}px;
    }

    .progressringaz-circle {
      stroke: #f1672b;
      fill: transparent;
      transform: rotate(-90deg);
      transition: stroke-dashoffset 0.35s;
      transform-origin: 50% 50%;
    }
  
    .progress-ring {
      position: absolute;
      top: calc(50vh);
      width: ${2*s["default"].SPLASH_SPINNER_SIZE}px;
      height: ${2*s["default"].SPLASH_SPINNER_SIZE}px;
    }
  
    /* https://css-tricks.com/building-progress-ring-quickly/ */
    .background-circle {
      stroke: #f3f3f3;
      fill: transparent;
    }
  
    .progress-ring-circle {
      stroke: #f1672b;
      fill: transparent;
      transform: rotate(-90deg);
      transition: stroke-dashoffset 0.35s;
      transform-origin: 50% 50%;
    }
  
    .softgames-logo {
      position:absolute;
      max-height: 5%;
      max-width: 60%;
      bottom: 0;
    }

    .sg-logo-azerion {
      position:absolute;
      max-height: 5%;
      max-width: 60%;
      bottom: 30%;
    }

    .sg-logo-azerion-fadeOut {
      opacity: 0;
      transition: opacity 600ms;
    }

    .sg-logo-azerion-fadeIn {
      opacity: 1;
      transition: opacity 600ms;
    }
  
    @media (orientation: landscape) and (max-device-height: 640px) {
      .progress-ring {
        transform: scale(0.8);
      }
  
      .game-logo {
        max-height: 30%;
      }
  
      .softgames-logo {
        max-height: 10%;
      }
    }
  
    
    /* ref: https://www.w3schools.com/howto/howto_css_loader.asp */
    .spinner {
      position: absolute;
      top: calc(50vh - 30px);
      left: calc(50vw - 30px);
  
      border: 4px solid #f3f3f3;
      border-top: 4px solid black;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      animation: spin 1s linear infinite;
    }
  
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  
    .countdown-tag {
      pointer-events: none;
      position: absolute;
      right: 0;
      bottom: 80px;
      padding: 0 20px;
      width: 90px;
      background-color: black;
      opacity: 0;
      z-index: inherit;
    }
  
    /* ref: https://css-tricks.com/snippets/css/toggle-visibility-when-hiding-elements/ */
    .countdown-tag-fadeIn {
      opacity: 1;
      transition: opacity 300ms;
    }
  
    .countdown-tag-label {
      font-size: 16px;
      padding: 0 10px;
    }
  `
            },
            "./src/constants/style/UIStyleDefault.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                class r {}(t["default"] = r).SAMSUNG_SPLASH_DURATION_MS = 3e3, r.SHOW_RATING_DURATION_MS = 3e3, r.RATING_CONTAINER_Z_INDEX = 1e3, r.RATING_CONTAINER_ID = "rating_container", r.SPLASH_SPINNER_SIZE = 36, r.SPLASH_SPINNER_SIZE_AZ = 18, r.SPLASH_SPINNER_STROKE = 5, r.UI_ELEMENT_Z_INDEX = 9e3, r.ADS_CONTAINER_Z_INDEX = 1e4, r.ADS_CONTAINER_ID = "ads_container", r.LOGGER_CONTAINER_Z_INDEX = 2e3, r.LOGGER_CONTAINER_ID = "debug_logger", r.DEBUG_MENU_Z_INDEX = 3e4
            },
            "./src/events/AdManagerEvent.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.AdManagerEvent = void 0, (t = t.AdManagerEvent || (t.AdManagerEvent = {})).AD_ERROR = "AD_ERROR", t.AD_LOADED = "AD_LOADED", t.AD_START = "AD_START", t.AD_SKIP = "AD_SKIP", t.AD_COMPLETE = "AD_COMPLETE", t.AD_CLOSE = "AD_CLOSE", t.INTERSTITIAL_AD_REQUESTED = "INTERSTITIAL_AD_REQUESTED", t.REWARDED_AD_REQUESTED = "REWARDED_AD_REQUESTED", t.AD_REQUESTED = "AD_REQUESTED", t.FREE_REWARD_AWARDED = "FREE_REWARD_AWARDED"
            },
            "./src/events/AdTimerEvent.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.AdTimerEvent = void 0, (t = t.AdTimerEvent || (t.AdTimerEvent = {})).COOLDOWN_START = "COOLDOWN_START", t.COOLDOWN_END = "COOLDOWN_END", t.LONGPLAY_TRIGGER = "LONGPLAY_TRIGGER", t.LONGPLAY_TICKER_START = "LONGPLAY_TICKER_START", t.LONGPLAY_TICKER_STOP = "LONGPLAY_TICKER_STOP", t.LONGPLAY_TICK = "LONGPLAY_TICK", t.LONGPLAY_WARN_TICK = "LONGPLAY_WARN_TICK", t.LONGPLAY_WARN = "LONGPLAY_WARN"
            },
            "./src/events/GameEvent.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.GameEvent = void 0, (t = t.GameEvent || (t.GameEvent = {})).LEVEL_START = "LEVEL_START", t.LEVEL_FINISH = "LEVEL_FINISH", t.GAME_START = "GAME_START", t.GAME_OVER = "GAME_OVER"
            },
            "./src/events/IAPEvents.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.IAPEvents = void 0, (t.IAPEvents || (t.IAPEvents = {})).IAP_READY = "onIAPReady"
            },
            "./src/events/InterfaceEvent.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.InterfaceEvent = void 0, (t = t.InterfaceEvent || (t.InterfaceEvent = {})).LOADED = "GAME_LOADED", t.LOAD_PROGRESS = "LOAD_PROGRESS"
            },
            "./src/events/WrapperEvent.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                class r {}(t["default"] = r).SDK_INIT = "SDK_INIT", r.SPLASH_HIDDEN = "SPLASH_HIDDEN", r.REQUEST_AD = "REQUEST_AD", r.GAME_START = "GAME_START", r.GAME_PAUSE = "GAME_PAUSE", r.GAME_RESUME = "GAME_RESUME", r.READY = "WRAPPER_READY"
            },
            "./src/index/indexBase.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const a = s(r("./src/constants/Paths.ts")),
                    n = s(r("./src/Wrapper.ts"));
                class i {
                    constructor() {
                        this.loadConfig(a["default"].platformConfig)
                    }
                    async loadConfig(e) {
                        const t = await fetch(e);
                        e = await t.json();
                        this.createWrapper(e)
                    }
                    async createWrapper(e) {}
                    async getLeaderboardHandler(r) {
                        let s;
                        return new Promise((t, e) => {
                            s = window.setInterval(() => {
                                var e;
                                window.sgLeaderboards && (window.clearInterval(s), e = window.sgLeaderboards.getHandler(n["default"].config, r), t(e))
                            }, 100)
                        })
                    }
                }
                t["default"] = i
            },
            "./src/index/indexazerion.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const a = r("./src/constants/PlatformType.ts"),
                    n = r("./src/leaderboards/LeaderboardTypes.ts"),
                    i = s(r("./src/platforms/azerion/AzerionAdManager.ts")),
                    o = s(r("./src/platforms/azerion/AzerionCommsManager.ts")),
                    d = s(r("./src/platforms/azerion/AzerionIAPManager.ts")),
                    l = s(r("./src/platforms/azerion/AzerionStorageManager.ts")),
                    c = s(r("./src/platforms/azerion/ui/AzerionSGPreloader.ts")),
                    u = s(r("./src/Wrapper.ts"));
                class f extends s(r("./src/index/indexBase.ts"))["default"] {
                    async createWrapper(e) {
                        (u["default"].instance.config = e).platform = a.PlatformType.AZERION, u["default"].instance.storageManager = new l["default"], u["default"].instance.commsManager = new o["default"], u["default"].instance.adManager = new i["default"], u["default"].instance.placementIDs = {
                            rewarded: u["default"].config.gameID,
                            interstitial: u["default"].config.gameID
                        }, u["default"].instance.iapManager = new d["default"], u["default"].instance.SGPreloader = new c["default"](!1), u["default"].instance.init(e), !0 === e.leaderboardSupport && (u["default"].instance.leaderboards = await this.getLeaderboardHandler(n.LeaderboardTypes.FIREBASE)), u["default"].instance.onStart()
                    }
                }
                new(t["default"] = f)
            },
            "./src/interface/FBInstant/FBInstantInterface.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const a = r("./src/events/InterfaceEvent.ts"),
                    n = s(r("./src/Wrapper.ts"));
                var i = s(r("./src/interface/common/InterfaceBase.ts"));
                const o = s(r("./src/interface/FBInstant/modules/FBContext.ts")),
                    d = s(r("./src/interface/FBInstant/modules/FBPayments.ts")),
                    l = s(r("./src/interface/FBInstant/modules/FBPlayer.ts")),
                    c = s(r("./src/interface/FBInstant/modules/FBTournament.ts"));
                class u extends i["default"] {
                    constructor(e) {
                        super(e), this.player = new l["default"], this.payments = new d["default"], this.tournament = new c["default"], this.context = new o["default"], window.FBInstant = this
                    }
                    initializeAsync() {
                        return n["default"].instance.supportedLanguages = ["en"], Promise.resolve()
                    }
                    startGameAsync() {
                        return this.interfaceRef.fire(a.InterfaceEvent.LOAD_PROGRESS, {
                            progress: 101
                        }), n["default"].commsManager.startGame(), Promise.resolve()
                    }
                    setLoadingProgress(e) {
                        var t = e || 0;
                        n["default"].commsManager.setLoadingProgress(t), 100 <= e && this.interfaceRef.fire(a.InterfaceEvent.LOADED)
                    }
                    onPause(e) {}
                    getLocale() {
                        return n["default"].commsManager.getLanguage()
                    }
                    getPlatform() {
                        return null
                    }
                    getSDKVersion() {
                        return ""
                    }
                    logEvent(e, t, r) {
                        return null
                    }
                    quit() {}
                    async getInterstitialAdAsync(e) {
                        return Promise.resolve({
                            loadAsync() {
                                return Promise.resolve()
                            },
                            showAsync() {
                                return n["default"].adManager.showInterstitialAd()
                            },
                            getPlacementID() {
                                return n["default"].placementIDs.interstitial
                            }
                        })
                    }
                    async getRewardedVideoAsync(e) {
                        return Promise.resolve({
                            loadAsync() {
                                return Promise.resolve()
                            },
                            showAsync() {
                                return new Promise(async (e, t) => {
                                    e(await n["default"].adManager.showRewardedAd())
                                })
                            },
                            getPlacementID() {
                                return n["default"].placementIDs.rewarded
                            }
                        })
                    }
                    async getLeaderboardAsync(e) {
                        return new Promise(async e => {
                            e(await window.sgLeaderboards.getHandler(n["default"].config))
                        })
                    }
                    canCreateShortcutAsync() {
                        return Promise.resolve(!1)
                    }
                    checkCanPlayerMatchAsync() {
                        return Promise.resolve(!1)
                    }
                    createShortcutAsync() {
                        return Promise.resolve(undefined)
                    }
                    getEntryPointAsync() {
                        return Promise.resolve("")
                    }
                    getEntryPointData() {
                        return null
                    }
                    getSupportedAPIs() {
                        return ["getRewardedVideoAsync", "getInterstitialAdAsync", "startGameAsync"]
                    }
                    matchPlayerAsync(e, t, r) {
                        return Promise.resolve(undefined)
                    }
                    postSessionScore(e) {}
                    setSessionData(e) {}
                    shareAsync(e) {
                        return Promise.resolve(undefined)
                    }
                    switchGameAsync(e, t) {
                        return Promise.resolve(undefined)
                    }
                    updateAsync(e) {
                        return Promise.resolve(undefined)
                    }
                }
                t["default"] = u
            },
            "./src/interface/FBInstant/modules/FBContext.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const a = s(r("./src/Wrapper.ts"));
                class n {
                    getID() {
                        return a["default"].config.platform
                    }
                    getType() {
                        return "SOLO"
                    }
                    isSizeBetween(e, t) {
                        return null
                    }
                    switchAsync(e) {
                        return Promise.resolve()
                    }
                    chooseAsync(e) {
                        return Promise.resolve()
                    }
                    createAsync(e) {
                        return Promise.resolve()
                    }
                    getPlayersAsync() {
                        return Promise.resolve([])
                    }
                }
                t["default"] = n
            },
            "./src/interface/FBInstant/modules/FBPayments.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const a = r("./src/events/IAPEvents.ts"),
                    n = s(r("./src/Wrapper.ts"));
                class i {
                    async getCatalogAsync() {
                        return n["default"].iapManager.getCatalogAsync()
                    }
                    async purchaseAsync(e) {
                        return n["default"].iapManager.purchaseAsync(e)
                    }
                    async getPurchasesAsync() {
                        return n["default"].iapManager.getPurchasesAsync()
                    }
                    async consumePurchaseAsync(e) {
                        return n["default"].iapManager.consumePurchaseAsync(e)
                    }
                    onReady(e) {
                        if (n["default"].iapManager.ready) return e && e();
                        n["default"].iapManager.once(a.IAPEvents.IAP_READY, () => {
                            e && e()
                        })
                    }
                    hasIAPSupport() {
                        return n["default"].iapManager.hasIAPSupport()
                    }
                }
                t["default"] = i
            },
            "./src/interface/FBInstant/modules/FBPlayer.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const i = s(r("./src/Wrapper.ts"));
                class a {
                    getID() {
                        return i["default"].commsManager.playerID
                    }
                    getSignedPlayerInfoAsync(e) {
                        return Promise.resolve({
                            getPlayerID() {
                                return i["default"].getPlayerID()
                            },
                            getSignature() {
                                return ""
                            }
                        })
                    }
                    canSubscribeBotAsync() {
                        return Promise.resolve(!1)
                    }
                    subscribeBotAsync() {
                        return Promise.resolve(undefined)
                    }
                    getName() {
                        return ""
                    }
                    getPhoto() {
                        return ""
                    }
                    async getDataAsync(e) {
                        return await i["default"].storageManager.getItem()
                    }
                    setDataAsync(n) {
                        return new Promise((e, t) => {
                            try {
                                var r, s;
                                for ([r, s] of Object.entries(n)) i["default"].storageManager.setItem(r, s);
                                e()
                            } catch (a) {
                                t(a)
                            }
                        })
                    }
                    flushDataAsync() {
                        return Promise.resolve(undefined)
                    }
                    getStatsAsync(e) {
                        return Promise.resolve(null)
                    }
                    setStatsAsync(e) {
                        return Promise.resolve(undefined)
                    }
                    incrementStatsAsync(e) {
                        return Promise.resolve(null)
                    }
                    getConnectedPlayersAsync() {
                        return Promise.resolve([{
                            getID: () => "id",
                            getPhoto: () => "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
                            getName: () => "Name"
                        }])
                    }
                }
                t["default"] = a
            },
            "./src/interface/FBInstant/modules/FBTournament.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                class r {
                    async postScoreAsync() {}
                    async createAsync() {
                        return {
                            getID: () => 0,
                            getContextID: () => 0,
                            getEndTime: () => 0,
                            getTitle: () => "",
                            getPayload: () => ""
                        }
                    }
                    async getTournamentsAsync() {
                        return []
                    }
                    async joinAsync(e) {}
                    async shareAsync() {}
                }
                t["default"] = r
            },
            "./src/interface/GCBXPromo.ts/GCBXPromoInterface.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const a = r("./src/events/GameEvent.ts"),
                    n = r("./src/events/InterfaceEvent.ts"),
                    i = s(r("./src/Wrapper.ts"));
                var o = s(r("./src/interface/common/InterfaceBase.ts"));
                const d = s(r("./src/interface/GCBXPromo.ts/sgModules/GCBXModuleBackend.ts")),
                    l = s(r("./src/interface/GCBXPromo.ts/sgModules/GCBXModulesXPromo.ts"));
                class c extends o["default"] {
                    constructor(e) {
                        super(e), this.storage = {
                            getStorageValue: this.getStorageValue.bind(this),
                            getStorageData: this.getStorageData.bind(this),
                            isGameBotRateLimited: this.isGameBotRateLimited.bind(this),
                            save: this.save.bind(this)
                        }, this.loading = {
                            finished: this.finished.bind(this)
                        }, this.tracking = {
                            isFirstTimeUser: this.isFirstTimeUser.bind(this),
                            getGameBotSubscribed: this.getGameBotSubscribed.bind(this),
                            isGameBotRateLimited: this.isGameBotRateLimited.bind(this),
                            getRegistrationDate: this.getRegistrationDate.bind(this)
                        }, this.utils = {
                            createShortcut: this.createShortcut.bind(this),
                            waitForGBCBeingLive: this.waitForGBCBeingLive.bind(this)
                        }, this.backend = new d["default"], this.xpromo = new l["default"], this.sgModules = {
                            backend: this.backend,
                            xpromo: this.xpromo
                        }, window.GBCXPromo = this
                    }
                    getGameConfig() {
                        return null
                    }
                    init(e, t) {
                        return Promise.resolve()
                    }
                    getLocale() {
                        return console.log("'getLocale' has an implemented logic."), i["default"].commsManager.getLanguage()
                    }
                    setLocale(e) {
                        return ""
                    }
                    prepareText(e, t) {
                        return ""
                    }
                    getLocalizableContent(e, t) {
                        return {
                            "default": "",
                            localizations: {}
                        }
                    }
                    setProgress(e) {
                        e = e || 0;
                        i["default"].commsManager.setLoadingProgress(e)
                    }
                    finished(e) {
                        return this.interfaceRef.fire(n.InterfaceEvent.LOADED), this.interfaceRef.fire(n.InterfaceEvent.LOAD_PROGRESS, {
                            progress: 101
                        }), Promise.resolve()
                    }
                    async showRewardedAd(e) {
                        return console.log("'showRewardedAd' has an implemented logic."), await i["default"].adManager.showRewardedAd()
                    }
                    async showInterstitialAd(e) {
                        return console.log("'showInterstitialAd' has an implemented logic."), await i["default"].adManager.showInterstitialAd()
                    }
                    areRewardedAdsSupported() {
                        return i["default"].config.adsConfig.rewarded
                    }
                    areInterstitialAdsSupported() {
                        return !0
                    }
                    gameStart() {
                        this.interfaceRef.fire(a.GameEvent.GAME_START)
                    }
                    gameOver(e, t) {
                        this.interfaceRef.fire(a.GameEvent.GAME_OVER, {
                            level: e,
                            score: t
                        }), this.trackScore(e, t)
                    }
                    subscribeToBot() {
                        return Promise.resolve()
                    }
                    isFirstTimeUser() {
                        return !1
                    }
                    getUserLifetime() {
                        return -1
                    }
                    getSessionOfDay() {
                        return -1
                    }
                    getGameBotSubscribed() {
                        return !1
                    }
                    isGameBotRateLimited() {
                        return !1
                    }
                    getRegistrationDate() {
                        return -1
                    }
                    isChallengeAvailable() {
                        return !1
                    }
                    initChallenge(e) {}
                    startChallengeAsync(e) {
                        return Promise.resolve()
                    }
                    updateScore(e) {}
                    getStorageValue(e, t) {
                        var r;
                        try {
                            if ((r = i["default"].storageManager.getItem(e)) !== undefined && null !== r) return r
                        } catch (s) {
                            console.log("Could not restore data - " + s)
                        }
                        return t
                    }
                    save(n, e) {
                        return new Promise((e, t) => {
                            try {
                                var r, s;
                                for ([r, s] of Object.entries(n)) i["default"].storageManager.setItem(r, s);
                                e()
                            } catch (a) {
                                t(a)
                            }
                        })
                    }
                    load(e) {
                        return i["default"].storageManager.getItem(e)
                    }
                    getStorageData() {
                        return Object()
                    }
                    getLocalStorageKey() {
                        return ""
                    }
                    waitForGBCBeingLive(e) {
                        return Promise.resolve()
                    }
                    createShortcut() {
                        return Promise.resolve()
                    }
                }
                t["default"] = c
            },
            "./src/interface/GCBXPromo.ts/sgModules/GCBXModuleBackend.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                class r {
                    isConnected() {
                        return Promise.resolve(!1)
                    }
                    getUserProfile() {
                        return Promise.resolve(undefined)
                    }
                    getServerTimestamp() {
                        return Promise.resolve(-1)
                    }
                    setUserProfile({}) {
                        return Promise.resolve()
                    }
                    syncFriendListByPlatformPlayerId({}) {
                        return Promise.resolve()
                    }
                    getFriendsScores({}) {
                        return Promise.resolve(null)
                    }
                    postScore({}) {
                        return Promise.resolve()
                    }
                    executeRuntimeScript({}) {
                        return Promise.resolve(null)
                    }
                }
                t["default"] = r
            },
            "./src/interface/GCBXPromo.ts/sgModules/GCBXModulesXPromo.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                class r {
                    getXPromo({}) {
                        return Promise.resolve([])
                    }
                    switchGame(e) {
                        return Promise.resolve()
                    }
                    initialize({}) {
                        return () => {}
                    }
                }
                t["default"] = r
            },
            "./src/interface/SGHooks/SGHooksActionType.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.SGHooksActionType = void 0, (t = t.SGHooksActionType || (t.SGHooksActionType = {})).RUN = "runGame", t.PAUSE = "pauseGame", t.UNPAUSE = "unpauseGame"
            },
            "./src/interface/SGHooks/SGHooksInterface.ts": function(__unused_webpack_module, exports, __webpack_require__) {
                var __importDefault = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(exports, "__esModule", {
                    value: !0
                });
                const GameEvent_1 = __webpack_require__("./src/events/GameEvent.ts"),
                    InterfaceEvent_1 = __webpack_require__("./src/events/InterfaceEvent.ts"),
                    WrapperEvent_1 = __importDefault(__webpack_require__("./src/events/WrapperEvent.ts")),
                    html_1 = __webpack_require__("./src/ui/helpers/html.ts"),
                    Wrapper_1 = __importDefault(__webpack_require__("./src/Wrapper.ts")),
                    InterfaceBase_1 = __importDefault(__webpack_require__("./src/interface/common/InterfaceBase.ts")),
                    SGHooksActionType_1 = __webpack_require__("./src/interface/SGHooks/SGHooksActionType.ts");
                class SGHooksInterface extends InterfaceBase_1["default"] {
                    constructor(e) {
                        super(e), Wrapper_1["default"].instance.supportedLanguages = window.gameLangs, this.loadGameScripts(), window.SG_Hooks = this, window.SG = {
                            lang: Wrapper_1["default"].commsManager.getLanguage()
                        }
                    }
                    start() {
                        this.interfaceRef.fire(InterfaceEvent_1.InterfaceEvent.LOAD_PROGRESS, {
                            progress: 101
                        }), Wrapper_1["default"].commsManager.startGame()
                    }
                    triggerMoreGames() {}
                    getLanguage(e) {
                        return Wrapper_1["default"].commsManager.getLanguage(e)
                    }
                    registerObserver(e) {
                        this.observer = e
                    }
                    setPauseHandler(e) {
                        Wrapper_1["default"].commsManager.setPauseCallback(e), this.observer !== undefined && this.observer({
                            action: SGHooksActionType_1.SGHooksActionType.PAUSE
                        })
                    }
                    setUnpauseHandler(e) {
                        Wrapper_1["default"].commsManager.setResumeCallback(e), this.observer !== undefined && this.observer({
                            action: SGHooksActionType_1.SGHooksActionType.UNPAUSE
                        })
                    }
                    setOrientationHandler(e) {
                        window.addEventListener("orientationchange", () => {
                            e()
                        })
                    }
                    setResizeHandler(e) {
                        window.addEventListener("resize", () => {
                            e()
                        })
                    }
                    async loaded() {
                        this.interfaceRef.fire(InterfaceEvent_1.InterfaceEvent.LOADED), this.interfaceRef.fire(InterfaceEvent_1.InterfaceEvent.LOAD_PROGRESS, {
                            progress: 101
                        }), this.observer !== undefined && this.observer({
                            action: SGHooksActionType_1.SGHooksActionType.RUN
                        })
                    }
                    async triggerIncentivise(e) {
                        const t = await Wrapper_1["default"].adManager.showRewardedAd();
                        e && e(t)
                    }
                    async beforePlayButtonDisplay(e) {
                        Wrapper_1["default"].config.adsConfig.supportsAdPlayButton = !0;
                        const t = await Wrapper_1["default"].adManager.showInterstitialAd();
                        e && e(t)
                    }
                    async playButtonPressed(e) {
                        e && e()
                    }
                    isEnabledIncentiviseButton() {
                        return !0
                    }
                    levelStarted(e, t) {
                        this.interfaceRef.fire(GameEvent_1.GameEvent.LEVEL_START, {
                            level: e
                        }), t && t()
                    }
                    levelFinished(e, t, r) {
                        this.interfaceRef.fire(GameEvent_1.GameEvent.LEVEL_FINISH, {
                            level: e
                        }), this.trackScore(e, t), r && r()
                    }
                    gameStart(e) {
                        this.interfaceRef.fire(GameEvent_1.GameEvent.GAME_START), e && e()
                    }
                    gameOver(e, t, r) {
                        this.interfaceRef.fire(GameEvent_1.GameEvent.GAME_OVER, {
                            level: e,
                            score: t
                        }), this.trackScore(e, t), r && r()
                    }
                    levelUp(e, t, r) {
                        r && r()
                    }
                    addBooster() {}
                    setStorageItem(e, t) {
                        Wrapper_1["default"].storageManager.setItem(e, t)
                    }
                    getStorageItem(e) {
                        return Wrapper_1["default"].storageManager.getItem(e)
                    }
                    setCloseCallback(e) {
                        Wrapper_1["default"].commsManager.setResumeCallback(e)
                    }
                    async loadGameScripts() {
                        if (window.gameJS) {
                            for (const e of window.gameJS) await (0, html_1.createHTMLElement)({
                                src: e,
                                tag: "script"
                            });
                            this.initGame()
                        } else this.initGame()
                    }
                    initGame() {
                        try {
                            Wrapper_1["default"].instance.isReady ? eval(window.gameOnLoadScript) : Wrapper_1["default"].instance.once(WrapperEvent_1["default"].READY, () => {
                                eval(window.gameOnLoadScript)
                            })
                        } catch (error) {}
                    }
                }
                exports["default"] = SGHooksInterface
            },
            "./src/interface/SGSDK/SGSDKInterface.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const n = r("./src/events/GameEvent.ts"),
                    i = r("./src/events/InterfaceEvent.ts"),
                    a = s(r("./src/events/WrapperEvent.ts")),
                    o = s(r("./src/Wrapper.ts"));
                s = s(r("./src/interface/common/InterfaceBase.ts"));
                const d = r("./src/interface/SGSDK/SGSDKTriggers.ts");
                class l extends s["default"] {
                    constructor(e) {
                        super(e), this.actionMapping = [], window.sgSdk = this
                    }
                    initialize(e, t, r) {
                        this.initData = t, o["default"].instance.supportedLanguages = t.supportedLanguages;
                        let s = {
                            commands: {
                                supportedLanguages: t.supportedLanguages
                            },
                            config: {
                                env: {
                                    locale: o["default"].commsManager.getLanguage()
                                },
                                rewarded: {
                                    enabled: !0
                                }
                            }
                        };
                        o["default"].instance.on(a["default"].GAME_PAUSE, () => {
                            this.initData.freezeGame()
                        }), o["default"].instance.on(a["default"].GAME_RESUME, () => {
                            this.initData.unfreezeGame()
                        }), o["default"].instance.supportedLanguages = t.supportedLanguages, r && r(null, s, window.sgSdk)
                    }
                    getLocale() {
                        return o["default"].commsManager.getLanguage()
                    }
                    async trigger(e, t) {
                        switch (e) {
                            case d.SGSDKTriggers.START:
                                this.interfaceRef.fire(i.InterfaceEvent.LOAD_PROGRESS, {
                                    progress: 101
                                }), o["default"].commsManager.startGame();
                                break;
                            case d.SGSDKTriggers.LOADING_COMPLETED:
                                this.interfaceRef.fire(i.InterfaceEvent.LOAD_PROGRESS, {
                                    progress: 101
                                }), this.interfaceRef.fire(i.InterfaceEvent.LOADED), this.initData.runGame();
                                break;
                            case d.SGSDKTriggers.LOADING_UPDATE:
                                this.interfaceRef.fire(i.InterfaceEvent.LOAD_PROGRESS, {
                                    progress: t.progressPercentage
                                }), 100 <= t.progressPercentage && this.interfaceRef.fire(i.InterfaceEvent.LOADED);
                                break;
                            case d.SGSDKTriggers.SAVE:
                                if (o["default"].storageManager.setItem(t.key, t.value), t.callback) return void t.callback();
                                break;
                            case d.SGSDKTriggers.RESTORE:
                                const r = o["default"].storageManager.getItem(t.key);
                                if (t.callback) return void t.callback(null, r);
                                break;
                            case d.SGSDKTriggers.REWARDED_AD:
                                const s = await o["default"].adManager.showRewardedAd();
                                if (t.callback) return void t.callback(s);
                                break;
                            case d.SGSDKTriggers.BEFORE_PLAY_BUTTON_DISPLAY:
                                o["default"].config.adsConfig.supportsAdPlayButton = !0;
                                const a = await o["default"].adManager.showInterstitialAd();
                                if (t.callback) return void t.callback(a);
                                break;
                            case d.SGSDKTriggers.LEVEL_START:
                                if (this.interfaceRef.fire(n.GameEvent.LEVEL_START, {
                                        level: t.level
                                    }), t.callback) return void t.callback();
                                break;
                            case d.SGSDKTriggers.LEVEL_FINISH:
                                if (this.interfaceRef.fire(n.GameEvent.LEVEL_FINISH, {
                                        level: t.level
                                    }), t.callback) return void t.callback();
                                this.trackScore(t.level, t.score);
                                break;
                            case d.SGSDKTriggers.GAME_START:
                                this.interfaceRef.fire(n.GameEvent.GAME_START);
                                break;
                            case d.SGSDKTriggers.GAME_OVER:
                                if (this.interfaceRef.fire(n.GameEvent.GAME_OVER, t), t.callback) return void t.callback();
                                this.trackScore(null, t.score);
                                break;
                            case d.SGSDKTriggers.PLAY_BUTTON_PRESSED:
                                if (t.callback) return void t.callback(!0);
                                break;
                            case d.SGSDKTriggers.MORE_GAMES || d.SGSDKTriggers.GAME_TRACKING || d.SGSDKTriggers.PAGE_DISPLAY:
                                break;
                            default:
                                console.log("Unrecognized sgsdk command :: " + e)
                        }
                    }
                }
                t["default"] = l
            },
            "./src/interface/SGSDK/SGSDKTriggers.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.SGSDKTriggers = void 0, (t = t.SGSDKTriggers || (t.SGSDKTriggers = {})).START = "start", t.LOADING_COMPLETED = "loading.completed", t.LOADING_UPDATE = "loading.update", t.SAVE = "save", t.RESTORE = "restore", t.REWARDED_AD = "rewardedAd", t.BEFORE_PLAY_BUTTON_DISPLAY = "beforePlayButtonDisplay", t.PLAY_BUTTON_PRESSED = "playButtonPressed", t.MORE_GAMES = "moreGames", t.GAME_TRACKING = "gameTracking", t.PAGE_DISPLAY = "pageDisplay", t.LEVEL_START = "levelStart", t.LEVEL_FINISH = "levelFinish", t.GAME_START = "gameStart", t.GAME_OVER = "gameOver"
            },
            "./src/interface/common/InterfaceBase.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const a = r("./src/events/AdManagerEvent.ts"),
                    n = s(r("./src/Wrapper.ts"));
                class i {
                    constructor(e) {
                        this.interfaceRef = e
                    }
                    setPauseHandler(e) {
                        n["default"].commsManager.setPauseCallback(e)
                    }
                    setUnpauseHandler(e) {
                        n["default"].commsManager.setResumeCallback(e)
                    }
                    setAdClosedCallback(e) {
                        n["default"].adManager.on(a.AdManagerEvent.AD_CLOSE, () => {
                            e && e()
                        })
                    }
                    startLongPlayAdTimer() {
                        n["default"].adManager.forceLongPlayStart(!0)
                    }
                    stopLongPlayAdTimer() {
                        n["default"].adManager.forceLongPlayStart(!1)
                    }
                    getWrapper() {
                        return n["default"].instance
                    }
                    isIAP() {
                        return n["default"].instance.iapManager.hasIAPSupport()
                    }
                    isMobile() {
                        return [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i].some(e => navigator.userAgent.match(e))
                    }
                    showSupportPopup() {
                        n["default"].instance.showSupportPopup()
                    }
                    trackScore(e, t) {
                        e !== undefined && null !== e ? n["default"].commsManager.setScore(e) : t !== undefined && null !== t && n["default"].commsManager.setScore(t)
                    }
                }
                t["default"] = i
            },
            "./src/leaderboards/LeaderboardTypes.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.LeaderboardTypes = void 0, (t = t.LeaderboardTypes || (t.LeaderboardTypes = {}))[t.FIREBASE = 0] = "FIREBASE", t[t.SAMSUNG = 1] = "SAMSUNG"
            },
            "./src/platforms/azerion/AzerionAdManager.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const a = r("./src/events/AdManagerEvent.ts"),
                    n = s(r("./src/Wrapper.ts"));
                var i = s(r("./src/platforms/common/ADManager.ts"));
                const o = s(r("./src/platforms/azerion/AzerionAdTimer.ts")),
                    d = s(r("./src/platforms/azerion/AzerionEventDispatcher.ts")),
                    l = r("./src/platforms/azerion/constants/AzerionAdType.ts"),
                    c = r("./src/platforms/azerion/events/AzerionEvent.ts"),
                    u = r("./src/platforms/azerion/events/AzerionMetaEvents.ts");
                class f extends i["default"] {
                    async initialize() {
                        return super.initialize(), d["default"].i.on(u.AzerionMetaEvents.CONTENT_PAUSE_REQUESTED, () => {
                            this.fire(a.AdManagerEvent.AD_START)
                        }), d["default"].i.on(c.AzerionEvent.SDK_COMPLETE, () => {
                            this.fire(a.AdManagerEvent.AD_CLOSE)
                        }), d["default"].i.on(c.AzerionEvent.SDK_SKIPPED, () => {
                            this.fire(a.AdManagerEvent.AD_CLOSE)
                        }), d["default"].i.on(c.AzerionEvent.SDK_GAME_START, () => {
                            this.fire(a.AdManagerEvent.AD_CLOSE)
                        }), d["default"].i.on(c.AzerionEvent.SDK_ERROR, () => {
                            this.fire(a.AdManagerEvent.AD_CLOSE)
                        }), d["default"].i.on(c.AzerionEvent.AD_IS_ALREADY_RUNNING, () => {
                            this.fire(a.AdManagerEvent.AD_CLOSE)
                        }), n["default"].config.adsConfig.rewarded && this.preloadNextRewarded(), this.showPrerollAD = e => {
                            this.showInterstitialAd(), window.removeEventListener("pointerdown", this.showPrerollAD), e.preventDefault()
                        }, window.addEventListener("pointerdown", this.showPrerollAD), Promise.resolve()
                    }
                    async showInterstitialAd() {
                        console.log("showing ad 1");
                        //this.fire(a.AdManagerEvent.AD_REQUESTED), this.adTimer.ready && (super.showInterstitialAd(), n["default"].sdkHandler.showAd())
                    }
                    async showRewardedAd() {
                        //this.initData.freezeGame();
                        console.log("showing ad 2");
                        // super.showRewardedAd(), this.fire(a.AdManagerEvent.AD_REQUESTED);
                        // var e = new Promise(async (t, e) => {
                        //     const r = () => {
                        //             d["default"].i.off(c.AzerionEvent.SDK_SKIPPED, s), t(!0), this.fire(a.AdManagerEvent.AD_COMPLETE), this.fire(a.AdManagerEvent.AD_CLOSE)
                        //         },
                        //         s = () => {
                        //             d["default"].i.off(c.AzerionEvent.SDK_REWARDED_WATCH_COMPLETE, r), t(!1), this.fire(a.AdManagerEvent.AD_SKIP), this.fire(a.AdManagerEvent.AD_CLOSE)
                        //         };
                        //     d["default"].i.once(c.AzerionEvent.SDK_REWARDED_WATCH_COMPLETE, r), d["default"].i.once(c.AzerionEvent.SDK_SKIPPED, s), n["default"].sdkHandler.showAd(l.AzerionAdType.REWARDED).then(e => {})["catch"](e => {
                        //         this.adTimer.freeRewardedReady, t(!1), this.fire(a.AdManagerEvent.AD_ERROR, e), this.fire(a.AdManagerEvent.AD_CLOSE)
                        //     })
                        // });
                        // return this.preloadNextRewarded(), e
                    }
                    setupTimer() {
                        this.adTimer = new o["default"], super.setupTimer()
                    }
                    async preloadNextRewarded() {
                        var e = (await n["default"].sdkHandler.preloadAd(l.AzerionAdType.REWARDED))["err"];
                        e ? console.log("ADManager : Rewarded Ad could not be preloaded.") : console.log("ADManager : Rewarded Ad loaded succesfully.")
                    }
                }
                t["default"] = f
            },
            "./src/platforms/azerion/AzerionAdTimer.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                var a = s(r("./src/platforms/common/AdTimer.ts"));
                const n = s(r("./src/platforms/azerion/constants/AzerionAdRules.ts"));
                class i extends a["default"] {
                    constructor() {
                        super(), this.initialize(n["default"].get())
                    }
                }
                t["default"] = i
            },
            "./src/platforms/azerion/AzerionCommsManager.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const a = r("./src/constants/Default.ts"),
                    n = s(r("./src/events/WrapperEvent.ts")),
                    i = r("./src/ui/helpers/html.ts"),
                    o = s(r("./src/Wrapper.ts"));
                var d = s(r("./src/platforms/common/CommsManager.ts"));
                const l = s(r("./src/platforms/azerion/AzerionEventDispatcher.ts")),
                    c = r("./src/platforms/azerion/events/AzerionEvent.ts");
                class u extends d["default"] {
                    constructor() {
                        super(...arguments), this.hasPaused = !1
                    }
                    async initialize() {
                        window.GD_OPTIONS = {
                            gameId: o["default"].config.gameID,
                            prefix: "sg_",
                            onEvent: function(e) {
                                console.log("event :: " + e.name), l["default"].i.fire(e.name, e)
                            },
                            advertisementSettings: {
                                debug: !1,
                                autoplay: !1,
                                locale: "en"
                            }
                        };
                        var e = new Promise(async (t, e) => {
                            l["default"].i.once(c.AzerionEvent.SDK_READY, () => {
                                if (window.gdsdk) o["default"].sdkHandler = window.gdsdk, console.log(o["default"].sdkHandler), t(!0);
                                else {
                                    const e = setInterval(() => {
                                        window.gdsdk && (clearInterval(e), o["default"].sdkHandler = window.gdsdk, console.log(o["default"].sdkHandler), t(!0))
                                    }, 10)
                                }
                            })
                        });
                        return function(e, t) {
                            let r, s = e.getElementsByTagName("script")[0];
                            e.getElementById(t) || (r = e.createElement("script"), r.id = t, r.src = "https://html5.api.gamedistribution.com/main.min.js", s.parentNode.insertBefore(r, s))
                        }(document, "gamedistribution-jssdk"), l["default"].i.on(c.AzerionEvent.SDK_GAME_PAUSE, () => {
                            this.hasPaused = !0, o["default"].instance.fire(n["default"].GAME_PAUSE)
                        }), l["default"].i.on(c.AzerionEvent.SDK_GAME_START, () => {
                            this.hasPaused && o["default"].instance.fire(n["default"].GAME_RESUME), this.hasPaused = !1
                        }), e
                    }
                    async startGame() {
                        return Promise.resolve({
                            err: null
                        })
                    }
                    getLanguage(e = 0) {
                        return (0, i.getParameterByName)("lang") || a.Default.LANG
                    }
                    setLoadingProgress(e) {}
                    setPauseCallback(e) {
                        l["default"].i.on(c.AzerionEvent.SDK_GAME_PAUSE, () => {
                            e && e()
                        })
                    }
                    setResumeCallback(e) {
                        l["default"].i.on(c.AzerionEvent.SDK_GAME_START, () => {
                            e && e()
                        })
                    }
                    setCloseCallback(e) {}
                    checkPlatformSupport(e) {
                        return !0
                    }
                    setScore(e) {}
                }
                t["default"] = u
            },
            "./src/platforms/azerion/AzerionEventDispatcher.ts": (e, t, r) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                class s extends r("./node_modules/@billjs/event-emitter/lib/index.js").EventEmitter {
                    static get i() {
                        return s._i || (s._i = new s)
                    }
                }
                t["default"] = s
            },
            "./src/platforms/azerion/AzerionIAPManager.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                class a extends s(r("./src/platforms/common/IAPManager.ts"))["default"] {
                    hasIAPSupport() {
                        return !1
                    }
                }
                t["default"] = a
            },
            "./src/platforms/azerion/AzerionStorageManager.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                class a extends s(r("./src/platforms/common/StorageManager.ts"))["default"] {
                    async setCloudData(e, t) {}
                    async getCloudData(e) {
                        return null
                    }
                }
                t["default"] = a
            },
            "./src/platforms/azerion/constants/AzerionAdRules.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                class r {
                    constructor() {
                        this.adCooldownDuration = 1e3, this.adWarningDuration = 5e3, this.startOnCooldown = !1, this.maxLongPlayAdTimerRollover = 2e3, this.prerollAd = !0
                    }
                    static get() {
                        return new r
                    }
                }
                t["default"] = r
            },
            "./src/platforms/azerion/constants/AzerionAdType.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.AzerionAdType = void 0, (t.AzerionAdType || (t.AzerionAdType = {})).REWARDED = "rewarded"
            },
            "./src/platforms/azerion/events/AzerionEvent.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.AzerionEvent = void 0, (t = t.AzerionEvent || (t.AzerionEvent = {})).SDK_GAME_START = "SDK_GAME_START", t.CONTENT_RESUME_REQUESTED = "CONTENT_RESUME_REQUESTED ", t.SDK_GAME_PAUSE = "CONTENT_PAUSE_REQUESTED", t.SDK_GDPR_TRACKING = "SDK_GDPR_TRACKING", t.SDK_REWARDED_WATCH_COMPLETE = "SDK_REWARDED_WATCH_COMPLETE", t.SDK_SKIPPED = "SKIPPED", t.SDK_COMPLETE = "COMPLETE", t.SDK_READY = "SDK_READY", t.SDK_STARTED = "STARTED", t.SDK_ERROR = "AD_ERROR", t.AD_IS_ALREADY_RUNNING = "AD_IS_ALREADY_RUNNING"
            },
            "./src/platforms/azerion/events/AzerionMetaEvents.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.AzerionMetaEvents = void 0, (t = t.AzerionMetaEvents || (t.AzerionMetaEvents = {})).AD_ERROR = "AD_ERROR", t.AD_BREAK_READY = "AD_BREAK_READY", t.AD_METADATA = "AD_METADATA", t.ALL_ADS_COMPLETED = "ALL_ADS_COMPLETED", t.CLICK = "CLICK", t.COMPLETE = "COMPLETE", t.CONTENT_PAUSE_REQUESTED = "CONTENT_PAUSE_REQUESTED", t.CONTENT_RESUME_REQUESTED = "CONTENT_RESUME_REQUESTED", t.DURATION_CHANGE = "DURATION_CHANGE", t.FIRST_QUARTILE = "FIRST_QUARTILE", t.IMPRESSION = "IMPRESSION", t.INTERACTION = "INTERACTION", t.LINEAR_CHANGED = "LINEAR_CHANGED", t.LOADED = "LOADED", t.LOG = "LOG", t.MIDPOINT = "MIDPOINT", t.PAUSED = "PAUSED", t.RESUMED = "RESUMED", t.SKIPPABLE_STATE_CHANGED = "SKIPPABLE_STATE_CHANGED", t.THIRD_QUARTILE = "THIRD_QUARTILE", t.USER_CLOSE = "USER_CLOSE", t.VOLUME_CHANGED = "VOLUME_CHANGED", t.VOLUME_MUTED = "VOLUME_MUTED", t.GDPR_TARGETING = "SDK_GDPR_TARGETING", t.SDK_GDPR_THIRD_PARTY = "SDK_GDPR_THIRD_PARTY"
            },
            "./src/platforms/azerion/ui/AzerionSGPreloader.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const a = s(r("./src/constants/style/UIStyleDefault.ts"));
                class n extends s(r("./src/ui/loading/SGPreloader.ts"))["default"] {
                    constructor(e = !0) {
                        super(e)
                    }
                    build() {
                        super.build(), this.spinner.classList.remove("progress-ring"), this.spinner.setAttribute("class", "progressringaz"), this.circle.setAttribute("r", "" + (a["default"].SPLASH_SPINNER_SIZE_AZ - a["default"].SPLASH_SPINNER_STROKE / 2)), this.circle.setAttribute("cx", "" + a["default"].SPLASH_SPINNER_SIZE_AZ), this.circle.setAttribute("cy", "" + a["default"].SPLASH_SPINNER_SIZE_AZ), this.circle.setAttribute("stroke-width", "" + a["default"].SPLASH_SPINNER_STROKE), this.background.setAttribute("class", "background-circle"), this.background.setAttribute("r", "" + (a["default"].SPLASH_SPINNER_SIZE_AZ - a["default"].SPLASH_SPINNER_STROKE / 2)), this.background.setAttribute("cx", "" + a["default"].SPLASH_SPINNER_SIZE_AZ), this.background.setAttribute("cy", "" + a["default"].SPLASH_SPINNER_SIZE_AZ), this.background.setAttribute("stroke-width", "" + a["default"].SPLASH_SPINNER_STROKE)
                    }
                    show() {
                        super.show(), window.setTimeout(() => {
                            this.hide()
                        }, 3e3)
                    }
                    hide() {
                        super.hide()
                    }
                    updateProgress(e) {
                        super.updateProgress(e)
                    }
                    timeLeftMS() {
                        return super.timeLeftMS()
                    }
                    destroy() {
                        super.destroy()
                    }
                    onLogoShown() {
                        this.softgamesLogo.setAttribute("class", "sg-logo-azerion")
                    }
                }
                t["default"] = n
            },
            "./src/platforms/common/ADManager.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                var a = r("./node_modules/@billjs/event-emitter/lib/index.js");
                const n = r("./src/events/AdManagerEvent.ts"),
                    i = r("./src/events/AdTimerEvent.ts"),
                    o = r("./src/events/GameEvent.ts"),
                    d = s(r("./src/Wrapper.ts"));
                class l extends a.EventEmitter {
                    constructor() {
                        super(), this.levelsPlayedSinceLastAd = 0
                    }
                    async initialize() {
                        this.setupTimer(), d["default"]["interface"].on(o.GameEvent.GAME_OVER, e => {
                            this.onGameOver(e)
                        }), d["default"]["interface"].on(o.GameEvent.LEVEL_FINISH, e => {
                            this.onGameOver(e)
                        })
                    }
                    forceLongPlayStart(e) {
                        e ? this.adTimer.startLongPlayAdTimer() : this.adTimer.stopLongPlayAdTimer()
                    }
                    get longPlayTimeLeft() {
                        return this.adTimer.longPlayTimeLeft
                    }
                    showInterstitialAd() {
                        d["default"].config.options && 1 == d["default"].config.options.disableAllAds || (d["default"].adManager.once(n.AdManagerEvent.AD_CLOSE, () => {
                            d["default"].config.adsConfig.enableLongGameplayAds && this.adTimer.startLongPlayAdTimer()
                        }), this.adTimer.stopLongPlayAdTimer(), this.fire(n.AdManagerEvent.INTERSTITIAL_AD_REQUESTED))
                    }
                    showRewardedAd() {
                        d["default"].config.options && 1 == d["default"].config.options.disableAllAds || this.fire(n.AdManagerEvent.REWARDED_AD_REQUESTED)
                    }
                    setupTimer() {
                        this.adTimer.on(i.AdTimerEvent.LONGPLAY_TRIGGER, () => {
                            this.showInterstitialAd()
                        })
                    }
                    onGameOver(e) {
                        this.shouldAdPlayOnGameEnd(e.level, e.score) && this.showInterstitialAd()
                    }
                    shouldAdPlayOnGameEnd(e, t) {
                        this.levelsPlayedSinceLastAd++;
                        e = !d["default"].config.adsConfig.supportsAdPlayButton && (e >= d["default"].config.adsConfig.adFreeInitialLevels || null === e || e === undefined) && this.levelsPlayedSinceLastAd > d["default"].config.adsConfig.interstitialCooldownLevel;
                        return e && (this.levelsPlayedSinceLastAd = 0), e
                    }
                }
                t["default"] = l
            },
            "./src/platforms/common/AdTimer.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                var a = r("./node_modules/@billjs/event-emitter/lib/index.js");
                const n = s(r("./src/Wrapper.ts")),
                    i = r("./src/events/GameEvent.ts"),
                    o = r("./src/events/AdManagerEvent.ts"),
                    d = r("./src/events/AdTimerEvent.ts"),
                    l = s(r("./src/events/WrapperEvent.ts"));
                class c extends a.EventEmitter {
                    constructor() {
                        super(...arguments), this._longPlayTimeLeft = -1, this.isGameOrLevelPlaying = !1
                    }
                    get ready() {
                        return this._ready
                    }
                    get freeRewardedReady() {
                        return this._freeRewardedReady
                    }
                    get longPlayTimeLeft() {
                        return this._longPlayTimeLeft
                    }
                    initialize(e) {
                        if (this.adRules = e, this.isLongPlayTimerRunning = !1, n["default"].config.adsConfig.enableLongGameplayAds) {
                            const t = () => {
                                    this.isGameOrLevelPlaying = !0, this.startLongPlayAdTimer()
                                },
                                r = () => {
                                    this.isGameOrLevelPlaying = !1, this.stopLongPlayAdTimer()
                                };
                            n["default"]["interface"].on(i.GameEvent.GAME_START, () => {
                                t()
                            }), n["default"]["interface"].on(i.GameEvent.LEVEL_START, () => {
                                t()
                            }), n["default"]["interface"].on(i.GameEvent.GAME_OVER, () => {
                                r()
                            }), n["default"]["interface"].on(i.GameEvent.LEVEL_FINISH, () => {
                                r()
                            })
                        }
                        this._ready = !e.startOnCooldown, e.startOnCooldown && (n["default"].instance.gameStarted ? this.startAdCoolDownTimer() : n["default"].instance.once(l["default"].GAME_START, () => {
                            this.startAdCoolDownTimer()
                        })), this.handleFreeRewardedTimer(), n["default"].adManager.on(o.AdManagerEvent.AD_SKIP, () => {
                            this.onAdPlayed()
                        }), n["default"].adManager.on(o.AdManagerEvent.AD_ERROR, () => {
                            this.onAdFail()
                        })
                    }
                    startLongPlayAdTimer() {
                        !this.isLongPlayTimerRunning && this.isGameOrLevelPlaying && (console.log("LONG PLAY TIMER STARTED"), this.isLongPlayTimerRunning = !0, this.longPlayTimerID && window.clearInterval(this.longPlayTimerID), this._longPlayTimeLeft = n["default"].config.adsConfig.longGameplayCooldownMS, this.longPlayTimerID = window.setInterval(() => {
                            this._longPlayTimeLeft -= 1e3, this.fire(d.AdTimerEvent.LONGPLAY_TICK), this.longPlayTimeLeft <= 0 ? (window.clearInterval(this.longPlayTimerID), this.onLongPlayTimerEnd()) : this._longPlayTimeLeft <= this.adRules.adWarningDuration && (this._longPlayTimeLeft == this.adRules.adWarningDuration && this.fire(d.AdTimerEvent.LONGPLAY_WARN), console.log("warning :: " + this._longPlayTimeLeft), this.fire(d.AdTimerEvent.LONGPLAY_WARN_TICK))
                        }, 1e3), this.fire(d.AdTimerEvent.LONGPLAY_TICKER_START))
                    }
                    stopLongPlayAdTimer() {
                        console.log("LONG PLAY TIMER STOPPED"), window.clearTimeout(this.longPlayTimerID), this.isLongPlayTimerRunning = !1, this.fire(d.AdTimerEvent.LONGPLAY_TICKER_STOP)
                    }
                    startAdCoolDownTimer() {
                        console.log("AD IS ON COOLDOWN FOR THE NEXT " + this.adRules.adCooldownDuration / 1e3 + "SECONDS."), this.adCooldownTimerID = window.setTimeout(() => {
                            this.onAdCoolDownTimerEnd()
                        }, this.adRules.adCooldownDuration), this.fire(d.AdTimerEvent.COOLDOWN_START)
                    }
                    stopAdCoolDownTimer() {
                        console.log("AD COOLDOWN ENDED."), window.clearTimeout(this.adCooldownTimerID)
                    }
                    handleFreeRewardedTimer() {
                        this._freeRewardedReady = !0, n["default"].adManager.on(o.AdManagerEvent.FREE_REWARD_AWARDED, () => {
                            this._freeRewardedReady = !1, window.setTimeout(() => {
                                this._freeRewardedReady = !0
                            }, n["default"].config.adsConfig.freeRewardedCooldown)
                        })
                    }
                    onAdPlayed() {
                        this._ready = !1, this._longPlayTimeLeft = -1, this.startAdCoolDownTimer()
                    }
                    onAdFail() {}
                    onAdCoolDownTimerEnd() {
                        this._ready = !0, this.fire(d.AdTimerEvent.COOLDOWN_END)
                    }
                    onLongPlayTimerEnd() {
                        this._longPlayTimeLeft = -1, n["default"].adManager.once(o.AdManagerEvent.AD_CLOSE, () => {
                            n["default"].config.adsConfig.enableLongGameplayAds && (this.isLongPlayTimerRunning = !1, this.startLongPlayAdTimer())
                        }), this.fire(d.AdTimerEvent.LONGPLAY_TRIGGER), console.log("LONG PLAY AD TRIGERRED"), this.isLongPlayTimerRunning = !1
                    }
                }
                t["default"] = c
            },
            "./src/platforms/common/CommsManager.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                var a = r("./node_modules/@billjs/event-emitter/lib/index.js");
                const n = r("./src/constants/InterfaceType.ts"),
                    i = s(r("./src/Wrapper.ts")),
                    o = r("./src/platforms/samsung/utils/UID.ts");
                class d extends a.EventEmitter {
                    constructor() {
                        super(...arguments), this.isPlatformSupported = !0
                    }
                    checkPlatformSupport(e) {
                        return this.isPlatformSupported = !0
                    }
                    get playerID() {
                        let e = i["default"].storageManager.getItem("__sUID");
                        return null !== e && e !== undefined || i["default"].config["interface"] !== n.InterfaceType.FBInstant || (e = (0, o.getUID)(), i["default"].storageManager.setItem("__sUID", e)), e
                    }
                }
                t["default"] = d
            },
            "./src/platforms/common/IAPManager.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                var a = r("./node_modules/@billjs/event-emitter/lib/index.js");
                const n = s(r("./src/Wrapper.ts"));
                class i extends a.EventEmitter {
                    constructor() {
                        super(...arguments), this.isInit = !1
                    }
                    initialize() {
                        return Promise.resolve(!0)
                    }
                    getCatalogAsync() {
                        return Promise.resolve([])
                    }
                    purchaseAsync(e) {
                        return Promise.resolve(null)
                    }
                    getPurchasesAsync() {
                        return Promise.resolve([])
                    }
                    consumePurchaseAsync(e) {
                        return Promise.resolve()
                    }
                    onReady(e) {
                        e && e()
                    }
                    hasIAPSupport() {
                        return n["default"].config.inAppPurchase
                    }
                    getSupportedAPIs() {
                        return []
                    }
                    get ready() {
                        return this.isInit
                    }
                }
                t["default"] = i
            },
            "./src/platforms/common/StorageManager.ts": (e, t, r) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const s = r("./node_modules/uuid/dist/esm-browser/index.js");
                class a {
                    constructor() {
                        this.store = this.createStore()
                    }
                    async initialize(e) {
                        var t = e.gameSlug.replace(/-/g, "_").toUpperCase();
                        this.storageKey = (0, s.v5)(t + "_STORAGE", "28c78f71-1c31-4331-a9ca-e51e9221b3fa");
                        e = this.getLocalData(this.storageKey), t = await this.getCloudData(this.storageKey);
                        this.store = t || e, console.log(`user data loaded from '${t?"cloudStorage":"localStorage"}'.`), console.log("data: " + JSON.stringify(this.store))
                    }
                    setItem(e, t) {
                        var r = Date.now();
                        return this.store = Object.assign(Object.assign({}, this.store), {
                            [e]: t,
                            _lastUpdate: r
                        }), this.save()
                    }
                    getItem(e) {
                        return null === this.store ? null : e === undefined ? this.store : null != this.store[e] ? this.store[e] : null
                    }
                    async save() {
                        this.saveLocalData(this.storageKey, this.store);
                        return this.setCloudData(this.storageKey, this.store)
                    }
                    createStore() {
                        return {
                            _lastUpdate: 0
                        }
                    }
                    saveLocalData(e, t) {
                        t = JSON.stringify(t);
                        localStorage.setItem(e, t)
                    }
                    getLocalData(e) {
                        e = localStorage.getItem(e);
                        return e && JSON.parse(e)
                    }
                    async setCloudData(e, t) {}
                    async getCloudData(e) {
                        return null
                    }
                }
                t["default"] = a
            },
            "./src/platforms/samsung/utils/UID.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getUID = void 0, t.getUID = function() {
                    return Date.now().toString(36) + Math.floor(Math.pow(10, 12) + 9 * Math.random() * Math.pow(10, 12)).toString(36)
                }
            },
            "./src/ui/CountdownTag.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const a = r("./src/events/AdManagerEvent.ts"),
                    n = r("./src/events/AdTimerEvent.ts"),
                    i = s(r("./src/Wrapper.ts")),
                    o = r("./src/ui/helpers/uiRoot.ts");
                class d {
                    constructor() {
                        const e = (0, o.getUIRoot)();
                        this.tag = document.createElement("div"), this.tag.setAttribute("class", "countdown-tag"), e.appendChild(this.tag), this.textfield = document.createElement("h4"), this.textfield.setAttribute("class", "countdown-tag-label"), this.tag.appendChild(this.textfield), i["default"].adManager.adTimer.on(n.AdTimerEvent.LONGPLAY_WARN, () => {
                            this.show()
                        }), i["default"].adManager.adTimer.on(n.AdTimerEvent.LONGPLAY_WARN_TICK, () => {
                            this.update(i["default"].adManager.adTimer.longPlayTimeLeft / 1e3)
                        }), i["default"].adManager.on(a.AdManagerEvent.AD_START, () => {
                            this.hide()
                        })
                    }
                    show() {
                        this.tag.classList.toggle("countdown-tag-fadeIn", !0)
                    }
                    update(e) {
                        this.textfield.textContent = `Ad in ${e}s`, 1 === e ? window.setTimeout(() => {
                            this.hide()
                        }, 1e3) : e < 0 && this.hide()
                    }
                    hide() {
                        this.tag.classList.toggle("countdown-tag-fadeIn", !1)
                    }
                }
                t["default"] = d
            },
            "./src/ui/SupportPopup.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const l = s(r("./src/constants/Paths.ts")),
                    c = r("./src/ui/texts.ts"),
                    u = s(r("./src/Wrapper.ts")),
                    a = r("./src/ui/helpers/uiRoot.ts"),
                    f = r("./src/constants/links.ts");
                class n {
                    constructor() {
                        this.container = document.createElement("div"), this.container.setAttribute("class", "supportPopupContainer"), this.fullBG = document.createElement("div"), this.fullBG.setAttribute("class", "fullBG");
                        const e = document.createElement("div");
                        e.setAttribute("class", "supportPopup"), this.container.appendChild(e), e.style.backgroundImage = "url(./" + l["default"].supportPopupBG + ")";
                        const t = document.createElement("img");
                        t.src = l["default"].supportPopupCloseBtn, t.setAttribute("class", "supportPopupCloseBtn"), t.onclick = () => {
                            this.hide()
                        }, this.container.appendChild(t);
                        const r = document.createElement("img");
                        r.src = l["default"].supportPopupTextFrame, r.setAttribute("class", "termsAndConditionsBg");
                        const s = document.createElement("img");
                        s.src = l["default"].supportPopupTextFrame, s.setAttribute("class", "privacyPolicyBg");
                        const a = document.createElement("div"),
                            n = document.createElement("div");
                        let i = u["default"].commsManager.getLanguage();
                        c.wrapperLanguages.includes(i) || (i = "en");
                        var o = ("kr" == i ? f.LinksKR : f.Links).TOS,
                            d = ("kr" == i ? f.LinksKR : f.Links).PRIVACYPOLICY;
                        a.innerHTML = "<a target='_blank' href='" + o + "'>" + c.TEXTS[i].tos + "</a>", a.setAttribute("class", "termsAndConditionsLinkText"), n.innerHTML = "<a target='_blank' href='" + d + "'>" + c.TEXTS[i].privacy + "</a>", n.setAttribute("class", "privacyPolicyLinkText"), this.playerIdText = document.createElement("div"), this.playerIdText.setAttribute("class", "playerIdText"), this.container.appendChild(r), this.container.appendChild(s), this.container.appendChild(a), this.container.appendChild(n), this.container.appendChild(this.playerIdText)
                    }
                    static show() {
                        null == n._instance && (n._instance = new n), n._instance.show()
                    }
                    show() {
                        const e = (0, a.getUIRoot)();
                        e.appendChild(this.fullBG), e.appendChild(this.container), this.playerIdText.innerHTML = "ID: " + u["default"].getPlayerID()
                    }
                    hide() {
                        const e = (0, a.getUIRoot)();
                        e.contains(this.container) && e.removeChild(this.container), e.contains(this.fullBG) && e.removeChild(this.fullBG)
                    }
                }
                t["default"] = n, n._instance = null
            },
            "./src/ui/helpers/html.ts": (e, t) => {
                function d(t) {
                    return new Promise(e => {
                        document.addEventListener(t, e)
                    })
                }
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getParameterByName = t.DOMEventToPromise = t.createHTMLElement = void 0, t.createHTMLElement = async function({
                    tag: e,
                    id: t,
                    src: r,
                    style: s,
                    optParent: a
                }) {
                    document.body || await d("DOMContentLoaded");
                    const n = document.createElement(e);
                    t && (n.id = t), s && n.setAttribute("style", s);
                    const i = a || document.body;
                    var o;
                    return i.appendChild(n), r && (o = n, a = new Promise(e => {
                        o.onload = () => {
                            e()
                        }
                    }), n.setAttribute("src", r), await a), n
                }, t.DOMEventToPromise = d, t.getParameterByName = function(e, t = window.location.href) {
                    return e = e.replace(/[\[\]]/g, "\\$&"), (t = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)").exec(t)) ? t[2] ? decodeURIComponent(t[2].replace(/\+/g, " ")) : "" : null
                }
            },
            "./src/ui/helpers/uiRoot.ts": (e, t) => {
                function r() {
                    const e = document.createElement("div");
                    return e.setAttribute("id", t.UI_ROOT_ELEMENT_ID), e.setAttribute("class", "wrapper-ui"), document.body.appendChild(e), e
                }
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.getUIRoot = t.createUIRoot = t.UI_ROOT_ELEMENT_ID = void 0, t.UI_ROOT_ELEMENT_ID = "ui-root", t.createUIRoot = r, t.getUIRoot = function() {
                    return document.getElementById(t.UI_ROOT_ELEMENT_ID) || r()
                }
            },
            "./src/ui/loading/ADPreloader.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const a = r("./src/events/AdManagerEvent.ts"),
                    n = s(r("./src/Wrapper.ts")),
                    i = r("./src/ui/helpers/uiRoot.ts");
                class o {
                    constructor() {
                        this.root = (0, i.getUIRoot)(), this.bg = document.createElement("div"), this.bg.setAttribute("class", "loading-screen");
                        const e = document.createElement("div");
                        e.setAttribute("class", "spinner"), this.bg.appendChild(e), n["default"].adManager.on(a.AdManagerEvent.AD_REQUESTED, () => {
                            this.show()
                        }), n["default"].adManager.on(a.AdManagerEvent.AD_START, () => {
                            this.hide()
                        }), n["default"].adManager.on(a.AdManagerEvent.AD_CLOSE, () => {
                            this.hide()
                        })
                    }
                    show() {
                        console.log("ad preloader show!"), this.root.appendChild(this.bg), window.setTimeout(() => {
                            this.hide()
                        }, 5e3)
                    }
                    hide() {
                        console.log("ad preloader hide!"), this.root.contains(this.bg) && this.root.removeChild(this.bg)
                    }
                }
                t["default"] = o
            },
            "./src/ui/loading/SGPreloader.ts": function(e, t, r) {
                var s = this && this.__importDefault || function(e) {
                    return e && e.__esModule ? e : {
                        "default": e
                    }
                };
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                const a = r("./src/ui/helpers/uiRoot.ts"),
                    n = s(r("./src/constants/style/UIStyleDefault.ts")),
                    i = r("./src/ui/helpers/html.ts"),
                    o = s(r("./src/constants/Paths.ts")),
                    d = r("./src/events/InterfaceEvent.ts"),
                    l = s(r("./src/Wrapper.ts"));
                class c {
                    constructor(e = !0) {
                        this.showRating = e, this.hideCalled = !1, this.root = (0, a.createUIRoot)(), this.build(), l["default"]["interface"].once(d.InterfaceEvent.LOADED, () => {
                            this.isLoaded = !0, this.canHide && this.hide()
                        })
                    }
                    build() {
                        this.hideTimer = window.setTimeout(() => {
                            this.canHide = !0, this.isLoaded && this.hide()
                        }, 5e3), this.bg = document.createElement("div"), this.bg.setAttribute("class", "splash-screen");
                        const e = document.createElement("img");
                        e.setAttribute("src", "./Icon_512x512.png"), e.setAttribute("class", "background-image"), this.bg.appendChild(e);
                        const t = document.createElement("img");
                        t.setAttribute("src", "./Icon_512x512.png"), t.setAttribute("class", "game-logo"), this.bg.appendChild(t), this.spinner = document.createElementNS("http://www.w3.org/2000/svg", "svg"), this.spinner.setAttribute("class", "progress-ring"), this.background = document.createElementNS("http://www.w3.org/2000/svg", "circle"), this.background.setAttribute("class", "background-circle"), this.background.setAttribute("r", "" + (n["default"].SPLASH_SPINNER_SIZE - n["default"].SPLASH_SPINNER_STROKE / 2)), this.background.setAttribute("cx", "" + n["default"].SPLASH_SPINNER_SIZE), this.background.setAttribute("cy", "" + n["default"].SPLASH_SPINNER_SIZE), this.background.setAttribute("stroke-width", "" + n["default"].SPLASH_SPINNER_STROKE), this.spinner.appendChild(this.background), this.circle = document.createElementNS("http://www.w3.org/2000/svg", "circle"), this.circle.classList.add("progress-ring-circle"), this.circle.setAttribute("r", "" + (n["default"].SPLASH_SPINNER_SIZE - n["default"].SPLASH_SPINNER_STROKE / 2)), this.circle.setAttribute("cx", "" + n["default"].SPLASH_SPINNER_SIZE), this.circle.setAttribute("cy", "" + n["default"].SPLASH_SPINNER_SIZE), this.circle.setAttribute("stroke-width", "" + n["default"].SPLASH_SPINNER_STROKE), this.circle.style.animation = "spin 2s linear infinite", this.spinner.appendChild(this.circle), this.bg.appendChild(this.spinner), (0, i.createHTMLElement)({
                            tag: "img"
                        }).then(async e => {
                            e.src = o["default"].softgamesLogo, e.setAttribute("class", "softgames-logo"), this.softgamesLogo = e, this.bg.append(e), this.onLogoShown()
                        }), this.showRating && (0, i.createHTMLElement)({
                            tag: "img",
                            id: n["default"].RATING_CONTAINER_ID
                        }).then(async e => {
                            e.src = o["default"].ratingImage, this.bg.append(e)
                        }), this.createdAt = new Date, this.circumference = 2 * (n["default"].SPLASH_SPINNER_SIZE - n["default"].SPLASH_SPINNER_STROKE / 2) * Math.PI, this.circle.style.strokeDasharray = this.circumference + " " + this.circumference, this.circle.style.strokeDashoffset = "" + (this.circumference - 1 / 3 * this.circumference)
                    }
                    show() {
                        this.hideCalled && window.setTimeout(() => {
                            this.hide()
                        }, 3e3), this.root.appendChild(this.bg)
                    }
                    hide() {
                        this.root.contains(this.bg) && this.root.removeChild(this.bg)
                    }
                    updateProgress(e) {
                        this.circle.style.animation = "", e = Math.max(e, 30), e = Math.min(e, 100);
                        e = this.circumference - e / 100 * this.circumference;
                        this.circle.style.strokeDashoffset = e
                    }
                    timeLeftMS() {
                        return Math.max(0, n["default"].SHOW_RATING_DURATION_MS + n["default"].SAMSUNG_SPLASH_DURATION_MS - ((new Date).getTime() - this.createdAt.getTime()))
                    }
                    destroy() {
                        this.hide()
                    }
                    onLogoShown() {}
                }
                t["default"] = c
            },
            "./src/ui/options/FoldReloader.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                });
                class r {
                    constructor() {
                        this.oldO = window.orientation, this.oldW = window.innerWidth, this.oldH = window.innerHeight, window.addEventListener("resize", () => {
                            window.setTimeout(() => {
                                var e = this.oldW !== window.innerWidth || this.oldH !== window.innerHeight,
                                    t = this.oldW / this.oldH == window.innerWidth / window.innerHeight;
                                this.oldW = window.innerWidth, this.oldH = window.innerHeight;
                                var r = this.oldO !== window.orientation;
                                this.oldO = window.orientation, !e || r || t || location.reload()
                            }, 500)
                        })
                    }
                }
                t["default"] = r
            },
            "./src/ui/texts.ts": (e, t) => {
                Object.defineProperty(t, "__esModule", {
                    value: !0
                }), t.wrapperLanguages = t.TEXTS = void 0, t.TEXTS = [], t.TEXTS.fr = {
                    play: "JOUER",
                    tos: "Conditions d'utilisation",
                    privacy: "Politique de confidentialité"
                }, t.TEXTS.de = {
                    play: "SPIELEN",
                    tos: "Geschäftsbedingungen",
                    privacy: "Datenschutzerklärung"
                }, t.TEXTS.en = {
                    play: "PLAY",
                    tos: "Terms & Conditions",
                    privacy: "Privacy Policy"
                }, t.TEXTS.es = {
                    play: "JUEGA",
                    tos: "Términos y condiciones",
                    privacy: "Política de privacidad"
                }, t.TEXTS.it = {
                    play: "GIOCA",
                    tos: "Termini e Condizioni",
                    privacy: "Informativa sulla privacy"
                }, t.TEXTS.pt = {
                    play: "JOGAR",
                    tos: "Termos e condições",
                    privacy: "Política de privacidade"
                }, t.TEXTS.ru = {
                    play: "Играть",
                    tos: "Условия",
                    privacy: "Политика конфиденциальн"
                }, t.TEXTS.tr = {
                    play: "OYNA",
                    tos: "Şart ve Koşullar",
                    privacy: "Gizlilik Politikası"
                }, t.TEXTS.nl = {
                    play: "SPEEL",
                    tos: "Voorwaarden",
                    privacy: "Privacybeleid"
                }, t.TEXTS.pl = {
                    play: "GRAJ",
                    tos: "Zasady i warunki",
                    privacy: "Polityka prywatności"
                }, t.TEXTS.hi = {
                    play: "खेलें",
                    tos: "Terms & Conditions",
                    privacy: "Privacy Policy"
                }, t.TEXTS.vi = {
                    play: "Chơi",
                    tos: "Điều khoản & Điều kiện",
                    privacy: "Chính sách Quyền riêng tư"
                }, t.TEXTS.th = {
                    play: "เล่น",
                    tos: "Terms & Conditions",
                    privacy: "Privacy Policy"
                }, t.TEXTS.ja = {
                    play: "プレイ",
                    tos: "利用規約",
                    privacy: "プライバシーポリシー"
                }, t.TEXTS.kr = {
                    play: "놀다",
                    tos: "이용 약관",
                    privacy: "개인정보 보호 정책"
                }, t.TEXTS.ar = {
                    play: "لعب",
                    tos: "Terms & Conditions",
                    privacy: "Privacy Policy"
                }, t.wrapperLanguages = ["en", "fr", "de", "es", "it", "pt", "ru", "tr", "nl", "pl", "hi", "vi", "th", "ja", "kr", "ar"]
            },
            "./node_modules/uuid/dist/esm-browser/index.js": (e, t, r) => {
                r.r(t), r.d(t, {
                    v1: () => s["default"],
                    v3: () => a["default"],
                    v4: () => n["default"],
                    v5: () => i["default"],
                    NIL: () => o["default"],
                    version: () => d["default"],
                    validate: () => l["default"],
                    stringify: () => c["default"],
                    parse: () => u["default"]
                });
                var s = r("./node_modules/uuid/dist/esm-browser/v1.js"),
                    a = r("./node_modules/uuid/dist/esm-browser/v3.js"),
                    n = r("./node_modules/uuid/dist/esm-browser/v4.js"),
                    i = r("./node_modules/uuid/dist/esm-browser/v5.js"),
                    o = r("./node_modules/uuid/dist/esm-browser/nil.js"),
                    d = r("./node_modules/uuid/dist/esm-browser/version.js"),
                    l = r("./node_modules/uuid/dist/esm-browser/validate.js"),
                    c = r("./node_modules/uuid/dist/esm-browser/stringify.js"),
                    u = r("./node_modules/uuid/dist/esm-browser/parse.js")
            },
            "./node_modules/uuid/dist/esm-browser/md5.js": (e, t, r) => {
                function u(e) {
                    return 14 + (e + 64 >>> 9 << 4) + 1
                }

                function f(e, t) {
                    var r = (65535 & e) + (65535 & t);
                    return (e >> 16) + (t >> 16) + (r >> 16) << 16 | 65535 & r
                }

                function o(e, t, r, s, a, n) {
                    return f((n = f(f(t, e), f(s, n))) << a | n >>> 32 - a, r)
                }

                function p(e, t, r, s, a, n, i) {
                    return o(t & r | ~t & s, e, t, a, n, i)
                }

                function g(e, t, r, s, a, n, i) {
                    return o(t & s | r & ~s, e, t, a, n, i)
                }

                function _(e, t, r, s, a, n, i) {
                    return o(t ^ r ^ s, e, t, a, n, i)
                }

                function m(e, t, r, s, a, n, i) {
                    return o(r ^ (t | ~s), e, t, a, n, i)
                }
                r.r(t), r.d(t, {
                    "default": () => s
                });
                const s = function(e) {
                    if ("string" == typeof e) {
                        var t = unescape(encodeURIComponent(e));
                        e = new Uint8Array(t.length);
                        for (var r = 0; r < t.length; ++r) e[r] = t.charCodeAt(r)
                    }
                    return function(e) {
                        for (var t = [], r = 32 * e.length, s = "0123456789abcdef", a = 0; a < r; a += 8) {
                            var n = e[a >> 5] >>> a % 32 & 255,
                                n = parseInt(s.charAt(n >>> 4 & 15) + s.charAt(15 & n), 16);
                            t.push(n)
                        }
                        return t
                    }(function(e, t) {
                        e[t >> 5] |= 128 << t % 32, e[u(t) - 1] = t;
                        for (var r = 1732584193, s = -271733879, a = -1732584194, n = 271733878, i = 0; i < e.length; i += 16) {
                            var o = r,
                                d = s,
                                l = a,
                                c = n;
                            r = p(r, s, a, n, e[i], 7, -680876936), n = p(n, r, s, a, e[i + 1], 12, -389564586), a = p(a, n, r, s, e[i + 2], 17, 606105819), s = p(s, a, n, r, e[i + 3], 22, -1044525330), r = p(r, s, a, n, e[i + 4], 7, -176418897), n = p(n, r, s, a, e[i + 5], 12, 1200080426), a = p(a, n, r, s, e[i + 6], 17, -1473231341), s = p(s, a, n, r, e[i + 7], 22, -45705983), r = p(r, s, a, n, e[i + 8], 7, 1770035416), n = p(n, r, s, a, e[i + 9], 12, -1958414417), a = p(a, n, r, s, e[i + 10], 17, -42063), s = p(s, a, n, r, e[i + 11], 22, -1990404162), r = p(r, s, a, n, e[i + 12], 7, 1804603682), n = p(n, r, s, a, e[i + 13], 12, -40341101), a = p(a, n, r, s, e[i + 14], 17, -1502002290), s = p(s, a, n, r, e[i + 15], 22, 1236535329), r = g(r, s, a, n, e[i + 1], 5, -165796510), n = g(n, r, s, a, e[i + 6], 9, -1069501632), a = g(a, n, r, s, e[i + 11], 14, 643717713), s = g(s, a, n, r, e[i], 20, -373897302), r = g(r, s, a, n, e[i + 5], 5, -701558691), n = g(n, r, s, a, e[i + 10], 9, 38016083), a = g(a, n, r, s, e[i + 15], 14, -660478335), s = g(s, a, n, r, e[i + 4], 20, -405537848), r = g(r, s, a, n, e[i + 9], 5, 568446438), n = g(n, r, s, a, e[i + 14], 9, -1019803690), a = g(a, n, r, s, e[i + 3], 14, -187363961), s = g(s, a, n, r, e[i + 8], 20, 1163531501), r = g(r, s, a, n, e[i + 13], 5, -1444681467), n = g(n, r, s, a, e[i + 2], 9, -51403784), a = g(a, n, r, s, e[i + 7], 14, 1735328473), s = g(s, a, n, r, e[i + 12], 20, -1926607734), r = _(r, s, a, n, e[i + 5], 4, -378558), n = _(n, r, s, a, e[i + 8], 11, -2022574463), a = _(a, n, r, s, e[i + 11], 16, 1839030562), s = _(s, a, n, r, e[i + 14], 23, -35309556), r = _(r, s, a, n, e[i + 1], 4, -1530992060), n = _(n, r, s, a, e[i + 4], 11, 1272893353), a = _(a, n, r, s, e[i + 7], 16, -155497632), s = _(s, a, n, r, e[i + 10], 23, -1094730640), r = _(r, s, a, n, e[i + 13], 4, 681279174), n = _(n, r, s, a, e[i], 11, -358537222), a = _(a, n, r, s, e[i + 3], 16, -722521979), s = _(s, a, n, r, e[i + 6], 23, 76029189), r = _(r, s, a, n, e[i + 9], 4, -640364487), n = _(n, r, s, a, e[i + 12], 11, -421815835), a = _(a, n, r, s, e[i + 15], 16, 530742520), s = _(s, a, n, r, e[i + 2], 23, -995338651), r = m(r, s, a, n, e[i], 6, -198630844), n = m(n, r, s, a, e[i + 7], 10, 1126891415), a = m(a, n, r, s, e[i + 14], 15, -1416354905), s = m(s, a, n, r, e[i + 5], 21, -57434055), r = m(r, s, a, n, e[i + 12], 6, 1700485571), n = m(n, r, s, a, e[i + 3], 10, -1894986606), a = m(a, n, r, s, e[i + 10], 15, -1051523), s = m(s, a, n, r, e[i + 1], 21, -2054922799), r = m(r, s, a, n, e[i + 8], 6, 1873313359), n = m(n, r, s, a, e[i + 15], 10, -30611744), a = m(a, n, r, s, e[i + 6], 15, -1560198380), s = m(s, a, n, r, e[i + 13], 21, 1309151649), r = m(r, s, a, n, e[i + 4], 6, -145523070), n = m(n, r, s, a, e[i + 11], 10, -1120210379), a = m(a, n, r, s, e[i + 2], 15, 718787259), s = m(s, a, n, r, e[i + 9], 21, -343485551), r = f(r, o), s = f(s, d), a = f(a, l), n = f(n, c)
                        }
                        return [r, s, a, n]
                    }(function(e) {
                        if (0 === e.length) return [];
                        for (var t = 8 * e.length, r = new Uint32Array(u(t)), s = 0; s < t; s += 8) r[s >> 5] |= (255 & e[s / 8]) << s % 32;
                        return r
                    }(e), 8 * e.length))
                }
            },
            "./node_modules/uuid/dist/esm-browser/nil.js": (e, t, r) => {
                r.r(t), r.d(t, {
                    "default": () => s
                });
                const s = "00000000-0000-0000-0000-000000000000"
            },
            "./node_modules/uuid/dist/esm-browser/parse.js": (e, t, r) => {
                r.r(t), r.d(t, {
                    "default": () => a
                });
                var s = r("./node_modules/uuid/dist/esm-browser/validate.js");
                const a = function(e) {
                    if (!(0, s["default"])(e)) throw TypeError("Invalid UUID");
                    var t, r = new Uint8Array(16);
                    return r[0] = (t = parseInt(e.slice(0, 8), 16)) >>> 24, r[1] = t >>> 16 & 255, r[2] = t >>> 8 & 255, r[3] = 255 & t, r[4] = (t = parseInt(e.slice(9, 13), 16)) >>> 8, r[5] = 255 & t, r[6] = (t = parseInt(e.slice(14, 18), 16)) >>> 8, r[7] = 255 & t, r[8] = (t = parseInt(e.slice(19, 23), 16)) >>> 8, r[9] = 255 & t, r[10] = (t = parseInt(e.slice(24, 36), 16)) / 1099511627776 & 255, r[11] = t / 4294967296 & 255, r[12] = t >>> 24 & 255, r[13] = t >>> 16 & 255, r[14] = t >>> 8 & 255, r[15] = 255 & t, r
                }
            },
            "./node_modules/uuid/dist/esm-browser/regex.js": (e, t, r) => {
                r.r(t), r.d(t, {
                    "default": () => s
                });
                const s = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i
            },
            "./node_modules/uuid/dist/esm-browser/rng.js": (e, t, r) => {
                var s;
                r.r(t), r.d(t, {
                    "default": () => function() {
                        if (!s && !(s = "undefined" != typeof crypto && crypto.getRandomValues && crypto.getRandomValues.bind(crypto) || "undefined" != typeof msCrypto && "function" == typeof msCrypto.getRandomValues && msCrypto.getRandomValues.bind(msCrypto))) throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
                        return s(a)
                    }
                });
                var a = new Uint8Array(16)
            },
            "./node_modules/uuid/dist/esm-browser/sha1.js": (e, t, r) => {
                function T(e, t) {
                    return e << t | e >>> 32 - t
                }
                r.r(t), r.d(t, {
                    "default": () => s
                });
                const s = function(e) {
                    var t = [1518500249, 1859775393, 2400959708, 3395469782],
                        r = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
                    if ("string" == typeof e) {
                        var s = unescape(encodeURIComponent(e));
                        e = [];
                        for (var a = 0; a < s.length; ++a) e.push(s.charCodeAt(a))
                    } else Array.isArray(e) || (e = Array.prototype.slice.call(e));
                    e.push(128);
                    for (var n = e.length / 4 + 2, i = Math.ceil(n / 16), o = new Array(i), d = 0; d < i; ++d) {
                        for (var l = new Uint32Array(16), c = 0; c < 16; ++c) l[c] = e[64 * d + 4 * c] << 24 | e[64 * d + 4 * c + 1] << 16 | e[64 * d + 4 * c + 2] << 8 | e[64 * d + 4 * c + 3];
                        o[d] = l
                    }
                    o[i - 1][14] = 8 * (e.length - 1) / Math.pow(2, 32), o[i - 1][14] = Math.floor(o[i - 1][14]), o[i - 1][15] = 8 * (e.length - 1) & 4294967295;
                    for (var u = 0; u < i; ++u) {
                        for (var f = new Uint32Array(80), p = 0; p < 16; ++p) f[p] = o[u][p];
                        for (var g = 16; g < 80; ++g) f[g] = T(f[g - 3] ^ f[g - 8] ^ f[g - 14] ^ f[g - 16], 1);
                        for (var _ = r[0], m = r[1], h = r[2], E = r[3], A = r[4], v = 0; v < 80; ++v) var S = Math.floor(v / 20),
                            S = T(_, 5) + function(e, t, r, s) {
                                switch (e) {
                                    case 0:
                                        return t & r ^ ~t & s;
                                    case 1:
                                        return t ^ r ^ s;
                                    case 2:
                                        return t & r ^ t & s ^ r & s;
                                    case 3:
                                        return t ^ r ^ s
                                }
                            }(S, m, h, E) + A + t[S] + f[v] >>> 0,
                            A = E,
                            E = h,
                            h = T(m, 30) >>> 0,
                            m = _,
                            _ = S;
                        r[0] = r[0] + _ >>> 0, r[1] = r[1] + m >>> 0, r[2] = r[2] + h >>> 0, r[3] = r[3] + E >>> 0, r[4] = r[4] + A >>> 0
                    }
                    return [r[0] >> 24 & 255, r[0] >> 16 & 255, r[0] >> 8 & 255, 255 & r[0], r[1] >> 24 & 255, r[1] >> 16 & 255, r[1] >> 8 & 255, 255 & r[1], r[2] >> 24 & 255, r[2] >> 16 & 255, r[2] >> 8 & 255, 255 & r[2], r[3] >> 24 & 255, r[3] >> 16 & 255, r[3] >> 8 & 255, 255 & r[3], r[4] >> 24 & 255, r[4] >> 16 & 255, r[4] >> 8 & 255, 255 & r[4]]
                }
            },
            "./node_modules/uuid/dist/esm-browser/stringify.js": (e, t, r) => {
                r.r(t), r.d(t, {
                    "default": () => i
                });
                for (var s = r("./node_modules/uuid/dist/esm-browser/validate.js"), a = [], n = 0; n < 256; ++n) a.push((n + 256).toString(16).substr(1));
                const i = function(e) {
                    var t = 1 < arguments.length && arguments[1] !== undefined ? arguments[1] : 0,
                        e = (a[e[t + 0]] + a[e[t + 1]] + a[e[t + 2]] + a[e[t + 3]] + "-" + a[e[t + 4]] + a[e[t + 5]] + "-" + a[e[t + 6]] + a[e[t + 7]] + "-" + a[e[t + 8]] + a[e[t + 9]] + "-" + a[e[t + 10]] + a[e[t + 11]] + a[e[t + 12]] + a[e[t + 13]] + a[e[t + 14]] + a[e[t + 15]]).toLowerCase();
                    if (!(0, s["default"])(e)) throw TypeError("Stringified UUID is invalid");
                    return e
                }
            },
            "./node_modules/uuid/dist/esm-browser/v1.js": (e, t, r) => {
                r.r(t), r.d(t, {
                    "default": () => s
                });
                var c, u, f = r("./node_modules/uuid/dist/esm-browser/rng.js"),
                    p = r("./node_modules/uuid/dist/esm-browser/stringify.js"),
                    g = 0,
                    _ = 0;
                const s = function(e, t, r) {
                    var s = t && r || 0,
                        a = t || new Array(16),
                        n = (e = e || {}).node || c,
                        i = e.clockseq !== undefined ? e.clockseq : u;
                    null != n && null != i || (d = e.random || (e.rng || f["default"])(), null == n && (n = c = [1 | d[0], d[1], d[2], d[3], d[4], d[5]]), null == i && (i = u = 16383 & (d[6] << 8 | d[7])));
                    var o = e.msecs !== undefined ? e.msecs : Date.now(),
                        r = e.nsecs !== undefined ? e.nsecs : _ + 1,
                        d = o - g + (r - _) / 1e4;
                    if (d < 0 && e.clockseq === undefined && (i = i + 1 & 16383), 1e4 <= (r = (d < 0 || g < o) && e.nsecs === undefined ? 0 : r)) throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
                    g = o, u = i, r = (1e4 * (268435455 & (o += 122192928e5)) + (_ = r)) % 4294967296, a[s++] = r >>> 24 & 255, a[s++] = r >>> 16 & 255, a[s++] = r >>> 8 & 255, a[s++] = 255 & r, o = o / 4294967296 * 1e4 & 268435455, a[s++] = o >>> 8 & 255, a[s++] = 255 & o, a[s++] = o >>> 24 & 15 | 16, a[s++] = o >>> 16 & 255, a[s++] = i >>> 8 | 128, a[s++] = 255 & i;
                    for (var l = 0; l < 6; ++l) a[s + l] = n[l];
                    return t || (0, p["default"])(a)
                }
            },
            "./node_modules/uuid/dist/esm-browser/v3.js": (e, t, r) => {
                r.r(t), r.d(t, {
                    "default": () => s
                });
                t = r("./node_modules/uuid/dist/esm-browser/v35.js"), r = r("./node_modules/uuid/dist/esm-browser/md5.js");
                const s = (0, t["default"])("v3", 48, r["default"])
            },
            "./node_modules/uuid/dist/esm-browser/v35.js": (e, t, r) => {
                r.r(t), r.d(t, {
                    DNS: () => s,
                    URL: () => a,
                    "default": () => function(e, i, o) {
                        function t(e, t, r, s) {
                            if ("string" == typeof e && (e = function(e) {
                                    e = unescape(encodeURIComponent(e));
                                    for (var t = [], r = 0; r < e.length; ++r) t.push(e.charCodeAt(r));
                                    return t
                                }(e)), 16 !== (t = "string" == typeof t ? (0, l["default"])(t) : t).length) throw TypeError("Namespace must be array-like (16 iterable integer values, 0-255)");
                            var a = new Uint8Array(16 + e.length);
                            if (a.set(t), a.set(e, t.length), (a = o(a))[6] = 15 & a[6] | i, a[8] = 63 & a[8] | 128, r) {
                                s = s || 0;
                                for (var n = 0; n < 16; ++n) r[s + n] = a[n];
                                return r
                            }
                            return (0, d["default"])(a)
                        }
                        try {
                            t.name = e
                        } catch (r) {}
                        return t.DNS = s, t.URL = a, t
                    }
                });
                var d = r("./node_modules/uuid/dist/esm-browser/stringify.js"),
                    l = r("./node_modules/uuid/dist/esm-browser/parse.js");
                var s = "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
                    a = "6ba7b811-9dad-11d1-80b4-00c04fd430c8"
            },
            "./node_modules/uuid/dist/esm-browser/v4.js": (e, t, r) => {
                r.r(t), r.d(t, {
                    "default": () => s
                });
                var n = r("./node_modules/uuid/dist/esm-browser/rng.js"),
                    i = r("./node_modules/uuid/dist/esm-browser/stringify.js");
                const s = function(e, t, r) {
                    var s = (e = e || {}).random || (e.rng || n["default"])();
                    if (s[6] = 15 & s[6] | 64, s[8] = 63 & s[8] | 128, t) {
                        r = r || 0;
                        for (var a = 0; a < 16; ++a) t[r + a] = s[a];
                        return t
                    }
                    return (0, i["default"])(s)
                }
            },
            "./node_modules/uuid/dist/esm-browser/v5.js": (e, t, r) => {
                r.r(t), r.d(t, {
                    "default": () => s
                });
                t = r("./node_modules/uuid/dist/esm-browser/v35.js"), r = r("./node_modules/uuid/dist/esm-browser/sha1.js");
                const s = (0, t["default"])("v5", 80, r["default"])
            },
            "./node_modules/uuid/dist/esm-browser/validate.js": (e, t, r) => {
                r.r(t), r.d(t, {
                    "default": () => a
                });
                var s = r("./node_modules/uuid/dist/esm-browser/regex.js");
                const a = function(e) {
                    return "string" == typeof e && s["default"].test(e)
                }
            },
            "./node_modules/uuid/dist/esm-browser/version.js": (e, t, r) => {
                r.r(t), r.d(t, {
                    "default": () => a
                });
                var s = r("./node_modules/uuid/dist/esm-browser/validate.js");
                const a = function(e) {
                    if (!(0, s["default"])(e)) throw TypeError("Invalid UUID");
                    return parseInt(e.substr(14, 1), 16)
                }
            }
        },
        __webpack_module_cache__ = {};

    function __webpack_require__(e) {
        var t = __webpack_module_cache__[e];
        if (t !== undefined) return t.exports;
        t = __webpack_module_cache__[e] = {
            exports: {}
        };
        return __webpack_modules__[e].call(t.exports, t, t.exports, __webpack_require__), t.exports
    }
    __webpack_require__.d = (e, t) => {
        for (var r in t) __webpack_require__.o(t, r) && !__webpack_require__.o(e, r) && Object.defineProperty(e, r, {
            enumerable: !0,
            get: t[r]
        })
    }, __webpack_require__.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), __webpack_require__.r = e => {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        })
    };
    var __webpack_exports__ = __webpack_require__("./src/index/indexazerion.ts")
})();