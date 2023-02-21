import { AppModuleOption, RootComponentProps } from ".";
import { ModuleClass } from "./Module";
import React from "react";
type AppUniqeName = string;
export declare class AppClass {
    private module;
    private moduleOptions;
    name: string;
    childrenNames: string[];
    rootComponent?: React.FC<RootComponentProps>;
    [key: string]: any;
    constructor(module: any, moduleOptions: AppModuleOption);
    getChildrenModules(): ModuleClass[];
    haRootComponent(): boolean;
    setRootComponent(rootComponent: React.FC<RootComponentProps>): void;
    setProviders(providers: any[]): void;
    getProviders(): any[];
    setProviderInstance(instanceName: string, providerInstance: any): void;
    getRootComponent(): React.FC<RootComponentProps> | null;
    renderRootComponent(): React.FC<any>;
}
export declare function AppModule(moduleOptions: AppModuleOption): <T extends new (...args: any[]) => {}>(constructor: T) => void;
export declare function getApps(): AppClass[];
export declare function createApp(appName: AppUniqeName): React.FC<any>;
export {};
