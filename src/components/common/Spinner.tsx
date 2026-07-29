import "./spinner.css";
interface SpinnerProps {
  size?: number;
  fullScreen?: boolean;
  text?: string;
}
export default function Spinner({
  size = 36,
  fullScreen = false,
  text = "Loading..."
}: SpinnerProps) {
  const spinner = (
    <div className="spinner-wrapper">
      <div
        className="spinner"
        style={{width: size,height: size}}
      />
      {text && <p>{text}</p>}
    </div>
  );
  if (fullScreen) {
    return (
      <div className="spinner-overlay">
        {spinner}
      </div>
    );
  }
  return spinner;
}