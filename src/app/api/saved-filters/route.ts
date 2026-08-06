import { NextResponse } from 'next/server';
import { getSavedFiltersStore, saveFilterPresetStore, reorderSavedFiltersStore } from '@/lib/db/db-adapter';

export async function GET() {
  try {
    const filters = await getSavedFiltersStore();
    return NextResponse.json({ data: filters });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch saved filters' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { name, filterState } = await request.json();
    if (!name) {
      return NextResponse.json({ error: 'Filter name is required' }, { status: 400 });
    }
    const created = await saveFilterPresetStore(name, filterState);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save filter' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { orderedIds } = await request.json();
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds array required' }, { status: 400 });
    }
    const reordered = await reorderSavedFiltersStore(orderedIds);
    return NextResponse.json({ success: true, data: reordered });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reorder filters' }, { status: 500 });
  }
}
