import CTAButton from "@/components/ctaButton"

const NoEvents = () => {
    return (
        <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
            <p className="text-muted-foreground">
                It looks like you don&apos;t have any events yet. <br />
                Click the button below to create your first event.
            </p>
            <CTAButton text="Create Event" href="/account/events/createEvent" backgroundColor="var(--accent-color)" textColor="var(--title-color)" />
        </div>
    )
}

export default NoEvents