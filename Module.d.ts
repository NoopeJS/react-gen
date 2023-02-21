/// <reference types="react" />
import { ModuleOptions } from ".";
import { ModuleComponentClass } from "./ModuleComponent";
export declare class ModuleClass {
    private module;
    private moduleOptions;
    private moduleComponent?;
    name: string;
    childrenNames: string[];
    [key: string]: any;
    constructor(module: any, moduleOptions: ModuleOptions);
    getModuleOptions(): ModuleOptions;
    getParent(): new (...args: any[]) => {};
    hasModuleComponent(): boolean;
    setModuleComponent(moduleComponent: ModuleComponentClass): void;
    setProviders(providers: any[]): void;
    getProviders(): any[];
    setProviderInstance(instanceName: string, providerInstance: any): void;
    renderComponent(): JSX.Element | null;
    getChildrenModules(): ModuleClass[];
}
export declare function getModule(moduleName: string): ModuleClass | undefined;
export declare function Module(moduleOptions: ModuleOptions): <T extends new (...args: any[]) => {}>(constructor: T) => void;
