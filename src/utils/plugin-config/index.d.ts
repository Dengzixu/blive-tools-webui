declare function encodeConfig(configObject: Object, urlSafe = true): string

declare function decodeConfig(configString: string): Object

declare function decodeURLConfig(urlConfigString: string): Object

export { encodeConfig, decodeConfig, decodeURLConfig }
