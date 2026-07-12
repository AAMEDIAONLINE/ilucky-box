import {
    makeExit
} from "./shared-3J2QBOX6.js";
import {
    parseConfig
} from "./shared-PQUHJFH3.js";
import "./shared-I6IP22C7.js";
import "./shared-TMCNPBCK.js";
import "./shared-5YO44CBQ.js";
var CURRENT_QUESTION_KEY = "step";

function removeUrlParameter(paramKey) {
    const url = window.location.href;
    const r = new URL(url);
    r.searchParams.delete(paramKey);
    const newUrl = r.href;
    window.history.replaceState(window.history.state, "", newUrl);
}
var getCurrentStepFromURL = (key = CURRENT_QUESTION_KEY, shouldDeleteKey = true) => {
    const url = new URL(window.location.href);
    const step = url.searchParams.get(key);
    if (shouldDeleteKey) removeUrlParameter(key);
    return step;
};
var tabUnderClick = async (config2, newTabParamValue, key = CURRENT_QUESTION_KEY) => {
    const newTab = new URL(window.location.href);
    newTab.searchParams.set(key, newTabParamValue.toString());
    makeExit({
            ...config2,
            tabUnderClick: {
                ...config2.tabUnderClick,
                newTab: {
                    url: newTab.toString()
                }
            }
        },
        "tabUnderClick"
    );
};
var deleteModal = () => {
    const modal = document.querySelector("#modal");
    const overlay = document.querySelector("#overlay");
    modal == null ? void 0 : modal.remove();
    overlay == null ? void 0 : overlay.remove();
};
var config = parseConfig();
var isSecondStep = getCurrentStepFromURL() === "1";
var _a;
var isTabUnderExists = !!((_a = config.tabUnderClick) == null ? void 0 : _a.currentTab);
if (isSecondStep && isTabUnderExists) {
    deleteModal();
    document.addEventListener("DesignContentLoaded", deleteModal);
}
document.addEventListener("click", () => {
    if (isSecondStep || !isTabUnderExists) {
        makeExit(config, "mainExit");
        return;
    }
    tabUnderClick(config, "1");
});