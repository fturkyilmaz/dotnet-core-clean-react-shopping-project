export function toCamelCase(str: string): string {
    return str.replaceAll(/['"]/g, '')
        .toLowerCase()
        .replaceAll(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
}