import { NextResponse } from 'next/server';
import { getCustomersStore, updateCustomerStore, deleteCustomerStore } from '@/lib/db/db-adapter';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const customers = await getCustomersStore();
    const customer = customers.find((c) => c.id === params.id);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    return NextResponse.json({ data: customer });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customer' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const updated = await updateCustomerStore({ id: params.id, ...body });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteCustomerStore(params.id);
    return NextResponse.json({ success: true, message: 'Customer deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 });
  }
}
