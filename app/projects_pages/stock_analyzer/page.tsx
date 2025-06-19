"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import ExhibitNavigator from "@/app/components/PageNavigator";

interface Stock {
  ticker: string;
  companyName: string;
  industry: string;
  sector: string;
  country: string;
  marketCap: number;
  earnings: number;
  peRatio: number;
  dividendYield: number;
  revenue: number;
  score: number;
}

const mockStocks: Stock[] = [
  {
    ticker: "AAPL",
    companyName: "Apple Inc.",
    industry: "Consumer Electronics",
    sector: "Technology",
    country: "USA",
    marketCap: 2800000000000,
    earnings: 96995000000,
    peRatio: 28.5,
    dividendYield: 0.5,
    revenue: 394328000000,
    score: 85
  },
  {
    ticker: "MSFT",
    companyName: "Microsoft Corporation",
    industry: "Software",
    sector: "Technology",
    country: "USA",
    marketCap: 3200000000000,
    earnings: 72361000000,
    peRatio: 35.2,
    dividendYield: 0.8,
    revenue: 211915000000,
    score: 92
  },
  {
    ticker: "GOOGL",
    companyName: "Alphabet Inc.",
    industry: "Internet Content & Information",
    sector: "Technology",
    country: "USA",
    marketCap: 1800000000000,
    earnings: 73795000000,
    peRatio: 24.8,
    dividendYield: 0,
    revenue: 307394000000,
    score: 88
  },
  {
    ticker: "TSLA",
    companyName: "Tesla, Inc.",
    industry: "Auto Manufacturers",
    sector: "Consumer Discretionary",
    country: "USA",
    marketCap: 800000000000,
    earnings: 14997000000,
    peRatio: 53.4,
    dividendYield: 0,
    revenue: 96773000000,
    score: 76
  },
  {
    ticker: "JNJ",
    companyName: "Johnson & Johnson",
    industry: "Drug Manufacturers",
    sector: "Healthcare",
    country: "USA",
    marketCap: 400000000000,
    earnings: 17941000000,
    peRatio: 22.3,
    dividendYield: 2.9,
    revenue: 85159000000,
    score: 82
  },
  {
    ticker: "JPM",
    companyName: "JPMorgan Chase & Co.",
    industry: "Banks",
    sector: "Financial Services",
    country: "USA",
    marketCap: 500000000000,
    earnings: 49552000000,
    peRatio: 10.1,
    dividendYield: 2.4,
    revenue: 154792000000,
    score: 79
  },
  {
    ticker: "NESTLE",
    companyName: "Nestlé S.A.",
    industry: "Packaged Foods",
    sector: "Consumer Defensive",
    country: "Switzerland",
    marketCap: 300000000000,
    earnings: 11203000000,
    peRatio: 26.8,
    dividendYield: 2.8,
    revenue: 94500000000,
    score: 84
  },
  {
    ticker: "TOYOTA",
    companyName: "Toyota Motor Corporation",
    industry: "Auto Manufacturers",
    sector: "Consumer Discretionary",
    country: "Japan",
    marketCap: 250000000000,
    earnings: 25000000000,
    peRatio: 10.0,
    dividendYield: 2.1,
    revenue: 279515000000,
    score: 81
  }
];

const sectors = [...new Set(mockStocks.map(stock => stock.sector))];
const industries = [...new Set(mockStocks.map(stock => stock.industry))];
const countries = [...new Set(mockStocks.map(stock => stock.country))];

export default function Exhibit4() {
  const [filters, setFilters] = useState({
    country: "",
    sector: "",
    industry: "",
    marketCapMin: "",
    marketCapMax: ""
  });

  const [sortBy, setSortBy] = useState<keyof Stock>("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredStocks = useMemo(() => {
    let filtered = mockStocks.filter(stock => {
      if (filters.country && stock.country !== filters.country) return false;
      if (filters.sector && stock.sector !== filters.sector) return false;
      if (filters.industry && stock.industry !== filters.industry) return false;
      if (filters.marketCapMin && stock.marketCap < parseInt(filters.marketCapMin) * 1000000) return false;
      if (filters.marketCapMax && stock.marketCap > parseInt(filters.marketCapMax) * 1000000) return false;
      return true;
    });

    filtered.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [filters, sortBy, sortOrder]);

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1000000000000) {
      return `$${(marketCap / 1000000000000).toFixed(1)}T`;
    } else if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(1)}B`;
    } else {
      return `$${(marketCap / 1000000).toFixed(1)}M`;
    }
  };

  const formatEarnings = (earnings: number) => {
    if (earnings >= 1000000000) {
      return `$${(earnings / 1000000000).toFixed(1)}B`;
    } else {
      return `$${(earnings / 1000000).toFixed(1)}M`;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      {/* Navigation Component */}
      <ExhibitNavigator />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Stock Analyzer
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Analyze stocks with comprehensive data and scoring
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Country
              </label>
              <select
                value={filters.country}
                onChange={(e) => setFilters({...filters, country: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sector
              </label>
              <select
                value={filters.sector}
                onChange={(e) => setFilters({...filters, sector: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Sectors</option>
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Industry
              </label>
              <select
                value={filters.industry}
                onChange={(e) => setFilters({...filters, industry: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="">All Industries</option>
                {industries.map(industry => (
                  <option key={industry} value={industry}>{industry}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Market Cap Min (M)
              </label>
              <input
                type="number"
                value={filters.marketCapMin}
                onChange={(e) => setFilters({...filters, marketCapMin: e.target.value})}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Market Cap Max (M)
              </label>
              <input
                type="number"
                value={filters.marketCapMax}
                onChange={(e) => setFilters({...filters, marketCapMax: e.target.value})}
                placeholder="∞"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-gray-700 dark:text-gray-300">
            Showing {filteredStocks.length} of {mockStocks.length} stocks
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as keyof Stock)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="score">Score</option>
                <option value="marketCap">Market Cap</option>
                <option value="peRatio">P/E Ratio</option>
                <option value="earnings">Earnings</option>
                <option value="ticker">Ticker</option>
              </select>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
        </div>

        {/* Stocks Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Industry/Sector
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Market Cap
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Earnings
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    P/E Ratio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Dividend Yield
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStocks.map((stock, index) => (
                  <tr key={stock.ticker} className={index % 2 === 0 ? "bg-white dark:bg-gray-800" : "bg-gray-50 dark:bg-gray-700"}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {stock.ticker}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {stock.companyName}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-400">
                          {stock.country}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900 dark:text-white">
                          {stock.industry}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {stock.sector}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatMarketCap(stock.marketCap)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatEarnings(stock.earnings)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {stock.peRatio.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {stock.dividendYield > 0 ? `${stock.dividendYield.toFixed(1)}%` : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(stock.score)}`}>
                        {stock.score}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">Average Score</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {(filteredStocks.reduce((sum, stock) => sum + stock.score, 0) / filteredStocks.length).toFixed(1)}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">Average P/E Ratio</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {(filteredStocks.reduce((sum, stock) => sum + stock.peRatio, 0) / filteredStocks.length).toFixed(1)}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">Total Market Cap</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatMarketCap(filteredStocks.reduce((sum, stock) => sum + stock.marketCap, 0))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-300">Countries</div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Set(filteredStocks.map(stock => stock.country)).size}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 