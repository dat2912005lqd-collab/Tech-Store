import React from 'react';

interface CheckoutValue {
  name: string;
  address: string;
  phone: string;
}

interface CheckoutFormProps {
  value: CheckoutValue;
  onChange: (next: CheckoutValue) => void;
  onSubmit?: () => void;
}

const CheckoutForm = ({ value, onChange, onSubmit }: CheckoutFormProps) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      onSubmit?.();
    }}
    className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
  >
    <input value={value.name} onChange={(e) => onChange({ ...value, name: e.target.value })} placeholder="Tên người nhận" className="w-full rounded-md border px-3 py-2" />
    <input value={value.address} onChange={(e) => onChange({ ...value, address: e.target.value })} placeholder="Địa chỉ" className="w-full rounded-md border px-3 py-2" />
    <input value={value.phone} onChange={(e) => onChange({ ...value, phone: e.target.value })} placeholder="Số điện thoại" className="w-full rounded-md border px-3 py-2" />
    <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white">Đặt hàng</button>
  </form>
);

export default CheckoutForm;