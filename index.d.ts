/// <reference types="react" />
import { ModuleClass } from "./Module";
export declare function sparkApp(rootModule: new (...args: any[]) => any): any;
export interface RootComponentProps {
    modules: ModuleClass[];
    appName: string;
}
export interface AppModuleOption {
    name: string;
    component?: React.FC<RootComponentProps>;
    children?: (new (...args: any[]) => {})[];
    providers?: any[];
    imports?: any[];
    exports?: any[];
}
export interface ModuleOptions {
    imports?: any[];
    component?: React.ComponentType<any>;
    children?: ((...args: any[]) => {})[];
    parent?: () => (new (...args: any[]) => {});
    declarations?: any[];
    providers?: any[];
    exports?: any[];
}
export type Constructor<T> = new (...args: any[]) => T;
export type RegisteredModule = ModuleClass & {
    renderComponent?: () => JSX.Element;
    moduleOptions?: ModuleOptions;
};
