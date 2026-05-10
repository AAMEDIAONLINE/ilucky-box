import {
    translateElements
} from "./shared-QTME7OCH.js";
import {
    loadFallbackTranslation
} from "./shared-S7PVGXSP.js";
import "./shared-PQWVR7YF.js";
import "./shared-IZBMCQM6.js";
var _a, _b;
translateElements(loadFallbackTranslation, {
    you_have_10_seconds_tap_to_earn: {
        macros: "{prize}",
        macrosValue: (window.__PRIZE__ || (APP_CONFIG && APP_CONFIG.prize) || "$1,000")
    },
    you_have_10_seconds: {
        macros: "{seconds}",
        macrosValue: ((_b = APP_CONFIG.secondsLeftBeforeFinal) == null ? void 0 : _b.toString()) || "10"
    }
});