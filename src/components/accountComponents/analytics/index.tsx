// AnalyticsDashboard.tsx
import React, { useState, useEffect } from 'react';
import { format, parseISO, subDays, isAfter, isBefore, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, Calendar, Target, Clock, MapPin, AlertCircle } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';

// Types
interface TimeOfEvent {
    from: string;
    to: string;
}

interface Image {
    url: string;
    public_id: string;
}

interface EventParticipant {
    userId: string;
    status: string;
    _id: string;
}

interface User {
    avatar: Image;
    _id: string;
    name: string;
}

interface Event {
    _id: string;
    title: string;
    description: string;
    dateOfEvent: string;
    timeOfEvent: TimeOfEvent;
    location: string;
    category: string;
    status: 'pending' | 'published' | 'cancelled';
    createdBy: User;
    EventParticipants: EventParticipant[];
    city?: string;
    country?: string;
    createdAt?: string;
}

interface ServerResponse {
    message: string;
    data: {
        page: number;
        result: Event[];
    };
}

interface DashboardMetrics {
    totalEvents: number;
    activeEvents: number;
    upcomingEvents: number;
    totalParticipants: number;
    avgParticipantsPerEvent: number;
    popularCategories: Array<{ category: string; count: number }>;
    locationDistribution: Array<{ location: string; count: number }>;
    timeSlotAnalysis: Array<{ slot: string; count: number }>;
    categoryGrowth: Array<{ category: string; count: number; growth: number }>;
    retentionRate: number;
    participationTrends: Array<{ date: string; participants: number }>;
    topPerformingEvents: Event[];
    monthlyComparison: Array<{
        month: string;
        events: number;
        participants: number;
    }>;
}

const COLORS = ['#9DC3E6', '#96E6D7', '#FFD485', '#FFB499', '#D5B5E3', '#A8E6B8'];

const TIME_RANGES = [
    { value: '7', label: 'Last 7 days' },
    { value: '30', label: 'Last 30 days' },
    { value: '90', label: 'Last 90 days' }
];

const AnalyticsDashboard: React.FC = () => {
    const [timeRange, setTimeRange] = useState('30');
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [metrics, setMetrics] = useState<DashboardMetrics>({
        totalEvents: 0,
        activeEvents: 0,
        upcomingEvents: 0,
        totalParticipants: 0,
        avgParticipantsPerEvent: 0,
        popularCategories: [],
        locationDistribution: [],
        timeSlotAnalysis: [],
        participationTrends: [],
        categoryGrowth: [],
        retentionRate: 0,
        topPerformingEvents: [],
        monthlyComparison: [],
    });

    // Fetch data from server
    useEffect(() => {
        const fetchEvents = async () => {
            setIsLoading(true);
            try {
                const token = Cookies.get('token');
                if (!token) {
                    throw new Error('No authentication token found');
                }

                const response = await axios.get<ServerResponse>(
                    `${process.env.NEXT_PUBLIC_BASE_URL}/event`,
                    {
                        headers: { token }
                    }
                );

                if (response.data.message === 'success') {
                    setEvents(response.data.data.result);
                } else {
                    throw new Error('Failed to fetch events');
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred while fetching events');
                console.error('Error fetching events:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [timeRange]);

    // Calculate metrics whenever events or timeRange changes
    useEffect(() => {
        if (!isLoading && !error && events.length > 0) {
            calculateMetrics();
        }
    }, [events, timeRange]);

    const calculateMetrics = () => {
        try {
            const now = new Date();
            const cutoffDate = subDays(now, parseInt(timeRange));

            // Filter events within time range using dateOfEvent
            const filteredEvents = events.filter(event => {
                const eventDate = parseISO(event.dateOfEvent);
                return isAfter(eventDate, cutoffDate) && isBefore(eventDate, addDays(now, 90));
            });

            // Calculate active and upcoming events
            const activeEvents = filteredEvents.filter(event =>
                isAfter(parseISO(event.dateOfEvent), now) &&
                event.status === 'published'
            );

            const upcomingEvents = filteredEvents.filter(event =>
                isAfter(parseISO(event.dateOfEvent), now)
            );

            // Calculate total participants
            const totalParticipants = filteredEvents.reduce((sum, event) =>
                sum + (event.EventParticipants?.length || 0), 0
            );

            // Category analysis
            const categoryCount = filteredEvents.reduce((acc, event) => {
                if (event.category) {
                    acc[event.category] = (acc[event.category] || 0) + 1;
                }
                return acc;
            }, {} as Record<string, number>);

            // Location distribution
            const locationCount = filteredEvents.reduce((acc, event) => {
                const location = event.location === 'online'
                    ? 'Online'
                    : event.city && event.country
                        ? `${event.city}, ${event.country}`
                        : event.location || 'Unknown';
                acc[location] = (acc[location] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            // Time slot analysis
            const timeSlots = filteredEvents.reduce((acc, event) => {
                const hour = parseInt(event.timeOfEvent.from.split(':')[0]);
                const slot = getTimeSlot(hour);
                acc[slot] = (acc[slot] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            // Calculate category growth
            const categoryGrowth = Object.entries(categoryCount).map(([category, count]) => ({
                category,
                count,
                growth: calculateCategoryGrowthRate(category, filteredEvents, cutoffDate)
            }));

            // Participation trends by date
            const participationTrends = calculateParticipationTrends(filteredEvents);

            // Top performing events
            const topPerformingEvents = [...filteredEvents]
                .sort((a, b) => (b.EventParticipants?.length || 0) - (a.EventParticipants?.length || 0))
                .slice(0, 5);

            setMetrics({
                totalEvents: filteredEvents.length,
                activeEvents: activeEvents.length,
                upcomingEvents: upcomingEvents.length,
                totalParticipants,
                avgParticipantsPerEvent: filteredEvents.length ? totalParticipants / filteredEvents.length : 0,
                popularCategories: Object.entries(categoryCount)
                    .map(([category, count]) => ({ category, count }))
                    .sort((a, b) => b.count - a.count),
                locationDistribution: Object.entries(locationCount)
                    .map(([location, count]) => ({ location, count })),
                timeSlotAnalysis: Object.entries(timeSlots)
                    .map(([slot, count]) => ({ slot, count }))
                    .sort((a, b) => b.count - a.count),
                categoryGrowth,
                retentionRate: calculateRetentionRate(filteredEvents),
                participationTrends,
                topPerformingEvents,
                monthlyComparison: [],
            });
        } catch (err) {
            console.error('Error calculating metrics:', err);
            setError('Error calculating metrics');
        }
    };

    const calculateRetentionRate = (filteredEvents: Event[]): number => {
        const participantFrequency: Record<string, number> = {};

        filteredEvents.forEach(event => {
            event.EventParticipants?.forEach(participant => {
                participantFrequency[participant.userId] = (participantFrequency[participant.userId] || 0) + 1;
            });
        });

        const returningParticipants = Object.values(participantFrequency).filter(freq => freq > 1).length;
        const totalUniqueParticipants = Object.keys(participantFrequency).length;

        return totalUniqueParticipants ? (returningParticipants / totalUniqueParticipants) * 100 : 0;
    };

    const getTimeSlot = (hour: number): string => {
        if (hour < 6) return 'Early Morning';
        if (hour < 12) return 'Morning';
        if (hour < 17) return 'Afternoon';
        if (hour < 21) return 'Evening';
        return 'Night';
    };

    const calculateCategoryGrowthRate = (
        category: string,
        filteredEvents: Event[],
        cutoffDate: Date
    ): number => {
        const midPoint = new Date((cutoffDate.getTime() + new Date().getTime()) / 2);

        const previousPeriodEvents = filteredEvents.filter(event =>
            event.category === category &&
            isBefore(parseISO(event.dateOfEvent), midPoint)
        ).length;

        const currentPeriodEvents = filteredEvents.filter(event =>
            event.category === category &&
            isAfter(parseISO(event.dateOfEvent), midPoint)
        ).length;

        return previousPeriodEvents === 0 ? 100 :
            ((currentPeriodEvents - previousPeriodEvents) / previousPeriodEvents) * 100;
    };

    const calculateParticipationTrends = (filteredEvents: Event[]) => {
        const trendsByDate = filteredEvents.reduce((acc, event) => {
            const date = format(parseISO(event.dateOfEvent), 'yyyy-MM-dd');
            if (!acc[date]) {
                acc[date] = { date, participants: 0 };
            }
            acc[date].participants += event.EventParticipants?.length || 0;
            return acc;
        }, {} as Record<string, { date: string; participants: number }>);

        return Object.values(trendsByDate).sort((a, b) =>
            parseISO(a.date).getTime() - parseISO(b.date).getTime()
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="w-full p-2 md:p-4 space-y-4 overflow-x-hidden">
            {/* Header and Time Range Selector */}
            <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 w-full">
                <h1 className="text-xl md:text-2xl font-bold">Event Analytics</h1>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-[140px] md:w-[180px]">
                        <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                        {TIME_RANGES.map(range => (
                            <SelectItem key={range.value} value={range.value}>
                                {range.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
                <Card className="w-full">
                    <CardHeader className="flex flex-row items-center space-x-2 p-4">
                        <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
                        <CardTitle className="text-base md:text-lg">Total Events</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-2xl md:text-3xl font-bold">{metrics.totalEvents}</p>
                        <p className="text-xs md:text-sm text-gray-500">{metrics.upcomingEvents} upcoming</p>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader className="flex flex-row items-center space-x-2 p-4">
                        <Users className="h-4 w-4 text-green-500 shrink-0" />
                        <CardTitle className="text-base md:text-lg">Participants</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-2xl md:text-3xl font-bold">{metrics.totalParticipants}</p>
                        <p className="text-xs md:text-sm text-gray-500">~{Math.round(metrics.avgParticipantsPerEvent)} per event</p>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader className="flex flex-row items-center space-x-2 p-4">
                        <Target className="h-4 w-4 text-purple-500 shrink-0" />
                        <CardTitle className="text-base md:text-lg">Retention</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-2xl md:text-3xl font-bold">{metrics.retentionRate.toFixed(1)}%</p>
                        <p className="text-xs md:text-sm text-gray-500">returning participants</p>
                    </CardContent>
                </Card>

                <Card className="w-full">
                    <CardHeader className="flex flex-row items-center space-x-2 p-4">
                        <Clock className="h-4 w-4 text-orange-500 shrink-0" />
                        <CardTitle className="text-base md:text-lg">Active Events</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                        <p className="text-2xl md:text-3xl font-bold">{metrics.activeEvents}</p>
                        <p className="text-xs md:text-sm text-gray-500">published & upcoming</p>
                    </CardContent>
                </Card>
            </div>

            {/* Primary Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4">
                {/* Category Distribution */}
                <Card className="w-full h-[350px] md:h-[400px]">
                    <CardHeader className="p-4">
                        <CardTitle className="text-base md:text-lg">Category Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 h-[250px] md:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={metrics.popularCategories}
                                    dataKey="count"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius="70%"
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                    {metrics.popularCategories.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [`${value} events`, name]} />
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Category Growth Rates */}
                <Card className="w-full h-[350px] md:h-[400px]">
                    <CardHeader className="p-4">
                        <CardTitle className="text-base md:text-lg">Category Growth</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 h-[250px] md:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.categoryGrowth} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                                <XAxis type="number" domain={['auto', 'auto']} />
                                <YAxis dataKey="category" type="category" width={100} />
                                <Tooltip formatter={(value: number) => [`${value.toFixed(1)}% growth`]} />
                                <Bar dataKey="growth" fill="#A8E6B8">
                                    {metrics.categoryGrowth.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.growth >= 0 ? '#A8E6B8' : '#FFB499'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="w-full h-[350px] md:h-[400px]">
                    <CardHeader className="p-4">
                        <CardTitle className="text-base md:text-lg flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            Event Timing Analytics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 h-[250px] md:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={metrics.timeSlotAnalysis}
                                    dataKey="count"
                                    nameKey="slot"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                >
                                    {metrics.timeSlotAnalysis.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            strokeWidth={2}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white p-2 border rounded shadow-lg">
                                                    <p className="text-sm font-medium">{payload[0].name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {payload[0].value} events ({((Number(payload[0].value) / metrics.totalEvents) * 100).toFixed(1)}%)
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Legend
                                    layout="vertical"
                                    align="right"
                                    verticalAlign="middle"
                                    wrapperStyle={{ fontSize: '12px', paddingLeft: '10px' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Time Slot Distribution */}
                <Card className="w-full h-[350px] md:h-[400px]">
                    <CardHeader className="p-4">
                        <CardTitle className="text-base md:text-lg">Popular Time Slots</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 h-[250px] md:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={metrics.timeSlotAnalysis}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="slot"
                                    angle={-45}
                                    textAnchor="end"
                                    height={60}
                                    interval={0}
                                />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#8884d8">
                                    {metrics.timeSlotAnalysis.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Location Distribution - Updated */}
                <Card className="w-full h-[350px] md:h-[400px] lg:col-span-2">
                    <CardHeader className="p-4">
                        <CardTitle className="text-base md:text-lg flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-blue-500" />
                            Event Locations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 h-[250px] md:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={metrics.locationDistribution.sort((a, b) => b.count - a.count)}
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    horizontal={false}
                                    stroke="#f0f0f0"
                                />
                                <XAxis
                                    type="number"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 12 }}
                                />
                                <YAxis
                                    dataKey="location"
                                    type="category"
                                    width={150}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 12 }}
                                />
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white p-3 border rounded shadow-lg">
                                                    <p className="text-sm font-medium">{payload[0].payload.location}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {payload[0].value} events
                                                        <span className="text-xs ml-1">
                                                            ({((Number(payload[0].value) / metrics.totalEvents) * 100).toFixed(1)}%)
                                                        </span>
                                                    </p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar
                                    dataKey="count"
                                    radius={[0, 4, 4, 0]}
                                >
                                    {metrics.locationDistribution.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={`hsl(${index * (360 / metrics.locationDistribution.length)}, 70%, 60%)`}
                                            style={{ filter: 'brightness(1.1)' }}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Monthly Performance Overview - Updated */}
                <Card className="w-full h-[350px] md:h-[400px] lg:col-span-2">
                    <CardHeader className="p-4">
                        <CardTitle className="text-base md:text-lg flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            Monthly Performance Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 h-[250px] md:h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={metrics.monthlyComparison}
                                margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 12 }}
                                    padding={{ left: 20, right: 20 }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 12 }}
                                    stroke="#8884d8"
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#666', fontSize: 12 }}
                                    stroke="#82ca9d"
                                />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-white p-3 border rounded shadow-lg">
                                                    <p className="text-sm font-semibold mb-2">{label}</p>
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                                            <p className="text-sm">
                                                                Events: <span className="font-medium">{payload[0].value}</span>
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                                            <p className="text-sm">
                                                                Participants: <span className="font-medium">{payload[1].value}</span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Legend
                                    verticalAlign="top"
                                    height={36}
                                    content={({ payload }) => (
                                        <div className="flex justify-center gap-6">
                                            {payload?.map((entry, index) => (
                                                <div key={`legend-${index}`} className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: entry.color }}
                                                    />
                                                    <span className="text-sm text-gray-600">{entry.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                />
                                <Line
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="events"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={{
                                        stroke: '#8884d8',
                                        strokeWidth: 2,
                                        r: 4,
                                        fill: '#fff'
                                    }}
                                    activeDot={{
                                        stroke: '#8884d8',
                                        strokeWidth: 2,
                                        r: 6,
                                        fill: '#fff'
                                    }}
                                    name="Events"
                                />
                                <Line
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="participants"
                                    stroke="#82ca9d"
                                    strokeWidth={2}
                                    dot={{
                                        stroke: '#82ca9d',
                                        strokeWidth: 2,
                                        r: 4,
                                        fill: '#fff'
                                    }}
                                    activeDot={{
                                        stroke: '#82ca9d',
                                        strokeWidth: 2,
                                        r: 6,
                                        fill: '#fff'
                                    }}
                                    name="Participants"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            {/* Top Performing Events Table */}
            <Card className="w-full">
                <CardHeader className="p-4">
                    <CardTitle className="text-base md:text-lg">Top Performing Events</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <div className="min-w-full inline-block align-middle">
                            <div className="overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                                                Event Title
                                            </th>
                                            <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                                                Category
                                            </th>
                                            <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                                                Date
                                            </th>
                                            <th className="px-3 md:px-4 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-muted-foreground">
                                                Participants
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {metrics.topPerformingEvents.map((event) => (
                                            <tr key={event._id} className="hover:bg-gray-50">
                                                <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-900 whitespace-nowrap">
                                                    {event.title}
                                                </td>
                                                <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-500 whitespace-nowrap">
                                                    {event.category}
                                                </td>
                                                <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-500 whitespace-nowrap">
                                                    {format(parseISO(event.dateOfEvent), 'MMM d, yyyy')}
                                                </td>
                                                <td className="px-3 md:px-4 py-2 md:py-3 text-xs md:text-sm text-gray-500 whitespace-nowrap">
                                                    {event.EventParticipants?.length || 0}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {metrics.totalEvents === 0 && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs md:text-sm">
                        No events found for the selected time period.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default AnalyticsDashboard;