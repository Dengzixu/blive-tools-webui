import {Base64} from "js-base64";
import {deflate, inflate} from "pako";

export const encodeConfig = (configObject: Object, urlSafe = true): string => {
    const deflatedArray: Uint8Array = deflate(JSON.stringify(configObject));
    return Base64.fromUint8Array(deflatedArray, urlSafe)
}

export const decodeConfig = (configString: string): Object => {

    const decodeArray = Base64.toUint8Array(configString)

    const decodeConfigString = inflate(decodeArray, {to: 'string'})

    return JSON.parse(decodeConfigString)
}


export const decodeURLConfig = (urlConfigString: string): Object => {
    try {
        const url = new URL(urlConfigString);

        const configParam = new URLSearchParams(url.search).get('config');

        return decodeConfig(configParam)
    } catch (e) {
        if (e instanceof SyntaxError) {
            throw new Error('Config decode failed.')
        } else if (e instanceof TypeError) {
            throw new Error('URL format error.')
        }
    }
}
