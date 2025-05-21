import { Card, CardHeader, CardContent } from "./card";


// FeatureCard.tsx
type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div>
        <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="items-center space-y-4">
            <div className="p-3 bg-blue-100 rounded-full">{icon}</div>
            <h3 className="text-2xl font-semibold">{title}</h3>
        </CardHeader>
        <CardContent className="text-center text-gray-600">
            {description}
        </CardContent>
        </Card>
    </div>
  );
}