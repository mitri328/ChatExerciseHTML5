
export function ConvertDate(dateString){
    let dateObj = new Date(dateString);
    return dateObj.toLocaleString('fr-CH', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        weekday: 'long'
    })

}


