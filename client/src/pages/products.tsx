import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ProductCard from '@/components/product-card';
import { Grid, List, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Product } from '@/types';

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', searchQuery, selectedCategory],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await apiRequest('GET', `/api/products?${params}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json() as Promise<Product[]>;
    },
  });

  const categories = [
    'Electronics',
    'Clothing',
    'Books',
    'Home & Garden',
    'Sports & Fitness',
  ];

  const priceRanges = [
    { label: 'Under ₹1,000', value: 'under-1000', min: 0, max: 999 },
    { label: '₹1,000 - ₹5,000', value: '1000-5000', min: 1000, max: 4999 },
    { label: '₹5,000 - ₹20,000', value: '5000-20000', min: 5000, max: 19999 },
    { label: '₹20,000 - ₹50,000', value: '20000-50000', min: 20000, max: 49999 },
    { label: 'Over ₹50,000', value: 'over-50000', min: 50000, max: Infinity },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(searchQuery ? { search: searchQuery } : {});
  };

  // Filter products based on price ranges
  const filteredProducts = products.filter((product: Product) => {
    const price = Number(product.price);
    
    // Category filter
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    
    // Price range filter
    if (selectedPriceRanges.length > 0) {
      const matchesPriceRange = selectedPriceRanges.some(rangeValue => {
        const range = priceRanges.find(r => r.value === rangeValue);
        if (!range) return false;
        return price >= range.min && price <= range.max;
      });
      if (!matchesPriceRange) return false;
    }
    
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return Number(a.price) - Number(b.price);
      case 'price-high':
        return Number(b.price) - Number(a.price);
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-secondary mb-4">Filters</h3>
              
              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-secondary mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <div key={range.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={range.value}
                        checked={selectedPriceRanges.includes(range.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedPriceRanges([...selectedPriceRanges, range.value]);
                          } else {
                            setSelectedPriceRanges(selectedPriceRanges.filter(r => r !== range.value));
                          }
                        }}
                      />
                      <label htmlFor={range.value} className="text-sm">
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-secondary mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category} className="flex items-center space-x-2">
                      <Checkbox 
                        id={category}
                        checked={selectedCategory === category}
                        onCheckedChange={(checked) => {
                          setSelectedCategory(checked ? category : '');
                        }}
                      />
                      <label htmlFor={category} className="text-sm">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedPriceRanges([]);
                }}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Search and Sort Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <div className="flex-1 max-w-md">
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </form>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Sort by: Featured</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border border-gray-300 rounded-lg">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-gray-100' : ''}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-gray-100' : ''}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products Results */}
          <div className="mb-4">
            <p className="text-gray-600">
              {isLoading ? 'Loading...' : `Showing ${sortedProducts.length} products`}
            </p>
          </div>

          {/* Products Grid */}
          {sortedProducts.length === 0 ? (
            <div className="text-center text-gray-500 py-12">No products found.</div>
          ) : (
            <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6' : 'grid-cols-1 gap-4'}`}>
              {sortedProducts.map((product: Product) => (
                <ProductCard key={product.id} product={product} showBadge={product.stock <= 10} badgeText={product.stock <= 10 ? 'Low Stock' : undefined} badgeVariant="destructive" />
              ))}
            </div>
          )}

          {/* Pagination */}
          {sortedProducts.length > 0 && (
            <div className="flex items-center justify-center mt-12">
              <nav className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="default" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <span className="px-2">...</span>
                <Button variant="outline" size="sm">42</Button>
                <Button variant="outline" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
