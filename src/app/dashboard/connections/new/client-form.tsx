"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export default function ClientForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [testLoading, setTestLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    host: "",
    port: "5432",
    database: "",
    username: "",
    password: "",
    schema: "public",
    useSSL: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      useSSL: checked,
    });
  };

  const testConnection = async () => {
    if (!formData.host || !formData.port || !formData.username || !formData.password || !formData.database) {
      toast.error("Please fill in all required fields");
      return;
    }

    setTestLoading(true);
    try {
      console.log("Testing connection with params:", { 
        host: formData.host, 
        port: formData.port, 
        database: formData.database, 
        schema: formData.schema, 
        useSSL: formData.useSSL 
      });

      const response = await fetch("/api/connections/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          host: formData.host,
          port: parseInt(formData.port),
          username: formData.username,
          password: formData.password,
          database: formData.database,
          schema: formData.schema,
          useSSL: formData.useSSL
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Connection successful!");
      } else {
        toast.error(`Connection failed: ${data.error}`);
      }
    } catch (error) {
      toast.error("Error testing connection");
      console.error(error);
    } finally {
      setTestLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.host || !formData.port || !formData.username || !formData.password || !formData.database) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch("/api/connections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success("Database connection saved successfully!");
        router.push("/dashboard/connections");
        router.refresh();
      } else {
        toast.error(`Error: ${data.error}`);
      }
    } catch (error) {
      toast.error("Error saving connection");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-gray-200">Connection Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleChange}
            placeholder="My Production Database" 
            className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
          />
          <p className="text-sm text-gray-400 mt-1">
            A friendly name to identify this connection
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="host" className="text-gray-200">Host</Label>
            <Input 
              id="host" 
              name="host" 
              value={formData.host}
              onChange={handleChange}
              placeholder="localhost or db.example.com" 
              className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
          <div>
            <Label htmlFor="port" className="text-gray-200">Port</Label>
            <Input 
              id="port" 
              name="port" 
              value={formData.port}
              onChange={handleChange}
              placeholder="5432" 
              type="number" 
              className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
        </div>

        <div>
          <Label htmlFor="database" className="text-gray-200">Database Name</Label>
          <Input 
            id="database" 
            name="database" 
            value={formData.database}
            onChange={handleChange}
            placeholder="my_database" 
            className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="username" className="text-gray-200">Username</Label>
            <Input 
              id="username" 
              name="username" 
              value={formData.username}
              onChange={handleChange}
              placeholder="postgres" 
              className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-200">Password</Label>
            <Input 
              id="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              type="password" 
              className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
            />
          </div>
        </div>

        <div>
          <Label htmlFor="schema" className="text-gray-200">Schema (Optional)</Label>
          <Input 
            id="schema" 
            name="schema" 
            value={formData.schema}
            onChange={handleChange}
            placeholder="public" 
            className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:ring-indigo-500 focus:border-indigo-500" 
          />
          <p className="text-sm text-gray-400 mt-1">
            Default is "public"
          </p>
        </div>

        <div className="flex items-center space-x-2 mt-4">
          <Switch 
            id="useSSL" 
            checked={formData.useSSL}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="useSSL" className="text-gray-200">Use SSL Connection</Label>
          <p className="text-sm text-gray-400 ml-2">
            Enable SSL for secure database connections
          </p>
        </div>
      </div>

      <div className="pt-4 flex justify-between items-center border-t border-gray-800">
        <Button 
          variant="outline" 
          type="button"
          className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white"
          onClick={testConnection}
          disabled={testLoading}
        >
          {testLoading ? "Testing..." : "Test Connection"}
        </Button>
        <Button 
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : "Save Connection"}
        </Button>
      </div>
    </form>
  );
} 