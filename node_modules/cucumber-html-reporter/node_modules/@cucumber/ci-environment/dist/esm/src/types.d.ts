export declare type CiEnvironment = {
    name: string;
    url: string;
    buildNumber?: string;
    git?: Git;
};
export declare type Git = {
    remote: string;
    revision: string;
    branch?: string;
    tag?: string;
};
export declare type CiEnvironments = {
    ciEnvironments: readonly CiEnvironment[];
};
export declare type Env = Record<string, string | undefined>;
//# sourceMappingURL=types.d.ts.map