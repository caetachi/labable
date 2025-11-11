function formatTextualDateTime(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleString('en-PH', options);
}

function formatTextualDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH', options);
}

function formatLocaleDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PH');
}

function formatDMYTime(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    let hours = date.getHours();
    const meridian = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    if (hours === 0) hours = 12;
    const hh = String(hours).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year}, ${hh}:${mm}:${ss} ${meridian}`;
}

export { formatTextualDateTime, formatTextualDate, formatLocaleDate, formatDMYTime };