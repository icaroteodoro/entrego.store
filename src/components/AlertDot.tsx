export default function AlertDot(props:React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="relative">
      <span className="absolute translate-[-50%] top-0 right-0 h-3 w-3 bg-green-500 rounded-full animate-ping"></span>
      <span className="absolute translate-[-50%] top-0 right-0 h-3 w-3 bg-green-500 rounded-full"></span>
    </div>
  );
}
