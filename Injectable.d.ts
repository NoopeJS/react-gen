import { Constructor } from ".";
type TargetModuleReference = {
    injectName: string;
    providerName: string;
    moduleName: string;
    instanceName?: string;
    injected?: boolean;
};
export declare function Injectable(targetModuleNames: string[], injectName?: string): <T extends Constructor<any>>(constructor: T) => T;
export declare function Inject(injectName: string): (target: any, propertyKey: string, parameterIndex: number) => void;
export declare function getModuleInjects(moduleName: string): TargetModuleReference[];
export {};
