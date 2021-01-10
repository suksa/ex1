export const gtag_advList = ({ lists, ad = {} }) => {
    const gtagItems = lists.map((v, i) => {
        return gtag_getItemObj(
            `${v.item_id}_${v.idx_b_manager}`,
            v.full_item_name,
            `${ad.code_ad}_${ad.nm_ad}`,
            `${v.maker_id}_${v.maker_name}`,
            combineCategory(v.category),
            '',
            v.num,
            1,
            v.price,
        )
    })
    gtag_push('view_item_list', gtagItems)
}
export const gtag_advListClick = ({ item, ad = {} }) => {
    const gtagItem = [
        gtag_getItemObj(
            `${item.item_id}_${item.idx_b_manager}`,
            item.full_item_name,
            `${ad.code_ad}_${ad.nm_ad}`,
            `${item.maker_id}_${item.maker_name}`,
            combineCategory(item.category),
            '',
            item.num,
            1,
            item.price,
        )
    ]
    gtag_push('select_content', gtagItem)
}
export const gtag_CurationList = ({ lists, ad = {} }) => {
    const gtagItems = lists.map((v, i) => {

        return gtag_getItemObj(
            `${v.item_id}_${ad.pr_idx}`,
            v.full_item_name,
            `${ad.code_ad}_${ad.nm_ad}`,
            `${v.maker_id}_${v.maker_name}`,
            combineCategory(v.category),
            '',
            v.num,
            1,
            v.price,
        )
    })
    gtag_push('view_item_list', gtagItems)
}
export const gtag_CurationListClick = ({ item, ad = {}, list_position }) => {
    const gtagItem = [
        gtag_getItemObj(
            `${item.item_id}_${ad.pr_idx}`,
            item.full_item_name,
            `${ad.code_ad}_${ad.nm_ad}`,
            `${item.maker_id}_${item.maker_name}`,
            combineCategory(item.category),
            '',
            list_position,
            1,
            item.price,
        )
    ]
    gtag_push('select_content', gtagItem)
}
export const gtag_itemList = ({ lists, list_name }) => {
    const gtagItems = lists.map((v, i) => {
        return gtag_getItemObj(
            `${v.item_id}`,
            v.full_item_name,
            list_name,
            `${v.maker_id}_${v.maker_name}`,
            combineCategory(v.category),
            '',
            v.num,
            1,
            v.price,
        )
    })
    gtag_push('view_item_list', gtagItems)
}
export const gtag_itemListClick = ({ item, list_name }) => {
    const gtagItem = [
        gtag_getItemObj(
            `${item.item_id}`,
            item.full_item_name,
            list_name,
            `${item.maker_id}_${item.maker_name}`,
            combineCategory(item.category),
            '',
            item.num,
            1,
            item.price,
        )
    ]
    console.log(gtagItem)
    gtag_push('select_content', gtagItem)
}
const gtag_getItemObj = (id, name, list_name, brand, category, variant, list_position, quantity, price) => {
    const obj = { id, name, list_name, brand, category, variant, list_position, quantity, price }
    return obj
}

const gtag_push = (eventName = '', itemData) => {
    let gtagContent = {}

    if (eventName === 'select_content') {
        gtagContent.content_type = 'product'
    }
    gtagContent.items = itemData
    window.gtag('event', eventName, gtagContent)
}

const combineCategory = (category) => {
    return category.map(cate => `${cate.cate_id}_${cate.cate_name.replace(/\//g, '·')}`).join('/')
}
