import { getMongoClient } from './mongodb';
import { initialMockCustomers, initialSavedFilters } from './mock-db';
import { Customer, CreateCustomerInput, UpdateCustomerInput } from '@/types/customer/entity';
import { SavedFilterPreset } from '@/types/filter/preset';

let memoryCustomers: Customer[] = [...initialMockCustomers];
let memorySavedFilters: SavedFilterPreset[] = [...initialSavedFilters];

export async function getCustomersStore(): Promise<Customer[]> {
  if (process.env.MONGODB_URI) {
    try {
      const client = await getMongoClient();
      const db = client.db('crm_db');
      const docs = await db.collection<Customer>('customers').find({}).toArray();
      if (docs && docs.length > 0) {
        return docs.map(({ _id, ...rest }) => rest as Customer);
      }
    } catch (err) {
      console.warn('⚠️ MongoDB fetch failed, using in-memory store:', err);
    }
  }

  return memoryCustomers;
}

export async function createCustomerStore(input: CreateCustomerInput): Promise<Customer> {
  const newCustomer: Customer = {
    id: `cust-${Date.now()}`,
    ...input,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    avatarUrl: undefined,
  };

  if (process.env.MONGODB_URI) {
    try {
      const client = await getMongoClient();
      const db = client.db('crm_db');
      await db.collection('customers').insertOne(newCustomer as any);
      return newCustomer;
    } catch (err) {
      console.warn('⚠️ MongoDB create failed, storing in memory:', err);
    }
  }

  memoryCustomers = [newCustomer, ...memoryCustomers];
  return newCustomer;
}

export async function updateCustomerStore(input: UpdateCustomerInput): Promise<Customer> {
  const index = memoryCustomers.findIndex((c) => c.id === input.id);
  const existing = index !== -1 ? memoryCustomers[index] : null;

  const updated: Customer = {
    ...(existing || ({ id: input.id } as Customer)),
    ...input,
    updatedAt: new Date().toISOString(),
  };

  if (process.env.MONGODB_URI) {
    try {
      const client = await getMongoClient();
      const db = client.db('crm_db');
      await db.collection('customers').updateOne({ id: input.id }, { $set: updated }, { upsert: true });
      return updated;
    } catch (err) {
      console.warn('⚠️ MongoDB update failed, storing in memory:', err);
    }
  }

  if (index !== -1) {
    memoryCustomers[index] = updated;
  } else {
    memoryCustomers.unshift(updated);
  }

  return updated;
}

export async function deleteCustomerStore(id: string): Promise<boolean> {
  if (process.env.MONGODB_URI) {
    try {
      const client = await getMongoClient();
      const db = client.db('crm_db');
      await db.collection('customers').deleteOne({ id });
      return true;
    } catch (err) {
      console.warn('⚠️ MongoDB delete failed, deleting from memory:', err);
    }
  }

  memoryCustomers = memoryCustomers.filter((c) => c.id !== id);
  return true;
}

export async function getSavedFiltersStore(): Promise<SavedFilterPreset[]> {
  return memorySavedFilters;
}

export async function saveFilterPresetStore(name: string, filterState: any): Promise<SavedFilterPreset> {
  const newFilter: SavedFilterPreset = {
    id: `flt-${Date.now()}`,
    name,
    filterState,
    order: memorySavedFilters.length,
  };
  memorySavedFilters.push(newFilter);
  return newFilter;
}

export async function reorderSavedFiltersStore(orderedIds: string[]): Promise<SavedFilterPreset[]> {
  const map = new Map(memorySavedFilters.map((f) => [f.id, f]));
  const reordered: SavedFilterPreset[] = [];

  orderedIds.forEach((id, index) => {
    const item = map.get(id);
    if (item) {
      item.order = index;
      reordered.push(item);
    }
  });

  memorySavedFilters = reordered;
  return memorySavedFilters;
}
