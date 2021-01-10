import React, { useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { gtag_CurationList, gtag_CurationListClick } from 'libs/gtag'
import Item from './item'

const ListCuration = ({ curation }) => {
    const { domain } = useSelector(state => state.initial)
    const [active, setActive] = useState(false)
    const [moreCurationList, setmoreCurationList] = useState(false)
    const maxAdvListLength = 3

    useEffect(() => { // ga gtag
        if (curation?.items.length > 0) {
            const lists = curation.items.map((v, i) => ({ ...v, num:i+1}))
            const ad = {
                nm_ad: curation.nm_ad,
                code_ad: curation.code_ad,
                pr_idx: curation.pr_idx
            }
            gtag_CurationList({ lists: lists, ad })
        }
    }, [curation])

    const onMouseImg = useCallback(() => {
        if (!active) {
            setActive(true)
        }
    }, [active])

    const curationListItemClick = (item) => {
        const ad = {
            nm_ad: curation.nm_ad,
            code_ad: curation.code_ad,
            pr_idx: curation.pr_idx
        }
        const list_position = curation.items.findIndex(v => v.item_id === item.item_id) + 1
        gtag_CurationListClick({ item, ad, list_position })
    }

    return (
        <Style>
            <div className="adv_top_message border_style">
                마케팅플랫폼 <a href='null'>영상제작문의</a>
            </div>
            <div className="marketing_platform_content">
                <img
                    src={`//cdnimg.happyshopping.kr/img_ad/curation/${curation.pr_idx}/${active ? 'e890' : '890'}.png`}
                    alt={curation.nm_curation}
                    onMouseEnter={onMouseImg}
                />
                {active && (
                    <iframe
                        title={curation.nm_curation}
                        width={domain === 'shopping' ? '950' : '890'}
                        height={domain === 'shopping' ? '534' : '500'}
                        src={curation.youtube}
                        allow="picture-in-picture"
                    />
                )}
            </div>
            <div className="item_wrap">
                {curation?.items?.slice(0, moreCurationList ? curation.items.length : maxAdvListLength).map(v => {
                    return <Item key={v.item_id} data={v} fixMode='list' gaEvent={curationListItemClick} />
                })}
                {curation?.items?.length > maxAdvListLength && (
                    <More type="button" className="button" arrow={moreCurationList ? 'up' : 'down'} onClick={() => setmoreCurationList(v => !v)}>
                        <i className="icon-angle-down" />
                    </More>
                )}
            </div>
        </Style>
    )
}

const Style = styled.div`
    .marketing_platform_content {
        overflow: hidden
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

export default ListCuration
