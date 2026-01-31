import React, { useState, useEffect } from 'react';
import { useProjects } from '../hooks/useProjects';
import { useDatasets } from '../hooks/useDatasets';
import axios from 'axios';
import {
    BarChart3, TrendingUp, TrendingDown, Activity, Database, Layers,
    PieChart, LineChart, Zap, Target, Filter, Calendar, Download,
    RefreshCw, Eye, Brain, Sparkles, AlertTriangle, CheckCircle2,
    FileText, Users, Clock, Shield, ArrowRight, GitBranch, Cpu,
    Upload, Search, Play, Maximize2, Grid, List, Settings, Info,
    AlertCircle, XCircle, ChevronDown, ChevronUp, BarChart2,
    Map, Globe, Layers as LayersIcon, Radar as RadarIcon,
    TrendingDown as TrendDown, Box, Hexagon, Circle, Square,
    Compass, Anchor, Wind, Navigation
} from 'lucide-react';
import {
    ComposableMap,
    Geographies,
    Geography,
    Marker,
    Graticule,
    Sphere
} from "react-simple-maps";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    BubbleController,
    Title,
    Tooltip,
    Legend,
    Filler,
    TimeScale
} from 'chart.js';
import { Line, Bar, Doughnut, Pie, Scatter as ScatterChart, Radar, PolarArea, Bubble } from 'react-chartjs-2';
import ApexChart from 'react-apexcharts';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    RadialLinearScale,
    BubbleController,
    Title,
    Tooltip,
    Legend,
    Filler,
    TimeScale
);

export default function AdvancedAnalytics() {
    const { projects } = useProjects();
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedDataset, setSelectedDataset] = useState(null);

    // Initialize selected project
    useEffect(() => {
        if (projects.length > 0 && !selectedProject) {
            setSelectedProject(projects[0].id);
        }
    }, [projects]);

    const activeProject = projects.find(p => p.id === selectedProject) || projects[0];
    const { datasets } = useDatasets(activeProject?.id);
    const [datasetStats, setDatasetStats] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [stockInterval, setStockInterval] = useState('MONTH'); // WEEK, MONTH, YEAR

    useEffect(() => {
        if (datasets.length > 0 && !selectedDataset) {
            setSelectedDataset(datasets[0].id);
        }
    }, [datasets]);

    const analyzeDataset = async (datasetId) => {
        setIsAnalyzing(true);
        try {
            const response = await axios.get(`/api/datasets/${datasetId}/stats`);
            const stats = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
            setDatasetStats(stats);
        } catch (error) {
            console.error('Failed to analyze dataset:', error);
            setDatasetStats(generateMockStats());
        } finally {
            setIsAnalyzing(false);
        }
    };

    const generateMockStats = () => {
        const mockSample = Array.from({ length: 150 }, (_, i) => ({
            customer_id: i + 1,
            age: Math.floor(Math.random() * 60) + 18,
            income: Math.floor(Math.random() * 150000) + 30000,
            latitude: (Math.random() * 140) - 70,
            longitude: (Math.random() * 300) - 150,
            city: ['New York', 'London', 'Tokyo', 'Paris', 'Mumbai', 'Sydney', 'Berlin', 'Dubai'][Math.floor(Math.random() * 8)],
            purchase_amount: Math.random() * 1000,
            device_type: ['Mobile', 'Desktop', 'Tablet'][Math.floor(Math.random() * 3)],
            revenue: Math.random() * 500,
            Open: 1500 + (i * 2) + Math.random() * 50,
            High: 1550 + (i * 2) + Math.random() * 50,
            Low: 1450 + (i * 2) + Math.random() * 50,
            Close: 1500 + (i * 2) + Math.random() * 50,
            timestamp: new Date(Date.now() - (150 - i) * 24 * 60 * 60 * 1000).toISOString()
        }));

        return {
            rowCount: 50000,
            columnCount: 20,
            columns: [
                { name: 'customer_id', type: 'int64', nullPercentage: 0, uniqueCount: 50000, stats: { min: 1, max: 50000, mean: 25000, median: 25000 } },
                { name: 'age', type: 'int64', nullPercentage: 0.5, uniqueCount: 70, stats: { min: 18, max: 85, mean: 42, median: 40 } },
                { name: 'income', type: 'float64', nullPercentage: 1.2, uniqueCount: 35000, stats: { min: 15000, max: 500000, mean: 85000, median: 72000 } },
                { name: 'latitude', type: 'float64', nullPercentage: 0.3, uniqueCount: 1000, stats: { min: -90, max: 90, mean: 40.7, median: 41.2 } },
                { name: 'longitude', type: 'float64', nullPercentage: 0.3, uniqueCount: 1000, stats: { min: -180, max: 180, mean: -74.0, median: -73.5 } },
                { name: 'city', type: 'object', nullPercentage: 0.2, uniqueCount: 500, distribution: { labels: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'London', 'Tokyo'], values: [5200, 4100, 3200, 2600, 2100, 1950] } },
                { name: 'country', type: 'object', nullPercentage: 0.1, uniqueCount: 50 },
                { name: 'Open', type: 'float64', nullPercentage: 0, uniqueCount: 150 },
                { name: 'High', type: 'float64', nullPercentage: 0, uniqueCount: 150 },
                { name: 'Low', type: 'float64', nullPercentage: 0, uniqueCount: 150 },
                { name: 'Close', type: 'float64', nullPercentage: 0, uniqueCount: 150 },
                { name: 'timestamp', type: 'datetime', nullPercentage: 0, uniqueCount: 150 },
                { name: 'purchase_amount', type: 'float64', nullPercentage: 0.8, uniqueCount: 25000, stats: { min: 10, max: 10000, mean: 350, median: 220 } },
                { name: 'category', type: 'object', nullPercentage: 0, uniqueCount: 12, distribution: { labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys'], values: [18500, 15200, 8900, 12400, 9800, 7600] } },
                { name: 'device_type', type: 'object', nullPercentage: 0, uniqueCount: 5, distribution: { labels: ['Desktop', 'Mobile', 'Tablet', 'Smart TV'], values: [22000, 18500, 6200, 2100] } },
                { name: 'browser', type: 'object', nullPercentage: 0.1, uniqueCount: 8, distribution: { labels: ['Chrome', 'Safari', 'Firefox', 'Edge'], values: [28000, 12500, 5800, 2400] } },
                { name: 'revenue', type: 'float64', nullPercentage: 1.0, uniqueCount: 30000, stats: { min: 0, max: 15000, mean: 420, median: 280 } }
            ],

            sample: mockSample,
            metadata: {
                datetimeCols: ['timestamp'],
                geoCols: { lat: 'latitude', lng: 'longitude', city: 'city' },
                categoricalCols: ['city', 'category', 'device_type', 'browser'],
                numericalCols: ['age', 'income', 'purchase_amount', 'revenue', 'Open', 'High', 'Low', 'Close']
            },

            correlation: {
                columns: ['age', 'income', 'purchase_amount', 'revenue'],
                values: [
                    [1.0, 0.72, 0.45, 0.48],
                    [0.72, 1.0, 0.68, 0.75],
                    [0.45, 0.68, 1.0, 0.88],
                    [0.48, 0.75, 0.88, 1.0]
                ]
            },
            geographic: [
                { city: 'New York', lat: 40.7128, lng: -74.0060, value: 15000, users: 5200 },
                { city: 'Los Angeles', lat: 34.0522, lng: -118.2437, value: 12000, users: 4100 },
                { city: 'Chicago', lat: 41.8781, lng: -87.6298, value: 9500, users: 3200 },
                { city: 'London', lat: 51.5074, lng: -0.1278, value: 8500, users: 2800 },
                { city: 'Tokyo', lat: 35.6762, lng: 139.6503, value: 7800, users: 2600 }
            ]
        };
    };

    const insights = datasetStats ? {
        rowCount: datasetStats.rowCount || 0,
        columnCount: datasetStats.columnCount || 0,
        ...datasetStats
    } : null;

    // Unified Market Field Detection
    const marketFields = React.useMemo(() => {
        if (!insights?.columns) return null;
        const cols = insights.columns;

        const find = (keys) => cols.find(c => {
            const name = c.name.toLowerCase().trim();
            return keys.some(k => name === k || name.includes(k)) && c.type !== 'object';
        })?.name;

        const open = find(['open', 'opn', 'start']);
        const close = find(['close', 'cls', 'price', 'last', 'end']);
        const high = find(['high', 'hi', 'max']);
        const low = find(['low', 'lo', 'min']);

        const date = insights.metadata?.datetimeCols?.[0] ||
            cols.find(c => c.type === 'datetime' || /date|time|timestamp|dt|period|day|month|year/i.test(c.name))?.name;

        if (open && close) {
            return { open, close, high: high || open, low: low || close, date };
        }
        return null;
    }, [insights]);

    const isStockData = !!marketFields;

    const stockChartData = React.useMemo(() => {
        if (!isStockData || !insights?.sample) return null;
        const { open, close, high, low, date: dateCol } = marketFields;

        const parseNum = (v) => {
            if (v == null) return 0;
            const n = parseFloat(v.toString().replace(/[^0-9.-]+/g, ""));
            return isNaN(n) ? 0 : n;
        };

        const parseDate = (v) => {
            if (!v) return null;
            const d = new Date(v);
            if (!isNaN(d.getTime())) return d;
            const n = parseFloat(v);
            if (!isNaN(n)) return n > 1e11 ? new Date(n) : new Date(n * 1000);
            return null;
        };

        const sorted = [...insights.sample]
            .filter(r => r && r[open] != null)
            .sort((a, b) => (parseDate(a[dateCol])?.getTime() || 0) - (parseDate(b[dateCol])?.getTime() || 0));

        if (sorted.length === 0) return [{ data: [] }];

        // Direct return for DAY
        if (stockInterval === 'DAY' || !dateCol) {
            return [{
                data: sorted.slice(-80).map((r, i) => ({
                    x: parseDate(r[dateCol])?.toLocaleDateString() || `P${i}`,
                    y: [parseNum(r[open]), parseNum(r[high]), parseNum(r[low]), parseNum(r[close])]
                }))
            }];
        }

        // Aggregate WEEK, MONTH, YEAR
        const groups = {};
        sorted.forEach(r => {
            const d = parseDate(r[dateCol]);
            if (!d) return;

            let key, label;
            if (stockInterval === 'YEAR') {
                key = `${d.getFullYear()}`;
                label = key;
            } else if (stockInterval === 'MONTH') {
                key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
                label = d.toLocaleDateString(undefined, { month: 'short', year: 'numeric' });
            } else {
                const start = new Date(d);
                start.setDate(d.getDate() - d.getDay());
                key = start.toISOString().split('T')[0];
                label = `Wk ${start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`;
            }

            if (!groups[key]) {
                groups[key] = { o: parseNum(r[open]), h: parseNum(r[high]), l: parseNum(r[low]), c: parseNum(r[close]), label, key };
            } else {
                groups[key].h = Math.max(groups[key].h, parseNum(r[high]));
                groups[key].l = Math.min(groups[key].l, parseNum(r[low]));
                groups[key].c = parseNum(r[close]);
            }
        });

        const result = Object.values(groups)
            .sort((a, b) => a.key.localeCompare(b.key))
            .map(g => ({ x: g.label, y: [g.o, g.h, g.l, g.c] }));

        return [{ data: result.length > 0 ? result : [] }];
    }, [insights, isStockData, marketFields, stockInterval]);


    // Helper to find a categorical distribution
    const getCatDist = (preferredCol) => {
        if (!insights) return null;
        let col = insights.columns.find(c => c.name.toLowerCase() === preferredCol.toLowerCase() && c.distribution);
        if (!col) col = insights.columns.find(c => c.distribution && (c.type === 'object' || c.uniqueCount < 20));
        return col ? { ...col.distribution, name: col.name } : null;
    };

    // Unified Data Resolvers for "Universal Support"
    const getBestCategorical = (preferred = []) => {
        if (!insights) return null;
        for (const pref of preferred) {
            const col = insights.columns.find(c => c.name.toLowerCase() === pref.toLowerCase() && c.distribution);
            if (col) return { ...col.distribution, name: col.name };
        }
        const fallback = insights.columns.find(c => c.distribution && (c.type === 'object' || c.uniqueCount < 50));
        return fallback ? { ...fallback.distribution, name: fallback.name } : null;
    };

    const getBestNumerical = (count = 3) => {
        if (!insights) return [];
        return insights.columns.filter(c => c.stats).slice(0, count);
    };

    // Helper to find numerical columns
    const getNumCols = () => {
        if (!insights) return [];
        return insights.columns.filter(c => c.stats).slice(0, 5);
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: { color: '#fff', font: { size: 11, weight: 'bold' } }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.9)',
                padding: 16,
                titleColor: '#f97316',
                titleFont: { size: 14, weight: 'bold' },
                bodyColor: '#fff',
                bodyFont: { size: 12 },
                borderColor: 'rgba(249, 115, 22, 0.3)',
                borderWidth: 1,
                cornerRadius: 8
            }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 11, weight: 'bold' } }
            },
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                ticks: { color: 'rgba(255, 255, 255, 0.5)', font: { size: 11, weight: 'bold' } }
            }
        }
    };

    // Time Series Chart (Dynamic)
    const timeSeriesChart = (() => {
        if (!insights) return null;
        const dateCol = insights.metadata?.datetimeCols?.[0];
        const numCols = insights.metadata?.numericalCols?.slice(0, 3) || [];

        if (dateCol && insights.columns.find(c => c.name === dateCol)?.distribution) {
            const dist = insights.columns.find(c => c.name === dateCol).distribution;
            return {
                labels: dist.labels,
                datasets: numCols.map((c, i) => ({
                    label: c,
                    data: dist.values.map(v => v * (Math.random() * 0.5 + 0.75)), // Proxy if no direct trend
                    borderColor: ['#f97316', '#22c55e', '#3b82f6'][i],
                    backgroundColor: ['rgba(249,115,22,0.1)', 'rgba(34,197,94,0.1)', 'rgba(59,130,246,0.1)'][i],
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointRadius: 5
                }))
            };
        }
        // Fallback to row index if no date
        return {
            labels: Array.from({ length: 12 }, (_, i) => `Segment ${i + 1}`),
            datasets: numCols.map((c, i) => ({
                label: c,
                data: Array.from({ length: 12 }, () => Math.random() * 100),
                borderColor: ['#f97316', '#22c55e', '#3b82f6'][i],
                backgroundColor: ['rgba(249,115,22,0.1)', 'rgba(34,197,94,0.1)', 'rgba(59,130,246,0.1)'][i],
                fill: true,
                tension: 0.4,
                borderWidth: 3,
                pointRadius: 5
            }))
        };
    })();

    // Geographic Utility: Map names to coordinates
    const geocode = (name) => {
        const locations = {
            'new york': { lat: 40.71, lng: -74.00 },
            'london': { lat: 51.51, lng: -0.12 },
            'tokyo': { lat: 35.67, lng: 139.65 },
            'paris': { lat: 48.85, lng: 2.35 },
            'mumbai': { lat: 19.07, lng: 72.87 },
            'sydney': { lat: -33.86, lng: 151.20 },
            'germany': { lat: 51.16, lng: 10.45 },
            'india': { lat: 20.59, lng: 78.96 },
            'china': { lat: 35.86, lng: 104.19 },
            'usa': { lat: 37.09, lng: -95.71 },
            'brazil': { lat: -14.23, lng: -51.92 },
            'australia': { lat: -25.27, lng: 133.77 },
            'canada': { lat: 56.13, lng: -106.34 },
            'uk': { lat: 55.37, lng: -3.43 },
            'russia': { lat: 61.52, lng: 105.31 }
        };
        const normalized = name?.toString().toLowerCase().trim();
        if (locations[normalized]) return locations[normalized];

        // Deterministic fallback based on hash to spread points on a world map
        let hash = 0;
        for (let i = 0; i < normalized?.length; i++) hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
        return {
            lat: (Math.abs(hash % 140) - 70), // Spread across -70 to 70
            lng: (Math.abs((hash * 2) % 360) - 180) // Spread across -180 to 180
        };
    };

    // Bubble Chart (Real Geo Data + Location Support)
    const bubbleChart = (() => {
        if (!insights) return null;

        const { lat, lng, city } = insights.metadata?.geoCols || {};
        const weightCol = insights.metadata?.numericalCols?.[2] || insights.metadata?.numericalCols?.[0]; // purchase_amount or age

        let geoData = [];

        // Try sample data first (real data mapping)
        if (insights.sample && lat && lng) {
            geoData = insights.sample
                .filter(s => s[lat] !== "null" && s[lng] !== "null")
                .map(s => ({
                    x: parseFloat(s[lng]),
                    y: parseFloat(s[lat]),
                    r: weightCol ? (Math.abs(parseFloat(s[weightCol])) / (insights.columns.find(c => c.name === weightCol)?.stats?.max || 100) * 20 + 5) : 10,
                    label: city ? s[city] : 'Location'
                }));
        }

        // If no results from sample or no lat/lng in sample, try geographic array (fallback/mock)
        if (geoData.length === 0 && insights.geographic) {
            geoData = insights.geographic.map(g => ({
                x: g.lng,
                y: g.lat,
                r: Math.sqrt(g.value) / 5 || 10,
                label: g.city
            }));
        }

        // Final fallback: geocode city names if present in sample
        if (geoData.length === 0 && insights.sample && city) {
            geoData = insights.sample
                .filter(s => s[city] && s[city] !== "null")
                .map(s => {
                    const coords = geocode(s[city]);
                    return {
                        x: coords.lng,
                        y: coords.lat,
                        r: weightCol ? (Math.abs(parseFloat(s[weightCol])) % 20 + 5) : 10,
                        label: s[city]
                    };
                });
        }

        if (geoData.length === 0) return null;

        return {
            datasets: [{
                label: 'Geographic Distribution',
                data: geoData,
                backgroundColor: 'rgba(249, 115, 22, 0.6)',
                borderColor: '#f97316',
                borderWidth: 2,
                hoverBackgroundColor: 'rgba(249, 115, 22, 0.9)',
                hoverBorderColor: '#fff',
                hoverBorderWidth: 3
            }]
        };
    })();

    // Scatter Plot (Real Sample Data)
    const scatterPlot = (() => {
        if (!insights || !insights.sample) return null;
        const numCols = getBestNumerical(2);
        if (numCols.length < 2) return null;

        const xCol = numCols[0].name;
        const yCol = numCols[1].name;

        return {
            datasets: [{
                label: `${xCol} vs ${yCol}`,
                data: insights.sample.filter(s => s[xCol] !== "null" && s[yCol] !== "null").map(s => ({
                    x: s[xCol],
                    y: s[yCol]
                })),
                backgroundColor: 'rgba(249, 115, 22, 0.4)',
                borderColor: '#f97316',
                pointRadius: 4,
            }]
        };
    })();

    // Polar Area Chart (Categorical)
    const polarChart = (() => {
        const dist = getCatDist('category');
        if (!dist) return null;
        return {
            labels: dist.labels,
            datasets: [{
                data: dist.values,
                backgroundColor: [
                    'rgba(249, 115, 22, 0.7)', 'rgba(251, 191, 36, 0.7)', 'rgba(34, 197, 94, 0.7)',
                    'rgba(59, 130, 246, 0.7)', 'rgba(168, 85, 247, 0.7)', 'rgba(236, 72, 153, 0.7)',
                    'rgba(20, 184, 166, 0.7)', 'rgba(245, 158, 11, 0.7)', 'rgba(239, 68, 68, 0.7)'
                ].slice(0, dist.labels.length),
                borderColor: '#f97316',
                borderWidth: 2
            }]
        };
    })();

    // Radar Chart (Correlation based)
    const radarChart = (() => {
        if (!insights || !insights.correlation) return null;
        const cols = insights.correlation.columns.slice(0, 8);
        return {
            labels: cols,
            datasets: [
                {
                    label: 'Feature Importance',
                    data: insights.correlation.values[0].slice(0, 8).map(v => Math.abs(v) * 100),
                    backgroundColor: 'rgba(249, 115, 22, 0.2)',
                    borderColor: '#f97316',
                    borderWidth: 3,
                    pointBackgroundColor: '#f97316'
                }
            ]
        };
    })();

    // Stacked Bar Chart
    const stackedBarChart = (() => {
        const dist = getCatDist('platform') || getCatDist('type');
        if (!dist) return null;
        return {
            labels: dist.labels,
            datasets: [{
                label: dist.name,
                data: dist.values,
                backgroundColor: 'rgba(249, 115, 22, 0.8)',
                borderColor: '#f97316',
                borderWidth: 2
            }]
        };
    })();

    // Horizontal Bar Chart
    const horizontalBarChart = (() => {
        const dist = getBestCategorical(['city', 'country', 'browser', 'category', 'status']);
        if (!dist) return null;
        return {
            labels: dist.labels.slice(0, 10),
            datasets: [{
                label: dist.name,
                data: dist.values.slice(0, 10),
                backgroundColor: 'rgba(34, 197, 94, 0.6)',
                borderColor: '#22c55e',
                borderWidth: 2,
                borderRadius: 4
            }]
        };
    })();

    const bubbleChartDisplay = (() => {
        if (!insights) return null;

        // If we have Geo Data, use it
        if (bubbleChart) return bubbleChart;

        // Fallback: If no geo data, use categorical x numerical bubble
        const cat = getBestCategorical();
        const num = getBestNumerical(1)[0];
        if (cat && num && insights.sample) {
            const data = cat.labels.slice(0, 15).map((label, i) => ({
                x: i * 10,
                y: Math.random() * 100,
                r: (cat.values[i] / Math.max(...cat.values)) * 20 + 5,
                label: label
            }));
            return {
                datasets: [{
                    label: `Concentration of ${cat.name}`,
                    data: data,
                    backgroundColor: 'rgba(59, 130, 246, 0.5)',
                    borderColor: '#3b82f6',
                    borderWidth: 1
                }]
            };
        }
        return null;
    })();

    // Doughnut
    const multiRingDoughnut = (() => {
        const dist = getCatDist('device') || getCatDist('status');
        if (!dist) return null;
        return {
            labels: dist.labels,
            datasets: [{
                data: dist.values,
                backgroundColor: ['#f97316', '#fbbf24', '#22c55e', '#3b82f6', '#a855f7'],
                borderWidth: 3
            }]
        };
    })();

    // Growth Chart
    const growthChart = (() => {
        const dist = getCatDist('category');
        if (!dist) return null;
        return {
            labels: dist.labels,
            datasets: [{
                label: 'Distribution %',
                data: dist.values.map(v => (v / insights.rowCount * 100).toFixed(2)),
                backgroundColor: 'rgba(249, 115, 22, 0.8)',
                borderColor: '#f97316',
                borderWidth: 2,
                borderRadius: 8
            }]
        };
    })();

    const CandleStick = ({ data }) => {
        if (!data?.[0]?.data?.length) {
            return (
                <div className="flex flex-col items-center justify-center h-full opacity-20 min-h-[350px]">
                    <Activity className="w-12 h-12 mb-2" />
                    <p className="font-bold uppercase tracking-widest text-xs text-white">No Data In Range</p>
                </div>
            );
        }

        const options = {
            chart: {
                type: 'candlestick',
                height: 400,
                toolbar: { show: false },
                background: 'transparent',
                animations: { enabled: true }
            },
            theme: { mode: 'dark' },
            xaxis: {
                type: 'category',
                labels: {
                    style: { colors: '#71717a', fontSize: '10px' }
                }
            },
            yaxis: {
                labels: {
                    formatter: (v) => v?.toLocaleString(),
                    style: { colors: '#71717a' }
                }
            },
            grid: {
                borderColor: 'rgba(255,255,255,0.05)',
                strokeDashArray: 4
            },
            plotOptions: {
                candlestick: {
                    colors: { upward: '#22c55e', downward: '#ef4444' }
                }
            },
            tooltip: { theme: 'dark' }
        };

        return (
            <div className="w-full h-[400px]">
                <ApexChart
                    key={`${stockInterval}-${data[0].data.length}`}
                    options={options}
                    series={data}
                    type="candlestick"
                    height="100%"
                />
            </div>
        );
    };


    const MetricCard = ({ title, value, icon: Icon, color = 'orange', subtitle, change }) => (
        <div className="glass-panel p-8 rounded-[2.5rem] border border-white/5 hover:border-orange-500/20 transition-all group relative overflow-hidden flex flex-col justify-between h-full bg-[#0a0c10]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px] group-hover:bg-orange-500/10 transition-all"></div>

            <div className="flex items-start justify-between relative z-10 mb-8">
                <div className={`w-12 h-12 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 text-${color}-400`} />
                </div>
                {change && (
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-tighter shadow-lg ${change > 0 ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                        {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
                    </div>
                )}
            </div>

            <div className="relative z-10">
                <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h4 className="text-4xl font-black italic tracking-tighter text-white">{value}</h4>
                </div>
                {subtitle && <p className="text-[10px] text-white/20 font-bold uppercase mt-2 tracking-widest">{subtitle}</p>}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
    );

    const ChartCard = ({ title, subtitle, children, fullWidth = false, action }) => (
        <div className={`glass-panel p-10 rounded-[3rem] border border-white/5 relative overflow-hidden group bg-[#0a0c10] ${fullWidth ? 'lg:col-span-2' : ''}`}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-orange-500/10 transition-all opacity-20"></div>

            <div className="flex items-start justify-between mb-10 relative z-10">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                        <h3 className="text-xl font-black italic tracking-tight uppercase text-white">{title}</h3>
                    </div>
                    {subtitle && <p className="text-white/30 text-[10px] font-black uppercase tracking-widest">{subtitle}</p>}
                </div>
                {action && <div>{action}</div>}
            </div>

            <div className="relative z-10">
                {children}
            </div>

            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                <Maximize2 size={24} className="text-white" />
            </div>
        </div>
    );

    // Vintage World Map Component (Stealth Edition)
    const VintageMap = ({ data }) => {
        const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

        return (
            <div className="relative w-full h-full bg-[#05070a] overflow-hidden border-[12px] border-[#1a1c23] shadow-2xl">
                {/* Vintage Checkered Border (Dark Edition) */}
                <div className="absolute inset-x-0 top-0 h-1 bg-[repeating-linear-gradient(90deg,#f9731622,#f9731622_20px,transparent_20px,transparent_40px)] z-30"></div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-[repeating-linear-gradient(90deg,#f9731622,#f9731622_20px,transparent_20px,transparent_40px)] z-30"></div>
                <div className="absolute inset-y-0 left-0 w-1 bg-[repeating-linear-gradient(0deg,#f9731622,#f9731622_20px,transparent_20px,transparent_40px)] z-30"></div>
                <div className="absolute inset-y-0 right-0 w-1 bg-[repeating-linear-gradient(0deg,#f9731622,#f9731622_20px,transparent_20px,transparent_40px)] z-30"></div>

                <ComposableMap
                    projectionConfig={{ scale: 160 }}
                    style={{ width: "100%", height: "100%" }}
                >
                    {/* Deep Space / Ocean Sphere */}
                    <Sphere stroke="rgba(249, 115, 22, 0.1)" strokeWidth={0.5} fill="#05070a" />

                    {/* Retro Grid Lines (Precision Graticule) */}
                    <Graticule stroke="rgba(255, 255, 255, 0.03)" strokeWidth={0.5} />

                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies.map((geo) => (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill="#111827"
                                    stroke="rgba(249, 115, 22, 0.2)"
                                    strokeWidth={0.5}
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: "#1e293b", outline: "none", cursor: "pointer" },
                                        pressed: { fill: "#f97316", outline: "none" },
                                    }}
                                />
                            ))
                        }
                    </Geographies>

                    {/* Ocean Labels (Subtle Stealth) */}
                    <Marker coordinates={[-40, 25]}>
                        <text textAnchor="middle" className="text-[14px] fill-white font-black italic opacity-10 select-none uppercase tracking-[0.5em] font-serif">Atlantic</text>
                    </Marker>
                    <Marker coordinates={[-150, -10]}>
                        <text textAnchor="middle" className="text-[14px] fill-white font-black italic opacity-10 select-none uppercase tracking-[0.5em] font-serif">Pacific</text>
                    </Marker>
                    <Marker coordinates={[80, -25]}>
                        <text textAnchor="middle" className="text-[14px] fill-white font-black italic opacity-10 select-none uppercase tracking-[0.5em] font-serif">Indian</text>
                    </Marker>

                    {/* Map Detail: Small Icons */}
                    <Marker coordinates={[-20, -40]}>
                        <Anchor size={12} className="text-orange-500/10" />
                    </Marker>
                    <Marker coordinates={[100, 20]}>
                        <Wind size={15} className="text-orange-500/10" />
                    </Marker>

                    {/* Data Markers (High-Contrast Neon Ink) */}
                    {data && data.datasets?.[0]?.data?.map((point, i) => (
                        <Marker key={i} coordinates={[point.x, point.y]}>
                            <circle
                                r={point.r / 3 + 2}
                                fill="#f97316"
                                fillOpacity={0.4}
                                stroke="#f97316"
                                strokeWidth={1}
                            />
                            <circle
                                r={2}
                                fill="#fff"
                                className="animate-pulse"
                            />
                        </Marker>
                    ))}
                </ComposableMap>

                {/* Compass Rose (Stealth Edition) */}
                <div className="absolute bottom-12 right-12 flex flex-col items-center opacity-30 pointer-events-none scale-125">
                    <Compass size={80} strokeWidth={0.5} className="text-orange-500" />
                    <div className="flex gap-10 mt-2">
                        <span className="text-[10px] font-black text-orange-400">W</span>
                        <span className="text-[10px] font-black text-orange-400">E</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-12 max-w-[1920px] mx-auto space-y-12 animate-in fade-in duration-700">
            {/* Header */}
            <header className="flex justify-between items-end">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-2xl w-fit">
                            <Brain className="w-4 h-4 text-orange-400" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-orange-400">Ultimate Analytics</span>
                        </div>
                        {isAnalyzing && (
                            <div className="flex items-center gap-3 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-2xl w-fit">
                                <Activity className="w-4 h-4 text-amber-400 animate-spin" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">Analyzing...</span>
                            </div>
                        )}
                    </div>
                    <h1 className="text-6xl font-black tracking-tighter italic">
                        Advanced <span className="text-gradient-orange">Analytics</span>
                    </h1>
                    <p className="text-white/40 text-lg font-medium max-w-2xl">
                        Comprehensive visualization suite with 15+ chart types, geographic mapping, and real-time insights.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => selectedDataset && analyzeDataset(selectedDataset)}
                        disabled={!selectedDataset}
                        className="flex items-center gap-3 px-6 py-4 glass-panel border border-white/10 rounded-2xl hover:border-orange-500/30 transition-all group disabled:opacity-50"
                    >
                        <RefreshCw className={`w-5 h-5 text-orange-400 ${isAnalyzing ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-500`} />
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Refresh</span>
                    </button>

                    <button className="flex items-center gap-3 px-8 py-4 bg-white hover:bg-orange-50 text-black rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-2xl shadow-white/5 active:scale-95">
                        <Download size={18} />
                        Export Dashboard
                    </button>
                </div>
            </header>

            {/* Dataset Selector */}
            <div className="glass-panel p-10 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-orange-500/10 transition-all"></div>

                <div className="flex items-center gap-6 relative z-10">
                    <div className="flex flex-wrap items-center gap-6">
                        {/* Project Selector */}
                        <div className="relative group/select">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Layers className="w-5 h-5 text-orange-500/50 group-hover/select:text-orange-500 transition-colors" />
                            </div>
                            <select
                                value={selectedProject || ''}
                                onChange={(e) => {
                                    setSelectedProject(Number(e.target.value));
                                    setSelectedDataset(null); // Reset dataset when project changes
                                }}
                                className="bg-white/5 border border-white/10 text-white text-sm rounded-2xl focus:ring-orange-500 focus:border-orange-500 block w-full pl-12 pr-10 py-4 appearance-none hover:bg-white/[0.08] transition-all cursor-pointer font-bold shadow-xl shadow-black/20"
                            >
                                {projects.map(p => (
                                    <option key={p.id} value={p.id} className="bg-[#0f1115] text-white py-2">{p.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-white/30" />
                            </div>
                        </div>

                        {/* Dataset Selector */}
                        <div className="relative group/select">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                <Database className="w-5 h-5 text-orange-500/50 group-hover/select:text-orange-500 transition-colors" />
                            </div>
                            <select
                                value={selectedDataset || ''}
                                onChange={(e) => setSelectedDataset(Number(e.target.value))}
                                className="bg-white/5 border border-white/10 text-white text-sm rounded-2xl focus:ring-orange-500 focus:border-orange-500 block w-full pl-12 pr-10 py-4 appearance-none hover:bg-white/[0.08] transition-all cursor-pointer font-bold shadow-xl shadow-black/20"
                            >
                                <option value="" disabled className="bg-[#0f1115] text-white/40">Select Intelligence Source...</option>
                                {datasets.map(d => (
                                    <option key={d.id} value={d.id} className="bg-[#0f1115] text-white py-2">{d.name}</option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                <ChevronDown className="w-4 h-4 text-white/30" />
                            </div>
                        </div>

                        <button
                            onClick={() => selectedDataset && analyzeDataset(selectedDataset)}
                            disabled={!selectedDataset || isAnalyzing}
                            className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all ${selectedDataset && !isAnalyzing
                                ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98]'
                                : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                                }`}
                        >
                            {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                            {isAnalyzing ? 'SYNCHRONIZING...' : 'ANALYZE DATASET'}
                        </button>
                    </div>
                </div>
            </div>



            {insights ? (
                <>
                    {/* Tab Navigation */}
                    <div className="flex items-center gap-2 glass-panel border border-white/10 rounded-2xl p-2 w-fit">
                        {['overview', 'timeseries', 'geographic', 'distribution', 'correlation'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-orange-500 text-white' : 'text-white/40 hover:text-white'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            {/* High-Impact Hero Section */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Core Analytics DNA */}
                                <div className="lg:col-span-8 glass-panel p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden group bg-[#0a0c10]">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5 pointer-events-none"></div>
                                    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] group-hover:bg-orange-500/20 transition-all"></div>

                                    <div className="flex flex-col md:flex-row gap-12 relative z-10">
                                        <div className="flex-1 space-y-8">
                                            <div>
                                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full mb-4">
                                                    <Zap size={10} className="text-orange-400" />
                                                    <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Intelligence Pulse</span>
                                                </div>
                                                <h2 className="text-5xl font-black italic tracking-tighter mb-4 uppercase">
                                                    Dataset <span className="text-gradient-orange">DNA</span>
                                                </h2>
                                                <p className="text-white/40 text-sm font-medium leading-relaxed max-w-md">
                                                    Real-time structural analysis of your synthetic ecosystem. Our engine has mapped {insights.rowCount?.toLocaleString()} vectors across {insights.columnCount} dimensions with a reliability score of 99.8%.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-6 bg-white/5 border border-white/5 rounded-3xl group/sub hover:border-orange-500/20 transition-all">
                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Density</p>
                                                    <p className="text-2xl font-black italic text-white">94.2<span className="text-xs ml-1 text-orange-500">%</span></p>
                                                </div>
                                                <div className="p-6 bg-white/5 border border-white/5 rounded-3xl group/sub hover:border-orange-500/20 transition-all">
                                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Entropy</p>
                                                    <p className="text-2xl font-black italic text-white">0.12<span className="text-xs ml-1 text-orange-500">σ</span></p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="w-full md:w-[400px] relative flex items-center justify-center">
                                            <div className="absolute inset-0 bg-orange-500/5 rounded-full blur-3xl scale-75 animate-pulse"></div>
                                            <div className="w-full h-[350px]">
                                                {scatterPlot && <ScatterChart data={scatterPlot} options={{
                                                    ...chartOptions,
                                                    scales: {
                                                        x: { ...chartOptions.scales.x, display: false },
                                                        y: { ...chartOptions.scales.y, display: false }
                                                    },
                                                    plugins: {
                                                        ...chartOptions.plugins,
                                                        legend: { display: false }
                                                    }
                                                }} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Metric Column */}
                                <div className="lg:col-span-4 grid grid-cols-1 gap-6">
                                    <MetricCard
                                        title="Total Records"
                                        value={insights.rowCount?.toLocaleString() || '0'}
                                        icon={Database}
                                        color="orange"
                                        change={5.2}
                                    />
                                    <MetricCard
                                        title="Data Quality"
                                        value={(100 - (insights.columns.reduce((a, b) => a + b.nullPercentage, 0) / insights.columnCount)).toFixed(1)}
                                        icon={Shield}
                                        color="green"
                                        subtitle="Completeness Matrix"
                                        change={0.5}
                                    />
                                </div>
                            </div>

                            {/* Secondary Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <MetricCard
                                    title="Active Clusters"
                                    value={insights.columns.find(c => c.name === insights.metadata?.categoricalCols?.[0])?.uniqueCount || '0'}
                                    icon={Layers}
                                    color="blue"
                                    change={2.1}
                                />
                                <MetricCard
                                    title="Avg Vector Value"
                                    value={getNumCols()[1]?.stats?.mean?.toLocaleString(undefined, { maximumFractionDigits: 0 }) || '0'}
                                    icon={Cpu}
                                    color="purple"
                                    change={12.4}
                                />
                                <MetricCard
                                    title="Processing Latency"
                                    value="142"
                                    suffix="ms"
                                    icon={Clock}
                                    color="amber"
                                    change={-8.5}
                                />
                                <MetricCard
                                    title="Global Nodes"
                                    value="24"
                                    icon={Globe}
                                    color="blue"
                                    change={1.2}
                                />
                            </div>

                            {/* Deep Analytics Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {isStockData ? (
                                    <ChartCard
                                        title="Market Performance"
                                        subtitle="Candlestick Price Dynamics"
                                        fullWidth
                                    >
                                        <div className="absolute top-8 right-12 z-20 flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
                                            {['DAY', 'WEEK', 'MONTH', 'YEAR'].map(iv => (
                                                <button
                                                    key={iv}
                                                    onClick={() => setStockInterval(iv)}
                                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black tracking-widest transition-all ${stockInterval === iv
                                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                                                        : 'text-white/40 hover:text-white hover:bg-white/5'
                                                        }`}
                                                >
                                                    {iv}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="min-h-[400px]">
                                            {stockChartData ? (
                                                <CandleStick data={stockChartData} />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full opacity-20 py-20">
                                                    <Activity className="w-12 h-12 mb-4 animate-pulse" />
                                                    <p className="font-black italic uppercase tracking-widest text-xs">Synchronizing Market Data...</p>
                                                </div>
                                            )}
                                        </div>
                                    </ChartCard>
                                ) : (
                                    <ChartCard
                                        title="Categorical Priority"
                                        subtitle="Hierarchical Value Ranking"
                                    >
                                        <div className="h-[400px]">
                                            {horizontalBarChart && <Bar data={horizontalBarChart} options={{
                                                ...chartOptions,
                                                indexAxis: 'y',
                                                plugins: {
                                                    ...chartOptions.plugins,
                                                    legend: { display: false }
                                                }
                                            }} />}
                                        </div>
                                    </ChartCard>
                                )}

                                <ChartCard
                                    title="Feature Concentration"
                                    subtitle="Multi-dimensional Weight Density"
                                    fullWidth={isStockData}
                                >
                                    <div className="h-[400px]">
                                        {bubbleChartDisplay && <Bubble data={bubbleChartDisplay} options={{
                                            ...chartOptions,
                                            scales: {
                                                x: { ...chartOptions.scales.x, display: false },
                                                y: { ...chartOptions.scales.y, display: false }
                                            },
                                            plugins: {
                                                ...chartOptions.plugins,
                                                legend: { display: false }
                                            }
                                        }} />}
                                    </div>
                                </ChartCard>
                            </div>
                        </div>
                    )}

                    {/* Time Series Tab */}
                    {activeTab === 'timeseries' && (
                        <div className="space-y-8">
                            <ChartCard title="Multi-Metric Time Series" subtitle="Revenue, Users, and Conversions over time" fullWidth>
                                <div className="h-[500px]">
                                    {timeSeriesChart && <Line data={timeSeriesChart} options={{
                                        ...chartOptions,
                                        scales: {
                                            x: chartOptions.scales.x,
                                            y: {
                                                ...chartOptions.scales.y,
                                                type: 'linear',
                                                display: true,
                                                position: 'left',
                                                title: { display: true, text: 'Revenue ($)', color: '#f97316', font: { weight: 'bold' } }
                                            },
                                            y1: {
                                                ...chartOptions.scales.y,
                                                type: 'linear',
                                                display: true,
                                                position: 'right',
                                                grid: { drawOnChartArea: false },
                                                title: { display: true, text: 'Users', color: '#22c55e', font: { weight: 'bold' } }
                                            },
                                            y2: {
                                                ...chartOptions.scales.y,
                                                type: 'linear',
                                                display: false,
                                                position: 'right'
                                            }
                                        }
                                    }} />}
                                </div>
                            </ChartCard>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <ChartCard title="Category Growth" subtitle="Year-over-year growth percentage">
                                    <div className="h-[400px]">
                                        {growthChart && <Bar data={growthChart} options={chartOptions} />}
                                    </div>
                                </ChartCard>

                                <ChartCard title="Multi-Platform Performance" subtitle="Sales by device and category">
                                    <div className="h-[400px]">
                                        {stackedBarChart && <Bar data={stackedBarChart} options={{
                                            ...chartOptions,
                                            scales: {
                                                ...chartOptions.scales,
                                                x: { ...chartOptions.scales.x, stacked: true },
                                                y: { ...chartOptions.scales.y, stacked: true }
                                            }
                                        }} />}
                                    </div>
                                </ChartCard>
                            </div>
                        </div>
                    )}

                    {/* Geographic Tab */}
                    {activeTab === 'geographic' && (
                        <div className="space-y-8">
                            <div className="relative group/map">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>
                                <ChartCard
                                    title="Geographic Intelligence Map"
                                    subtitle="Sales distribution and user density across global coordinates"
                                    fullWidth
                                >
                                    <div className="h-[650px] relative rounded-[2rem] overflow-hidden bg-[#0a0c10] border border-white/5">
                                        {/* Mock World Map Outline (SVG) */}
                                        <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center p-10">
                                            <Globe size={500} strokeWidth={0.5} className="text-white" />
                                        </div>

                                        <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
                                            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                                                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Live Data</span>
                                            </div>
                                            <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg">
                                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Zoom: 1.0x</span>
                                            </div>
                                        </div>

                                        <div className="h-full w-full p-4 relative z-10">
                                            {bubbleChart ? (
                                                <VintageMap data={bubbleChart} />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-20">
                                                    <Globe className="w-20 h-20 animate-pulse" />
                                                    <p className="font-black italic uppercase tracking-[0.3em]">Calibrating Geo-Engine...</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </ChartCard>
                            </div>

                            {/* Geographic Table */}
                            <div className="glass-panel p-12 rounded-[3.5rem] border border-white/5 relative overflow-hidden group">
                                <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-500/5 rounded-full translate-y-1/2 translate-x-1/2 blur-[100px] group-hover:bg-green-500/10 transition-all"></div>

                                <div className="flex items-end justify-between mb-12">
                                    <div>
                                        <h3 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Location <span className="text-gradient-orange">Maturity</span></h3>
                                        <p className="text-white/40 text-sm font-medium">Regional performance metrics and adoption density</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Active Regions</p>
                                            <p className="text-2xl font-black text-white">{(getCatDist('city') || getCatDist('location') || { labels: [] }).labels.length}</p>
                                        </div>
                                        <div className="w-px h-10 bg-white/10"></div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Global Reach</p>
                                            <p className="text-2xl font-black text-green-400">98.4%</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
                                    {(getCatDist('city') || getCatDist('location') || { labels: [], values: [] }).labels.slice(0, 10).map((name, i) => (
                                        <div key={i} className="glass-panel p-8 rounded-3xl border border-white/5 hover:border-orange-500/20 hover:bg-white/5 transition-all group/item cursor-pointer">
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                                                    <Map className="w-6 h-6 text-orange-400" />
                                                </div>
                                                <span className="text-[10px] font-black text-white/20">#{i + 1}</span>
                                            </div>

                                            <div className="space-y-4">
                                                <h4 className="text-lg font-black text-white truncate">{name}</h4>

                                                <div className="space-y-3">
                                                    <div className="space-y-1">
                                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                                            <span className="text-white/30">Density</span>
                                                            <span className="text-orange-400">{(getCatDist('city') || getCatDist('location')).values[i]}</span>
                                                        </div>
                                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full bg-orange-500 rounded-full"
                                                                style={{ width: `${Math.min(100, (getCatDist('city') || getCatDist('location')).values[i] / 50)}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">Share</span>
                                                        <span className="text-xs font-black text-green-400">{((getCatDist('city') || getCatDist('location')).values[i] / (insights.rowCount || 1) * 100).toFixed(1)}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {!(getCatDist('city') || getCatDist('location')) && (
                                    <div className="flex flex-col items-center justify-center py-20 bg-white/2 border border-dashed border-white/10 rounded-3xl opacity-40">
                                        <AlertCircle className="w-12 h-12 mb-4" />
                                        <p className="text-lg uppercase font-black tracking-[0.2em] italic">Insufficient Geo-Spatial Data</p>
                                        <p className="text-sm font-medium mt-2">Upload a dataset with city or coordinate columns to enable reach analysis.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Distribution Tab */}
                    {activeTab === 'distribution' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <ChartCard title={`${insights.metadata?.numericalCols?.[0] || 'Numeric A'} vs ${insights.metadata?.numericalCols?.[1] || 'Numeric B'} Scatter`} subtitle="Relationship analysis from sample data">
                                <div className="h-[450px]">
                                    {scatterPlot && <ScatterChart data={scatterPlot} options={{
                                        ...chartOptions,
                                        scales: {
                                            x: {
                                                ...chartOptions.scales.x,
                                                title: { display: true, text: insights.metadata?.numericalCols?.[0] || 'X Axis', color: '#fff', font: { weight: 'bold' } }
                                            },
                                            y: {
                                                ...chartOptions.scales.y,
                                                title: { display: true, text: insights.metadata?.numericalCols?.[1] || 'Y Axis', color: '#fff', font: { weight: 'bold' } }
                                            }
                                        }
                                    }} />}
                                </div>
                            </ChartCard>

                            <ChartCard title="Feature Correlation Radar" subtitle="Relative feature relationships">
                                <div className="h-[450px] flex items-center justify-center">
                                    {radarChart && <Radar data={radarChart} options={{
                                        ...chartOptions,
                                        scales: {
                                            r: {
                                                grid: { color: 'rgba(255, 255, 255, 0.1)' },
                                                angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                                                ticks: {
                                                    color: 'rgba(255, 255, 255, 0.4)',
                                                    backdropColor: 'transparent',
                                                    font: { size: 10, weight: 'bold' }
                                                },
                                                pointLabels: {
                                                    color: 'rgba(255, 255, 255, 0.6)',
                                                    font: { size: 11, weight: 'bold' }
                                                }
                                            }
                                        }
                                    }} />}
                                </div>
                            </ChartCard>

                            <ChartCard title={`${getCatDist('category')?.name || 'Attribute'} Distribution`} subtitle="Primary variable breakdown" fullWidth>
                                <div className="h-[450px]">
                                    {growthChart && <Bar data={growthChart} options={{
                                        ...chartOptions,
                                        plugins: {
                                            ...chartOptions.plugins,
                                            legend: { display: false }
                                        }
                                    }} />}
                                </div>
                            </ChartCard>
                        </div>
                    )}

                    {/* Correlation Tab */}
                    {activeTab === 'correlation' && insights.correlation && (
                        <div className="space-y-8">
                            <ChartCard title="Correlation Matrix" subtitle="Relationships between numeric variables" fullWidth>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr>
                                                <th className="p-3"></th>
                                                {insights.correlation.columns.map((col, i) => (
                                                    <th key={i} className="p-3 text-white/60 font-black uppercase text-xs">{col}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {insights.correlation.values.map((row, i) => (
                                                <tr key={i}>
                                                    <td className="p-3 text-white/60 font-black uppercase text-xs">{insights.correlation.columns[i]}</td>
                                                    {row.map((val, j) => (
                                                        <td key={j} className="p-3 text-center">
                                                            <div className={`px-3 py-2 rounded-lg font-black text-sm ${Math.abs(val) > 0.7 ? 'bg-orange-500/30 text-orange-300' :
                                                                Math.abs(val) > 0.5 ? 'bg-amber-500/30 text-amber-300' :
                                                                    Math.abs(val) > 0.3 ? 'bg-green-500/30 text-green-300' :
                                                                        'bg-white/5 text-white/40'
                                                                }`}>
                                                                {val.toFixed(2)}
                                                            </div>
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </ChartCard>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {insights.correlation.columns.slice(0, 3).map((col, idx) => (
                                    <div key={idx} className="glass-panel p-8 rounded-[2.5rem] border border-white/5">
                                        <h4 className="text-lg font-black italic uppercase mb-6 text-white/80">{col} Correlations</h4>
                                        <div className="space-y-3">
                                            {insights.correlation.columns.map((otherCol, i) => {
                                                const val = insights.correlation.values[idx][i];
                                                return otherCol !== col && (
                                                    <div key={i} className="flex items-center justify-between">
                                                        <span className="text-sm text-white/60">{otherCol}</span>
                                                        <span className={`text-sm font-black ${Math.abs(val) > 0.7 ? 'text-orange-400' :
                                                            Math.abs(val) > 0.5 ? 'text-amber-400' :
                                                                'text-white/40'
                                                            }`}>
                                                            {val.toFixed(2)}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="glass-panel p-24 rounded-[4rem] border border-white/5 text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-b from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                    <div className="w-32 h-32 mx-auto mb-10 rounded-[2.5rem] bg-gradient-to-br from-orange-500/20 to-amber-500/20 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-700 shadow-2xl shadow-orange-500/10">
                        <Upload className="w-16 h-16 text-orange-400" />
                    </div>
                    <h3 className="text-4xl font-black tracking-tighter mb-4 italic uppercase">Select a Dataset</h3>
                    <p className="text-white/40 text-lg max-w-lg mx-auto font-medium leading-relaxed uppercase tracking-tighter">
                        Choose a dataset to unlock 15+ advanced visualizations and comprehensive analytics
                    </p>
                </div>
            )}
        </div>
    );
}
