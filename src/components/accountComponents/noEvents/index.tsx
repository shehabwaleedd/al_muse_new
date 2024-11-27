import { TransitionLink } from "@/components/transitionLink"

const NoEvents = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
            <p className="text-muted-foreground">
                It looks like you don't have any events yet. <br />
                Click the button below to create your first event.
            </p>
            <TransitionLink href="/account/events/createEvent" label="Create Event" />
        </div>
    )
}

export default NoEvents