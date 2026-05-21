import {
    makeExit
} from "./shared-556YH2DY.js";
import {
    parseConfig
} from "./shared-Z2LCVCAH.js";
import "./shared-ZTPKMWA6.js";
import "./shared-CRXPGHIL.js";
var config = parseConfig(APP_CONFIG);
if (config) {
    document.addEventListener("click", () => {
        makeExit(config, "mainExit");
    });
}