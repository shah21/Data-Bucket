

export function toCamelCase(str:string)  {
    return str
        .replace(/\s(.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/\s/g, '')
        .replace(/^(.)/, function($1) { return $1.toLowerCase(); });
}