import { useEffect, useState } from "react";
import Input from "./common/Input";

const Form = () => {
  const [formState, setFormState] = useState({});
  const [parseData, setParseData] = useState({
    name: null,
    date_of_birth: null,
    location: null,
    phone_number: null,
    frontEnd_Technologies: null,
    backEnd_Technologies: null,
    summery: null,
    email: null,
    specking_language: null,
  });

  return (
    <>
      <Input
        label={"full name"}
        placeHolder={"full name"}
        onChange={setFormState}
        id={"full_name"}
        defaultValue={parseData.name}
      />
      <Input
        label={"Date of birth"}
        placeHolder={"Date of birth"}
        onChange={setFormState}
        id={"Date_of_birth"}
        defaultValue={parseData.date_of_birth}
      />
      <Input
        label={"Where are you from?"}
        onChange={setFormState}
        id={"country"}
        defaultValue={parseData.location}
      />
      <Input
        label={"What is your Phone number"}
        onChange={setFormState}
        id={"phone_number"}
        inputType="tel"
        defaultValue={parseData.phone_number}
      />
      <Input
        label={"Upload your CV here"}
        onChange={setFormState}
        id={"cv"}
        inputType="file"
        setParseData={setParseData}
      />
    </>
  );
};

export default Form;
