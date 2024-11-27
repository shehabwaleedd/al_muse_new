'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useUserEvents } from '@/lib/events/client/useUserEvents'
import { useAuth } from '@/context/AuthContext'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Calendar,
    Users,
    UserCircle,
    Crown,
    CalendarDays,
} from 'lucide-react'
import { User } from '@/types/common'
import LoadingScreen from '@/animation/loading/Loading'


interface UserEvent {
    _id: string
    title: string
    createdBy: string
    EventParticipants?: User[]
    description?: string
    location?: string
    createdAt: string
    updatedAt: string

}

interface AuthUser {
    _id: string
    // Add other user fields if needed
}

interface AuthContextType {
    user: AuthUser | null
}

const LoadingState = () => (
    <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
                <CardHeader>
                    <Skeleton className="h-8 w-[200px]" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        ))}
    </div>
)

const EmptyState = ({ message }: { message: string }) => (
    <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Events Found</h3>
            <span className="text-sm text-muted-foreground mt-2">{message}</span>
        </CardContent>
    </Card>
)

const ParticipantItem: React.FC<{ participant: User }> = ({ participant }) => (
    <Link
        href={`/users/${participant._id}?fetchParam1=${participant.name}&fetchParam2=${participant.avatar?.url}`}
        className="flex items-center space-x-4 p-2 rounded-lg hover:bg-accent transition-colors"
    >
        <Avatar className="h-8 w-8">
            <AvatarImage src={participant.avatar?.url ?? '/user.png'} alt={participant.name} />
            <AvatarFallback>{participant.name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span className="text-sm font-medium">{participant.name}</span>
    </Link>
)

interface EventCardProps {
    event: UserEvent
    isOwner?: boolean
}

const EventCard: React.FC<EventCardProps> = ({ event, isOwner = false }) => {
    const formattedDate = new Date(event.createdAt).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    const participantsCount = event.EventParticipants?.length ?? 0

    return (
        <Card className="mb-4">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold">{event.title}</h3>
                        {isOwner && (
                            <Badge variant="secondary" className="ml-2">
                                <Crown className="h-3 w-3 mr-1" /> Organizer
                            </Badge>
                        )}
                    </div>
                    <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                    >
                        <Users className="h-3 w-3" />
                        {participantsCount} participants
                    </Badge>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <CalendarDays className="h-4 w-4 mr-2" />
                    {formattedDate}
                </div>
            </CardHeader>
            <CardContent>
                {event.description && (
                    <span className="text-sm text-muted-foreground mb-4">
                        {event.description}
                    </span>
                )}
                {participantsCount > 0 && event.EventParticipants && (
                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="participants">
                            <AccordionTrigger>
                                View Participants
                            </AccordionTrigger>
                            <AccordionContent>
                                <ScrollArea className="h-[200px] rounded-md border p-4">
                                    <div className="space-y-2">
                                        {event.EventParticipants.map((participant) => (
                                            <ParticipantItem
                                                key={participant._id}
                                                participant={participant}
                                            />
                                        ))}
                                    </div>
                                </ScrollArea>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                )}
            </CardContent>
        </Card>
    )
}

const UserEventsAndParticipation = () => {
    const { user } = useAuth() as AuthContextType
    const { events: rawEvents = [], loading } = useUserEvents(user?._id ?? '')
    const events = rawEvents as unknown as UserEvent[]

    const { createdEvents, participatedEvents } = useMemo(() => {
        if (!user?._id) return { createdEvents: [], participatedEvents: [] }

        const created = events.filter(event => event.createdBy === user._id)
        const participated = events.filter(event =>
            event.createdBy !== user._id &&
            event.EventParticipants?.some(p => p._id === user._id)
        )
        return { createdEvents: created, participatedEvents: participated }
    }, [events, user?._id])

    if (loading) {
        return <LoadingScreen />
    }

    return (
        <div className="space-y-6 mt-32">
            <Tabs defaultValue="organized" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="organized" className="flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        Events Organized
                        {createdEvents.length > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {createdEvents.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="participated" className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4" />
                        Events Participated
                        {participatedEvents.length > 0 && (
                            <Badge variant="secondary" className="ml-2">
                                {participatedEvents.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="organized" className="mt-6">
                    {createdEvents.length === 0 ? (
                        <EmptyState message="You haven't organized any events yet." />
                    ) : (
                        <div className="space-y-4">
                            {createdEvents.map((event) => (
                                <EventCard
                                    key={event._id}
                                    event={event}
                                    isOwner={true}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="participated" className="mt-6">
                    {participatedEvents.length === 0 ? (
                        <EmptyState message="You haven't participated in any events yet." />
                    ) : (
                        <div className="space-y-4">
                            {participatedEvents.map((event) => (
                                <EventCard
                                    key={event._id}
                                    event={event}
                                />
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default UserEventsAndParticipation