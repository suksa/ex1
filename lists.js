import React, { useState, useEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import {
    initialState, ADV_LIST_REQUEST, CURATION_REQUEST, HOT_EVENT_REQUEST, ITEM_LIST_REQUEST, SET_ROUTE
} from 'reducers/initial'
import { usePrevious } from 'utils/usePrevious'
import { gtag_advList, gtag_advListClick, gtag_itemList, gtag_itemListClick } from 'libs/gtag'
import Item from './item'
import ListCuration from './list_curation'
import ListEvent from './list_event'
import ListAdvStick from './list_advstick'
import ItemLine from './item_line'

const Lists = () => {
    const { domain, selectCategory, route, selectedFilters, minishopInfo, loading, initRoute, selectedFilterNum } = useSelector(state => state.initial)
    const [moreAdvList, setmoreAdvList] = useState(false)
    const lists = useSelector(state => state.initial.lists)
    const { maker, spec, min, max, kwd } = selectedFilters
    const isEvent = selectedFilterNum === 0 && lists.itemList?.items?.length > (route.types === 'list' ? 10 : 9) && lists.event.length > 0
    const isAdvStick = selectedFilterNum === 0 && lists.itemList?.items?.length > (route.types === 'list' ? 20 : 18)
    const idx_b_manager = minishopInfo?.idx_b_manager || 1
    const [view, setView] = useState({
        list2: false,
        list3: false,
    })
    const maxAdvListLength = 3

    const list1 = useRef(null)
    const list2 = useRef(null)
    const list3 = useRef(null)

    const dispatch = useDispatch()
    const history = useHistory()

    const prevInitRoute = usePrevious(initRoute)
    const prevSelectCategory = usePrevious(selectCategory)

    useEffect(() => { // 카테고리 변경시 광고 다시불러옴
        fetchAdvList(selectCategory, idx_b_manager, domain)  // 애드리스트
        fetchHotEvent(selectCategory) // 핫이벤트
        fetchCuration(selectCategory, idx_b_manager, domain) // 큐레이션
    }, [selectCategory]) // eslint-disable-line

    useEffect(() => { // 라우트 || 셀렉트카테고리 변경시 상품리스트 가져옴, view 초기화
        if (domain === 'minishop' && !minishopInfo) return

        setView({list2: false, list3: false})

        const sort = { rank: 1, date: 2, price_desc: 3, price_asc: 4, abc: 5, mall: 6, review: 7 }
        const option = {
            idx_b_manager,
            cate_id: selectCategory,
            offset: (route.page - 1) * route.size,
            limit: route.page * route.size,
            sort: sort[route.sort],
            type: 'cash',
            fields: 'stdpc,maker,hotdeal,event',
            // spec
            maker: maker.map(v => v.maker_id).join(','),
            spec: setSpec(spec),
            min: min,
            max: max,
            keyword: kwd,
        }
        fetchItemList(option)

        // route
        if (route.tab !== 'total') { // tab이 리스트관련 이어야함
            dispatch({
                type: SET_ROUTE,
                data: { tab: 'total' }
            })
            return
        }
        if (selectCategory !== prevSelectCategory) return // 카테고리가 달라지면 실행안함
        if (
            route.pageType === initialState.route.pageType &&
            route.tab === initialState.route.tab &&
            route.types === initialState.route.types &&
            route.page === initialState.route.page &&
            route.sort === initialState.route.sort &&
            route.size === initialState.route.size &&
            route.srch_cond === initialState.route.srch_cond
        ) {
            history.push(`${domain === 'minishop' ? `/${minishopInfo.mall_web_user}` : ''}/list/${selectCategory}`)
            return
        }
        history.push(`${domain === 'minishop' ? `/${minishopInfo.mall_web_user}` : ''}/list/${selectCategory}/srch/total/${route.types}/${route.page}/${route.sort}/${route.size}/${route.srch_cond}`)
    }, [selectCategory, minishopInfo, route.pageType, route.tab, route.page, route.sort, route.size, route.srch_cond]) // eslint-disable-line

    useEffect(() => { // 해당 옵션 변경시 page 1 로
        if (!prevInitRoute) return // 첫 로딩시엔 변경안함
        if (route.page === '1') return
        dispatch({
            type: SET_ROUTE,
            data: { page: '1' }
        })
    }, [route.pageType, route.types, route.sort, route.size, route.srch_cond]) // eslint-disable-line

    useEffect(() => { // 검색조건 변경시 srch_cond 변경
        if (!prevInitRoute) { // 첫 로딩시엔 변경안함
            return
        }

        let isSpec = false
        Object.keys(spec).forEach(v => {
            spec[v].forEach(() => {
                isSpec = true
                return
            })
        })
        if (
            maker.length === 0 &&
            !isSpec &&
            min === 0 &&
            max === 0 &&
            kwd === ''
        ) {
            dispatch({
                type: SET_ROUTE,
                data: { srch_cond: null }
            })
            return
        }
        const data = {
            maker: maker.map(v => v.maker_id).join(','),
            spec: setPrettySpec(spec),
            min: min,
            max: max,
            keyword: kwd,
        }

        Object.keys(data).forEach(v => {
            if (!data[v]) delete data[v]
        })

        const filter = Object.keys(data).map(k => {
            return encodeURIComponent(k + '=' + data[k])
            //return k + "=" + JSON.stringify(data[k])
        }).join('&')

        dispatch({
            type: SET_ROUTE,
            data: { srch_cond: filter }
        })
    }, [maker, spec, min, max, kwd]) // eslint-disable-line

    useEffect(() => { // ga gtag curation
        if (lists.advList?.items?.length > 0) {
            gtag_advList({ lists: lists.advList.items, ad: lists.advList.ad})
        }
    }, [lists.advList])

    useEffect(() => { // ga gtag itemlist
        if (lists.itemList?.items?.length > 0) {
            const list_name = `${domain}.pping.kr 일반 상품 리스트`
            gtag_itemList({ lists: lists.itemList.items, list_name })
        }
    }, [lists.itemList])

    const scroll = useCallback(() => {
        if (!list1.current) {
            return
        }
        const elTop = list1.current.getBoundingClientRect().top
        const elHeight = list1.current.getBoundingClientRect().height
        const elTop2 = list2?.current?.getBoundingClientRect().top
        const elHeight2 = list2?.current?.getBoundingClientRect().height
        const windowHeight = window.innerHeight

        if (!list2.current && (elTop - windowHeight + elHeight < 200)) {
            setView(state => ({
                ...state,
                list2: true,
                list3: isEvent ? state.list3 : true
            }))
        } else if (elTop2 - windowHeight + elHeight2 < 200) {
            setView(state => ({
                ...state,
                list3: true
            }))
        }

        if (view.list2 && view.list3) {
            window.removeEventListener('scroll', scroll)
        }
    }, [list1, list2, view.list2, view.list3, isEvent])

    useEffect(() => { // 리스트 그룹 노출조건
        window.addEventListener('scroll', scroll)
        return () => window.removeEventListener('scroll', scroll)
    }, [scroll]) // eslint-disable-line

    const fetchAdvList = (cate, idx_b_manager, domain) => {
        dispatch({
            type: ADV_LIST_REQUEST,
            data: { cate, idx_b_manager, domain }
        })
    }

    const fetchCuration = (cate, idx_b_manager, domain) => {
        dispatch({
            type: CURATION_REQUEST,
            data: { cate, idx_b_manager, domain}
        })
    }

    const fetchHotEvent = cate => {
        dispatch({
            type: HOT_EVENT_REQUEST,
            data: cate
        })
    }

    const fetchItemList = option => {
        dispatch({
            type: ITEM_LIST_REQUEST,
            data: option
        })
    }

    const setSpec = spec => {
        let obj = {}
        Object.keys(spec).map(k => {
            obj[k] = spec[k].map(v => {
                return v.specValueKey
            })
            return true
        })
        return obj
    }

    const setPrettySpec = spec => {
        let text = ''
        Object.keys(spec).map((k, i) => {
            const specValueKey = spec[k].map(v => {
                return v.specValueKey
            })
            text += i === 0 ? '' : ' '
            text += 'K' + k
            text += 'V' + specValueKey.join('|')
            return true
        })
        return text
    }

    const advListItemClick = (item) => {
        gtag_advListClick({ item, ad: lists.advList.ad })
    }

    const itemListItemClick = (item) => {
        const list_name = `${domain}.pping.kr 일반 상품 리스트`
        gtag_itemListClick({ item, list_name })
    }

    return (
        <Style>
            {loading.setItemList && <Loading />}
            {/* 애드리스트 */}
            {(route.page === '1' && lists.advList?.items?.length > 0) && (
                <Group advProduct={true}>
                    <div className="adv_top_message">
                        애드리스트 광고상품입니다. <a href='null'>광고문의</a>
                    </div>
                    <div className="item_wrap">
                        {lists.advList.items.map((v, i) => {
                            const condition = moreAdvList ? lists.advList.items.length : maxAdvListLength
                            return condition > i && <Item key={v.item_id} data={v} fixMode='list' gaEvent={advListItemClick} />
                        })}
                        {lists.advList.items.length > maxAdvListLength && (
                            <More type="button" className="button" arrow={moreAdvList ? 'up' : 'down'} onClick={() => setmoreAdvList(v => !v)}>
                                <i className="icon-angle-down" />
                            </More>
                        )}
                    </div>
                </Group>
            )}
            {/* 큐레이션 */}
            {(route.page === '1' && selectedFilterNum === 0 && lists?.curation?.curationAd?.pr_idx) && (
                <Group advProduct={true}>
                    <ListCuration curation={lists.curation.curationAd} />
                </Group>
            )}
            {lists.itemList?.items?.length > 0 ? (
                <>
                    {/* 아이템리스트 */}
                    <Group className="item_wrap" ref={list1}>
                        <ItemLine types={route.types}>
                            {lists.itemList?.items?.map((v, i) => {
                                const condition = i < (isEvent
                                    ? (route.types === 'list' ? 10 : 9)
                                    : isAdvStick
                                        ? (route.types === 'list' ? 20 : 18)
                                        : (Number(route.size) || 30)
                                )
                                return (
                                    condition && <Item key={v.item_id} data={v} gaEvent={itemListItemClick} />
                                )
                            })}
                        </ItemLine>
                    </Group>
                    {/* 이벤트 */}
                    {isEvent && (
                        <ListEvent event={lists.event} />
                    )}
                    {/* 아이템리스트 */}
                    {(view.list2 && isEvent) && (
                        <Group className="item_wrap" ref={list2}>
                            <ItemLine types={route.types}>
                                {lists.itemList?.items?.map((v, i) => {
                                    const condition = (route.types === 'list' ? 10 : 9) <= i && i < (isAdvStick
                                        ? (route.types === 'list' ? 20 : 18)
                                        : (Number(route.size) || 30))
                                    return (
                                        condition && <Item key={v.item_id} data={v} gaEvent={itemListItemClick} />
                                    )
                                })}
                            </ItemLine>
                        </Group>
                    )}
                    {/* 애드스틱 */}
                    {isAdvStick && (
                        <Group advProduct={true}>
                            <ListAdvStick />
                        </Group>
                    )}
                    {/* 아이템리스트 */}
                    {(view.list3 && isAdvStick) && (
                        <Group className="item_wrap" ref={list3}>
                            <ItemLine types={route.types}>
                                {lists.itemList?.items?.map((v, i) => {
                                    const condition = (route.types === 'list' ? 20 : 18) <= i && i < (Number(route.size) || 30)
                                    return (
                                        condition && <Item key={v.item_id} data={v} gaEvent={itemListItemClick} />
                                    )
                                })}
                            </ItemLine>
                        </Group>
                    )}
                </>
            ) : (
                <div className="nolist">
                    {!loading.setItemList && '검색 조건과 일치하는 상품이 없습니다.'}
                </div>
            )}
        </Style>
    )
}

const Style = styled.div`
    position: relative;

    .adv_top_message {
        padding: 5px;
        font-size: 12px;
        color: #999;
        border-bottom: 1px solid #ccc;

        & > a {
            display: inline-block;
            margin-left: 5px;
            padding: 2px 3px;
            border-radius: 3px;
            border: 1px solid #ccc;
        }
        &.border_style {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 20px 0 0;
            border: 1px solid #ccc;
            border-bottom: none;
        }
    }
    .marketing_platform_content {
        & > iframe {
            border: 0;
            display: block
        }
    }
    .nolist {
        padding: 180px 0;
        font-size: 20px;
        text-align: center;
    }
`

const Group = styled.div`
    &.item_wrap, .item_wrap {
        position: relative;
        display: flex;
        flex-wrap: wrap;

        .item.thumb {
            &:nth-child(3n) {
                margin-right: 0
            }
        }
    }
    .item {
        background: ${props => props.advProduct && '#fffdfa'};

        &:hover {
            .thumbnail_thumb {
                border-color : #418ded
            }
        }
        &.list:hover {
            background: #f5f9fe;
        }
        .label.hit {
            display: ${props => props.advProduct ? 'none' : 'inline-block'}
        }
    }
`
const More = styled.button`
    &.button {
        position: absolute;
        bottom: 0;
        right: 0;
        font-size: 19px;
        width: 25px;
        height: 25px;
        color: #fff;
        background: #999;
        vertical-align: middle;
        cursor: pointer;

        &:hover {
            background: #418ded;
        }
        i {
            transform: rotate(${props => props.arrow === 'up' ? 180 : 0}deg);
            display: block;
        }
    }
`

const Loading = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 10;
    background: rgba(255,255,255,0.6) url(https://cdnimg-dev.happyshopping.kr/img_static/img_pres/_v5/happy_loading_5.gif) no-repeat center 150px;
    background-size: 60px 69px;
`

export default Lists
