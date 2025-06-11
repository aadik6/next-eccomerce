"use client";
import React,{createContext,useContext,useState} from 'react';

//create context
const CartContext = createContext();

//create custom hook to use the CartContext
export const useCart  = ()=> useContext(CartContext);
//create provider
export const CartProvider = ({ children }) => {
    const [cart,setCart] = useState([]);
    const [totalPrice,setTotalPrice] = useState(0);
    const [totalItems,setTotalItems] = useState(0);
    const addToCart = (product,quantity=1) => {
        setCart((prevCart) => {
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { ...product, quantity }];
            }
        });
    }
    const removeFromCart = (productId) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== productId));
    }
    const clearCart = () => {
        setCart([]);
    }
    const updateQuantity = (productId, quantity) => {
        setCart((prevCart) =>
            prevCart.map(item =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    }
    const calculateTotal = () => {
        const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
        setTotalPrice(total);
        setTotalItems(cart.reduce((acc, item) => acc + item.quantity, 0));
    }
    // Recalculate total whenever cart changes
    React.useEffect(() => {
        calculateTotal();
    }, [cart]);
    return (
        <CartContext.Provider value={{ cart, totalPrice, totalItems, addToCart, removeFromCart, clearCart, updateQuantity }}>
            {children}
        </CartContext.Provider>
    );
}

