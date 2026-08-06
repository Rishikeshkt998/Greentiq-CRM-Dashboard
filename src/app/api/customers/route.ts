import { NextResponse, type NextRequest } from 'next/server';
import { getCustomersStore, createCustomerStore } from '@/lib/db/db-adapter';
import { filterQuerySchema, customerSchema } from '@/schemas';
import { env } from '@/config/env';
import { Customer } from '@/types/customer/entity';

export async function GET(request: NextRequest) {
  try {
    if (env.ENABLE_MOCK_DELAY) {
      await new Promise((resolve) => setTimeout(resolve, env.MOCK_API_SIMULATED_LATENCY_MS));
    }

    const { searchParams } = new URL(request.url);

    const rawParams = {
      search: searchParams.get('search') || '',
      statuses: searchParams.getAll('statuses[]').length
        ? searchParams.getAll('statuses[]')
        : searchParams.get('status')
        ? [searchParams.get('status')]
        : [],
      companies: searchParams.getAll('companies[]').length
        ? searchParams.getAll('companies[]')
        : searchParams.get('company')
        ? [searchParams.get('company')]
        : [],
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      phone: searchParams.get('phone') || '',
      email: searchParams.get('email') || '',
      sortBy: searchParams.get('sortBy') || 'name',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || env.NEXT_PUBLIC_DEFAULT_PAGE_SIZE,
    };

    const query = filterQuerySchema.parse(rawParams);
    const rawCustomers = await getCustomersStore();

    // 100% Unique Customers Map (Guarantees 1 user per row)
    const uniqueMap = new Map<string, Customer>();
    rawCustomers.forEach((c) => {
      const key = (c.email || c.name || c.id).toLowerCase().trim();
      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, c);
      }
    });
    const allCustomers = Array.from(uniqueMap.values());

    // Available companies list for dropdowns
    const availableCompanies = Array.from(new Set(allCustomers.map((c) => c.company))).sort();

    // 1. Apply Filtering
    let filtered = allCustomers.filter((item) => {
      // Search match (name, email, or company)
      if (query.search) {
        const q = query.search.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesEmail = item.email.toLowerCase().includes(q);
        const matchesCompany = item.company.toLowerCase().includes(q);
        if (!matchesName && !matchesEmail && !matchesCompany) return false;
      }

      // Statuses filter
      if (query.statuses && query.statuses.length > 0) {
        if (!query.statuses.includes(item.status)) return false;
      }

      // Companies filter
      if (query.companies && query.companies.length > 0) {
        if (!query.companies.includes(item.company)) return false;
      }

      // Phone filter (partial match)
      if (query.phone) {
        if (!item.phone.replace(/\D/g, '').includes(query.phone.replace(/\D/g, ''))) return false;
      }

      // Email filter (partial match)
      if (query.email) {
        if (!item.email.toLowerCase().includes(query.email.toLowerCase())) return false;
      }

      // Date Range Filter
      if (query.dateFrom) {
        if (new Date(item.lastContactDate) < new Date(query.dateFrom)) return false;
      }
      if (query.dateTo) {
        if (new Date(item.lastContactDate) > new Date(query.dateTo)) return false;
      }

      return true;
    });

    // 2. Apply Sorting
    filtered.sort((a, b) => {
      let fieldA = (a as any)[query.sortBy] || '';
      let fieldB = (b as any)[query.sortBy] || '';

      if (query.sortBy === 'lastContactDate') {
        fieldA = new Date(fieldA).getTime();
        fieldB = new Date(fieldB).getTime();
      } else if (typeof fieldA === 'string') {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }

      if (fieldA < fieldB) return query.sortOrder === 'asc' ? -1 : 1;
      if (fieldA > fieldB) return query.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    // 3. Apply Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / query.pageSize) || 1;
    const currentPage = Math.min(Math.max(1, query.page), totalPages);
    const startIndex = (currentPage - 1) * query.pageSize;
    const paginatedItems = filtered.slice(startIndex, startIndex + query.pageSize);

    return NextResponse.json({
      data: paginatedItems,
      meta: {
        total,
        page: currentPage,
        pageSize: query.pageSize,
        totalPages,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      },
      availableCompanies,
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = customerSchema.parse(body);

    const created = await createCustomerStore(validatedData);

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.errors ? error.errors[0]?.message : 'Validation failed' },
      { status: 400 }
    );
  }
}
