import Select from "react-select";
import { useField, useFormikContext } from "formik";
import {getLanguages} from "../utility/LangUtil"; 

const LanguageSelect = ({ name, placeholder }: { name: string; placeholder?: string }) => {

  const { setFieldValue } = useFormikContext();
  const [field, meta] = useField(name);

  const options = getLanguages().map(o => ({
    id: o.id,
    name: o.name
  }));

  return (
    <div>
      <Select
        options={options}
        placeholder={placeholder || "Select language…"}
        isClearable
        value={options.find(option => option.id === field.value) || null}
        onChange={(option) => setFieldValue(name, option ? option.name : "")}
      />
      {meta.touched && meta.error ? (
        <div className="error-message">{meta.error}</div>
      ) : null}
    </div>
  );
};

export default LanguageSelect;