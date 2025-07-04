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
// import { getDataFetch } from "@/app/all/insert";
// import { FRONTEND_URL } from "@/config/config";
// import { useCart } from "@/app/components/addtocart/CartContext";
import MediaViewer from "../mediaViewer/mediaViewer";
import axios from "axios";

// const VirtualTryOn = dynamic(() => import("./VirtualTryOn"), {
//   ssr: false,
// });

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
  const [activeTab, setActiveTab] = useState("product");
//   const { addToCart, cartItems } = useCart();

  const fetchGlassesDetails = async () => {
    try {
      setLoading(true);
      const api = "http://13.218.77.210:7200/frame/product-details";
      const res = await axios.post(api, { slug });

      if (res.data && res.data.product) {
        setProductData(res.data);
        // Set main image from feature_images or first available image
        const images = res.data.product.feature_images || [];
        if (images.length > 0) {
          setMainImage(images[0].path);
        }
        // Set default variant if available
        if (res.data.variants && res.data.variants.length > 0) {
          const defaultVariant =
            res.data.variants.find((v) => v.is_default) || res.data.variants[0];
          setSelectedVariant(defaultVariant);
        }
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
    if (activeTab === "variant" && selectedVariant) {
      return selectedVariant;
    }
    return productData?.product;
  };

  const getDisplayImages = () => {
    const current = getCurrentProduct();
    if (!current) return [];

    if (activeTab === "variant" && selectedVariant) {
      return selectedVariant.images || [];
    }

    const featureImages = productData?.product.feature_images || [];
    const regularImages = productData?.product.images || [];
    const metaImages = productData?.product.meta_images || [];
    return [...featureImages, ...regularImages, ...metaImages];
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
        // For cashback, show original price but mention cashback
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

  const handleVariantSelect = (variant) => {
    setSelectedVariant(variant);
    setActiveTab("variant");
    setQuantity(variant.min_qty || 1);
    // Update main image if variant has images
    if (variant.images && variant.images.length > 0) {
      setMainImage(variant.images[0].path);
    }
  };

  const handleAddToCart = () => {
    const currentProduct = getCurrentProduct();
    if (!currentProduct) return;

    const pricing = calculateDiscountedPrice(currentProduct);

    // addToCart({
    //   id: currentProduct.id,
    //   name: currentProduct.name || currentProduct.model_no,
    //   image:
    //     currentProduct.images?.[0]?.path ||
    //     currentProduct.feature_images?.[0]?.path ||
    //     "/placeholder.jpg",
    //   slug,
    //   price: pricing.discounted.toFixed(2),
    //   quantity,
    // });
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
//   const isInCart = cartItems?.some?.(
//     (item) => item.id === currentProduct.id && item.quantity > 0
//   );

  return (
    <div className="container my-5">
      <div className="row">
        {/* Media Section with our new component */}
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
          />
        </div>

        {/* Product Details */}
        <div className="col-lg-6">
          <div className="p-3">
            {/* Product/Variant Tabs */}
            {variants && variants.length > 0 && (
              <div className="mb-4">
                <ul className="nav nav-pills nav-fill">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "product" ? "active" : ""
                      }`}
                      style={
                        activeTab === "product"
                          ? {
                              backgroundColor: "var(--primary-bg-color)",
                              color: "var(--light-txt-color)",
                            }
                          : { color: "var(--primary-bg-color)" }
                      }
                      onClick={() => {
                        setActiveTab("product");
                        setSelectedVariant(null);
                        setQuantity(product.min_qty || 1);
                        if (
                          product.feature_images &&
                          product.feature_images.length > 0
                        ) {
                          setMainImage(product.feature_images[0].path);
                        }
                      }}
                    >
                      Main Product
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "variant" ? "active" : ""
                      }`}
                      style={
                        activeTab === "variant"
                          ? {
                              backgroundColor: "var(--primary-bg-color)",
                              color: "var(--light-txt-color)",
                            }
                          : { color: "var(--primary-bg-color)" }
                      }
                      onClick={() => {
                        if (!selectedVariant && variants.length > 0) {
                          handleVariantSelect(variants[0]);
                        } else {
                          setActiveTab("variant");
                        }
                      }}
                    >
                      Variants ({variants.length})
                    </button>
                  </li>
                </ul>
              </div>
            )}

            {/* Variant Selection */}
            {activeTab === "variant" && variants && variants.length > 0 && (
              <div className="mb-4">
                <h6 className="fw-semibold mb-3 text-dark">Select Variant:</h6>
                <div className="row g-3">
                  {variants.map((variant) => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <div key={variant.id} className="col-12">
                        <div
                          className={`d-flex flex-column justify-content-center border rounded-3 p-3`}
                          style={{
                            cursor: "pointer",
                            borderColor: isSelected
                              ? "var(--primary-bg-color:)"
                              : "#dee2e6",
                            borderWidth: "2px",
                            borderStyle: "solid",
                            backgroundColor: isSelected
                              ? "var(--primary-200-color)"
                              : "var(--light-txt-color)",
                            minHeight: "80px",
                          }}
                          onClick={() => handleVariantSelect(variant)}
                        >
                          <div className="row align-items-center">
                            <div className="col-auto" style={{ width: "24px" }}>
                              {isSelected && (
                                <BsCheck2 className="text-primary" size={20} />
                              )}
                            </div>
                            <div className="col">
                              <div className="fw-medium text-dark">
                                {variant.model_no}
                              </div>
                              <small className="text-muted">
                                Size: {variant.lenth}×{variant.width}×
                                {variant.height}mm
                              </small>
                            </div>
                            <div className="col-auto text-end">
                              <div className="fw-bold text-dark">
                                ₹{variant.amount}
                              </div>
                              {variant.discount_amount && (
                                <small className="d-block mt-1 text-success">
                                  {variant.discount_type === "cashback"
                                    ? "Cashback"
                                    : "Discount"}
                                  : ₹{variant.discount_amount}
                                </small>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Product Title & Info */}
            <div className="mb-3">
              <h1 className="h3 fw-bold mb-2">{product.name}</h1>
              <p className="text-muted mb-1">
                Model: {currentProduct?.model_no}
              </p>
              <p className="text-muted small mb-0">
                Gender: {product.gender} | Type: {product.type}
              </p>
            </div>

            {/* Price Section */}
            <div className="mb-4">
              <div className="d-flex align-items-center gap-3 mb-2">
                <span className="h4 fw-bold text-success mb-0">
                  ₹{pricing.discounted.toFixed(2)}
                </span>
                {pricing.discount > 0 && (
                  <>
                    <span className="text-decoration-line-through text-muted">
                      ₹{pricing.original.toFixed(2)}
                    </span>
                    <span className="badge bg-danger">
                      {pricing.discount}% OFF
                    </span>
                  </>
                )}
                {pricing.cashback > 0 && (
                  <span className="badge bg-success">
                    ₹{pricing.cashback} Cashback
                  </span>
                )}
              </div>
              <small className="text-muted">
                Tax: {currentProduct?.tax || product.tax} | Unit:{" "}
                {currentProduct?.unit || product.unit}
              </small>
            </div>

            {/* Product Details */}
            {product.details && (
              <div className="mb-4">
                <div
                  className="text-muted"
                  dangerouslySetInnerHTML={{ __html: product.details }}
                />
              </div>
            )}

            {/* Dimensions */}
            <div className="mb-4">
              <h6 className="fw-semibold mb-2">Dimensions:</h6>
              <div className="row g-2">
                <div className="col-4">
                  <div className="border rounded p-2 text-center">
                    <small className="text-muted d-block">Length</small>
                    <strong>{currentProduct?.lenth}mm</strong>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border rounded p-2 text-center">
                    <small className="text-muted d-block">Width</small>
                    <strong>{currentProduct?.width}mm</strong>
                  </div>
                </div>
                <div className="col-4">
                  <div className="border rounded p-2 text-center">
                    <small className="text-muted d-block">Height</small>
                    <strong>{currentProduct?.height}mm</strong>
                  </div>
                </div>
              </div>
              {currentProduct?.weight && (
                <div className="mt-2 text-center">
                  <small className="text-muted">
                    Weight: <strong>{currentProduct.weight}</strong>
                  </small>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="mb-4">
              <label className="form-label fw-semibold">Quantity</label>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= (currentProduct?.min_qty || 1)}
                >
                  <BsDash />
                </button>
                <span
                  className="px-3 py-1 border rounded text-center"
                  style={{ minWidth: "60px" }}
                >
                  {quantity}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (currentProduct?.max_qty || 999)}
                >
                  <BsPlus />
                </button>
                <small className="text-muted ms-2">
                  Range: {currentProduct?.min_qty || 1} -{" "}
                  {currentProduct?.max_qty || 999}
                </small>
              </div>
            </div>

            {/* Stock & Availability */}
            <div className="mb-4">
              <div className="d-flex flex-wrap-wrap gap-2">
                <div className="">
                  {product.current_stock > 0 ? (
                    <span className="badge bg-success p-2">
                      In Stock ({product.current_stock})
                    </span>
                  ) : (
                    <span className="badge bg-danger py-2">Out of Stock</span>
                  )}
                </div>
                <div className="">
                  {currentProduct?.refundable ? (
                    <span className="badge bg-info py-2 text-dark">
                      <BsShield className="me-1" />
                      Refundable
                    </span>
                  ) : (
                    <span className="badge bg-secondary py-2">
                      Non-Refundable
                    </span>
                  )}
                </div>
                {product.featured && (
                  <div className="">
                    <span className="badge bg-primary ">Featured Product</span>
                  </div>
                )}
                <div className="">
                  {(currentProduct?.suggesting || product.suggesting) && (
                    <span
                      className="badge py-2"
                      style={{
                        background: "var(--primary-600-color)",
                        color: "var(--light-txt-color)",
                      }}
                    >
                      Recommended
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex gap-2 mb-4">
              <button
                className="btn btn-primary flex-fill py-2"
                onClick={() => setShowTryOn(true)}
                disabled={!mainImage}
              >
                <BsCamera className="me-2" /> Try On
              </button>
              
                <button
                  className="btn btn-warning flex-fill py-2"
                  disabled={product.current_stock <= 0}
                  onClick={handleAddToCart}
                >
                  <BsCart3 className="me-2" /> Add to Cart
                </button>
             
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-4">
                <h6 className="fw-semibold mb-2">Tags:</h6>
                <div className="d-flex flex-wrap gap-1">
                  {product.tags.map((tag, idx) => (
                    <span key={idx} className="badge bg-light text-dark border">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Specifications Accordion */}
            <div className="accordion mb-3" id="techInfoAccordion">
              <div className="accordion-item border rounded">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button py-3 px-3 collapsed"
                    type="button"
                    onClick={() => toggleAccordion(0)}
                    aria-expanded={expandedAccordion === 0}
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
                        <small className="text-muted">Product ID</small>
                        <div className="fw-medium">
                          {currentProduct?.id || product.id}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <small className="text-muted">Model Number</small>
                        <div className="fw-medium">
                          {currentProduct?.model_no}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <small className="text-muted">Frame Type ID</small>
                        <div className="fw-medium">{product.frame_type_id}</div>
                      </div>
                      <div className="col-sm-6">
                        <small className="text-muted">Brand ID</small>
                        <div className="fw-medium">{product.brand_id}</div>
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
                          {currentProduct?.age_group ||
                            product.age_group ||
                            "N/A"}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <small className="text-muted">Material ID</small>
                        <div className="fw-medium">
                          {currentProduct?.material_of_product_id ||
                            product.material_of_product_id}
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
                <div className="border rounded p-3">
                  <h6 className="fw-semibold mb-2">
                    <BsShield className="me-2" />
                    Warranty Information
                  </h6>
                  <div className="row g-2 small">
                    <div className="col-sm-6">
                      <span className="text-muted">Provider:</span>
                      <div className="fw-medium">
                        {currentProduct?.warrantee_name ||
                          product.warrantee_name}
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <span className="text-muted">Period:</span>
                      <div className="fw-medium">
                        {currentProduct?.warranty_period ||
                          product.warranty_period}{" "}
                        months
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

      {/* Virtual Try-On Modal */}
      {/* {showTryOn && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1050 }}
            onClick={() => setShowTryOn(false)}
          ></div>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ zIndex: 1055 }}
            aria-modal="true"
          >
            <div
              className="modal-dialog modal-lg modal-dialog-centered"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <div className="d-flex flex-column">
                    <h5 className="modal-title">Virtual Try-On</h5>
                    <div className="small text-muted">
                      {product.name}{" "}
                      {activeTab === "variant" && selectedVariant
                        ? `- ${selectedVariant.model_no}`
                        : ""}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setShowTryOn(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <VirtualTryOn glassesImage={mainImage} show={showTryOn} />
                </div>
              </div>
            </div>
          </div>
        </>
      )} */}
    </div>
  );
};

export default GlassView;
