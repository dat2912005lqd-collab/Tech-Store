import React from 'react';

interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface CartListProps {
  items: CartItem[];
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
  onRemove?: (id: string) => void;
}

const CartList = ({ items, onIncrease, onDecrease, onRemove }: CartListProps) => (
  <div className="space-y-3">
    {items.map((item) => (
      <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
        <div>
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-slate-500">${item.price} x {item.quantity}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onDecrease?.(item.id)} className="h-8 w-8 rounded border">−</button>
          <span className="min-w-6 text-center">{item.quantity}</span>
          <button onClick={() => onIncrease?.(item.id)} className="h-8 w-8 rounded border">+</button>
          <button onClick={() => onRemove?.(item.id)} className="ml-2 text-sm text-red-600">Xóa</button>
        </div>
      </div>
    ))}
  </div>
);

export default CartList;