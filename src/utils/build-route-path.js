export function buildRoutePath(route) {
    const routeParametersRegex = /:([a-zA-Z]+)/g;
    const pathWithParams = route.replace(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)');

    const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

    return pathRegex;
}