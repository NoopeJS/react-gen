"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getModuleInjects = exports.Inject = exports.Injectable = void 0;
const injectsMap = new Map();
function Injectable(targetModuleNames, injectName) {
    return function (constructor) {
        console.log("Message from @Injectable");
        injectsMap.set(injectName || constructor.name, targetModuleNames.map((targetModuleName) => ({
            injectName: injectName || constructor.name,
            providerName: constructor.name,
            moduleName: targetModuleName,
            injected: false,
        })));
        return constructor;
    };
}
exports.Injectable = Injectable;
function Inject(injectName) {
    return function (target, propertyKey, parameterIndex) {
        console.log("Message from @Inject");
        const paramName = getArgumentName({
            class: target,
            index: parameterIndex,
        });
        console.log({
            target,
            propertyKey,
            parameterIndex,
            moduleName: target.name,
            paramName,
        });
        const targetModuleRefs = injectsMap.get(injectName);
        if (!targetModuleRefs || !targetModuleRefs.length) {
            throw new Error(`Inject ${injectName} does not have any target module reference`);
        }
        const targetModuleRef = targetModuleRefs.find((targetModuleRef) => targetModuleRef.moduleName === target.name);
        if (!targetModuleRef) {
            throw new Error(`Inject ${injectName} is not registered for module ${target.name}`);
        }
        if (targetModuleRef.injected) {
            throw new Error(`Inject ${injectName} is already injected to module ${target.name}`);
        }
        targetModuleRef.injected = true;
        injectsMap.set(injectName, targetModuleRefs.map((ref) => {
            if (ref.moduleName === target.name) {
                return Object.assign(Object.assign({}, ref), { instanceName: paramName, injected: true });
            }
            return ref;
        }));
    };
}
exports.Inject = Inject;
function getModuleInjects(moduleName) {
    return Array.from(injectsMap.values()).reduce((acc, targetModuleRefs) => acc.concat(targetModuleRefs.filter((targetModuleRef) => targetModuleRef.moduleName === moduleName)), []);
}
exports.getModuleInjects = getModuleInjects;
function getArgumentName({ class: target, index, }) {
    var _a, _b, _c, _d, _e, _f;
    return (_f = (_e = (_d = (_c = (_b = (_a = target
        .toString()
        .match(/\w+\((.*)\)/)[1]) === null || _a === void 0 ? void 0 : _a.split(",")) === null || _b === void 0 ? void 0 : _b[index]) === null || _c === void 0 ? void 0 : _c.trim()) === null || _d === void 0 ? void 0 : _d.split(" ")) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.trim();
}
//# sourceMappingURL=Injectable.js.map