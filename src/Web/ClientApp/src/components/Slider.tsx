import React from 'react'
import { Splide, SplideSlide } from '@splidejs/react-splide';

export default function Slider() {
    return (
        <div>
            <Splide aria-label="My Favorite Images">
                <SplideSlide>
                    <div>
                        <img src="https://picsum.photos/200/300" alt="Image 1" />
                    </div>
                </SplideSlide>
                <SplideSlide>
                    <img src="https://picsum.photos/200/300" alt="Image 2" />
                </SplideSlide>
            </Splide>

        </div>
    )
}
