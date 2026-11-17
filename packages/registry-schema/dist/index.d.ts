export interface TechnologyDomain {
    id: string;
    number: number;
    name: string;
    description?: string;
}
export interface HiddenStackLayer {
    layer: string;
    purpose: string;
    local_implementation: string;
    cloud_implementation: string;
}
export interface TechnologyEntry {
    id: string;
    name: string;
    type: string;
    domain_id: string;
    language: string;
    dependencies?: string[];
    documentation_url?: string;
    version?: string;
    license: string;
    runtime: string;
    security_status: 'verified' | 'experimental' | 'deprecated' | string;
    alternatives?: string[];
    integrations?: string[];
    package_source?: string;
    hub_module?: string;
}
export interface UniversalTechnologyRegistry {
    version: string;
    sources?: string[];
    domains: TechnologyDomain[];
    hidden_stack: HiddenStackLayer[];
    technologies: TechnologyEntry[];
}
