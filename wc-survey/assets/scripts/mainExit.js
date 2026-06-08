import {
    makeExit
} from "./shared-556YH2DY.js";
import {
    parseConfig
} from "./shared-Z2LCVCAH.js";
import "./shared-ZTPKMWA6.js";
import "./shared-CRXPGHIL.js";
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
    newTab.searchParams.append(key, newTabParamValue.toString());
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
var config = parseConfig(APP_CONFIG);
var _a;
if (config) {
    const isSecondStep = getCurrentStepFromURL() === "1";
    const isTabUnderExists = !!((_a = config.tabUnderClick) == null ? void 0 : _a.currentTab);
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
}