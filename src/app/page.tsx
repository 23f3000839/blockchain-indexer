import Link from "next/link";
import { Database, BrainCircuit, Rocket, Zap, Globe, Server, Layers } from "lucide-react";
import { FloatingNavbar } from "@/components/floating-navbar";
import { GridBackground } from "@/components/ui/grid-background";
import { FeatureCard } from "@/components/ui/feature-card";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const navItems = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How It Works" },
    { href: "#use-cases", label: "Use Cases" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 text-white">
      {/* Floating Header */}
      <FloatingNavbar navItems={navItems} showAuth={true} />

      {/* Hero Section */}
      <GridBackground containerClassName="min-h-screen">
        <section className="pt-32 pb-20">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-5xl font-bold text-white mb-6">
                  Index Solana Blockchain Data into Your PostgreSQL Database
                </h1>
                <p className="text-xl text-gray-300 mb-8">
                  Easily integrate and index real-time blockchain data using Helius webhooks without running your own RPC or validator.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link href="/auth/sign-up">Get Started</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="#how-it-works">Learn More</a>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="w-full max-w-md p-6 bg-gray-900 rounded-lg shadow-xl border border-gray-800">
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                      <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-gray-400">database.sql</div>
                  </div>
                  <pre className="bg-gray-800 p-4 rounded text-sm font-mono text-gray-300 overflow-x-auto">
{`-- NFT prices from OpenSea
SELECT 
  nft_address, 
  price_in_sol, 
  timestamp
FROM indexed_nft_prices
WHERE collection = 'xxxxxxxx'
ORDER BY timestamp DESC
LIMIT 10;`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>
      </GridBackground>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Key Features</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Our blockchain indexing platform simplifies how developers access and use Solana data.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="PostgreSQL Integration"
              description="Connect your PostgreSQL database for seamless data storage and querying."
              icon={<Database className="h-10 w-10 text-blue-400" />}
              gradient="from-blue-500 via-blue-400 to-cyan-500"
              delay={0}
            />
            
            <FeatureCard
              title="Smart Schema Generation"
              description="Automatically create optimized schemas for various blockchain data types."
              icon={<BrainCircuit className="h-10 w-10 text-indigo-400" />}
              gradient="from-indigo-500 via-purple-500 to-pink-500"
              delay={1}
            />
            
            <FeatureCard
              title="Real-time Data"
              description="Receive and process blockchain data in real-time using Helius webhooks."
              icon={<Zap className="h-10 w-10 text-amber-400" />}
              gradient="from-orange-500 via-amber-500 to-yellow-500"
              delay={2}
            />

            <FeatureCard
              title="No Infrastructure Needed"
              description="Eliminate the need to run your own RPC, Geyser, or Validator nodes."
              icon={<Globe className="h-10 w-10 text-green-400" />}
              gradient="from-emerald-500 via-green-500 to-lime-500"
              delay={3}
            />
            
            <FeatureCard
              title="Flexible Data Types"
              description="Choose from NFT bids, prices, token availability, and more for indexing."
              icon={<Layers className="h-10 w-10 text-fuchsia-400" />}
              gradient="from-fuchsia-500 via-purple-500 to-indigo-500"
              delay={4}
            />
            
            <FeatureCard
              title="Custom Filtering"
              description="Apply filters to only index the specific blockchain data you need."
              icon={<Server className="h-10 w-10 text-red-400" />}
              gradient="from-red-500 via-rose-500 to-pink-500"
              delay={5}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gray-950">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Simple steps to integrate blockchain data into your database
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-start mb-12">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white font-bold text-xl mb-4 md:mb-0">
                1
              </div>
              <div className="md:ml-6">
                <h3 className="text-xl font-bold mb-2 text-white">Connect Your Database</h3>
                <p className="text-gray-300 mb-4">
                  Securely provide your PostgreSQL database credentials through our easy-to-use form.
                </p>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400">We'll test the connection and encrypt your credentials for security.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start mb-12">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-xl mb-4 md:mb-0">
                2
              </div>
              <div className="md:ml-6">
                <h3 className="text-xl font-bold mb-2 text-white">Configure Data Indexing</h3>
                <p className="text-gray-300 mb-4">
                  Select which blockchain data types you want to index and apply any necessary filters.
                </p>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400">We'll automatically generate optimized database schemas for your selected data types.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start mb-12">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-purple-600 text-white font-bold text-xl mb-4 md:mb-0">
                3
              </div>
              <div className="md:ml-6">
                <h3 className="text-xl font-bold mb-2 text-white">Activate Webhooks</h3>
                <p className="text-gray-300 mb-4">
                  Our platform automatically sets up and manages Helius webhooks to receive blockchain data.
                </p>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400">The webhooks are configured to capture exactly the data you've chosen to index.</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row md:items-start">
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-pink-600 text-white font-bold text-xl mb-4 md:mb-0">
                4
              </div>
              <div className="md:ml-6">
                <h3 className="text-xl font-bold mb-2 text-white">Start Using Your Data</h3>
                <p className="text-gray-300 mb-4">
                  The data begins flowing into your PostgreSQL database, ready for your application to use.
                </p>
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-400">Query your indexed blockchain data using standard SQL just like any other data in your database.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Use Cases</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Power your applications with real-time blockchain data
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <FeatureCard
              title="NFT Analytics Platforms"
              description="Track NFT prices, bids, and trading activity to power analytics dashboards."
              hoverEffect={false}
              gradient="from-blue-500 via-purple-500 to-pink-500"
              delay={0}
              className="h-full"
            >
              <ul className="list-disc list-inside text-gray-400 space-y-1 mt-4">
                <li>Monitor floor prices across collections</li>
                <li>Analyze bidding patterns</li>
                <li>Track sales volume and market trends</li>
              </ul>
            </FeatureCard>
            
            <FeatureCard
              title="DeFi Applications"
              description="Index token prices and liquidity data to build DeFi tools."
              hoverEffect={false}
              gradient="from-green-500 via-emerald-500 to-teal-500"
              delay={1}
              className="h-full"
            >
              <ul className="list-disc list-inside text-gray-400 space-y-1 mt-4">
                <li>Real-time token price tracking</li>
                <li>Liquidity pool monitoring</li>
                <li>Lending protocol rate analysis</li>
              </ul>
            </FeatureCard>
            
            <FeatureCard
              title="Portfolio Trackers"
              description="Build applications that help users track their blockchain asset performance."
              hoverEffect={false}
              gradient="from-amber-500 via-orange-500 to-red-500"
              delay={2}
              className="h-full"
            >
              <ul className="list-disc list-inside text-gray-400 space-y-1 mt-4">
                <li>Real-time portfolio valuation</li>
                <li>Historical performance tracking</li>
                <li>Alert systems for price movements</li>
              </ul>
            </FeatureCard>
            
            <FeatureCard
              title="On-chain Activity Monitoring"
              description="Track specific activities happening on the Solana blockchain."
              hoverEffect={false}
              gradient="from-purple-500 via-violet-500 to-indigo-500"
              delay={3}
              className="h-full"
            >
              <ul className="list-disc list-inside text-gray-400 space-y-1 mt-4">
                <li>Monitor program interactions</li>
                <li>Track wallet activity</li>
                <li>Analyze transaction patterns</li>
              </ul>
            </FeatureCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <GridBackground containerClassName="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Indexing Blockchain Data?</h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Create an account today and integrate Solana data into your PostgreSQL database in minutes.
          </p>
          <div className="mt-8 flex justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">Sign Up for Free</Link>
            </Button>
          </div>
        </div>
      </GridBackground>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <Database className="h-6 w-6 mr-2" />
                <span className="font-bold text-xl">Blockchain Indexer</span>
              </div>
              <p className="text-gray-400 max-w-xs">
                Seamlessly index Solana blockchain data into your PostgreSQL database.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#how-it-works" className="text-gray-400 hover:text-white">How It Works</a></li>
                  <li><a href="#use-cases" className="text-gray-400 hover:text-white">Use Cases</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">API Reference</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Tutorials</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Blockchain Indexer. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <p className="text-gray-400">Powered by Helius</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
