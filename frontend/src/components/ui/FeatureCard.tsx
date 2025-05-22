import { Card, CardHeader, CardContent } from "./card";


// FeatureCard.tsx
type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function FeatureCard({ icon, title, description, children }: FeatureCardProps & { children?: React.ReactNode }) {
  return (
    <div>
        <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="items-center space-y-4">
            <div className="p-3 bg-blue-100 rounded-full flex gap-5">{icon}
              <h3 className="text-2xl font-semibold">{title}</h3>
            </div>
        </CardHeader>
        <CardContent className="text-center text-gray-600">
            {description}
            {children && <div className="mt-4">{children}</div>}
        </CardContent>
        </Card>
    </div>
  );
}