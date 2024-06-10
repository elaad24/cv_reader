interface title {
  text: string;
}

const Title = ({ text }: title) => {
  return (
    <div className="w-full ">
      <div className="text-3xl" style={{ textDecoration: "capitalize" }}>
        {text}
      </div>
    </div>
  );
};

export default Title;
