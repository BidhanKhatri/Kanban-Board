
import { FiPlus } from "react-icons/fi";

const AddButton = (props: any) => {
  const { addColumsData } = props;

  return (
    <button
      className="
  text-white px-10 py-2 rounded-md bg-neutral-500 tracking-widest hover:ring-2 hover:ring-neutral-500 transition-all duration-500 
   flex items-center gap-2"
      onClick={addColumsData}
    >
      <FiPlus /> Add Colums
    </button>
  );
};

export default AddButton;
