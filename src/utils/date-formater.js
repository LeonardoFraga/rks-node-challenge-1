export function formatDate(date) {
    return date.toISOString().
    replace(/T/, ' ').      
    replace(/\..+/, '')
}