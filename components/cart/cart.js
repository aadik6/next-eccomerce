import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Cart = () => {
  return (
    <div>
      <a
        class="btn btn-primary"
        data-bs-toggle="offcanvas"
        href="#offcanvasExample"
        role="button"
        aria-controls="offcanvasExample"
      >
        Cart
      </a>

      <div
        class="offcanvas offcanvas-end"
        tabindex="-1"
        id="offcanvasExample"
        aria-labelledby="offcanvasExampleLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasExampleLabel">
            Cart
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body">
          <div>
            Some text as placeholder. In real life you can have the elements you
            have chosen. Like, text, images, lists, etc.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
