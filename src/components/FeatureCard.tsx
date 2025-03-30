
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Layout, Palette, Sparkles, Settings, Zap, Code,
  User, Bell, BarChart, Lock, Search, Share
} from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon }) => {
  const renderIcon = () => {
    switch (icon) {
      case "layout":
        return <Layout className="h-10 w-10 text-primary" />;
      case "palette":
        return <Palette className="h-10 w-10 text-primary" />;
      case "sparkles":
        return <Sparkles className="h-10 w-10 text-primary" />;
      case "settings":
        return <Settings className="h-10 w-10 text-primary" />;
      case "zap":
        return <Zap className="h-10 w-10 text-primary" />;
      case "code":
        return <Code className="h-10 w-10 text-primary" />;
      case "user":
        return <User className="h-10 w-10 text-primary" />;
      case "bell":
        return <Bell className="h-10 w-10 text-primary" />;
      case "chart":
        return <BarChart className="h-10 w-10 text-primary" />;
      case "lock":
        return <Lock className="h-10 w-10 text-primary" />;
      case "search":
        return <Search className="h-10 w-10 text-primary" />;
      case "share":
        return <Share className="h-10 w-10 text-primary" />;
      default:
        return <Sparkles className="h-10 w-10 text-primary" />;
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="mb-4">
          {renderIcon()}
        </div>
        <h3 className="text-xl font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
