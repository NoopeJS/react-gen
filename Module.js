"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = exports.getModule = exports.ModuleClass = void 0;
const Injectable_1 = require("./Injectable");
const ModuleComponent_1 = require("./ModuleComponent");
const modulesMap = new Map();
class ModuleClass {
    constructor(module, moduleOptions) {
        var _a, _b;
        this.module = module;
        this.moduleOptions = moduleOptions;
        this.name = this.module.name;
        this.childrenNames =
            ((_b = (_a = this.moduleOptions) === null || _a === void 0 ? void 0 : _a.children) === null || _b === void 0 ? void 0 : _b.map((child) => child.name)) || [];
    }
    getModuleOptions() {
        return this.moduleOptions;
    }
    getParent() {
        return this.moduleOptions.parent && this.moduleOptions.parent();
    }
    hasModuleComponent() {
        return !!this.moduleComponent;
    }
    setModuleComponent(moduleComponent) {
        if (this.moduleOptions.component &&
            this.moduleOptions.component.name !== moduleComponent.name) {
            throw new Error(`Module component ${moduleComponent.name} is not registered for module ${this.name}`);
        }
        this.moduleComponent = moduleComponent;
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
    renderComponent() {
        var _a;
        if (this.module.prototype.renderComponent) {
            return this.module.prototype.renderComponent.bind(this)();
        }
        return ((_a = this.moduleComponent) === null || _a === void 0 ? void 0 : _a.component({})) || null;
    }
    getChildrenModules() {
        return this.childrenNames
            .map((childName) => getModule(childName))
            .filter((child) => !!child);
    }
}
exports.ModuleClass = ModuleClass;
function getModule(moduleName) {
    return modulesMap.get(moduleName);
}
exports.getModule = getModule;
function Module(moduleOptions) {
    return function (constructor) {
        console.log("Message from @Module");
        const moduleClass = new ModuleClass(constructor, moduleOptions);
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
        modulesMap.set(moduleClass.name, moduleClass);
        const moduleComponent = (0, ModuleComponent_1.getModuleComponent)(moduleClass.name);
        if (moduleComponent &&
            moduleComponent.viewed &&
            moduleComponent.instanceName) {
            moduleClass.setModuleComponent(moduleComponent);
            moduleClass.setProviderInstance(moduleComponent.instanceName, moduleComponent.component);
        }
        modulesMap.set(moduleClass.name, moduleClass);
        console.log({
            moduleOptions,
            constructor,
            moduleClass,
            modulesMap,
        });
    };
}
exports.Module = Module;
//# sourceMappingURL=Module.js.map