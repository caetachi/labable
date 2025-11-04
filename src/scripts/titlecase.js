export default function titlecase(text) {
    return text.toLowerCase().replace(/\b\w/g, h => h.toUpperCase());
}