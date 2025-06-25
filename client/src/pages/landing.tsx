import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  TreePine, 
  Wallet, 
  Zap, 
  Shield, 
  Download, 
  Github, 
  ExternalLink,
  Check,
  Smartphone,
  Globe
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <TreePine className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">Soltree</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/create">
                <Button variant="default" size="sm">
                  Launch App
                </Button>
              </Link>
              <a 
                href="https://github.com/StaplezStudio/Soltree" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <Badge variant="secondary" className="mb-4">
              Powered by Solana Blockchain
            </Badge>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Create Solana
              <span className="text-green-600"> Merkle Trees</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Build compressed Merkle trees on Solana with an intuitive interface. 
              Support for multiple wallets, custom RPC endpoints, and real-time cost estimation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/create">
                <Button size="lg" className="w-full sm:w-auto">
                  <TreePine className="h-5 w-5 mr-2" />
                  Start Creating
                </Button>
              </Link>
              <a 
                href="https://github.com/StaplezStudio/Soltree" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  <Download className="h-5 w-5 mr-2" />
                  Download Source
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Everything you need to create and manage Solana Merkle trees
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Wallet className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Multi-Wallet Support</CardTitle>
                <CardDescription>
                  Connect with Phantom, Solflare, and other popular Solana wallets
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Globe className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Network Flexibility</CardTitle>
                <CardDescription>
                  Deploy on Devnet for testing or Mainnet for production use
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-yellow-600 mb-2" />
                <CardTitle>Real-time Estimation</CardTitle>
                <CardDescription>
                  Get instant cost calculations based on your tree parameters
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Custom RPC</CardTitle>
                <CardDescription>
                  Use your own RPC endpoints for reliable blockchain connections
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Smartphone className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Mobile Ready</CardTitle>
                <CardDescription>
                  Fully responsive design works on desktop, tablet, and mobile
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <Download className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Open Source</CardTitle>
                <CardDescription>
                  Download complete source code and deploy anywhere
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Built for Developers
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Soltree is built with modern web technologies and best practices. 
                The codebase is clean, well-documented, and easy to extend.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">React 18 with TypeScript</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Solana Web3.js integration</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">Tailwind CSS styling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">No database required</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-gray-700 dark:text-gray-300">GitHub Pages ready</span>
                </div>
              </div>
            </div>
            
            <Card className="p-8">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl mb-2">Tree Parameters</CardTitle>
                <CardDescription>
                  Flexible configuration for any use case
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Canopy Depth</span>
                  <Badge variant="outline">0-17</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Max Depth</span>
                  <Badge variant="outline">5-30</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Buffer Size</span>
                  <Badge variant="outline">8-2048</Badge>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-gray-500 text-center">
                    Supports millions of leaves with optimized proof sizes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Build?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Start creating compressed Merkle trees on Solana in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/create">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                <TreePine className="h-5 w-5 mr-2" />
                Launch Application
              </Button>
            </Link>
            <a 
              href="https://github.com/StaplezStudio/Soltree" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ExternalLink className="h-5 w-5 mr-2" />
                View on GitHub
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <TreePine className="h-6 w-6 text-green-400" />
                <span className="text-xl font-bold">Soltree</span>
              </div>
              <p className="text-gray-400 text-sm">
                Professional Solana Merkle tree creation tool built for developers and creators.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Resources</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <Link href="/create" className="block hover:text-white transition-colors">
                  Create Tree
                </Link>
                <a 
                  href="https://github.com/StaplezStudio/Soltree" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block hover:text-white transition-colors"
                >
                  GitHub Repository
                </a>
                <a 
                  href="https://docs.solana.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block hover:text-white transition-colors"
                >
                  Solana Documentation
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Technology</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <div>React 18 + TypeScript</div>
                <div>Solana Web3.js</div>
                <div>SPL Account Compression</div>
                <div>Tailwind CSS</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>Built with ❤️ for the Solana ecosystem</p>
          </div>
        </div>
      </footer>
    </div>
  );
}