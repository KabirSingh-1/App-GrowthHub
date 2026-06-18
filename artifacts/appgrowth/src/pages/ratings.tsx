import { AppLayout } from "@/components/layout/app-layout";
import { useListApps, useListReviews, useReplyToReview } from "@/lib/mock-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star, MessageCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function Ratings() {
  const { data: apps, isLoading: appsLoading } = useListApps();
  // Simplified for demo: fetch reviews for the first app
  const firstAppId = apps?.[0]?.id;
  const { data: reviews, isLoading: reviewsLoading, refetch } = useListReviews(firstAppId || 0, { query: { enabled: !!firstAppId } });
  
  return (
    <AppLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-foreground">Ratings & Reviews</h1>
          <p className="text-lg text-muted-foreground mt-2 font-medium">Engage with your users and improve your app store ranking.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-4">
            <h3 className="font-bold text-lg">Apps</h3>
            {appsLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-12 rounded-xl" />
                <Skeleton className="h-12 rounded-xl" />
              </div>
            ) : Array.isArray(apps) && apps.length > 0 ? (
              <div className="space-y-2">
                {apps.map(app => (
                  <div key={app.id} className={`p-3 rounded-xl cursor-pointer font-bold transition-all ${app.id === firstAppId ? 'bg-primary text-primary-foreground shadow-sm' : 'bg-card text-foreground border border-border hover:bg-muted'}`}>
                    {app.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No apps found.</p>
            )}
          </div>
          
          <div className="md:col-span-3 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg">Reviews</h3>
              <div className="flex gap-2">
                <Badge variant="outline" className="rounded-lg">All</Badge>
                <Badge variant="outline" className="rounded-lg opacity-50">Unreplied</Badge>
                <Badge variant="outline" className="rounded-lg opacity-50">Negative</Badge>
              </div>
            </div>

            {reviewsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-40 rounded-2xl" />)}
              </div>
            ) : Array.isArray(reviews) && reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map(review => (
                  <ReviewCard key={review.id} review={review} appId={firstAppId!} onReply={() => refetch()} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-card rounded-2xl border border-dashed border-border">
                <p className="text-muted-foreground font-medium">Select an app to view reviews, or no reviews exist.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ReviewCard({ review, appId, onReply }: any) {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const replyMutation = useReplyToReview();

  const handleReply = () => {
    if (!replyText.trim()) return;
    replyMutation.mutate(
      { appId, reviewId: review.id, data: { replyText } },
      { onSuccess: () => { setIsReplying(false); onReply(); } }
    );
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border/50 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-black text-lg">{review.author}</span>
            <span className="text-xs text-muted-foreground font-medium">{new Date(review.date).toLocaleDateString()}</span>
            {review.sentiment === 'positive' && <Badge className="bg-accent text-accent-foreground border-0">Positive</Badge>}
            {review.sentiment === 'negative' && <Badge className="bg-destructive text-destructive-foreground border-0">Negative</Badge>}
          </div>
          <div className="flex text-amber-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-muted'}`} />
            ))}
          </div>
        </div>
        {review.replied ? (
          <Badge variant="outline" className="text-primary border-primary bg-primary/5 rounded-lg flex items-center gap-1">
            <CheckCircle className="h-3 w-3" /> Replied
          </Badge>
        ) : (
          <Button variant="outline" size="sm" className="rounded-xl font-bold" onClick={() => setIsReplying(!isReplying)}>
            <MessageCircle className="mr-2 h-4 w-4" /> Reply
          </Button>
        )}
      </div>
      <p className="text-foreground">{review.body}</p>
      
      {review.replied && review.replyText && (
        <div className="mt-4 p-4 bg-muted/30 rounded-xl border border-border/50 ml-6 relative before:content-[''] before:absolute before:left-[-12px] before:top-4 before:w-3 before:h-px before:bg-border/50">
          <div className="font-bold text-sm mb-1 text-primary">Developer Response</div>
          <p className="text-sm text-foreground">{review.replyText}</p>
        </div>
      )}

      {isReplying && !review.replied && (
        <div className="mt-4 pt-4 border-t border-border">
          <Textarea 
            placeholder="Write your response..." 
            className="rounded-xl mb-3 resize-none bg-muted/30"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" className="rounded-xl font-bold" onClick={() => setIsReplying(false)}>Cancel</Button>
            <Button className="rounded-xl font-bold" onClick={handleReply} disabled={replyMutation.isPending}>
              {replyMutation.isPending ? 'Sending...' : 'Send Reply'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
