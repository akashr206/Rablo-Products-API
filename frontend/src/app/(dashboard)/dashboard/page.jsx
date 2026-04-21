"use client";

import { useState, useEffect, useCallback } from "react";
import { productApi } from "@/lib/api";
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit2,
    Trash2,
    Star,
    DollarSign,
    Package,
    Loader2,
    Edit,
    RefreshCw,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function DashboardPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [filterType, setFilterType] = useState("all");
    const [filterValue, setFilterValue] = useState("");
    const [tempPrice, setTempPrice] = useState("");
    const [tempRating, setTempRating] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalProducts: 0,
        limit: 10,
    });
    const [searchQuery, setSearchQuery] = useState("");
    const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

    const [formData, setFormData] = useState({
        productId: "",
        name: "",
        price: "",
        featured: false,
        rating: "",
        company: "",
    });

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            let data;
            const params = { page: currentPage, limit: 10 };
            if (filterType === "featured") {
                data = await productApi.getFeatured(params);
            } else if (filterType === "price" && filterValue) {
                data = await productApi.getByPrice(filterValue, params);
            } else if (filterType === "rating" && filterValue) {
                data = await productApi.getByRating(filterValue, params);
            } else {
                data = await productApi.getAll(params);
            }

            setProducts(data.products || []);
            setPagination({
                totalPages: data.totalPages || 1,
                totalProducts: data.totalProducts || 0,
                limit: data.limit || 10,
            });
        } catch (error) {
            toast.error("Failed to fetch products");
            setProducts([]);
        } finally {
            setLoading(false);
        }
    }, [filterType, filterValue, currentPage]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filterType, filterValue]);

    const handleOpenDialog = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                productId: product.productId,
                name: product.name,
                price: product.price,
                featured: product.featured,
                rating: product.rating?.$numberDecimal || product.rating || 0,
                company: product.company,
            });
        } else {
            setEditingProduct(null);
            setFormData({
                productId: `PROD${Math.floor(Math.random() * 10000)}`,
                name: "",
                price: "",
                featured: false,
                rating: 0,
                company: "",
            });
        }
        setDialogOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                await productApi.update(editingProduct.productId, formData);
                toast.success("Product updated successfully");
            } else {
                await productApi.add(formData);
                toast.success("Product added successfully");
            }
            setDialogOpen(false);
            fetchProducts();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                await productApi.delete(id);
                toast.success("Product deleted");
                fetchProducts();
            } catch (error) {
                toast.error("Failed to delete product");
            }
        }
    };

    const clearFilters = () => {
        setFilterType("all");
        setFilterValue("");
        setTempPrice("");
        setTempRating("");
        setSearchQuery("");
    };

    const filteredProducts = products.filter((product) => {
        const query = searchQuery.toLowerCase();
        return (
            product.name?.toLowerCase().includes(query) ||
            product.company?.toLowerCase().includes(query) ||
            product.productId?.toLowerCase().includes(query)
        );
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div>
                    <Badge
                        variant="outline"
                        className="mb-2 px-2 py-0.5 border-slate-200 text-slate-500 font-medium"
                    >
                        Inventory Dashboard
                    </Badge>
                    <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
                        Product Catalog
                    </h1>
                    <p className="text-slate-500 max-w-md">
                        Manage your inventory with advanced filtering and
                        real-time updates.
                    </p>
                </div>
                <Button
                    onClick={() => handleOpenDialog()}
                    size="lg"
                    className="bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200 transform transition-all active:scale-95 gap-2"
                >
                    <Plus className="h-5 w-5" /> Add New Product
                </Button>
            </div>

            <div className="space-y-4">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                        <Input
                            placeholder="Search products, companies, or IDs..."
                            className="pl-11 h-12 bg-white border-slate-200 shadow-sm focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 rounded-xl transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                        <Button
                            variant={
                                filterType === "all" ? "default" : "outline"
                            }
                            onClick={() => {
                                setFilterType("all");
                                setFilterValue("");
                            }}
                            className={`rounded-full px-5 h-10 gap-2 transition-all ${filterType === "all" ? "bg-slate-900 shadow-lg shadow-slate-200" : "bg-white border-slate-200 text-slate-600"}`}
                        >
                            <Package className="h-4 w-4" /> All
                        </Button>
                        <Button
                            variant={
                                filterType === "featured"
                                    ? "default"
                                    : "outline"
                            }
                            onClick={() => {
                                setFilterType("featured");
                                setFilterValue("");
                            }}
                            className={`rounded-full px-5 h-10 gap-2 transition-all ${filterType === "featured" ? "bg-slate-900 shadow-lg shadow-slate-200" : "bg-white border-slate-200 text-slate-600"}`}
                        >
                            <Star className="h-4 w-4" /> Featured
                        </Button>
                        <Button
                            variant={
                                isFilterPanelOpen ? "secondary" : "outline"
                            }
                            onClick={() =>
                                setIsFilterPanelOpen(!isFilterPanelOpen)
                            }
                            className={`rounded-full px-5 h-10 gap-2 border-slate-200 bg-white transition-all ${isFilterPanelOpen ? "ring-2 ring-slate-400" : ""}`}
                        >
                            <Filter className="h-4 w-4" /> Filter Options
                        </Button>
                        {(filterType !== "all" || searchQuery) && (
                            <Button
                                variant="ghost"
                                onClick={clearFilters}
                                className="text-slate-400 hover:text-red-500 h-10 px-4"
                            >
                                Reset
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={fetchProducts}
                            disabled={loading}
                            className="h-10 w-10 border-slate-200 text-slate-600 shrink-0 bg-white"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>

                {isFilterPanelOpen && (
                    <Card className="border-slate-200 bg-white/80 backdrop-blur-md shadow-lg rounded-2xl animate-in slide-in-from-top-4 duration-300 overflow-hidden">
                        <CardHeader className="py-3 px-6 bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-sm font-bold text-slate-700">
                                Advanced Filter Configuration
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div
                                    className={`space-y-3 p-4 rounded-xl transition-all ${filterType === "price" ? "bg-slate-100/50 ring-1 ring-slate-200" : "hover:bg-slate-50"}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`p-2 rounded-lg ${filterType === "price" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"}`}
                                        >
                                            <DollarSign className="h-4 w-4" />
                                        </div>
                                        <Label className="font-bold">
                                            Price Filter
                                        </Label>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Show products with price less than the
                                        value
                                    </p>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            placeholder="Max Price (₹)"
                                            value={tempPrice}
                                            onChange={(e) =>
                                                setTempPrice(e.target.value)
                                            }
                                            className="bg-white border-slate-200"
                                        />
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setFilterType("price");
                                                setFilterValue(tempPrice);
                                            }}
                                            className="bg-slate-900"
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </div>

                                <div
                                    className={`space-y-3 p-4 rounded-xl transition-all ${filterType === "rating" ? "bg-slate-100/50 ring-1 ring-slate-200" : "hover:bg-slate-50"}`}
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`p-2 rounded-lg ${filterType === "rating" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"}`}
                                        >
                                            <Star className="h-4 w-4" />
                                        </div>
                                        <Label className="font-bold">
                                            Rating Filter
                                        </Label>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Show products with rating higher than
                                        the value
                                    </p>
                                    <div className="flex gap-2">
                                        <Input
                                            type="number"
                                            step="0.1"
                                            placeholder="Min Rating (0.0 - 5.0)"
                                            value={tempRating}
                                            onChange={(e) =>
                                                setTempRating(e.target.value)
                                            }
                                            className="bg-white border-slate-200"
                                        />
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                setFilterType("rating");
                                                setFilterValue(tempRating);
                                            }}
                                            className="bg-slate-900"
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Card className="border-slate-200/60 shadow-xl shadow-slate-100 overflow-hidden bg-white rounded-2xl">
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                                <TableRow>
                                    <TableHead className="w-[120px] font-bold text-slate-400 uppercase text-[10px] tracking-widest pl-6">
                                        ID
                                    </TableHead>
                                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                                        Product Details
                                    </TableHead>
                                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                                        Company
                                    </TableHead>
                                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                                        Price
                                    </TableHead>
                                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                                        Rating
                                    </TableHead>
                                    <TableHead className="font-bold text-slate-400 uppercase text-[10px] tracking-widest text-center">
                                        Tag
                                    </TableHead>
                                    <TableHead className="text-right font-bold text-slate-400 uppercase text-[10px] tracking-widest pr-6">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    Array(5)
                                        .fill(0)
                                        .map((_, i) => (
                                            <TableRow key={i}>
                                                <TableCell className="pl-6">
                                                    <div className="h-4 w-16 bg-slate-100 animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-40 bg-slate-100 animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-24 bg-slate-100 animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-20 bg-slate-100 animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-12 bg-slate-100 animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-4 w-20 mx-auto bg-slate-100 animate-pulse rounded" />
                                                </TableCell>
                                                <TableCell className="pr-6">
                                                    <div className="h-4 w-12 ml-auto bg-slate-100 animate-pulse rounded" />
                                                </TableCell>
                                            </TableRow>
                                        ))
                                ) : filteredProducts.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="h-64 text-center text-slate-400"
                                        >
                                            <div className="flex flex-col items-center justify-center gap-4">
                                                <div className="p-4 bg-slate-50 rounded-full">
                                                    <Package
                                                        size={48}
                                                        className="text-slate-200"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="text-slate-900 font-bold text-lg">
                                                        No products match your
                                                        search
                                                    </p>
                                                    <p className="text-sm">
                                                        Try adjusting your
                                                        filters or search query.
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    onClick={clearFilters}
                                                >
                                                    Clear All Filters
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <TableRow
                                            key={product.productId}
                                            className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0"
                                        >
                                            <TableCell className="pl-6 font-mono text-xs text-slate-400">
                                                {product.productId}
                                            </TableCell>
                                            <TableCell className="font-bold text-slate-900 py-4">
                                                <div className="flex flex-col">
                                                    <span>{product.name}</span>
                                                    <span className="md:hidden text-[10px] text-slate-400 font-normal">
                                                        ID: {product.productId}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-600">
                                                <div className="px-2 py-1 rounded bg-slate-100 w-fit text-xs font-semibold">
                                                    {product.company}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-bold text-slate-900">
                                                ₹{" "}
                                                {Number(
                                                    product.price,
                                                ).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 w-fit text-amber-700 font-bold text-xs ring-1 ring-amber-100">
                                                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                    {product.rating
                                                        ?.$numberDecimal ||
                                                        product.rating ||
                                                        0}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {product.featured ? (
                                                    <Badge className="bg-indigo-600 text-white border-0 hover:bg-indigo-700 px-3">
                                                        Featured
                                                    </Badge>
                                                ) : (
                                                    <span className="text-[10px] font-bold text-slate-300 uppercase">
                                                        Regular
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right pr-6">
                                                <div className="flex gap-1 justify-end  transition-opacity">
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            handleOpenDialog(
                                                                product,
                                                            )
                                                        }
                                                    >
                                                        <Edit className="h-3.5 w-3.5" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-600 hover:text-red-400 bg-red-50 border border-red-100"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product.productId,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 px-2">
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1 || loading}
                        className="h-9 rounded-lg border-slate-200 bg-white"
                    >
                        Previous
                    </Button>
                    {Array.from({ length: pagination.totalPages }, (_, i) => (
                        <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(i + 1)}
                            className={
                                currentPage === i + 1
                                    ? "h-9 rounded-lg border-slate-200 bg-slate-900 text-white"
                                    : "h-9 rounded-lg border-slate-200 bg-white"
                            }
                        >
                            {i + 1}
                        </Button>
                    ))}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setCurrentPage((prev) =>
                                Math.min(pagination.totalPages, prev + 1),
                            )
                        }
                        disabled={
                            currentPage === pagination.totalPages || loading
                        }
                        className="h-9 rounded-lg border-slate-200 bg-white"
                    >
                        Next
                    </Button>
                </div>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[500px] border-0 shadow-2xl p-0 overflow-hidden rounded-2xl">
                    <div className="bg-slate-900 p-8 text-white">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-white">
                                {editingProduct
                                    ? "Update Product"
                                    : "New Product"}
                            </DialogTitle>
                            <DialogDescription className="text-slate-400">
                                {editingProduct
                                    ? "Modify the fields below to update your inventory item."
                                    : "Expand your collection by adding a new premium product."}
                            </DialogDescription>
                        </DialogHeader>
                    </div>
                    <form onSubmit={handleSave} className="p-8 bg-white">
                        <div className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="productId"
                                        className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                                    >
                                        Product ID
                                    </Label>
                                    <Input
                                        id="productId"
                                        value={formData.productId}
                                        readOnly
                                        className="bg-slate-50 border-slate-200 font-mono text-xs"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="company"
                                        className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                                    >
                                        Company
                                    </Label>
                                    <Input
                                        id="company"
                                        placeholder="e.g. Apple"
                                        value={formData.company}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                company: e.target.value,
                                            })
                                        }
                                        className="border-slate-200 focus:border-slate-900 focus:ring-0 transition-all"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                                >
                                    Product Name
                                </Label>
                                <Input
                                    id="name"
                                    placeholder="e.g. iPhone 15 Pro"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="border-slate-200 focus:border-slate-900 focus:ring-0 transition-all font-bold"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="price"
                                        className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                                    >
                                        Price (₹)
                                    </Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                price: e.target.value,
                                            })
                                        }
                                        className="border-slate-200 focus:border-slate-900 focus:ring-0 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="rating"
                                        className="text-xs font-bold text-slate-400 uppercase tracking-wider"
                                    >
                                        Rating (0-5)
                                    </Label>
                                    <Input
                                        id="rating"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="5"
                                        placeholder="4.5"
                                        value={formData.rating}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                rating: e.target.value,
                                            })
                                        }
                                        className="border-slate-200 focus:border-slate-900 focus:ring-0 transition-all"
                                    />
                                </div>
                            </div>
                            <div
                                className="flex items-center space-x-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
                                onClick={() =>
                                    setFormData({
                                        ...formData,
                                        featured: !formData.featured,
                                    })
                                }
                            >
                                <input
                                    type="checkbox"
                                    id="featured"
                                    className="h-5 w-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                                    checked={formData.featured}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            featured: e.target.checked,
                                        })
                                    }
                                />
                                <div className="space-y-0.5">
                                    <Label
                                        htmlFor="featured"
                                        className="text-sm font-bold text-slate-900 cursor-pointer"
                                    >
                                        Featured Product
                                    </Label>
                                    <p className="text-[10px] text-slate-500">
                                        Show this product in the featured
                                        highlight sections.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="mt-8 gap-3 sm:flex-row-reverse flex-col">
                            <Button
                                type="submit"
                                className="bg-slate-900 hover:bg-slate-800 px-8 h-12 rounded-xl text-white font-bold"
                            >
                                {editingProduct
                                    ? "Save Changes"
                                    : "Create Product"}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setDialogOpen(false)}
                                className="text-slate-400 hover:text-slate-900 h-12"
                            >
                                Cancel
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
