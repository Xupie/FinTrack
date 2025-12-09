import { useTheme } from 'next-themes';
import styles from './input.module.css';

type InputWithIconProps = {
    name: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    icon: string; // /public folder
};

//TODO: requirements for password/email
export default function InputWithIcon({
    name,
    type = "text",
    placeholder,
    icon,
    required,
}: InputWithIconProps) {
    const { resolvedTheme } = useTheme();
    return (
        <input
            name={name}
            type={type}
            required={required}
            placeholder={placeholder}
            className={`
                ${styles['basic-input']}
                bg-no-repeat
                bg-position-[left_10px_center]
                bg-size-[20px_20px]`}
            style={{
                backgroundImage: `url(${resolvedTheme === "dark" ? `${icon}` : `${icon}-white`})`,
                paddingLeft: "2.5rem",
            }}
        />
    );
}