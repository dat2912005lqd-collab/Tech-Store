import React from 'react';

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
}

const CartSummary = ({ subtotal, shipping, total }: CartSummaryProps) => (
  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
    <div className="flex justify-between text-sm"><span>Tạm tính</span><span>${subtotal}</span></div>
    <div className="mt-2 flex justify-between text-sm"><span>Phí ship</span><span>${shipping}</span></div>
    <div className="mt-3 flex justify-between border-t pt-3 font-semibold"><span>Tổng</span><span>${total}</span></div>
  </div>
);

export default CartSummary;