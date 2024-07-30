import * as actions from "../../actions";
import Button from "../button/Button";
import Form from "../form/Form";
import Input from "../input/Input";
import styles from "./navbar.module.css";


const AddTodo = () => {
  return (
    <div>
      <Form action={actions.createTodo}>
        <div >
          <Input name="input" type="text" placeholder="Add Note Here..." />
          <Button type="submit" text="Add" bgColor="bg-blue-600" />
        </div>
      </Form>
    </div>
  );
};

export default AddTodo;
