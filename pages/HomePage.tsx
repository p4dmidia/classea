
import React from 'react';
import Hero from '../components/Hero';
import FeaturedProducts from '../components/FeaturedProducts';
import BusinessOpportunity from '../components/BusinessOpportunity';
import ConsorcioSection from '../components/ConsorcioSection';

const HomePage: React.FC = () => {
    return (
        <>
            <Hero />
            <FeaturedProducts />
            <BusinessOpportunity />
            <ConsorcioSection />
        </>
    );
};

export default HomePage;
