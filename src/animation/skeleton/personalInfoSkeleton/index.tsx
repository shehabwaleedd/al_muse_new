import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function PersonalInfoSkeleton() {
    return (
        <Card className="overflow-hidden border-none shadow-lg bg-gradient-to-b from-white to-gray-50/50">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-[120px]" />
                        <Skeleton className="h-4 w-[100px]" />
                    </div>
                    <Skeleton className="h-8 w-[100px]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 9 }).map((_, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-white/50">
                            <Skeleton className="h-4 w-4 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-[60px]" />
                                <Skeleton className="h-4 w-[120px]" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t">
                    <Skeleton className="h-3 w-[150px]" />
                </div>
            </CardContent>
        </Card>
    )
}