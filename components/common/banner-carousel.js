import React, { useState } from 'react';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators
} from 'reactstrap';

const items = [
    {
        caption: "Sell your books to fellow students in university",
        picture: "/static/banner/education.svg"
    },
    {
        caption: "Add interesting books to your favorite collection",
        picture: "/static/banner/favoriate.svg"
    },
    {
        caption: "Buy from another students",
        picture: "/static/banner/lover.svg"
    },
    {
        caption: "Search books listed by other students.",
        picture: "/static/banner/search.svg"
    }
];

function BannerCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    }

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    }

    const goToIndex = (newIndex) => {
        if (animating) return;
        setActiveIndex(newIndex);
    }

    const slides = items.map((item) => {
        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.picture}
            >
                <div className="container">
                    <img className="carousel-image" src={item.picture} alt={item.caption} />
                    <div className="row">
                        <div className="col-lg-5 caption-container">
                            <div className="text-center text-lg-left">
                                <div>
                                    <h2 className="text-white mb-4">
                                        <span className="display-4 font-weight-light">{item.caption}</span>
                                    </h2>
                                    <div className="mt-5">
                                        <a href="/profile" className="btn btn-outline-white rounded-pill hover-translate-y-n3 btn-icon d-none d-xl-inline-block scroll-me">
                                            <span className="btn-inner--icon"><i className="fas fa-user-circle"></i></span>
                                            <span className="btn-inner--text">Profile</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CarouselItem>
        );
    });

    return (
        <section className="header-1 section-rotate bg-section-secondary main-banner">
            <div style={{ transform: "none", borderBottomLeftRadius: "0" }} className="section-inner bg-gradient-primary" />
            <Carousel
                activeIndex={activeIndex}
                next={next}
                previous={previous}
            >
                <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={goToIndex} />
                {slides}
            </Carousel>
        </section >
    )
}

export default BannerCarousel;