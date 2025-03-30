"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// UI components
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

// Define data type options
const DATA_TYPES = [
  { id: "NFT_SALES", name: "NFT Sales" },
  { id: "NFT_BIDS", name: "NFT Bids" },
  { id: "TOKEN_AVAILABILITY", name: "Token Availability" },
  { id: "TOKEN_PRICES", name: "Token Prices" },
];

// Props interface
interface ClientFormProps {
  connections: {
    id: string;
    name: string;
    host: string;
  }[];
}

export default function ClientForm({ connections }: ClientFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    databaseConnectionId: "",
    dataType: "NFT_SALES",
    targetTable: "",
    filters: "",
  });

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle radio button (data type) changes
  const handleDataTypeChange = (value: string) => {
    setFormData((prev) => ({ ...prev, dataType: value }));
  };

  // Handle select (database connection) changes
  const handleConnectionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, databaseConnectionId: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.databaseConnectionId || !formData.dataType || !formData.targetTable) {
      toast.error("Please fill all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/indexing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to create indexing configuration");
      }
      
      toast.success("Indexing configuration created successfully");
      router.push("/dashboard/indexing");
      router.refresh();
    } catch (error) {
      console.error("Error creating indexing configuration:", error);
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Configuration name */}
        <div>
          <Label htmlFor="name" className="text-gray-200">Configuration Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., NFT Sales Tracker"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-sm text-gray-400 mt-1">
            A descriptive name for this indexing configuration
          </p>
        </div>
        
        {/* Database connection */}
        <div>
          <Label htmlFor="databaseConnectionId" className="text-gray-200 mb-2 block">Database Connection</Label>
          <Select onValueChange={handleConnectionChange} value={formData.databaseConnectionId}>
            <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Select a database connection" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              {connections.map((connection) => (
                <SelectItem key={connection.id} value={connection.id}>
                  {connection.name} ({connection.host})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-400 mt-1">
            The database where the indexed data will be stored
          </p>
        </div>
        
        {/* Data type */}
        <div>
          <Label className="text-gray-200 mb-2 block">Data Type</Label>
          <RadioGroup
            value={formData.dataType}
            onValueChange={handleDataTypeChange}
            className="flex flex-col space-y-2"
          >
            {DATA_TYPES.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <RadioGroupItem id={type.id} value={type.id} className="text-indigo-600" />
                <Label htmlFor={type.id} className="text-gray-200">{type.name}</Label>
              </div>
            ))}
          </RadioGroup>
          <p className="text-sm text-gray-400 mt-1">
            The type of blockchain data to index
          </p>
        </div>
        
        {/* Target table */}
        <div>
          <Label htmlFor="targetTable" className="text-gray-200">Target Table Name</Label>
          <Input
            id="targetTable"
            name="targetTable"
            placeholder="e.g., nft_sales"
            value={formData.targetTable}
            onChange={handleChange}
            required
            className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-sm text-gray-400 mt-1">
            The table where the data will be stored. The table will be created if it doesn't exist.
          </p>
        </div>
        
        {/* Filters (optional) */}
        <div>
          <Label htmlFor="filters" className="text-gray-200">Filters (Optional JSON)</Label>
          <Textarea
            id="filters"
            name="filters"
            placeholder='e.g., {"collections": ["collection1", "collection2"]}'
            value={formData.filters}
            onChange={handleChange}
            rows={4}
            className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500"
          />
          <p className="text-sm text-gray-400 mt-1">
            Optional JSON filters to narrow down the data you receive. Leave empty to index all data of the selected type.
          </p>
        </div>
      </div>
      
      <div className="pt-4 flex justify-between border-t border-gray-800">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/indexing")}
          className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-indigo-600 hover:bg-indigo-700"
        >
          {isSubmitting ? "Creating..." : "Create Configuration"}
        </Button>
      </div>
    </form>
  );
} 