/// <reference types="react" />
export type ModuleComponentClass = {
    name: string;
    component: (props: {
        message: string;
    }) => JSX.Element;
    viewed: boolean;
    instanceName?: string;
};
export declare function ModuleComponent(moduleName: string): <T extends (...args: any[]) => any>(constructor: T) => void;
export declare function getModuleComponent(moduleName: string): ModuleComponentClass | undefined;
export declare function View(): (target: any, propertyKey: string, parameterIndex: number) => void;
export declare function ModuleComponentJSX(moduleName: string, component: React.FC<any>): void;
