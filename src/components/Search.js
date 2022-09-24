import TextField from "@mui/material/TextField";
const Search = (props) => {
  return (
    <TextField
      label="Search"
      helperText=" "
      id="demo-helper-text-aligned-no-helper"
      placeholder="Search By Name or Email"
      fullWidth={false}
      onChange={props.on_search}
    />
  );
};

export default Search;
