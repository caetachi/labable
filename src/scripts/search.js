import { getWashableItems } from "./get";

export default async function searchWashableItems(params = '') {
    let washableItems = await getWashableItems();
    washableItems = washableItems.filter(([key]) => key !== 'washables_counter');
    if (params && params.trim() !== '') {
        const lowerCaseParams = params.toLowerCase();
        washableItems = washableItems.filter(([, value]) => {
            return (value?.washable_item_name || '').toLowerCase().includes(lowerCaseParams);
        });
    }
    return washableItems;
}
