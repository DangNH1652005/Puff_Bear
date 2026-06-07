import CartItem from "./CartItem";

const CartList = ({ cartItems }) => {
    return (
        <div className="d-flex flex-column gap-3">
            {cartItems.map((item) => (
                <CartItem
                    key={item.id}
                    item={item}
                />
            ))}
        </div>
    );
};

export default CartList;