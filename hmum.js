import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import PropTypes from 'prop-types'
import { Swiper, SwiperSlide } from 'swiper/react'
import ProductItem from 'components/product/item'

const Slide = ({ slideItems }) => {
    const [realIndex, setRealIndex] = useState(0)
    const [transitionState, setTransitionState] = useState(false)
    const ballLocation = realIndex * 22

    const onSlideChange = (e) => {
        setRealIndex(e.realIndex / 4)
    }
    const transitionStart = () => {
        setTransitionState(true)
    }
    const transitionEnd = () => {
        setTransitionState(false)
    }

    return (
        <>
            <Swiper
                spaceBetween={10}
                slidesPerView={4}
                slidesPerGroup={4}
                speed={200}
                pagination={{
                    clickable: true,
                    el: '.recommend_pagination',
                }}
                loop
                loopFillGroupWithBlank
                onSlideChange={(e) => onSlideChange(e)}
                onTransitionStart={() => transitionStart()}
                onTransitionEnd={() => transitionEnd()}
            >
                {slideItems.map((v, index) => (
                    <SwiperSlide key={index}>
                        <ProductItem data={v} type={2} />
                    </SwiperSlide>
                ))}
                <Pagination>
                    <div className="page_wrap">
                        <div className="recommend_pagination" />
                        <span
                            className={`ball ${transitionState ? 'progress' : ''}`}
                            style={{ transform: `translateX(${ballLocation}px)` }}
                        />
                    </div>
                </Pagination>
            </Swiper>
        </>
    )
}

Slide.propTypes = {
    slideItems: PropTypes.array,
}

const balling = keyframes`
    0% {
        width: 12px
    }
    30% {
        width: 20px
    }
    60% {
        width: 12px
    }
    100% {
        width: 12px
    }
`

const Pagination = styled.div`
    text-align: center;
    margin: 20px 0 0;

    .page_wrap {
        position: relative;
        display: inline-block;
        height: 12px;
    }
    .swiper-pagination-bullet {
        width: 12px;
        height: 12px;
        background: #ccc;
        opacity: 1;
        vertical-align: top;
        cursor: pointer;

        &:not(:last-child) {
            margin: 0 10px 0 0;
        }
    }
    .ball {
        position: absolute;
        top: 0;
        left: 0;
        width: 12px;
        height: 12px;
        background: #418ded;
        border-radius: 6px;
        transform: translate(0);
        transition: 0.2s;

        &.progress {
            animation: ${balling} 0.2s forwards;
        }
    }
`

export default Slide
