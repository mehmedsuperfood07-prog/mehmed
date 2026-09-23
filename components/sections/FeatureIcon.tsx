import {
  BadgeCheck,
  ClipboardList,
  Clock,
  Droplets,
  Factory,
  FileText,
  GlassWater,
  Handshake,
  Heart,
  Lightbulb,
  Package,
  Palette,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Wheat,
  type LucideIcon,
} from "lucide-react";

// Section content stores the icon as a single emoji (what the admin types
// into the icon field). Emojis render in their own multi-color palette, so
// they're mapped to single-color line icons that inherit the brand color.
// Digit keycaps (1️⃣ 2️⃣ ...) become a plain number for numbered steps.
const ICONS: Record<string, LucideIcon> = {
  "🧼": Sparkles,
  "🌾": Wheat,
  "🚚": Truck,
  "🥤": GlassWater,
  "🏭": Factory,
  "📦": Package,
  "🕒": Clock,
  "🤝": Handshake,
  "⚙": Settings,
  "🌟": Star,
  "💧": Droplets,
  "❤": Heart,
  "💡": Lightbulb,
  "🛡": ShieldCheck,
  "🔍": Search,
  "📋": ClipboardList,
  "🎨": Palette,
  "✅": BadgeCheck,
  "📝": FileText,
};

export function isNumberIcon(icon?: string) {
  return !!icon && /^\d/.test(icon);
}

export function FeatureIcon({ icon, className = "h-6 w-6" }: { icon?: string; className?: string }) {
  if (!icon) return null;

  if (isNumberIcon(icon)) {
    return <span className="text-xl font-medium leading-none">{icon.replace(/\D/g, "")}</span>;
  }

  const Icon = ICONS[icon.replace(/️/g, "")] ?? BadgeCheck;
  return <Icon className={className} strokeWidth={1.75} aria-hidden="true" />;
}
