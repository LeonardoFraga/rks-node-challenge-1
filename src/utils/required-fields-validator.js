export function hasBodyRequiredFields(request) {

    if('title' in request.body || 'description' in request.body) {
        return true;
    }

    return false;
}