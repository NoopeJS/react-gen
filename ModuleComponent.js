"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleComponentJSX = exports.View = exports.getModuleComponent = exports.ModuleComponent = void 0;
const componentsMap = new Map();
// export class ModuleComponentClass {
//   module: ModuleClass;
//   name: string;
//   constructor(private moduleName: string, private componentName: string) {
//     const module = getModule(this.moduleName);
//     if (!module) {
//       throw new Error(`Module ${this.moduleName} not registered`);
//     }
//     if (module.hasModuleComponent()) {
//       throw new Error(
//         `Module ${this.moduleName} already has a module component`
//       );
//     }
//     this.module = module;
//     this.name = this.componentName;
//   }
// }
function ModuleComponent(moduleName) {
    return function (constructor) {
        // const moduleComponent = new ModuleComponentClass(
        //   moduleName,
        //   constructor.name
        // );
        // moduleComponent.module.setModuleComponent(moduleComponent);
        componentsMap.set(moduleName, {
            name: constructor.name,
            component: constructor,
            viewed: false,
        });
    };
}
exports.ModuleComponent = ModuleComponent;
function getModuleComponent(moduleName) {
    return componentsMap.get(moduleName);
}
exports.getModuleComponent = getModuleComponent;
function View() {
    return function (target, propertyKey, parameterIndex) {
        console.log("Message from @View");
        const paramName = getArgumentName({ class: target, index: parameterIndex });
        if (!paramName) {
            throw new Error(`View decorator can only be used on a constructor parameter`);
        }
        const component = componentsMap.get(target.name);
        if (!component) {
            throw new Error(`Component for module ${target.name} not registered`);
        }
        if (component.viewed) {
            throw new Error(`Component for module ${target.name} already viewed`);
        }
        component.viewed = true;
        component.instanceName = paramName;
        componentsMap.set(target.name, component);
    };
}
exports.View = View;
function ModuleComponentJSX(moduleName, component) {
    return ModuleComponent(moduleName)(component);
}
exports.ModuleComponentJSX = ModuleComponentJSX;
function getArgumentName({ class: target, index, }) {
    var _a, _b, _c, _d, _e, _f;
    return (_f = (_e = (_d = (_c = (_b = (_a = target
        .toString()
        .match(/\w+\((.*)\)/)[1]) === null || _a === void 0 ? void 0 : _a.split(",")) === null || _b === void 0 ? void 0 : _b[index]) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.split(" ")) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.trim();
}
//# sourceMappingURL=ModuleComponent.js.map