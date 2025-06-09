"use client";
import React, { Suspense } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Hero from "@/components/hero/hero";
import { useInView } from "@/hooks/useInView";
import Cart from "@/components/cart/cart";

const Clothes = React.lazy(() => import("@/components/clothes/clothes"));
const Electronics = React.lazy(() => import("@/components/electronics/electronics"));
const Jewellery = React.lazy(() => import("@/components/jewellery/jewellery"));

const LazySection = ({ children, minHeight = "400px" }) => {
  const [ref, isInView] = useInView();
  
  return (
    <div ref={ref} style={{ minHeight }}>
      {isInView ? (
        <Suspense fallback={
          <div className="container my-5 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }>
          {children}
        </Suspense>
      ) : null}
    </div>
  );
};

const Page = () => {
  return (
    <div className="">
      <Hero/>
      
      <LazySection>
        <Clothes/>
      </LazySection>
      
      <LazySection>
        <Electronics/>
      </LazySection>
      
      <LazySection>
        <Jewellery/>
      </LazySection>
    </div>
  );
};

export default Page;
