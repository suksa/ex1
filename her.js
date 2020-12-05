import React, { useState, useEffect, useRef, memo } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { usePrevious } from 'libs/util'

const CategorySelect = ({ slide, activeSelectCate, setActiveSelectCate }) => {
    const [renderNum, setRenderNum] = useState(0)
    const [isSwiper, setIsSwiper] = useState(true)
    const [durationActive, setDurationActive] = useState(activeSelectCate)
    const [aniProgress, setAniProgress] = useState(false)
    const prevActiveSelectCate = usePrevious(activeSelectCate)
    const swiper = useRef(null)

    useEffect(() => {
        if (renderNum !== 0) {
            swiper.current.swiper.destroy(false)
            setIsSwiper(false)
            setTimeout(() => {
                swiper.current.swiper.init()
                setIsSwiper(true)
            }, 0)
        }
        setRenderNum((state) => state + 1)
    }, [slide])

    useEffect(() => {
        if (activeSelectCate || durationActive) { // 초기실행안함
            activeSelectCateChangeMotion()
        }
    }, [activeSelectCate])

    const activeSelectCateChangeMotion = () => {
        const swiperSlideEl = swiper.current.children[0].children
        const swiperWrapperEl = swiper.current.children[0]
        const elLeft = swiperSlideEl[activeSelectCate].offsetLeft
        const elWidth = swiperSlideEl[activeSelectCate].clientWidth
        const elPrevLeft = swiperSlideEl[prevActiveSelectCate || 0]?.offsetLeft
        const elPrevWidth = swiperSlideEl[prevActiveSelectCate || 0]?.clientWidth

        const bar = document.createElement('div')
        bar.className = 'active_bar'
        bar.style.width = elPrevWidth + 'px'
        bar.style.transform = 'translateX('+ elPrevLeft +'px) scaleX(1)'
        swiperWrapperEl.append(bar)

        const aniFrame = (startX, endX, startW, endW, duration) => {
            duration = duration || 300
            const unitX = (startX - endX) / duration // 간격차이
            const widthX = (endW - startW) / duration // 넓이차이
            const date = new Date()
            const startTime = date.getTime()
            const endTime = date.getTime() + duration

            const moveTo = () => {
                const now = new Date().getTime()
                const passed = now - startTime
                
                if (now <= endTime) {
                    bar.style.transform = 'translateX('+ (startX - (unitX * passed)) +'px) scaleX('+ (1 + (widthX * passed) / startW) +')'
                    requestAnimationFrame(moveTo)
                } else {
                    // 애니메이션 종료
                    swiperWrapperEl.removeChild(bar)
                    setDurationActive(activeSelectCate)
                    setAniProgress(false)
                }
            }
            requestAnimationFrame(moveTo)
        }
        aniFrame(elPrevLeft, elLeft, elPrevWidth, elWidth, 200)
        setAniProgress(true)
    }

    return (
        <Style>
            {isSwiper && (
                <Swiper spaceBetween={0} slidesPerView="auto" freeMode={true} ref={swiper}>
                    {slide.map((v, index) => (
                        <SwiperSlide key={index}>
                            <Name
                                className={(!aniProgress && durationActive === index) ? 'active' : ''}
                                onClick={() => setActiveSelectCate(index)}
                            >
                                {v.name}
                            </Name>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </Style>
    )
}

CategorySelect.propTypes = {
    slide: PropTypes.array,
    activeSlide: PropTypes.oneOf(['store', 'cate']),
    activeSelectCate: PropTypes.number,
    setActiveSelectCate: PropTypes.func,
}

const Style = styled.div`
    display: flex;
    align-items: center;
    height: 46px;

    .swiper-container {
        padding: 0 10px;
    }
    .swiper-slide {
        width: auto;
    }
    .active_bar {
        position: absolute;
        height: 2px;
        background: #418ded;
        left: 0;
        bottom: 0;
        transform-origin: left;
    }
`

const Name = styled.button`
    display: flex;
    align-items: center;
    height: 46px;
    line-height: 22px;
    font-size: 15px;
    color: #666;
    background: #fff;
    border: 0;
    border-bottom: 2px solid #fff;
    padding: 0 10px;

    &.active {
        color: #418ded;
        border-bottom: 2px solid #418ded;
    }
`

export default memo(CategorySelect)
