"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  BsCamera,
  BsPlus,
  BsDash,
  BsCart3,
  BsCheck2,
  BsShield,
} from "react-icons/bs";
import MediaViewer from "../mediaViewer/mediaViewer";
import axios from "axios";

// Loading Skeleton Components
const ImageSkeleton = () => (
  <div
    className="bg-light rounded p-4 text-center mb-3 d-flex align-items-center justify-content-center"
    style={{ height: "400px" }}
  >
    <div className="spinner-border text-secondary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

const DetailsSkeleton = () => (
  <div className="p-3">
    {[...Array(8)].map((_, idx) => (
      <div
        key={idx}
        className="bg-light rounded mb-3"
        style={{
          height: `${20 + (idx % 3) * 15}px`,
          width: `${50 + (idx % 4) * 20}%`,
        }}
      ></div>
    ))}
  </div>
);

const GlassView = ({ slug = "leandra-velazquez" }) => {
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAccordion, setExpandedAccordion] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [showTryOn, setShowTryOn] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [isBaseProductSelected, setIsBaseProductSelected] = useState(true);

  const fetchGlassesDetails = async () => {
    try {
      setLoading(true);
      const api = "/frame/product-details";
      const res = await axios.post(api, { slug });

      if (res.data && res.data.product) {
        setProductData(res.data);

        // Combine all images and deduplicate
        const featureImages = res.data.product.feature_images || [];
        const regularImages = res.data.product.images || [];
        const metaImages = res.data.product.meta_images || [];
        const allImages = [...featureImages, ...regularImages, ...metaImages];
        const uniqueImages = allImages.filter(
          (image, index, self) =>
            index === self.findIndex((img) => img.path === image.path)
        );

        // Set main image from the first available unique image
        if (uniqueImages.length > 0) {
          setMainImage(uniqueImages[0].path);
        }

        setIsBaseProductSelected(true);
        setSelectedVariant(null);
        setQuantity(res.data.product.min_qty || 1);
      } else {
        setError("Product not found");
      }
    } catch (err) {
      setError("Failed to load product details");
      console.error("Error fetching glasses details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchGlassesDetails();
    }
  }, [slug]);

  const toggleAccordion = (index) => {
    setExpandedAccordion((prev) => (prev === index ? null : index));
  };

  const getCurrentProduct = () => {
    if (!isBaseProductSelected && selectedVariant) {
      return selectedVariant;
    }
    return productData?.product;
  };

  const getDisplayImages = () => {
    const current = getCurrentProduct();
    if (!current) return [];

    if (!isBaseProductSelected && selectedVariant) {
      // For variants, return variant images
      return selectedVariant.images || [];
    }

    // For base product, return all available images
    const featureImages = productData?.product.feature_images || [];
    const regularImages = productData?.product.images || [];
    const metaImages = productData?.product.meta_images || [];
    
    // Combine all images and remove duplicates based on path
    const allImages = [...featureImages, ...regularImages, ...metaImages];
    const uniqueImages = allImages.filter((image, index, self) => 
      index === self.findIndex(img => img.path === image.path)
    );
    
    return uniqueImages;
  };

  const calculateDiscountedPrice = (product) => {
    if (!product) return { original: 0, discounted: 0, discount: 0 };

    const { amount, discount_type, discount_amount } = product;
    const originalPrice = parseFloat(amount) || 0;
    let discountedPrice = originalPrice;
    let discountPercent = 0;

    if (discount_amount && discount_type) {
      const discountValue = parseFloat(discount_amount);
      if (discount_type === "percentage") {
        discountPercent = discountValue;
        discountedPrice =
          originalPrice - (originalPrice * discountPercent) / 100;
      } else if (discount_type === "fixed") {
        discountedPrice = originalPrice - discountValue;
        discountPercent =
          ((originalPrice - discountedPrice) / originalPrice) * 100;
      } else if (discount_type === "cashback") {
        discountedPrice = originalPrice;
        discountPercent = 0;
      }
    }

    return {
      original: originalPrice,
      discounted: Math.max(0, discountedPrice),
      discount: Math.round(discountPercent),
      cashback: discount_type === "cashback" ? parseFloat(discount_amount) : 0,
    };
  };

  const handleQuantityChange = (change) => {
    const current = getCurrentProduct();
    const newQuantity = quantity + change;
    const minQty = current?.min_qty || 1;
    const maxQty = current?.max_qty || 999;

    if (newQuantity >= minQty && newQuantity <= maxQty) {
      setQuantity(newQuantity);
    }
  };

  const handleBaseProductSelect = () => {
    setIsBaseProductSelected(true);
    setSelectedVariant(null);
    setQuantity(productData.product.min_qty || 1);

    // Combine all images and deduplicate
    const featureImages = productData.product.feature_images || [];
    const regularImages = productData.product.images || [];
    const metaImages = productData.product.meta_images || [];
    const allImages = [...featureImages, ...regularImages, ...metaImages];
    const uniqueImages = allImages.filter(
      (image, index, self) =>
        index === self.findIndex((img) => img.path === image.path)
    );

    // Set main image from the first available unique image
    if (uniqueImages.length > 0) {
      setMainImage(uniqueImages[0].path);
    }
  };

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setIsBaseProductSelected(false);
    setQuantity(variant.min_qty || 1);
    // Update main image to variant images
    if (variant.images && variant.images.length > 0) {
      setMainImage(variant.images[0].path);
    }
  };

  const handleAddToCart = () => {
    const currentProduct = getCurrentProduct();
    if (!currentProduct) return;

    const pricing = calculateDiscountedPrice(currentProduct);
    // Cart logic here
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="row">
          <div className="col-lg-6 mb-4">
            <ImageSkeleton />
          </div>
          <div className="col-lg-6">
            <DetailsSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Error</h4>
              <p>{error || "Product not found"}</p>
              <button
                className="btn btn-primary"
                onClick={() => window.history.back()}
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { product, variants } = productData;
  const currentProduct = getCurrentProduct();
  const pricing = calculateDiscountedPrice(currentProduct);

  return (
    <div className="container my-5">
      <div className="row">
        {/* Media Section */}
        <div className="col-lg-6 mb-4">
          <MediaViewer
            media={getDisplayImages()}
            productName={product.name}
            productSlug={slug}
            baseUrl={"http://localhost:3000/glasses/"}
            brochure={product.brochure}
            catalog={product.catalog}
            videoLink={product.video_link}
            videoProvider={product.video_provider}
            status={currentProduct?.status}
            onMainImageChange={(newImage) => setMainImage(newImage)} 
          />
        </div>

        {/* Product Details */}
        <div className="col-lg-6">
          <div className="p-3">
            {/* Product Title & Info */}
            <div className="mb-3">
              <h1 className="h3 fw-bold mb-2" style={{ color: "#0f1111" }}>
                {product.name}
              </h1>
              <p className="text-muted mb-1">
                Model: {currentProduct?.model_no}
              </p>
              <p className="text-muted small mb-0">
                {product.gender} • {product.type}
              </p>
            </div>

            {/* Price Section */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="h4 fw-bold mb-0" style={{ color: "#B12704" }}>
                  ₹{pricing.discounted.toFixed(2)}
                </span>
                {pricing.discount > 0 && (
                  <>
                    <span className="text-decoration-line-through text-muted">
                      ₹{pricing.original.toFixed(2)}
                    </span>
                    <span className="text-danger fw-medium">
                      ({pricing.discount}% off)
                    </span>
                  </>
                )}
                {pricing.cashback > 0 && (
                  <span className="text-success fw-medium">
                    ₹{pricing.cashback} Cashback
                  </span>
                )}
              </div>
              <small className="text-muted">
                Inclusive of all taxes
              </small>
            </div>

            {/* Product & Variant Selection */}
            {variants && variants.length > 0 && (
              <div className="mb-4">
                <div className="mb-3">
                  <span className="fw-medium" style={{ color: "#0f1111" }}>
                    Style: 
                  </span>
                  <span className="fw-bold ms-1">
                    {isBaseProductSelected 
                      ? `${product.model_no} (Base Product)`
                      : selectedVariant?.model_no
                    }
                  </span>
                </div>
                
                <div className="row g-2">
                  {/* Base Product Card */}
                  <div className="col-6 col-md-4">
                    <div
                      className={`border rounded p-3 cursor-pointer position-relative ${
                        isBaseProductSelected ? "border-primary" : "border-light"
                      }`}
                      style={{
                        cursor: "pointer",
                        borderWidth: isBaseProductSelected ? "2px" : "1px",
                        backgroundColor: isBaseProductSelected ? "#e7f3ff" : "#fff",
                        transition: "all 0.2s ease"
                      }}
                      onClick={handleBaseProductSelect}
                    >
                      {isBaseProductSelected && (
                        <div 
                          className="position-absolute top-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "20px", height: "20px", fontSize: "12px", transform: "translate(50%, -50%)" }}
                        >
                          <BsCheck2 size={12} />
                        </div>
                      )}
                      
                      <div className="text-center">
                        <div className="fw-medium small mb-1" style={{ color: "#0f1111" }}>
                          {product.model_no}
                        </div>
                        <div className="fw-bold text-primary small">
                          ₹{calculateDiscountedPrice(product).discounted.toFixed(0)}
                        </div>
                        {calculateDiscountedPrice(product).discount > 0 && (
                          <div className="text-muted small text-decoration-line-through">
                            ₹{calculateDiscountedPrice(product).original.toFixed(0)}
                          </div>
                        )}
                        <div className="text-muted small mt-1">
                          {product.lenth}×{product.width}×{product.height}mm
                        </div>
                        <div className="badge bg-light text-dark mt-1 small">
                          Base Product
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Variant Cards */}
                  {variants.map((variant) => {
                    const isSelected = !isBaseProductSelected && selectedVariant?.id === variant.id;
                    const variantPricing = calculateDiscountedPrice(variant);
                    
                    return (
                      <div key={variant.id} className="col-6 col-md-4">
                        <div
                          className={`border rounded p-3 cursor-pointer position-relative ${
                            isSelected ? "border-primary" : "border-light"
                          }`}
                          style={{
                            cursor: "pointer",
                            borderWidth: isSelected ? "2px" : "1px",
                            backgroundColor: isSelected ? "#e7f3ff" : "#fff",
                            transition: "all 0.2s ease"
                          }}
                          onClick={() => handleVariantSelect(variant)}
                        >
                          {isSelected && (
                            <div 
                              className="position-absolute top-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "20px", height: "20px", fontSize: "12px", transform: "translate(50%, -50%)" }}
                            >
                              <BsCheck2 size={12} />
                            </div>
                          )}
                          
                          <div className="text-center">
                            <div className="fw-medium small mb-1" style={{ color: "#0f1111" }}>
                              {variant.model_no}
                            </div>
                            <div className="fw-bold text-primary small">
                              ₹{variantPricing.discounted.toFixed(0)}
                            </div>
                            {variantPricing.discount > 0 && (
                              <div className="text-muted small text-decoration-line-through">
                                ₹{variantPricing.original.toFixed(0)}
                              </div>
                            )}
                            <div className="text-muted small mt-1">
                              {variant.lenth}×{variant.width}×{variant.height}mm
                            </div>
                            <div className="badge bg-light text-dark mt-1 small">
                              Variant
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Product Details */}
            {product.details && (
              <div className="mb-4">
                <div
                  className="text-muted small"
                  dangerouslySetInnerHTML={{ __html: product.details }}
                />
              </div>
            )}

            {/* Dimensions */}
            <div className="mb-4">
              <h6 className="fw-semibold mb-3" style={{ color: "#0f1111" }}>
                Dimensions
              </h6>
              <div className="row g-2">
                <div className="col-4">
                  <div className="border rounded p-3 text-center bg-light">
                    <div className="fw-bold text-dark">
                      {currentProduct?.lenth}mm
                    </div>
                    <small className="text-muted">Length</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border rounded p-3 text-center bg-light">
                    <div className="fw-bold text-dark">
                      {currentProduct?.width}mm
                    </div>
                    <small className="text-muted">Width</small>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border rounded p-3 text-center bg-light">
                    <div className="fw-bold text-dark">
                      {currentProduct?.height}mm
                    </div>
                    <small className="text-muted">Height</small>
                  </div>
                </div>
              </div>
              {currentProduct?.weight && (
                <div className="mt-3 text-center">
                  <div className="d-inline-block border rounded px-3 py-2 bg-light">
                    <small className="text-muted">Weight: </small>
                    <span className="fw-medium">{currentProduct.weight}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-3">
                <span className="fw-medium" style={{ color: "#0f1111" }}>
                  Quantity:
                </span>
                <div className="d-flex align-items-center border rounded">
                  <button
                    className="btn btn-sm border-0 px-2"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= (currentProduct?.min_qty || 1)}
                  >
                    <BsDash />
                  </button>
                  <span className="px-3 py-1 border-start border-end">
                    {quantity}
                  </span>
                  <button
                    className="btn btn-sm border-0 px-2"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (currentProduct?.max_qty || 999)}
                  >
                    <BsPlus />
                  </button>
                </div>
              </div>
            </div>

            {/* Stock & Availability */}
            <div className="mb-4">
              <div className="d-flex flex-wrap gap-2">
                {product.current_stock > 0 ? (
                  <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2">
                    In Stock ({product.current_stock})
                  </span>
                ) : (
                  <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2">
                    Out of Stock
                  </span>
                )}
                
                {currentProduct?.refundable && (
                  <span className="badge bg-info-subtle text-info border border-info-subtle px-3 py-2">
                    <BsShield className="me-1" />
                    Refundable
                  </span>
                )}
                
                {product.featured && (
                  <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
                    Featured
                  </span>
                )}
                
                {(currentProduct?.suggesting || product.suggesting) && (
                  <span className="badge bg-warning-subtle text-warning border border-warning-subtle px-3 py-2">
                    Recommended
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2 mb-4">
              <button
                className="btn btn-outline-primary flex-fill py-3"
                onClick={() => setShowTryOn(true)}
                disabled={!mainImage}
              >
                <BsCamera className="me-2" /> Try On
              </button>

              <button
                className="btn btn-warning flex-fill py-3"
                disabled={product.current_stock <= 0}
                onClick={handleAddToCart}
              >
                <BsCart3 className="me-2" /> Add to Cart
              </button>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-4">
                <h6 className="fw-semibold mb-2" style={{ color: "#0f1111" }}>
                  Tags
                </h6>
                <div className="d-flex flex-wrap gap-1">
                  {product.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="badge bg-light text-dark border px-2 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Specifications Accordion */}
            <div className="accordion mb-3" id="techInfoAccordion">
              <div className="accordion-item border">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button py-3 px-3 collapsed bg-light"
                    type="button"
                    onClick={() => toggleAccordion(0)}
                    aria-expanded={expandedAccordion === 0}
                    style={{ boxShadow: "none" }}
                  >
                    {expandedAccordion === 0 ? (
                      <BsDash className="me-2" />
                    ) : (
                      <BsPlus className="me-2" />
                    )}
                    <span className="fw-semibold">
                      Technical Specifications
                    </span>
                  </button>
                </h2>
                <div
                  className={`accordion-collapse collapse ${
                    expandedAccordion === 0 ? "show" : ""
                  }`}
                >
                  <div className="accordion-body py-3 px-3">
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <small className="text-muted">Model Number</small>
                        <div className="fw-medium">
                          {currentProduct?.model_no}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <small className="text-muted">Gender</small>
                        <div className="fw-medium">{product.gender}</div>
                      </div>
                      <div className="col-sm-6">
                        <small className="text-muted">Type</small>
                        <div className="fw-medium">{product.type}</div>
                      </div>
                      <div className="col-sm-6">
                        <small className="text-muted">Category</small>
                        <div className="fw-medium">
                          {product.category?.cateogry}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <small className="text-muted">Sub Category</small>
                        <div className="fw-medium">
                          {product.sub_category?.sub_cateogry}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <small className="text-muted">Age Group</small>
                        <div className="fw-medium">
                          {currentProduct?.age_group || product.age_group || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Warranty Information */}
            {(currentProduct?.warrantee_name || product.warrantee_name) && (
              <div className="mb-3">
                <div className="border rounded p-3 bg-light">
                  <h6 className="fw-semibold mb-2" style={{ color: "#0f1111" }}>
                    <BsShield className="me-2" />
                    Warranty Information
                  </h6>
                  <div className="row g-2 small">
                    <div className="col-sm-6">
                      <span className="text-muted">Provider:</span>
                      <div className="fw-medium">
                        {currentProduct?.warrantee_name || product.warrantee_name}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted">Period:</span>
                      <div className="fw-medium">
                        {currentProduct?.warranty_period || product.warranty_period} months
                      </div>
                    </div>
                    {(currentProduct?.terms || product.terms) && (
                      <div className="col-12">
                        <span className="text-muted">Terms:</span>
                        <div className="small">
                          {currentProduct?.terms || product.terms}
                        </div>
                      </div>
                    )}
                    {(currentProduct?.remarks || product.remarks) && (
                      <div className="col-12">
                        <span className="text-muted">Remarks:</span>
                        <div className="small">
                          {currentProduct?.remarks || product.remarks}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default GlassView;