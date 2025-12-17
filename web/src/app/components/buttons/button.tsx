import styles from "./button.module.css";

export const buttonSizes = ["xs", "sm", "md", "lg", "xl"] as const;
type buttonSize = (typeof buttonSizes)[number];

export const buttonType = ["primary", "outlined", "cancel", "secondary", "login"] as const;
type buttonType = (typeof buttonType)[number];

type buttonProps = {
  size: buttonSize;
  disabled?: boolean;
  rounded?: boolean;
  fullWidth?: boolean
  type: buttonType;
  onClick?: () => void;
  text: string;
};

const sizeStyles: Record<buttonSize, string> = {
  xs: "height:28px; fontSize:12px; paddingLeft:8px; paddingRight:8px;",
  sm: "height:36px; fontSize:14px; paddingLeft:16px; paddingRight:16px;",
  md: "height:40px; fontSize:14px; paddingLeft:20px; paddingRight:20px;",
  lg: "height:48px; fontSize:16px; paddingLeft:20px; paddingRight:20px;",
  xl: "height:56px; fontSize:16px; paddingLeft:28px; paddingRight:28px;",
};

export default function Button({
  size,
  disabled = false,
  rounded = true,
  type,
  fullWidth,
  onClick,
  text,
}: buttonProps) {
  const opacity = disabled ? 0.5 : 1;

  return (
    <button
      type="button"
      className={`${styles[`btn`]} ${styles[`btn-${type}`]} ${rounded ? "rounded-lg" : ""}`}
      style={{
        opacity,
        cursor: disabled ? "not-allowed" : "pointer",
        width: fullWidth ? "100%" : "auto",
        ...Object.fromEntries(
          sizeStyles[size]
            .split(";")
            .filter(Boolean)
            .map((rule) => {
              const [key, value] = rule.split(":");
              return [key.trim(), value.trim()];
            }),
        ),
      }}
      disabled={disabled}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
