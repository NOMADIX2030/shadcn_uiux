interface PlaceholderImageProps {
  width: number;
  height: number;
  text?: string;
  className?: string;
}

export function PlaceholderImage({ width, height, text = "Image", className = "" }: PlaceholderImageProps) {
  return (
    <div
      className={`bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold ${className}`}
      style={{ width, height }}
    >
      {text}
    </div>
  );
} 