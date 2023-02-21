"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = exports.getApps = exports.AppModule = exports.AppClass = void 0;
const Injectable_1 = require("./Injectable");
const Module_1 = require("./Module");
const appsMap = new Map();
class AppClass {
    constructor(module, moduleOptions) {
        var _a, _b;
        this.module = module;
        this.moduleOptions = moduleOptions;
        this.name = this.moduleOptions.name;
        this.rootComponent = this.moduleOptions.component;
        this.childrenNames =
            ((_b = (_a = this.moduleOptions) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.map((child) => child.name)) ||
                [];
    }
    getChildrenModules() {
        return this.childrenNames
            .map((childName) => (0, Module_1.getModule)(childName))
            .filter((child) => !!child);
    }
    haRootComponent() {
        return !!this.rootComponent;
    }
    setRootComponent(rootComponent) {
        this.rootComponent = rootComponent;
    }
    setProviders(providers) {
        this.moduleOptions.providers = providers;
    }
    getProviders() {
        return this.moduleOptions.providers || [];
    }
    setProviderInstance(instanceName, providerInstance) {
        this[instanceName] = providerInstance;
    }
    getRootComponent() {
        return this.rootComponent || null;
    }
    renderRootComponent() {
        const Render = () => {
            return this.rootComponent
                ? this.rootComponent({
                    appName: this.name,
                    modules: this.getChildrenModules(),
                })
                : null;
        };
        return Render;
    }
}
exports.AppClass = AppClass;
function AppModule(moduleOptions) {
    return function (constructor) {
        console.log("Message from @AppModule");
        if (appsMap.has(moduleOptions.name)) {
            throw new Error(`App ${moduleOptions.name} already exists`);
        }
        const moduleClass = new AppClass(constructor, moduleOptions);
        const moduleInjects = (0, Injectable_1.getModuleInjects)(moduleClass.name);
        const providers = moduleClass.getProviders();
        moduleInjects.forEach((moduleInject) => {
            const provider = providers.find((provider) => {
                return provider.name === moduleInject.providerName;
            });
            if (provider && moduleInject.injected && moduleInject.instanceName) {
                moduleClass.setProviderInstance(moduleInject.instanceName, new provider());
            }
        });
        appsMap.set(moduleClass.name, moduleClass);
        console.log({
            moduleOptions,
            constructor,
            moduleClass,
            appsMap,
        });
    };
}
exports.AppModule = AppModule;
function getApps() {
    return Array.from(appsMap.values());
}
exports.getApps = getApps;
function createApp(appName) {
    const app = appsMap.get(appName);
    if (!app) {
        throw new Error(`App ${appName} not found`);
    }
    const Comp = app.renderRootComponent();
    return Comp;
}
exports.createApp = createApp;
//# sourceMappingURL=App.js.map