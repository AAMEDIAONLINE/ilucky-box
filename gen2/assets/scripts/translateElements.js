import {
    translateElements
} from "./shared-MKZKYCN6.js";
import {
    loadFallbackTranslation
} from "./shared-S7PVGXSP.js";
import "./shared-CHHIAVRV.js";
import "./shared-CRXPGHIL.js";
var _a, _b;
translateElements(loadFallbackTranslation, {
    you_have_10_seconds_tap_to_earn: {
        macros: "{seconds}",
        macrosValue: ((_a = APP_CONFIG.secondsLeftBeforeFinal) == null ? void 0 : _a.toString()) || "10"
    },
    you_have_10_seconds: {
        macros: "{seconds}",
        macrosValue: ((_b = APP_CONFIG.secondsLeftBeforeFinal) == null ? void 0 : _b.toString()) || "10"
    }
});