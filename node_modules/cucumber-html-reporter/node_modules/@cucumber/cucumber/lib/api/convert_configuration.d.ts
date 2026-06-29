/// <reference types="node" />
import { IConfiguration } from '../configuration';
import { IRunConfiguration } from './types';
export declare function convertConfiguration(flatConfiguration: IConfiguration, env: NodeJS.ProcessEnv): Promise<IRunConfiguration>;
