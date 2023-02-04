const formatLeadingZeroNumber = (nr) => {
    return nr < 10 ? `0${nr}` : nr;
}

export function human_readable_date(date){
    const d = new Date(date);
    const year = d.getFullYear();
    const month = formatLeadingZeroNumber(d.getMonth());
    const day = formatLeadingZeroNumber(d.getDate());
    const hours = formatLeadingZeroNumber(d.getHours());
    const minutes = formatLeadingZeroNumber(d.getMinutes());
    const seconds = formatLeadingZeroNumber(d.getSeconds());
    const text = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return text;
}

export function get_age_from_birthday(birthday){
    const birthday_timestamp = new Date(birthday).getTime();
    const current_date = new Date().getTime();
    const difference = current_date - birthday_timestamp;
    return Math.floor(difference / 31557600000);
}