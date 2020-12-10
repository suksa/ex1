import React, { useState, useEffect, useRef } from 'react'
import Swiper from 'react-id-swiper'
import styled from 'styled-components'
import Alink from 'container/alink'
import { Api } from '../../libs/api'

const VisualSlide = () => {
    const [list, setList] = useState([])
    const [swiperVis, setVisSwiper] = useState(null)
    const [swiperPg, setPgSwiper] = useState(null)
    const [autoplay, setAutoplay] = useState(true)

    const prev = useRef(null)
    const next = useRef(null)

    useEffect( () => {
        Api.getHeaderEvents().then(rst => {
            if (rst.data.code === '200') {
                const list = rst.data.data.headerList
                setList(list)
            }
        })
    }, [])

    useEffect(() => {
        if (list.length > 0) {
            const visSwiperIns = document.querySelector(".visual_swiper").swiper
            const pgSwiperIns = document.querySelector(".visual_swiper_pg").swiper
            setVisSwiper(visSwiperIns)
            setPgSwiper(pgSwiperIns)
        }
    }, [list])

    useEffect(() => {
        if (
            (swiperVis !== null && swiperVis.controller) &&
            (swiperPg !== null && swiperPg.controller)
        ) {
            swiperVis.controller.control = swiperPg;
            swiperPg.controller.control = swiperVis;
        }
    }, [swiperPg, swiperVis])

    const visSwiper = {
        speed: 600,
        containerClass: 'visual_swiper',
        autoplay: {
            delay: 3000,
        },
        slidesPerView: 1,
        effect: 'fade',
        spaceBetween: 0,
        allowTouchMove: false,
        loop: true,
        loopedSlides: 8,
        preloadImages: false,
        lazy: {
            loadPrevNext: true,
            loadPrevNextAmount: 4,
            loadOnTransitionStart: true,
        },
        pagination: {
            el: '.pg',
            type: 'fraction',
        }
    }

    const pageSwiper = {
        speed: 600,
        spaceBetween: 0,
        containerClass: 'visual_swiper_pg',
        loop: true,
        slidesPerView: 4,
        loopedSlides: 8,
        slideToClickedSlide: true,
        breakpoints: {
            1209: {
                slidesPerView: 5
            },
        }
    }

    const autoPlayControl = () => {
        if (autoplay) {
            swiperVis.autoplay.stop()
            swiperPg.autoplay.stop()
            setAutoplay(false)
        } else {
            swiperVis.autoplay.start()
            setAutoplay(true)
        }
    }

    const onClickArrow = (arrow) => {
        if (list.length > 0 && swiperVis) {
            if (!swiperVis.animating) {
                if (arrow === 'prev') {
                    swiperVis.slideToLoop(swiperVis.realIndex - 1)
                } else if (arrow === 'next') {
                    swiperVis.slideToLoop(swiperVis.realIndex + 1)
                }
                if (autoplay) {
                    swiperVis.autoplay.stop()
                    swiperVis.autoplay.start()
                } else {
                    swiperVis.autoplay.stop()
                    swiperPg.autoplay.stop()
                }
            }
        }
    }

    return (
        <Visual>
            {list.length > 0 && (
                <>
                    <div className="prev" ref={prev} onClick={() => onClickArrow('prev')} />
                    <div className="next" ref={next} onClick={() => onClickArrow('next')} />
                    <div className="pg" />
                    <Swiper {...visSwiper}>
                        {list.map(v => (
                            <Slide key={v.idx_cat_evt} bgColor={v.evt_color || '#eee'}>
                                <Alink href={`${v.f_lnk ? v.lnk_evt : `https://event.pping.kr/detail/${v.idx_cat_evt}`}`} className="alink">
                                    <img
                                        src="//cdnimg.happyshopping.kr/img_static/img_pres/_v5/happy_loading_5.gif"
                                        data-src={`//cdnimg.happyshopping.kr/img_static/img_evt/${v.idx_cat_evt}/770.png?v2`}
                                        alt={v.nm_evt}
                                        className="swiper-lazy"
                                    />
                                </Alink>
                            </Slide>
                        ))}
                    </Swiper>
                    <VisualUnder>
                        <Alink href="//event1.pping.kr/" className="event_link">이벤트 <i className="icon-angle-right" /></Alink>
                        <Swiper {...pageSwiper}>
                            {list.map((v, i) => <div key={i}>{v.nm_evt_detail}</div>)}
                        </Swiper>
                        <button type="button" className="autoplay" onClick={autoPlayControl}>
                            <i className={`icon ${autoplay ? 'icon-pause' : 'icon-play'}`} />
                        </button>
                    </VisualUnder>
                </>
            )}
        </Visual>
    )
}

const Visual = styled.div`
    height: 426px;
    background: #fafafa;

    .visual_swiper {
        height: 100%;
    }
    .pg {
        position: absolute;
        left: 50%;
        left: calc(50% - 0.2px);
        margin-left: 485px;
        top: 370px;
        padding: 0 7px 0 10px;
        width: 100px;
        height: 36px;
        line-height: 36px;
        background-color: rgba(0,0,0,0.4);
        border-radius: 18px;
        color: #fff;
        font-size: 14px;
        z-index: 10;
        box-sizing: border-box;

        &:hover {
            background-color: rgba(0,0,0,0.7);
        }

        &:after {
            content: '';
            position: absolute;
            top: 12px;
            right: 24px;
            width: 1px;
            height: 14px;
            background: #fff;
            opacity: 0.3;
        }

        .swiper-pagination-current {
            display: inline-block;
            font-weight: 700;
            width: 17px;
            text-align: right;
        }
    }
    .next,
    .prev {
        position: absolute;
        left: 50%;
        right: auto;
        margin-left: 562px;
        top: 379px;
        font-size: 14px;
        color: #fff;
        opacity: .3;
        cursor: pointer;
        background-image: none;
        width: 15px;
        height: 20px;
        text-align: center;
        margin-top: 0px;
        z-index: 15;

        &:before {
            font-family: 'ppingkr_v4';
            content: '\\e914'
        }
        &:hover {
            opacity: 1;

            & ~ .pg {
                background-color: rgba(0,0,0,0.7);
            }
        }
    }
    .next {
        transform: scaleX(-1)
    }
    .prev {
        transform: translateX(-18px);
    }

    @media (max-width: 1209px) {
        .pg {
            margin-left: 375px;
        }
        .next,
        .prev {
            margin-left: 451px;
        }
    }
`

const Slide = styled.div`
    overflow: hidden;
    background: ${props => props.bgColor};

    .alink {
        width: 1190px;
        height: 100%;
        margin: 0 auto;
        display: block;

        @media (max-width: 1209px) {
            width: 950px;
        }
    }
    .swiper-lazy {
        width: 60px;
        top: 50%;
        transform: translate(-50%, -50%)
    }
    .swiper-lazy-loaded {
        width: auto;
        top: 0;
        transform: translateX(-50%)
    }
    img {
        position: absolute;
        top:0;
        left: 50%;
        transform: translateX(-50%);
        pointer-events: none;

        @media (max-width: 1209px) {
            margin-left: 120px;
        }
    }
`

const VisualUnder = styled.div`
    width: 1190px;
    margin: 0 auto;
    display: flex;

    .event_link {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 180px;
        height: 51px;
        line-height: 51px;
        background-color: rgb(51, 51, 51);
        box-sizing: border-box;
        color: rgb(255, 255, 255);
        text-align: left;
        border-bottom: 1px solid rgb(51, 51, 51);
        padding: 0px 30px;
    }
    .visual_swiper_pg {
        overflow: hidden;
        width: 965px;
        border-bottom: 1px solid #e5e5e5;
        border-right: 1px solid #e5e5e5;

        .swiper-slide {
            cursor: pointer;
            height: 46px;
            font-size: 14px;
            font-weight: 700;
            text-align: center;
            line-height: 46px;
            border-top: 4px solid transparent;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;

            &:after {
                background: #e5e5e5;
                top: 16px;
                content: '';
                display: block;
                height: 15px;
                position: absolute;
                left: 1px;
                width: 1px;
            }
        }
        .swiper-slide-active {
            border-top: 4px solid #418ded;
            color: #418ded;

            &:after {
                left: 0;
            }
        }
    }
    .autoplay {
        display: flex;
        width: 44px;
        height: 51px;
        justify-content: center;
        align-items: center;
        background: #fff;
        border: 0;
        border-right: 1px solid #e5e5e5;
        border-bottom: 1px solid #e5e5e5;
        cursor: pointer;

        &:hover {
            background: #f8f8f8
        }

        i {
            font-size: 20px
        }
    }

    @media (max-width: 1209px) {
        & {width: 950px}
        .visual_swiper_pg {
            width: 725px
        }
    }
`

export default VisualSlide
