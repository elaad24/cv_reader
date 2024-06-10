import axios from "axios";

interface input {
  label?: string;
  placeHolder?: string;
  border?: string;
  onChange: React.SetStateAction<object>;
  inputType?: inputType;
  id: string;
  capitalize?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setParseData?: React.SetStateAction<any>;
  defaultValue?: string | number | null;
}

type inputType = "text" | "number" | "color" | "date" | "tel" | "file";

const Input = ({
  label,
  placeHolder,
  border = "0.5px solid gray",
  inputType = "text",
  onChange,
  setParseData,
  id,
  defaultValue,
}: input) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const formData = new FormData();
    formData.append("file", file || "");

    const response = await axios.post(
      "http://localhost:3000/fileUpload/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data);
    setParseData(response.data);
  };

  const onChangeInput = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (inputType == "file") {
      console.log(e);
      handleFileChange(e);
    }
    onChange((prev: object) => {
      return { ...prev, [id]: e.target.value };
    });
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        padding: "0.5rem 1rem",
        alignItems: "flex-start",
      }}
    >
      {label && (
        <label
          style={{
            textTransform: "capitalize",
            fontWeight: 500,
            marginBottom: "8px",
            lineHeight: "20px",
            whiteSpace: "pre-wrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          htmlFor={id}
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={inputType}
        style={{
          border,
          width: "100%",
          backgroundColor: "white",
          color: "black",
          fontSize: "1rem",
          padding: "0 0.4rem",
        }}
        onChange={(e) => onChangeInput(id, e)}
        placeholder={placeHolder}
        defaultValue={defaultValue ?? defaultValue}
      ></input>
    </div>
  );
};

export default Input;
