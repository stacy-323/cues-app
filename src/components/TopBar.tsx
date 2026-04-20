import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

type Props = {
  title?: string;
  back?: boolean;
  right?: ReactNode;
  onBack?: () => void;
};

export const TopBar = ({ title, back, right, onBack }: Props) => {
  const navigate = useNavigate();
  return (
    <header className="safe-top px-5 pb-3 flex items-center justify-between pt-[30px]">
      <div className="w-10 pt-[30px]">
        {back && (
          <button
            aria-label="Go back"
            onClick={() => (onBack ? onBack() : navigate(-1))}
            className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-foreground/80 hover:bg-secondary tap-shrink pt-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>
      {title && <h2 className="font-display text-lg font-semibold pt-[30px]">{title}</h2>}
      <div className="w-10 flex justify-end">{right}</div>
    </header>
  );
};
