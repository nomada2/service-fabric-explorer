//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
// Licensed under the MIT License. See License file under the project root for license information.
//-----------------------------------------------------------------------------

// *** Dependency Injection Extensions ***

import error from "./errorUtil";
import "./utils";
import { IDiDescriptor } from "./di";

export interface TypeConstructor {
    new (...args: Array<any>): any;
}

export namespace DiDescriptorConstructor {
    export function dedication(typeConstructor: TypeConstructor, injects: Array<string>): IDiDescriptor {
        if (!Function.isFunction(typeConstructor)) {
            throw error("typeConstructor must be a function.");
        }

        if (Array.isNullUndefinedOrEmpty(injects)) {
            injects = undefined;
        } else if (!Array.isArray(injects)) {
            throw error("inject must be an array of string.");
        } else {
            for (let injectIndex = 0; injectIndex < injects.length; injectIndex++) {
                const inject = injects[injectIndex];

                if (String.isNullUndefinedOrWhitespace(inject)) {
                    injects[injectIndex] = undefined;
                } else if (!String.isString(inject)) {
                    throw error("Inject identity must be a string.");
                }
            }
        }

        return (container, ...extraArgs) => {
            const args = new Array<any>();

            if (injects !== undefined) {
                for (let injectIndex = 0; injectIndex < injects.length; injectIndex++) {
                    const inject = injects[injectIndex];

                    if (inject !== undefined) {
                        const arg = container.getInstance(inject);

                        if (arg === undefined) {
                            throw error("Required inject is not available in the container.");
                        }

                        args.push(arg);
                    } else {
                        args.push(null);
                    }
                }
            }

            if (Array.isArray(extraArgs) && extraArgs.length > 0) {
                for (let extraArgIndex = 0; extraArgIndex < extraArgs.length; extraArgIndex++) {
                    args.push(extraArgs[extraArgIndex]);
                }
            }

            return new typeConstructor(...args);
        };
    }

    export function singleton(instance: any): IDiDescriptor {
        return (container) => instance;
    }

    export function lazySingleton(typeConstructor: TypeConstructor, injects: Array<string>): IDiDescriptor {
        let descriptor = dedication(typeConstructor, injects);
        let singleton: any = undefined;

        return (container, ...extraArgs) => {
            if (singleton === undefined) {
                singleton = descriptor(container, ...extraArgs);
                descriptor = undefined;
            }

            return singleton;
        };
    }
}
