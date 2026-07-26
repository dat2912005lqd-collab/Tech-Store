class OrderService{
    checkout(cart:any){
        return Promise.resolve({
            success:true,
            orderId:Date.now(),cart
        });
    }
}
export default new OrderService();