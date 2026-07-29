const API_URL='http://localhost:5000/api/carts';
const cartService = {
    loadCarts:async() => {
        const res=await fetch(API_URL);
        return res.json();
    },

    loadCartById:async(id:number) => {
        const res=await fetch(`${API_URL}/${id}`);
        return res.json()
    },
    
    loadCartsByUserId:async(userId: number) => {
        const res=await fetch(`${API_URL}?userId=${userId}`);
        return res.json()
    },
    createCart:async(cart: any) => {
        const res=await fetch(API_URL,{
            method:"POST",
            headers:{'Content-Type':'/application/json'},
            body:JSON.stringify(cart)
        });
        return res.json()
    },

    updateCart:async(id: number, cart: any) => {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cart)
        });
        return res.json();
    },

    deleteCart:async(id: number) => {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        return res.json();
    },
}
export default cartService;