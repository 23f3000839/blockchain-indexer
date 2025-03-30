"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function ClientForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    url: "",
    description: "",
    eventTypes: ["nft-sales", "nft-bid", "token-price", "token-availability"],
    isActive: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isActive: checked,
    });
  };

  const handleEventTypeChange = (value: string) => {
    setFormData({
      ...formData,
      eventTypes: [value],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.url) {
      toast.error("Please enter a webhook URL");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/webhooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Webhook endpoint created successfully!");
        router.push("/dashboard/webhooks");
        router.refresh();
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      toast.error("Error creating webhook");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="url" className="text-gray-200">Webhook URL</Label>
          <Input 
            id="url" 
            name="url" 
            value={formData.url}
            onChange={handleChange}
            placeholder="https://your-webhook-url.com/endpoint" 
            className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
          />
          <p className="text-sm text-gray-400 mt-1">
            The URL that will receive blockchain event data
          </p>
        </div>

        <div>
          <Label htmlFor="description" className="text-gray-200">Description (Optional)</Label>
          <Input 
            id="description" 
            name="description" 
            value={formData.description}
            onChange={handleChange}
            placeholder="My blockchain webhook" 
            className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
          />
          <p className="text-sm text-gray-400 mt-1">
            A friendly description to identify this webhook
          </p>
        </div>

        <div>
          <Label htmlFor="eventType" className="text-gray-200 mb-2 block">Event Type</Label>
          <Select onValueChange={handleEventTypeChange} defaultValue="nft-sales">
            <SelectTrigger className="w-full bg-gray-900 border-gray-700 text-white">
              <SelectValue placeholder="Select event type" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-white">
              <SelectItem value="nft-sales">NFT Sales</SelectItem>
              <SelectItem value="nft-bid">NFT Bids</SelectItem>
              <SelectItem value="token-price">Token Price</SelectItem>
              <SelectItem value="token-availability">Token Availability</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-400 mt-1">
            The type of blockchain events to receive
          </p>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Switch 
            id="isActive" 
            checked={formData.isActive}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="isActive" className="text-gray-200">Active</Label>
          <p className="text-sm text-gray-400 ml-2">
            Toggle to enable or disable this webhook
          </p>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Webhook"}
        </Button>
      </div>
    </form>
  );
} 