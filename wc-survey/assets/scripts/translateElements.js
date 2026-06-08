import {
    translateElements
} from "./shared-EIOQECB3.js";
import "./shared-CRXPGHIL.js";
var loadFallbackTranslation = async () => {
    return await import("./shared-XGLWI5K5.js").then((m) => m.default);
};
translateElements(loadFallbackTranslation, {
    install_app_and_continue_watching: {
        macros: "{app_name}",
        macrosValue: APP_CONFIG.appName,
        fallbackTranslationKey: "our_app"
    }
});