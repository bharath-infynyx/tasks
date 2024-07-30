import { inputProps } from "@/../../app/types";
import styles from "../../ui/dashboard/navbar/navbar.module.css";


const Input = ({ name, type, placeholder, value }: inputProps) => {
  return (
    <div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        className={styles.search}
      />
    </div>
  );
};

export default Input;
